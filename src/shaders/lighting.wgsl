// Deferred PBR lighting pass — fullscreen triangle, reads GBuffer + shadow maps + IBL.

const PI: f32 = 3.14159265358979323846;

// ---- Aerial perspective (Rayleigh + Mie, same model as atmosphere.wgsl) --------
// Density scale factor: real atmosphere only hazes over km; game view is ~200 m,
// so multiply density by 200 to get visible haze at typical render distances.
const ATM_FOG_SCALE : f32       = 80.0;
const ATM_R_E       : f32       = 6360000.0;
const ATM_R_A       : f32       = 6420000.0;
const ATM_H_R       : f32       = 8500.0;
const ATM_H_M       : f32       = 1200.0;
const ATM_G         : f32       = 0.758;
const ATM_BETA_R    : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);
const ATM_BETA_M    : f32       = 21.0e-6;
const ATM_SUN_I     : f32       = 20.0;

fn atm_ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {
  let b = dot(ro, rd); let c = dot(ro, ro) - r * r; let d = b*b - c;
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }
  let sq = sqrt(d);
  return vec2<f32>(-b - sq, -b + sq);
}

fn atm_optical_depth(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {
  let t = atm_ray_sphere(pos, dir, ATM_R_A); let ds = t.y / 4.0;
  var od = vec2<f32>(0.0);
  for (var i = 0; i < 4; i++) {
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - ATM_R_E;
    if (h < 0.0) { break; }
    od += vec2<f32>(exp(-h / ATM_H_R), exp(-h / ATM_H_M)) * ds;
  }
  return od;
}

// Simplified scatter for fog colour (6 main steps).
fn atm_scatter(ro: vec3<f32>, rd: vec3<f32>, sun_dir: vec3<f32>) -> vec3<f32> {
  let ta = atm_ray_sphere(ro, rd, ATM_R_A); let tMin = max(ta.x, 0.0);
  if (ta.y < 0.0) { return vec3<f32>(0.0); }
  let tg   = atm_ray_sphere(ro, rd, ATM_R_E);
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);
  if (tMax <= tMin) { return vec3<f32>(0.0); }
  let mu = dot(rd, sun_dir);
  let pR = (3.0 / (16.0 * PI)) * (1.0 + mu * mu);
  let g2 = ATM_G * ATM_G;
  let pM = (3.0 / (8.0 * PI)) * ((1.0 - g2) * (1.0 + mu * mu)) /
            ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * ATM_G * mu, 1e-4), 1.5));
  let ds = (tMax - tMin) / 6.0;
  var sumR = vec3<f32>(0.0); var sumM = vec3<f32>(0.0);
  var odR = 0.0; var odM = 0.0;
  for (var i = 0; i < 6; i++) {
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);
    let h   = length(pos) - ATM_R_E;
    if (h < 0.0) { break; }
    let hrh = exp(-h / ATM_H_R) * ds; let hmh = exp(-h / ATM_H_M) * ds;
    odR += hrh; odM += hmh;
    let tg2 = atm_ray_sphere(pos, sun_dir, ATM_R_E);
    if (tg2.x > 0.0) { continue; }
    let odL = atm_optical_depth(pos, sun_dir);
    let tau = ATM_BETA_R * (odR + odL.x) + ATM_BETA_M * 1.1 * (odM + odL.y);
    sumR += exp(-tau) * hrh; sumM += exp(-tau) * hmh;
  }
  return ATM_SUN_I * (ATM_BETA_R * pR * sumR + vec3<f32>(ATM_BETA_M) * pM * sumM);
}

