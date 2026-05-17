var te=Object.defineProperty;var ne=(c,f,n)=>f in c?te(c,f,{enumerable:!0,configurable:!0,writable:!0,value:n}):c[f]=n;var s=(c,f,n)=>ne(c,typeof f!="symbol"?f+"":f,n);import{R as z}from"./render_pass-BouxMEb8.js";import{H as F}from"./deferred_lighting_pass-DzAeDZen.js";const re=`// Cloud + sky pass — fullscreen triangle.
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
`,I=96,H=48,k=32;class j extends z{constructor(n,e,t,d,a,o,i,r,l){super();s(this,"name","CloudPass");s(this,"_pipeline");s(this,"_hdrView");s(this,"_cameraBuffer");s(this,"_cloudBuffer");s(this,"_lightBuffer");s(this,"_sceneBG");s(this,"_lightBG");s(this,"_depthBG");s(this,"_noiseSkyBG");s(this,"_cameraScratch",new Float32Array(I/4));s(this,"_lightScratch",new Float32Array(k/4));s(this,"_settingsScratch",new Float32Array(H/4));this._pipeline=n,this._hdrView=e,this._cameraBuffer=t,this._cloudBuffer=d,this._lightBuffer=a,this._sceneBG=o,this._lightBG=i,this._depthBG=r,this._noiseSkyBG=l}static create(n,e,t,d){const{device:a}=n,o=a.createBuffer({label:"CloudCameraBuffer",size:I,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=a.createBuffer({label:"CloudUniformBuffer",size:H,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),r=a.createBuffer({label:"CloudLightBuffer",size:k,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=a.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),u=a.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=a.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=a.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=a.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),m=a.createSampler({label:"CloudDepthSampler"}),g=a.createBindGroup({label:"CloudSceneBG",layout:l,entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:i}}]}),y=a.createBindGroup({label:"CloudLightBG",layout:u,entries:[{binding:0,resource:{buffer:r}}]}),v=a.createBindGroup({label:"CloudDepthBG",layout:_,entries:[{binding:0,resource:t},{binding:1,resource:m}]}),b=a.createBindGroup({label:"CloudNoiseSkyBG",layout:p,entries:[{binding:0,resource:d.baseView},{binding:1,resource:d.detailView},{binding:2,resource:h}]}),x=a.createShaderModule({label:"CloudShader",code:re}),B=a.createRenderPipeline({label:"CloudPipeline",layout:a.createPipelineLayout({bindGroupLayouts:[l,u,_,p]}),vertex:{module:x,entryPoint:"vs_main"},fragment:{module:x,entryPoint:"fs_main",targets:[{format:F}]},primitive:{topology:"triangle-list"}});return new j(B,e,o,i,r,g,y,v,b)}updateCamera(n,e,t,d,a){const o=this._cameraScratch;o.set(e.data,0),o[16]=t.x,o[17]=t.y,o[18]=t.z,o[19]=d,o[20]=a,n.queue.writeBuffer(this._cameraBuffer,0,o.buffer)}updateLight(n,e,t,d){const a=this._lightScratch;a[0]=e.x,a[1]=e.y,a[2]=e.z,a[3]=d,a[4]=t.x,a[5]=t.y,a[6]=t.z,n.queue.writeBuffer(this._lightBuffer,0,a.buffer)}updateSettings(n,e){const t=this._settingsScratch;t[0]=e.cloudBase,t[1]=e.cloudTop,t[2]=e.coverage,t[3]=e.density,t[4]=e.windOffset[0],t[5]=e.windOffset[1],t[6]=e.anisotropy,t[7]=e.extinction,t[8]=e.ambientColor[0],t[9]=e.ambientColor[1],t[10]=e.ambientColor[2],t[11]=e.exposure,n.queue.writeBuffer(this._cloudBuffer,0,t.buffer)}execute(n,e){const t=n.beginRenderPass({label:"CloudPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._pipeline),t.setBindGroup(0,this._sceneBG),t.setBindGroup(1,this._lightBG),t.setBindGroup(2,this._depthBG),t.setBindGroup(3,this._noiseSkyBG),t.draw(3),t.end()}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const ae=`// Cloud shadow pass — renders a top-down cloud transmittance map (1024×1024 r8unorm).
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
`,Y=1024,Z="r8unorm",W=48;class q extends z{constructor(n,e,t,d,a,o){super();s(this,"name","CloudShadowPass");s(this,"shadowTexture");s(this,"shadowView");s(this,"_pipeline");s(this,"_uniformBuffer");s(this,"_uniformBG");s(this,"_noiseBG");s(this,"_frameCount",0);s(this,"_data",new Float32Array(W/4));this.shadowTexture=n,this.shadowView=e,this._pipeline=t,this._uniformBuffer=d,this._uniformBG=a,this._noiseBG=o}static create(n,e){const{device:t}=n,d=t.createTexture({label:"CloudShadowTexture",size:{width:Y,height:Y},format:Z,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),a=d.createView(),o=t.createBuffer({label:"CloudShadowUniform",size:W,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=t.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),r=t.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),l=t.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),u=t.createBindGroup({label:"CloudShadowUniformBG",layout:i,entries:[{binding:0,resource:{buffer:o}}]}),_=t.createBindGroup({label:"CloudShadowNoiseBG",layout:l,entries:[{binding:0,resource:e.baseView},{binding:1,resource:e.detailView},{binding:2,resource:r}]}),p=t.createShaderModule({label:"CloudShadowShader",code:ae}),h=t.createRenderPipeline({label:"CloudShadowPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[i,l]}),vertex:{module:p,entryPoint:"vs_main"},fragment:{module:p,entryPoint:"fs_main",targets:[{format:Z}]},primitive:{topology:"triangle-list"}});return new q(d,a,h,o,u,_)}update(n,e,t,d){this._data[0]=e.cloudBase,this._data[1]=e.cloudTop,this._data[2]=e.coverage,this._data[3]=e.density,this._data[4]=e.windOffset[0],this._data[5]=e.windOffset[1],this._data[6]=t[0],this._data[7]=t[1],this._data[8]=d,this._data[9]=e.extinction,n.queue.writeBuffer(this._uniformBuffer,0,this._data.buffer)}execute(n,e){if(this._frameCount++%2!==0)return;const t=n.beginRenderPass({label:"CloudShadowPass",colorAttachments:[{view:this.shadowView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._pipeline),t.setBindGroup(0,this._uniformBG),t.setBindGroup(1,this._noiseBG),t.draw(3),t.end()}destroy(){this.shadowTexture.destroy(),this._uniformBuffer.destroy()}}const oe=`// godray_march.wgsl — Half-resolution ray-march pass with 3D cloud-density shadowing

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
`,ie=`// godray_composite.wgsl — Blur and composite passes for volumetric godrays.
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
`,C=F,A=16,se=64;class J extends z{constructor(n,e,t,d,a,o,i,r,l,u,_,p,h,m,g,y,v,b){super();s(this,"name","GodrayPass");s(this,"scattering",.3);s(this,"fogCurve",2);s(this,"maxSteps",16);s(this,"_fogA");s(this,"_fogB");s(this,"_fogAView");s(this,"_fogBView");s(this,"_hdrView");s(this,"_marchPipeline");s(this,"_blurHPipeline");s(this,"_blurVPipeline");s(this,"_compositePipeline");s(this,"_marchBG");s(this,"_blurHBG");s(this,"_blurVBG");s(this,"_compositeBG");s(this,"_marchParamsBuf");s(this,"_blurHParamsBuf");s(this,"_blurVParamsBuf");s(this,"_compParamsBuf");s(this,"_cloudDensityBuf");s(this,"_marchScratch",new Float32Array(4));s(this,"_compScratch",new Float32Array(4));s(this,"_densityScratch",new Float32Array(8));this._fogA=n,this._fogAView=e,this._fogB=t,this._fogBView=d,this._hdrView=a,this._marchPipeline=o,this._blurHPipeline=i,this._blurVPipeline=r,this._compositePipeline=l,this._marchBG=u,this._blurHBG=_,this._blurVBG=p,this._compositeBG=h,this._marchParamsBuf=m,this._blurHParamsBuf=g,this._blurVParamsBuf=y,this._compParamsBuf=v,this._cloudDensityBuf=b}static create(n,e,t,d,a,o,i){const{device:r,width:l,height:u}=n,_=Math.max(1,l>>1),p=Math.max(1,u>>1),h=r.createTexture({label:"GodrayFogA",size:{width:_,height:p},format:C,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=r.createTexture({label:"GodrayFogB",size:{width:_,height:p},format:C,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),g=h.createView(),y=m.createView(),v=r.createSampler({label:"GodraySampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),b=r.createSampler({label:"GodrayNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),x=r.createSampler({label:"GodrayCmpSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),B=r.createBuffer({label:"GodrayCloudDensity",size:se,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),U=r.createBuffer({label:"GodrayMarchParams",size:A,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(U,0,new Float32Array([.3,16,0,0]).buffer);const M=r.createBuffer({label:"GodrayBlurHParams",size:A,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(M,0,new Float32Array([1,0,0,0]).buffer);const S=r.createBuffer({label:"GodrayBlurVParams",size:A,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(S,0,new Float32Array([0,1,0,0]).buffer);const G=r.createBuffer({label:"GodrayCompositeParams",size:A,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(G,0,new Float32Array([0,0,2,0]).buffer);const O=r.createShaderModule({label:"GodrayMarchShader",code:oe}),R=r.createRenderPipeline({label:"GodrayMarchPipeline",layout:"auto",vertex:{module:O,entryPoint:"vs_main"},fragment:{module:O,entryPoint:"fs_march",targets:[{format:C}]},primitive:{topology:"triangle-list"}}),K=r.createBindGroup({label:"GodrayMarchBG",layout:R.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:a}},{binding:1,resource:{buffer:o}},{binding:2,resource:e.depthView},{binding:3,resource:t.shadowMapView},{binding:4,resource:x},{binding:5,resource:{buffer:U}},{binding:6,resource:{buffer:B}},{binding:7,resource:i.baseView},{binding:8,resource:i.detailView},{binding:9,resource:b}]}),P=r.createShaderModule({label:"GodrayCompositeShader",code:ie}),N=r.createRenderPipeline({label:"GodrayBlurHPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:C}]},primitive:{topology:"triangle-list"}}),D=r.createRenderPipeline({label:"GodrayBlurVPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:C}]},primitive:{topology:"triangle-list"}}),L=r.createRenderPipeline({label:"GodrayCompositePipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_composite",targets:[{format:F,blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}}),Q=r.createBindGroup({label:"GodrayBlurHBG",layout:N.getBindGroupLayout(0),entries:[{binding:0,resource:g},{binding:1,resource:e.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:M}}]}),$=r.createBindGroup({label:"GodrayBlurVBG",layout:D.getBindGroupLayout(0),entries:[{binding:0,resource:y},{binding:1,resource:e.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:S}}]}),ee=r.createBindGroup({label:"GodrayCompositeBG",layout:L.getBindGroupLayout(0),entries:[{binding:0,resource:g},{binding:1,resource:e.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:G}},{binding:4,resource:{buffer:o}}]});return new J(h,g,m,y,d,R,N,D,L,K,Q,$,ee,U,M,S,G,B)}updateParams(n){this._marchScratch[0]=this.scattering,this._marchScratch[1]=this.maxSteps,this._marchScratch[2]=0,this._marchScratch[3]=0,n.queue.writeBuffer(this._marchParamsBuf,0,this._marchScratch.buffer),this._compScratch[0]=0,this._compScratch[1]=0,this._compScratch[2]=this.fogCurve,this._compScratch[3]=0,n.queue.writeBuffer(this._compParamsBuf,0,this._compScratch.buffer)}updateCloudDensity(n,e){const t=this._densityScratch;t[0]=e.cloudBase,t[1]=e.cloudTop,t[2]=e.coverage,t[3]=e.density,t[4]=e.windOffset[0],t[5]=e.windOffset[1],t[6]=e.extinction,t[7]=0,n.queue.writeBuffer(this._cloudDensityBuf,0,t.buffer)}execute(n,e){const t=(d,a,o,i,r=!0)=>{const l=n.beginRenderPass({label:d,colorAttachments:[{view:a,clearValue:[0,0,0,0],loadOp:r?"clear":"load",storeOp:"store"}]});l.setPipeline(o),l.setBindGroup(0,i),l.draw(3),l.end()};t("GodrayMarch",this._fogAView,this._marchPipeline,this._marchBG),t("GodrayBlurH",this._fogBView,this._blurHPipeline,this._blurHBG),t("GodrayBlurV",this._fogAView,this._blurVPipeline,this._blurVBG),t("GodrayComposite",this._hdrView,this._compositePipeline,this._compositeBG,!1)}destroy(){this._fogA.destroy(),this._fogB.destroy(),this._marchParamsBuf.destroy(),this._blurHParamsBuf.destroy(),this._blurVParamsBuf.destroy(),this._compParamsBuf.destroy(),this._cloudDensityBuf.destroy()}}function le(c,f,n){let e=(Math.imul(c,1664525)^Math.imul(f,1013904223)^Math.imul(n,22695477))>>>0;return e=Math.imul(e^e>>>16,73244475)>>>0,e=Math.imul(e^e>>>16,73244475)>>>0,((e^e>>>16)>>>0)/4294967295}function E(c,f,n,e){return le(c^e,f^e*7+3,n^e*13+5)}function V(c){return c*c*c*(c*(c*6-15)+10)}function de(c,f,n,e,t,d,a,o,i,r,l){const u=c+(f-c)*i,_=n+(e-n)*i,p=t+(d-t)*i,h=a+(o-a)*i,m=u+(_-u)*r,g=p+(h-p)*r;return m+(g-m)*l}const ce=new Int8Array([1,-1,1,-1,1,-1,1,-1,0,0,0,0]),ue=new Int8Array([1,1,-1,-1,0,0,0,0,1,-1,1,-1]),fe=new Int8Array([0,0,0,0,1,1,-1,-1,1,1,-1,-1]);function w(c,f,n,e,t,d,a,o){const i=(c%e+e)%e,r=(f%e+e)%e,l=(n%e+e)%e,u=Math.floor(E(i,r,l,t)*12)%12;return ce[u]*d+ue[u]*a+fe[u]*o}function pe(c,f,n,e,t){const d=Math.floor(c),a=Math.floor(f),o=Math.floor(n),i=c-d,r=f-a,l=n-o,u=V(i),_=V(r),p=V(l);return de(w(d,a,o,e,t,i,r,l),w(d+1,a,o,e,t,i-1,r,l),w(d,a+1,o,e,t,i,r-1,l),w(d+1,a+1,o,e,t,i-1,r-1,l),w(d,a,o+1,e,t,i,r,l-1),w(d+1,a,o+1,e,t,i-1,r,l-1),w(d,a+1,o+1,e,t,i,r-1,l-1),w(d+1,a+1,o+1,e,t,i-1,r-1,l-1),u,_,p)}function _e(c,f,n,e,t,d){let a=0,o=.5,i=1,r=0;for(let l=0;l<e;l++)a+=pe(c*i,f*i,n*i,t*i,d+l*17)*o,r+=o,o*=.5,i*=2;return Math.max(0,Math.min(1,a/r*.85+.5))}function T(c,f,n,e,t){const d=c*e,a=f*e,o=n*e,i=Math.floor(d),r=Math.floor(a),l=Math.floor(o);let u=1/0;for(let _=-1;_<=1;_++)for(let p=-1;p<=1;p++)for(let h=-1;h<=1;h++){const m=i+h,g=r+p,y=l+_,v=(m%e+e)%e,b=(g%e+e)%e,x=(y%e+e)%e,B=m+E(v,b,x,t),U=g+E(v,b,x,t+1),M=y+E(v,b,x,t+2),S=d-B,G=a-U,O=o-M,R=S*S+G*G+O*O;R<u&&(u=R)}return 1-Math.min(Math.sqrt(u),1)}function X(c,f,n,e){const t=c.createTexture({label:f,dimension:"3d",size:{width:n,height:n,depthOrArrayLayers:n},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return c.queue.writeTexture({texture:t},e.buffer,{bytesPerRow:n*4,rowsPerImage:n},{width:n,height:n,depthOrArrayLayers:n}),t}function ye(c){const n=new Uint8Array(1048576);for(let o=0;o<64;o++)for(let i=0;i<64;i++)for(let r=0;r<64;r++){const l=(o*64*64+i*64+r)*4,u=r/64,_=i/64,p=o/64,h=_e(u,_,p,4,4,0),m=T(u,_,p,2,100),g=T(u,_,p,4,200),y=T(u,_,p,8,300);n[l]=Math.round(h*255),n[l+1]=Math.round(m*255),n[l+2]=Math.round(g*255),n[l+3]=Math.round(y*255)}const e=32,t=new Uint8Array(e*e*e*4);for(let o=0;o<e;o++)for(let i=0;i<e;i++)for(let r=0;r<e;r++){const l=(o*e*e+i*e+r)*4,u=r/e,_=i/e,p=o/e,h=T(u,_,p,4,400),m=T(u,_,p,8,500),g=T(u,_,p,16,600);t[l]=Math.round(h*255),t[l+1]=Math.round(m*255),t[l+2]=Math.round(g*255),t[l+3]=255}const d=X(c,"CloudBaseNoise",64,n),a=X(c,"CloudDetailNoise",e,t);return{baseNoise:d,baseView:d.createView({dimension:"3d"}),detailNoise:a,detailView:a.createView({dimension:"3d"}),destroy(){d.destroy(),a.destroy()}}}export{j as C,J as G,q as a,ye as c};
