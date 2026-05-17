var k=Object.defineProperty;var X=(v,b,n)=>b in v?k(v,b,{enumerable:!0,configurable:!0,writable:!0,value:n}):v[b]=n;var t=(v,b,n)=>X(v,typeof b!="symbol"?b+"":b,n);import{c as D,V as h,b as N,P as C,d as W,e as Y}from"./mesh-B_UY4euz.js";import{H as Z}from"./deferred_lighting_pass-BZaHbbPw.js";const q=[new h(1,0,0),new h(-1,0,0),new h(0,1,0),new h(0,-1,0),new h(0,0,1),new h(0,0,-1)],$=[new h(0,-1,0),new h(0,-1,0),new h(0,0,1),new h(0,0,-1),new h(0,-1,0),new h(0,-1,0)];class fe extends D{constructor(){super(...arguments);t(this,"color",h.one());t(this,"intensity",1);t(this,"radius",10);t(this,"castShadow",!1)}worldPosition(){return this.gameObject.localToWorld().transformPoint(h.ZERO)}cubeFaceViewProjs(n=.05){const e=this.worldPosition(),r=N.perspective(Math.PI/2,1,n,this.radius),o=new Array(6);for(let i=0;i<6;i++)o[i]=r.multiply(N.lookAt(e,e.add(q[i]),$[i]));return o}}class pe extends D{constructor(){super(...arguments);t(this,"color",h.one());t(this,"intensity",1);t(this,"range",20);t(this,"innerAngle",15);t(this,"outerAngle",30);t(this,"castShadow",!1);t(this,"projectionTexture",null)}worldPosition(){return this.gameObject.localToWorld().transformPoint(h.ZERO)}worldDirection(){return this.gameObject.localToWorld().transformDirection(h.FORWARD).normalize()}lightViewProj(n=.1){const e=this.worldPosition(),r=this.worldDirection(),o=Math.abs(r.y)>.99?h.RIGHT:h.UP,i=N.lookAt(e,e.add(r),o);return N.perspective(this.outerAngle*2*Math.PI/180,1,n,this.range).multiply(i)}}const J=`// VSM shadow map generation for point and spot lights.
//
// Point light faces: output linear depth (distance/radius) and depth² into rgba16float.
// Spot light maps  : output NDC depth and depth² into rgba16float.
//
// Two pipeline pairs share identical bind group layouts:
//   group 0: ShadowUniforms (lightViewProj + lightPos + lightRadius)
//   group 1: ModelUniforms  (model matrix)

struct ShadowUniforms {
  lightViewProj: mat4x4<f32>,  // offset 0, 64 bytes
  lightPos     : vec3<f32>,    // offset 64, 12 bytes
  lightRadius  : f32,          // offset 76, 4 bytes
}  // 80 bytes

struct ModelUniforms {
  model: mat4x4<f32>,  // 64 bytes
}

@group(0) @binding(0) var<uniform> shadow: ShadowUniforms;
@group(1) @binding(0) var<uniform> model : ModelUniforms;

// ---- Point light (linear depth) -----------------------------------------------

struct PointVaryings {
  @builtin(position) clip    : vec4<f32>,
  @location(0)       worldPos: vec3<f32>,
}

@vertex
fn vs_point(@location(0) pos: vec3<f32>) -> PointVaryings {
  let worldPos = model.model * vec4<f32>(pos, 1.0);
  var out: PointVaryings;
  out.clip     = shadow.lightViewProj * worldPos;
  out.worldPos = worldPos.xyz;
  return out;
}

@fragment
fn fs_point(in: PointVaryings) -> @location(0) vec4<f32> {
  let d = length(in.worldPos - shadow.lightPos) / shadow.lightRadius;
  return vec4<f32>(d, d * d, 0.0, 1.0);
}

// ---- Spot light (NDC depth) ----------------------------------------------------

struct SpotVaryings {
  @builtin(position) clip    : vec4<f32>,
  @location(0)       ndcDepth: f32,
}

@vertex
fn vs_spot(@location(0) pos: vec3<f32>) -> SpotVaryings {
  let worldPos = model.model * vec4<f32>(pos, 1.0);
  let clip     = shadow.lightViewProj * worldPos;
  var out: SpotVaryings;
  out.clip     = clip;
  out.ndcDepth = clip.z / clip.w;
  return out;
}

@fragment
fn fs_spot(in: SpotVaryings) -> @location(0) vec4<f32> {
  let d = in.ndcDepth;
  return vec4<f32>(d, d * d, 0.0, 1.0);
}
`,L=32,M=32,T=4,x=8,U=256,E=512,A=256,I=80,K=64,Q=6*T,ee=Q+x,te="pointspot:point-vsm",ne="pointspot:spot-vsm",oe="pointspot:proj-array",re={label:"PointVSM",format:"rgba16float",width:U,height:U,depthOrArrayLayers:T*6},ie={label:"SpotVSM",format:"rgba16float",width:E,height:E,depthOrArrayLayers:x},se={label:"ProjTexArray",format:"rgba8unorm",width:A,height:A,depthOrArrayLayers:x,extraUsage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT};class j extends C{constructor(n,e,r,o,i,l,m,a,c,g){super();t(this,"name","PointSpotShadowPass");t(this,"_device");t(this,"_pointPipeline");t(this,"_spotPipeline");t(this,"_shadowBufs");t(this,"_shadowBGs");t(this,"_modelBgl");t(this,"_modelBufs",[]);t(this,"_modelBGs",[]);t(this,"_pointDepth");t(this,"_pointDepthView");t(this,"_spotDepth");t(this,"_spotDepthView");t(this,"_shadowScratch",new Float32Array(I/4));t(this,"_snapshot",[]);t(this,"_pointLights",[]);t(this,"_spotLights",[]);t(this,"_cachedPointTex",null);t(this,"_cachedPointFaceViews",[]);t(this,"_cachedSpotTex",null);t(this,"_cachedSpotFaceViews",[]);this._device=n,this._pointPipeline=e,this._spotPipeline=r,this._shadowBufs=o,this._shadowBGs=i,this._modelBgl=l,this._pointDepth=m,this._pointDepthView=a,this._spotDepth=c,this._spotDepthView=g}static create(n){const{device:e}=n,r=e.createTexture({label:"PointShadowDepth",size:{width:U,height:U},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),o=e.createTexture({label:"SpotShadowDepth",size:{width:E,height:E},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),i=e.createBindGroupLayout({label:"PSShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),l=e.createBindGroupLayout({label:"PSModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),m=[],a=[];for(let d=0;d<ee;d++){const w=e.createBuffer({label:`PSShadowUniform ${d}`,size:I,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});m.push(w),a.push(e.createBindGroup({label:`PSShadowBG ${d}`,layout:i,entries:[{binding:0,resource:{buffer:w}}]}))}const c=e.createPipelineLayout({bindGroupLayouts:[i,l]}),g=n.createShaderModule(J,"PointSpotShadowShader"),f={module:g,buffers:[{arrayStride:Y,attributes:[W[0]]}]},s=e.createRenderPipeline({label:"PointShadowPipeline",layout:c,vertex:{...f,entryPoint:"vs_point"},fragment:{module:g,entryPoint:"fs_point",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),_=e.createRenderPipeline({label:"SpotShadowPipeline",layout:c,vertex:{...f,entryPoint:"vs_spot"},fragment:{module:g,entryPoint:"fs_spot",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new j(e,s,_,m,a,l,r,r.createView(),o,o.createView())}update(n,e,r){this._pointLights=n,this._spotLights=e,this._snapshot=r}addToGraph(n){const e=n.importPersistentTexture(te,re),r=n.importPersistentTexture(ne,ie),o=n.importPersistentTexture(oe,se);let i,l,m;return n.addPass(this.name,"transfer",a=>{i=a.write(e,"attachment"),l=a.write(r,"attachment"),m=a.write(o,"copy-dst"),a.setExecute((c,g)=>{const f=this._snapshot;this._ensureModelBuffers(f.length);const s=g.getTexture(e),_=g.getTexture(r),d=g.getTexture(o);this._cachedPointTex!==s&&(this._cachedPointTex=s,this._cachedPointFaceViews=Array.from({length:T*6},(p,P)=>s.createView({dimension:"2d",baseArrayLayer:P,arrayLayerCount:1}))),this._cachedSpotTex!==_&&(this._cachedSpotTex=_,this._cachedSpotFaceViews=Array.from({length:x},(p,P)=>_.createView({dimension:"2d",baseArrayLayer:P,arrayLayerCount:1})));for(let p=0;p<this._spotLights.length&&p<x;p++){const P=this._spotLights[p];P.projectionTexture&&c.commandEncoder.copyTextureToTexture({texture:P.projectionTexture},{texture:d,origin:{x:0,y:0,z:p}},{width:A,height:A,depthOrArrayLayers:1})}for(let p=0;p<f.length;p++)this._device.queue.writeBuffer(this._modelBufs[p],0,f[p].modelMatrix.data.buffer);let w=0,u=0;for(const p of this._pointLights){if(!p.castShadow||u>=T)continue;const P=p.worldPosition(),V=p.cubeFaceViewProjs(),S=this._shadowScratch;S[16]=P.x,S[17]=P.y,S[18]=P.z,S[19]=p.radius;for(let y=0;y<6;y++){S.set(V[y].data,0),this._device.queue.writeBuffer(this._shadowBufs[w],0,S.buffer);const z=u*6+y,G=c.commandEncoder.beginRenderPass({label:`PointShadow light${u} face${y}`,colorAttachments:[{view:this._cachedPointFaceViews[z],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._pointDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});G.setPipeline(this._pointPipeline),G.setBindGroup(0,this._shadowBGs[w]),this._drawItems(G,f),G.end(),w++}u++}let B=0;for(const p of this._spotLights){if(!p.castShadow||B>=x)continue;const P=p.lightViewProj(),V=p.worldPosition(),S=this._shadowScratch;S.set(P.data,0),S[16]=V.x,S[17]=V.y,S[18]=V.z,S[19]=p.range,this._device.queue.writeBuffer(this._shadowBufs[w],0,S.buffer);const y=c.commandEncoder.beginRenderPass({label:`SpotShadow light${B}`,colorAttachments:[{view:this._cachedSpotFaceViews[B],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._spotDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});y.setPipeline(this._spotPipeline),y.setBindGroup(0,this._shadowBGs[w]),this._drawItems(y,f),y.end(),w++,B++}})}),{pointVsm:i,spotVsm:l,projTex:m}}_drawItems(n,e){for(let r=0;r<e.length;r++){const{mesh:o}=e[r];n.setBindGroup(1,this._modelBGs[r]),n.setVertexBuffer(0,o.vertexBuffer),n.setIndexBuffer(o.indexBuffer,"uint32"),n.drawIndexed(o.indexCount)}}_ensureModelBuffers(n){for(;this._modelBufs.length<n;){const e=this._device.createBuffer({label:`PSModelUniform ${this._modelBufs.length}`,size:K,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBufs.push(e),this._modelBGs.push(this._device.createBindGroup({layout:this._modelBgl,entries:[{binding:0,resource:{buffer:e}}]}))}}destroy(){this._pointDepth.destroy(),this._spotDepth.destroy();for(const n of this._shadowBufs)n.destroy();for(const n of this._modelBufs)n.destroy()}}const ae=`// Additive deferred pass for point and spot lights.
// Runs after DeferredLightingPass (which handles directional + IBL) with loadOp:'load'
// and srcFactor:'one' dstFactor:'one' so results accumulate on the HDR texture.

const PI: f32 = 3.14159265358979323846;

// ---- Camera (same layout as deferred_lighting.wgsl, 288 bytes) -------------------------

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

// ---- Light data ---------------------------------------------------------------

struct LightCounts {
  numPoint: u32,
  numSpot : u32,
}

// 48 bytes — must match TypeScript packing in updateLights()
struct PointLightGpu {
  position : vec3<f32>,   // offset 0
  radius   : f32,         // offset 12
  color    : vec3<f32>,   // offset 16
  intensity: f32,         // offset 28
  shadowIdx: i32,         // offset 32  — negative means no shadow
  _pad0    : i32,
  _pad1    : i32,
  _pad2    : i32,
}

// 128 bytes — must match TypeScript packing in updateLights()
struct SpotLightGpu {
  position  : vec3<f32>,    // offset 0
  range     : f32,          // offset 12
  direction : vec3<f32>,    // offset 16
  innerCos  : f32,          // offset 28
  color     : vec3<f32>,    // offset 32
  outerCos  : f32,          // offset 44
  intensity : f32,          // offset 48
  shadowIdx : i32,          // offset 52
  projTexIdx: i32,          // offset 56
  _pad      : f32,          // offset 60
  lightViewProj: mat4x4<f32>, // offset 64
}

@group(0) @binding(0) var<uniform>       camera     : CameraUniforms;
@group(2) @binding(0) var<uniform>       lightCounts: LightCounts;
@group(2) @binding(1) var<storage, read> pointLights: array<PointLightGpu>;
@group(2) @binding(2) var<storage, read> spotLights : array<SpotLightGpu>;

// ---- GBuffer -----------------------------------------------------------------

@group(1) @binding(0) var albedoRoughnessTex: texture_2d<f32>;
@group(1) @binding(1) var normalMetallicTex : texture_2d<f32>;
@group(1) @binding(2) var depthTex          : texture_depth_2d;
@group(1) @binding(3) var gbufferSampler    : sampler;

// ---- Shadow maps + projection textures ----------------------------------------

@group(3) @binding(0) var vsm_point   : texture_cube_array<f32>;
@group(3) @binding(1) var vsm_spot    : texture_2d_array<f32>;
@group(3) @binding(2) var proj_tex    : texture_2d_array<f32>;
@group(3) @binding(3) var vsm_sampler : sampler;
@group(3) @binding(4) var proj_sampler: sampler;

// ---- Vertex ------------------------------------------------------------------

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ---- Helpers -----------------------------------------------------------------

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc    = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let world_h = camera.invViewProj * ndc;
  return world_h.xyz / world_h.w;
}

// Variance shadow map: Chebyshev upper bound
fn vsm_shadow(moments: vec2<f32>, compare: f32) -> f32 {
  if (compare <= moments.x + 0.001) { return 1.0; }
  let variance = max(moments.y - moments.x * moments.x, 1e-5);
  let d = compare - moments.x;
  return variance / (variance + d * d);
}

// Epic-style inverse-square attenuation with smooth radius falloff
fn point_attenuation(dist: f32, radius: f32) -> f32 {
  let r = dist / radius;
  return pow(saturate(1.0 - r * r * r * r), 2.0) / max(dist * dist, 0.0001);
}

// ---- BRDF (same as deferred_lighting.wgsl) --------------------------------------------

fn distribution_ggx(NdotH: f32, roughness: f32) -> f32 {
  let a  = roughness * roughness;
  let a2 = a * a;
  let d  = NdotH * NdotH * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

fn geometry_direct(NdotX: f32, roughness: f32) -> f32 {
  let r = roughness + 1.0;
  let k = r * r / 8.0;
  return NdotX / (NdotX * (1.0 - k) + k);
}

fn smith_direct(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
  return geometry_direct(NdotV, roughness) * geometry_direct(NdotL, roughness);
}

fn fresnel_schlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
  return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

fn cook_torrance(NdotV: f32, NdotL: f32, NdotH: f32, VdotH: f32, roughness: f32, F0: vec3<f32>, albedo: vec3<f32>, metallic: f32) -> vec3<f32> {
  let D  = distribution_ggx(NdotH, roughness);
  let G  = smith_direct(NdotV, NdotL, roughness);
  let Fd = fresnel_schlick(VdotH, F0);
  let kD = (vec3<f32>(1.0) - Fd) * (1.0 - metallic);
  let specular = D * G * Fd / max(4.0 * NdotV * NdotL, 0.001);
  let diffuse  = kD * albedo / PI;
  return diffuse + specular;
}

// ---- Fragment ----------------------------------------------------------------

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);
  let depth = textureLoad(depthTex, coord, 0);
  if (depth >= 1.0) { discard; }  // sky — directional pass handles it

  let albedo_rough = textureLoad(albedoRoughnessTex, coord, 0);
  let normal_metal = textureLoad(normalMetallicTex,  coord, 0);

  let albedo    = albedo_rough.rgb;
  let roughness = max(albedo_rough.a, 0.04);
  let N         = normalize(normal_metal.rgb * 2.0 - 1.0);
  let metallic  = normal_metal.a;

  let world_pos = reconstruct_world_pos(in.uv, depth);
  let V         = normalize(camera.position - world_pos);
  let NdotV     = max(dot(N, V), 0.001);
  let F0        = mix(vec3<f32>(0.04), albedo, metallic);

  var accum = vec3<f32>(0.0);

  // ---- Point lights ----------------------------------------------------------
  for (var i = 0u; i < lightCounts.numPoint; i++) {
    let pl   = pointLights[i];
    let diff = pl.position - world_pos;
    let dist = length(diff);
    if (dist >= pl.radius) { continue; }

    let L     = diff / dist;
    let NdotL = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) { continue; }

    let H     = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let brdf = cook_torrance(NdotV, NdotL, NdotH, VdotH, roughness, F0, albedo, metallic);
    let att  = point_attenuation(dist, pl.radius);

    // VSM cube-array shadow
    var shad = 1.0;
    if (pl.shadowIdx >= 0) {
      let dir     = -normalize(diff);  // from light toward surface
      let compare = dist / pl.radius;
      let moments = textureSampleLevel(vsm_point, vsm_sampler, dir, pl.shadowIdx, 0.0).rg;
      shad = vsm_shadow(moments, compare);
    }

    accum += brdf * pl.color * pl.intensity * NdotL * att * shad;
  }

  // ---- Spot lights -----------------------------------------------------------
  for (var i = 0u; i < lightCounts.numSpot; i++) {
    let sl   = spotLights[i];
    let diff = sl.position - world_pos;
    let dist = length(diff);
    if (dist >= sl.range) { continue; }

    let L        = diff / dist;
    let NdotL    = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) { continue; }

    // Spot cone attenuation
    let cos_angle = dot(-L, sl.direction);
    if (cos_angle <= sl.outerCos) { continue; }
    let cone = smoothstep(sl.outerCos, sl.innerCos, cos_angle);

    let H     = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let brdf = cook_torrance(NdotV, NdotL, NdotH, VdotH, roughness, F0, albedo, metallic);
    let att  = point_attenuation(dist, sl.range);

    // VSM + projection texture (computed from light-space coords)
    var modulator = vec3<f32>(1.0);
    if (sl.shadowIdx >= 0 || sl.projTexIdx >= 0) {
      let ls     = sl.lightViewProj * vec4<f32>(world_pos, 1.0);
      let sc     = ls.xyz / ls.w;
      let uv     = vec2<f32>(sc.x * 0.5 + 0.5, -sc.y * 0.5 + 0.5);
      let in_frustum = all(uv >= vec2<f32>(0.0)) && all(uv <= vec2<f32>(1.0)) && sc.z >= 0.0 && sc.z <= 1.0;

      if (in_frustum) {
        if (sl.shadowIdx >= 0) {
          let moments = textureSampleLevel(vsm_spot, vsm_sampler, uv, sl.shadowIdx, 0.0).rg;
          modulator *= vec3<f32>(vsm_shadow(moments, sc.z));
        }
        if (sl.projTexIdx >= 0) {
          modulator *= textureSampleLevel(proj_tex, proj_sampler, uv, sl.projTexIdx, 0.0).rgb;
        }
      } else {
        modulator = vec3<f32>(0.0);  // outside frustum → no contribution
      }
    }

    accum += brdf * sl.color * sl.intensity * NdotL * att * cone * modulator;
  }

  return vec4<f32>(accum, 0.0);
}
`,O=64*4+16+16,le=8,F=48,R=128;class H extends C{constructor(n,e,r,o,i,l,m,a,c,g,f,s){super();t(this,"name","PointSpotLightPass");t(this,"_pipeline");t(this,"_cameraBg");t(this,"_lightBg");t(this,"_gbufferBgl");t(this,"_shadowBgl");t(this,"_cameraBuffer");t(this,"_lightCountsBuffer");t(this,"_pointBuffer");t(this,"_spotBuffer");t(this,"_linearSampler");t(this,"_vsmSampler");t(this,"_projSampler");t(this,"_cameraData",new Float32Array(O/4));t(this,"_lightCountsArr",new Uint32Array(2));t(this,"_pointBuf",new ArrayBuffer(L*F));t(this,"_pointF32",new Float32Array(this._pointBuf));t(this,"_pointI32",new Int32Array(this._pointBuf));t(this,"_spotBuf",new ArrayBuffer(M*R));t(this,"_spotF32",new Float32Array(this._spotBuf));t(this,"_spotI32",new Int32Array(this._spotBuf));this._pipeline=n,this._cameraBg=e,this._lightBg=r,this._gbufferBgl=o,this._shadowBgl=i,this._cameraBuffer=l,this._lightCountsBuffer=m,this._pointBuffer=a,this._spotBuffer=c,this._linearSampler=g,this._vsmSampler=f,this._projSampler=s}static create(n){const{device:e}=n,r=e.createBuffer({label:"PSLCameraBuffer",size:O,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=e.createBuffer({label:"PSLLightCounts",size:le,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=e.createBuffer({label:"PSLPointBuffer",size:L*F,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),l=e.createBuffer({label:"PSLSpotBuffer",size:M*R,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),m=e.createSampler({label:"PSLLinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),a=e.createSampler({label:"PSLVsmSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),c=e.createSampler({label:"PSLProjSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),g=e.createBindGroupLayout({label:"PSLCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),f=e.createBindGroupLayout({label:"PSLGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),s=e.createBindGroupLayout({label:"PSLLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),_=e.createBindGroupLayout({label:"PSLShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube-array"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),d=e.createBindGroup({label:"PSLCameraBG",layout:g,entries:[{binding:0,resource:{buffer:r}}]}),w=e.createBindGroup({label:"PSLLightBG",layout:s,entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:i}},{binding:2,resource:{buffer:l}}]}),u=n.createShaderModule(ae,"PointSpotLightShader"),B=e.createRenderPipeline({label:"PointSpotLightPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[g,f,s,_]}),vertex:{module:u,entryPoint:"vs_main"},fragment:{module:u,entryPoint:"fs_main",targets:[{format:Z,blend:{color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new H(B,d,w,f,_,r,o,i,l,m,a,c)}updateCamera(n){const e=n.activeCamera;if(!e)throw new Error("PointSpotLightPass.updateCamera: ctx.activeCamera is null");const r=e.position(),o=this._cameraData;o.set(e.viewMatrix().data,0),o.set(e.projectionMatrix().data,16),o.set(e.viewProjectionMatrix().data,32),o.set(e.inverseViewProjectionMatrix().data,48),o[64]=r.x,o[65]=r.y,o[66]=r.z,o[67]=e.near,o[68]=e.far,n.queue.writeBuffer(this._cameraBuffer,0,o.buffer)}updateLights(n,e,r){const o=this._lightCountsArr;o[0]=Math.min(e.length,L),o[1]=Math.min(r.length,M),n.queue.writeBuffer(this._lightCountsBuffer,0,o.buffer);const i=this._pointF32,l=this._pointI32;let m=0;for(let f=0;f<Math.min(e.length,L);f++){const s=e[f],_=s.worldPosition(),d=f*12;i[d+0]=_.x,i[d+1]=_.y,i[d+2]=_.z,i[d+3]=s.radius,i[d+4]=s.color.x,i[d+5]=s.color.y,i[d+6]=s.color.z,i[d+7]=s.intensity,s.castShadow&&m<T?l[d+8]=m++:l[d+8]=-1,l[d+9]=0,l[d+10]=0,l[d+11]=0}n.queue.writeBuffer(this._pointBuffer,0,this._pointBuf);const a=this._spotF32,c=this._spotI32;let g=0;for(let f=0;f<Math.min(r.length,M);f++){const s=r[f],_=s.worldPosition(),d=s.worldDirection(),w=s.lightViewProj(),u=f*32;a[u+0]=_.x,a[u+1]=_.y,a[u+2]=_.z,a[u+3]=s.range,a[u+4]=d.x,a[u+5]=d.y,a[u+6]=d.z,a[u+7]=Math.cos(s.innerAngle*Math.PI/180),a[u+8]=s.color.x,a[u+9]=s.color.y,a[u+10]=s.color.z,a[u+11]=Math.cos(s.outerAngle*Math.PI/180),a[u+12]=s.intensity,s.castShadow&&g<x?c[u+13]=g++:c[u+13]=-1,c[u+14]=s.projectionTexture!==null?f:-1,c[u+15]=0,a.set(w.data,u+16)}n.queue.writeBuffer(this._spotBuffer,0,this._spotBuf)}updateLight(n){n.computeLightViewProj()}addToGraph(n,e){let r;return n.addPass(this.name,"render",o=>{r=o.write(e.hdr,"attachment",{loadOp:"load",storeOp:"store"}),o.read(e.gbuffer.albedo,"sampled"),o.read(e.gbuffer.normal,"sampled"),o.read(e.gbuffer.depth,"sampled"),o.read(e.pointVsm,"sampled"),o.read(e.spotVsm,"sampled"),o.read(e.projTex,"sampled"),o.setExecute((i,l)=>{const m=l.getOrCreateBindGroup({layout:this._gbufferBgl,entries:[{binding:0,resource:l.getTextureView(e.gbuffer.albedo)},{binding:1,resource:l.getTextureView(e.gbuffer.normal)},{binding:2,resource:l.getTextureView(e.gbuffer.depth)},{binding:3,resource:this._linearSampler}]}),a=l.getOrCreateBindGroup({layout:this._shadowBgl,entries:[{binding:0,resource:l.getTextureView(e.pointVsm,{dimension:"cube-array",arrayLayerCount:T*6})},{binding:1,resource:l.getTextureView(e.spotVsm,{dimension:"2d-array"})},{binding:2,resource:l.getTextureView(e.projTex,{dimension:"2d-array"})},{binding:3,resource:this._vsmSampler},{binding:4,resource:this._projSampler}]}),c=i.renderPassEncoder;c.setPipeline(this._pipeline),c.setBindGroup(0,this._cameraBg),c.setBindGroup(1,m),c.setBindGroup(2,this._lightBg),c.setBindGroup(3,a),c.draw(3)})}),{hdr:r}}destroy(){this._cameraBuffer.destroy(),this._lightCountsBuffer.destroy(),this._pointBuffer.destroy(),this._spotBuffer.destroy()}}export{fe as P,pe as S,j as a,H as b};