fn apply_aerial_perspective(geo_color: vec3<f32>, world_pos: vec3<f32>,
                             sun_dir: vec3<f32>, cam_h: f32) -> vec3<f32> {
  let ray_vec  = world_pos - camera.position;
  let dist     = length(ray_vec);
  let ray_dir  = ray_vec / max(dist, 0.001);
  let atm_ro   = vec3<f32>(0.0, ATM_R_E + cam_h, 0.0);

  // Game-scale extinction: scale up real-atmosphere density to be visible at ~100–300 m.
  let rho_R = exp(-cam_h / ATM_H_R);
  let rho_M = exp(-cam_h / ATM_H_M);
  let tau   = (ATM_BETA_R * rho_R + vec3<f32>(ATM_BETA_M * rho_M)) * ATM_FOG_SCALE * dist;
  let geo_T = exp(-tau);

  // Clamp to near-horizon — prevents the fog colour exactly matching the sky behind the
  // geometry, which would make distant surfaces look transparent rather than hazy.
  let horiz_dir = normalize(vec3<f32>(ray_dir.x, clamp(ray_dir.y, -0.15, 0.15), ray_dir.z));
  let fog_color = atm_scatter(atm_ro, horiz_dir, sun_dir);

  return geo_color * geo_T + fog_color * (1.0 - geo_T);
}
const SHADOW_MAP_SIZE: f32 = 2048.0;

const POISSON16 = array<vec2<f32>, 16>(
  vec2<f32>(-0.94201624, -0.39906216), vec2<f32>( 0.94558609, -0.76890725),
  vec2<f32>(-0.09418410, -0.92938870), vec2<f32>( 0.34495938,  0.29387760),
  vec2<f32>(-0.91588581,  0.45771432), vec2<f32>(-0.81544232, -0.87912464),
  vec2<f32>(-0.38277543,  0.27676845), vec2<f32>( 0.97484398,  0.75648379),
  vec2<f32>( 0.44323325, -0.97511554), vec2<f32>( 0.53742981, -0.47373420),
  vec2<f32>(-0.26496911, -0.41893023), vec2<f32>( 0.79197514,  0.19090188),
  vec2<f32>(-0.24188840,  0.99706507), vec2<f32>(-0.81409955,  0.91437590),
  vec2<f32>( 0.19984126,  0.78641367), vec2<f32>( 0.14383161, -0.14100790),
);

fn ign(pixel: vec2<f32>) -> f32 {
  return fract(52.9829189 * fract(0.06711056 * pixel.x + 0.00583715 * pixel.y));
}

fn rotate2d(v: vec2<f32>, a: f32) -> vec2<f32> {
  let s = sin(a); let c = cos(a);
  return vec2<f32>(c*v.x - s*v.y, s*v.x + c*v.y);
}

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

struct LightUniforms {
  direction         : vec3<f32>,
  intensity         : f32,
  color             : vec3<f32>,
  cascadeCount      : u32,
  cascadeMatrices   : array<mat4x4<f32>, 4>,
  cascadeSplits     : vec4<f32>,
  shadowsEnabled    : u32,
  debugCascades     : u32,
  cloudShadowOrigin : vec2<f32>,  // world-space XZ centre of cloud shadow map
  cloudShadowExtent  : f32,        // half-size in world units (covers ±extent)
  shadowSoftness     : f32,        // PCSS light-size factor (~0.02)
  _pad_light         : vec2<f32>,  // padding to align cascadeDepthRanges to 16 bytes (offset 336)
  cascadeDepthRanges : vec4<f32>,  // light-space Z depth per cascade (for adaptive bias)
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> light : LightUniforms;

@group(1) @binding(0) var albedoRoughnessTex: texture_2d<f32>;
@group(1) @binding(1) var normalMetallicTex : texture_2d<f32>;
@group(1) @binding(2) var depthTex          : texture_depth_2d;
@group(1) @binding(3) var shadowMap         : texture_depth_2d_array;
@group(1) @binding(4) var shadowSampler     : sampler_comparison;
@group(1) @binding(5) var gbufferSampler    : sampler;
@group(1) @binding(6) var cloudShadowTex    : texture_2d<f32>;

// SSAO + SSGI (group 2)
@group(2) @binding(0) var ao_tex   : texture_2d<f32>;
@group(2) @binding(1) var ao_samp  : sampler;
@group(2) @binding(2) var ssgi_tex : texture_2d<f32>;
@group(2) @binding(3) var ssgi_samp: sampler;

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

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc    = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let world_h = camera.invViewProj * ndc;
  return world_h.xyz / world_h.w;
}

