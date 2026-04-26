// Cloud + sky pass — fullscreen triangle.
// Raymarches 64 steps through a cloud slab, with 8-step light marching for
// self-shadow transmittance.  Also computes sky colour from the equirect HDR
// and composites: cloudColor + skyColor × totalTransmittance.

const PI: f32 = 3.14159265358979323846;

// ---- Uniforms ----------------------------------------------------------------

// 24 floats = 96 bytes
// matches cloud_pass.ts CLOUD_CAMERA_UNIFORM_SIZE
struct CameraUniforms {
  invViewProj : mat4x4<f32>,  // offset 0, size 64
  position    : vec3<f32>,    // offset 64 (align 16)
  near        : f32,          // offset 76
  far         : f32,          // offset 80
}

// 12 floats = 48 bytes
// matches cloud_pass.ts CLOUD_UNIFORM_SIZE
struct CloudUniforms {
  cloudBase   : f32,        // offset 0
  cloudTop    : f32,        // offset 4
  coverage    : f32,        // offset 8
  density     : f32,        // offset 12
  windOffset  : vec2<f32>,  // offset 16 (align 8)
  anisotropy  : f32,        // offset 24
  extinction  : f32,        // offset 28
  ambientColor: vec3<f32>,  // offset 32 (align 16)
  exposure    : f32,        // offset 44
}

// 8 floats = 32 bytes
// matches cloud_pass.ts CLOUD_LIGHT_UNIFORM_SIZE
struct LightUniforms {
  direction : vec3<f32>,  // offset 0 (align 16)
  intensity : f32,        // offset 12
  color     : vec3<f32>,  // offset 16 (align 16)
  _pad      : f32,        // offset 28
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> cloud : CloudUniforms;
@group(1) @binding(0) var<uniform> light : LightUniforms;
@group(2) @binding(0) var          depth_tex  : texture_depth_2d;
@group(2) @binding(1) var          depth_samp : sampler;
@group(3) @binding(0) var          base_noise  : texture_3d<f32>;
@group(3) @binding(1) var          detail_noise: texture_3d<f32>;
@group(3) @binding(2) var          sky_tex    : texture_2d<f32>;
@group(3) @binding(3) var          noise_samp : sampler;   // repeat all, trilinear
@group(3) @binding(4) var          sky_samp   : sampler;   // repeat U, clamp-to-edge V

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

// ---- Helpers -----------------------------------------------------------------

fn equirect_uv(dir: vec3<f32>) -> vec2<f32> {
  let u = atan2(-dir.z, dir.x) / (2.0 * PI) + 0.5;
  let v = acos(clamp(dir.y, -1.0, 1.0)) / PI;
  return vec2<f32>(u, v);
}

fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {
  return a + saturate((v - lo) / max(hi - lo, 0.0001)) * (b - a);
}

// Cumulus height profile: rises quickly at base, fades at top.
fn height_gradient(y: f32) -> f32 {
  let t    = clamp((y - cloud.cloudBase) / max(cloud.cloudTop - cloud.cloudBase, 0.001), 0.0, 1.0);
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);
  return saturate(base * top);
}

// Henyey-Greenstein phase function
fn hg_phase(cos_theta: f32, g: f32) -> f32 {
  let g2 = g * g;
  return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * cos_theta, 1.5));
}

// Dual-lobe HG: strong forward scatter + slight back-scatter for silver lining
fn dual_phase(cos_theta: f32, g: f32) -> f32 {
  return 0.7 * hg_phase(cos_theta, g) + 0.3 * hg_phase(cos_theta, -0.25);
}

// Sample cloud density at world position p
fn sample_density(p: vec3<f32>) -> f32 {
  let base_uv = (p + vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y)) * 0.04;
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);

  // Perlin-Worley combination for bulk cloud shape
  let pw  = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;
  let hg  = height_gradient(p.y);
  let cov = saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }

  // Detail erosion
  let detail_uv = p * 0.12 + vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y) * 0.1;
  let det    = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;

  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud.density;
}

// Base-noise-only density for light marching — no detail read, faster.
fn sample_density_coarse(p: vec3<f32>) -> f32 {
  let base_uv = (p + vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y)) * 0.04;
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);
  let pw  = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;
  let hg  = height_gradient(p.y);
  return saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg * cloud.density;
}

