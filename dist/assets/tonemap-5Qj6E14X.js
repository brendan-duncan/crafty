const n=`// tonemap.wgsl — Exposure + ACES + Gamma correction

// ── ACES filmic ───────────────────────────────────────────────────────────────

fn aces_filmic(x: vec3<f32>) -> vec3<f32> {
  let a = 2.51; let b = 0.03; let c = 2.43; let d = 0.59; let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3<f32>(0.0), vec3<f32>(1.0));
}

// ── Structs & Bindings ────────────────────────────────────────────────────────

struct TonemapParams {
  exposure: f32,
  flags: u32,      // bit 0: enable ACES, bit 1: skip gamma (for HDR canvas)
  _pad0: f32,
  _pad1: f32,
}

@group(0) @binding(0) var hdr_tex: texture_2d<f32>;
@group(0) @binding(1) var samp: sampler;
@group(1) @binding(0) var<uniform> params: TonemapParams;

// ── Vertex shader ─────────────────────────────────────────────────────────────

struct VertOut {
  @builtin(position) pos: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertOut {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertOut;
  out.pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ── Fragment shader ───────────────────────────────────────────────────────────

@fragment
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {
  // Sample HDR scene
  var scene = textureSample(hdr_tex, samp, in.uv).rgb;

  // Apply exposure
  scene *= params.exposure;

  // Apply ACES tone mapping if enabled
  let use_aces = (params.flags & 1u) != 0u;
  let ldr = select(scene, aces_filmic(scene), use_aces);

  // Apply gamma correction (skip if bit 1 is set for HDR canvas)
  let skip_gamma = (params.flags & 2u) != 0u;
  if (skip_gamma) {
    return vec4<f32>(max(ldr, vec3<f32>(0.0)), 1.0);
  }

  return vec4<f32>(pow(max(ldr, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.2)), 1.0);
}
`;export{n as t};
