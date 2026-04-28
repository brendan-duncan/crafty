// Tonemapping pass — HDR rgba16float → swapchain format.
// Uses ACES filmic approximation (optional).
// Reads a linear exposure multiplier written each frame by AutoExposurePass.
// Also renders procedural stars + Milky Way here (after DoF/Bloom) for sharp results.

const PI: f32 = 3.14159265358979;

struct TonemapParams {
  aces_enabled: u32,
  debug_ao    : u32,
  hdr_canvas  : u32,
}

struct ExposureBuffer {
  value : f32,
  _pad0 : f32,
  _pad1 : f32,
  _pad2 : f32,
}

// invViewProj(64) + cam_pos(12) + pad(4) + sun_dir(12) + pad(4) = 96 bytes
struct StarUniforms {
  invViewProj: mat4x4<f32>,
  cam_pos    : vec3<f32>,
  _pad0      : f32,
  sun_dir    : vec3<f32>,
  _pad1      : f32,
}

@group(0) @binding(0) var                      hdrTex      : texture_2d<f32>;
@group(0) @binding(1) var                      hdrSampler  : sampler;
@group(0) @binding(2) var<uniform>             params      : TonemapParams;
@group(0) @binding(3) var                      aoTex       : texture_2d<f32>;
@group(0) @binding(4) var<storage, read>       exposure_buf: ExposureBuffer;
@group(0) @binding(5) var<uniform>             star_uni    : StarUniforms;
@group(0) @binding(6) var                      depth_tex   : texture_depth_2d;

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
  out.uv = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ---- Procedural star field --------------------------------------------------

fn star_hash(p: vec2<f32>) -> f32 {
  return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453);
}

fn star_hash2(p: vec2<f32>) -> vec2<f32> {
  return fract(sin(vec2<f32>(
    dot(p, vec2<f32>(127.1, 311.7)),
    dot(p, vec2<f32>(269.5, 183.3))
  )) * 43758.5453);
}

fn dir_to_equirect(d: vec3<f32>) -> vec2<f32> {
  let u = atan2(d.x, -d.z) / (2.0 * PI) + 0.5;
  let v = 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI;
  return vec2<f32>(u, v);
}

fn sample_stars(ray_dir: vec3<f32>) -> vec3<f32> {
  // 300×150 cell equirectangular grid — ~18 % of cells contain a star.
  // Gaussian is evaluated in corrected UV space (cos_lat term keeps stars
  // round at all elevations despite equirectangular compression near poles).
  // K=500 gives a ~1-px half-width at 1920-px / 90° FOV — crisp point sources.
  let GRID    = vec2<f32>(300.0, 150.0);
  let uv      = dir_to_equirect(ray_dir);
  let gcoord  = uv * GRID;
  let cell    = floor(gcoord);
  let frac_uv = fract(gcoord);

  let lat     = (0.5 - uv.y) * PI;
  let cos_lat = max(cos(lat), 0.15);

  var color = vec3<f32>(0.0);

  for (var dy: i32 = -1; dy <= 1; dy++) {
    for (var dx: i32 = -1; dx <= 1; dx++) {
      var nc = cell + vec2<f32>(f32(dx), f32(dy));
      if (nc.y < 0.0 || nc.y >= GRID.y) { continue; }
      nc.x = nc.x - floor(nc.x / GRID.x) * GRID.x;

      let h = star_hash2(nc);
      // Weight density by cos(lat) so cells near poles spawn proportionally fewer
      // stars, giving uniform angular density across the sphere.
      let cell_lat = (0.5 - (nc.y + 0.5) / GRID.y) * PI;
      let star_thresh = 1.0 - 0.18 * max(cos(cell_lat), 0.0);
      if (h.x > star_thresh) {
        let off     = star_hash2(nc + vec2<f32>(7.3, 3.7)) * 0.8 + 0.1;
        let to_star = frac_uv - vec2<f32>(f32(dx), f32(dy)) - off;
        let ts_s    = vec2<f32>(to_star.x * cos_lat, to_star.y);
        let dist2   = dot(ts_s, ts_s);
        let glow    = exp(-dist2 * 500.0);
        if (glow < 0.002) { continue; }

        let mag = pow(star_hash(nc + vec2<f32>(1.5, 0.0)), 1.8);
        let br  = glow * (0.15 + mag * 0.85);

        let roll = star_hash(nc + vec2<f32>(2.5, 0.0));
        var sc   = vec3<f32>(1.0, 1.0, 1.0);
        if      (roll < 0.06) { sc = vec3<f32>(0.65, 0.76, 1.0); }
        else if (roll < 0.20) { sc = vec3<f32>(0.82, 0.89, 1.0); }
        else if (roll < 0.44) { sc = vec3<f32>(1.0,  1.0,  0.82); }
        else if (roll < 0.57) { sc = vec3<f32>(1.0,  0.78, 0.51); }
        else if (roll < 0.64) { sc = vec3<f32>(1.0,  0.51, 0.25); }
        color += sc * br;
      }
    }
  }
  return color;
}

// ---- Tonemapping ------------------------------------------------------------

fn aces_filmic(x: vec3<f32>) -> vec3<f32> {
  let a = 2.51;
  let b = 0.03;
  let c = 2.43;
  let d = 0.59;
  let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3<f32>(0.0), vec3<f32>(1.0));
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);
  if (params.debug_ao != 0u) {
    let ao = textureLoad(aoTex, coord, 0).r;
    return vec4<f32>(ao, ao, ao, 1.0);
  }

  var scene = textureSample(hdrTex, hdrSampler, in.uv).rgb * exposure_buf.value;

  // Stars: rendered here (after DoF/Bloom) so they stay crisp point sources.
  // Only on sky pixels (depth == 1.0 means no geometry wrote there).
  let depth = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) {
    let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
    let world_h = star_uni.invViewProj * ndc;
    let ray_dir = normalize(world_h.xyz / world_h.w - star_uni.cam_pos);

    if (ray_dir.y > -0.05) {
      let sun_alt     = star_uni.sun_dir.y;
      let night_t     = saturate((-sun_alt - 0.05) * 10.0);
      let above_horiz = saturate(ray_dir.y * 20.0);
      let star_fade   = night_t * above_horiz;
      if (star_fade > 0.001) {
        scene += sample_stars(ray_dir) * (star_fade * 2.0);
      }
    }
  }

  // HDR mode: skip ACES so values >1 are preserved; gamma-encode for the display.
  if (params.hdr_canvas != 0u) {
    return vec4<f32>(pow(max(scene, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.2)), 1.0);
  }
  let ldr = select(scene, aces_filmic(scene), params.aces_enabled != 0u);
  return vec4<f32>(pow(ldr, vec3<f32>(1.0 / 2.2)), 1.0);
}
