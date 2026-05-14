var Y=Object.defineProperty;var X=(f,u,r)=>u in f?Y(f,u,{enumerable:!0,configurable:!0,writable:!0,value:r}):f[u]=r;var l=(f,u,r)=>X(f,typeof u!="symbol"?u+"":u,r);import{a as A}from"./mesh-BUGOzOTp.js";import{H as W}from"./deferred_lighting_pass-BJ2kCipp.js";const q=`// Cloud + sky pass — fullscreen triangle.
// Raymarches through a cloud slab with Beer's law transmittance and self-shadow
// light marching.  Sky color is computed with the same Rayleigh+Mie model as
// atmosphere.wgsl so no sky texture is needed.

const PI: f32 = 3.14159265358979323846;

// ---- Uniforms ----------------------------------------------------------------

struct CameraUniforms {
  invViewProj: mat4x4<f32>,
  position: vec3<f32>,
  near: f32,
  far: f32,
}

struct CloudUniforms {
  cloudBase: f32,
  cloudTop: f32,
  coverage: f32,
  density: f32,
  windOffset: vec2<f32>,
  anisotropy: f32,
  extinction: f32,
  ambientColor: vec3<f32>,
  exposure: f32,
}

struct LightUniforms {
  direction: vec3<f32>,
  intensity: f32,
  color: vec3<f32>,
  _pad: f32,
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> cloud : CloudUniforms;
@group(1) @binding(0) var<uniform> light : LightUniforms;
@group(2) @binding(0) var          depth_tex  : texture_depth_2d;
@group(2) @binding(1) var          depth_samp : sampler;
@group(3) @binding(0) var          base_noise  : texture_3d<f32>;
@group(3) @binding(1) var          detail_noise: texture_3d<f32>;
@group(3) @binding(2) var          noise_samp  : sampler;

// ---- Atmosphere (Rayleigh + Mie) for sky color ------------------------------

const R_E            : f32       = 6360000.0;
const R_A            : f32       = 6420000.0;
const H_R            : f32       = 8500.0;
const H_M            : f32       = 1200.0;
const G_ATM          : f32       = 0.758;
const BETA_R         : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);
const BETA_M_ATM     : f32       = 21.0e-6;
const SUN_INTENSITY  : f32       = 20.0;
const SUN_COS_THRESH  : f32 = 0.999976;  // 10% larger angular radius than default
const MOON_COS_THRESH : f32 = 0.999978;  //  5% larger angular radius than default

fn ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {
  let b = dot(ro, rd);
  let c = dot(ro, ro) - r * r;
  let d = b * b - c;
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }
  let sq = sqrt(d);
  return vec2<f32>(-b - sq, -b + sq);
}

fn phase_r(mu: f32) -> f32 {
  return (3.0 / (16.0 * PI)) * (1.0 + mu * mu);
}

fn phase_m_atm(mu: f32) -> f32 {
  let g2 = G_ATM * G_ATM;
  return (3.0 / (8.0 * PI)) *
         ((1.0 - g2) * (1.0 + mu * mu)) /
         ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * G_ATM * mu, 1e-4), 1.5));
}

fn optical_depth_to_sky(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {
  let t  = ray_sphere(pos, dir, R_A);
  let ds = t.y / 4.0;
  var od = vec2<f32>(0.0);
  for (var i = 0; i < 4; i++) {
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - R_E;
    if (h < 0.0) { break; }
    od += vec2<f32>(exp(-h / H_R), exp(-h / H_M)) * ds;
  }
  return od;
}

fn sky_transmittance(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {
  let od = optical_depth_to_sky(ro, rd);
  return exp(-(BETA_R * od.x + BETA_M_ATM * 1.1 * od.y));
}

fn scatter_sky(ro: vec3<f32>, rd: vec3<f32>, sun_dir: vec3<f32>) -> vec3<f32> {
  let ta   = ray_sphere(ro, rd, R_A);
  let tMin = max(ta.x, 0.0);
  if (ta.y < 0.0) { return vec3<f32>(0.0); }
  let tg   = ray_sphere(ro, rd, R_E);
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);
  if (tMax <= tMin) { return vec3<f32>(0.0); }

  let mu = dot(rd, sun_dir);
  let pR = phase_r(mu);
  let pM = phase_m_atm(mu);
  let ds = (tMax - tMin) / 8.0;

  var sumR = vec3<f32>(0.0);
  var sumM = vec3<f32>(0.0);
  var odR  = 0.0;
  var odM  = 0.0;

  for (var i = 0; i < 8; i++) {
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);
    let h   = length(pos) - R_E;
    if (h < 0.0) { break; }
    let hrh = exp(-h / H_R) * ds;
    let hmh = exp(-h / H_M) * ds;
    odR += hrh;
    odM += hmh;
    let tg2 = ray_sphere(pos, sun_dir, R_E);
    if (tg2.x > 0.0) { continue; }
    let odL = optical_depth_to_sky(pos, sun_dir);
    let tau = BETA_R * (odR + odL.x) + BETA_M_ATM * 1.1 * (odM + odL.y);
    let T   = exp(-tau);
    sumR += T * hrh;
    sumM += T * hmh;
  }

  return SUN_INTENSITY * (BETA_R * pR * sumR + vec3<f32>(BETA_M_ATM) * pM * sumM);
}

// ---- Vertex shader -----------------------------------------------------------

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

// ---- Cloud helpers -----------------------------------------------------------

// Rotate XZ around Y by ~37° so the Perlin noise grid doesn't align with world
// axes, which would otherwise produce visible hard edges along X=0 and Z=0.
const ROT_C: f32 = 0.79863551;
const ROT_S: f32 = 0.60181502;
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);
}

fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {
  return a + saturate((v - lo) / max(hi - lo, 0.0001)) * (b - a);
}

fn height_gradient(y: f32) -> f32 {
  let t    = clamp((y - cloud.cloudBase) / max(cloud.cloudTop - cloud.cloudBase, 0.001), 0.0, 1.0);
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);
  return saturate(base * top);
}

fn hg_phase(cos_theta: f32, g: f32) -> f32 {
  let g2 = g * g;
  return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * cos_theta, 1.5));
}

fn dual_phase(cos_theta: f32, g: f32) -> f32 {
  return 0.7 * hg_phase(cos_theta, g) + 0.3 * hg_phase(cos_theta, -0.25);
}

fn sample_pw(samp_uv: vec3<f32>) -> f32 {
  let s = textureSampleLevel(base_noise, noise_samp, samp_uv, 0.0);
  let w = s.g * 0.5 + s.b * 0.35 + s.a * 0.15;
  return remap(s.r, 1.0 - w, 1.0, 0.0, 1.0);
}

fn sample_density(p: vec3<f32>) -> f32 {
  let wind = vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y);
  let pr = rotate_xz(rotate_xz(p));
  // Large-scale pass (3× coarser) — creates some very big cloud masses.
  // Drifts at half wind speed for natural differential parallax with smaller clouds.
  let pw_large = sample_pw((pr + wind * 0.5) * 0.012);
  // Medium-scale pass — smaller individual clouds.
  let pw_med = sample_pw((pr + wind) * 0.04);
  // Blend: large scale dominates shape; medium adds smaller clouds in sparser areas.
  let pw = pw_large * 0.6 + pw_med * 0.4;
  let hg = height_gradient(p.y);
  let cov = saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }
  let detail_uv = pr * 0.12 + wind * 0.1;
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;
  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud.density;
}

fn sample_density_coarse(p: vec3<f32>) -> f32 {
  let wind     = vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y);
  let pr       = rotate_xz(p);
  let pw_large = sample_pw((pr + wind * 0.5) * 0.012);
  let pw_med   = sample_pw((pr + wind) * 0.04);
  let pw       = pw_large * 0.6 + pw_med * 0.4;
  let hg       = height_gradient(p.y);
  return saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg * cloud.density;
}

fn light_march(p: vec3<f32>, sun_dir: vec3<f32>) -> f32 {
  let step_size = (cloud.cloudTop - cloud.cloudBase) / 2.0;
  var opt_depth = 0.0;
  for (var i = 0; i < 2; i++) {
    let sp = p + sun_dir * (f32(i) + 0.5) * step_size;
    if (sp.y < cloud.cloudBase || sp.y > cloud.cloudTop) { continue; }
    opt_depth += sample_density_coarse(sp) * step_size;
  }
  return exp(-opt_depth * cloud.extinction);
}

fn ray_slab(ro: vec3<f32>, rd: vec3<f32>, y_min: f32, y_max: f32) -> vec2<f32> {
  if (abs(rd.y) < 1e-6) {
    if (ro.y < y_min || ro.y > y_max) {
      return vec2<f32>(-1.0, -1.0);
    }
    return vec2<f32>(0.0, 1e9);
  }
  let t0 = (y_min - ro.y) / rd.y;
  let t1 = (y_max - ro.y) / rd.y;
  let t_near = min(t0, t1);
  let t_far  = max(t0, t1);
  if (t_far < 0.0) {
    return vec2<f32>(-1.0, -1.0);
  }
  return vec2<f32>(max(t_near, 0.0), t_far);
}

// ---- Fragment shader ---------------------------------------------------------

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
  let world_h = camera.invViewProj * ndc;
  let ray_dir = normalize(world_h.xyz / world_h.w - camera.position);

  let sun_dir = normalize(-light.direction);
  let camH    = max(camera.position.y, 1.0);
  let atm_ro  = vec3<f32>(0.0, R_E + camH, 0.0);
  let sky_color = scatter_sky(atm_ro, ray_dir, sun_dir);

  // Clip ray at scene geometry
  let geo_depth = textureLoad(depth_tex, vec2<i32>(in.clip_pos.xy), 0);
  var geo_dist  = 1e9;
  if (geo_depth < 1.0) {
    let ndc_geo = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, geo_depth, 1.0);
    let geo_h   = camera.invViewProj * ndc_geo;
    let geo_pos = geo_h.xyz / geo_h.w;
    geo_dist    = distance(geo_pos, camera.position);
  }

  let moon_dir  = -sun_dir;
  let night_t   = saturate((-sun_dir.y - 0.05) * 10.0);

  // Intersect ray with cloud slab
  let slab = ray_slab(camera.position, ray_dir, cloud.cloudBase, cloud.cloudTop);
  if (slab.x < 0.0 || slab.x > geo_dist) {
    var color = sky_color;
    if (dot(ray_dir, sun_dir) > SUN_COS_THRESH && geo_depth >= 1.0) {
      color += sky_transmittance(atm_ro, sun_dir) * 1000.0;
    }
    if (dot(ray_dir, moon_dir) > MOON_COS_THRESH && geo_depth >= 1.0) {
      color += sky_transmittance(atm_ro, moon_dir) * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;
    }
    return vec4<f32>(color, 1.0);
  }

  let t_end  = min(min(slab.y, geo_dist), 200.0);
  if (t_end <= slab.x) {
    return vec4<f32>(sky_color, 1.0);
  }

  // Primary ray march (24 steps, IGN jitter for TAA)
  let step_size = (t_end - slab.x) / 24.0;
  let coord     = vec2<i32>(in.clip_pos.xy);
  let jitter    = fract(52.9829189 * fract(0.06711056 * f32(coord.x) + 0.00583715 * f32(coord.y)));
  let t_start   = slab.x + jitter * step_size;
  let cos_theta = dot(ray_dir, sun_dir);
  let phase     = dual_phase(cos_theta, cloud.anisotropy);

  var cloud_color = vec3<f32>(0.0);
  var total_trans = 1.0;

  for (var i = 0; i < 24; i++) {
    let t = t_start + f32(i) * step_size;
    if (t >= t_end) { break; }
    let p = camera.position + ray_dir * t;

    let dens = sample_density(p);
    if (dens < 0.001) { continue; }

    let shadow_t    = light_march(p, sun_dir);
    let height_frac = clamp((p.y - cloud.cloudBase) / max(cloud.cloudTop - cloud.cloudBase, 0.001), 0.0, 1.0);

    let sun_energy = light.color * light.intensity * shadow_t * phase;
    let amb_energy = cloud.ambientColor * mix(0.5, 1.0, height_frac);

    let opt    = dens * cloud.extinction * step_size;
    let t_step = exp(-opt);

    cloud_color += (sun_energy + amb_energy) * (1.0 - t_step) * total_trans;
    total_trans *= t_step;

    if (total_trans < 0.01) { break; }
  }

  var final_color = cloud_color + sky_color * total_trans;
  if (dot(ray_dir, sun_dir) > SUN_COS_THRESH && geo_depth >= 1.0) {
    final_color += sky_transmittance(atm_ro, sun_dir) * total_trans * 1000.0;
  }
  if (dot(ray_dir, moon_dir) > MOON_COS_THRESH && geo_depth >= 1.0) {
    final_color += sky_transmittance(atm_ro, moon_dir) * total_trans * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;
  }
  return vec4<f32>(final_color, 1.0);
}
`,E=96,O=48,N=32;class k extends A{constructor(r,e,n,s,t,i,a,o,d){super();l(this,"name","CloudPass");l(this,"_pipeline");l(this,"_hdrView");l(this,"_cameraBuffer");l(this,"_cloudBuffer");l(this,"_lightBuffer");l(this,"_sceneBG");l(this,"_lightBG");l(this,"_depthBG");l(this,"_noiseSkyBG");l(this,"_cameraScratch",new Float32Array(E/4));l(this,"_lightScratch",new Float32Array(N/4));l(this,"_settingsScratch",new Float32Array(O/4));this._pipeline=r,this._hdrView=e,this._cameraBuffer=n,this._cloudBuffer=s,this._lightBuffer=t,this._sceneBG=i,this._lightBG=a,this._depthBG=o,this._noiseSkyBG=d}static create(r,e,n,s){const{device:t}=r,i=t.createBuffer({label:"CloudCameraBuffer",size:E,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=t.createBuffer({label:"CloudUniformBuffer",size:O,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=t.createBuffer({label:"CloudLightBuffer",size:N,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=t.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),c=t.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),p=t.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),_=t.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=t.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),m=t.createSampler({label:"CloudDepthSampler"}),g=t.createBindGroup({label:"CloudSceneBG",layout:d,entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}}]}),y=t.createBindGroup({label:"CloudLightBG",layout:c,entries:[{binding:0,resource:{buffer:o}}]}),x=t.createBindGroup({label:"CloudDepthBG",layout:p,entries:[{binding:0,resource:n},{binding:1,resource:m}]}),w=t.createBindGroup({label:"CloudNoiseSkyBG",layout:_,entries:[{binding:0,resource:s.baseView},{binding:1,resource:s.detailView},{binding:2,resource:h}]}),v=t.createShaderModule({label:"CloudShader",code:q}),S=t.createRenderPipeline({label:"CloudPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[d,c,p,_]}),vertex:{module:v,entryPoint:"vs_main"},fragment:{module:v,entryPoint:"fs_main",targets:[{format:W}]},primitive:{topology:"triangle-list"}});return new k(S,e,i,a,o,g,y,x,w)}updateCamera(r,e,n,s,t){const i=this._cameraScratch;i.set(e.data,0),i[16]=n.x,i[17]=n.y,i[18]=n.z,i[19]=s,i[20]=t,r.queue.writeBuffer(this._cameraBuffer,0,i.buffer)}updateLight(r,e,n,s){const t=this._lightScratch;t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=s,t[4]=n.x,t[5]=n.y,t[6]=n.z,r.queue.writeBuffer(this._lightBuffer,0,t.buffer)}updateSettings(r,e){const n=this._settingsScratch;n[0]=e.cloudBase,n[1]=e.cloudTop,n[2]=e.coverage,n[3]=e.density,n[4]=e.windOffset[0],n[5]=e.windOffset[1],n[6]=e.anisotropy,n[7]=e.extinction,n[8]=e.ambientColor[0],n[9]=e.ambientColor[1],n[10]=e.ambientColor[2],n[11]=e.exposure,r.queue.writeBuffer(this._cloudBuffer,0,n.buffer)}execute(r,e){const n=r.beginRenderPass({label:"CloudPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._sceneBG),n.setBindGroup(1,this._lightBG),n.setBindGroup(2,this._depthBG),n.setBindGroup(3,this._noiseSkyBG),n.draw(3),n.end()}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const J=`// Cloud shadow pass — renders a top-down cloud transmittance map (1024×1024 r8unorm).
// For each texel, marches 32 steps vertically through the cloud slab and accumulates
// optical depth, then outputs Beer's-law transmittance.

const PI: f32 = 3.14159265358979323846;

const ROT_C: f32 = 0.79863551;
const ROT_S: f32 = 0.60181502;
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);
}

struct CloudShadowUniforms {
  cloudBase    : f32,
  cloudTop     : f32,
  coverage     : f32,
  density      : f32,
  windOffset   : vec2<f32>,   // XZ animated offset
  worldOriginX : f32,         // world-space XZ center of the shadow map
  worldOriginZ : f32,
  worldExtent  : f32,         // half-size in world units (map covers ±worldExtent)
  extinction   : f32,
  _pad0        : f32,
  _pad1        : f32,
}

@group(0) @binding(0) var<uniform> params     : CloudShadowUniforms;
@group(1) @binding(0) var          base_noise  : texture_3d<f32>;
@group(1) @binding(1) var          detail_noise: texture_3d<f32>;
@group(1) @binding(2) var          noise_samp  : sampler;

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

fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {
  return clamp(a + (v - lo) / max(hi - lo, 0.0001) * (b - a), a, b);
}

fn height_gradient(y: f32) -> f32 {
  let t = clamp((y - params.cloudBase) / max(params.cloudTop - params.cloudBase, 0.001), 0.0, 1.0);
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);
  return saturate(base * top);
}

fn sample_density(world_pos: vec3<f32>) -> f32 {
  let pr = rotate_xz(world_pos);
  let scale = 0.04;
  let base_uv = (pr + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y)) * scale;
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);

  // Perlin-Worley blend
  let pw = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;
  let hg = height_gradient(world_pos.y);
  let cov = saturate(remap(pw, 1.0 - params.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }

  let detail_scale = 0.12;
  let detail_uv = pr * detail_scale + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y) * 0.1;
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;

  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * params.density;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Map UV to world XZ position
  let world_x = params.worldOriginX + (in.uv.x - 0.5) * params.worldExtent * 2.0;
  let world_z = params.worldOriginZ + (in.uv.y - 0.5) * params.worldExtent * 2.0;

  let slab_h = params.cloudTop - params.cloudBase;
  let step_h = slab_h / 16.0;

  var opt_depth = 0.0;
  for (var i = 0; i < 16; i++) {
    let y = params.cloudBase + (f32(i) + 0.5) * step_h;
    opt_depth += sample_density(vec3<f32>(world_x, y, world_z)) * step_h;
  }

  let transmittance = exp(-opt_depth * params.extinction);
  return vec4<f32>(transmittance, 0.0, 0.0, 1.0);
}
`,F=1024,L="r8unorm",z=48;class H extends A{constructor(r,e,n,s,t,i){super();l(this,"name","CloudShadowPass");l(this,"shadowTexture");l(this,"shadowView");l(this,"_pipeline");l(this,"_uniformBuffer");l(this,"_uniformBG");l(this,"_noiseBG");l(this,"_frameCount",0);l(this,"_data",new Float32Array(z/4));this.shadowTexture=r,this.shadowView=e,this._pipeline=n,this._uniformBuffer=s,this._uniformBG=t,this._noiseBG=i}static create(r,e){const{device:n}=r,s=n.createTexture({label:"CloudShadowTexture",size:{width:F,height:F},format:L,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),t=s.createView(),i=n.createBuffer({label:"CloudShadowUniform",size:z,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=n.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),o=n.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),d=n.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),c=n.createBindGroup({label:"CloudShadowUniformBG",layout:a,entries:[{binding:0,resource:{buffer:i}}]}),p=n.createBindGroup({label:"CloudShadowNoiseBG",layout:d,entries:[{binding:0,resource:e.baseView},{binding:1,resource:e.detailView},{binding:2,resource:o}]}),_=n.createShaderModule({label:"CloudShadowShader",code:J}),h=n.createRenderPipeline({label:"CloudShadowPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[a,d]}),vertex:{module:_,entryPoint:"vs_main"},fragment:{module:_,entryPoint:"fs_main",targets:[{format:L}]},primitive:{topology:"triangle-list"}});return new H(s,t,h,i,c,p)}update(r,e,n,s){this._data[0]=e.cloudBase,this._data[1]=e.cloudTop,this._data[2]=e.coverage,this._data[3]=e.density,this._data[4]=e.windOffset[0],this._data[5]=e.windOffset[1],this._data[6]=n[0],this._data[7]=n[1],this._data[8]=s,this._data[9]=e.extinction,r.queue.writeBuffer(this._uniformBuffer,0,this._data.buffer)}execute(r,e){if(this._frameCount++%2!==0)return;const n=r.beginRenderPass({label:"CloudShadowPass",colorAttachments:[{view:this.shadowView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._uniformBG),n.setBindGroup(1,this._noiseBG),n.draw(3),n.end()}destroy(){this.shadowTexture.destroy(),this._uniformBuffer.destroy()}}const K=`// composite.wgsl — Fog + Underwater + Tonemap merged into a single full-screen draw.
// Replaces FogPass → UnderwaterPass → TonemapPass, saving 2 intermediate HDR
// textures and 2 render-pass boundaries.
//
// Effect enable flags live in params.fog_flags and params.tonemap_flags so the GPU
// can branch them out without pipeline recompilation.

const PI: f32 = 3.14159265358979;

// ── Atmospheric scatter ────────────────────────────────────────────────────────
// Constants must match lighting.wgsl / fog.wgsl exactly.

const ATM_R_E   : f32       = 6360000.0;
const ATM_R_A   : f32       = 6420000.0;
const ATM_H_R   : f32       = 8500.0;
const ATM_H_M   : f32       = 1200.0;
const ATM_G     : f32       = 0.758;
const ATM_BETA_R: vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);
const ATM_BETA_M: f32       = 21.0e-6;
const ATM_SUN_I : f32       = 20.0;

fn atm_ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {
  let b = dot(ro, rd); let c = dot(ro, ro) - r * r; let d = b * b - c;
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }
  let sq = sqrt(d);
  return vec2<f32>(-b - sq, -b + sq);
}

fn atm_optical_depth(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {
  let t = atm_ray_sphere(pos, dir, ATM_R_A); let ds = t.y / 4.0;
  var od = vec2<f32>(0.0);
  for (var i = 0; i < 4; i++) {
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - ATM_R_E;
    if (h < 0.0) { break; }
    od += vec2<f32>(exp(-h / ATM_H_R), exp(-h / ATM_H_M)) * ds;
  }
  return od;
}

fn atm_scatter(ro: vec3<f32>, rd: vec3<f32>, sun_dir: vec3<f32>) -> vec3<f32> {
  let ta = atm_ray_sphere(ro, rd, ATM_R_A); let tMin = max(ta.x, 0.0);
  if (ta.y < 0.0) { return vec3<f32>(0.0); }
  let tg   = atm_ray_sphere(ro, rd, ATM_R_E);
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);
  if (tMax <= tMin) { return vec3<f32>(0.0); }
  let mu = dot(rd, sun_dir);
  let pR = (3.0 / (16.0 * PI)) * (1.0 + mu * mu);
  let g2 = ATM_G * ATM_G;
  let pM = (3.0 / (8.0 * PI)) * ((1.0 - g2) * (1.0 + mu * mu)) /
            ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * ATM_G * mu, 1e-4), 1.5));
  let ds = (tMax - tMin) / 6.0;
  var sumR = vec3<f32>(0.0); var sumM = vec3<f32>(0.0);
  var odR = 0.0; var odM = 0.0;
  for (var i = 0; i < 6; i++) {
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);
    let h   = length(pos) - ATM_R_E;
    if (h < 0.0) { break; }
    let hrh = exp(-h / ATM_H_R) * ds; let hmh = exp(-h / ATM_H_M) * ds;
    odR += hrh; odM += hmh;
    let tg2 = atm_ray_sphere(pos, sun_dir, ATM_R_E);
    if (tg2.x > 0.0) { continue; }
    let odL = atm_optical_depth(pos, sun_dir);
    let tau = ATM_BETA_R * (odR + odL.x) + ATM_BETA_M * 1.1 * (odM + odL.y);
    sumR += exp(-tau) * hrh; sumM += exp(-tau) * hmh;
  }
  return ATM_SUN_I * (ATM_BETA_R * pR * sumR + vec3<f32>(ATM_BETA_M) * pM * sumM);
}

