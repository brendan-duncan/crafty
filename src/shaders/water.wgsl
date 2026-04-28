// Water pass — forward-rendered on top of the deferred-lit HDR buffer.
// Vertex format: [x, z] (2 floats, chunk-local). Y is computed in VS as chunkOffset.y + WATER_HEIGHT.
// Group 0: camera uniforms (matches WorldGeometryPass layout — 4 mat4 + vec3 pos + near + far)
// Group 1: per-frame water uniforms (time)
// Group 2: per-chunk offset
// Group 3: scene textures (refraction copy, depth, dudv, gradient, sky)

struct CameraUniforms {
  view        : mat4x4<f32>,
  proj        : mat4x4<f32>,
  viewProj    : mat4x4<f32>,
  invViewProj : mat4x4<f32>,
  position    : vec3<f32>,
  near        : f32,
  far         : f32,
  _pad0       : f32,
  _pad1       : f32,
  _pad2       : f32,
}

struct WaterUniforms {
  time          : f32,
  sky_intensity : f32,  // 0 at night, 1 at noon — dims the HDR sky reflection
  _p1           : f32,
  _p2           : f32,
}

struct ChunkUniforms {
  offset : vec3<f32>,
  _pad   : f32,
}

@group(0) @binding(0) var<uniform> cam   : CameraUniforms;
@group(1) @binding(0) var<uniform> water : WaterUniforms;
@group(2) @binding(0) var<uniform> chunk : ChunkUniforms;

@group(3) @binding(0) var refraction_tex : texture_2d<f32>;
@group(3) @binding(1) var depth_tex      : texture_depth_2d;
@group(3) @binding(2) var dudv_tex       : texture_2d<f32>;
@group(3) @binding(3) var gradient_tex   : texture_2d<f32>;
@group(3) @binding(4) var sky_tex        : texture_2d<f32>;
@group(3) @binding(5) var samp           : sampler;

struct VertOut {
  @builtin(position) clip_pos   : vec4<f32>,
  @location(0)       world_pos  : vec3<f32>,
  @location(1)       clip_coords: vec4<f32>,
}

const PI           : f32 = 3.14159265358979;
const WATER_HEIGHT : f32 = 15.0;

@vertex
fn vs_main(@location(0) xz: vec2<f32>) -> VertOut {
  let world_pos = vec3<f32>(xz.x + chunk.offset.x, chunk.offset.y + WATER_HEIGHT, xz.y + chunk.offset.z);
  let clip      = cam.viewProj * vec4<f32>(world_pos, 1.0);
  var out: VertOut;
  out.clip_pos    = clip;
  out.world_pos   = world_pos;
  out.clip_coords = clip;
  return out;
}

fn linearize(d: f32, near: f32, far: f32) -> f32 {
  return near * far / (far - d * (far - near));
}

// Equirectangular sampling for the sky texture (which is stored as a 2D panorama).
fn sky_uv(d: vec3<f32>) -> vec2<f32> {
  let u = 0.5 + atan2(d.z, d.x) / (2.0 * PI);
  let v = 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI;
  return vec2<f32>(u, v);
}

@fragment
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {
  if (in.clip_coords.w < cam.near) { discard; }

  // Screen UV from clip coordinates
  let ndc       = in.clip_coords.xy / in.clip_coords.w;
  let screen_uv = vec2<f32>(ndc.x * 0.5 + 0.5, ndc.y * -0.5 + 0.5);

  // Manual depth test: discard water behind solid geometry
  let px        = vec2<u32>(in.clip_pos.xy);
  let floor_lin = linearize(textureLoad(depth_tex, px, 0), cam.near, cam.far);
  let water_lin = linearize(in.clip_pos.z, cam.near, cam.far);
  if (water_lin > floor_lin) { discard; }
  let water_depth = floor_lin - water_lin;

  // Animated DUDV distortion — two-pass stacked sampling for complex ripples
  let base_uv    = vec2<f32>(in.world_pos.x, in.world_pos.z) * (1.0 / 8.0);
  let d1         = textureSample(dudv_tex, samp, vec2<f32>(base_uv.x + water.time * 0.02, base_uv.y)).rg;
  let d2_uv      = d1 + vec2<f32>(d1.x, d1.y + water.time * 0.02);
  let distortion = (textureSample(dudv_tex, samp, d2_uv).rg * 2.0 - 1.0) * 0.02;

  // Refraction: sample the pre-water HDR copy at distorted screen coords
  let ref_uv    = clamp(screen_uv + distortion, vec2<f32>(0.001), vec2<f32>(0.999));
  let refraction = textureSample(refraction_tex, samp, ref_uv).rgb;

  // Water surface normal from DUDV map
  let nc     = textureSample(dudv_tex, samp, d2_uv).rgb;
  let normal = normalize(vec3<f32>(nc.r * 2.0 - 1.0, 3.0, nc.g * 2.0 - 1.0));

  let view_dir = normalize(cam.position - in.world_pos);

  // Schlick Fresnel for water (F0 ≈ 0.02): low reflection when looking straight down,
  // rising towards grazing. Capped at 0.6 so bright HDR sky values cannot saturate to
  // white when viewing water at a shallow angle from far away.
  let VdotN     = clamp(dot(view_dir, normal), 0.0, 1.0);
  let fresnel_r = min(0.02 + 0.98 * pow(1.0 - VdotN, 5.0), 0.6);

  // Sky reflection via equirectangular lookup, dimmed by sky_intensity for day/night.
  let sky_color = textureSample(sky_tex, samp, sky_uv(reflect(-view_dir, normal))).rgb * water.sky_intensity;

  // Depth-based water tint: absorb red/green and scatter blue as depth increases.
  // deep_color is scaled by sky_intensity so water goes dark at night.
  let depth_t      = clamp(water_depth / 5.0, 0.0, 1.0);
  let shallow_tint = vec3<f32>(0.45, 0.78, 1.0);
  let deep_color   = mix(vec3<f32>(0.003, 0.007, 0.015), vec3<f32>(0.01, 0.10, 0.26), water.sky_intensity);
  let tinted       = mix(refraction * shallow_tint, deep_color, depth_t);

  // Fresnel blend: refraction dominant head-on, reflection rises at grazing angles
  let world_color = mix(tinted, sky_color, fresnel_r);

  // Alpha increases with depth so even shallow water applies a visible blue cast.
  // Edges stay transparent; deeper water becomes nearly opaque.
  let edge_alpha = clamp(water_depth * 2.0, 0.0, 0.95);

  return vec4<f32>(world_color, edge_alpha);
}
