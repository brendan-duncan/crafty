// Tonemapping pass — HDR rgba16float → swapchain format.
// Uses ACES filmic approximation (optional).
// Reads a linear exposure multiplier written each frame by AutoExposurePass.

struct TonemapParams {
  aces_enabled: u32,
  debug_ao    : u32,
  hdr_canvas  : u32,
}

struct ExposureBuffer {
  value : f32,
  _pad0 : f32,
  _pad1 : f32,
  _pad2 : f32,
}

@group(0) @binding(0) var                      hdrTex      : texture_2d<f32>;
@group(0) @binding(1) var                      hdrSampler  : sampler;
@group(0) @binding(2) var<uniform>             params      : TonemapParams;
@group(0) @binding(3) var                      aoTex       : texture_2d<f32>;
@group(0) @binding(4) var<storage, read>       exposure_buf: ExposureBuffer;

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
  out.uv = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

fn aces_filmic(x: vec3<f32>) -> vec3<f32> {
  let a = 2.51;
  let b = 0.03;
  let c = 2.43;
  let d = 0.59;
  let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3<f32>(0.0), vec3<f32>(1.0));
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  if (params.debug_ao != 0u) {
    let coord = vec2<i32>(in.clip_pos.xy);
    let ao = textureLoad(aoTex, coord, 0).r;
    return vec4<f32>(ao, ao, ao, 1.0);
  }
  let scene = textureSample(hdrTex, hdrSampler, in.uv).rgb * exposure_buf.value;
  // HDR mode: skip ACES so values >1 are preserved; gamma-encode for the display.
  // On HDR displays those values appear brighter than SDR white; on SDR they clip to white.
  if (params.hdr_canvas != 0u) {
    return vec4<f32>(pow(max(scene, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.2)), 1.0);
  }
  let ldr = select(scene, aces_filmic(scene), params.aces_enabled != 0u);
  return vec4<f32>(pow(ldr, vec3<f32>(1.0 / 2.2)), 1.0);
}