// ── Structs ───────────────────────────────────────────────────────────────────

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

// Only the first field of the full LightUniforms buffer is needed here.
struct LightDir { direction: vec3<f32>, }

// Combined params buffer — 64 bytes.
// Layout (byte offsets):
//  0  fog_color      vec3<f32>
// 12  depth_density  f32
// 16  depth_begin    f32
// 20  depth_end      f32
// 24  depth_curve    f32
// 28  height_density f32
// 32  height_min     f32
// 36  height_max     f32
// 40  height_curve   f32
// 44  fog_flags      u32  bit 0 = depth fog, bit 1 = height fog
// 48  uw_time        f32
// 52  is_underwater  f32
// 56  tonemap_flags  u32  bit 0 = aces, bit 1 = debug_ao, bit 2 = hdr_canvas
// 60  _pad           f32
struct CompositeParams {
  fog_color      : vec3<f32>,
  depth_density  : f32,
  depth_begin    : f32,
  depth_end      : f32,
  depth_curve    : f32,
  height_density : f32,
  height_min     : f32,
  height_max     : f32,
  height_curve   : f32,
  fog_flags      : u32,
  uw_time        : f32,
  is_underwater  : f32,
  tonemap_flags  : u32,
  _pad           : f32,
}

// invViewProj(64) + cam_pos(12) + pad(4) + sun_dir(12) + pad(4) = 96 bytes
struct StarUniforms {
  invViewProj: mat4x4<f32>,
  cam_pos    : vec3<f32>,
  _pad0      : f32,
  sun_dir    : vec3<f32>,
  _pad1      : f32,
}

