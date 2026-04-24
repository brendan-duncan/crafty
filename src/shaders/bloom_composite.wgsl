// Bloom composite: adds the blurred bright regions back to the source HDR.

struct BloomUniforms {
  threshold: f32,
  knee     : f32,
  strength : f32,
  _pad     : f32,
}

@group(0) @binding(0) var<uniform> params   : BloomUniforms;
@group(0) @binding(1) var          hdr_tex  : texture_2d<f32>;
@group(0) @binding(2) var          bloom_tex: texture_2d<f32>;
@group(0) @binding(3) var          samp     : sampler;

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
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let hdr   = textureSample(hdr_tex,   samp, in.uv).rgb;
  // bloom_tex is half-res; bilinear upsample happens automatically
  let glow  = textureSample(bloom_tex, samp, in.uv).rgb;
  return vec4<f32>(hdr + glow * params.strength, 1.0);
}