// March 4 steps toward the sun using coarse density (no detail noise).
fn light_march(p: vec3<f32>, sun_dir: vec3<f32>) -> f32 {
  let step_size = (cloud.cloudTop - cloud.cloudBase) / 4.0;
  var opt_depth = 0.0;
  for (var i = 0; i < 4; i++) {
    let sp = p + sun_dir * (f32(i) + 0.5) * step_size;
    if (sp.y < cloud.cloudBase || sp.y > cloud.cloudTop) { continue; }
    opt_depth += sample_density_coarse(sp) * step_size;
  }
  return exp(-opt_depth * cloud.extinction);
}

// Returns (tNear, tFar) of ray-slab intersection; both < 0 means no hit.
fn ray_slab(ro: vec3<f32>, rd: vec3<f32>, y_min: f32, y_max: f32) -> vec2<f32> {
  if (abs(rd.y) < 1e-6) {
    if (ro.y < y_min || ro.y > y_max) { return vec2<f32>(-1.0, -1.0); }
    return vec2<f32>(0.0, 1e9);
  }
  let t0 = (y_min - ro.y) / rd.y;
  let t1 = (y_max - ro.y) / rd.y;
  let t_near = min(t0, t1);
  let t_far  = max(t0, t1);
  if (t_far < 0.0) { return vec2<f32>(-1.0, -1.0); }
  return vec2<f32>(max(t_near, 0.0), t_far);
}

// ---- Fragment shader ---------------------------------------------------------

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Reconstruct view ray
  let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
  let world_h = camera.invViewProj * ndc;
  let ray_dir = normalize(world_h.xyz / world_h.w - camera.position);

  // Sky colour via equirect lookup (level 0 = avoid uniform control flow requirement)
  let sky_color = textureSampleLevel(sky_tex, sky_samp, equirect_uv(ray_dir), 0.0).rgb * cloud.exposure;

  // Clip ray at scene geometry
  let geo_depth = textureLoad(depth_tex, vec2<i32>(in.clip_pos.xy), 0);
  var geo_dist  = 1e9;
  if (geo_depth < 1.0) {
    let ndc_geo = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, geo_depth, 1.0);
    let geo_h   = camera.invViewProj * ndc_geo;
    let geo_pos = geo_h.xyz / geo_h.w;
    geo_dist    = distance(geo_pos, camera.position);
  }

  // Intersect ray with cloud slab
  let slab = ray_slab(camera.position, ray_dir, cloud.cloudBase, cloud.cloudTop);
  if (slab.x < 0.0 || slab.x > geo_dist) {
    return vec4<f32>(sky_color, 1.0);
  }

  // Cap at 200 units so horizontal rays don't produce astronomically large step sizes.
  let t_end   = min(min(slab.y, geo_dist), 200.0);
  if (t_end <= slab.x) { return vec4<f32>(sky_color, 1.0); }

  // Primary ray march (32 steps with per-pixel IGN jitter for TAA-friendly integration).
  let step_size  = (t_end - slab.x) / 32.0;
  let coord      = vec2<i32>(in.clip_pos.xy);
  let jitter     = fract(52.9829189 * fract(0.06711056 * f32(coord.x) + 0.00583715 * f32(coord.y)));
  let t_start    = slab.x + jitter * step_size;
  let L          = normalize(-light.direction);
  let cos_theta  = dot(ray_dir, L);
  let phase      = dual_phase(cos_theta, cloud.anisotropy);

  var cloud_color = vec3<f32>(0.0);
  var total_trans = 1.0;

  for (var i = 0; i < 32; i++) {
    let t = t_start + f32(i) * step_size;
    if (t >= t_end) { break; }
    let p = camera.position + ray_dir * t;

    let dens = sample_density(p);
    if (dens < 0.001) { continue; }

    let shadow_t   = light_march(p, L);
    let height_frac = clamp((p.y - cloud.cloudBase) / max(cloud.cloudTop - cloud.cloudBase, 0.001), 0.0, 1.0);

    let sun_energy = light.color * light.intensity * shadow_t * phase;
    let amb_energy = cloud.ambientColor * mix(0.5, 1.0, height_frac);

    // Beer's law step
    let opt    = dens * cloud.extinction * step_size;
    let t_step = exp(-opt);

    // Energy contribution: (incoming) × (fraction scattered in) × (transmittance to camera)
    cloud_color += (sun_energy + amb_energy) * (1.0 - t_step) * total_trans;
    total_trans *= t_step;

    if (total_trans < 0.01) { break; }
  }

  return vec4<f32>(cloud_color + sky_color * total_trans, 1.0);
}
