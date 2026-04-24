// Shared uniform structs — included by other shaders via vite-plugin-glsl #include

struct CameraUniforms {
  view      : mat4x4<f32>,
  proj      : mat4x4<f32>,
  viewProj  : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position  : vec3<f32>,
  near      : f32,
  far       : f32,
  _pad      : vec3<f32>,
}

struct ModelUniforms {
  model       : mat4x4<f32>,
  normalMatrix: mat4x4<f32>,
}

// Up to 4 cascades
struct LightUniforms {
  direction      : vec3<f32>,
  intensity      : f32,
  color          : vec3<f32>,
  cascadeCount   : u32,
  cascadeMatrices: array<mat4x4<f32>, 4>,
  cascadeSplits  : vec4<f32>,  // view-space far distances per cascade
}

struct MaterialUniforms {
  albedo    : vec4<f32>,
  roughness : f32,
  metallic  : f32,
  _pad      : vec2<f32>,
}
