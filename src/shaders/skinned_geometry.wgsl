// Skinned GBuffer fill pass — GPU vertex skinning with up to 4 bone influences.
// Identical to geometry.wgsl except for the extra joint/weight inputs and the
// joint_matrices storage buffer at group 4.

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

struct ModelUniforms {
  model       : mat4x4<f32>,
  normalMatrix: mat4x4<f32>,
}

struct MaterialUniforms {
  albedo   : vec4<f32>,
  roughness: f32,
  metallic : f32,
  uvOffset : vec2<f32>,
  uvScale  : vec2<f32>,
  uvTile   : vec2<f32>,
}

@group(0) @binding(0) var<uniform>       camera        : CameraUniforms;
@group(1) @binding(0) var<uniform>       model         : ModelUniforms;
@group(1) @binding(1) var<storage, read> joint_matrices: array<mat4x4<f32>>;
@group(2) @binding(0) var<uniform>       material      : MaterialUniforms;
#ifdef HAS_ALBEDO_MAP
@group(2) @binding(1) var                albedo_map    : texture_2d<f32>;
#endif
#ifdef HAS_NORMAL_MAP
@group(2) @binding(2) var                normal_map    : texture_2d<f32>;
#endif
#ifdef HAS_MER_MAP
@group(2) @binding(3) var                mer_map       : texture_2d<f32>;
#endif
@group(2) @binding(4) var                mat_samp      : sampler;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal  : vec3<f32>,
  @location(2) uv      : vec2<f32>,
  @location(3) tangent : vec4<f32>,
  @location(4) joints  : vec4<u32>,
  @location(5) weights : vec4<f32>,
}

struct VertexOutput {
  @builtin(position) clip_pos  : vec4<f32>,
  @location(0)       world_pos : vec3<f32>,
  @location(1)       world_norm: vec3<f32>,
  @location(2)       uv        : vec2<f32>,
  @location(3)       world_tan : vec4<f32>,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  // Blend joint matrices by weights
  let skin_mat =
      vin.weights.x * joint_matrices[vin.joints.x] +
      vin.weights.y * joint_matrices[vin.joints.y] +
      vin.weights.z * joint_matrices[vin.joints.z] +
      vin.weights.w * joint_matrices[vin.joints.w];

  let skinned_pos  = skin_mat * vec4<f32>(vin.position,    1.0);
  let skinned_norm = skin_mat * vec4<f32>(vin.normal,      0.0);
  let skinned_tan  = skin_mat * vec4<f32>(vin.tangent.xyz, 0.0);

  let world_pos  = model.model * skinned_pos;
  let world_norm = normalize((model.normalMatrix * skinned_norm).xyz);
  let world_tan  = normalize((model.normalMatrix * skinned_tan).xyz);

  var out: VertexOutput;
  out.clip_pos   = camera.viewProj * world_pos;
  out.world_pos  = world_pos.xyz;
  out.world_norm = world_norm;
  out.uv         = vin.uv;
  out.world_tan  = vec4<f32>(world_tan, vin.tangent.w);
  return out;
}

struct FragmentOutput {
  @location(0) albedo_roughness: vec4<f32>,
  @location(1) normal_metallic : vec4<f32>,
}

@fragment
fn fs_main(in: VertexOutput) -> FragmentOutput {
  let atlas_uv = fract(in.uv * material.uvTile) * material.uvScale + material.uvOffset;

#ifdef HAS_ALBEDO_MAP
  let tex_albedo = textureSample(albedo_map, mat_samp, atlas_uv);
  let albedo     = tex_albedo.rgb * material.albedo.rgb;
#else
  let albedo     = material.albedo.rgb;
#endif

#ifdef HAS_MER_MAP
  let mer      = textureSample(mer_map, mat_samp, atlas_uv);
  let roughness = material.roughness * mer.b;
  let metallic  = material.metallic  * mer.r;
#else
  let roughness = max(material.roughness, 0.04);
  let metallic  = material.metallic;
#endif

  let N       = normalize(in.world_norm);
#ifdef HAS_NORMAL_MAP
  let T       = normalize(in.world_tan.xyz);
  let T_ortho = normalize(T - N * dot(T, N));
  let B       = cross(N, T_ortho) * in.world_tan.w;
  let tbn     = mat3x3<f32>(T_ortho, B, N);

  let n_ts    = textureSample(normal_map, mat_samp, atlas_uv).rgb * 2.0 - 1.0;
  let mapped_N = normalize(tbn * n_ts);
#else
  let mapped_N = N;
#endif

  var out: FragmentOutput;
  out.albedo_roughness = vec4<f32>(albedo, roughness);
  out.normal_metallic  = vec4<f32>(mapped_N * 0.5 + 0.5, metallic);
  return out;
}
