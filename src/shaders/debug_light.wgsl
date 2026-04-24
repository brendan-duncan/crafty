// Unlit pass for debug geometry (e.g. a cone showing the directional light).

struct Uniforms {
  mvp  : mat4x4<f32>,
  color: vec4<f32>,
}

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertOut {
  @builtin(position) pos: vec4<f32>,
}

@vertex
fn vs_main(@location(0) position: vec3<f32>) -> VertOut {
  var out: VertOut;
  out.pos = u.mvp * vec4<f32>(position, 1.0);
  return out;
}

@fragment
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {
  return u.color;
}
