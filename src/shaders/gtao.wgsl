// GTAO: Ground Truth Ambient Occlusion (Jiménez et al. 2016).
//
// Slice-based horizon integration with projected-normal correction.
// For each slice through the view direction, find horizons left and right
// of the pixel, project the surface normal onto the slice plane, and
// evaluate the analytical cosine-weighted visibility integral.
//
// Reads GBuffer depth + normals, writes raw AO value [0, 1].

const NUM_SLICES: i32 = 2;
const STEPS_PER_DIR: i32 = 4;
const HALF_PI: f32 = 1.5707963267948966;
const PI: f32 = 3.141592653589793;

struct GtaoUniforms {
  view    : mat4x4<f32>,  // offset   0
  proj    : mat4x4<f32>,  // offset  64
  inv_proj: mat4x4<f32>,  // offset 128
  radius  : f32,          // offset 192
  bias    : f32,          // offset 196 — thickness bias (radius * (1 + bias*10) cutoff)
  strength: f32,          // offset 200 — exponent applied to visibility
  _pad    : f32,
}                          // total 208 bytes

@group(0) @binding(0) var<uniform> u: GtaoUniforms;

@group(1) @binding(0) var normal_tex: texture_2d<f32>;   // rgba16float (N*0.5+0.5 in rgb)
@group(1) @binding(1) var depth_tex : texture_depth_2d;  // depth32float
@group(1) @binding(2) var noise_tex : texture_2d<f32>;   // 4×4 random rg in [0,1]

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
fn fs_gtao(in: VertexOutput) -> @location(0) vec4<f32> {
  // Half-res target; GBuffer textures are full-res, so address by half_coord*2.
  let half_coord = vec2<i32>(in.clip_pos.xy);
  let coord      = half_coord * 2;
  let depth      = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) { return vec4<f32>(1.0, 0.0, 0.0, 1.0); }

  let P = view_pos(in.uv, depth);
  let raw_n   = textureLoad(normal_tex, coord, 0).rgb;
  let world_N = normalize(raw_n * 2.0 - 1.0);
  let N       = normalize((u.view * vec4<f32>(world_N, 0.0)).xyz);
  let V       = normalize(-P);  // camera is at origin in view space

  // Per-pixel jitter (4×4 tiled). Use stored rg as two random [0,1] values.
  let noise_coord = vec2<u32>(half_coord) % vec2<u32>(4u);
  let rnd         = textureLoad(noise_tex, noise_coord, 0).rg;

  // Convert world-space radius to half-res pixel-step length on the depth tex.
  // proj[1][1] is the vertical projection scale (cot(fovy/2)). Half-res tex_size
  // is half the depth_tex size, but we step in UV space so units cancel.
  let tex_size   = vec2<f32>(textureDimensions(depth_tex));
  let proj_scale = u.proj[1][1] * 0.5 * tex_size.y;
  let radius_px  = clamp(u.radius * proj_scale / max(-P.z, 0.01), 4.0, 256.0);
  let step_px    = max(radius_px / f32(STEPS_PER_DIR), 1.0);
  let max_thick  = u.radius * (1.0 + u.bias * 10.0);

  var visibility: f32 = 0.0;

  for (var s: i32 = 0; s < NUM_SLICES; s++) {
    // Slice angle in [0, π) jittered per pixel.
    let phi   = (f32(s) + rnd.x) * (PI / f32(NUM_SLICES));
    let omega = vec2<f32>(cos(phi), sin(phi));

    // View-space slice tangent: reconstruct a same-depth neighbor along omega.
    // This gives us the slice plane span (V, slice_t) regardless of perspective.
    let near_uv = clamp(in.uv + omega / tex_size, vec2<f32>(0.0), vec2<f32>(1.0));
    let near_p  = view_pos(near_uv, depth);
    let slice_t = normalize(near_p - P);
    let axis    = normalize(cross(V, slice_t));

    // Project N onto the slice plane.
    let proj_N     = N - axis * dot(N, axis);
    let proj_N_len = length(proj_N);
    if (proj_N_len < 1e-4) { continue; }

    // Signed angle of the projected normal from V toward slice_t.
    let n_angle = atan2(dot(proj_N, slice_t), dot(proj_N, V));

    // Track horizon as max(cos(angle from V)); higher cos = closer to V = tighter horizon.
    var cos_h_pos: f32 = -1.0; // +omega side
    var cos_h_neg: f32 = -1.0; // -omega side

    for (var step_i: i32 = 1; step_i <= STEPS_PER_DIR; step_i++) {
      let off  = (f32(step_i) - 0.5 + rnd.y) * step_px;
      let uv_p = clamp(in.uv + omega * off / tex_size, vec2<f32>(0.0), vec2<f32>(1.0));
      let uv_n = clamp(in.uv - omega * off / tex_size, vec2<f32>(0.0), vec2<f32>(1.0));

      let pp = view_pos(uv_p, depth_load_uv(uv_p));
      let pn = view_pos(uv_n, depth_load_uv(uv_n));
      let dp = pp - P;
      let dn = pn - P;
      let lp = length(dp);
      let ln = length(dn);

      // Thickness heuristic: distant samples don't lower the horizon.
      if (lp < max_thick && lp > 1e-5) {
        cos_h_pos = max(cos_h_pos, dot(dp, V) / lp);
      }
      if (ln < max_thick && ln > 1e-5) {
        cos_h_neg = max(cos_h_neg, dot(dn, V) / ln);
      }
    }

    // Convert cosines to signed horizon angles measured from V.
    let h_pos = acos(clamp(cos_h_pos, -1.0, 1.0));   //  0..π
    let h_neg = -acos(clamp(cos_h_neg, -1.0, 1.0));  // -π..0

    // Clamp to the visible hemisphere of the projected normal.
    let h_pos_c = min(h_pos, n_angle + HALF_PI);
    let h_neg_c = max(h_neg, n_angle - HALF_PI);

    // Cosine-weighted slice integral: ∫_{h_neg_c}^{h_pos_c} cos(α - n_angle) dα / 2
    // = (sin(h_pos_c - n_angle) - sin(h_neg_c - n_angle)) / 2. Normalized so a
    // fully-unoccluded slice yields 1. Weight by projected-normal length.
    let v_slice = 0.5 * (sin(h_pos_c - n_angle) - sin(h_neg_c - n_angle));
    visibility += v_slice * proj_N_len;
  }

  visibility = visibility / f32(NUM_SLICES);
  let ao = clamp(pow(max(visibility, 0.0), u.strength), 0.0, 1.0);
  return vec4<f32>(ao, 0.0, 0.0, 1.0);
}
