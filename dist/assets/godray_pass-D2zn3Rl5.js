var q=Object.defineProperty;var W=(f,l,t)=>l in f?q(f,l,{enumerable:!0,configurable:!0,writable:!0,value:t}):f[l]=t;var r=(f,l,t)=>W(f,typeof l!="symbol"?l+"":l,t);import{a as H}from"./mesh-LUU9vCQq.js";import{H as M}from"./geometry_pass-Bbprt9rQ.js";const Y=`// Physically based single-scattering atmosphere (Rayleigh + Mie).\r
// Reference: Nishita 1993, Preetham 1999, Hillaire 2020 (simplified).\r
//\r
// World units are metres.  The ground sits at y ≈ 0 so the camera is placed at\r
// (0, R_E + cameraPos.y, 0) in atmosphere space.\r
\r
const PI    : f32 = 3.14159265358979;\r
const R_E   : f32 = 6360000.0;   // Earth radius (m)\r
const R_A   : f32 = 6420000.0;   // Atmosphere top radius (m)\r
const H_R   : f32 = 8500.0;      // Rayleigh scale height (m)\r
const H_M   : f32 = 1200.0;      // Mie scale height (m)\r
const G     : f32 = 0.758;       // Mie anisotropy (forward-scattering haze)\r
// Rayleigh coefficients (per metre) tuned to 680 / 550 / 440 nm wavelengths.\r
const BETA_R : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);\r
// Mie coefficient (per metre, wavelength-independent for haze).\r
const BETA_M : f32 = 21.0e-6;\r
// Solar irradiance at top of atmosphere (in renderer HDR units).\r
const SUN_INTENSITY : f32 = 20.0;\r
// Angular cosine thresholds for sun and moon disks.\r
const SUN_COS_THRESH  : f32 = 0.9996;   // ~1.6° angular radius (~3× real sun)\r
const MOON_COS_THRESH : f32 = 0.9997;   // slightly smaller than sun\r
\r
struct Uniforms {\r
  invViewProj : mat4x4<f32>,\r
  cameraPos   : vec3<f32>,\r
  _pad0       : f32,\r
  sunDir      : vec3<f32>,  // unit vector pointing TOWARD the sun\r
  _pad1       : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> u: Uniforms;\r
\r
// Ray–sphere intersection.  Returns (tNear, tFar); both negative means no hit.\r
fn raySphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {\r
  let b  = dot(ro, rd);\r
  let c  = dot(ro, ro) - r * r;\r
  let d  = b * b - c;\r
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }\r
  let sq = sqrt(d);\r
  return vec2<f32>(-b - sq, -b + sq);\r
}\r
\r
fn phaseR(mu: f32) -> f32 {\r
  return (3.0 / (16.0 * PI)) * (1.0 + mu * mu);\r
}\r
\r
fn phaseM(mu: f32) -> f32 {\r
  let g2 = G * G;\r
  return (3.0 / (8.0 * PI)) *\r
         ((1.0 - g2) * (1.0 + mu * mu)) /\r
         ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * G * mu, 1e-4), 1.5));\r
}\r
\r
// Optical depth from \`pos\` toward \`dir\` through the atmosphere.\r
fn opticalDepthToSky(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {\r
  let t  = raySphere(pos, dir, R_A);\r
  let ds = t.y / 8.0;\r
  var od = vec2<f32>(0.0);\r
  for (var i = 0; i < 8; i++) {\r
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - R_E;\r
    if (h < 0.0) { break; }\r
    od += vec2<f32>(exp(-h / H_R), exp(-h / H_M)) * ds;\r
  }\r
  return od;\r
}\r
\r
// Transmittance of the atmosphere from \`ro\` in direction \`rd\` (used for the sun disk).\r
fn transmittance(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {\r
  let od = opticalDepthToSky(ro, rd);\r
  return exp(-(BETA_R * od.x + BETA_M * 1.1 * od.y));\r
}\r
\r
// Single-scattering integral along the view ray.\r
fn scatter(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {\r
  let ta   = raySphere(ro, rd, R_A);\r
  let tMin = max(ta.x, 0.0);\r
  if (ta.y < 0.0) { return vec3<f32>(0.0); }\r
\r
  // Clip view ray at the ground surface.\r
  let tg   = raySphere(ro, rd, R_E);\r
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);\r
  if (tMax <= tMin) { return vec3<f32>(0.0); }\r
\r
  let mu = dot(rd, u.sunDir);\r
  let pR = phaseR(mu);\r
  let pM = phaseM(mu);\r
\r
  let ds = (tMax - tMin) / 16.0;\r
  var sumR = vec3<f32>(0.0);\r
  var sumM = vec3<f32>(0.0);\r
  var odR  = 0.0;\r
  var odM  = 0.0;\r
\r
  for (var i = 0; i < 16; i++) {\r
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);\r
    let h   = length(pos) - R_E;\r
    if (h < 0.0) { break; }\r
\r
    let hrh = exp(-h / H_R) * ds;\r
    let hmh = exp(-h / H_M) * ds;\r
    odR += hrh;\r
    odM += hmh;\r
\r
    // Light ray toward the sun — skip if blocked by Earth.\r
    let tg2 = raySphere(pos, u.sunDir, R_E);\r
    if (tg2.x > 0.0) { continue; }\r
\r
    let odL = opticalDepthToSky(pos, u.sunDir);\r
\r
    let tau = BETA_R * (odR + odL.x) + BETA_M * 1.1 * (odM + odL.y);\r
    let T   = exp(-tau);\r
    sumR += T * hrh;\r
    sumM += T * hmh;\r
  }\r
\r
  return SUN_INTENSITY * (BETA_R * pR * sumR + vec3<f32>(BETA_M) * pM * sumM);\r
}\r
\r
// --- Vertex shader (fullscreen triangle) ---\r
\r
struct VertOut {\r
  @builtin(position) clip_pos : vec4<f32>,\r
  @location(0)       uv       : vec2<f32>,\r
}\r
\r
@vertex\r
fn vs_main(@builtin(vertex_index) vid: u32) -> VertOut {\r
  let x = f32((vid & 1u) << 2u) - 1.0;\r
  let y = f32((vid & 2u) << 1u) - 1.0;\r
  var out: VertOut;\r
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);\r
  out.uv       = vec2<f32>(x * 0.5 + 0.5, y * -0.5 + 0.5);\r
  return out;\r
}\r
\r
@fragment\r
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {\r
  // Reconstruct world-space view direction.\r
  let ndc = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);\r
  let wh  = u.invViewProj * ndc;\r
  let rd  = normalize(wh.xyz / wh.w - u.cameraPos);\r
\r
  // Place camera on Earth's surface (world y ≈ metres above sea level).\r
  let camH = max(u.cameraPos.y, 1.0);\r
  let ro   = vec3<f32>(0.0, R_E + camH, 0.0);\r
\r
  var color = scatter(ro, rd);\r
\r
  // Sun disk: bright limb attenuated by atmosphere transmittance.\r
  if (dot(rd, u.sunDir) > SUN_COS_THRESH) {\r
    color += transmittance(ro, u.sunDir) * 1000.0;\r
  }\r
\r
  // Moon disk: antipodal to the sun, fades in after sunset.\r
  // SUN_COS_THRESH gives the same ~0.36° angular radius as the sun.\r
  let moonDir = -u.sunDir;\r
  if (dot(rd, moonDir) > MOON_COS_THRESH) {\r
    let night_t = saturate((-u.sunDir.y - 0.05) * 10.0);\r
    color += transmittance(ro, moonDir) * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;\r
  }\r
\r
  return vec4<f32>(color, 1.0);\r
}\r
`,z=96;class C extends H{constructor(t,a,e,o){super();r(this,"name","AtmospherePass");r(this,"_pipeline");r(this,"_uniformBuf");r(this,"_bg");r(this,"_hdrView");r(this,"_scratch",new Float32Array(z/4));this._pipeline=t,this._uniformBuf=a,this._bg=e,this._hdrView=o}static create(t,a){const{device:e}=t,o=e.createBuffer({label:"AtmosphereUniform",size:z,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=e.createBindGroupLayout({label:"AtmosphereBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),c=e.createBindGroup({label:"AtmosphereBG",layout:i,entries:[{binding:0,resource:{buffer:o}}]}),s=e.createShaderModule({label:"AtmosphereShader",code:Y}),n=e.createRenderPipeline({label:"AtmospherePipeline",layout:e.createPipelineLayout({bindGroupLayouts:[i]}),vertex:{module:s,entryPoint:"vs_main"},fragment:{module:s,entryPoint:"fs_main",targets:[{format:M}]},primitive:{topology:"triangle-list"}});return new C(n,o,c,a)}update(t,a,e,o){const i=this._scratch;i.set(a.data,0),i[16]=e.x,i[17]=e.y,i[18]=e.z;const c=Math.sqrt(o.x*o.x+o.y*o.y+o.z*o.z),s=c>0?1/c:0;i[20]=-o.x*s,i[21]=-o.y*s,i[22]=-o.z*s,t.queue.writeBuffer(this._uniformBuf,0,i.buffer)}execute(t,a){const e=t.beginRenderPass({label:"AtmospherePass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._pipeline),e.setBindGroup(0,this._bg),e.draw(3),e.end()}destroy(){this._uniformBuf.destroy()}}const j=`// godray_march.wgsl — Half-resolution ray-march pass with 3D cloud-density shadowing\r
\r
const PI: f32 = 3.14159265358979;\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv      : vec2<f32>,\r
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
  cloudShadowOrigin : vec2<f32>,\r
  cloudShadowExtent : f32,\r
  shadowSoftness    : f32,\r
  _pad_light        : vec2<f32>,\r
  cascadeDepthRanges: vec4<f32>,\r
}\r
\r
struct MarchParams {\r
  scattering: f32,\r
  max_steps : f32,\r
  _pad0     : f32,\r
  _pad1     : f32,\r
}\r
\r
struct CloudDensityUniforms {\r
  cloudBase : f32,\r
  cloudTop  : f32,\r
  coverage  : f32,\r
  density   : f32,\r
  windOffset: vec2<f32>,\r
  extinction: f32,\r
  _pad0     : f32,\r
  _pad1     : f32,\r
  _pad2     : f32,\r
  _pad3     : f32,\r
  _pad4     : f32,\r
  _pad5     : f32,\r
  _pad6     : f32,\r
  _pad7     : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> camera         : CameraUniforms;\r
@group(0) @binding(1) var<uniform> light           : LightUniforms;\r
@group(0) @binding(2) var          depth_tex       : texture_depth_2d;\r
@group(0) @binding(3) var          shadow_map      : texture_depth_2d_array;\r
@group(0) @binding(4) var          shadow_samp     : sampler_comparison;\r
@group(0) @binding(5) var<uniform> march_params    : MarchParams;\r
@group(0) @binding(6) var<uniform> cloud_density   : CloudDensityUniforms;\r
@group(0) @binding(7) var          base_noise      : texture_3d<f32>;\r
@group(0) @binding(8) var          detail_noise    : texture_3d<f32>;\r
@group(0) @binding(9) var          noise_samp      : sampler;\r
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
fn henyey_greenstein(cos_theta: f32, g: f32) -> f32 {\r
  let k = 0.0795774715459;\r
  return k * (1.0 - g * g) / pow(max(1.0 + g * g - 2.0 * g * cos_theta, 1e-4), 1.5);\r
}\r
\r
fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {\r
  let ndc     = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);\r
  let world_h = camera.invViewProj * ndc;\r
  return world_h.xyz / world_h.w;\r
}\r
\r
fn select_cascade(view_depth: f32) -> u32 {\r
  for (var i = 0u; i < light.cascadeCount; i++) {\r
    if (view_depth < light.cascadeSplits[i]) { return i; }\r
  }\r
  return light.cascadeCount - 1u;\r
}\r
\r
fn shadow_at(world_pos: vec3<f32>) -> f32 {\r
  if (light.shadowsEnabled == 0u) { return 1.0; }\r
  let view_pos   = camera.view * vec4<f32>(world_pos, 1.0);\r
  let view_depth = -view_pos.z;\r
  let cascade    = select_cascade(view_depth);\r
\r
  let ls  = light.cascadeMatrices[cascade] * vec4<f32>(world_pos, 1.0);\r
  var sc  = ls.xyz / ls.w;\r
  sc      = vec3<f32>(sc.xy * 0.5 + 0.5, sc.z);\r
  sc.y    = 1.0 - sc.y;\r
  if (any(sc.xy < vec2<f32>(0.0)) || any(sc.xy > vec2<f32>(1.0)) || sc.z > 1.0) {\r
    return 1.0;\r
  }\r
  return textureSampleCompareLevel(shadow_map, shadow_samp, sc.xy, i32(cascade), sc.z - 0.005);\r
}\r
\r
fn dither(uv: vec2<f32>) -> f32 {\r
  return fract(sin(dot(uv, vec2<f32>(41.0, 289.0))) * 45758.5453);\r
}\r
\r
// ---- Cloud density helpers (mirrors cloud_shadow.wgsl) -----------------------\r
\r
const ROT_C: f32 = 0.79863551;\r
const ROT_S: f32 = 0.60181502;\r
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {\r
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);\r
}\r
\r
fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {\r
  return clamp(a + (v - lo) / max(hi - lo, 0.0001) * (b - a), a, b);\r
}\r
\r
fn height_gradient(y: f32) -> f32 {\r
  let t    = clamp((y - cloud_density.cloudBase) / max(cloud_density.cloudTop - cloud_density.cloudBase, 0.001), 0.0, 1.0);\r
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);\r
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);\r
  return saturate(base * top);\r
}\r
\r
fn sample_density(world_pos: vec3<f32>) -> f32 {\r
  let pr = rotate_xz(world_pos);\r
  let scale = 0.04;\r
  let base_uv = (pr + vec3<f32>(cloud_density.windOffset.x, 0.0, cloud_density.windOffset.y)) * scale;\r
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);\r
\r
  let pw = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;\r
  let hg = height_gradient(world_pos.y);\r
  let cov = saturate(remap(pw, 1.0 - cloud_density.coverage, 1.0, 0.0, 1.0)) * hg;\r
  if (cov < 0.001) { return 0.0; }\r
\r
  let detail_scale = 0.12;\r
  let detail_uv = pr * detail_scale + vec3<f32>(cloud_density.windOffset.x, 0.0, cloud_density.windOffset.y) * 0.1;\r
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);\r
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;\r
\r
  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud_density.density;\r
}\r
\r
// Integrates cloud density vertically above p through the full cloud slab.\r
// Returns the Beer's-law transmittance (1 = fully transparent, 0 = fully opaque).\r
fn cloud_shadow_vertical(p: vec3<f32>) -> f32 {\r
  let start_y = max(p.y, cloud_density.cloudBase);\r
  if (start_y >= cloud_density.cloudTop) { return 1.0; }\r
  let range = cloud_density.cloudTop - start_y;\r
  let num_steps = 4u;\r
  let step_size = range / f32(num_steps);\r
  var opt_depth = 0.0;\r
  for (var i = 0u; i < num_steps; i++) {\r
    let y = start_y + (f32(i) + 0.5) * step_size;\r
    opt_depth += sample_density(vec3<f32>(p.x, y, p.z)) * step_size;\r
  }\r
  return exp(-opt_depth * cloud_density.extinction);\r
}\r
\r
// ---- Fragment shader ---------------------------------------------------------\r
\r
@fragment\r
fn fs_march(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let depth_size = vec2<i32>(textureDimensions(depth_tex));\r
  let coord      = clamp(vec2<i32>(in.uv * vec2<f32>(depth_size)),\r
                         vec2<i32>(0), depth_size - vec2<i32>(1));\r
  let depth = textureLoad(depth_tex, coord, 0u);\r
\r
  let hit_depth = select(depth, 1.0, depth >= 1.0);\r
  let world_pos = reconstruct_world_pos(in.uv, hit_depth);\r
  let ray_vec   = world_pos - camera.position;\r
  let ray_len   = length(ray_vec);\r
  let ray_dir   = ray_vec / max(ray_len, 0.001);\r
\r
  let steps     = u32(march_params.max_steps);\r
  let step_len  = ray_len / f32(steps);\r
  let dith      = dither(in.uv) * step_len;\r
  var pos       = camera.position + ray_dir * dith;\r
\r
  let sun_dir   = normalize(-light.direction);\r
  let cos_theta = dot(ray_dir, sun_dir);\r
  let phase     = henyey_greenstein(cos_theta, march_params.scattering);\r
\r
  var accum = 0.0;\r
  for (var i = 0u; i < steps; i++) {\r
    let shad     = shadow_at(pos);\r
    let trans    = cloud_shadow_vertical(pos);\r
    accum += phase * shad * trans;\r
    pos   += ray_dir * step_len;\r
  }\r
\r
  let fog = clamp(accum / f32(steps), 0.0, 1.0);\r
  return vec4<f32>(fog, 0.0, 0.0, 1.0);\r
}\r
`,X=`// godray_composite.wgsl — Blur and composite passes for volumetric godrays.\r
//\r
// fs_blur: bilateral depth-aware Gaussian blur of the half-res fog texture\r
//          (run twice — horizontal then vertical — using the blur_dir uniform).\r
//\r
// fs_composite: depth-aware upsampling from half-res fog to full-res, followed\r
//               by an additive blend of (fog × sun color × sun intensity) onto\r
//               the HDR render target.  Uses pipeline blend state (one+one) so\r
//               the fragment only needs to output the additive contribution.\r
//\r
// Bindings 0-3 are used by both entry points; binding 4 (light) is composite-only.\r
// With layout:'auto' each pipeline derives its own BGL from the entry point's\r
// static usage, so blur and composite bind groups can be created independently.\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv      : vec2<f32>,\r
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
  cloudShadowOrigin : vec2<f32>,\r
  cloudShadowExtent : f32,\r
  shadowSoftness    : f32,\r
  _pad_light        : vec2<f32>,\r
  cascadeDepthRanges: vec4<f32>,\r
}\r
\r
// Shared by blur and composite — blur uses blur_dir, composite uses fog_curve.\r
struct Params {\r
  blur_dir  : vec2<f32>,  // (1,0) for horizontal, (0,1) for vertical; ignored by composite\r
  fog_curve : f32,        // power applied to fog before compositing; ignored by blur\r
  _pad      : f32,\r
}\r
\r
@group(0) @binding(0) var          fog_tex  : texture_2d<f32>;\r
@group(0) @binding(1) var          depth_tex: texture_depth_2d;\r
@group(0) @binding(2) var          samp     : sampler;\r
@group(0) @binding(3) var<uniform> params   : Params;\r
@group(0) @binding(4) var<uniform> light    : LightUniforms; // composite only\r
\r
fn depth_load(uv: vec2<f32>) -> f32 {\r
  let size  = vec2<i32>(textureDimensions(depth_tex));\r
  let coord = clamp(vec2<i32>(uv * vec2<f32>(size)), vec2<i32>(0), size - vec2<i32>(1));\r
  return textureLoad(depth_tex, coord, 0u);\r
}\r
\r
// Gaussian half-kernel (center..edge, index = abs(tap offset)).\r
// Sum of symmetric 7-tap (±3) with these weights ≈ 1.\r
const GAUSS: array<f32, 4> = array<f32, 4>(\r
  0.19638062, 0.17469900, 0.12161760, 0.06706740,\r
);\r
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
// ---- Blur pass ---------------------------------------------------------------\r
\r
@fragment\r
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {\r
  // Step size in UV space: one fog texel in the blur direction.\r
  let texel  = 1.0 / vec2<f32>(textureDimensions(fog_tex));\r
  let step   = params.blur_dir * texel;\r
  let depth0 = depth_load(in.uv);\r
\r
  var accum  = 0.0;\r
  var weight = 0.0;\r
  for (var i: i32 = -3; i <= 3; i++) {\r
    let uv_off  = in.uv + step * f32(i);\r
    let depth_s = depth_load(uv_off);\r
    let fog_s   = textureSampleLevel(fog_tex,   samp, uv_off, 0.0).r;\r
    // Depth-aware bilateral weight: suppress blur across depth discontinuities.\r
    let d_wt  = exp(-abs(depth_s - depth0) * 1000.0);\r
    let w     = GAUSS[abs(i)] * d_wt;\r
    accum  += w * fog_s;\r
    weight += w;\r
  }\r
  return vec4<f32>(accum / max(weight, 1e-5), 0.0, 0.0, 1.0);\r
}\r
\r
// ---- Composite pass ----------------------------------------------------------\r
\r
@fragment\r
fn fs_composite(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let depth0 = depth_load(in.uv);\r
\r
  // Sky pixels: sample fog directly without depth-aware neighbor logic.\r
  if (depth0 >= 1.0) {\r
    var fog = textureSampleLevel(fog_tex, samp, in.uv, 0.0).r;\r
    fog = pow(max(fog, 0.0), params.fog_curve);\r
    let horizon_fade = smoothstep(-0.05, 0.05, -light.direction.y);\r
    let fog_color = light.color * light.intensity * fog * horizon_fade;\r
    return vec4<f32>(fog_color, 0.0);\r
  }\r
\r
  // Depth-aware upsampling: among the four half-res neighbours, pick the one\r
  // whose depth is closest to this full-res pixel to avoid bleeding across edges.\r
  let fog_texel = 1.0 / vec2<f32>(textureDimensions(fog_tex));\r
\r
  let d1 = depth_load(in.uv + vec2<f32>( fog_texel.x, 0.0));\r
  let d2 = depth_load(in.uv + vec2<f32>(-fog_texel.x, 0.0));\r
  let d3 = depth_load(in.uv + vec2<f32>(0.0,  fog_texel.y));\r
  let d4 = depth_load(in.uv + vec2<f32>(0.0, -fog_texel.y));\r
\r
  let e1 = abs(depth0 - d1); let e2 = abs(depth0 - d2);\r
  let e3 = abs(depth0 - d3); let e4 = abs(depth0 - d4);\r
  let dmin = min(min(e1, e2), min(e3, e4));\r
\r
  var offset = vec2<f32>(0.0);\r
  if      (dmin == e1) { offset = vec2<f32>( fog_texel.x, 0.0); }\r
  else if (dmin == e2) { offset = vec2<f32>(-fog_texel.x, 0.0); }\r
  else if (dmin == e3) { offset = vec2<f32>(0.0,  fog_texel.y); }\r
  else if (dmin == e4) { offset = vec2<f32>(0.0, -fog_texel.y); }\r
\r
  var fog = textureSampleLevel(fog_tex, samp, in.uv + offset, 0.0).r;\r
  fog = pow(max(fog, 0.0), params.fog_curve);\r
\r
  // Fade godrays at night by scaling with the sun's above-horizon factor.\r
  let horizon_fade = smoothstep(-0.05, 0.05, -light.direction.y);\r
  let fog_color    = light.color * light.intensity * fog * horizon_fade;\r
\r
  // Written additively onto the HDR buffer via one+one blend state.\r
  return vec4<f32>(fog_color, 0.0);\r
}\r
`,m=M,x=16,Z=64;class D extends H{constructor(t,a,e,o,i,c,s,n,u,w,_,g,v,y,p,b,h,B){super();r(this,"name","GodrayPass");r(this,"scattering",.3);r(this,"fogCurve",2);r(this,"maxSteps",16);r(this,"_fogA");r(this,"_fogB");r(this,"_fogAView");r(this,"_fogBView");r(this,"_hdrView");r(this,"_marchPipeline");r(this,"_blurHPipeline");r(this,"_blurVPipeline");r(this,"_compositePipeline");r(this,"_marchBG");r(this,"_blurHBG");r(this,"_blurVBG");r(this,"_compositeBG");r(this,"_marchParamsBuf");r(this,"_blurHParamsBuf");r(this,"_blurVParamsBuf");r(this,"_compParamsBuf");r(this,"_cloudDensityBuf");r(this,"_marchScratch",new Float32Array(4));r(this,"_compScratch",new Float32Array(4));r(this,"_densityScratch",new Float32Array(8));this._fogA=t,this._fogAView=a,this._fogB=e,this._fogBView=o,this._hdrView=i,this._marchPipeline=c,this._blurHPipeline=s,this._blurVPipeline=n,this._compositePipeline=u,this._marchBG=w,this._blurHBG=_,this._blurVBG=g,this._compositeBG=v,this._marchParamsBuf=y,this._blurHParamsBuf=p,this._blurVParamsBuf=b,this._compParamsBuf=h,this._cloudDensityBuf=B}static create(t,a,e,o,i,c,s){const{device:n,width:u,height:w}=t,_=Math.max(1,u>>1),g=Math.max(1,w>>1),v=n.createTexture({label:"GodrayFogA",size:{width:_,height:g},format:m,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),y=n.createTexture({label:"GodrayFogB",size:{width:_,height:g},format:m,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=v.createView(),b=y.createView(),h=n.createSampler({label:"GodraySampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),B=n.createSampler({label:"GodrayNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),F=n.createSampler({label:"GodrayCmpSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),U=n.createBuffer({label:"GodrayCloudDensity",size:Z,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),P=n.createBuffer({label:"GodrayMarchParams",size:x,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(P,0,new Float32Array([.3,16,0,0]).buffer);const S=n.createBuffer({label:"GodrayBlurHParams",size:x,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(S,0,new Float32Array([1,0,0,0]).buffer);const G=n.createBuffer({label:"GodrayBlurVParams",size:x,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(G,0,new Float32Array([0,1,0,0]).buffer);const R=n.createBuffer({label:"GodrayCompositeParams",size:x,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(R,0,new Float32Array([0,0,2,0]).buffer);const T=n.createShaderModule({label:"GodrayMarchShader",code:j}),V=n.createRenderPipeline({label:"GodrayMarchPipeline",layout:"auto",vertex:{module:T,entryPoint:"vs_main"},fragment:{module:T,entryPoint:"fs_march",targets:[{format:m}]},primitive:{topology:"triangle-list"}}),N=n.createBindGroup({label:"GodrayMarchBG",layout:V.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:c}},{binding:2,resource:a.depthView},{binding:3,resource:e.shadowMapView},{binding:4,resource:F},{binding:5,resource:{buffer:P}},{binding:6,resource:{buffer:U}},{binding:7,resource:s.baseView},{binding:8,resource:s.detailView},{binding:9,resource:B}]}),d=n.createShaderModule({label:"GodrayCompositeShader",code:X}),O=n.createRenderPipeline({label:"GodrayBlurHPipeline",layout:"auto",vertex:{module:d,entryPoint:"vs_main"},fragment:{module:d,entryPoint:"fs_blur",targets:[{format:m}]},primitive:{topology:"triangle-list"}}),A=n.createRenderPipeline({label:"GodrayBlurVPipeline",layout:"auto",vertex:{module:d,entryPoint:"vs_main"},fragment:{module:d,entryPoint:"fs_blur",targets:[{format:m}]},primitive:{topology:"triangle-list"}}),E=n.createRenderPipeline({label:"GodrayCompositePipeline",layout:"auto",vertex:{module:d,entryPoint:"vs_main"},fragment:{module:d,entryPoint:"fs_composite",targets:[{format:M,blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}}),L=n.createBindGroup({label:"GodrayBlurHBG",layout:O.getBindGroupLayout(0),entries:[{binding:0,resource:p},{binding:1,resource:a.depthView},{binding:2,resource:h},{binding:3,resource:{buffer:S}}]}),I=n.createBindGroup({label:"GodrayBlurVBG",layout:A.getBindGroupLayout(0),entries:[{binding:0,resource:b},{binding:1,resource:a.depthView},{binding:2,resource:h},{binding:3,resource:{buffer:G}}]}),k=n.createBindGroup({label:"GodrayCompositeBG",layout:E.getBindGroupLayout(0),entries:[{binding:0,resource:p},{binding:1,resource:a.depthView},{binding:2,resource:h},{binding:3,resource:{buffer:R}},{binding:4,resource:{buffer:c}}]});return new D(v,p,y,b,o,V,O,A,E,N,L,I,k,P,S,G,R,U)}updateParams(t){this._marchScratch[0]=this.scattering,this._marchScratch[1]=this.maxSteps,this._marchScratch[2]=0,this._marchScratch[3]=0,t.queue.writeBuffer(this._marchParamsBuf,0,this._marchScratch.buffer),this._compScratch[0]=0,this._compScratch[1]=0,this._compScratch[2]=this.fogCurve,this._compScratch[3]=0,t.queue.writeBuffer(this._compParamsBuf,0,this._compScratch.buffer)}updateCloudDensity(t,a){const e=this._densityScratch;e[0]=a.cloudBase,e[1]=a.cloudTop,e[2]=a.coverage,e[3]=a.density,e[4]=a.windOffset[0],e[5]=a.windOffset[1],e[6]=a.extinction,e[7]=0,t.queue.writeBuffer(this._cloudDensityBuf,0,e.buffer)}execute(t,a){const e=(o,i,c,s,n=!0)=>{const u=t.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,0],loadOp:n?"clear":"load",storeOp:"store"}]});u.setPipeline(c),u.setBindGroup(0,s),u.draw(3),u.end()};e("GodrayMarch",this._fogAView,this._marchPipeline,this._marchBG),e("GodrayBlurH",this._fogBView,this._blurHPipeline,this._blurHBG),e("GodrayBlurV",this._fogAView,this._blurVPipeline,this._blurVBG),e("GodrayComposite",this._hdrView,this._compositePipeline,this._compositeBG,!1)}destroy(){this._fogA.destroy(),this._fogB.destroy(),this._marchParamsBuf.destroy(),this._blurHParamsBuf.destroy(),this._blurVParamsBuf.destroy(),this._compParamsBuf.destroy(),this._cloudDensityBuf.destroy()}}export{C as A,D as G};
