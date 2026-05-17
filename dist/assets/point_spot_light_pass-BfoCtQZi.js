var q=Object.defineProperty;var Z=(v,g,t)=>g in v?q(v,g,{enumerable:!0,configurable:!0,writable:!0,value:t}):v[g]=t;var r=(v,g,t)=>Z(v,typeof g!="symbol"?g+"":g,t);import{d as z,V as b,c as U,P as I,e as Y,f as K}from"./pass-CMGsmZgn.js";import{H as $}from"./deferred_lighting_pass-Do7ylKDD.js";const Q=[new b(1,0,0),new b(-1,0,0),new b(0,1,0),new b(0,-1,0),new b(0,0,1),new b(0,0,-1)],J=[new b(0,-1,0),new b(0,-1,0),new b(0,0,1),new b(0,0,-1),new b(0,-1,0),new b(0,-1,0)];class xe extends z{constructor(){super(...arguments);r(this,"color",b.one());r(this,"intensity",1);r(this,"radius",10);r(this,"castShadow",!1)}worldPosition(){return this.gameObject.localToWorld().transformPoint(b.ZERO)}cubeFaceViewProjs(t=.05){const e=this.worldPosition(),n=U.perspective(Math.PI/2,1,t,this.radius),o=new Array(6);for(let c=0;c<6;c++)o[c]=n.multiply(U.lookAt(e,e.add(Q[c]),J[c]));return o}}class Se extends z{constructor(){super(...arguments);r(this,"color",b.one());r(this,"intensity",1);r(this,"range",20);r(this,"innerAngle",15);r(this,"outerAngle",30);r(this,"castShadow",!1);r(this,"projectionTexture",null)}worldPosition(){return this.gameObject.localToWorld().transformPoint(b.ZERO)}worldDirection(){return this.gameObject.localToWorld().transformDirection(b.FORWARD).normalize()}lightViewProj(t=.1){const e=this.worldPosition(),n=this.worldDirection(),o=Math.abs(n.y)>.99?b.RIGHT:b.UP,c=U.lookAt(e,e.add(n),o);return U.perspective(this.outerAngle*2*Math.PI/180,1,t,this.range).multiply(c)}}const ee=`// SSAO: hemisphere sampling in view space.
// Reads GBuffer depth + normals, writes raw AO value [0,1].

const KERNEL_SIZE: i32 = 16;

struct SsaoUniforms {
  view    : mat4x4<f32>,  // offset   0
  proj    : mat4x4<f32>,  // offset  64
  inv_proj: mat4x4<f32>,  // offset 128
  radius  : f32,          // offset 192
  bias    : f32,          // offset 196
  strength: f32,          // offset 200
  _pad    : f32,          // offset 204
  kernel  : array<vec4<f32>, 16>, // offset 208 (256 bytes)
}                          // total: 464 bytes

@group(0) @binding(0) var<uniform> ssao: SsaoUniforms;

@group(1) @binding(0) var normal_tex: texture_2d<f32>;   // GBuffer normalMetallic (rgba16float)
@group(1) @binding(1) var depth_tex : texture_depth_2d;  // GBuffer depth (depth32float)
@group(1) @binding(2) var noise_tex : texture_2d<f32>;   // 4×4 random rotation vectors (rgba8unorm)

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// Reconstruct view-space position from UV + NDC depth.
// WebGPU NDC: Y is up, depth [0,1]. UV: Y is down.
fn view_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let vh  = ssao.inv_proj * ndc;
  return vh.xyz / vh.w;
}

@fragment
fn fs_ssao(in: VertexOutput) -> @location(0) vec4<f32> {
  // This pass runs at half resolution. clip_pos is in half-res pixel space;
  // GBuffer textures are full-res so multiply by 2 to address them correctly.
  let half_coord = vec2<i32>(in.clip_pos.xy);
  let coord      = half_coord * 2;
  let depth = textureLoad(depth_tex, coord, 0);

  // Sky pixels → full AO (no occlusion)
  if (depth >= 1.0) { return vec4<f32>(1.0, 0.0, 0.0, 1.0); }

  let P = view_pos(in.uv, depth);

  // Decode world-space normal (stored as N*0.5+0.5), transform to view space
  let raw_n   = textureLoad(normal_tex, coord, 0).rgb;
  let world_N = normalize(raw_n * 2.0 - 1.0);
  let N       = normalize((ssao.view * vec4<f32>(world_N, 0.0)).xyz);

  // Tiled 4×4 noise using half-res coords so the pattern tiles the full screen.
  let noise_coord = vec2<u32>(half_coord) % vec2<u32>(4u);
  let rnd         = textureLoad(noise_tex, noise_coord, 0).rg * 2.0 - 1.0;

  // Gram-Schmidt: build orthonormal tangent frame from random vector + N
  let rand_vec = vec3<f32>(rnd, 0.0);
  let T = normalize(rand_vec - N * dot(rand_vec, N));
  let B = cross(N, T);
  // TBN columns [T, B, N] maps from tangent space to view space
  let tbn = mat3x3<f32>(T, B, N);

  let tex_size = vec2<f32>(textureDimensions(depth_tex));
  var occlusion = 0.0;

  for (var i = 0; i < KERNEL_SIZE; i++) {
    // View-space sample: kernel.z aligns with N (hemisphere above surface)
    let sample_vs = P + (tbn * ssao.kernel[i].xyz) * ssao.radius;

    // Project sample to screen UV
    let clip       = ssao.proj * vec4<f32>(sample_vs, 1.0);
    let ndc_xy     = clip.xy / clip.w;
    let sample_uv  = vec2<f32>(ndc_xy.x * 0.5 + 0.5, -ndc_xy.y * 0.5 + 0.5);

    // Sample depth at that UV and reconstruct view-space Z
    let sc        = clamp(vec2<i32>(sample_uv * tex_size), vec2<i32>(0), vec2<i32>(tex_size) - 1);
    let ref_depth = textureLoad(depth_tex, sc, 0);
    let ref_z     = view_pos(sample_uv, ref_depth).z;

    // Range check: weight falls to 0 when ref surface is beyond radius (different geometry).
    // Inverted smoothstep avoids the reciprocal spike that caused self-occlusion on flat faces.
    let range_check = 1.0 - smoothstep(0.0, ssao.radius, abs(P.z - ref_z));

    // Right-handed view space: closer to camera = higher (less negative) Z.
    // Occlude when actual geometry is closer to camera than the sample point (sample is inside geometry).
    // Using sample_vs.z rather than P.z makes the check slope-invariant: the sample already sits
    // above the surface, so same-surface pixels always satisfy ref_z < sample_vs.z regardless of tilt.
    occlusion += select(0.0, 1.0, ref_z > sample_vs.z + ssao.bias) * range_check;
  }

  let ao = clamp(1.0 - (occlusion / f32(KERNEL_SIZE)) * ssao.strength, 0.0, 1.0);
  return vec4<f32>(ao, 0.0, 0.0, 1.0);
}
`,te=`// SSAO blur: separable bilateral depth-aware Gaussian blur.
// Two passes: horizontal (fs_blur_h) then vertical (fs_blur_v).

@group(0) @binding(0) var ao_tex   : texture_2d<f32>;
@group(0) @binding(1) var depth_tex: texture_depth_2d;
@group(0) @binding(2) var samp     : sampler;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

fn depth_load(uv: vec2<f32>) -> f32 {
  let size  = vec2<i32>(textureDimensions(depth_tex));
  let coord = clamp(vec2<i32>(uv * vec2<f32>(size)), vec2<i32>(0), size - vec2<i32>(1));
  return textureLoad(depth_tex, coord, 0u);
}

const GAUSS: array<f32, 4> = array<f32, 4>(
  0.19638062, 0.17469900, 0.12161760, 0.06706740,
);

fn blur(uv: vec2<f32>, step: vec2<f32>) -> vec4<f32> {
  let depth0 = depth_load(uv);
  var accum  = 0.0;
  var weight = 0.0;
  for (var i: i32 = -3; i <= 3; i++) {
    let uv_off  = uv + step * f32(i);
    let depth_s = depth_load(uv_off);
    let ao_s    = textureSampleLevel(ao_tex, samp, uv_off, 0.0).r;
    let d_wt    = exp(-abs(depth_s - depth0) * 1000.0);
    let w       = GAUSS[abs(i)] * d_wt;
    accum  += w * ao_s;
    weight += w;
  }
  return vec4<f32>(accum / max(weight, 1e-5), 0.0, 0.0, 1.0);
}

@fragment
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(ao_tex));
  var ao = 0.0;
  for (var y = -1; y <= 2; y++) {
    for (var x = -1; x <= 2; x++) {
      ao += textureSampleLevel(ao_tex, samp, in.uv + vec2<f32>(f32(x), f32(y)) * texel, 0.0).r;
    }
  }
  return vec4<f32>(ao / 16.0, 0.0, 0.0, 1.0);
}

@fragment
fn fs_blur_h(in: VertexOutput) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(ao_tex));
  return blur(in.uv, vec2<f32>(texel.x, 0.0));
}

@fragment
fn fs_blur_v(in: VertexOutput) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(ao_tex));
  return blur(in.uv, vec2<f32>(0.0, texel.y));
}
`,ne=`// VSM shadow map generation for point and spot lights.
//
// Point light faces: output linear depth (distance/radius) and depth² into rgba16float.
// Spot light maps  : output NDC depth and depth² into rgba16float.
//
// Two pipeline pairs share identical bind group layouts:
//   group 0: ShadowUniforms (lightViewProj + lightPos + lightRadius)
//   group 1: ModelUniforms  (model matrix)

struct ShadowUniforms {
  lightViewProj: mat4x4<f32>,  // offset 0, 64 bytes
  lightPos     : vec3<f32>,    // offset 64, 12 bytes
  lightRadius  : f32,          // offset 76, 4 bytes
}  // 80 bytes

struct ModelUniforms {
  model: mat4x4<f32>,  // 64 bytes
}

@group(0) @binding(0) var<uniform> shadow: ShadowUniforms;
@group(1) @binding(0) var<uniform> model : ModelUniforms;

// ---- Point light (linear depth) -----------------------------------------------

struct PointVaryings {
  @builtin(position) clip    : vec4<f32>,
  @location(0)       worldPos: vec3<f32>,
}

@vertex
fn vs_point(@location(0) pos: vec3<f32>) -> PointVaryings {
  let worldPos = model.model * vec4<f32>(pos, 1.0);
  var out: PointVaryings;
  out.clip     = shadow.lightViewProj * worldPos;
  out.worldPos = worldPos.xyz;
  return out;
}

@fragment
fn fs_point(in: PointVaryings) -> @location(0) vec4<f32> {
  let d = length(in.worldPos - shadow.lightPos) / shadow.lightRadius;
  return vec4<f32>(d, d * d, 0.0, 1.0);
}

// ---- Spot light (NDC depth) ----------------------------------------------------

struct SpotVaryings {
  @builtin(position) clip    : vec4<f32>,
  @location(0)       ndcDepth: f32,
}

@vertex
fn vs_spot(@location(0) pos: vec3<f32>) -> SpotVaryings {
  let worldPos = model.model * vec4<f32>(pos, 1.0);
  let clip     = shadow.lightViewProj * worldPos;
  var out: SpotVaryings;
  out.clip     = clip;
  out.ndcDepth = clip.z / clip.w;
  return out;
}

@fragment
fn fs_spot(in: SpotVaryings) -> @location(0) vec4<f32> {
  let d = in.ndcDepth;
  return vec4<f32>(d, d * d, 0.0, 1.0);
}
`,re=`// Additive deferred pass for point and spot lights.
// Runs after DeferredLightingPass (which handles directional + IBL) with loadOp:'load'
// and srcFactor:'one' dstFactor:'one' so results accumulate on the HDR texture.

const PI: f32 = 3.14159265358979323846;

// ---- Camera (same layout as deferred_lighting.wgsl, 288 bytes) -------------------------

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

// ---- Light data ---------------------------------------------------------------

struct LightCounts {
  numPoint: u32,
  numSpot : u32,
}

// 48 bytes — must match TypeScript packing in updateLights()
struct PointLightGpu {
  position : vec3<f32>,   // offset 0
  radius   : f32,         // offset 12
  color    : vec3<f32>,   // offset 16
  intensity: f32,         // offset 28
  shadowIdx: i32,         // offset 32  — negative means no shadow
  _pad0    : i32,
  _pad1    : i32,
  _pad2    : i32,
}

// 128 bytes — must match TypeScript packing in updateLights()
struct SpotLightGpu {
  position  : vec3<f32>,    // offset 0
  range     : f32,          // offset 12
  direction : vec3<f32>,    // offset 16
  innerCos  : f32,          // offset 28
  color     : vec3<f32>,    // offset 32
  outerCos  : f32,          // offset 44
  intensity : f32,          // offset 48
  shadowIdx : i32,          // offset 52
  projTexIdx: i32,          // offset 56
  _pad      : f32,          // offset 60
  lightViewProj: mat4x4<f32>, // offset 64
}

@group(0) @binding(0) var<uniform>       camera     : CameraUniforms;
@group(2) @binding(0) var<uniform>       lightCounts: LightCounts;
@group(2) @binding(1) var<storage, read> pointLights: array<PointLightGpu>;
@group(2) @binding(2) var<storage, read> spotLights : array<SpotLightGpu>;

// ---- GBuffer -----------------------------------------------------------------

@group(1) @binding(0) var albedoRoughnessTex: texture_2d<f32>;
@group(1) @binding(1) var normalMetallicTex : texture_2d<f32>;
@group(1) @binding(2) var depthTex          : texture_depth_2d;
@group(1) @binding(3) var gbufferSampler    : sampler;

// ---- Shadow maps + projection textures ----------------------------------------

@group(3) @binding(0) var vsm_point   : texture_cube_array<f32>;
@group(3) @binding(1) var vsm_spot    : texture_2d_array<f32>;
@group(3) @binding(2) var proj_tex    : texture_2d_array<f32>;
@group(3) @binding(3) var vsm_sampler : sampler;
@group(3) @binding(4) var proj_sampler: sampler;

// ---- Vertex ------------------------------------------------------------------

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ---- Helpers -----------------------------------------------------------------

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc    = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let world_h = camera.invViewProj * ndc;
  return world_h.xyz / world_h.w;
}

// Variance shadow map: Chebyshev upper bound
fn vsm_shadow(moments: vec2<f32>, compare: f32) -> f32 {
  if (compare <= moments.x + 0.001) { return 1.0; }
  let variance = max(moments.y - moments.x * moments.x, 1e-5);
  let d = compare - moments.x;
  return variance / (variance + d * d);
}

// Epic-style inverse-square attenuation with smooth radius falloff
fn point_attenuation(dist: f32, radius: f32) -> f32 {
  let r = dist / radius;
  return pow(saturate(1.0 - r * r * r * r), 2.0) / max(dist * dist, 0.0001);
}

// ---- BRDF (same as deferred_lighting.wgsl) --------------------------------------------

fn distribution_ggx(NdotH: f32, roughness: f32) -> f32 {
  let a  = roughness * roughness;
  let a2 = a * a;
  let d  = NdotH * NdotH * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

fn geometry_direct(NdotX: f32, roughness: f32) -> f32 {
  let r = roughness + 1.0;
  let k = r * r / 8.0;
  return NdotX / (NdotX * (1.0 - k) + k);
}

fn smith_direct(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
  return geometry_direct(NdotV, roughness) * geometry_direct(NdotL, roughness);
}

fn fresnel_schlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
  return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

fn cook_torrance(NdotV: f32, NdotL: f32, NdotH: f32, VdotH: f32, roughness: f32, F0: vec3<f32>, albedo: vec3<f32>, metallic: f32) -> vec3<f32> {
  let D  = distribution_ggx(NdotH, roughness);
  let G  = smith_direct(NdotV, NdotL, roughness);
  let Fd = fresnel_schlick(VdotH, F0);
  let kD = (vec3<f32>(1.0) - Fd) * (1.0 - metallic);
  let specular = D * G * Fd / max(4.0 * NdotV * NdotL, 0.001);
  let diffuse  = kD * albedo / PI;
  return diffuse + specular;
}

// ---- Fragment ----------------------------------------------------------------

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);
  let depth = textureLoad(depthTex, coord, 0);
  if (depth >= 1.0) { discard; }  // sky — directional pass handles it

  let albedo_rough = textureLoad(albedoRoughnessTex, coord, 0);
  let normal_metal = textureLoad(normalMetallicTex,  coord, 0);

  let albedo    = albedo_rough.rgb;
  let roughness = max(albedo_rough.a, 0.04);
  let N         = normalize(normal_metal.rgb * 2.0 - 1.0);
  let metallic  = normal_metal.a;

  let world_pos = reconstruct_world_pos(in.uv, depth);
  let V         = normalize(camera.position - world_pos);
  let NdotV     = max(dot(N, V), 0.001);
  let F0        = mix(vec3<f32>(0.04), albedo, metallic);

  var accum = vec3<f32>(0.0);

  // ---- Point lights ----------------------------------------------------------
  for (var i = 0u; i < lightCounts.numPoint; i++) {
    let pl   = pointLights[i];
    let diff = pl.position - world_pos;
    let dist = length(diff);
    if (dist >= pl.radius) { continue; }

    let L     = diff / dist;
    let NdotL = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) { continue; }

    let H     = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let brdf = cook_torrance(NdotV, NdotL, NdotH, VdotH, roughness, F0, albedo, metallic);
    let att  = point_attenuation(dist, pl.radius);

    // VSM cube-array shadow
    var shad = 1.0;
    if (pl.shadowIdx >= 0) {
      let dir     = -normalize(diff);  // from light toward surface
      let compare = dist / pl.radius;
      let moments = textureSampleLevel(vsm_point, vsm_sampler, dir, pl.shadowIdx, 0.0).rg;
      shad = vsm_shadow(moments, compare);
    }

    accum += brdf * pl.color * pl.intensity * NdotL * att * shad;
  }

  // ---- Spot lights -----------------------------------------------------------
  for (var i = 0u; i < lightCounts.numSpot; i++) {
    let sl   = spotLights[i];
    let diff = sl.position - world_pos;
    let dist = length(diff);
    if (dist >= sl.range) { continue; }

    let L        = diff / dist;
    let NdotL    = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) { continue; }

    // Spot cone attenuation
    let cos_angle = dot(-L, sl.direction);
    if (cos_angle <= sl.outerCos) { continue; }
    let cone = smoothstep(sl.outerCos, sl.innerCos, cos_angle);

    let H     = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let brdf = cook_torrance(NdotV, NdotL, NdotH, VdotH, roughness, F0, albedo, metallic);
    let att  = point_attenuation(dist, sl.range);

    // VSM + projection texture (computed from light-space coords)
    var modulator = vec3<f32>(1.0);
    if (sl.shadowIdx >= 0 || sl.projTexIdx >= 0) {
      let ls     = sl.lightViewProj * vec4<f32>(world_pos, 1.0);
      let sc     = ls.xyz / ls.w;
      let uv     = vec2<f32>(sc.x * 0.5 + 0.5, -sc.y * 0.5 + 0.5);
      let in_frustum = all(uv >= vec2<f32>(0.0)) && all(uv <= vec2<f32>(1.0)) && sc.z >= 0.0 && sc.z <= 1.0;

      if (in_frustum) {
        if (sl.shadowIdx >= 0) {
          let moments = textureSampleLevel(vsm_spot, vsm_sampler, uv, sl.shadowIdx, 0.0).rg;
          modulator *= vec3<f32>(vsm_shadow(moments, sc.z));
        }
        if (sl.projTexIdx >= 0) {
          modulator *= textureSampleLevel(proj_tex, proj_sampler, uv, sl.projTexIdx, 0.0).rgb;
        }
      } else {
        modulator = vec3<f32>(0.0);  // outside frustum → no contribution
      }
    }

    accum += brdf * sl.color * sl.intensity * NdotL * att * cone * modulator;
  }

  return vec4<f32>(accum, 0.0);
}
`,V="r8unorm",R=16,oe=464;function ie(){const v=new Float32Array(R*4);for(let g=0;g<R;g++){const t=Math.random(),e=Math.random()*Math.PI*2,n=Math.sqrt(1-t*t),o=.1+.9*(g/R)**2;v[g*4+0]=n*Math.cos(e)*o,v[g*4+1]=n*Math.sin(e)*o,v[g*4+2]=t*o,v[g*4+3]=0}return v}function ae(){const v=new Uint8Array(64);for(let g=0;g<16;g++){const t=Math.random()*Math.PI*2;v[g*4+0]=Math.round((Math.cos(t)*.5+.5)*255),v[g*4+1]=Math.round((Math.sin(t)*.5+.5)*255),v[g*4+2]=128,v[g*4+3]=255}return v}class H extends I{constructor(t,e,n,o,c,d,h,s,a,u,l,i){super();r(this,"name","SSAOPass");r(this,"_ssaoPipeline");r(this,"_blurHPipeline");r(this,"_blurVPipeline");r(this,"_boxBlurPipeline");r(this,"_blurQuality");r(this,"_uniformBuffer");r(this,"_noiseTex");r(this,"_noiseView");r(this,"_ssaoBgl1");r(this,"_blurBgl");r(this,"_ssaoBg0");r(this,"_blurSampler");r(this,"_cameraScratch",new Float32Array(48));r(this,"_paramsScratch",new Float32Array(4));this._ssaoPipeline=t,this._blurHPipeline=e,this._blurVPipeline=n,this._boxBlurPipeline=o,this._blurQuality=i,this._uniformBuffer=c,this._noiseTex=d,this._noiseView=h,this._ssaoBgl1=s,this._blurBgl=a,this._ssaoBg0=u,this._blurSampler=l}static create(t,e="quality"){const{device:n}=t,o=n.createTexture({label:"SsaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});n.queue.writeTexture({texture:o},ae().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const c=o.createView(),d=n.createBuffer({label:"SsaoUniforms",size:oe,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(d,208,ie().buffer),n.queue.writeBuffer(d,192,new Float32Array([1,.005,2,0]).buffer);const h=n.createSampler({label:"SsaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),s=n.createBindGroupLayout({label:"SsaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=n.createBindGroupLayout({label:"SsaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),u=n.createBindGroupLayout({label:"SsaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),l=t.createShaderModule(ee,"SsaoShader"),i=t.createShaderModule(te,"SsaoBlurShader"),p=n.createRenderPipeline({label:"SsaoPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[s,a]}),vertex:{module:l,entryPoint:"vs_main"},fragment:{module:l,entryPoint:"fs_ssao",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),f=n.createRenderPipeline({label:"SsaoBlurHPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[u]}),vertex:{module:i,entryPoint:"vs_main"},fragment:{module:i,entryPoint:"fs_blur_h",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),x=n.createRenderPipeline({label:"SsaoBlurVPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[u]}),vertex:{module:i,entryPoint:"vs_main"},fragment:{module:i,entryPoint:"fs_blur_v",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),m=n.createRenderPipeline({label:"SsaoBoxBlurPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[u]}),vertex:{module:i,entryPoint:"vs_main"},fragment:{module:i,entryPoint:"fs_blur",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),y=n.createBindGroup({label:"SsaoBG0",layout:s,entries:[{binding:0,resource:{buffer:d}}]});return new H(p,f,x,m,d,o,c,a,u,y,h,e)}updateCamera(t){const e=t.activeCamera;if(!e)throw new Error("SSAOPass.updateCamera: ctx.activeCamera is null");const n=this._cameraScratch;n.set(e.viewMatrix().data,0),n.set(e.projectionMatrix().data,16),n.set(e.inverseProjectionMatrix().data,32),t.device.queue.writeBuffer(this._uniformBuffer,0,n.buffer)}setBlurQuality(t){this._blurQuality=t}updateParams(t,e=1,n=.005,o=2){this._paramsScratch[0]=e,this._paramsScratch[1]=n,this._paramsScratch[2]=o,this._paramsScratch[3]=0,t.device.queue.writeBuffer(this._uniformBuffer,192,this._paramsScratch.buffer)}addToGraph(t,e){const{ctx:n}=t,o=Math.max(1,n.width>>1),c=Math.max(1,n.height>>1),d={format:V,width:o,height:c};let h,s;if(t.addPass("SSAOPass.raw","render",a=>{h=a.createTexture({label:"SsaoRaw",...d}),h=a.write(h,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),a.read(e.normal,"sampled"),a.read(e.depth,"sampled"),a.setExecute((u,l)=>{const i=l.getOrCreateBindGroup({label:"SsaoBG1",layout:this._ssaoBgl1,entries:[{binding:0,resource:l.getTextureView(e.normal)},{binding:1,resource:l.getTextureView(e.depth)},{binding:2,resource:this._noiseView}]}),p=u.renderPassEncoder;p.setPipeline(this._ssaoPipeline),p.setBindGroup(0,this._ssaoBg0),p.setBindGroup(1,i),p.draw(3)})}),this._blurQuality==="quality"){let a;t.addPass("SSAOPass.blurH","render",u=>{a=u.createTexture({label:"SsaoBlurH",...d}),a=u.write(a,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),u.read(h,"sampled"),u.read(e.depth,"sampled"),u.setExecute((l,i)=>{const p=i.getOrCreateBindGroup({label:"SsaoBlurHBG",layout:this._blurBgl,entries:[{binding:0,resource:i.getTextureView(h)},{binding:1,resource:i.getTextureView(e.depth)},{binding:2,resource:this._blurSampler}]}),f=l.renderPassEncoder;f.setPipeline(this._blurHPipeline),f.setBindGroup(0,p),f.draw(3)})}),t.addPass("SSAOPass.blurV","render",u=>{s=u.createTexture({label:"SsaoBlurred",...d}),s=u.write(s,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),u.read(a,"sampled"),u.read(e.depth,"sampled"),u.setExecute((l,i)=>{const p=i.getOrCreateBindGroup({label:"SsaoBlurVBG",layout:this._blurBgl,entries:[{binding:0,resource:i.getTextureView(a)},{binding:1,resource:i.getTextureView(e.depth)},{binding:2,resource:this._blurSampler}]}),f=l.renderPassEncoder;f.setPipeline(this._blurVPipeline),f.setBindGroup(0,p),f.draw(3)})})}else t.addPass("SSAOPass.boxBlur","render",a=>{s=a.createTexture({label:"SsaoBoxBlurred",...d}),s=a.write(s,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),a.read(h,"sampled"),a.read(e.depth,"sampled"),a.setExecute((u,l)=>{const i=l.getOrCreateBindGroup({label:"SsaoBoxBlurBG",layout:this._blurBgl,entries:[{binding:0,resource:l.getTextureView(h)},{binding:1,resource:l.getTextureView(e.depth)},{binding:2,resource:this._blurSampler}]}),p=u.renderPassEncoder;p.setPipeline(this._boxBlurPipeline),p.setBindGroup(0,i),p.draw(3)})});return{ao:s}}destroy(){this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const M=32,N=32,T=4,B=8,E=256,O=512,A=256,F=80,se=64,le=6*T,de=le+B,ue="pointspot:point-vsm",ce="pointspot:spot-vsm",fe="pointspot:proj-array",pe={label:"PointVSM",format:"rgba16float",width:E,height:E,depthOrArrayLayers:T*6},he={label:"SpotVSM",format:"rgba16float",width:O,height:O,depthOrArrayLayers:B},me={label:"ProjTexArray",format:"rgba8unorm",width:A,height:A,depthOrArrayLayers:B,extraUsage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT};class k extends I{constructor(t,e,n,o,c,d,h,s,a,u){super();r(this,"name","PointSpotShadowPass");r(this,"_device");r(this,"_pointPipeline");r(this,"_spotPipeline");r(this,"_shadowBufs");r(this,"_shadowBGs");r(this,"_modelBgl");r(this,"_modelBufs",[]);r(this,"_modelBGs",[]);r(this,"_pointDepth");r(this,"_pointDepthView");r(this,"_spotDepth");r(this,"_spotDepthView");r(this,"_shadowScratch",new Float32Array(F/4));r(this,"_snapshot",[]);r(this,"_pointLights",[]);r(this,"_spotLights",[]);r(this,"_cachedPointTex",null);r(this,"_cachedPointFaceViews",[]);r(this,"_cachedSpotTex",null);r(this,"_cachedSpotFaceViews",[]);this._device=t,this._pointPipeline=e,this._spotPipeline=n,this._shadowBufs=o,this._shadowBGs=c,this._modelBgl=d,this._pointDepth=h,this._pointDepthView=s,this._spotDepth=a,this._spotDepthView=u}static create(t){const{device:e}=t,n=e.createTexture({label:"PointShadowDepth",size:{width:E,height:E},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),o=e.createTexture({label:"SpotShadowDepth",size:{width:O,height:O},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),c=e.createBindGroupLayout({label:"PSShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),d=e.createBindGroupLayout({label:"PSModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),h=[],s=[];for(let f=0;f<de;f++){const x=e.createBuffer({label:`PSShadowUniform ${f}`,size:F,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});h.push(x),s.push(e.createBindGroup({label:`PSShadowBG ${f}`,layout:c,entries:[{binding:0,resource:{buffer:x}}]}))}const a=e.createPipelineLayout({bindGroupLayouts:[c,d]}),u=t.createShaderModule(ne,"PointSpotShadowShader"),l={module:u,buffers:[{arrayStride:K,attributes:[Y[0]]}]},i=e.createRenderPipeline({label:"PointShadowPipeline",layout:a,vertex:{...l,entryPoint:"vs_point"},fragment:{module:u,entryPoint:"fs_point",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),p=e.createRenderPipeline({label:"SpotShadowPipeline",layout:a,vertex:{...l,entryPoint:"vs_spot"},fragment:{module:u,entryPoint:"fs_spot",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new k(e,i,p,h,s,d,n,n.createView(),o,o.createView())}update(t,e,n){this._pointLights=t,this._spotLights=e,this._snapshot=n}addToGraph(t){const e=t.importPersistentTexture(ue,pe),n=t.importPersistentTexture(ce,he),o=t.importPersistentTexture(fe,me);let c,d,h;return t.addPass(this.name,"transfer",s=>{c=s.write(e,"attachment"),d=s.write(n,"attachment"),h=s.write(o,"copy-dst"),s.setExecute((a,u)=>{const l=this._snapshot;this._ensureModelBuffers(l.length);const i=u.getTexture(e),p=u.getTexture(n),f=u.getTexture(o);this._cachedPointTex!==i&&(this._cachedPointTex=i,this._cachedPointFaceViews=Array.from({length:T*6},(_,w)=>i.createView({dimension:"2d",baseArrayLayer:w,arrayLayerCount:1}))),this._cachedSpotTex!==p&&(this._cachedSpotTex=p,this._cachedSpotFaceViews=Array.from({length:B},(_,w)=>p.createView({dimension:"2d",baseArrayLayer:w,arrayLayerCount:1})));for(let _=0;_<this._spotLights.length&&_<B;_++){const w=this._spotLights[_];w.projectionTexture&&a.commandEncoder.copyTextureToTexture({texture:w.projectionTexture},{texture:f,origin:{x:0,y:0,z:_}},{width:A,height:A,depthOrArrayLayers:1})}for(let _=0;_<l.length;_++)this._device.queue.writeBuffer(this._modelBufs[_],0,l[_].modelMatrix.data.buffer);let x=0,m=0;for(const _ of this._pointLights){if(!_.castShadow||m>=T)continue;const w=_.worldPosition(),G=_.cubeFaceViewProjs(),S=this._shadowScratch;S[16]=w.x,S[17]=w.y,S[18]=w.z,S[19]=_.radius;for(let P=0;P<6;P++){S.set(G[P].data,0),this._device.queue.writeBuffer(this._shadowBufs[x],0,S.buffer);const X=m*6+P,L=a.commandEncoder.beginRenderPass({label:`PointShadow light${m} face${P}`,colorAttachments:[{view:this._cachedPointFaceViews[X],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._pointDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});L.setPipeline(this._pointPipeline),L.setBindGroup(0,this._shadowBGs[x]),this._drawItems(L,l),L.end(),x++}m++}let y=0;for(const _ of this._spotLights){if(!_.castShadow||y>=B)continue;const w=_.lightViewProj(),G=_.worldPosition(),S=this._shadowScratch;S.set(w.data,0),S[16]=G.x,S[17]=G.y,S[18]=G.z,S[19]=_.range,this._device.queue.writeBuffer(this._shadowBufs[x],0,S.buffer);const P=a.commandEncoder.beginRenderPass({label:`SpotShadow light${y}`,colorAttachments:[{view:this._cachedSpotFaceViews[y],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._spotDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});P.setPipeline(this._spotPipeline),P.setBindGroup(0,this._shadowBGs[x]),this._drawItems(P,l),P.end(),x++,y++}})}),{pointVsm:c,spotVsm:d,projTex:h}}_drawItems(t,e){for(let n=0;n<e.length;n++){const{mesh:o}=e[n];t.setBindGroup(1,this._modelBGs[n]),t.setVertexBuffer(0,o.vertexBuffer),t.setIndexBuffer(o.indexBuffer,"uint32"),t.drawIndexed(o.indexCount)}}_ensureModelBuffers(t){for(;this._modelBufs.length<t;){const e=this._device.createBuffer({label:`PSModelUniform ${this._modelBufs.length}`,size:se,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBufs.push(e),this._modelBGs.push(this._device.createBindGroup({layout:this._modelBgl,entries:[{binding:0,resource:{buffer:e}}]}))}}destroy(){this._pointDepth.destroy(),this._spotDepth.destroy();for(const t of this._shadowBufs)t.destroy();for(const t of this._modelBufs)t.destroy()}}const D=64*4+16+16,ge=8,C=48,j=128;class W extends I{constructor(t,e,n,o,c,d,h,s,a,u,l,i){super();r(this,"name","PointSpotLightPass");r(this,"_pipeline");r(this,"_cameraBg");r(this,"_lightBg");r(this,"_gbufferBgl");r(this,"_shadowBgl");r(this,"_cameraBuffer");r(this,"_lightCountsBuffer");r(this,"_pointBuffer");r(this,"_spotBuffer");r(this,"_linearSampler");r(this,"_vsmSampler");r(this,"_projSampler");r(this,"_cameraData",new Float32Array(D/4));r(this,"_lightCountsArr",new Uint32Array(2));r(this,"_pointBuf",new ArrayBuffer(M*C));r(this,"_pointF32",new Float32Array(this._pointBuf));r(this,"_pointI32",new Int32Array(this._pointBuf));r(this,"_spotBuf",new ArrayBuffer(N*j));r(this,"_spotF32",new Float32Array(this._spotBuf));r(this,"_spotI32",new Int32Array(this._spotBuf));this._pipeline=t,this._cameraBg=e,this._lightBg=n,this._gbufferBgl=o,this._shadowBgl=c,this._cameraBuffer=d,this._lightCountsBuffer=h,this._pointBuffer=s,this._spotBuffer=a,this._linearSampler=u,this._vsmSampler=l,this._projSampler=i}static create(t){const{device:e}=t,n=e.createBuffer({label:"PSLCameraBuffer",size:D,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=e.createBuffer({label:"PSLLightCounts",size:ge,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),c=e.createBuffer({label:"PSLPointBuffer",size:M*C,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=e.createBuffer({label:"PSLSpotBuffer",size:N*j,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=e.createSampler({label:"PSLLinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),s=e.createSampler({label:"PSLVsmSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),a=e.createSampler({label:"PSLProjSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),u=e.createBindGroupLayout({label:"PSLCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),l=e.createBindGroupLayout({label:"PSLGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),i=e.createBindGroupLayout({label:"PSLLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),p=e.createBindGroupLayout({label:"PSLShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube-array"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),f=e.createBindGroup({label:"PSLCameraBG",layout:u,entries:[{binding:0,resource:{buffer:n}}]}),x=e.createBindGroup({label:"PSLLightBG",layout:i,entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:d}}]}),m=t.createShaderModule(re,"PointSpotLightShader"),y=e.createRenderPipeline({label:"PointSpotLightPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[u,l,i,p]}),vertex:{module:m,entryPoint:"vs_main"},fragment:{module:m,entryPoint:"fs_main",targets:[{format:$,blend:{color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new W(y,f,x,l,p,n,o,c,d,h,s,a)}updateCamera(t){const e=t.activeCamera;if(!e)throw new Error("PointSpotLightPass.updateCamera: ctx.activeCamera is null");const n=e.position(),o=this._cameraData;o.set(e.viewMatrix().data,0),o.set(e.projectionMatrix().data,16),o.set(e.viewProjectionMatrix().data,32),o.set(e.inverseViewProjectionMatrix().data,48),o[64]=n.x,o[65]=n.y,o[66]=n.z,o[67]=e.near,o[68]=e.far,t.queue.writeBuffer(this._cameraBuffer,0,o.buffer)}updateLights(t,e,n){const o=this._lightCountsArr;o[0]=Math.min(e.length,M),o[1]=Math.min(n.length,N),t.queue.writeBuffer(this._lightCountsBuffer,0,o.buffer);const c=this._pointF32,d=this._pointI32;let h=0;for(let l=0;l<Math.min(e.length,M);l++){const i=e[l],p=i.worldPosition(),f=l*12;c[f+0]=p.x,c[f+1]=p.y,c[f+2]=p.z,c[f+3]=i.radius,c[f+4]=i.color.x,c[f+5]=i.color.y,c[f+6]=i.color.z,c[f+7]=i.intensity,i.castShadow&&h<T?d[f+8]=h++:d[f+8]=-1,d[f+9]=0,d[f+10]=0,d[f+11]=0}t.queue.writeBuffer(this._pointBuffer,0,this._pointBuf);const s=this._spotF32,a=this._spotI32;let u=0;for(let l=0;l<Math.min(n.length,N);l++){const i=n[l],p=i.worldPosition(),f=i.worldDirection(),x=i.lightViewProj(),m=l*32;s[m+0]=p.x,s[m+1]=p.y,s[m+2]=p.z,s[m+3]=i.range,s[m+4]=f.x,s[m+5]=f.y,s[m+6]=f.z,s[m+7]=Math.cos(i.innerAngle*Math.PI/180),s[m+8]=i.color.x,s[m+9]=i.color.y,s[m+10]=i.color.z,s[m+11]=Math.cos(i.outerAngle*Math.PI/180),s[m+12]=i.intensity,i.castShadow&&u<B?a[m+13]=u++:a[m+13]=-1,a[m+14]=i.projectionTexture!==null?l:-1,a[m+15]=0,s.set(x.data,m+16)}t.queue.writeBuffer(this._spotBuffer,0,this._spotBuf)}updateLight(t){t.computeLightViewProj()}addToGraph(t,e){let n;return t.addPass(this.name,"render",o=>{n=o.write(e.hdr,"attachment",{loadOp:"load",storeOp:"store"}),o.read(e.gbuffer.albedo,"sampled"),o.read(e.gbuffer.normal,"sampled"),o.read(e.gbuffer.depth,"sampled"),o.read(e.pointVsm,"sampled"),o.read(e.spotVsm,"sampled"),o.read(e.projTex,"sampled"),o.setExecute((c,d)=>{const h=d.getOrCreateBindGroup({layout:this._gbufferBgl,entries:[{binding:0,resource:d.getTextureView(e.gbuffer.albedo)},{binding:1,resource:d.getTextureView(e.gbuffer.normal)},{binding:2,resource:d.getTextureView(e.gbuffer.depth)},{binding:3,resource:this._linearSampler}]}),s=d.getOrCreateBindGroup({layout:this._shadowBgl,entries:[{binding:0,resource:d.getTextureView(e.pointVsm,{dimension:"cube-array",arrayLayerCount:T*6})},{binding:1,resource:d.getTextureView(e.spotVsm,{dimension:"2d-array"})},{binding:2,resource:d.getTextureView(e.projTex,{dimension:"2d-array"})},{binding:3,resource:this._vsmSampler},{binding:4,resource:this._projSampler}]}),a=c.renderPassEncoder;a.setPipeline(this._pipeline),a.setBindGroup(0,this._cameraBg),a.setBindGroup(1,h),a.setBindGroup(2,this._lightBg),a.setBindGroup(3,s),a.draw(3)})}),{hdr:n}}destroy(){this._cameraBuffer.destroy(),this._lightCountsBuffer.destroy(),this._pointBuffer.destroy(),this._spotBuffer.destroy()}}export{xe as P,Se as S,H as a,k as b,W as c};
