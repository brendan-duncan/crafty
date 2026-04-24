// Shadow map generation — depth-only, one cascade at a time.

struct ShadowUniforms {
  lightViewProj: mat4x4<f32>,
}

struct ModelUniforms {
  model: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> shadow: ShadowUniforms;
@group(1) @binding(0) var<uniform> model: ModelUniforms;

struct VertexInput {
  @location(0) position: vec3<f32>,
}

@vertex
fn vs_main(vin: VertexInput) -> @builtin(position) vec4<f32> {
  return shadow.lightViewProj * model.model * vec4<f32>(vin.position, 1.0);
}
