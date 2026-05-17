var C=Object.defineProperty;var N=(_,m,n)=>m in _?C(_,m,{enumerable:!0,configurable:!0,writable:!0,value:n}):_[m]=n;var a=(_,m,n)=>N(_,typeof m!="symbol"?m+"":m,n);import{P}from"./mesh-B_UY4euz.js";import{H as S}from"./deferred_lighting_pass-BZaHbbPw.js";const V=`// Physically based single-scattering atmosphere (Rayleigh + Mie).
// Reference: Nishita 1993, Preetham 1999, Hillaire 2020 (simplified).
//
// World units are metres.  The ground sits at y ≈ 0 so the camera is placed at
// (0, R_E + cameraPos.y, 0) in atmosphere space.

const PI: f32 = 3.14159265358979;
const R_E: f32 = 6360000.0;   // Earth radius (m)
const R_A: f32 = 6420000.0;   // Atmosphere top radius (m)
const H_R: f32 = 8500.0;      // Rayleigh scale height (m)
const H_M: f32 = 1200.0;      // Mie scale height (m)
const G: f32 = 0.758;       // Mie anisotropy (forward-scattering haze)
// Rayleigh coefficients (per metre) tuned to 680 / 550 / 440 nm wavelengths.
const BETA_R: vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);
// Mie coefficient (per metre, wavelength-independent for haze).
const BETA_M: f32 = 21.0e-6;
// Solar irradiance at top of atmosphere (in renderer HDR units).
const SUN_INTENSITY: f32 = 20.0;
// Angular cosine thresholds for sun and moon disks.
const SUN_COS_THRESH: f32 = 0.9996;   // ~1.6° angular radius (~3× real sun)
const MOON_COS_THRESH: f32 = 0.9997;   // slightly smaller than sun

struct Uniforms {
  invViewProj: mat4x4<f32>,
  cameraPos: vec3<f32>,
  _pad0: f32,
  sunDir: vec3<f32>,  // unit vector pointing TOWARD the sun
  _pad1: f32,
}

@group(0) @binding(0) var<uniform> u: Uniforms;

// Ray–sphere intersection.  Returns (tNear, tFar); both negative means no hit.
fn raySphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {
  let b  = dot(ro, rd);
  let c  = dot(ro, ro) - r * r;
  let d  = b * b - c;
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }
  let sq = sqrt(d);
  return vec2<f32>(-b - sq, -b + sq);
}

fn phaseR(mu: f32) -> f32 {
  return (3.0 / (16.0 * PI)) * (1.0 + mu * mu);
}

fn phaseM(mu: f32) -> f32 {
  let g2 = G * G;
  return (3.0 / (8.0 * PI)) *
         ((1.0 - g2) * (1.0 + mu * mu)) /
         ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * G * mu, 1e-4), 1.5));
}

// Optical depth from \`pos\` toward \`dir\` through the atmosphere.
fn opticalDepthToSky(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {
  let t  = raySphere(pos, dir, R_A);
  let ds = t.y / 8.0;
  var od = vec2<f32>(0.0);
  for (var i = 0; i < 8; i++) {
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - R_E;
    if (h < 0.0) { break; }
    od += vec2<f32>(exp(-h / H_R), exp(-h / H_M)) * ds;
  }
  return od;
}

// Transmittance of the atmosphere from \`ro\` in direction \`rd\` (used for the sun disk).
fn transmittance(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {
  let od = opticalDepthToSky(ro, rd);
  return exp(-(BETA_R * od.x + BETA_M * 1.1 * od.y));
}

// Single-scattering integral along the view ray.
fn scatter(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {
  let ta   = raySphere(ro, rd, R_A);
  let tMin = max(ta.x, 0.0);
  if (ta.y < 0.0) { return vec3<f32>(0.0); }

  // Clip view ray at the ground surface.
  let tg   = raySphere(ro, rd, R_E);
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);
  if (tMax <= tMin) { return vec3<f32>(0.0); }

  let mu = dot(rd, u.sunDir);
  let pR = phaseR(mu);
  let pM = phaseM(mu);

  let ds = (tMax - tMin) / 16.0;
  var sumR = vec3<f32>(0.0);
  var sumM = vec3<f32>(0.0);
  var odR  = 0.0;
  var odM  = 0.0;

  for (var i = 0; i < 16; i++) {
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);
    let h   = length(pos) - R_E;
    if (h < 0.0) { break; }

    let hrh = exp(-h / H_R) * ds;
    let hmh = exp(-h / H_M) * ds;
    odR += hrh;
    odM += hmh;

    // Light ray toward the sun — skip if blocked by Earth.
    let tg2 = raySphere(pos, u.sunDir, R_E);
    if (tg2.x > 0.0) { continue; }

    let odL = opticalDepthToSky(pos, u.sunDir);

    let tau = BETA_R * (odR + odL.x) + BETA_M * 1.1 * (odM + odL.y);
    let T   = exp(-tau);
    sumR += T * hrh;
    sumM += T * hmh;
  }

  return SUN_INTENSITY * (BETA_R * pR * sumR + vec3<f32>(BETA_M) * pM * sumM);
}

// --- Vertex shader (fullscreen triangle) ---

struct VertOut {
  @builtin(position) clip_pos : vec4<f32>,
  @location(0)       uv       : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertOut {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertOut;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, y * -0.5 + 0.5);
  return out;
}

@fragment
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {
  // Reconstruct world-space view direction.
  let ndc = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
  let wh  = u.invViewProj * ndc;
  let rd  = normalize(wh.xyz / wh.w - u.cameraPos);

  // Place camera on Earth's surface (world y ≈ metres above sea level).
  let camH = max(u.cameraPos.y, 1.0);
  let ro   = vec3<f32>(0.0, R_E + camH, 0.0);

  var color = scatter(ro, rd);

  // Sun disk: bright limb attenuated by atmosphere transmittance.
  if (dot(rd, u.sunDir) > SUN_COS_THRESH) {
    color += transmittance(ro, u.sunDir) * 1000.0;
  }

  // Moon disk: antipodal to the sun, fades in after sunset.
  // SUN_COS_THRESH gives the same ~0.36° angular radius as the sun.
  let moonDir = -u.sunDir;
  if (dot(rd, moonDir) > MOON_COS_THRESH) {
    let night_t = saturate((-u.sunDir.y - 0.05) * 10.0);
    color += transmittance(ro, moonDir) * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;
  }

  return vec4<f32>(color, 1.0);
}
`,x="rgba16float",w=96;class B extends P{constructor(n,t,e){super();a(this,"name","AtmospherePass");a(this,"_pipeline");a(this,"_uniformBuf");a(this,"_bg");a(this,"_scratch",new Float32Array(w/4));this._pipeline=n,this._uniformBuf=t,this._bg=e}static create(n){const{device:t}=n,e=t.createBuffer({label:"AtmosphereUniform",size:w,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=t.createBindGroupLayout({label:"AtmosphereBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),d=t.createBindGroup({label:"AtmosphereBG",layout:s,entries:[{binding:0,resource:{buffer:e}}]}),c=n.createShaderModule(V,"AtmosphereShader"),i=t.createRenderPipeline({label:"AtmospherePipeline",layout:t.createPipelineLayout({bindGroupLayouts:[s]}),vertex:{module:c,entryPoint:"vs_main"},fragment:{module:c,entryPoint:"fs_main",targets:[{format:x}]},primitive:{topology:"triangle-list"}});return new B(i,e,d)}update(n,t,e,s){const d=this._scratch;d.set(t.data,0),d[16]=e.x,d[17]=e.y,d[18]=e.z;const c=Math.sqrt(s.x*s.x+s.y*s.y+s.z*s.z),i=c>0?1/c:0;d[20]=-s.x*i,d[21]=-s.y*i,d[22]=-s.z*i,n.queue.writeBuffer(this._uniformBuf,0,d.buffer)}addToGraph(n,t={}){const{ctx:e}=n,s=!!t.hdr;let d=t.hdr??void 0,c;return n.addPass(this.name,"render",i=>{s||(d=i.createTexture({label:"atmosphere.hdr",format:x,width:e.width,height:e.height,extraUsage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC})),c=i.write(d,"attachment",{loadOp:t.load??(s?"load":"clear"),storeOp:"store",clearValue:[0,0,0,1]}),i.setExecute(f=>{const h=f.renderPassEncoder;h.setPipeline(this._pipeline),h.setBindGroup(0,this._bg),h.draw(3)})}),{hdr:c}}destroy(){this._uniformBuf.destroy()}}const D=`// godray_march.wgsl — Half-resolution ray-march pass with 3D cloud-density shadowing

const PI: f32 = 3.14159265358979;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
}

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

struct LightUniforms {
  direction         : vec3<f32>,
  intensity         : f32,
  color             : vec3<f32>,
  cascadeCount      : u32,
  cascadeMatrices   : array<mat4x4<f32>, 4>,
  cascadeSplits     : vec4<f32>,
  shadowsEnabled    : u32,
  debugCascades     : u32,
  cloudShadowOrigin : vec2<f32>,
  cloudShadowExtent : f32,
  shadowSoftness    : f32,
  _pad_light        : vec2<f32>,
  cascadeDepthRanges: vec4<f32>,
}

struct MarchParams {
  scattering: f32,
  max_steps : f32,
  _pad0     : f32,
  _pad1     : f32,
}

struct CloudDensityUniforms {
  cloudBase : f32,
  cloudTop  : f32,
  coverage  : f32,
  density   : f32,
  windOffset: vec2<f32>,
  extinction: f32,
  _pad0     : f32,
  _pad1     : f32,
  _pad2     : f32,
  _pad3     : f32,
  _pad4     : f32,
  _pad5     : f32,
  _pad6     : f32,
  _pad7     : f32,
}

@group(0) @binding(0) var<uniform> camera         : CameraUniforms;
@group(0) @binding(1) var<uniform> light           : LightUniforms;
@group(0) @binding(2) var          depth_tex       : texture_depth_2d;
@group(0) @binding(3) var          shadow_map      : texture_depth_2d_array;
@group(0) @binding(4) var          shadow_samp     : sampler_comparison;
@group(0) @binding(5) var<uniform> march_params    : MarchParams;
@group(0) @binding(6) var<uniform> cloud_density   : CloudDensityUniforms;
@group(0) @binding(7) var          base_noise      : texture_3d<f32>;
@group(0) @binding(8) var          detail_noise    : texture_3d<f32>;
@group(0) @binding(9) var          noise_samp      : sampler;

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

fn henyey_greenstein(cos_theta: f32, g: f32) -> f32 {
  let k = 0.0795774715459;
  return k * (1.0 - g * g) / pow(max(1.0 + g * g - 2.0 * g * cos_theta, 1e-4), 1.5);
}

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc     = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let world_h = camera.invViewProj * ndc;
  return world_h.xyz / world_h.w;
}

fn select_cascade(view_depth: f32) -> u32 {
  for (var i = 0u; i < light.cascadeCount; i++) {
    if (view_depth < light.cascadeSplits[i]) { return i; }
  }
  return light.cascadeCount - 1u;
}

fn shadow_at(world_pos: vec3<f32>) -> f32 {
  if (light.shadowsEnabled == 0u) { return 1.0; }
  let view_pos   = camera.view * vec4<f32>(world_pos, 1.0);
  let view_depth = -view_pos.z;
  let cascade    = select_cascade(view_depth);

  let ls  = light.cascadeMatrices[cascade] * vec4<f32>(world_pos, 1.0);
  var sc  = ls.xyz / ls.w;
  sc      = vec3<f32>(sc.xy * 0.5 + 0.5, sc.z);
  sc.y    = 1.0 - sc.y;
  if (any(sc.xy < vec2<f32>(0.0)) || any(sc.xy > vec2<f32>(1.0)) || sc.z > 1.0) {
    return 1.0;
  }
  return textureSampleCompareLevel(shadow_map, shadow_samp, sc.xy, i32(cascade), sc.z - 0.005);
}

fn dither(uv: vec2<f32>) -> f32 {
  return fract(sin(dot(uv, vec2<f32>(41.0, 289.0))) * 45758.5453);
}

// ---- Cloud density helpers (mirrors cloud_shadow.wgsl) -----------------------

const ROT_C: f32 = 0.79863551;
const ROT_S: f32 = 0.60181502;
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);
}

fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {
  return clamp(a + (v - lo) / max(hi - lo, 0.0001) * (b - a), a, b);
}

fn height_gradient(y: f32) -> f32 {
  let t    = clamp((y - cloud_density.cloudBase) / max(cloud_density.cloudTop - cloud_density.cloudBase, 0.001), 0.0, 1.0);
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);
  return saturate(base * top);
}

fn sample_density(world_pos: vec3<f32>) -> f32 {
  let pr = rotate_xz(world_pos);
  let scale = 0.04;
  let base_uv = (pr + vec3<f32>(cloud_density.windOffset.x, 0.0, cloud_density.windOffset.y)) * scale;
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);

  let pw = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;
  let hg = height_gradient(world_pos.y);
  let cov = saturate(remap(pw, 1.0 - cloud_density.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }

  let detail_scale = 0.12;
  let detail_uv = pr * detail_scale + vec3<f32>(cloud_density.windOffset.x, 0.0, cloud_density.windOffset.y) * 0.1;
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;

  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud_density.density;
}

// Integrates cloud density vertically above p through the full cloud slab.
// Returns the Beer's-law transmittance (1 = fully transparent, 0 = fully opaque).
fn cloud_shadow_vertical(p: vec3<f32>) -> f32 {
  let start_y = max(p.y, cloud_density.cloudBase);
  if (start_y >= cloud_density.cloudTop) { return 1.0; }
  let range = cloud_density.cloudTop - start_y;
  let num_steps = 4u;
  let step_size = range / f32(num_steps);
  var opt_depth = 0.0;
  for (var i = 0u; i < num_steps; i++) {
    let y = start_y + (f32(i) + 0.5) * step_size;
    opt_depth += sample_density(vec3<f32>(p.x, y, p.z)) * step_size;
  }
  return exp(-opt_depth * cloud_density.extinction);
}

// ---- Fragment shader ---------------------------------------------------------

@fragment
fn fs_march(in: VertexOutput) -> @location(0) vec4<f32> {
  let depth_size = vec2<i32>(textureDimensions(depth_tex));
  let coord      = clamp(vec2<i32>(in.uv * vec2<f32>(depth_size)),
                         vec2<i32>(0), depth_size - vec2<i32>(1));
  let depth = textureLoad(depth_tex, coord, 0u);

  let hit_depth = select(depth, 1.0, depth >= 1.0);
  let world_pos = reconstruct_world_pos(in.uv, hit_depth);
  let ray_vec   = world_pos - camera.position;
  let ray_len   = length(ray_vec);
  let ray_dir   = ray_vec / max(ray_len, 0.001);

  let steps     = u32(march_params.max_steps);
  let step_len  = ray_len / f32(steps);
  let dith      = dither(in.uv) * step_len;
  var pos       = camera.position + ray_dir * dith;

  let sun_dir   = normalize(-light.direction);
  let cos_theta = dot(ray_dir, sun_dir);
  let phase     = henyey_greenstein(cos_theta, march_params.scattering);

  var accum = 0.0;
  for (var i = 0u; i < steps; i++) {
    let shad     = shadow_at(pos);
    let trans    = cloud_shadow_vertical(pos);
    accum += phase * shad * trans;
    pos   += ray_dir * step_len;
  }

  let fog = clamp(accum / f32(steps), 0.0, 1.0);
  return vec4<f32>(fog, 0.0, 0.0, 1.0);
}
`,z=`// godray_composite.wgsl — Blur and composite passes for volumetric godrays.
//
// fs_blur: bilateral depth-aware Gaussian blur of the half-res fog texture
//          (run twice — horizontal then vertical — using the blur_dir uniform).
//
// fs_composite: depth-aware upsampling from half-res fog to full-res, followed
//               by an additive blend of (fog × sun color × sun intensity) onto
//               the HDR render target.  Uses pipeline blend state (one+one) so
//               the fragment only needs to output the additive contribution.
//
// Bindings 0-3 are used by both entry points; binding 4 (light) is composite-only.
// With layout:'auto' each pipeline derives its own BGL from the entry point's
// static usage, so blur and composite bind groups can be created independently.

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
}

