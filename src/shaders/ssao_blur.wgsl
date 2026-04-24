// SSAO blur: 4×4 box blur to smooth raw SSAO output.

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
