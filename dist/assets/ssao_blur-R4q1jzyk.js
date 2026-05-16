const e=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.

struct TAAUniforms {
  invViewProj : mat4x4<f32>, // current frame, un-jittered
  prevViewProj: mat4x4<f32>, // previous frame, un-jittered
}

@group(0) @binding(0) var<uniform> taa : TAAUniforms;

@group(1) @binding(0) var current_hdr   : texture_2d<f32>;
@group(1) @binding(1) var history_tex   : texture_2d<f32>;
@group(1) @binding(2) var depth_tex     : texture_depth_2d;
@group(1) @binding(3) var linear_sampler: sampler;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
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

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec4<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  return taa.invViewProj * ndc;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);

  let current = textureLoad(current_hdr, coord, 0).rgb;

  // Background: no history to blend
  let depth = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) {
    return vec4<f32>(current, 1.0);
  }

  // 3x3 neighborhood AABB for history clamping
  var c_min = current;
  var c_max = current;
  for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) { continue; }
      let s = textureLoad(current_hdr, coord + vec2<i32>(dx, dy), 0).rgb;
      c_min = min(c_min, s);
      c_max = max(c_max, s);
    }
  }

  // Reconstruct world position and reproject into previous frame
  let world_h   = reconstruct_world_pos(in.uv, depth);
  let world_pos = world_h.xyz / world_h.w;

  let prev_clip = taa.prevViewProj * vec4<f32>(world_pos, 1.0);
  let prev_ndc  = prev_clip.xyz / prev_clip.w;
  let prev_uv   = vec2<f32>(prev_ndc.x * 0.5 + 0.5, -prev_ndc.y * 0.5 + 0.5);

  // Outside previous frustum → accept current frame fully
  let in_bounds = prev_uv.x >= 0.0 && prev_uv.x <= 1.0
               && prev_uv.y >= 0.0 && prev_uv.y <= 1.0;
  if (!in_bounds) {
    return vec4<f32>(current, 1.0);
  }

  var history = textureSampleLevel(history_tex, linear_sampler, prev_uv, 0.0).rgb;
  // Clamp history to current neighborhood to suppress ghosting
  history = clamp(history, c_min, c_max);

  // 10% current frame, 90% history
  return vec4<f32>(mix(history, current, 0.1), 1.0);
}
`,n=`// SSAO: hemisphere sampling in view space.
// Reads GBuffer depth + normals, writes raw AO value [0,1].

const KERNEL_SIZE: i32 = 16;

struct SsaoUniforms {
  view    : mat4x4<f32>,  // offset   0
  proj    : mat4x4<f32>,  // offset  64
  inv_proj: mat4x4<f32>,  // offset 128
  radius  : f32,          // offset 192
  bias    : f32,          // offset 196
  strength: f32,          // offset 200
  _pad    : f32,          // offset 204
  kernel  : array<vec4<f32>, 16>, // offset 208 (256 bytes)
}                          // total: 464 bytes

@group(0) @binding(0) var<uniform> ssao: SsaoUniforms;

@group(1) @binding(0) var normal_tex: texture_2d<f32>;   // GBuffer normalMetallic (rgba16float)
@group(1) @binding(1) var depth_tex : texture_depth_2d;  // GBuffer depth (depth32float)
@group(1) @binding(2) var noise_tex : texture_2d<f32>;   // 4×4 random rotation vectors (rgba8unorm)

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
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

// Reconstruct view-space position from UV + NDC depth.
// WebGPU NDC: Y is up, depth [0,1]. UV: Y is down.
fn view_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let vh  = ssao.inv_proj * ndc;
  return vh.xyz / vh.w;
}