struct LightUniforms {
  direction         : vec3<f32>,
  intensity         : f32,
  color             : vec3<f32>,
  cascadeCount      : u32,
  cascadeMatrices   : array<mat4x4<f32>, 4>,
  cascadeSplits     : vec4<f32>,
  shadowsEnabled    : u32,
  debugCascades     : u32,
  cloudShadowOrigin : vec2<f32>,
  cloudShadowExtent : f32,
  shadowSoftness    : f32,
  _pad_light        : vec2<f32>,
  cascadeDepthRanges: vec4<f32>,
}

// Shared by blur and composite — blur uses blur_dir, composite uses fog_curve.
struct Params {
  blur_dir  : vec2<f32>,  // (1,0) for horizontal, (0,1) for vertical; ignored by composite
  fog_curve : f32,        // power applied to fog before compositing; ignored by blur
  _pad      : f32,
}

@group(0) @binding(0) var          fog_tex  : texture_2d<f32>;
@group(0) @binding(1) var          depth_tex: texture_depth_2d;
@group(0) @binding(2) var          samp     : sampler;
@group(0) @binding(3) var<uniform> params   : Params;
@group(0) @binding(4) var<uniform> light    : LightUniforms; // composite only

fn depth_load(uv: vec2<f32>) -> f32 {
  let size  = vec2<i32>(textureDimensions(depth_tex));
  let coord = clamp(vec2<i32>(uv * vec2<f32>(size)), vec2<i32>(0), size - vec2<i32>(1));
  return textureLoad(depth_tex, coord, 0u);
}