// === Shadow ===========================================================

fn pcf_shadow(cascade: u32, sc: vec3<f32>, bias: f32, kernel_radius: f32) -> f32 {
  let texel = vec2<f32>(kernel_radius / SHADOW_MAP_SIZE);
  let angle = ign(sc.xy * SHADOW_MAP_SIZE) * 6.28318530;
  var s = 0.0;
  for (var i = 0; i < 16; i++) {
    let offset = rotate2d(POISSON16[i], angle) * texel;
    let uv = clamp(sc.xy + offset, vec2<f32>(0.0), vec2<f32>(1.0));
    s += textureSampleCompareLevel(shadowMap, shadowSampler, uv, i32(cascade), sc.z - bias);
  }
  return s / 16.0;
}

// Returns average blocker depth, or -1.0 if receiver is fully lit.
fn pcss_blocker_search(cascade: u32, sc: vec3<f32>, search_radius: f32) -> f32 {
  let texel = vec2<f32>(search_radius / SHADOW_MAP_SIZE);
  let angle = ign(sc.xy * SHADOW_MAP_SIZE) * 6.28318530;
  var total = 0.0;
  var count = 0.0;
  for (var i = 0; i < 8; i++) {
    let offset = rotate2d(POISSON16[i], angle) * texel;
    let uv = clamp(sc.xy + offset, vec2<f32>(0.0), vec2<f32>(1.0));
    let tc = clamp(vec2<i32>(uv * SHADOW_MAP_SIZE),
                   vec2<i32>(0), vec2<i32>(i32(SHADOW_MAP_SIZE) - 1));
    let d = textureLoad(shadowMap, tc, i32(cascade), 0);
    if (d < sc.z) {
      total += d;
      count += 1.0;
    }
  }
  if (count == 0.0) { return -1.0; }
  return total / count;
}

// Returns shadow-space coords for cascade c.  xy in [0,1], z in [0,1] when in-frustum.
fn cascade_coords(c: u32, world_pos: vec3<f32>) -> vec3<f32> {
  let ls = light.cascadeMatrices[c] * vec4<f32>(world_pos, 1.0);
  var sc = ls.xyz / ls.w;
  sc = vec3<f32>(sc.xy * 0.5 + 0.5, sc.z);
  sc.y = 1.0 - sc.y;
  return sc;
}

fn in_cascade(sc: vec3<f32>) -> bool {
  return all(sc.xy >= vec2<f32>(0.0)) && all(sc.xy <= vec2<f32>(1.0))
      && sc.z >= 0.0 && sc.z <= 1.0;
}

fn select_cascade(view_depth: f32) -> u32 {
  for (var i = 0u; i < light.cascadeCount; i++) {
    if (view_depth < light.cascadeSplits[i]) { return i; }
  }
  return light.cascadeCount - 1u;
}

