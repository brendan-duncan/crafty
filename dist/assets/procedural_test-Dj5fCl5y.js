var er=Object.defineProperty;var nr=(o,a,r)=>a in o?er(o,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[a]=r;var n=(o,a,r)=>nr(o,typeof a!="symbol"?a+"":a,r);import{R as tr,d as b,C as or,e as ar,c,f as t}from"./shadow-CGnDmh2T.js";import{F as ir,D as sr}from"./directional_shadow_pass-Br3ShTsu.js";const lr=`// Forward procedural shader — custom material demo\r
// Uses the forward renderer's lighting infrastructure (groups 0,1,3)\r
// with a procedurally generated animated pattern in the fragment shader.\r
\r
const PI: f32 = 3.14159265358979323846;\r
\r
const MAX_POINT_LIGHTS: u32 = 8u;\r
const MAX_SPOT_LIGHTS: u32 = 4u;\r
\r
struct CameraUniforms {\r
  view        : mat4x4<f32>,\r
  proj        : mat4x4<f32>,\r
  viewProj    : mat4x4<f32>,\r
  invViewProj : mat4x4<f32>,\r
  position    : vec3<f32>,\r
  near        : f32,\r
  far         : f32,\r
}\r
\r
struct ModelUniforms {\r
  model        : mat4x4<f32>,\r
  normalMatrix : mat4x4<f32>,\r
}\r
\r
struct ProceduralUniforms {\r
  baseColor   : vec4<f32>,\r
  accentColor : vec4<f32>,\r
  patternScale: f32,\r
  time        : f32,\r
  animSpeed   : f32,\r
  edgeWidth   : f32,\r
}\r
\r
struct PointLight {\r
  position    : vec3<f32>,\r
  range       : f32,\r
  color       : vec3<f32>,\r
  intensity   : f32,\r
  castShadows : u32,\r
  _pad        : vec3<u32>,\r
}\r
\r
struct SpotLight {\r
  position        : vec3<f32>,\r
  range           : f32,\r
  direction       : vec3<f32>,\r
  innerAngle      : f32,\r
  color           : vec3<f32>,\r
  outerAngle      : f32,\r
  intensity       : f32,\r
  castShadows     : u32,\r
  shadowMapIndex  : u32,\r
  _pad            : u32,\r
  lightViewProj   : mat4x4<f32>,\r
}\r
\r
struct DirectionalLight {\r
  direction       : vec3<f32>,\r
  intensity       : f32,\r
  color           : vec3<f32>,\r
  castShadows     : u32,\r
  shadowMapIndex  : u32,\r
  _pad            : vec3<u32>,\r
  lightViewProj   : mat4x4<f32>,\r
}\r
\r
struct LightingUniforms {\r
  numPointLights : u32,\r
  numSpotLights  : u32,\r
  _pad           : vec2<u32>,\r
}\r
\r
@group(0) @binding(0) var<uniform> camera : CameraUniforms;\r
@group(1) @binding(0) var<uniform> model  : ModelUniforms;\r
@group(2) @binding(0) var<uniform> params : ProceduralUniforms;\r
@group(3) @binding(0) var<uniform> lighting            : LightingUniforms;\r
@group(3) @binding(1) var<uniform> directionalLight    : DirectionalLight;\r
@group(3) @binding(2) var<storage, read> pointLights   : array<PointLight>;\r
@group(3) @binding(3) var<storage, read> spotLights    : array<SpotLight>;\r
@group(3) @binding(4) var shadowMapArray     : texture_depth_2d_array;\r
@group(3) @binding(5) var shadowSampler      : sampler_comparison;\r
@group(3) @binding(6) var irradiance_cube    : texture_cube<f32>;\r
@group(3) @binding(7) var prefilter_cube     : texture_cube<f32>;\r
@group(3) @binding(8) var brdf_lut           : texture_2d<f32>;\r
@group(3) @binding(9) var ibl_sampler        : sampler;\r
@group(3) @binding(10) var pointShadowCubeArray : texture_depth_cube_array;\r
\r
const IBL_MIP_LEVELS: f32 = 5.0;\r
\r
struct VertexInput {\r
  @location(0) position : vec3<f32>,\r
  @location(1) normal   : vec3<f32>,\r
  @location(2) uv       : vec2<f32>,\r
  @location(3) tangent  : vec4<f32>,\r
}\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos   : vec4<f32>,\r
  @location(0)       world_pos  : vec3<f32>,\r
  @location(1)       world_norm : vec3<f32>,\r
  @location(2)       uv         : vec2<f32>,\r
  @location(3)       world_tan  : vec4<f32>,\r
}\r
\r
@vertex\r
fn vs_main(vin: VertexInput) -> VertexOutput {\r
  let world_pos  = model.model * vec4<f32>(vin.position, 1.0);\r
  let world_norm = normalize((model.normalMatrix * vec4<f32>(vin.normal, 0.0)).xyz);\r
  let world_tan  = normalize((model.normalMatrix * vec4<f32>(vin.tangent.xyz, 0.0)).xyz);\r
\r
  var out: VertexOutput;\r
  out.clip_pos   = camera.viewProj * world_pos;\r
  out.world_pos  = world_pos.xyz;\r
  out.world_norm = world_norm;\r
  out.uv         = vin.uv;\r
  out.world_tan  = vec4<f32>(world_tan, vin.tangent.w);\r
  return out;\r
}\r
\r
// PBR lighting functions\r
\r
fn fresnel_schlick(cos_theta: f32, F0: vec3<f32>) -> vec3<f32> {\r
  return F0 + (vec3<f32>(1.0) - F0) * pow(max(1.0 - cos_theta, 0.0), 5.0);\r
}\r
\r
fn fresnel_schlick_roughness(cos_theta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {\r
  let omr = vec3<f32>(1.0 - roughness);\r
  return F0 + (max(omr, F0) - F0) * pow(max(1.0 - cos_theta, 0.0), 5.0);\r
}\r
\r
fn distribution_ggx(N: vec3<f32>, H: vec3<f32>, roughness: f32) -> f32 {\r
  let a = roughness * roughness;\r
  let a2 = a * a;\r
  let NdotH = max(dot(N, H), 0.0);\r
  let NdotH2 = NdotH * NdotH;\r
  let denom = NdotH2 * (a2 - 1.0) + 1.0;\r
  return a2 / (PI * denom * denom);\r
}\r
\r
fn geometry_schlick_ggx(NdotV: f32, roughness: f32) -> f32 {\r
  let r = roughness + 1.0;\r
  let k = (r * r) / 8.0;\r
  return NdotV / (NdotV * (1.0 - k) + k);\r
}\r
\r
fn geometry_smith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> f32 {\r
  let NdotV = max(dot(N, V), 0.0);\r
  let NdotL = max(dot(N, L), 0.0);\r
  let ggx1 = geometry_schlick_ggx(NdotV, roughness);\r
  let ggx2 = geometry_schlick_ggx(NdotL, roughness);\r
  return ggx1 * ggx2;\r
}\r
\r
fn sample_shadow(world_pos: vec3<f32>) -> f32 {\r
  if (directionalLight.castShadows == 0u) { return 1.0; }\r
  let light_space = directionalLight.lightViewProj * vec4<f32>(world_pos, 1.0);\r
  var shadow_coord = light_space.xyz / light_space.w;\r
  shadow_coord = vec3<f32>(shadow_coord.xy * 0.5 + 0.5, shadow_coord.z);\r
  shadow_coord.y = 1.0 - shadow_coord.y;\r
  if (shadow_coord.x < 0.0 || shadow_coord.x > 1.0 ||\r
      shadow_coord.y < 0.0 || shadow_coord.y > 1.0 ||\r
      shadow_coord.z < 0.0 || shadow_coord.z > 1.0) { return 1.0; }\r
  let bias = 0.002;\r
  return textureSampleCompareLevel(shadowMapArray, shadowSampler, shadow_coord.xy, i32(directionalLight.shadowMapIndex), shadow_coord.z - bias);\r
}\r
\r
fn sample_spot_shadow(world_pos: vec3<f32>, light: SpotLight) -> f32 {\r
  if (light.castShadows == 0u) { return 1.0; }\r
  let light_space = light.lightViewProj * vec4<f32>(world_pos, 1.0);\r
  var shadow_coord = light_space.xyz / light_space.w;\r
  shadow_coord = vec3<f32>(shadow_coord.xy * 0.5 + 0.5, shadow_coord.z);\r
  shadow_coord.y = 1.0 - shadow_coord.y;\r
  if (shadow_coord.x < 0.0 || shadow_coord.x > 1.0 ||\r
      shadow_coord.y < 0.0 || shadow_coord.y > 1.0 ||\r
      shadow_coord.z < 0.0 || shadow_coord.z > 1.0) { return 1.0; }\r
  let bias = 0.002;\r
  return textureSampleCompareLevel(shadowMapArray, shadowSampler, shadow_coord.xy, i32(light.shadowMapIndex), shadow_coord.z - bias);\r
}\r
\r
fn sample_point_shadow(world_pos: vec3<f32>, light: PointLight, slot: i32) -> f32 {\r
  if (light.castShadows == 0u) { return 1.0; }\r
  let to_frag = world_pos - light.position;\r
  let dist = length(to_frag);\r
  if (dist >= light.range) { return 1.0; }\r
  let dir = to_frag / dist;\r
  return textureSampleCompareLevel(pointShadowCubeArray, shadowSampler, dir, slot, dist / light.range - 0.005);\r
}\r
\r
fn calculate_pbr_lighting(\r
  albedo: vec3<f32>, N: vec3<f32>, V: vec3<f32>,\r
  world_pos: vec3<f32>, roughness: f32, metallic: f32,\r
) -> vec3<f32> {\r
  let F0 = mix(vec3<f32>(0.04), albedo, metallic);\r
  let NdotV = max(dot(N, V), 0.001);\r
  var Lo = vec3<f32>(0.0);\r
\r
  // Directional light\r
  {\r
    let L = normalize(-directionalLight.direction);\r
    let H = normalize(V + L);\r
    let NdotL = max(dot(N, L), 0.0);\r
    if (NdotL > 0.0) {\r
      let radiance = directionalLight.color * directionalLight.intensity;\r
      let D = distribution_ggx(N, H, roughness);\r
      let G = geometry_smith(N, V, L, roughness);\r
      let F = fresnel_schlick(max(dot(H, V), 0.0), F0);\r
      let specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);\r
      let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);\r
      let diffuse = kD * albedo / PI;\r
      let shadow = sample_shadow(world_pos);\r
      Lo += (diffuse + specular) * radiance * NdotL * shadow;\r
    }\r
  }\r
\r
  // Point lights\r
  for (var i = 0u; i < lighting.numPointLights && i < MAX_POINT_LIGHTS; i++) {\r
    let light = pointLights[i];\r
    let L = light.position - world_pos;\r
    let distance = length(L);\r
    let L_norm = L / distance;\r
    if (distance < light.range) {\r
      let H = normalize(V + L_norm);\r
      let NdotL = max(dot(N, L_norm), 0.0);\r
      if (NdotL > 0.0) {\r
        let atten = max(1.0 - (distance / light.range), 0.0);\r
        let radiance = light.color * light.intensity * atten * atten;\r
        let D = distribution_ggx(N, H, roughness);\r
        let G = geometry_smith(N, V, L_norm, roughness);\r
        let F = fresnel_schlick(max(dot(H, V), 0.0), F0);\r
        let specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);\r
        let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);\r
        let diffuse = kD * albedo / PI;\r
        let shadow = sample_point_shadow(world_pos, light, i32(i));\r
        Lo += (diffuse + specular) * radiance * NdotL * shadow;\r
      }\r
    }\r
  }\r
\r
  // Spot lights\r
  for (var i = 0u; i < lighting.numSpotLights && i < MAX_SPOT_LIGHTS; i++) {\r
    let light = spotLights[i];\r
    let L = light.position - world_pos;\r
    let distance = length(L);\r
    let L_norm = L / distance;\r
    if (distance < light.range) {\r
      let spot_dir = normalize(-light.direction);\r
      let theta = dot(L_norm, spot_dir);\r
      let inner = cos(light.innerAngle * 0.0174533);\r
      let outer = cos(light.outerAngle * 0.0174533);\r
      let intens = clamp((theta - outer) / (inner - outer), 0.0, 1.0);\r
      if (intens > 0.0) {\r
        let H = normalize(V + L_norm);\r
        let NdotL = max(dot(N, L_norm), 0.0);\r
        if (NdotL > 0.0) {\r
          let atten = max(1.0 - (distance / light.range), 0.0);\r
          let radiance = light.color * light.intensity * atten * atten * intens;\r
          let D = distribution_ggx(N, H, roughness);\r
          let G = geometry_smith(N, V, L_norm, roughness);\r
          let F = fresnel_schlick(max(dot(H, V), 0.0), F0);\r
          let specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);\r
          let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);\r
          let diffuse = kD * albedo / PI;\r
          let shadow = sample_spot_shadow(world_pos, light);\r
          Lo += (diffuse + specular) * radiance * NdotL * shadow;\r
        }\r
      }\r
    }\r
  }\r
\r
  // IBL ambient\r
  let kS_ibl = fresnel_schlick_roughness(NdotV, F0, roughness);\r
  let kD_ibl = (vec3<f32>(1.0) - kS_ibl) * (1.0 - metallic);\r
  let irradiance = textureSampleLevel(irradiance_cube, ibl_sampler, N, 0.0).rgb;\r
  let diffuse_ibl = irradiance * albedo * kD_ibl;\r
  let R = reflect(-V, N);\r
  let prefiltered = textureSampleLevel(prefilter_cube, ibl_sampler, R, roughness * (IBL_MIP_LEVELS - 1.0)).rgb;\r
  let brdf = textureSampleLevel(brdf_lut, ibl_sampler, vec2<f32>(NdotV, roughness), 0.0).rg;\r
  let specular_ibl = prefiltered * (kS_ibl * brdf.x + brdf.y);\r
  let ambient = (diffuse_ibl + specular_ibl) * 0.5;\r
\r
  return Lo + ambient;\r
}\r
\r
// Procedural pattern functions\r
\r
fn hash2(p: vec2<f32>) -> vec2<f32> {\r
  let h = dot(p, vec2<f32>(127.1, 311.7));\r
  return fract(sin(vec2<f32>(h, h + 12.989)) * 43758.5453);\r
}\r
\r
fn noise2(p: vec2<f32>) -> f32 {\r
  let i = floor(p);\r
  let f = fract(p);\r
  let u = f * f * (3.0 - 2.0 * f);\r
  let a = hash2(i).x;\r
  let b = hash2(i + vec2<f32>(1.0, 0.0)).x;\r
  let c = hash2(i + vec2<f32>(0.0, 1.0)).x;\r
  let d = hash2(i + vec2<f32>(1.0, 1.0)).x;\r
  return 2.0 * (a + (b - a) * u.x + (c - a) * u.y + (a - b - c + d) * u.x * u.y) - 1.0;\r
}\r
\r
fn fbm(p: vec2<f32>) -> f32 {\r
  var val = 0.0;\r
  var amp = 0.5;\r
  var freq = 1.0;\r
  for (var i = 0u; i < 4u; i++) {\r
    val += amp * noise2(p * freq);\r
    freq *= 2.0;\r
    amp *= 0.5;\r
  }\r
  return val;\r
}\r
\r
fn procedural_pattern(pos: vec3<f32>, uv: vec2<f32>) -> vec3<f32> {\r
  let worldUV = pos.xz * params.patternScale;\r
  let time = params.time * params.animSpeed;\r
\r
  // Animated grid glow\r
  let gridUV = fract(worldUV) - 0.5;\r
  let gridDist = max(abs(gridUV.x), abs(gridUV.y));\r
  let edge = 1.0 - smoothstep(0.0, params.edgeWidth, gridDist);\r
  let gridGlow = sin(edge * PI * 4.0 - time * 2.0) * 0.5 + 0.5;\r
\r
  // Value noise overlay\r
  let n = fbm(worldUV + time * 0.1);\r
  let noiseVal = n * 0.5 + 0.5;\r
\r
  // Sweeping bands\r
  let bands = sin(pos.x * 2.0 + pos.z * 1.5 + time) * 0.5 + 0.5;\r
\r
  let baseMix = clamp(noiseVal * 0.6 + bands * 0.4, 0.0, 1.0);\r
  let base = mix(params.baseColor, params.accentColor, baseMix);\r
\r
  // Glow\r
  let glowColor = vec4<f32>(1.0, 0.6, 0.1, 1.0);\r
  let glow = gridGlow * (sin(time * 1.5) * 0.3 + 0.7);\r
\r
  return base.rgb + glow * glowColor.rgb;\r
}\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let albedo = procedural_pattern(in.world_pos, in.uv);\r
\r
  let V = normalize(camera.position - in.world_pos);\r
  let N = normalize(in.world_norm);\r
\r
  let roughness = 0.35;\r
  let metallic = 0.0;\r
  let lit = calculate_pbr_lighting(albedo, N, V, in.world_pos, roughness, metallic);\r
\r
  // subtle emissive boost\r
  let emissive = albedo * 0.08;\r
\r
  return vec4<f32>(lit + emissive, 1.0);\r
}\r
`,H=256,g=class g extends ar{constructor(){super(...arguments);n(this,"shaderId","procedural");n(this,"baseColor",new Float32Array([.15,.35,.75,1]));n(this,"accentColor",new Float32Array([1,.3,.1,1]));n(this,"patternScale",2);n(this,"time",0);n(this,"animSpeed",1);n(this,"edgeWidth",.04);n(this,"_device",null);n(this,"_buffer",null);n(this,"_bindGroup",null);n(this,"_dirty",!0);n(this,"_data",new Float32Array(H/4))}getShaderCode(r){return lr}getBindGroupLayout(r){let e=g._bglCache.get(r);return e||(e=r.createBindGroupLayout({label:"ProceduralMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),g._bglCache.set(r,e)),e}getBindGroup(r){return(!this._buffer||this._device!==r)&&(this._device=r,this._buffer=r.createBuffer({label:"ProceduralMaterialUniforms",size:H,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._bindGroup=r.createBindGroup({label:"ProceduralMaterialBindGroup",layout:this.getBindGroupLayout(r),entries:[{binding:0,resource:{buffer:this._buffer}}]}),this._dirty=!0),this._bindGroup}update(r){if(!this._dirty||!this._buffer)return;const e=this._data;e.set(this.baseColor,0),e.set(this.accentColor,4),e[8]=this.patternScale,e[9]=this.time,e[10]=this.animSpeed,e[11]=this.edgeWidth,r.writeBuffer(this._buffer,0,e),this._dirty=!1}markDirty(){this._dirty=!0}destroy(){var r;(r=this._buffer)==null||r.destroy(),this._buffer=null,this._bindGroup=null}};n(g,"_bglCache",new WeakMap);let f=g;async function dr(){const o=document.getElementById("canvas"),a=document.getElementById("fps");o.width=o.clientWidth,o.height=o.clientHeight;const r=await tr.create(o),{device:e}=r,T=b.createPlane(e,30,30),B=b.createCube(e,1.5),E=b.createSphere(e,.9,24,24),j=b.createCone(e,.8,1.6,20),s=new f;s.baseColor.set([.1,.3,.8,1]),s.accentColor.set([1,.4,.1,1]),s.patternScale=1.5;const l=new f;l.baseColor.set([.6,0,.4,1]),l.accentColor.set([0,1,.6,1]),l.patternScale=2.5,l.animSpeed=1.5;const d=new f;d.baseColor.set([0,.2,.2,1]),d.accentColor.set([1,.8,0,1]),d.patternScale=3,d.edgeWidth=.08;const y=2048,h=ir.create(r),S=e.createTexture({label:"DirShadowTex",size:{width:y,height:y},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC}),P=S.createView(),m=sr.create(r,P),p=new c(0,4,12),u=new or(0,0,5,.002);u.attach(o);let i=0,M=performance.now(),x=0,_=0;async function N(){const V=performance.now(),L=(V-M)*.001;M=V,i+=L,x++,_+=L,_>=.5&&(a.textContent=`FPS: ${Math.round(x/_)}`,x=0,_=0),(r.canvas.width!==r.canvas.clientWidth||r.canvas.height!==r.canvas.clientHeight)&&(r.canvas.width=r.canvas.clientWidth,r.canvas.height=r.canvas.clientHeight,h.resize(e,r.width,r.height));const O={position:p,rotation:{x:0,y:0,z:0,w:1}};u.update(O,L);const R=Math.sin(u.yaw),W=Math.cos(u.yaw),Y=Math.sin(u.pitch),C=Math.cos(u.pitch),q=new c(-R*C,-Y,-W*C).normalize(),X=p.add(q),I=t.lookAt(p,X,new c(0,1,0)),Z=r.width/r.height,D=t.perspective(60*Math.PI/180,Z,.1,100),G=D.multiply(I),$=G.invert();h.updateCamera(r,I,D,G,$,p,.1,100);const k=new c(.4,-.7,-.5).normalize(),z=new c(0,1,0),J=z.sub(k.scale(25)),K=t.lookAt(J,z,new c(0,1,0)),F=t.orthographic(-12,12,-12,12,1,50).multiply(K),Q={direction:k,intensity:1.5,color:new c(1,.95,.9),castShadows:!0,lightViewProj:F,shadowMap:P},w=4,A=[{mesh:T,modelMatrix:t.translation(0,-.5,0),normalMatrix:t.identity(),material:s},{mesh:B,modelMatrix:t.translation(0,1.5,0).multiply(t.rotationY(i*40*Math.PI/180)),normalMatrix:t.identity(),material:l},{mesh:E,modelMatrix:t.translation(Math.sin(i*.6)*w,1.5,Math.cos(i*.6)*w).multiply(t.rotationY(i*60*Math.PI/180)),normalMatrix:t.identity(),material:d},{mesh:j,modelMatrix:t.translation(Math.sin(i*.6+Math.PI)*w,1.5,Math.cos(i*.6+Math.PI)*w),normalMatrix:t.identity(),material:s}];s.time=i,l.time=i,d.time=i,s.markDirty(),l.markDirty(),d.markDirty();const rr=A.map(U=>({mesh:U.mesh,modelMatrix:U.modelMatrix})),v=e.createCommandEncoder({label:"ProceduralDemoEncoder"});m.setDrawItems(rr),m.updateCamera(r,F),m.enabled&&m.execute(v,r),h.copyShadowMapToArray(v,S,0),h.updateLights(r,Q,[],[]),h.setDrawItems(A),h.execute(v,r),e.queue.submit([v.finish()]),requestAnimationFrame(N)}N()}dr();
