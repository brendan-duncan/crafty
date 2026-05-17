// HBAO+: Horizon-Based Ambient Occlusion, plus (NVIDIA, 2008/2013).
//
// For each of N screen-space directions, march from the pixel and track
// the largest "horizon angle" above the tangent plane. The unoccluded
// contribution from that direction is the visible solid angle between
// the tangent plane and the horizon. Average across directions.
//
// The "+" variant just denotes per-pixel direction jitter (we sample a
// 4×4 noise texture) and an angle bias to suppress self-occlusion.
//
// Reads GBuffer depth + normals, writes raw AO value [0, 1].

const NUM_DIRS: i32 = 8;
const STEPS_PER_DIR: i32 = 4;
const TWO_PI: f32 = 6.283185307179586;

struct HbaoUniforms {
  view    : mat4x4<f32>,  // offset   0
  proj    : mat4x4<f32>,  // offset  64
  inv_proj: mat4x4<f32>,  // offset 128
  radius  : f32,          // offset 192
  bias    : f32,          // offset 196 — tangent angle bias in radians
  strength: f32,          // offset 200
  _pad    : f32,
}                          // total 208 bytes

@group(0) @binding(0) var<uniform> u: HbaoUniforms;

@group(1) @binding(0) var normal_tex: texture_2d<f32>;
@group(1) @binding(1) var depth_tex : texture_depth_2d;
@group(1) @binding(2) var noise_tex : texture_2d<f32>;

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

fn view_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let vh  = u.inv_proj * ndc;
  return vh.xyz / vh.w;
}

fn depth_load_uv(uv: vec2<f32>) -> f32 {
  let size = vec2<i32>(textureDimensions(depth_tex));
  let c    = clamp(vec2<i32>(uv * vec2<f32>(size)), vec2<i32>(0), size - vec2<i32>(1));
  return textureLoad(depth_tex, c, 0);
}

@fragment
fn fs_hbao(in: VertexOutput) -> @location(0) vec4<f32> {
  let half_coord = vec2<i32>(in.clip_pos.xy);
  let coord      = half_coord * 2;
  let depth      = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) { return vec4<f32>(1.0, 0.0, 0.0, 1.0); }

  let P = view_pos(in.uv, depth);
  let raw_n   = textureLoad(normal_tex, coord, 0).rgb;
  let world_N = normalize(raw_n * 2.0 - 1.0);
  let N       = normalize((u.view * vec4<f32>(world_N, 0.0)).xyz);

  let noise_coord = vec2<u32>(half_coord) % vec2<u32>(4u);
  let rnd         = textureLoad(noise_tex, noise_coord, 0).rg;

  let tex_size   = vec2<f32>(textureDimensions(depth_tex));
  let proj_scale = u.proj[1][1] * 0.5 * tex_size.y;
  let radius_px  = clamp(u.radius * proj_scale / max(-P.z, 0.01), 4.0, 256.0);
  let step_px    = max(radius_px / f32(STEPS_PER_DIR), 1.0);

  let sin_bias = sin(u.bias);
  var ao_accum: f32 = 0.0;

  for (var d: i32 = 0; d < NUM_DIRS; d++) {
    // Direction angle in [0, 2π) jittered per pixel.
    let phi   = (f32(d) + rnd.x) * (TWO_PI / f32(NUM_DIRS));
    let omega = vec2<f32>(cos(phi), sin(phi));

    // Track max sin(angle above tangent plane) along this direction.
    var sin_h: f32 = -1.0;

    for (var step_i: i32 = 1; step_i <= STEPS_PER_DIR; step_i++) {
      let off  = (f32(step_i) - 0.5 + rnd.y) * step_px;
      let uv_s = clamp(in.uv + omega * off / tex_size, vec2<f32>(0.0), vec2<f32>(1.0));
      let ps   = view_pos(uv_s, depth_load_uv(uv_s));
      let D    = ps - P;
      let len  = length(D);
      if (len > u.radius * 2.0 || len < 1e-5) { continue; }

      // sin(angle from tangent plane) = (D · N) / |D|.
      let s = dot(D, N) / len;

      // Range attenuation softens the horizon contribution past ~radius.
      let attn = 1.0 - smoothstep(0.0, u.radius * 2.0, len);
      sin_h = max(sin_h, s * attn);
    }

    // Visible angular extent above tangent plane = sin_h, minus a bias to
    // suppress self-occlusion on flat surfaces. Negative contributions are
    // clamped (the sample is below the tangent plane → no occlusion).
    ao_accum += max(sin_h - sin_bias, 0.0);
  }

  let occlusion  = (ao_accum / f32(NUM_DIRS)) * u.strength;
  let ao_factor  = clamp(1.0 - occlusion, 0.0, 1.0);
  return vec4<f32>(ao_factor, 0.0, 0.0, 1.0);
}
