// Cube shadow map rendering shader for point lights
// Renders to all 6 faces of a cubemap in a single pass

struct CameraUniforms {
  viewProj: array<mat4x4<f32>, 6>,  // 6 view-projection matrices (one per cube face)
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
  var out: VertexOutput;
  // Use first face view-projection for vertex processing
  out.clip_pos = camera.viewProj[0] * world_pos;
  out.world_pos = world_pos.xyz;
  return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @builtin(frag_depth) f32 {
  // Calculate distance from light to fragment
  let dist = length(in.world_pos - camera.lightPos);
  // Normalize to [0, 1] range
  return dist / camera.farPlane;
}