fn shadow_factor(world_pos: vec3<f32>, NdotL: f32, view_depth: f32) -> f32 {
  if (light.shadowsEnabled == 0u) { return 1.0; }
  let cascade    = select_cascade(view_depth);
  let depth_range = light.cascadeDepthRanges[cascade];
  let bias       = max(0.05 * (1.0 - NdotL), 0.01) / max(depth_range, 1.0);

  let sc0 = cascade_coords(cascade, world_pos);
  if (!in_cascade(sc0)) { return 1.0; }

  // PCSS: blocker search → penumbra width → scaled PCF kernel.
  var kernel = 2.0;
  let avg_blocker = pcss_blocker_search(cascade, sc0, 8.0);
  if (avg_blocker >= 0.0) {
    let penumbra = light.shadowSoftness * (sc0.z - avg_blocker) / max(avg_blocker, 0.001);
    kernel = clamp(penumbra * SHADOW_MAP_SIZE, 1.0, 16.0);
  }
  let s0 = pcf_shadow(cascade, sc0, bias, kernel);

  let next = cascade + 1u;
  if (next < light.cascadeCount) {
    let split      = light.cascadeSplits[cascade];
    let blend_band = split * 0.1;
    let t = smoothstep(split - blend_band, split, view_depth);
    if (t > 0.0) {
      let sc1 = cascade_coords(next, world_pos);
      // Only blend toward the next cascade if this position is actually inside it;
      // blending toward an OOB cascade would mix toward depth=1 (fully lit).
      if (in_cascade(sc1)) {
        var kernel1 = 2.0;
        let ab1 = pcss_blocker_search(next, sc1, 8.0);
        if (ab1 >= 0.0) {
          let pen1 = light.shadowSoftness * (sc1.z - ab1) / max(ab1, 0.001);
          kernel1 = clamp(pen1 * SHADOW_MAP_SIZE, 1.0, 16.0);
        }
        return mix(s0, pcf_shadow(next, sc1, bias, kernel1), t);
      }
    }
  }
  return s0;
}

// === PBR BRDFs ========================================================

