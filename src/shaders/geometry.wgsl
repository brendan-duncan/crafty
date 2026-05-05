// GBuffer fill pass — writes albedo+roughness and normal+metallic.
// Group 3 texture maps are optional; the geometry pass binds 1×1 fallbacks when unset.

struct CameraUniforms {
  view      : mat4x4<f32>,
  proj      : mat4x4<f32>,
  viewProj  : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position  : vec3<f32>,
  near      : f32,
  far       : f32,
}

struct ModelUniforms {
  model       : mat4x4<f32>,
  normalMatrix: mat4x4<f32>,
}

struct MaterialUniforms {
  albedo   : vec4<f32>,    // offset  0
  roughness: f32,          // offset 16
  metallic : f32,          // offset 20
  uvOffset : vec2<f32>,    // offset 24  atlas tile offset (0,0 = identity)
  uvScale  : vec2<f32>,    // offset 32  atlas tile scale  (1,1 = identity)
  uvTile   : vec2<f32>,    // offset 40  repetitions across the mesh surface (1,1 = no tiling)
}

@group(0) @binding(0) var<uniform> camera  : CameraUniforms;
@group(1) @binding(0) var<uniform> model   : ModelUniforms;
@group(2) @binding(0) var<uniform> material: MaterialUniforms;

// Texture maps: albedoMap (srgb), normalMap (tangent-space linear), merMap (R=metallic, G=emissive, B=roughness)
@group(3) @binding(0) var albedo_map: texture_2d<f32>;
@group(3) @binding(1) var normal_map: texture_2d<f32>;
@group(3) @binding(2) var mer_map   : texture_2d<f32>;
@group(3) @binding(3) var mat_samp  : sampler;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal  : vec3<f32>,
  @location(2) uv      : vec2<f32>,
  @location(3) tangent : vec4<f32>,  // xyz=tangent, w=bitangent sign
}

struct VertexOutput {
  @builtin(position) clip_pos  : vec4<f32>,
  @location(0)       world_pos : vec3<f32>,
  @location(1)       world_norm: vec3<f32>,
  @location(2)       uv        : vec2<f32>,
  @location(3)       world_tan : vec4<f32>,  // xyz=tangent, w=bitangent sign
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let world_pos  = model.model * vec4<f32>(vin.position, 1.0);
  let world_norm = normalize((model.normalMatrix * vec4<f32>(vin.normal,       0.0)).xyz);
  let world_tan  = normalize((model.normalMatrix * vec4<f32>(vin.tangent.xyz,  0.0)).xyz);

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
  @location(1) normal_emission : vec4<f32>,
}

@fragment
fn fs_main(in: VertexOutput) -> FragmentOutput {
  // Tile within the mesh surface, then map into the atlas tile region
  let atlas_uv = fract(in.uv * material.uvTile) * material.uvScale + material.uvOffset;

  // Albedo: texture rgb × material colour
  let tex_albedo = textureSample(albedo_map, mat_samp, atlas_uv);
  let albedo     = tex_albedo.rgb * material.albedo.rgb;

  // MER: r=metallic multiplier, g=emissive, b=roughness multiplier
  let mer      = textureSample(mer_map, mat_samp, atlas_uv);
  let roughness = material.roughness * mer.b;
  let metallic  = material.metallic  * mer.r;
  let emission  = mer.g;

  // Build TBN in world space for normal mapping
  let N = normalize(in.world_norm);
  let T = normalize(in.world_tan.xyz);
  // Re-orthogonalise to handle interpolation artefacts
  let T_ortho = normalize(T - N * dot(T, N));
  let B       = cross(N, T_ortho) * in.world_tan.w;  // w encodes bitangent handedness
  let tbn     = mat3x3<f32>(T_ortho, B, N);

  // Decode tangent-space normal map and transform to world space
  let n_ts    = textureSample(normal_map, mat_samp, atlas_uv).rgb * 2.0 - 1.0;
  let mapped_N = normalize(tbn * n_ts);

  var out: FragmentOutput;
  out.albedo_roughness = vec4<f32>(albedo, roughness);
  // Store world normal in [0,1] range (decoded in lighting pass with n*2-1) and emission
  out.normal_emission  = vec4<f32>(mapped_N * 0.5 + 0.5, emission);
  return out;
}
