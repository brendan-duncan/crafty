// Cube shadow map rendering shader for point lights.
// One face is rendered per render-pass; the bound CameraUniforms buffer
// contains that face's view-projection matrix.

struct CameraUniforms {
  viewProj: mat4x4<f32>,
  lightPos: vec3<f32>,
  farPlane: f32,
}

struct ModelUniforms {
  model: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(1) @binding(0) var<uniform> model: ModelUniforms;

struct VertexInput {
  @location(0) position: vec3<f32>,
}

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0) world_pos: vec3<f32>,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let world_pos = model.model * vec4<f32>(vin.position, 1.0);
  var clip = camera.viewProj * world_pos;
  // Cube map sampling uses a left-handed convention (D3D-style: top of face = +V on minor axis).
  // Mat4.lookAt is right-handed, so the rendered NDC.y is inverted relative to the cube face's
  // V axis. Flip Y here so the stored depth aligns with how the forward pass samples the cube.
  clip.y = -clip.y;
  var out: VertexOutput;
  out.clip_pos = clip;
  out.world_pos = world_pos.xyz;
  return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @builtin(frag_depth) f32 {
  let dist = length(in.world_pos - camera.lightPos);
  return dist / camera.farPlane;
}
