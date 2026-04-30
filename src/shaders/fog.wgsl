// fog.wgsl — Screen-space depth and height fog pass.
//
// Depth fog:  smoothstep from depth_begin to depth_end in view space, giving the
//             classic "render distance" fog that caps visibility.
// Height fog: smoothstep from height_min (full fog) to height_max (clear) in world Y,
//             useful for low-lying ground mist. Set height_min > height_max for fog
//             that thickens as the player descends (Minecraft-style underground mist).
//
// Fog color is derived from the same physical atmosphere model used in lighting.wgsl
// (Rayleigh + Mie scatter), so it automatically matches the sky at any time of day.

const PI: f32 = 3.14159265358979323846;

// Atmosphere constants — must match lighting.wgsl exactly.
const ATM_FOG_SCALE : f32       = 80.0;
const ATM_R_E       : f32       = 6360000.0;
const ATM_R_A       : f32       = 6420000.0;
const ATM_H_R       : f32       = 8500.0;
const ATM_H_M       : f32       = 1200.0;
const ATM_G         : f32       = 0.758;
const ATM_BETA_R    : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);
const ATM_BETA_M    : f32       = 21.0e-6;
const ATM_SUN_I     : f32       = 20.0;

fn atm_ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {
  let b = dot(ro, rd); let c = dot(ro, ro) - r * r; let d = b*b - c;
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
  cascadeTexelSizes : vec4<f32>,
}

// Layout (all offsets in bytes):
//  0: fog_color      vec3<f32>  (size 12, used as tint multiplier)
// 12: depth_density  f32
// 16: depth_begin    f32
// 20: depth_end      f32
// 24: depth_curve    f32
// 28: height_density f32
// 32: height_min     f32
// 36: height_max     f32
// 40: height_curve   f32
// 44: flags          u32
// 48: _pad×3         f32
// Total: 64 bytes
struct FogParams {
  fog_color     : vec3<f32>,
  depth_density : f32,
  depth_begin   : f32,
  depth_end     : f32,
  depth_curve   : f32,
  height_density: f32,
  height_min    : f32,
  height_max    : f32,
  height_curve  : f32,
  flags         : u32,
  _pad0         : f32,
  _pad1         : f32,
  _pad2         : f32,
}

@group(0) @binding(0) var          scene_tex : texture_2d<f32>;
@group(0) @binding(1) var          depth_tex : texture_depth_2d;
@group(0) @binding(2) var          samp      : sampler;
@group(0) @binding(3) var<uniform> camera    : CameraUniforms;
@group(0) @binding(4) var<uniform> light     : LightUniforms;
@group(0) @binding(5) var<uniform> fog_params: FogParams;

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

fn depth_load(uv: vec2<f32>) -> f32 {
  let size  = vec2<i32>(textureDimensions(depth_tex));
  let coord = clamp(vec2<i32>(uv * vec2<f32>(size)), vec2<i32>(0), size - vec2<i32>(1));
  return textureLoad(depth_tex, coord, 0u);
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  var scene = textureSample(scene_tex, samp, in.uv).rgb;

  let depth = depth_load(in.uv);
  if (depth >= 1.0) { return vec4<f32>(scene, 1.0); } // sky — no fog

  // Reconstruct world and view-space positions from depth.
  let ndc       = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, depth, 1.0);
  let world_h   = camera.invViewProj * ndc;
  let world_pos = world_h.xyz / world_h.w;
  let view_pos  = camera.view * vec4<f32>(world_pos, 1.0);
  let view_dist = length(view_pos.xyz);

  // Fog color: physically-based atmospheric scatter, same model as lighting.wgsl.
  // Use the horizontal component of the view ray so fog color is a function of
  // azimuth only (no altitude discontinuity at the horizon line).
  let sun_dir  = normalize(-light.direction);
  let cam_h    = max(camera.position.y, 0.0);
  let atm_ro   = vec3<f32>(0.0, ATM_R_E + cam_h, 0.0);
  let ray_vec  = world_pos - camera.position;
  let ray_dir  = normalize(ray_vec);
  let h2       = vec3<f32>(ray_dir.x, 0.0, ray_dir.z);
  let len2     = dot(h2, h2);
  let fog_dir  = select(normalize(h2), vec3<f32>(1.0, 0.0, 0.0), len2 < 1e-6);
  let fog_color = atm_scatter(atm_ro, fog_dir, sun_dir) * fog_params.fog_color;

  var fog_amount = 0.0;

  // Depth fog: view-space distance, matching the reference's linear smoothstep.
  if ((fog_params.flags & 1u) != 0u && fog_params.depth_density > 0.0) {
    let far = select(fog_params.depth_end, camera.far, fog_params.depth_end <= 0.0);
    let t   = smoothstep(fog_params.depth_begin, far, view_dist);
    fog_amount = max(fog_amount, pow(t, fog_params.depth_curve) * fog_params.depth_density);
  }

  // Height fog: world Y — set height_min > height_max for low-altitude mist.
  if ((fog_params.flags & 2u) != 0u && fog_params.height_density > 0.0) {
    let t = smoothstep(fog_params.height_min, fog_params.height_max, world_pos.y);
    fog_amount = max(fog_amount, pow(t, fog_params.height_curve) * fog_params.height_density);
  }

  fog_amount = clamp(fog_amount, 0.0, 1.0);
  scene = mix(scene, fog_color, fog_amount);

  return vec4<f32>(scene, 1.0);
}
