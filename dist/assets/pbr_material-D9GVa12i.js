var g=Object.defineProperty;var h=(m,a,n)=>a in m?g(m,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):m[a]=n;var t=(m,a,n)=>h(m,typeof a!="symbol"?a+"":a,n);import{a as v,M as c}from"./material-DqlrPFF9.js";const b=`// Forward PBR shader with multi-light support
// Supports: directional, point, spot lights with shadows
// Materials: PBR with IBL, normal mapping, MER textures

const PI: f32 = 3.14159265358979323846;

// Maximum lights supported
const MAX_POINT_LIGHTS: u32 = 8u;
const MAX_SPOT_LIGHTS: u32 = 4u;

struct CameraUniforms {
  view        : mat4x4<f32>,
  proj        : mat4x4<f32>,
  viewProj    : mat4x4<f32>,
  invViewProj : mat4x4<f32>,
  position    : vec3<f32>,
  near        : f32,
  far         : f32,
}

struct ModelUniforms {
  model        : mat4x4<f32>,
  normalMatrix : mat4x4<f32>,
}

struct MaterialUniforms {
  albedo    : vec4<f32>,
  roughness : f32,
  metallic  : f32,
  uvOffset  : vec2<f32>,
  uvScale   : vec2<f32>,
  uvTile    : vec2<f32>,
}

struct PointLight {
  position    : vec3<f32>,
  range       : f32,
  color       : vec3<f32>,
  intensity   : f32,
  castShadows : u32,
  _pad        : vec3<u32>,
}

struct SpotLight {
  position        : vec3<f32>,
  range           : f32,
  direction       : vec3<f32>,
  innerAngle      : f32,
  color           : vec3<f32>,
  outerAngle      : f32,
  intensity       : f32,
  castShadows     : u32,
  shadowMapIndex  : u32,
  _pad            : u32,
  lightViewProj   : mat4x4<f32>,
}

struct DirectionalLight {
  direction       : vec3<f32>,
  intensity       : f32,
  color           : vec3<f32>,
  castShadows     : u32,
  shadowMapIndex  : u32,
  _pad            : vec3<u32>,
  lightViewProj   : mat4x4<f32>,
}

struct LightingUniforms {
  numPointLights : u32,
  numSpotLights  : u32,
  _pad           : vec2<u32>,
}

// Group 0: Camera
@group(0) @binding(0) var<uniform> camera : CameraUniforms;

// Group 1: Model
@group(1) @binding(0) var<uniform> model    : ModelUniforms;

// Group 2: Material (uniforms + texture maps + sampler)
@group(2) @binding(0) var<uniform> material : MaterialUniforms;
@group(2) @binding(1) var albedo_map  : texture_2d<f32>;
@group(2) @binding(2) var normal_map  : texture_2d<f32>;
@group(2) @binding(3) var mer_map     : texture_2d<f32>;
@group(2) @binding(4) var mat_sampler : sampler;

// Group 3: Lighting + Shadow + IBL
@group(3) @binding(0) var<uniform> lighting            : LightingUniforms;
@group(3) @binding(1) var<uniform> directionalLight    : DirectionalLight;
@group(3) @binding(2) var<storage, read> pointLights   : array<PointLight>;
@group(3) @binding(3) var<storage, read> spotLights    : array<SpotLight>;
@group(3) @binding(4) var shadowMapArray     : texture_depth_2d_array;
@group(3) @binding(5) var shadowSampler      : sampler_comparison;
@group(3) @binding(6) var irradiance_cube    : texture_cube<f32>;
@group(3) @binding(7) var prefilter_cube     : texture_cube<f32>;
@group(3) @binding(8) var brdf_lut           : texture_2d<f32>;
@group(3) @binding(9) var ibl_sampler        : sampler;
@group(3) @binding(10) var pointShadowCubeArray : texture_depth_cube_array;

const IBL_MIP_LEVELS: f32 = 5.0;

// Vertex input/output
struct VertexInput {
  @location(0) position : vec3<f32>,
  @location(1) normal   : vec3<f32>,
  @location(2) uv       : vec2<f32>,
  @location(3) tangent  : vec4<f32>,
}

struct VertexOutput {
  @builtin(position) clip_pos   : vec4<f32>,
  @location(0)       world_pos  : vec3<f32>,
  @location(1)       world_norm : vec3<f32>,
  @location(2)       uv         : vec2<f32>,
  @location(3)       world_tan  : vec4<f32>,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let world_pos  = model.model * vec4<f32>(vin.position, 1.0);
  let world_norm = normalize((model.normalMatrix * vec4<f32>(vin.normal,      0.0)).xyz);
  let world_tan  = normalize((model.normalMatrix * vec4<f32>(vin.tangent.xyz, 0.0)).xyz);

  var out: VertexOutput;
  out.clip_pos   = camera.viewProj * world_pos;
  out.world_pos  = world_pos.xyz;
  out.world_norm = world_norm;
  out.uv         = vin.uv;
  out.world_tan  = vec4<f32>(world_tan, vin.tangent.w);
  return out;
}

// PBR functions
fn fresnel_schlick(cos_theta: f32, F0: vec3<f32>) -> vec3<f32> {
  return F0 + (vec3<f32>(1.0) - F0) * pow(max(1.0 - cos_theta, 0.0), 5.0);
}

fn fresnel_schlick_roughness(cos_theta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {
  let one_minus_roughness = vec3<f32>(1.0 - roughness);
  return F0 + (max(one_minus_roughness, F0) - F0) * pow(max(1.0 - cos_theta, 0.0), 5.0);
}

fn distribution_ggx(N: vec3<f32>, H: vec3<f32>, roughness: f32) -> f32 {
  let a = roughness * roughness;
  let a2 = a * a;
  let NdotH = max(dot(N, H), 0.0);
  let NdotH2 = NdotH * NdotH;
  let denom = NdotH2 * (a2 - 1.0) + 1.0;
  return a2 / (PI * denom * denom);
}

fn geometry_schlick_ggx(NdotV: f32, roughness: f32) -> f32 {
  let r = roughness + 1.0;
  let k = (r * r) / 8.0;
  return NdotV / (NdotV * (1.0 - k) + k);
}

fn geometry_smith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> f32 {
  let NdotV = max(dot(N, V), 0.0);
  let NdotL = max(dot(N, L), 0.0);
  let ggx1 = geometry_schlick_ggx(NdotV, roughness);
  let ggx2 = geometry_schlick_ggx(NdotL, roughness);
  return ggx1 * ggx2;
}

// Shadow sampling for directional light
fn sample_shadow(world_pos: vec3<f32>) -> f32 {
  if (directionalLight.castShadows == 0u) {
    return 1.0;
  }

  let light_space = directionalLight.lightViewProj * vec4<f32>(world_pos, 1.0);
  var shadow_coord = light_space.xyz / light_space.w;
  shadow_coord = vec3<f32>(shadow_coord.xy * 0.5 + 0.5, shadow_coord.z);
  shadow_coord.y = 1.0 - shadow_coord.y;

  if (shadow_coord.x < 0.0 || shadow_coord.x > 1.0 ||
      shadow_coord.y < 0.0 || shadow_coord.y > 1.0 ||
      shadow_coord.z < 0.0 || shadow_coord.z > 1.0) {
    return 1.0;
  }

  // Use slope-based bias to prevent shadow acne
  let bias = 0.002;
  let arrayIndex = i32(directionalLight.shadowMapIndex);
  return textureSampleCompareLevel(shadowMapArray, shadowSampler, shadow_coord.xy, arrayIndex, shadow_coord.z - bias);
}

// Shadow sampling for spot light
fn sample_spot_shadow(world_pos: vec3<f32>, light: SpotLight) -> f32 {
  if (light.castShadows == 0u) {
    return 1.0;
  }

  let light_space = light.lightViewProj * vec4<f32>(world_pos, 1.0);
  var shadow_coord = light_space.xyz / light_space.w;
  shadow_coord = vec3<f32>(shadow_coord.xy * 0.5 + 0.5, shadow_coord.z);
  shadow_coord.y = 1.0 - shadow_coord.y;

  if (shadow_coord.x < 0.0 || shadow_coord.x > 1.0 ||
      shadow_coord.y < 0.0 || shadow_coord.y > 1.0 ||
      shadow_coord.z < 0.0 || shadow_coord.z > 1.0) {
    return 1.0;
  }

  let bias = 0.002;
  let arrayIndex = i32(light.shadowMapIndex);
  return textureSampleCompareLevel(shadowMapArray, shadowSampler, shadow_coord.xy, arrayIndex, shadow_coord.z - bias);
}

// Shadow sampling for point light (cube array, linear normalized depth)
fn sample_point_shadow(world_pos: vec3<f32>, light: PointLight, slot: i32) -> f32 {
  if (light.castShadows == 0u) {
    return 1.0;
  }

  let to_frag = world_pos - light.position;
  let dist = length(to_frag);
  if (dist >= light.range) {
    return 1.0;
  }

  let dir = to_frag / dist;
  let compare = dist / light.range;
  let bias = 0.005;
  return textureSampleCompareLevel(pointShadowCubeArray, shadowSampler, dir, slot, compare - bias);
}

// Lighting calculations
fn calculate_pbr_lighting(
  albedo: vec3<f32>,
  N: vec3<f32>,
  V: vec3<f32>,
  world_pos: vec3<f32>,
  roughness: f32,
  metallic: f32,
) -> vec3<f32> {
  let F0 = mix(vec3<f32>(0.04), albedo, metallic);
  let NdotV = max(dot(N, V), 0.001);

  var Lo = vec3<f32>(0.0);

  // Directional light
  {
    let L = normalize(-directionalLight.direction);
    let H = normalize(V + L);
    let NdotL = max(dot(N, L), 0.0);

    if (NdotL > 0.0) {
      let radiance = directionalLight.color * directionalLight.intensity;

      let D = distribution_ggx(N, H, roughness);
      let G = geometry_smith(N, V, L, roughness);
      let F = fresnel_schlick(max(dot(H, V), 0.0), F0);

      let numerator = D * G * F;
      let denominator = 4.0 * NdotV * NdotL;
      let specular = numerator / max(denominator, 0.001);

      let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);
      let diffuse = kD * albedo / PI;

      let shadow = sample_shadow(world_pos);
      Lo += (diffuse + specular) * radiance * NdotL * shadow;
    }
  }

  // Point lights
  for (var i = 0u; i < lighting.numPointLights && i < MAX_POINT_LIGHTS; i++) {
    let light = pointLights[i];
    let L = light.position - world_pos;
    let distance = length(L);
    let L_norm = L / distance;

    if (distance < light.range) {
      let H = normalize(V + L_norm);
      let NdotL = max(dot(N, L_norm), 0.0);

      if (NdotL > 0.0) {
        let attenuation = max(1.0 - (distance / light.range), 0.0);
        let attenuation2 = attenuation * attenuation;
        let radiance = light.color * light.intensity * attenuation2;

        let D = distribution_ggx(N, H, roughness);
        let G = geometry_smith(N, V, L_norm, roughness);
        let F = fresnel_schlick(max(dot(H, V), 0.0), F0);

        let numerator = D * G * F;
        let denominator = 4.0 * NdotV * NdotL;
        let specular = numerator / max(denominator, 0.001);

        let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);
        let diffuse = kD * albedo / PI;

        let shadow = sample_point_shadow(world_pos, light, i32(i));
        Lo += (diffuse + specular) * radiance * NdotL * shadow;
      }
    }
  }

  // Spot lights
  for (var i = 0u; i < lighting.numSpotLights && i < MAX_SPOT_LIGHTS; i++) {
    let light = spotLights[i];
    let L = light.position - world_pos;
    let distance = length(L);
    let L_norm = L / distance;

    if (distance < light.range) {
      let spot_dir = normalize(-light.direction);
      let theta = dot(L_norm, spot_dir);
      let inner = cos(light.innerAngle * 0.0174533);
      let outer = cos(light.outerAngle * 0.0174533);
      let epsilon = inner - outer;
      let intensity_factor = clamp((theta - outer) / epsilon, 0.0, 1.0);

      if (intensity_factor > 0.0) {
        let H = normalize(V + L_norm);
        let NdotL = max(dot(N, L_norm), 0.0);

        if (NdotL > 0.0) {
          let attenuation = max(1.0 - (distance / light.range), 0.0);
          let attenuation2 = attenuation * attenuation;
          let radiance = light.color * light.intensity * attenuation2 * intensity_factor;

          let D = distribution_ggx(N, H, roughness);
          let G = geometry_smith(N, V, L_norm, roughness);
          let F = fresnel_schlick(max(dot(H, V), 0.0), F0);

          let numerator = D * G * F;
          let denominator = 4.0 * NdotV * NdotL;
          let specular = numerator / max(denominator, 0.001);

          let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);
          let diffuse = kD * albedo / PI;

          let shadow = sample_spot_shadow(world_pos, light);
          Lo += (diffuse + specular) * radiance * NdotL * shadow;
        }
      }
    }
  }

  // IBL ambient
  let kS_ibl = fresnel_schlick_roughness(NdotV, F0, roughness);
  let kD_ibl = (vec3<f32>(1.0) - kS_ibl) * (1.0 - metallic);

  let irradiance = textureSampleLevel(irradiance_cube, ibl_sampler, N, 0.0).rgb;
  let diffuse_ibl = irradiance * albedo * kD_ibl;

  let R = reflect(-V, N);
  let prefiltered = textureSampleLevel(prefilter_cube, ibl_sampler, R, roughness * (IBL_MIP_LEVELS - 1.0)).rgb;
  let brdf = textureSampleLevel(brdf_lut, ibl_sampler, vec2<f32>(NdotV, roughness), 0.0).rg;
  let specular_ibl = prefiltered * (kS_ibl * brdf.x + brdf.y);

  let ambient = (diffuse_ibl + specular_ibl) * 0.5;

  return Lo + ambient;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let atlas_uv = fract(in.uv * material.uvTile) * material.uvScale + material.uvOffset;

  let tex_albedo = textureSample(albedo_map, mat_sampler, atlas_uv);
  let albedo = tex_albedo.rgb * material.albedo.rgb;
  let alpha = tex_albedo.a * material.albedo.a;

  let mer = textureSample(mer_map, mat_sampler, atlas_uv);
  let roughness = max(material.roughness * mer.b, 0.04);
  let metallic = material.metallic * mer.r;
  let emission = mer.g;

  // Build TBN matrix for normal mapping
  let N_geom = normalize(in.world_norm);
  let T = normalize(in.world_tan.xyz);
  let T_ortho = normalize(T - N_geom * dot(T, N_geom));
  let B = cross(N_geom, T_ortho) * in.world_tan.w;
  let tbn = mat3x3<f32>(T_ortho, B, N_geom);

  let n_ts = textureSample(normal_map, mat_sampler, atlas_uv).rgb * 2.0 - 1.0;
  let N = normalize(tbn * n_ts);

  let V = normalize(camera.position - in.world_pos);

  let lit_color = calculate_pbr_lighting(albedo, N, V, in.world_pos, roughness, metallic);
  let emissive = albedo * emission * 2.0;
  let final_color = lit_color + emissive;

  return vec4<f32>(final_color, alpha);
}
`,w=`// GBuffer fill pass — writes albedo+roughness and normal+metallic.
// Group 2 texture maps are optional; the material binds 1×1 fallbacks when unset.

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
// Group 2: Material (uniforms + texture maps + sampler).
// Texture maps: albedoMap (srgb), normalMap (tangent-space linear), merMap (R=metallic, G=emissive, B=roughness).
@group(2) @binding(0) var<uniform> material: MaterialUniforms;
@group(2) @binding(1) var albedo_map: texture_2d<f32>;
@group(2) @binding(2) var normal_map: texture_2d<f32>;
@group(2) @binding(3) var mer_map   : texture_2d<f32>;
@group(2) @binding(4) var mat_samp  : sampler;

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

  // Albedo: texture rgb × material color
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
`,x=`// Skinned GBuffer fill pass — GPU vertex skinning with up to 4 bone influences.
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
@group(2) @binding(1) var                albedo_map    : texture_2d<f32>;
@group(2) @binding(2) var                normal_map    : texture_2d<f32>;
@group(2) @binding(3) var                mer_map       : texture_2d<f32>;
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

  let tex_albedo = textureSample(albedo_map, mat_samp, atlas_uv);
  let albedo     = tex_albedo.rgb * material.albedo.rgb;

  let mer      = textureSample(mer_map, mat_samp, atlas_uv);
  let roughness = material.roughness * mer.b;
  let metallic  = material.metallic  * mer.r;

  let N       = normalize(in.world_norm);
  let T       = normalize(in.world_tan.xyz);
  let T_ortho = normalize(T - N * dot(T, N));
  let B       = cross(N, T_ortho) * in.world_tan.w;
  let tbn     = mat3x3<f32>(T_ortho, B, N);

  let n_ts    = textureSample(normal_map, mat_samp, atlas_uv).rgb * 2.0 - 1.0;
  let mapped_N = normalize(tbn * n_ts);

  var out: FragmentOutput;
  out.albedo_roughness = vec4<f32>(albedo, roughness);
  out.normal_metallic  = vec4<f32>(mapped_N * 0.5 + 0.5, metallic);
  return out;
}
`,_=48,r=class r extends v{constructor(n={}){super();t(this,"shaderId","pbr");t(this,"albedo");t(this,"roughness");t(this,"metallic");t(this,"uvOffset");t(this,"uvScale");t(this,"uvTile");t(this,"_albedoMap");t(this,"_normalMap");t(this,"_merMap");t(this,"_uniformBuffer",null);t(this,"_uniformDevice",null);t(this,"_bindGroup",null);t(this,"_bindGroupAlbedo");t(this,"_bindGroupNormal");t(this,"_bindGroupMer");t(this,"_dirty",!0);t(this,"_scratch",new Float32Array(_/4));this.albedo=n.albedo??[1,1,1,1],this.roughness=n.roughness??.5,this.metallic=n.metallic??0,this.uvOffset=n.uvOffset,this.uvScale=n.uvScale,this.uvTile=n.uvTile,this._albedoMap=n.albedoMap,this._normalMap=n.normalMap,this._merMap=n.merMap,this.transparent=n.transparent??!1}get albedoMap(){return this._albedoMap}set albedoMap(n){n!==this._albedoMap&&(this._albedoMap=n,this._bindGroup=null)}get normalMap(){return this._normalMap}set normalMap(n){n!==this._normalMap&&(this._normalMap=n,this._bindGroup=null)}get merMap(){return this._merMap}set merMap(n){n!==this._merMap&&(this._merMap=n,this._bindGroup=null)}markDirty(){this._dirty=!0}getShaderCode(n){switch(n){case c.Forward:return b;case c.Geometry:return w;case c.SkinnedGeometry:return x}}getBindGroupLayout(n){let e=r._layoutByDevice.get(n);return e||(e=n.createBindGroupLayout({label:"PbrMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),r._layoutByDevice.set(n,e)),e}getBindGroup(n){var i,o,d,f;if(this._bindGroup&&this._bindGroupAlbedo===this._albedoMap&&this._bindGroupNormal===this._normalMap&&this._bindGroupMer===this._merMap)return this._bindGroup;(!this._uniformBuffer||this._uniformDevice!==n)&&((i=this._uniformBuffer)==null||i.destroy(),this._uniformBuffer=n.createBuffer({label:"PbrMaterialUniform",size:_,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._uniformDevice=n,this._dirty=!0);const e=r._getSampler(n),l=((o=this._albedoMap)==null?void 0:o.view)??r._getWhite(n),s=((d=this._normalMap)==null?void 0:d.view)??r._getFlatNormal(n),u=((f=this._merMap)==null?void 0:f.view)??r._getMerDefault(n);return this._bindGroup=n.createBindGroup({label:"PbrMaterialBG",layout:this.getBindGroupLayout(n),entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:l},{binding:2,resource:s},{binding:3,resource:u},{binding:4,resource:e}]}),this._bindGroupAlbedo=this._albedoMap,this._bindGroupNormal=this._normalMap,this._bindGroupMer=this._merMap,this._bindGroup}update(n){var l,s,u,i,o,d;if(!this._dirty||!this._uniformBuffer)return;const e=this._scratch;e[0]=this.albedo[0],e[1]=this.albedo[1],e[2]=this.albedo[2],e[3]=this.albedo[3],e[4]=this.roughness,e[5]=this.metallic,e[6]=((l=this.uvOffset)==null?void 0:l[0])??0,e[7]=((s=this.uvOffset)==null?void 0:s[1])??0,e[8]=((u=this.uvScale)==null?void 0:u[0])??1,e[9]=((i=this.uvScale)==null?void 0:i[1])??1,e[10]=((o=this.uvTile)==null?void 0:o[0])??1,e[11]=((d=this.uvTile)==null?void 0:d[1])??1,n.writeBuffer(this._uniformBuffer,0,e.buffer),this._dirty=!1}destroy(){var n;(n=this._uniformBuffer)==null||n.destroy(),this._uniformBuffer=null,this._uniformDevice=null,this._bindGroup=null}static _getSampler(n){let e=r._samplerByDevice.get(n);return e||(e=n.createSampler({label:"PbrMaterialSampler",magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),r._samplerByDevice.set(n,e)),e}static _make1x1View(n,e,l,s,u,i){const o=n.createTexture({label:e,size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return n.queue.writeTexture({texture:o},new Uint8Array([l,s,u,i]),{bytesPerRow:4},{width:1,height:1}),o.createView()}static _getWhite(n){let e=r._whiteByDevice.get(n);return e||(e=r._make1x1View(n,"PbrFallbackWhite",255,255,255,255),r._whiteByDevice.set(n,e)),e}static _getFlatNormal(n){let e=r._flatNormalByDevice.get(n);return e||(e=r._make1x1View(n,"PbrFallbackFlatNormal",128,128,255,255),r._flatNormalByDevice.set(n,e)),e}static _getMerDefault(n){let e=r._merDefaultByDevice.get(n);return e||(e=r._make1x1View(n,"PbrFallbackMer",255,0,255,255),r._merDefaultByDevice.set(n,e)),e}};t(r,"_layoutByDevice",new WeakMap),t(r,"_samplerByDevice",new WeakMap),t(r,"_whiteByDevice",new WeakMap),t(r,"_flatNormalByDevice",new WeakMap),t(r,"_merDefaultByDevice",new WeakMap);let p=r;export{p as P};
