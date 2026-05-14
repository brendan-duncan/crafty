/* Model Shader Block */

struct ModelUniforms {
  model: mat4x4<f32>,
  normalMatrix: mat4x4<f32>,
}

@group(1) @binding(0) var<uniform> model: ModelUniforms;
