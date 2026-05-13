var $=Object.defineProperty;var K=(g,f,r)=>f in g?$(g,f,{enumerable:!0,configurable:!0,writable:!0,value:r}):g[f]=r;var a=(g,f,r)=>K(g,typeof f!="symbol"?f+"":f,r);import{a as G,c as D,d as C}from"./mesh-LUU9vCQq.js";import{s as J,M as Q}from"./shadow-BSGgysNj.js";class z{constructor(f,r,n,e,i){a(this,"albedoRoughness");a(this,"normalMetallic");a(this,"depth");a(this,"albedoRoughnessView");a(this,"normalMetallicView");a(this,"depthView");a(this,"width");a(this,"height");this.albedoRoughness=f,this.normalMetallic=r,this.depth=n,this.width=e,this.height=i,this.albedoRoughnessView=f.createView(),this.normalMetallicView=r.createView(),this.depthView=n.createView()}static create(f){const{device:r,width:n,height:e}=f,i=r.createTexture({label:"GBuffer AlbedoRoughness",size:{width:n,height:e},format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=r.createTexture({label:"GBuffer NormalMetallic",size:{width:n,height:e},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),l=r.createTexture({label:"GBuffer Depth",size:{width:n,height:e},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});return new z(i,o,l,n,e)}destroy(){this.albedoRoughness.destroy(),this.normalMetallic.destroy(),this.depth.destroy()}}const P=2048,w=4;class F extends G{constructor(r,n,e,i,o,l,t,d){super();a(this,"name","ShadowPass");a(this,"shadowMap");a(this,"shadowMapView");a(this,"shadowMapArrayViews");a(this,"_pipeline");a(this,"_shadowBindGroups");a(this,"_shadowUniformBuffers");a(this,"_modelUniformBuffers",[]);a(this,"_modelBindGroups",[]);a(this,"_cascadeCount");a(this,"_cascades",[]);a(this,"_modelBGL");a(this,"_sceneSnapshot",[]);this.shadowMap=r,this.shadowMapView=n,this.shadowMapArrayViews=e,this._pipeline=i,this._shadowBindGroups=o,this._shadowUniformBuffers=l,this._modelBGL=t,this._cascadeCount=d}static create(r,n=3){const{device:e}=r,i=e.createTexture({label:"ShadowMap",size:{width:P,height:P,depthOrArrayLayers:w},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=i.createView({dimension:"2d-array"}),l=Array.from({length:w},(p,_)=>i.createView({dimension:"2d",baseArrayLayer:_,arrayLayerCount:1})),t=e.createBindGroupLayout({label:"ShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),d=e.createBindGroupLayout({label:"ModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),s=[],h=[];for(let p=0;p<w;p++){const _=e.createBuffer({label:`ShadowUniformBuffer ${p}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.push(_),h.push(e.createBindGroup({label:`ShadowBindGroup ${p}`,layout:t,entries:[{binding:0,resource:{buffer:_}}]}))}const u=e.createShaderModule({label:"ShadowShader",code:J}),c=e.createRenderPipeline({label:"ShadowPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[t,d]}),vertex:{module:u,entryPoint:"vs_main",buffers:[{arrayStride:C,attributes:[D[0]]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less",depthBias:2,depthBiasSlopeScale:2.5,depthBiasClamp:0},primitive:{topology:"triangle-list",cullMode:"back"}});return new F(i,o,l,c,h,s,d,n)}updateScene(r,n,e,i){this._cascades=e.computeCascadeMatrices(n,i),this._cascadeCount=Math.min(this._cascades.length,w)}execute(r,n){const{device:e}=n,i=this._getMeshRenderers(n);this._ensureModelBuffers(e,i.length);for(let o=0;o<this._cascadeCount&&!(o>=this._cascades.length);o++){const l=this._cascades[o];n.queue.writeBuffer(this._shadowUniformBuffers[o],0,l.lightViewProj.data.buffer);const t=r.beginRenderPass({label:`ShadowPass cascade ${o}`,colorAttachments:[],depthStencilAttachment:{view:this.shadowMapArrayViews[o],depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});t.setPipeline(this._pipeline),t.setBindGroup(0,this._shadowBindGroups[o]);for(let d=0;d<i.length;d++){const{mesh:s,modelMatrix:h}=i[d],u=this._modelUniformBuffers[d];n.queue.writeBuffer(u,0,h.data.buffer),t.setBindGroup(1,this._modelBindGroups[d]),t.setVertexBuffer(0,s.vertexBuffer),t.setIndexBuffer(s.indexBuffer,"uint32"),t.drawIndexed(s.indexCount)}t.end()}}_getMeshRenderers(r){return this._sceneSnapshot??[]}setSceneSnapshot(r){this._sceneSnapshot=r}_ensureModelBuffers(r,n){for(;this._modelUniformBuffers.length<n;){const e=r.createBuffer({label:`ModelUniform ${this._modelUniformBuffers.length}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=r.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:e}}]});this._modelUniformBuffers.push(e),this._modelBindGroups.push(i)}}destroy(){this.shadowMap.destroy();for(const r of this._shadowUniformBuffers)r.destroy();for(const r of this._modelUniformBuffers)r.destroy()}}const ee=`// Deferred PBR lighting pass — fullscreen triangle, reads GBuffer + shadow maps + IBL.\r
\r
const PI: f32 = 3.14159265358979323846;\r
\r
// ---- Aerial perspective (Rayleigh + Mie, same model as atmosphere.wgsl) --------\r
// Density scale factor: real atmosphere only hazes over km; game view is ~200 m,\r
// so multiply density by 200 to get visible haze at typical render distances.\r
const ATM_FOG_SCALE : f32       = 80.0;\r
const ATM_R_E       : f32       = 6360000.0;\r
const ATM_R_A       : f32       = 6420000.0;\r
const ATM_H_R       : f32       = 8500.0;\r
const ATM_H_M       : f32       = 1200.0;\r
const ATM_G         : f32       = 0.758;\r
const ATM_BETA_R    : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);\r
const ATM_BETA_M    : f32       = 21.0e-6;\r
const ATM_SUN_I     : f32       = 20.0;\r
\r
fn atm_ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {\r
  let b = dot(ro, rd); let c = dot(ro, ro) - r * r; let d = b*b - c;\r
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }\r
  let sq = sqrt(d);\r
  return vec2<f32>(-b - sq, -b + sq);\r
}\r
\r
fn atm_optical_depth(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {\r
  let t = atm_ray_sphere(pos, dir, ATM_R_A); let ds = t.y / 4.0;\r
  var od = vec2<f32>(0.0);\r
  for (var i = 0; i < 4; i++) {\r
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - ATM_R_E;\r
    if (h < 0.0) { break; }\r
    od += vec2<f32>(exp(-h / ATM_H_R), exp(-h / ATM_H_M)) * ds;\r
  }\r
  return od;\r
}\r
\r
// Simplified scatter for fog color (6 main steps).\r
fn atm_scatter(ro: vec3<f32>, rd: vec3<f32>, sun_dir: vec3<f32>) -> vec3<f32> {\r
  let ta = atm_ray_sphere(ro, rd, ATM_R_A); let tMin = max(ta.x, 0.0);\r
  if (ta.y < 0.0) { return vec3<f32>(0.0); }\r
  let tg   = atm_ray_sphere(ro, rd, ATM_R_E);\r
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);\r
  if (tMax <= tMin) { return vec3<f32>(0.0); }\r
  let mu = dot(rd, sun_dir);\r
  let pR = (3.0 / (16.0 * PI)) * (1.0 + mu * mu);\r
  let g2 = ATM_G * ATM_G;\r
  let pM = (3.0 / (8.0 * PI)) * ((1.0 - g2) * (1.0 + mu * mu)) /\r
            ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * ATM_G * mu, 1e-4), 1.5));\r
  let ds = (tMax - tMin) / 6.0;\r
  var sumR = vec3<f32>(0.0); var sumM = vec3<f32>(0.0);\r
  var odR = 0.0; var odM = 0.0;\r
  for (var i = 0; i < 6; i++) {\r
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);\r
    let h   = length(pos) - ATM_R_E;\r
    if (h < 0.0) { break; }\r
    let hrh = exp(-h / ATM_H_R) * ds; let hmh = exp(-h / ATM_H_M) * ds;\r
    odR += hrh; odM += hmh;\r
    let tg2 = atm_ray_sphere(pos, sun_dir, ATM_R_E);\r
    if (tg2.x > 0.0) { continue; }\r
    let odL = atm_optical_depth(pos, sun_dir);\r
    let tau = ATM_BETA_R * (odR + odL.x) + ATM_BETA_M * 1.1 * (odM + odL.y);\r
    sumR += exp(-tau) * hrh; sumM += exp(-tau) * hmh;\r
  }\r
  return ATM_SUN_I * (ATM_BETA_R * pR * sumR + vec3<f32>(ATM_BETA_M) * pM * sumM);\r
}\r
\r
fn apply_aerial_perspective(geo_color: vec3<f32>, world_pos: vec3<f32>,\r
                             sun_dir: vec3<f32>, cam_h: f32) -> vec3<f32> {\r
  let ray_vec  = world_pos - camera.position;\r
  let dist     = length(ray_vec);\r
  let ray_dir  = ray_vec / max(dist, 0.001);\r
  let atm_ro   = vec3<f32>(0.0, ATM_R_E + cam_h, 0.0);\r
\r
  // Altitude at camera and at the geometry surface.\r
  let h0 = max(camera.position.y, 0.0);\r
  let h1 = max(world_pos.y, 0.0);\r
  let dh = h1 - h0;\r
\r
  // Analytic integral of exp(-h(t)/H) dt along the ray from t=0 to t=dist:\r
  //   h(t) = h0 + (dh/dist)*t\r
  //   integral = (exp(-h0/H) - exp(-h1/H)) * H * dist / dh\r
  // Horizontal-ray limit (|dh| → 0): exp(-h0/H) * dist\r
  // This makes fog thicker for low geometry and thinner for high geometry at the same distance.\r
  var od_R: f32;\r
  var od_M: f32;\r
  if (abs(dh) < 0.1) {\r
    od_R = exp(-h0 / ATM_H_R) * dist;\r
    od_M = exp(-h0 / ATM_H_M) * dist;\r
  } else {\r
    od_R = max((exp(-h0 / ATM_H_R) - exp(-h1 / ATM_H_R)) * ATM_H_R * dist / dh, 0.0);\r
    od_M = max((exp(-h0 / ATM_H_M) - exp(-h1 / ATM_H_M)) * ATM_H_M * dist / dh, 0.0);\r
  }\r
\r
  let tau   = (ATM_BETA_R * od_R + vec3<f32>(ATM_BETA_M * od_M)) * ATM_FOG_SCALE;\r
  let geo_T = exp(-tau);\r
\r
  // Sample fog color using only the horizontal component of the ray direction.\r
  // Using the true ray direction creates a visible line at camera height where\r
  // the sky-scatter color changes as the downward angle exceeds any clamp value.\r
  // Projecting to horizontal makes fog color a function of azimuth only (sun angle),\r
  // matching the sky at the true horizon with no altitude-dependent discontinuity.\r
  let h2   = vec3<f32>(ray_dir.x, 0.0, ray_dir.z);\r
  let len2 = dot(h2, h2);\r
  let fog_dir   = select(normalize(h2), vec3<f32>(1.0, 0.0, 0.0), len2 < 1e-6);\r
  let fog_color = atm_scatter(atm_ro, fog_dir, sun_dir);\r
\r
  return geo_color * geo_T + fog_color * (1.0 - geo_T);\r
}\r
const SHADOW_MAP_SIZE: f32 = 2048.0;\r
\r
const POISSON16 = array<vec2<f32>, 16>(\r
  vec2<f32>(-0.94201624, -0.39906216), vec2<f32>( 0.94558609, -0.76890725),\r
  vec2<f32>(-0.09418410, -0.92938870), vec2<f32>( 0.34495938,  0.29387760),\r
  vec2<f32>(-0.91588581,  0.45771432), vec2<f32>(-0.81544232, -0.87912464),\r
  vec2<f32>(-0.38277543,  0.27676845), vec2<f32>( 0.97484398,  0.75648379),\r
  vec2<f32>( 0.44323325, -0.97511554), vec2<f32>( 0.53742981, -0.47373420),\r
  vec2<f32>(-0.26496911, -0.41893023), vec2<f32>( 0.79197514,  0.19090188),\r
  vec2<f32>(-0.24188840,  0.99706507), vec2<f32>(-0.81409955,  0.91437590),\r
  vec2<f32>( 0.19984126,  0.78641367), vec2<f32>( 0.14383161, -0.14100790),\r
);\r
\r
fn ign(pixel: vec2<f32>) -> f32 {\r
  return fract(52.9829189 * fract(0.06711056 * pixel.x + 0.00583715 * pixel.y));\r
}\r
\r
fn rotate2d(v: vec2<f32>, a: f32) -> vec2<f32> {\r
  let s = sin(a); let c = cos(a);\r
  return vec2<f32>(c*v.x - s*v.y, s*v.x + c*v.y);\r
}\r
\r
struct CameraUniforms {\r
  view       : mat4x4<f32>,\r
  proj       : mat4x4<f32>,\r
  viewProj   : mat4x4<f32>,\r
  invViewProj: mat4x4<f32>,\r
  position   : vec3<f32>,\r
  near       : f32,\r
  far        : f32,\r
}\r
\r
struct LightUniforms {\r
  direction         : vec3<f32>,\r
  intensity         : f32,\r
  color             : vec3<f32>,\r
  cascadeCount      : u32,\r
  cascadeMatrices   : array<mat4x4<f32>, 4>,\r
  cascadeSplits     : vec4<f32>,\r
  shadowsEnabled    : u32,\r
  debugCascades     : u32,\r
  cloudShadowOrigin : vec2<f32>,  // world-space XZ center of cloud shadow map\r
  cloudShadowExtent  : f32,        // half-size in world units (covers ±extent)\r
  shadowSoftness     : f32,        // PCSS light-size factor (~0.02)\r
  _pad_light         : vec2<f32>,  // padding to align cascadeDepthRanges to 16 bytes (offset 336)\r
  cascadeDepthRanges : vec4<f32>,  // light-space Z depth per cascade (for adaptive depth bias)\r
  cascadeTexelSizes  : vec4<f32>,  // world-space size of one shadow texel per cascade\r
}\r
\r
@group(0) @binding(0) var<uniform> camera: CameraUniforms;\r
@group(0) @binding(1) var<uniform> light : LightUniforms;\r
\r
@group(1) @binding(0) var albedoRoughnessTex: texture_2d<f32>;\r
@group(1) @binding(1) var normalMetallicTex : texture_2d<f32>;\r
@group(1) @binding(2) var depthTex          : texture_depth_2d;\r
@group(1) @binding(3) var shadowMap         : texture_depth_2d_array;\r
@group(1) @binding(4) var shadowSampler     : sampler_comparison;\r
@group(1) @binding(5) var gbufferSampler    : sampler;\r
@group(1) @binding(6) var cloudShadowTex    : texture_2d<f32>;\r
\r
// SSAO + SSGI (group 2)\r
@group(2) @binding(0) var ao_tex   : texture_2d<f32>;\r
@group(2) @binding(1) var ao_samp  : sampler;\r
@group(2) @binding(2) var ssgi_tex : texture_2d<f32>;\r
@group(2) @binding(3) var ssgi_samp: sampler;\r
\r
// IBL (group 3): pre-baked from the physical sky HDR.\r
// irradiance_cube: diffuse integral (cosine-weighted hemisphere), 32×32 per face.\r
// prefilter_cube:  GGX specular pre-filtered, 128×128 base with IBL_MIP_LEVELS mip levels.\r
// brdf_lut:        split-sum A/B (NdotV × roughness → rg), 64×64.\r
const IBL_MIP_LEVELS: f32 = 5.0;   // must match IBL_LEVELS in ibl.ts\r
@group(3) @binding(0) var irradiance_cube: texture_cube<f32>;\r
@group(3) @binding(1) var prefilter_cube : texture_cube<f32>;\r
@group(3) @binding(2) var brdf_lut       : texture_2d<f32>;\r
@group(3) @binding(3) var ibl_samp       : sampler;\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv      : vec2<f32>,\r
}\r
\r
@vertex\r
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {\r
  let x = f32((vid & 1u) << 2u) - 1.0;\r
  let y = f32((vid & 2u) << 1u) - 1.0;\r
  var out: VertexOutput;\r
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);\r
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);\r
  return out;\r
}\r
\r
fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {\r
  let ndc    = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);\r
  let world_h = camera.invViewProj * ndc;\r
  return world_h.xyz / world_h.w;\r
}\r
\r
// === Shadow ===========================================================\r
\r
fn pcf_shadow(cascade: u32, sc: vec3<f32>, bias: f32, kernel_radius: f32, screen_pos: vec2<f32>) -> f32 {\r
  let texel = vec2<f32>(kernel_radius / SHADOW_MAP_SIZE);\r
  let angle = ign(screen_pos) * 6.28318530;\r
  var s = 0.0;\r
  for (var i = 0; i < 16; i++) {\r
    let offset = rotate2d(POISSON16[i], angle) * texel;\r
    let uv = clamp(sc.xy + offset, vec2<f32>(0.0), vec2<f32>(1.0));\r
    s += textureSampleCompareLevel(shadowMap, shadowSampler, uv, i32(cascade), sc.z - bias);\r
  }\r
  return s / 16.0;\r
}\r
\r
// Returns average blocker depth, or -1.0 if receiver is fully lit.\r
fn pcss_blocker_search(cascade: u32, sc: vec3<f32>, search_radius: f32, screen_pos: vec2<f32>) -> f32 {\r
  let texel = vec2<f32>(search_radius / SHADOW_MAP_SIZE);\r
  let angle = ign(screen_pos) * 6.28318530;\r
  var total = 0.0;\r
  var count = 0.0;\r
  for (var i = 0; i < 8; i++) {\r
    let offset = rotate2d(POISSON16[i], angle) * texel;\r
    let uv = clamp(sc.xy + offset, vec2<f32>(0.0), vec2<f32>(1.0));\r
    let tc = clamp(vec2<i32>(uv * SHADOW_MAP_SIZE),\r
                   vec2<i32>(0), vec2<i32>(i32(SHADOW_MAP_SIZE) - 1));\r
    let d = textureLoad(shadowMap, tc, i32(cascade), 0);\r
    if (d < sc.z) {\r
      total += d;\r
      count += 1.0;\r
    }\r
  }\r
  if (count == 0.0) { return -1.0; }\r
  return total / count;\r
}\r
\r
// Returns shadow-space coords for cascade c.  xy in [0,1], z in [0,1] when in-frustum.\r
fn cascade_coords(c: u32, world_pos: vec3<f32>) -> vec3<f32> {\r
  let ls = light.cascadeMatrices[c] * vec4<f32>(world_pos, 1.0);\r
  var sc = ls.xyz / ls.w;\r
  sc = vec3<f32>(sc.xy * 0.5 + 0.5, sc.z);\r
  sc.y = 1.0 - sc.y;\r
  return sc;\r
}\r
\r
fn in_cascade(sc: vec3<f32>) -> bool {\r
  return all(sc.xy >= vec2<f32>(0.0)) && all(sc.xy <= vec2<f32>(1.0))\r
      && sc.z >= 0.0 && sc.z <= 1.0;\r
}\r
\r
fn select_cascade(view_depth: f32) -> u32 {\r
  for (var i = 0u; i < light.cascadeCount; i++) {\r
    if (view_depth < light.cascadeSplits[i]) { return i; }\r
  }\r
  return light.cascadeCount - 1u;\r
}\r
\r
fn shadow_factor(world_pos: vec3<f32>, N: vec3<f32>, NdotL: f32, view_depth: f32, screen_pos: vec2<f32>) -> f32 {\r
  if (light.shadowsEnabled == 0u) { return 1.0; }\r
  let cascade = select_cascade(view_depth);\r
  // Constant receiver bias scaled by surface slope. Independent of per-frame\r
  // cascade depth range so the bias doesn't oscillate as the camera moves.\r
  let bias    = max(0.002 * (1.0 - NdotL), 0.0005);\r
\r
  // Normal bias — offset receiver along its surface normal by a fraction of\r
  // the cascade's world-space texel size, scaled by grazing angle so the\r
  // offset is large where it's needed and zero on directly-lit surfaces.\r
  // Removes the light-parallel component so the offset doesn't fake depth bias.\r
  let L          = normalize(-light.direction);\r
  let t_angle    = clamp(1.0 - max(0.0, NdotL), 0.0, 1.0);\r
  var nb         = N * (light.cascadeTexelSizes[cascade] * 3.0 * t_angle);\r
  nb            -= L * dot(L, nb);\r
  let biased_pos = world_pos + nb;\r
\r
  let sc0 = cascade_coords(cascade, biased_pos);\r
  if (!in_cascade(sc0)) { return 1.0; }\r
\r
  // PCSS with the penumbra estimate computed in WORLD units, then converted\r
  // to per-cascade texels for sampling. This keeps the visual softness\r
  // consistent across cascades, so the blend at the cascade boundary doesn't\r
  // reveal a sudden change in shadow appearance. Min kernel is 1 texel\r
  // per-cascade (sharp default), not a fixed world distance — that would\r
  // force a wide blur on near cascades where one texel is already small.\r
  let SEARCH_WORLD     : f32 = 0.3;   // metres — blocker search radius\r
  let KERNEL_MAX_WORLD : f32 = 1.0;   // metres — caps very soft shadows\r
\r
  let texel_world_0 = light.cascadeTexelSizes[cascade];\r
  let depth_world_0 = light.cascadeDepthRanges[cascade];\r
  let search_tex_0  = clamp(SEARCH_WORLD / texel_world_0, 2.0, 8.0);\r
\r
  var kernel0      = 1.0;\r
  let avg_blocker0 = pcss_blocker_search(cascade, sc0, search_tex_0, screen_pos);\r
  if (avg_blocker0 >= 0.0) {\r
    let occluder_dist = max((sc0.z - avg_blocker0) * depth_world_0, 0.0);\r
    let penumbra_world = min(light.shadowSoftness * occluder_dist, KERNEL_MAX_WORLD);\r
    kernel0 = clamp(penumbra_world / texel_world_0, 1.0, 16.0);\r
  }\r
  let s0 = pcf_shadow(cascade, sc0, bias, kernel0, screen_pos);\r
\r
  let next = cascade + 1u;\r
  if (next < light.cascadeCount) {\r
    let split      = light.cascadeSplits[cascade];\r
    let blend_band = split * 0.2;\r
    let t = smoothstep(split - blend_band, split, view_depth);\r
    if (t > 0.0) {\r
      let sc1 = cascade_coords(next, biased_pos);\r
      // Only blend toward the next cascade if this position is actually inside it;\r
      // blending toward an OOB cascade would mix toward depth=1 (fully lit).\r
      if (in_cascade(sc1)) {\r
        let texel_world_1 = light.cascadeTexelSizes[next];\r
        let depth_world_1 = light.cascadeDepthRanges[next];\r
        let search_tex_1  = clamp(SEARCH_WORLD / texel_world_1, 2.0, 8.0);\r
\r
        var kernel1      = 1.0;\r
        let avg_blocker1 = pcss_blocker_search(next, sc1, search_tex_1, screen_pos);\r
        if (avg_blocker1 >= 0.0) {\r
          let occluder_dist1  = max((sc1.z - avg_blocker1) * depth_world_1, 0.0);\r
          let penumbra_world1 = min(light.shadowSoftness * occluder_dist1, KERNEL_MAX_WORLD);\r
          kernel1 = clamp(penumbra_world1 / texel_world_1, 1.0, 16.0);\r
        }\r
        return mix(s0, pcf_shadow(next, sc1, bias, kernel1, screen_pos), t);\r
      }\r
    }\r
  }\r
  return s0;\r
}\r
\r
// === PBR BRDFs ========================================================\r
\r
fn distribution_ggx(NdotH: f32, roughness: f32) -> f32 {\r
  let a  = roughness * roughness;\r
  let a2 = a * a;\r
  let d  = NdotH * NdotH * (a2 - 1.0) + 1.0;\r
  return a2 / (PI * d * d);\r
}\r
\r
// k for direct lighting: (roughness+1)²/8\r
fn geometry_direct(NdotX: f32, roughness: f32) -> f32 {\r
  let r = roughness + 1.0;\r
  let k = r * r / 8.0;\r
  return NdotX / (NdotX * (1.0 - k) + k);\r
}\r
\r
fn smith_direct(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {\r
  return geometry_direct(NdotV, roughness) * geometry_direct(NdotL, roughness);\r
}\r
\r
fn fresnel_schlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {\r
  return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);\r
}\r
\r
// Roughness-clamped Fresnel for IBL — prevents energy gain at grazing angles on rough metals.\r
fn fresnel_schlick_roughness(cosTheta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {\r
  return F0 + (max(vec3<f32>(1.0 - roughness), F0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);\r
}\r
\r
\r
// === Fragment =========================================================\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let coord = vec2<i32>(in.clip_pos.xy);\r
  let depth = textureLoad(depthTex, coord, 0);\r
\r
  // === Debug: shadow-map depth thumbnails ===================================\r
  // Rendered before the sky discard so they overlay the full screen.\r
  if (light.debugCascades != 0u) {\r
    let screen  = vec2<f32>(textureDimensions(depthTex));\r
    let thumb   = floor(screen.y / 4.0); // square side — 3 thumbnails fit vertically\r
    let sm_size = vec2<f32>(textureDimensions(shadowMap));\r
    let px      = in.clip_pos.xy;\r
\r
    for (var ci = 0u; ci < light.cascadeCount; ci++) {\r
      let x0 = screen.x - thumb;\r
      let y0 = f32(ci) * thumb;\r
      if (px.x >= x0 && px.y >= y0 && px.y < y0 + thumb) {\r
        let uv = (px - vec2<f32>(x0, y0)) / thumb;\r
        // textureLoad avoids the sampler-type conflict (depth textures can't use\r
        // a non-comparison sampler through textureSampleLevel).\r
        let tc = clamp(vec2<i32>(uv * sm_size),\r
                       vec2<i32>(0), vec2<i32>(sm_size) - vec2<i32>(1));\r
        let d = textureLoad(shadowMap, tc, i32(ci), 0);\r
        // 2-pixel border in the cascade's debug color\r
        let border = 2.0;\r
        if (px.x < x0 + border || px.y < y0 + border || px.y > y0 + thumb - border) {\r
          switch ci {\r
            case 0u: { return vec4<f32>(1.0, 0.25, 0.25, 1.0); }\r
            case 1u: { return vec4<f32>(0.25, 1.0, 0.25, 1.0); }\r
            case 2u: { return vec4<f32>(0.25, 0.25, 1.0, 1.0); }\r
            default: { return vec4<f32>(1.0,  1.0,  0.25, 1.0); }\r
          }\r
        }\r
        return vec4<f32>(d, d, d, 1.0);\r
      }\r
    }\r
  }\r
  // ==========================================================================\r
\r
  if (depth >= 1.0) { discard; } // sky pixels handled by SkyPass\r
\r
  let albedo_rough = textureLoad(albedoRoughnessTex, coord, 0);\r
  let normal_emiss = textureLoad(normalMetallicTex,  coord, 0);\r
\r
  let albedo    = albedo_rough.rgb;\r
  let roughness = max(albedo_rough.a, 0.04); // clamp to avoid division issues\r
  let N         = normalize(normal_emiss.rgb * 2.0 - 1.0);\r
  let emission  = normal_emiss.a;\r
  let metallic  = 0.0; // Replaced with emission channel\r
\r
  let world_pos = reconstruct_world_pos(in.uv, depth);\r
  let V         = normalize(camera.position - world_pos);\r
  let NdotV     = max(dot(N, V), 0.001);\r
\r
  // View-space depth for cascade selection\r
  let view_pos   = camera.view * vec4<f32>(world_pos, 1.0);\r
  let view_depth = -view_pos.z;\r
\r
  // Base reflectance: 0.04 for dielectrics, albedo for metals\r
  let F0 = mix(vec3<f32>(0.04), albedo, metallic);\r
\r
  // === Direct lighting (sun) =========================================\r
  let L     = normalize(-light.direction);\r
  let H     = normalize(L + V);\r
  let NdotL = max(dot(N, L), 0.0);\r
  let NdotH = max(dot(N, H), 0.0);\r
  let VdotH = max(dot(V, H), 0.0);\r
\r
  // Smoothly kill sun contribution as it dips below the horizon (L.y = 0).\r
  let horizon_fade = smoothstep(-0.05, 0.05, L.y);\r
\r
  let D  = distribution_ggx(NdotH, roughness);\r
  let G  = smith_direct(NdotV, NdotL, roughness);\r
  let Fd = fresnel_schlick(VdotH, F0);\r
\r
  let kS_direct = Fd;\r
  let kD_direct = (vec3<f32>(1.0) - kS_direct) * (1.0 - metallic);\r
\r
  let specular_brdf = D * G * Fd / max(4.0 * NdotV * NdotL, 0.001);\r
  let diffuse_brdf  = kD_direct * albedo / PI;\r
\r
  let shad = shadow_factor(world_pos, N, NdotL, view_depth, in.clip_pos.xy);\r
\r
  // Cloud shadow — sample top-down transmittance map; default 1.0 when extent is zero\r
  let cloud_ext = max(light.cloudShadowExtent, 0.001);\r
  let cloud_uv  = (world_pos.xz - light.cloudShadowOrigin) / (cloud_ext * 2.0) + 0.5;\r
  // Fade cloud shadow to 1.0 (no shadow) in the outer 10% of the map to hide the\r
  // hard edge where the shadow map repeats its border.\r
  var cloud_edge = min(cloud_uv.x, 1.0 - cloud_uv.x);\r
  cloud_edge = min(cloud_edge, min(cloud_uv.y, 1.0 - cloud_uv.y));\r
  let cloud_fade = saturate(cloud_edge * 10.0);\r
  let cloud_raw  = textureSampleLevel(cloudShadowTex, gbufferSampler, clamp(cloud_uv, vec2<f32>(0.0), vec2<f32>(1.0)), 0.0).r;\r
  let cloud_shadow = select(mix(1.0, cloud_raw, cloud_fade), 1.0, light.cloudShadowExtent <= 0.0);\r
\r
  let direct = (diffuse_brdf + specular_brdf) * light.color * light.intensity * NdotL * shad * cloud_shadow * horizon_fade;\r
\r
  // === IBL Ambient ====================================================\r
  let ao = textureSampleLevel(ao_tex, ao_samp, in.uv, 0.0).r;\r
\r
  // Roughness-corrected Fresnel — avoids energy gain on rough metals at grazing angles.\r
  let kS_ibl = fresnel_schlick_roughness(NdotV, F0, roughness);\r
  let kD_ibl = (vec3<f32>(1.0) - kS_ibl) * (1.0 - metallic);\r
\r
  // Diffuse IBL: cosine-weighted hemisphere integral baked into irradiance cube.\r
  let irradiance  = textureSampleLevel(irradiance_cube, ibl_samp, N, 0.0).rgb;\r
  let diffuse_ibl = irradiance * albedo * kD_ibl;\r
\r
  // Specular IBL: GGX pre-filtered env + split-sum BRDF LUT.\r
  let R           = reflect(-V, N);\r
  let prefiltered = textureSampleLevel(prefilter_cube, ibl_samp, R, roughness * (IBL_MIP_LEVELS - 1.0)).rgb;\r
  let brdf        = textureSampleLevel(brdf_lut, ibl_samp, vec2<f32>(NdotV, roughness), 0.0).rg;\r
  let specular_ibl = 0.0;//prefiltered * (kS_ibl * brdf.x + brdf.y);\r
\r
  // Shadow-darken ambient during the day; at night remove shadow influence.\r
  let shadow_scale = mix(1.0, max(shad, 0.05), horizon_fade);\r
  // Scale by AO and shadow; fade IBL with sun so it doesn't blast at night.\r
  // Add a tiny constant for moonlight/starlight so the world isn't pitch black.\r
  let ambient = (diffuse_ibl + specular_ibl) * ao * shadow_scale * horizon_fade\r
              + albedo * (1.0 - metallic) * 0.01;\r
\r
  // SSGI: one-bounce diffuse indirect from screen-space ray march\r
  let ssgi_irr     = textureSampleLevel(ssgi_tex, ssgi_samp, in.uv, 0.0).rgb;\r
  let ssgi_contrib = ssgi_irr * albedo * (1.0 - metallic);\r
\r
  // Add emission (scaled by albedo for colored glow)\r
  let emissive = albedo * emission * 2.0;\r
\r
  let color = direct + ambient + ssgi_contrib + emissive;\r
\r
  if (light.debugCascades != 0u) {\r
    let cascade = select_cascade(view_depth);\r
    var tint: vec3<f32>;\r
    switch cascade {\r
      case 0u:    { tint = vec3<f32>(1.0, 0.25, 0.25); } // red   = near\r
      case 1u:    { tint = vec3<f32>(0.25, 1.0, 0.25); } // green = mid\r
      case 2u:    { tint = vec3<f32>(0.25, 0.25, 1.0); } // blue  = far\r
      default:    { tint = vec3<f32>(1.0,  1.0,  0.25); } // yellow = beyond\r
    }\r
    let shad = shadow_factor(world_pos, N, NdotL, view_depth, in.clip_pos.xy);\r
    return vec4<f32>(tint * mix(0.15, 1.0, shad), 1.0);\r
  }\r
\r
  let sun_dir_fog = normalize(-light.direction);\r
  let cam_h_fog   = max(camera.position.y, 1.0);\r
  let haze = apply_aerial_perspective(color, world_pos, sun_dir_fog, cam_h_fog);\r
  return vec4<f32>(haze, 1.0);\r
}\r
`,B="rgba16float",N=64*4+16+16,I=368;class O extends G{constructor(r,n,e,i,o,l,t,d,s,h,u,c,p,_,y,m,b,v){super();a(this,"name","DeferredLightingPass");a(this,"hdrTexture");a(this,"hdrView");a(this,"cameraBuffer");a(this,"lightBuffer");a(this,"_pipeline");a(this,"_sceneBindGroup");a(this,"_gbufferBindGroup");a(this,"_aoBindGroup");a(this,"_iblBindGroup");a(this,"_defaultCloudShadow");a(this,"_defaultSsgi");a(this,"_defaultIblCube");a(this,"_defaultBrdfLut");a(this,"_device");a(this,"_aoBGL");a(this,"_aoView");a(this,"_aoSampler");a(this,"_ssgiSampler");a(this,"_cameraScratch",new Float32Array(N/4));a(this,"_lightScratch",new Float32Array(I/4));a(this,"_lightScratchU",new Uint32Array(this._lightScratch.buffer));a(this,"_cloudShadowScratch",new Float32Array(3));this.hdrTexture=r,this.hdrView=n,this._pipeline=e,this._sceneBindGroup=i,this._gbufferBindGroup=o,this._aoBindGroup=l,this._iblBindGroup=t,this.cameraBuffer=d,this.lightBuffer=s,this._defaultCloudShadow=h,this._defaultSsgi=u,this._defaultIblCube=c,this._defaultBrdfLut=p,this._device=_,this._aoBGL=y,this._aoView=m,this._aoSampler=b,this._ssgiSampler=v}static create(r,n,e,i,o,l){const{device:t,width:d,height:s}=r,h=t.createTexture({label:"HDR Texture",size:{width:d,height:s},format:B,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),u=h.createView(),c=t.createBuffer({label:"LightCameraBuffer",size:N,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=t.createBuffer({label:"LightBuffer",size:I,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=t.createSampler({label:"ShadowSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),y=t.createSampler({label:"GBufferLinearSampler",magFilter:"linear",minFilter:"linear"}),m=t.createSampler({label:"AoSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),b=t.createSampler({label:"SsgiSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=t.createBindGroupLayout({label:"LightSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),M=t.createBindGroupLayout({label:"LightGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth",viewDimension:"2d-array"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"comparison"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),x=t.createTexture({label:"DefaultCloudShadow",size:{width:1,height:1},format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});t.queue.writeTexture({texture:x},new Uint8Array([255]),{bytesPerRow:1},{width:1,height:1});const H=o??x.createView(),S=t.createBindGroupLayout({label:"LightAoBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),T=t.createTexture({label:"DefaultSsgi",size:{width:1,height:1},format:B,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),R=t.createBindGroupLayout({label:"LightIblBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),X=t.createSampler({label:"IblSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),L=t.createTexture({label:"DefaultIblCube",size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),A=L.createView({dimension:"cube"}),U=t.createTexture({label:"DefaultBrdfLut",size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),W=t.createBindGroup({label:"LightIblBG",layout:R,entries:[{binding:0,resource:(l==null?void 0:l.irradianceView)??A},{binding:1,resource:(l==null?void 0:l.prefilteredView)??A},{binding:2,resource:(l==null?void 0:l.brdfLutView)??U.createView()},{binding:3,resource:X}]}),q=t.createBindGroup({layout:v,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:p}}]}),Z=t.createBindGroup({layout:M,entries:[{binding:0,resource:n.albedoRoughnessView},{binding:1,resource:n.normalMetallicView},{binding:2,resource:n.depthView},{binding:3,resource:e.shadowMapView},{binding:4,resource:_},{binding:5,resource:y},{binding:6,resource:H}]}),Y=t.createBindGroup({label:"LightAoBG",layout:S,entries:[{binding:0,resource:i},{binding:1,resource:m},{binding:2,resource:T.createView()},{binding:3,resource:b}]}),E=t.createShaderModule({label:"LightingShader",code:ee}),j=t.createRenderPipeline({label:"LightingPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[v,M,S,R]}),vertex:{module:E,entryPoint:"vs_main"},fragment:{module:E,entryPoint:"fs_main",targets:[{format:B}]},primitive:{topology:"triangle-list"}});return new O(h,u,j,q,Z,Y,W,c,p,o?null:x,T,l?null:L,l?null:U,t,S,i,m,b)}updateSSGI(r){this._aoBindGroup=this._device.createBindGroup({label:"LightAoBG",layout:this._aoBGL,entries:[{binding:0,resource:this._aoView},{binding:1,resource:this._aoSampler},{binding:2,resource:r},{binding:3,resource:this._ssgiSampler}]})}updateCamera(r,n,e,i,o,l,t,d){const s=this._cameraScratch;s.set(n.data,0),s.set(e.data,16),s.set(i.data,32),s.set(o.data,48),s[64]=l.x,s[65]=l.y,s[66]=l.z,s[67]=t,s[68]=d,r.queue.writeBuffer(this.cameraBuffer,0,s.buffer)}updateLight(r,n,e,i,o,l=!0,t=!1,d=.02){const s=this._lightScratch,h=this._lightScratchU;let u=0;s[u++]=n.x,s[u++]=n.y,s[u++]=n.z,s[u++]=i,s[u++]=e.x,s[u++]=e.y,s[u++]=e.z,h[u++]=o.length;for(let c=0;c<4;c++)c<o.length&&s.set(o[c].lightViewProj.data,u),u+=16;for(let c=0;c<4;c++)s[u++]=c<o.length?o[c].splitFar:1e9;h[u]=l?1:0,h[u+1]=t?1:0,s[81]=d;for(let c=0;c<4;c++)s[84+c]=c<o.length?o[c].depthRange:1;for(let c=0;c<4;c++)s[88+c]=c<o.length?o[c].texelWorldSize:1;r.queue.writeBuffer(this.lightBuffer,0,s.buffer)}updateCloudShadow(r,n,e,i){const o=this._cloudShadowScratch;o[0]=n,o[1]=e,o[2]=i,r.queue.writeBuffer(this.lightBuffer,312,o.buffer)}execute(r,n){const e=r.beginRenderPass({label:"DeferredLightingPass",colorAttachments:[{view:this.hdrView,loadOp:"load",storeOp:"store"}]});e.setPipeline(this._pipeline),e.setBindGroup(0,this._sceneBindGroup),e.setBindGroup(1,this._gbufferBindGroup),e.setBindGroup(2,this._aoBindGroup),e.setBindGroup(3,this._iblBindGroup),e.draw(3),e.end()}destroy(){var r,n,e,i;this.hdrTexture.destroy(),this.cameraBuffer.destroy(),this.lightBuffer.destroy(),(r=this._defaultCloudShadow)==null||r.destroy(),(n=this._defaultSsgi)==null||n.destroy(),(e=this._defaultIblCube)==null||e.destroy(),(i=this._defaultBrdfLut)==null||i.destroy()}}const V=64*4+16+16,re=128;class k extends G{constructor(r,n,e,i,o){super();a(this,"name","GeometryPass");a(this,"_gbuffer");a(this,"_cameraBGL");a(this,"_modelBGL");a(this,"_pipelineCache",new Map);a(this,"_cameraBuffer");a(this,"_cameraBindGroup");a(this,"_modelBuffers",[]);a(this,"_modelBindGroups",[]);a(this,"_drawItems",[]);a(this,"_modelData",new Float32Array(32));a(this,"_cameraScratch",new Float32Array(V/4));this._gbuffer=r,this._cameraBGL=n,this._modelBGL=e,this._cameraBuffer=i,this._cameraBindGroup=o}static create(r,n){const{device:e}=r,i=e.createBindGroupLayout({label:"GeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),o=e.createBindGroupLayout({label:"GeomModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),l=e.createBuffer({label:"GeomCameraBuffer",size:V,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),t=e.createBindGroup({label:"GeomCameraBindGroup",layout:i,entries:[{binding:0,resource:{buffer:l}}]});return new k(n,i,o,l,t)}setDrawItems(r){this._drawItems=r}updateCamera(r,n,e,i,o,l,t,d){const s=this._cameraScratch;s.set(n.data,0),s.set(e.data,16),s.set(i.data,32),s.set(o.data,48),s[64]=l.x,s[65]=l.y,s[66]=l.z,s[67]=t,s[68]=d,r.queue.writeBuffer(this._cameraBuffer,0,s.buffer)}execute(r,n){var o,l;const{device:e}=n;this._ensurePerDrawBuffers(e,this._drawItems.length);for(let t=0;t<this._drawItems.length;t++){const d=this._drawItems[t],s=this._modelData;s.set(d.modelMatrix.data,0),s.set(d.normalMatrix.data,16),n.queue.writeBuffer(this._modelBuffers[t],0,s.buffer),(l=(o=d.material).update)==null||l.call(o,n.queue)}const i=r.beginRenderPass({label:"GeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},{view:this._gbuffer.normalMetallicView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});i.setBindGroup(0,this._cameraBindGroup);for(let t=0;t<this._drawItems.length;t++){const d=this._drawItems[t];i.setPipeline(this._getPipeline(e,d.material)),i.setBindGroup(1,this._modelBindGroups[t]),i.setBindGroup(2,d.material.getBindGroup(e)),i.setVertexBuffer(0,d.mesh.vertexBuffer),i.setIndexBuffer(d.mesh.indexBuffer,"uint32"),i.drawIndexed(d.mesh.indexCount)}i.end()}_getPipeline(r,n){let e=this._pipelineCache.get(n.shaderId);if(e)return e;const i=r.createShaderModule({label:`GeometryShader[${n.shaderId}]`,code:n.getShaderCode(Q.Geometry)});return e=r.createRenderPipeline({label:`GeometryPipeline[${n.shaderId}]`,layout:r.createPipelineLayout({bindGroupLayouts:[this._cameraBGL,this._modelBGL,n.getBindGroupLayout(r)]}),vertex:{module:i,entryPoint:"vs_main",buffers:[{arrayStride:C,attributes:D}]},fragment:{module:i,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),this._pipelineCache.set(n.shaderId,e),e}_ensurePerDrawBuffers(r,n){for(;this._modelBuffers.length<n;){const e=r.createBuffer({size:re,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(e),this._modelBindGroups.push(r.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:e}}]}))}}destroy(){this._cameraBuffer.destroy();for(const r of this._modelBuffers)r.destroy()}}export{O as D,z as G,B as H,F as S,k as a};
