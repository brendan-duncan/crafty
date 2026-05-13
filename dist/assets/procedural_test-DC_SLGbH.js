var ne=Object.defineProperty;var te=(r,a,e)=>a in r?ne(r,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[a]=e;var t=(r,a,e)=>te(r,typeof a!="symbol"?a+"":a,e);import{R as oe,M as b,C as re,c,d as o}from"./mesh-BZCnqQH3.js";import{a as ae}from"./shadow-BSGgysNj.js";import{F as ie,D as se}from"./directional_shadow_pass-8Ov0ABAm.js";const le=`// Forward procedural shader — custom material demo
// Uses the forward renderer's lighting infrastructure (groups 0,1,3)
// with a procedurally generated animated pattern in the fragment shader.

const PI: f32 = 3.14159265358979323846;

const MAX_POINT_LIGHTS: u32 = 8u;
const MAX_SPOT_LIGHTS: u32 = 4u;

struct CameraUniforms {
  view        : mat4x4<f32>,
  proj        : mat4x4<f32>,
  viewProj    : mat4x4<f32>,
  invViewProj : mat4x4<f32>,
  position    : vec3<f32>,
  near        : f32,
  far         : f32,
}

struct ModelUniforms {
  model        : mat4x4<f32>,
  normalMatrix : mat4x4<f32>,
}

struct ProceduralUniforms {
  baseColor   : vec4<f32>,
  accentColor : vec4<f32>,
  patternScale: f32,
  time        : f32,
  animSpeed   : f32,
  edgeWidth   : f32,
}

struct PointLight {
  position    : vec3<f32>,
  range       : f32,
  color       : vec3<f32>,
  intensity   : f32,
  castShadows : u32,
  _pad        : vec3<u32>,
}

struct SpotLight {
  position        : vec3<f32>,
  range           : f32,
  direction       : vec3<f32>,
  innerAngle      : f32,
  color           : vec3<f32>,
  outerAngle      : f32,
  intensity       : f32,
  castShadows     : u32,
  shadowMapIndex  : u32,
  _pad            : u32,
  lightViewProj   : mat4x4<f32>,
}

struct DirectionalLight {
  direction       : vec3<f32>,
  intensity       : f32,
  color           : vec3<f32>,
  castShadows     : u32,
  shadowMapIndex  : u32,
  _pad            : vec3<u32>,
  lightViewProj   : mat4x4<f32>,
}

struct LightingUniforms {
  numPointLights : u32,
  numSpotLights  : u32,
  _pad           : vec2<u32>,
}

@group(0) @binding(0) var<uniform> camera : CameraUniforms;
@group(1) @binding(0) var<uniform> model  : ModelUniforms;
@group(2) @binding(0) var<uniform> params : ProceduralUniforms;
@group(3) @binding(0) var<uniform> lighting            : LightingUniforms;
@group(3) @binding(1) var<uniform> directionalLight    : DirectionalLight;
@group(3) @binding(2) var<storage, read> pointLights   : array<PointLight>;
@group(3) @binding(3) var<storage, read> spotLights    : array<SpotLight>;
@group(3) @binding(4) var shadowMapArray     : texture_depth_2d_array;
@group(3) @binding(5) var shadowSampler      : sampler_comparison;
@group(3) @binding(6) var irradiance_cube    : texture_cube<f32>;
@group(3) @binding(7) var prefilter_cube     : texture_cube<f32>;
@group(3) @binding(8) var brdf_lut           : texture_2d<f32>;
@group(3) @binding(9) var ibl_sampler        : sampler;
@group(3) @binding(10) var pointShadowCubeArray : texture_depth_cube_array;

const IBL_MIP_LEVELS: f32 = 5.0;

struct VertexInput {
  @location(0) position : vec3<f32>,
  @location(1) normal   : vec3<f32>,
  @location(2) uv       : vec2<f32>,
  @location(3) tangent  : vec4<f32>,
}

struct VertexOutput {
  @builtin(position) clip_pos   : vec4<f32>,
  @location(0)       world_pos  : vec3<f32>,
  @location(1)       world_norm : vec3<f32>,
  @location(2)       uv         : vec2<f32>,
  @location(3)       world_tan  : vec4<f32>,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let world_pos  = model.model * vec4<f32>(vin.position, 1.0);
  let world_norm = normalize((model.normalMatrix * vec4<f32>(vin.normal, 0.0)).xyz);
  let world_tan  = normalize((model.normalMatrix * vec4<f32>(vin.tangent.xyz, 0.0)).xyz);

  var out: VertexOutput;
  out.clip_pos   = camera.viewProj * world_pos;
  out.world_pos  = world_pos.xyz;
  out.world_norm = world_norm;
  out.uv         = vin.uv;
  out.world_tan  = vec4<f32>(world_tan, vin.tangent.w);
  return out;
}

// PBR lighting functions

fn fresnel_schlick(cos_theta: f32, F0: vec3<f32>) -> vec3<f32> {
  return F0 + (vec3<f32>(1.0) - F0) * pow(max(1.0 - cos_theta, 0.0), 5.0);
}

fn fresnel_schlick_roughness(cos_theta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {
  let omr = vec3<f32>(1.0 - roughness);
  return F0 + (max(omr, F0) - F0) * pow(max(1.0 - cos_theta, 0.0), 5.0);
}

fn distribution_ggx(N: vec3<f32>, H: vec3<f32>, roughness: f32) -> f32 {
  let a = roughness * roughness;
  let a2 = a * a;
  let NdotH = max(dot(N, H), 0.0);
  let NdotH2 = NdotH * NdotH;
  let denom = NdotH2 * (a2 - 1.0) + 1.0;
  return a2 / (PI * denom * denom);
}

fn geometry_schlick_ggx(NdotV: f32, roughness: f32) -> f32 {
  let r = roughness + 1.0;
  let k = (r * r) / 8.0;
  return NdotV / (NdotV * (1.0 - k) + k);
}

fn geometry_smith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> f32 {
  let NdotV = max(dot(N, V), 0.0);
  let NdotL = max(dot(N, L), 0.0);
  let ggx1 = geometry_schlick_ggx(NdotV, roughness);
  let ggx2 = geometry_schlick_ggx(NdotL, roughness);
  return ggx1 * ggx2;
}

fn sample_shadow(world_pos: vec3<f32>) -> f32 {
  if (directionalLight.castShadows == 0u) { return 1.0; }
  let light_space = directionalLight.lightViewProj * vec4<f32>(world_pos, 1.0);
  var shadow_coord = light_space.xyz / light_space.w;
  shadow_coord = vec3<f32>(shadow_coord.xy * 0.5 + 0.5, shadow_coord.z);
  shadow_coord.y = 1.0 - shadow_coord.y;
  if (shadow_coord.x < 0.0 || shadow_coord.x > 1.0 ||
      shadow_coord.y < 0.0 || shadow_coord.y > 1.0 ||
      shadow_coord.z < 0.0 || shadow_coord.z > 1.0) { return 1.0; }
  let bias = 0.002;
  return textureSampleCompareLevel(shadowMapArray, shadowSampler, shadow_coord.xy, i32(directionalLight.shadowMapIndex), shadow_coord.z - bias);
}

fn sample_spot_shadow(world_pos: vec3<f32>, light: SpotLight) -> f32 {
  if (light.castShadows == 0u) { return 1.0; }
  let light_space = light.lightViewProj * vec4<f32>(world_pos, 1.0);
  var shadow_coord = light_space.xyz / light_space.w;
  shadow_coord = vec3<f32>(shadow_coord.xy * 0.5 + 0.5, shadow_coord.z);
  shadow_coord.y = 1.0 - shadow_coord.y;
  if (shadow_coord.x < 0.0 || shadow_coord.x > 1.0 ||
      shadow_coord.y < 0.0 || shadow_coord.y > 1.0 ||
      shadow_coord.z < 0.0 || shadow_coord.z > 1.0) { return 1.0; }
  let bias = 0.002;
  return textureSampleCompareLevel(shadowMapArray, shadowSampler, shadow_coord.xy, i32(light.shadowMapIndex), shadow_coord.z - bias);
}

fn sample_point_shadow(world_pos: vec3<f32>, light: PointLight, slot: i32) -> f32 {
  if (light.castShadows == 0u) { return 1.0; }
  let to_frag = world_pos - light.position;
  let dist = length(to_frag);
  if (dist >= light.range) { return 1.0; }
  let dir = to_frag / dist;
  return textureSampleCompareLevel(pointShadowCubeArray, shadowSampler, dir, slot, dist / light.range - 0.005);
}

fn calculate_pbr_lighting(
  albedo: vec3<f32>, N: vec3<f32>, V: vec3<f32>,
  world_pos: vec3<f32>, roughness: f32, metallic: f32,
) -> vec3<f32> {
  let F0 = mix(vec3<f32>(0.04), albedo, metallic);
  let NdotV = max(dot(N, V), 0.001);
  var Lo = vec3<f32>(0.0);

  // Directional light
  {
    let L = normalize(-directionalLight.direction);
    let H = normalize(V + L);
    let NdotL = max(dot(N, L), 0.0);
    if (NdotL > 0.0) {
      let radiance = directionalLight.color * directionalLight.intensity;
      let D = distribution_ggx(N, H, roughness);
      let G = geometry_smith(N, V, L, roughness);
      let F = fresnel_schlick(max(dot(H, V), 0.0), F0);
      let specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);
      let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);
      let diffuse = kD * albedo / PI;
      let shadow = sample_shadow(world_pos);
      Lo += (diffuse + specular) * radiance * NdotL * shadow;
    }
  }

  // Point lights
  for (var i = 0u; i < lighting.numPointLights && i < MAX_POINT_LIGHTS; i++) {
    let light = pointLights[i];
    let L = light.position - world_pos;
    let distance = length(L);
    let L_norm = L / distance;
    if (distance < light.range) {
      let H = normalize(V + L_norm);
      let NdotL = max(dot(N, L_norm), 0.0);
      if (NdotL > 0.0) {
        let atten = max(1.0 - (distance / light.range), 0.0);
        let radiance = light.color * light.intensity * atten * atten;
        let D = distribution_ggx(N, H, roughness);
        let G = geometry_smith(N, V, L_norm, roughness);
        let F = fresnel_schlick(max(dot(H, V), 0.0), F0);
        let specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);
        let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);
        let diffuse = kD * albedo / PI;
        let shadow = sample_point_shadow(world_pos, light, i32(i));
        Lo += (diffuse + specular) * radiance * NdotL * shadow;
      }
    }
  }

  // Spot lights
  for (var i = 0u; i < lighting.numSpotLights && i < MAX_SPOT_LIGHTS; i++) {
    let light = spotLights[i];
    let L = light.position - world_pos;
    let distance = length(L);
    let L_norm = L / distance;
    if (distance < light.range) {
      let spot_dir = normalize(-light.direction);
      let theta = dot(L_norm, spot_dir);
      let inner = cos(light.innerAngle * 0.0174533);
      let outer = cos(light.outerAngle * 0.0174533);
      let intens = clamp((theta - outer) / (inner - outer), 0.0, 1.0);
      if (intens > 0.0) {
        let H = normalize(V + L_norm);
        let NdotL = max(dot(N, L_norm), 0.0);
        if (NdotL > 0.0) {
          let atten = max(1.0 - (distance / light.range), 0.0);
          let radiance = light.color * light.intensity * atten * atten * intens;
          let D = distribution_ggx(N, H, roughness);
          let G = geometry_smith(N, V, L_norm, roughness);
          let F = fresnel_schlick(max(dot(H, V), 0.0), F0);
          let specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);
          let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);
          let diffuse = kD * albedo / PI;
          let shadow = sample_spot_shadow(world_pos, light);
          Lo += (diffuse + specular) * radiance * NdotL * shadow;
        }
      }
    }
  }

  // IBL ambient
  let kS_ibl = fresnel_schlick_roughness(NdotV, F0, roughness);
  let kD_ibl = (vec3<f32>(1.0) - kS_ibl) * (1.0 - metallic);
  let irradiance = textureSampleLevel(irradiance_cube, ibl_sampler, N, 0.0).rgb;
  let diffuse_ibl = irradiance * albedo * kD_ibl;
  let R = reflect(-V, N);
  let prefiltered = textureSampleLevel(prefilter_cube, ibl_sampler, R, roughness * (IBL_MIP_LEVELS - 1.0)).rgb;
  let brdf = textureSampleLevel(brdf_lut, ibl_sampler, vec2<f32>(NdotV, roughness), 0.0).rg;
  let specular_ibl = prefiltered * (kS_ibl * brdf.x + brdf.y);
  let ambient = (diffuse_ibl + specular_ibl) * 0.5;

  return Lo + ambient;
}

// Procedural pattern functions

fn hash2(p: vec2<f32>) -> vec2<f32> {
  let h = dot(p, vec2<f32>(127.1, 311.7));
  return fract(sin(vec2<f32>(h, h + 12.989)) * 43758.5453);
}

fn noise2(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash2(i).x;
  let b = hash2(i + vec2<f32>(1.0, 0.0)).x;
  let c = hash2(i + vec2<f32>(0.0, 1.0)).x;
  let d = hash2(i + vec2<f32>(1.0, 1.0)).x;
  return 2.0 * (a + (b - a) * u.x + (c - a) * u.y + (a - b - c + d) * u.x * u.y) - 1.0;
}

fn fbm(p: vec2<f32>) -> f32 {
  var val = 0.0;
  var amp = 0.5;
  var freq = 1.0;
  for (var i = 0u; i < 4u; i++) {
    val += amp * noise2(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

fn procedural_pattern(pos: vec3<f32>, uv: vec2<f32>) -> vec3<f32> {
  let worldUV = pos.xz * params.patternScale;
  let time = params.time * params.animSpeed;

  // Animated grid glow
  let gridUV = fract(worldUV) - 0.5;
  let gridDist = max(abs(gridUV.x), abs(gridUV.y));
  let edge = 1.0 - smoothstep(0.0, params.edgeWidth, gridDist);
  let gridGlow = sin(edge * PI * 4.0 - time * 2.0) * 0.5 + 0.5;

  // Value noise overlay
  let n = fbm(worldUV + time * 0.1);
  let noiseVal = n * 0.5 + 0.5;

  // Sweeping bands
  let bands = sin(pos.x * 2.0 + pos.z * 1.5 + time) * 0.5 + 0.5;

  let baseMix = clamp(noiseVal * 0.6 + bands * 0.4, 0.0, 1.0);
  let base = mix(params.baseColor, params.accentColor, baseMix);

  // Glow
  let glowColor = vec4<f32>(1.0, 0.6, 0.1, 1.0);
  let glow = gridGlow * (sin(time * 1.5) * 0.3 + 0.7);

  return base.rgb + glow * glowColor.rgb;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let albedo = procedural_pattern(in.world_pos, in.uv);

  let V = normalize(camera.position - in.world_pos);
  let N = normalize(in.world_norm);

  let roughness = 0.35;
  let metallic = 0.0;
  let lit = calculate_pbr_lighting(albedo, N, V, in.world_pos, roughness, metallic);

  // subtle emissive boost
  let emissive = albedo * 0.08;

  return vec4<f32>(lit + emissive, 1.0);
}
`,H=256,g=class g extends ae{constructor(){super(...arguments);t(this,"shaderId","procedural");t(this,"baseColor",new Float32Array([.15,.35,.75,1]));t(this,"accentColor",new Float32Array([1,.3,.1,1]));t(this,"patternScale",2);t(this,"time",0);t(this,"animSpeed",1);t(this,"edgeWidth",.04);t(this,"_device",null);t(this,"_buffer",null);t(this,"_bindGroup",null);t(this,"_dirty",!0);t(this,"_data",new Float32Array(H/4))}getShaderCode(e){return le}getBindGroupLayout(e){let n=g._bglCache.get(e);return n||(n=e.createBindGroupLayout({label:"ProceduralMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),g._bglCache.set(e,n)),n}getBindGroup(e){return(!this._buffer||this._device!==e)&&(this._device=e,this._buffer=e.createBuffer({label:"ProceduralMaterialUniforms",size:H,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._bindGroup=e.createBindGroup({label:"ProceduralMaterialBindGroup",layout:this.getBindGroupLayout(e),entries:[{binding:0,resource:{buffer:this._buffer}}]}),this._dirty=!0),this._bindGroup}update(e){if(!this._dirty||!this._buffer)return;const n=this._data;n.set(this.baseColor,0),n.set(this.accentColor,4),n[8]=this.patternScale,n[9]=this.time,n[10]=this.animSpeed,n[11]=this.edgeWidth,e.writeBuffer(this._buffer,0,n),this._dirty=!1}markDirty(){this._dirty=!0}destroy(){var e;(e=this._buffer)==null||e.destroy(),this._buffer=null,this._bindGroup=null}};t(g,"_bglCache",new WeakMap);let f=g;async function de(){const r=document.getElementById("canvas"),a=document.getElementById("fps");r.width=r.clientWidth,r.height=r.clientHeight;const e=await oe.create(r),{device:n}=e,T=b.createPlane(n,30,30),B=b.createCube(n,1.5),E=b.createSphere(n,.9,24,24),j=b.createCone(n,.8,1.6,20),s=new f;s.baseColor.set([.1,.3,.8,1]),s.accentColor.set([1,.4,.1,1]),s.patternScale=1.5;const l=new f;l.baseColor.set([.6,0,.4,1]),l.accentColor.set([0,1,.6,1]),l.patternScale=2.5,l.animSpeed=1.5;const d=new f;d.baseColor.set([0,.2,.2,1]),d.accentColor.set([1,.8,0,1]),d.patternScale=3,d.edgeWidth=.08;const y=2048,h=ie.create(e),S=n.createTexture({label:"DirShadowTex",size:{width:y,height:y},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC}),M=S.createView(),m=se.create(e,M),p=new c(0,4,12),u=new re(0,0,5,.002);u.attach(r);let i=0,P=performance.now(),x=0,_=0;async function N(){const V=performance.now(),L=(V-P)*.001;P=V,i+=L,x++,_+=L,_>=.5&&(a.textContent=`FPS: ${Math.round(x/_)}`,x=0,_=0),(e.canvas.width!==e.canvas.clientWidth||e.canvas.height!==e.canvas.clientHeight)&&(e.canvas.width=e.canvas.clientWidth,e.canvas.height=e.canvas.clientHeight,h.resize(n,e.width,e.height));const O={position:p,rotation:{x:0,y:0,z:0,w:1}};u.update(O,L);const R=Math.sin(u.yaw),W=Math.cos(u.yaw),Y=Math.sin(u.pitch),C=Math.cos(u.pitch),q=new c(-R*C,-Y,-W*C).normalize(),X=p.add(q),I=o.lookAt(p,X,new c(0,1,0)),Z=e.width/e.height,D=o.perspective(60*Math.PI/180,Z,.1,100),G=D.multiply(I),$=G.invert();h.updateCamera(e,I,D,G,$,p,.1,100);const k=new c(.4,-.7,-.5).normalize(),z=new c(0,1,0),J=z.sub(k.scale(25)),K=o.lookAt(J,z,new c(0,1,0)),F=o.orthographic(-12,12,-12,12,1,50).multiply(K),Q={direction:k,intensity:1.5,color:new c(1,.95,.9),castShadows:!0,lightViewProj:F,shadowMap:M},w=4,A=[{mesh:T,modelMatrix:o.translation(0,-.5,0),normalMatrix:o.identity(),material:s},{mesh:B,modelMatrix:o.translation(0,1.5,0).multiply(o.rotationY(i*40*Math.PI/180)),normalMatrix:o.identity(),material:l},{mesh:E,modelMatrix:o.translation(Math.sin(i*.6)*w,1.5,Math.cos(i*.6)*w).multiply(o.rotationY(i*60*Math.PI/180)),normalMatrix:o.identity(),material:d},{mesh:j,modelMatrix:o.translation(Math.sin(i*.6+Math.PI)*w,1.5,Math.cos(i*.6+Math.PI)*w),normalMatrix:o.identity(),material:s}];s.time=i,l.time=i,d.time=i,s.markDirty(),l.markDirty(),d.markDirty();const ee=A.map(U=>({mesh:U.mesh,modelMatrix:U.modelMatrix})),v=n.createCommandEncoder({label:"ProceduralDemoEncoder"});m.setDrawItems(ee),m.updateCamera(e,F),m.enabled&&m.execute(v,e),h.copyShadowMapToArray(v,S,0),h.updateLights(e,Q,[],[]),h.setDrawItems(A),h.execute(v,e),n.queue.submit([v.finish()]),requestAnimationFrame(N)}N()}de();