struct ExposureBuffer {
  value: f32,
  _p0  : f32, _p1: f32, _p2: f32,
}

// ── Bindings ──────────────────────────────────────────────────────────────────

@group(0) @binding(0) var hdr_tex : texture_2d<f32>;
@group(0) @binding(1) var ao_tex  : texture_2d<f32>;
@group(0) @binding(2) var dep_tex : texture_depth_2d;
@group(0) @binding(3) var samp    : sampler;

@group(1) @binding(0) var<uniform> camera  : CameraUniforms;
@group(1) @binding(1) var<uniform> light   : LightDir;

@group(2) @binding(0) var<uniform>        params   : CompositeParams;
@group(2) @binding(1) var<uniform>        star_uni : StarUniforms;
@group(2) @binding(2) var<storage, read>  exposure : ExposureBuffer;

// ── Vertex shader ─────────────────────────────────────────────────────────────

struct VertOut {
  @builtin(position) pos: vec4<f32>,
  @location(0)       uv : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertOut {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertOut;
  out.pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv  = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ── Star field ────────────────────────────────────────────────────────────────

fn star_hash(p: vec2<f32>) -> f32 {
  return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453);
}

fn star_hash2(p: vec2<f32>) -> vec2<f32> {
  return fract(sin(vec2<f32>(
    dot(p, vec2<f32>(127.1, 311.7)),
    dot(p, vec2<f32>(269.5, 183.3)),
  )) * 43758.5453);
}

fn dir_to_equirect(d: vec3<f32>) -> vec2<f32> {
  let u = atan2(d.x, -d.z) / (2.0 * PI) + 0.5;
  let v = 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI;
  return vec2<f32>(u, v);
}

fn sample_stars(ray_dir: vec3<f32>) -> vec3<f32> {
  let GRID    = vec2<f32>(300.0, 150.0);
  let uv      = dir_to_equirect(ray_dir);
  let gcoord  = uv * GRID;
  let cell    = floor(gcoord);
  let frac_uv = fract(gcoord);
  let lat     = (0.5 - uv.y) * PI;
  let cos_lat = max(cos(lat), 0.15);
  var color   = vec3<f32>(0.0);

  for (var dy: i32 = -1; dy <= 1; dy++) {
    for (var dx: i32 = -1; dx <= 1; dx++) {
      var nc = cell + vec2<f32>(f32(dx), f32(dy));
      if (nc.y < 0.0 || nc.y >= GRID.y) { continue; }
      nc.x = nc.x - floor(nc.x / GRID.x) * GRID.x;
      let h           = star_hash2(nc);
      let cell_lat    = (0.5 - (nc.y + 0.5) / GRID.y) * PI;
      let star_thresh = 1.0 - 0.18 * max(cos(cell_lat), 0.0);
      if (h.x > star_thresh) {
        let off     = star_hash2(nc + vec2<f32>(7.3, 3.7)) * 0.8 + 0.1;
        let to_star = frac_uv - vec2<f32>(f32(dx), f32(dy)) - off;
        let ts_s    = vec2<f32>(to_star.x * cos_lat, to_star.y);
        let dist2   = dot(ts_s, ts_s);
        let glow    = exp(-dist2 * 500.0);
        if (glow < 0.002) { continue; }
        let mag  = pow(star_hash(nc + vec2<f32>(1.5, 0.0)), 1.8);
        let br   = glow * (0.15 + mag * 0.85);
        let roll = star_hash(nc + vec2<f32>(2.5, 0.0));
        var sc   = vec3<f32>(1.0);
        if      (roll < 0.06) { sc = vec3<f32>(0.65, 0.76, 1.0);  }
        else if (roll < 0.20) { sc = vec3<f32>(0.82, 0.89, 1.0);  }
        else if (roll < 0.44) { sc = vec3<f32>(1.0,  1.0,  0.82); }
        else if (roll < 0.57) { sc = vec3<f32>(1.0,  0.78, 0.51); }
        else if (roll < 0.64) { sc = vec3<f32>(1.0,  0.51, 0.25); }
        color += sc * br;
      }
    }
  }
  return color;
}

// ── ACES filmic ───────────────────────────────────────────────────────────────

fn aces_filmic(x: vec3<f32>) -> vec3<f32> {
  let a = 2.51; let b = 0.03; let c = 2.43; let d = 0.59; let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3<f32>(0.0), vec3<f32>(1.0));
}

