// Sky pass — fullscreen triangle rendering an equirectangular HDR skybox.
// Texture is pre-decoded to rgba16float so bilinear filtering works in linear HDR space.

const PI: f32 = 3.14159265358979323846;

struct SkyUniforms {
  invViewProj: mat4x4<f32>,
  cameraPos  : vec3<f32>,
  exposure   : f32,
}

@group(0) @binding(0) var<uniform> sky        : SkyUniforms;
@group(1) @binding(0) var          sky_tex    : texture_2d<f32>;
@group(1) @binding(1) var          sky_sampler: sampler;

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

// Maps a unit direction to equirectangular (latlong) UV coordinates.
// u wraps around Y axis; v is polar angle from top (0) to bottom (1).
fn equirect_uv(dir: vec3<f32>) -> vec2<f32> {
  let u = atan2(-dir.z, dir.x) / (2.0 * PI) + 0.5;
  let v = acos(clamp(dir.y, -1.0, 1.0)) / PI;
  return vec2<f32>(u, v);
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Reconstruct world-space point on the far plane, then derive view direction.
  let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
  let world_h = sky.invViewProj * ndc;
  let dir     = normalize(world_h.xyz / world_h.w - sky.cameraPos);

  let uv  = equirect_uv(dir);
  let rgb = textureSample(sky_tex, sky_sampler, uv).rgb;
  return vec4<f32>(rgb * sky.exposure, 1.0);
}