// Gaussian half-kernel (center..edge, index = abs(tap offset)).
// Sum of symmetric 7-tap (±3) with these weights ≈ 1.
const GAUSS: array<f32, 4> = array<f32, 4>(
  0.19638062, 0.17469900, 0.12161760, 0.06706740,
);

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ---- Blur pass ---------------------------------------------------------------

@fragment
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {
  // Step size in UV space: one fog texel in the blur direction.
  let texel  = 1.0 / vec2<f32>(textureDimensions(fog_tex));
  let step   = params.blur_dir * texel;
  let depth0 = depth_load(in.uv);

  var accum  = 0.0;
  var weight = 0.0;
  for (var i: i32 = -3; i <= 3; i++) {
    let uv_off  = in.uv + step * f32(i);
    let depth_s = depth_load(uv_off);
    let fog_s   = textureSampleLevel(fog_tex,   samp, uv_off, 0.0).r;
    // Depth-aware bilateral weight: suppress blur across depth discontinuities.
    let d_wt  = exp(-abs(depth_s - depth0) * 1000.0);
    let w     = GAUSS[abs(i)] * d_wt;
    accum  += w * fog_s;
    weight += w;
  }
  return vec4<f32>(accum / max(weight, 1e-5), 0.0, 0.0, 1.0);
}