@fragment
fn fs_ssao(in: VertexOutput) -> @location(0) vec4<f32> {
  // This pass runs at half resolution. clip_pos is in half-res pixel space;
  // GBuffer textures are full-res so multiply by 2 to address them correctly.
  let half_coord = vec2<i32>(in.clip_pos.xy);
  let coord      = half_coord * 2;
  let depth = textureLoad(depth_tex, coord, 0);

  // Sky pixels → full AO (no occlusion)
  if (depth >= 1.0) { return vec4<f32>(1.0, 0.0, 0.0, 1.0); }

  let P = view_pos(in.uv, depth);

  // Decode world-space normal (stored as N*0.5+0.5), transform to view space
  let raw_n   = textureLoad(normal_tex, coord, 0).rgb;
  let world_N = normalize(raw_n * 2.0 - 1.0);
  let N       = normalize((ssao.view * vec4<f32>(world_N, 0.0)).xyz);

  // Tiled 4×4 noise using half-res coords so the pattern tiles the full screen.
  let noise_coord = vec2<u32>(half_coord) % vec2<u32>(4u);
  let rnd         = textureLoad(noise_tex, noise_coord, 0).rg * 2.0 - 1.0;

  // Gram-Schmidt: build orthonormal tangent frame from random vector + N
  let rand_vec = vec3<f32>(rnd, 0.0);
  let T = normalize(rand_vec - N * dot(rand_vec, N));
  let B = cross(N, T);
  // TBN columns [T, B, N] maps from tangent space to view space
  let tbn = mat3x3<f32>(T, B, N);

  let tex_size = vec2<f32>(textureDimensions(depth_tex));
  var occlusion = 0.0;

  for (var i = 0; i < KERNEL_SIZE; i++) {
    // View-space sample: kernel.z aligns with N (hemisphere above surface)
    let sample_vs = P + (tbn * ssao.kernel[i].xyz) * ssao.radius;

    // Project sample to screen UV
    let clip       = ssao.proj * vec4<f32>(sample_vs, 1.0);
    let ndc_xy     = clip.xy / clip.w;
    let sample_uv  = vec2<f32>(ndc_xy.x * 0.5 + 0.5, -ndc_xy.y * 0.5 + 0.5);

    // Sample depth at that UV and reconstruct view-space Z
    let sc        = clamp(vec2<i32>(sample_uv * tex_size), vec2<i32>(0), vec2<i32>(tex_size) - 1);
    let ref_depth = textureLoad(depth_tex, sc, 0);
    let ref_z     = view_pos(sample_uv, ref_depth).z;

    // Range check: weight falls to 0 when ref surface is beyond radius (different geometry).
    // Inverted smoothstep avoids the reciprocal spike that caused self-occlusion on flat faces.
    let range_check = 1.0 - smoothstep(0.0, ssao.radius, abs(P.z - ref_z));

    // Right-handed view space: closer to camera = higher (less negative) Z.
    // Occlude when actual geometry is closer to camera than the sample point (sample is inside geometry).
    // Using sample_vs.z rather than P.z makes the check slope-invariant: the sample already sits
    // above the surface, so same-surface pixels always satisfy ref_z < sample_vs.z regardless of tilt.
    occlusion += select(0.0, 1.0, ref_z > sample_vs.z + ssao.bias) * range_check;
  }

  let ao = clamp(1.0 - (occlusion / f32(KERNEL_SIZE)) * ssao.strength, 0.0, 1.0);
  return vec4<f32>(ao, 0.0, 0.0, 1.0);
}
`,t=`// SSAO blur: 4×4 box blur to smooth raw SSAO output.

@group(0) @binding(0) var ao_tex: texture_2d<f32>;
@group(0) @binding(1) var samp  : sampler;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
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

@fragment
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(ao_tex));
  var ao = 0.0;
  for (var y = -1; y <= 2; y++) {
    for (var x = -1; x <= 2; x++) {
      ao += textureSampleLevel(ao_tex, samp, in.uv + vec2<f32>(f32(x), f32(y)) * texel, 0.0).r;
    }
  }
  return vec4<f32>(ao / 16.0, 0.0, 0.0, 1.0);
}
`;export{t as a,n as s,e as t};