// ── Fragment shader ───────────────────────────────────────────────────────────

@fragment
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.pos.xy);

  // Debug AO mode — short-circuit everything else.
  if ((params.tonemap_flags & 2u) != 0u) {
    let ao = textureLoad(ao_tex, coord / 2, 0).r;
    return vec4<f32>(ao, ao, ao, 1.0);
  }

  // --- Underwater UV distortion ---
  var sample_uv = in.uv;
  if (params.is_underwater > 0.5) {
    let t = params.uw_time;
    let distort = vec2<f32>(
      sin(in.uv.y * 18.0 + t * 1.4) * 0.006,
      cos(in.uv.x * 14.0 + t * 1.1) * 0.004,
    );
    sample_uv = clamp(in.uv + distort, vec2<f32>(0.001), vec2<f32>(0.999));
  }

  // --- Sample HDR scene ---
  var scene = textureSample(hdr_tex, samp, sample_uv).rgb;

  let depth = textureLoad(dep_tex, coord, 0u);

  // --- Fog (skipped for sky pixels and when no fog mode is active) ---
  if (depth < 1.0 && (params.fog_flags & 3u) != 0u) {
    let ndc       = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, depth, 1.0);
    let world_h   = camera.invViewProj * ndc;
    let world_pos = world_h.xyz / world_h.w;
    let view_pos  = camera.view * vec4<f32>(world_pos, 1.0);
    let view_dist = length(view_pos.xyz);

    let sun_dir = normalize(-light.direction);
    let cam_h   = max(camera.position.y, 0.0);
    let atm_ro  = vec3<f32>(0.0, ATM_R_E + cam_h, 0.0);
    let ray_vec = world_pos - camera.position;
    let ray_dir = normalize(ray_vec);
    let h2      = vec3<f32>(ray_dir.x, 0.0, ray_dir.z);
    let len2    = dot(h2, h2);
    let fog_dir = select(normalize(h2), vec3<f32>(1.0, 0.0, 0.0), len2 < 1e-6);
    let fog_col = atm_scatter(atm_ro, fog_dir, sun_dir) * params.fog_color;

    var fog_amount = 0.0;
    if ((params.fog_flags & 1u) != 0u && params.depth_density > 0.0) {
      let far = select(params.depth_end, camera.far, params.depth_end <= 0.0);
      let t   = smoothstep(params.depth_begin, far, view_dist);
      fog_amount = max(fog_amount, pow(t, params.depth_curve) * params.depth_density);
    }
    if ((params.fog_flags & 2u) != 0u && params.height_density > 0.0) {
      let t = smoothstep(params.height_min, params.height_max, world_pos.y);
      fog_amount = max(fog_amount, pow(t, params.height_curve) * params.height_density);
    }
    scene = mix(scene, fog_col, clamp(fog_amount, 0.0, 1.0));
  }

  // --- Underwater tint + vignette ---
  if (params.is_underwater > 0.5) {
    scene = scene * vec3<f32>(0.20, 0.55, 0.90);
    let d = length(in.uv * 2.0 - 1.0);
    scene *= clamp(1.0 - d * d * 0.55, 0.0, 1.0);
  }

  // --- Exposure ---
  scene *= exposure.value;

  // --- Stars (sky pixels only, rendered after DoF/Bloom for crisp point sources) ---
  if (depth >= 1.0) {
    let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
    let world_h = star_uni.invViewProj * ndc;
    let ray_dir = normalize(world_h.xyz / world_h.w - star_uni.cam_pos);
    if (ray_dir.y > -0.05) {
      let night_t     = saturate((-star_uni.sun_dir.y - 0.05) * 10.0);
      let above_horiz = saturate(ray_dir.y * 20.0);
      let star_fade   = night_t * above_horiz;
      if (star_fade > 0.001) {
        scene += sample_stars(ray_dir) * (star_fade * 2.0);
      }
    }
  }

  // --- Tonemap + gamma ---
  if ((params.tonemap_flags & 4u) != 0u) {
    // HDR canvas mode: skip ACES, just gamma-encode.
    return vec4<f32>(pow(max(scene, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.2)), 1.0);
  }
  let ldr = select(scene, aces_filmic(scene), (params.tonemap_flags & 1u) != 0u);
  return vec4<f32>(pow(ldr, vec3<f32>(1.0 / 2.2)), 1.0);
}
`,I=64,D=96;class Z extends A{constructor(r,e,n,s,t,i){super();l(this,"name","CompositePass");l(this,"depthFogEnabled",!0);l(this,"depthDensity",1);l(this,"depthBegin",32);l(this,"depthEnd",128);l(this,"depthCurve",1.5);l(this,"heightFogEnabled",!1);l(this,"heightDensity",.7);l(this,"heightMin",48);l(this,"heightMax",80);l(this,"heightCurve",1);l(this,"fogColor",[1,1,1]);l(this,"_pipeline");l(this,"_bg0");l(this,"_bg1");l(this,"_bg2");l(this,"_paramsBuf");l(this,"_starBuf");l(this,"_paramsAB",new ArrayBuffer(I));l(this,"_paramsF",new Float32Array(this._paramsAB));l(this,"_paramsU",new Uint32Array(this._paramsAB));l(this,"_starScratch",new Float32Array(D/4));this._pipeline=r,this._bg0=e,this._bg1=n,this._bg2=s,this._paramsBuf=t,this._starBuf=i}static create(r,e,n,s,t,i,a){const{device:o,format:d}=r,c=o.createBindGroupLayout({label:"CompositeBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=o.createBindGroupLayout({label:"CompositeBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=o.createBindGroupLayout({label:"CompositeBGL2",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),h=o.createSampler({label:"CompositeSampler",magFilter:"linear",minFilter:"linear"}),m=o.createBuffer({label:"CompositeParams",size:I,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),g=o.createBuffer({label:"CompositeStars",size:D,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),y=o.createBindGroup({label:"CompositeBG0",layout:c,entries:[{binding:0,resource:e},{binding:1,resource:n},{binding:2,resource:s},{binding:3,resource:h}]}),x=o.createBindGroup({label:"CompositeBG1",layout:p,entries:[{binding:0,resource:{buffer:t}},{binding:1,resource:{buffer:i}}]}),w=o.createBindGroup({label:"CompositeBG2",layout:_,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:g}},{binding:2,resource:{buffer:a}}]}),v=o.createShaderModule({label:"CompositeShader",code:K}),S=o.createPipelineLayout({bindGroupLayouts:[c,p,_]}),M=o.createRenderPipeline({label:"CompositePipeline",layout:S,vertex:{module:v,entryPoint:"vs_main"},fragment:{module:v,entryPoint:"fs_main",targets:[{format:d}]},primitive:{topology:"triangle-list"}});return new Z(M,y,x,w,m,g)}updateParams(r,e,n,s,t,i){const a=this._paramsF,o=this._paramsU;let d=0;this.depthFogEnabled&&(d|=1),this.heightFogEnabled&&(d|=2);let c=0;s&&(c|=1),t&&(c|=2),i&&(c|=4),a[0]=this.fogColor[0],a[1]=this.fogColor[1],a[2]=this.fogColor[2],a[3]=this.depthDensity,a[4]=this.depthBegin,a[5]=this.depthEnd,a[6]=this.depthCurve,a[7]=this.heightDensity,a[8]=this.heightMin,a[9]=this.heightMax,a[10]=this.heightCurve,o[11]=d,a[12]=n,a[13]=e?1:0,o[14]=c,a[15]=0,r.queue.writeBuffer(this._paramsBuf,0,this._paramsAB)}updateStars(r,e,n,s){const t=this._starScratch;t.set(e.data,0),t[16]=n.x,t[17]=n.y,t[18]=n.z,t[19]=0,t[20]=s.x,t[21]=s.y,t[22]=s.z,t[23]=0,r.queue.writeBuffer(this._starBuf,0,t.buffer)}execute(r,e){const n=r.beginRenderPass({label:"CompositePass",colorAttachments:[{view:e.backbufferView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._bg0),n.setBindGroup(1,this._bg1),n.setBindGroup(2,this._bg2),n.draw(3),n.end()}destroy(){this._paramsBuf.destroy(),this._starBuf.destroy()}}function Q(f,u,r){let e=(Math.imul(f,1664525)^Math.imul(u,1013904223)^Math.imul(r,22695477))>>>0;return e=Math.imul(e^e>>>16,73244475)>>>0,e=Math.imul(e^e>>>16,73244475)>>>0,((e^e>>>16)>>>0)/4294967295}function G(f,u,r,e){return Q(f^e,u^e*7+3,r^e*13+5)}function T(f){return f*f*f*(f*(f*6-15)+10)}function $(f,u,r,e,n,s,t,i,a,o,d){const c=f+(u-f)*a,p=r+(e-r)*a,_=n+(s-n)*a,h=t+(i-t)*a,m=c+(p-c)*o,g=_+(h-_)*o;return m+(g-m)*d}const ee=new Int8Array([1,-1,1,-1,1,-1,1,-1,0,0,0,0]),ne=new Int8Array([1,1,-1,-1,0,0,0,0,1,-1,1,-1]),te=new Int8Array([0,0,0,0,1,1,-1,-1,1,1,-1,-1]);function b(f,u,r,e,n,s,t,i){const a=(f%e+e)%e,o=(u%e+e)%e,d=(r%e+e)%e,c=Math.floor(G(a,o,d,n)*12)%12;return ee[c]*s+ne[c]*t+te[c]*i}function re(f,u,r,e,n){const s=Math.floor(f),t=Math.floor(u),i=Math.floor(r),a=f-s,o=u-t,d=r-i,c=T(a),p=T(o),_=T(d);return $(b(s,t,i,e,n,a,o,d),b(s+1,t,i,e,n,a-1,o,d),b(s,t+1,i,e,n,a,o-1,d),b(s+1,t+1,i,e,n,a-1,o-1,d),b(s,t,i+1,e,n,a,o,d-1),b(s+1,t,i+1,e,n,a-1,o,d-1),b(s,t+1,i+1,e,n,a,o-1,d-1),b(s+1,t+1,i+1,e,n,a-1,o-1,d-1),c,p,_)}function ae(f,u,r,e,n,s){let t=0,i=.5,a=1,o=0;for(let d=0;d<e;d++)t+=re(f*a,u*a,r*a,n*a,s+d*17)*i,o+=i,i*=.5,a*=2;return Math.max(0,Math.min(1,t/o*.85+.5))}function B(f,u,r,e,n){const s=f*e,t=u*e,i=r*e,a=Math.floor(s),o=Math.floor(t),d=Math.floor(i);let c=1/0;for(let p=-1;p<=1;p++)for(let _=-1;_<=1;_++)for(let h=-1;h<=1;h++){const m=a+h,g=o+_,y=d+p,x=(m%e+e)%e,w=(g%e+e)%e,v=(y%e+e)%e,S=m+G(x,w,v,n),M=g+G(x,w,v,n+1),j=y+G(x,w,v,n+2),R=s-S,U=t-M,C=i-j,P=R*R+U*U+C*C;P<c&&(c=P)}return 1-Math.min(Math.sqrt(c),1)}function V(f,u,r,e){const n=f.createTexture({label:u,dimension:"3d",size:{width:r,height:r,depthOrArrayLayers:r},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return f.queue.writeTexture({texture:n},e.buffer,{bytesPerRow:r*4,rowsPerImage:r},{width:r,height:r,depthOrArrayLayers:r}),n}function le(f){const r=new Uint8Array(1048576);for(let i=0;i<64;i++)for(let a=0;a<64;a++)for(let o=0;o<64;o++){const d=(i*64*64+a*64+o)*4,c=o/64,p=a/64,_=i/64,h=ae(c,p,_,4,4,0),m=B(c,p,_,2,100),g=B(c,p,_,4,200),y=B(c,p,_,8,300);r[d]=Math.round(h*255),r[d+1]=Math.round(m*255),r[d+2]=Math.round(g*255),r[d+3]=Math.round(y*255)}const e=32,n=new Uint8Array(e*e*e*4);for(let i=0;i<e;i++)for(let a=0;a<e;a++)for(let o=0;o<e;o++){const d=(i*e*e+a*e+o)*4,c=o/e,p=a/e,_=i/e,h=B(c,p,_,4,400),m=B(c,p,_,8,500),g=B(c,p,_,16,600);n[d]=Math.round(h*255),n[d+1]=Math.round(m*255),n[d+2]=Math.round(g*255),n[d+3]=255}const s=V(f,"CloudBaseNoise",64,r),t=V(f,"CloudDetailNoise",e,n);return{baseNoise:s,baseView:s.createView({dimension:"3d"}),detailNoise:t,detailView:t.createView({dimension:"3d"}),destroy(){s.destroy(),t.destroy()}}}export{k as C,H as a,Z as b,le as c};