fn distribution_ggx(NdotH: f32, roughness: f32) -> f32 {
  let a  = roughness * roughness;
  let a2 = a * a;
  let d  = NdotH * NdotH * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

// k for direct lighting: (roughness+1)²/8
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


// === Fragment =========================================================

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);
  let depth = textureLoad(depthTex, coord, 0);

  // === Debug: shadow-map depth thumbnails ===================================
  // Rendered before the sky discard so they overlay the full screen.
  if (light.debugCascades != 0u) {
    let screen  = vec2<f32>(textureDimensions(depthTex));
    let thumb   = floor(screen.y / 4.0); // square side — 3 thumbnails fit vertically
    let sm_size = vec2<f32>(textureDimensions(shadowMap));
    let px      = in.clip_pos.xy;

    for (var ci = 0u; ci < light.cascadeCount; ci++) {
      let x0 = screen.x - thumb;
      let y0 = f32(ci) * thumb;
      if (px.x >= x0 && px.y >= y0 && px.y < y0 + thumb) {
        let uv = (px - vec2<f32>(x0, y0)) / thumb;
        // textureLoad avoids the sampler-type conflict (depth textures can't use
        // a non-comparison sampler through textureSampleLevel).
        let tc = clamp(vec2<i32>(uv * sm_size),
                       vec2<i32>(0), vec2<i32>(sm_size) - vec2<i32>(1));
        let d = textureLoad(shadowMap, tc, i32(ci), 0);
        // 2-pixel border in the cascade's debug colour
        let border = 2.0;
        if (px.x < x0 + border || px.y < y0 + border || px.y > y0 + thumb - border) {
          switch ci {
            case 0u: { return vec4<f32>(1.0, 0.25, 0.25, 1.0); }
            case 1u: { return vec4<f32>(0.25, 1.0, 0.25, 1.0); }
            case 2u: { return vec4<f32>(0.25, 0.25, 1.0, 1.0); }
            default: { return vec4<f32>(1.0,  1.0,  0.25, 1.0); }
          }
        }
        return vec4<f32>(d, d, d, 1.0);
      }
    }
  }
  // ==========================================================================

  if (depth >= 1.0) { discard; } // sky pixels handled by SkyPass

  let albedo_rough = textureLoad(albedoRoughnessTex, coord, 0);
  let normal_metal = textureLoad(normalMetallicTex,  coord, 0);

  let albedo    = albedo_rough.rgb;
  let roughness = max(albedo_rough.a, 0.04); // clamp to avoid division issues
  let N         = normalize(normal_metal.rgb * 2.0 - 1.0);
  let metallic  = normal_metal.a;

  let world_pos = reconstruct_world_pos(in.uv, depth);
  let V         = normalize(camera.position - world_pos);
  let NdotV     = max(dot(N, V), 0.001);

  // View-space depth for cascade selection
  let view_pos   = camera.view * vec4<f32>(world_pos, 1.0);
  let view_depth = -view_pos.z;

  // Base reflectance: 0.04 for dielectrics, albedo for metals
  let F0 = mix(vec3<f32>(0.04), albedo, metallic);

  // === Direct lighting (sun) =========================================
  let L     = normalize(-light.direction);
  let H     = normalize(L + V);
  let NdotL = max(dot(N, L), 0.0);
  let NdotH = max(dot(N, H), 0.0);
  let VdotH = max(dot(V, H), 0.0);

  let D  = distribution_ggx(NdotH, roughness);
  let G  = smith_direct(NdotV, NdotL, roughness);
  let Fd = fresnel_schlick(VdotH, F0);

  let kS_direct = Fd;
  let kD_direct = (vec3<f32>(1.0) - kS_direct) * (1.0 - metallic);

  let specular_brdf = D * G * Fd / max(4.0 * NdotV * NdotL, 0.001);
  let diffuse_brdf  = kD_direct * albedo / PI;

  // Offset shadow test position along the surface normal to avoid coplanar self-shadowing.
  let shadow_pos = world_pos + N * 0.03;
  let shad = shadow_factor(shadow_pos, NdotL, view_depth);

  // Cloud shadow — sample top-down transmittance map; default 1.0 when extent is zero
  let cloud_ext = max(light.cloudShadowExtent, 0.001);
  let cloud_uv  = clamp(
    (world_pos.xz - light.cloudShadowOrigin) / (cloud_ext * 2.0) + 0.5,
    vec2<f32>(0.0), vec2<f32>(1.0),
  );
  let cloud_shadow = select(
    textureSampleLevel(cloudShadowTex, gbufferSampler, cloud_uv, 0.0).r,
    1.0,
    light.cloudShadowExtent <= 0.0,
  );

  let direct = (diffuse_brdf + specular_brdf) * light.color * light.intensity * NdotL * shad * cloud_shadow;

  // === Ambient (constant) =============================================
  // Sky IBL replaced by a flat ambient term — atmospheric scattering
  // handles sky appearance; this just prevents fully-black shadows.
  let ao         = textureSampleLevel(ao_tex, ao_samp, in.uv, 0.0).r;
  // top=0.50, side=0.25, bottom=0.05 — piecewise linear on N.y
  let sky_factor = select(0.25 + N.y * 0.20, 0.25 + N.y * 0.25, N.y >= 0.0);
  // Scale by shadow: underground≈0, surface shadows darker but not black.
  let ambient    = albedo * (1.0 - metallic) * sky_factor * ao * max(shad, 0.05);

  // SSGI: one-bounce diffuse indirect from screen-space ray march
  let ssgi_irr     = textureSampleLevel(ssgi_tex, ssgi_samp, in.uv, 0.0).rgb;
  let ssgi_contrib = ssgi_irr * albedo * (1.0 - metallic);

  let color = direct + ambient + ssgi_contrib;

  if (light.debugCascades != 0u) {
    let cascade = select_cascade(view_depth);
    var tint: vec3<f32>;
    switch cascade {
      case 0u:    { tint = vec3<f32>(1.0, 0.25, 0.25); } // red   = near
      case 1u:    { tint = vec3<f32>(0.25, 1.0, 0.25); } // green = mid
      case 2u:    { tint = vec3<f32>(0.25, 0.25, 1.0); } // blue  = far
      default:    { tint = vec3<f32>(1.0,  1.0,  0.25); } // yellow = beyond
    }
    let shad = shadow_factor(shadow_pos, NdotL, view_depth);
    return vec4<f32>(tint * mix(0.15, 1.0, shad), 1.0);
  }

  let sun_dir_fog = normalize(-light.direction);
  let cam_h_fog   = max(camera.position.y, 1.0);
  let haze = apply_aerial_perspective(color, world_pos, sun_dir_fog, cam_h_fog);
  return vec4<f32>(haze, 1.0);
}
