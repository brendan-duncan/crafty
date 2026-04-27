// Underwater post-process effect.
// Full-screen triangle: no vertex buffer needed.
// When is_underwater == 0, the scene is passed through unchanged.

struct Uniforms {
  time         : f32,
  is_underwater: f32,
  _p0          : f32,
  _p1          : f32,
}

@group(0) @binding(0) var scene_tex: texture_2d<f32>;
@group(0) @binding(1) var samp     : sampler;
@group(0) @binding(2) var<uniform> u: Uniforms;

struct VertOut {
  @builtin(position) pos: vec4<f32>,
  @location(0)       uv : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vi: u32) -> VertOut {
  let x = f32(vi & 1u) * 4.0 - 1.0;
  let y = f32(vi >> 1u) * 4.0 - 1.0;
  var out: VertOut;
  out.pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv  = vec2<f32>(x * 0.5 + 0.5, 1.0 - (y * 0.5 + 0.5));
  return out;
}

@fragment
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {
  if (u.is_underwater < 0.5) {
    return textureSample(scene_tex, samp, in.uv);
  }

  let t = u.time;

  // Animated screen-space distortion: two sine waves offset by time and UV position.
  let distort = vec2<f32>(
    sin(in.uv.y * 18.0 + t * 1.4) * 0.006,
    cos(in.uv.x * 14.0 + t * 1.1) * 0.004,
  );
  let sample_uv = clamp(in.uv + distort, vec2<f32>(0.001), vec2<f32>(0.999));

  let color = textureSample(scene_tex, samp, sample_uv).rgb;

  // Absorb red and green; scatter blue — simulates how water filters light.
  let tinted = color * vec3<f32>(0.20, 0.55, 0.90);

  // Radial vignette — edges darken to simulate limited underwater visibility.
  let d       = length(in.uv * 2.0 - 1.0);
  let vignette = clamp(1.0 - d * d * 0.55, 0.0, 1.0);

  return vec4<f32>(tinted * vignette, 1.0);
}
