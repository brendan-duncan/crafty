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
`,n=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.

struct DofUniforms {
  focus_distance: f32,  // linear depth of sharp plane (world units)
  focus_range   : f32,  // half-range: blur ramps 0→max over this distance on each side
  bokeh_radius  : f32,  // max blur radius in half-res texels
  near          : f32,
  far           : f32,
  _pad1         : f32,
  _pad2         : f32,
  _pad3         : f32,
}

@group(0) @binding(0) var<uniform> dof     : DofUniforms;
@group(0) @binding(1) var          hdr_tex : texture_2d<f32>;
@group(0) @binding(2) var          dep_tex : texture_depth_2d;
@group(0) @binding(3) var          samp    : sampler;
// group 1 is only used by fs_composite; prefilter pipeline has no group 1
@group(1) @binding(0) var          half_tex: texture_2d<f32>;

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

fn linear_depth(ndc_depth: f32) -> f32 {
  return dof.near * dof.far / (dof.far - ndc_depth * (dof.far - dof.near));
}

fn compute_coc(lin_depth: f32) -> f32 {
  return clamp(
    (lin_depth - dof.focus_distance) / max(dof.focus_range, 0.001),
    0.0, 1.0
  ) * dof.bokeh_radius;
}

// Prefilter: 4-tap 2x downsample; RGB = color, A = signed CoC (texels, half-res).
// Negative CoC = in front of focus plane.
@fragment
fn fs_prefilter(in: VertexOutput) -> @location(0) vec4<f32> {
  let full_size = vec2<f32>(textureDimensions(hdr_tex));
  let texel = 1.0 / full_size;
  let o = array<vec2<f32>, 4>(
    vec2<f32>(-0.5, -0.5), vec2<f32>( 0.5, -0.5),
    vec2<f32>(-0.5,  0.5), vec2<f32>( 0.5,  0.5)
  );

  var col = vec3<f32>(0.0);
  var c   = 0.0;
  for (var i = 0; i < 4; i++) {
    let uv = in.uv + o[i] * texel;
    col   += textureSampleLevel(hdr_tex, samp, uv, 0.0).rgb;
    let px = clamp(vec2<u32>(uv * full_size), vec2<u32>(0u), vec2<u32>(full_size) - 1u);
    c     += compute_coc(linear_depth(textureLoad(dep_tex, px, 0)));
  }
  return vec4<f32>(col * 0.25, c * 0.25);
}

// Composite: 48-tap Fibonacci spiral disc blur on the prefiltered half-res texture.
// Radii are sqrt-distributed (uniform area coverage) so there are no discrete rings.
// Per-pixel rotation breaks any residual spiral pattern into noise.
const GOLDEN_ANGLE: f32 = 2.399963229728; // 2π(2 - φ), φ = golden ratio
const NUM_TAPS: i32 = 48;

@fragment
fn fs_composite(in: VertexOutput) -> @location(0) vec4<f32> {
  let sharp  = textureSampleLevel(hdr_tex,  samp, in.uv, 0.0).rgb;
  let center = textureSampleLevel(half_tex, samp, in.uv, 0.0);
  let coc_px = abs(center.a);

  let texel = 1.0 / vec2<f32>(textureDimensions(half_tex));

  // Per-pixel rotation offset — breaks the spiral into spatially-varying noise.
  let coord = vec2<u32>(in.clip_pos.xy);
  let rot   = f32((coord.x * 1619u + coord.y * 7919u) & 63u) * (6.28318 / 64.0);

  var accum  = center.rgb;
  var weight = 1.0;
  for (var i = 0; i < NUM_TAPS; i++) {
    // sqrt distribution → uniform area density, no discrete ring jumps
    let r     = sqrt(f32(i) + 0.5) / sqrt(f32(NUM_TAPS)) * coc_px;
    let theta = f32(i) * GOLDEN_ANGLE + rot;
    let uv2   = in.uv + vec2<f32>(cos(theta), sin(theta)) * r * texel;
    let s     = textureSampleLevel(half_tex, samp, uv2, 0.0);
    let w     = clamp(abs(s.a) / max(dof.bokeh_radius, 0.001), 0.0, 1.0);
    accum  += s.rgb * w;
    weight += w;
  }
  let blurred = accum / weight;

  let blend = smoothstep(0.0, 1.0, coc_px / max(dof.bokeh_radius, 0.001));
  return vec4<f32>(mix(sharp, blurred, blend), 1.0);
}
`;export{n as d,e as t};