// ---- Composite pass ----------------------------------------------------------

@fragment
fn fs_composite(in: VertexOutput) -> @location(0) vec4<f32> {
  let depth0 = depth_load(in.uv);

  // Sky pixels: sample fog directly without depth-aware neighbor logic.
  if (depth0 >= 1.0) {
    var fog = textureSampleLevel(fog_tex, samp, in.uv, 0.0).r;
    fog = pow(max(fog, 0.0), params.fog_curve);
    let horizon_fade = smoothstep(-0.05, 0.05, -light.direction.y);
    let fog_color = light.color * light.intensity * fog * horizon_fade;
    return vec4<f32>(fog_color, 0.0);
  }

  // Depth-aware upsampling: among the four half-res neighbours, pick the one
  // whose depth is closest to this full-res pixel to avoid bleeding across edges.
  let fog_texel = 1.0 / vec2<f32>(textureDimensions(fog_tex));

  let d1 = depth_load(in.uv + vec2<f32>( fog_texel.x, 0.0));
  let d2 = depth_load(in.uv + vec2<f32>(-fog_texel.x, 0.0));
  let d3 = depth_load(in.uv + vec2<f32>(0.0,  fog_texel.y));
  let d4 = depth_load(in.uv + vec2<f32>(0.0, -fog_texel.y));

  let e1 = abs(depth0 - d1); let e2 = abs(depth0 - d2);
  let e3 = abs(depth0 - d3); let e4 = abs(depth0 - d4);
  let dmin = min(min(e1, e2), min(e3, e4));

  var offset = vec2<f32>(0.0);
  if      (dmin == e1) { offset = vec2<f32>( fog_texel.x, 0.0); }
  else if (dmin == e2) { offset = vec2<f32>(-fog_texel.x, 0.0); }
  else if (dmin == e3) { offset = vec2<f32>(0.0,  fog_texel.y); }
  else if (dmin == e4) { offset = vec2<f32>(0.0, -fog_texel.y); }

  var fog = textureSampleLevel(fog_tex, samp, in.uv + offset, 0.0).r;
  fog = pow(max(fog, 0.0), params.fog_curve);

  // Fade godrays at night by scaling with the sun's above-horizon factor.
  let horizon_fade = smoothstep(-0.05, 0.05, -light.direction.y);
  let fog_color    = light.color * light.intensity * fog * horizon_fade;

  // Written additively onto the HDR buffer via one+one blend state.
  return vec4<f32>(fog_color, 0.0);
}
`,y=S,b=16,H=64;class G extends P{constructor(n,t,e,s,d,c,i,f,h,r,p,o,u,l,g,v){super();a(this,"name","GodrayPass");a(this,"scattering",.3);a(this,"fogCurve",2);a(this,"maxSteps",16);a(this,"_marchPipeline");a(this,"_blurHPipeline");a(this,"_blurVPipeline");a(this,"_compositePipeline");a(this,"_marchParamsBuf");a(this,"_blurHParamsBuf");a(this,"_blurVParamsBuf");a(this,"_compParamsBuf");a(this,"_cloudDensityBuf");a(this,"_bglMarch");a(this,"_bglBlur");a(this,"_bglComposite");a(this,"_sampler");a(this,"_noiseSampler");a(this,"_cmpSampler");a(this,"_cloudNoises");a(this,"_marchScratch",new Float32Array(4));a(this,"_compScratch",new Float32Array(4));a(this,"_densityScratch",new Float32Array(8));this._marchPipeline=n,this._blurHPipeline=t,this._blurVPipeline=e,this._compositePipeline=s,this._marchParamsBuf=d,this._blurHParamsBuf=c,this._blurVParamsBuf=i,this._compParamsBuf=f,this._cloudDensityBuf=h,this._bglMarch=r,this._bglBlur=p,this._bglComposite=o,this._sampler=u,this._noiseSampler=l,this._cmpSampler=g,this._cloudNoises=v}static create(n,t){const{device:e}=n,s=e.createSampler({label:"GodraySampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),d=e.createSampler({label:"GodrayNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),c=e.createSampler({label:"GodrayCmpSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),i=e.createBuffer({label:"GodrayCloudDensity",size:H,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=e.createBuffer({label:"GodrayMarchParams",size:b,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(f,0,new Float32Array([.3,16,0,0]).buffer);const h=e.createBuffer({label:"GodrayBlurHParams",size:b,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(h,0,new Float32Array([1,0,0,0]).buffer);const r=e.createBuffer({label:"GodrayBlurVParams",size:b,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(r,0,new Float32Array([0,1,0,0]).buffer);const p=e.createBuffer({label:"GodrayCompositeParams",size:b,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(p,0,new Float32Array([0,0,2,0]).buffer);const o=n.createShaderModule(D,"GodrayMarchShader"),u=n.createShaderModule(z,"GodrayCompositeShader"),l=e.createBindGroupLayout({label:"GodrayMarchBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth",viewDimension:"2d-array"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"comparison"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:7,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:8,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:9,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),g=e.createBindGroupLayout({label:"GodrayBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),v=e.createBindGroupLayout({label:"GodrayCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),T=e.createPipelineLayout({bindGroupLayouts:[l]}),R=e.createPipelineLayout({bindGroupLayouts:[g]}),M=e.createPipelineLayout({bindGroupLayouts:[g]}),U=e.createPipelineLayout({bindGroupLayouts:[v]}),O=e.createRenderPipeline({label:"GodrayMarchPipeline",layout:T,vertex:{module:o,entryPoint:"vs_main"},fragment:{module:o,entryPoint:"fs_march",targets:[{format:y}]},primitive:{topology:"triangle-list"}}),E=e.createRenderPipeline({label:"GodrayBlurHPipeline",layout:R,vertex:{module:u,entryPoint:"vs_main"},fragment:{module:u,entryPoint:"fs_blur",targets:[{format:y}]},primitive:{topology:"triangle-list"}}),A=e.createRenderPipeline({label:"GodrayBlurVPipeline",layout:M,vertex:{module:u,entryPoint:"vs_main"},fragment:{module:u,entryPoint:"fs_blur",targets:[{format:y}]},primitive:{topology:"triangle-list"}}),F=e.createRenderPipeline({label:"GodrayCompositePipeline",layout:U,vertex:{module:u,entryPoint:"vs_main"},fragment:{module:u,entryPoint:"fs_composite",targets:[{format:S,blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}});return new G(O,E,A,F,f,h,r,p,i,l,g,v,s,d,c,t)}updateParams(n){this._marchScratch[0]=this.scattering,this._marchScratch[1]=this.maxSteps,this._marchScratch[2]=0,this._marchScratch[3]=0,n.queue.writeBuffer(this._marchParamsBuf,0,this._marchScratch.buffer),this._compScratch[0]=0,this._compScratch[1]=0,this._compScratch[2]=this.fogCurve,this._compScratch[3]=0,n.queue.writeBuffer(this._compParamsBuf,0,this._compScratch.buffer)}updateCloudDensity(n,t){const e=this._densityScratch;e[0]=t.cloudBase,e[1]=t.cloudTop,e[2]=t.coverage,e[3]=t.density,e[4]=t.windOffset[0],e[5]=t.windOffset[1],e[6]=t.extinction,e[7]=0,n.queue.writeBuffer(this._cloudDensityBuf,0,e.buffer)}addToGraph(n,t){const{ctx:e}=n,s=Math.max(1,e.width>>1),d=Math.max(1,e.height>>1),c={format:y,width:s,height:d};let i,f,h;return n.addPass(`${this.name}.march`,"render",r=>{i=r.createTexture({label:"GodrayFogA",...c}),i=r.write(i,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,0]}),r.read(t.depth,"sampled"),r.read(t.shadowMap,"sampled"),r.read(t.cameraBuffer,"uniform"),r.read(t.lightBuffer,"uniform"),r.setExecute((p,o)=>{const u=o.getOrCreateBindGroup({label:"GodrayMarchBG",layout:this._bglMarch,entries:[{binding:0,resource:{buffer:o.getBuffer(t.cameraBuffer)}},{binding:1,resource:{buffer:o.getBuffer(t.lightBuffer)}},{binding:2,resource:o.getTextureView(t.depth)},{binding:3,resource:o.getTextureView(t.shadowMap)},{binding:4,resource:this._cmpSampler},{binding:5,resource:{buffer:this._marchParamsBuf}},{binding:6,resource:{buffer:this._cloudDensityBuf}},{binding:7,resource:this._cloudNoises.baseView},{binding:8,resource:this._cloudNoises.detailView},{binding:9,resource:this._noiseSampler}]}),l=p.renderPassEncoder;l.setPipeline(this._marchPipeline),l.setBindGroup(0,u),l.draw(3)})}),n.addPass(`${this.name}.blurH`,"render",r=>{f=r.createTexture({label:"GodrayFogB",...c}),f=r.write(f,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,0]}),r.read(i,"sampled"),r.read(t.depth,"sampled"),r.setExecute((p,o)=>{const u=o.getOrCreateBindGroup({label:"GodrayBlurHBG",layout:this._bglBlur,entries:[{binding:0,resource:o.getTextureView(i)},{binding:1,resource:o.getTextureView(t.depth)},{binding:2,resource:this._sampler},{binding:3,resource:{buffer:this._blurHParamsBuf}}]}),l=p.renderPassEncoder;l.setPipeline(this._blurHPipeline),l.setBindGroup(0,u),l.draw(3)})}),n.addPass(`${this.name}.blurV`,"render",r=>{i=r.write(i,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,0]}),r.read(f,"sampled"),r.read(t.depth,"sampled"),r.setExecute((p,o)=>{const u=o.getOrCreateBindGroup({label:"GodrayBlurVBG",layout:this._bglBlur,entries:[{binding:0,resource:o.getTextureView(f)},{binding:1,resource:o.getTextureView(t.depth)},{binding:2,resource:this._sampler},{binding:3,resource:{buffer:this._blurVParamsBuf}}]}),l=p.renderPassEncoder;l.setPipeline(this._blurVPipeline),l.setBindGroup(0,u),l.draw(3)})}),n.addPass(`${this.name}.composite`,"render",r=>{h=r.write(t.hdr,"attachment",{loadOp:"load",storeOp:"store"}),r.read(i,"sampled"),r.read(t.depth,"sampled"),r.read(t.lightBuffer,"uniform"),r.setExecute((p,o)=>{const u=o.getOrCreateBindGroup({label:"GodrayCompositeBG",layout:this._bglComposite,entries:[{binding:0,resource:o.getTextureView(i)},{binding:1,resource:o.getTextureView(t.depth)},{binding:2,resource:this._sampler},{binding:3,resource:{buffer:this._compParamsBuf}},{binding:4,resource:{buffer:o.getBuffer(t.lightBuffer)}}]}),l=p.renderPassEncoder;l.setPipeline(this._compositePipeline),l.setBindGroup(0,u),l.draw(3)})}),{hdr:h}}destroy(){this._marchParamsBuf.destroy(),this._blurHParamsBuf.destroy(),this._blurVParamsBuf.destroy(),this._compParamsBuf.destroy(),this._cloudDensityBuf.destroy()}}export{B as A,G};
