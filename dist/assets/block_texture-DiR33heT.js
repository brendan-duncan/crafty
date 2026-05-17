var U=Object.defineProperty;var A=(n,e,t)=>e in n?U(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var s=(n,e,t)=>A(n,typeof e!="symbol"?e+"":e,t);import{T as p}from"./hdr_loader-C43XKs12.js";const q=""+new URL("simple_block_atlas-B-7juoTN.png",import.meta.url).href,L=""+new URL("simple_block_atlas_normal-BdCvGD-K.png",import.meta.url).href,W=""+new URL("simple_block_atlas_mer-C_Oa_Ink.png",import.meta.url).href,M=""+new URL("simple_block_atlas_heightmap-BOV6qQJl.png",import.meta.url).href,F=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.
// The composite step is in bloom_composite.wgsl.

struct BloomUniforms {
  threshold: f32,
  knee     : f32,
  strength : f32,
  _pad     : f32,
}

@group(0) @binding(0) var<uniform> bloom   : BloomUniforms;
@group(0) @binding(1) var          src_tex : texture_2d<f32>;
@group(0) @binding(2) var          src_samp: sampler;

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

// Prefilter: 2× downsample + soft-knee threshold.
// UV is mapped to the half-res output; src_tex is the full-res HDR.
@fragment
fn fs_prefilter(in: VertexOutput) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(src_tex));
  let c = (
    textureSample(src_tex, src_samp, in.uv + vec2(-0.5, -0.5) * texel) +
    textureSample(src_tex, src_samp, in.uv + vec2( 0.5, -0.5) * texel) +
    textureSample(src_tex, src_samp, in.uv + vec2(-0.5,  0.5) * texel) +
    textureSample(src_tex, src_samp, in.uv + vec2( 0.5,  0.5) * texel)
  ).rgb * 0.25;

  // Soft knee: smooth ramp from (threshold - knee) to (threshold + knee)
  let brightness = max(c.r, max(c.g, c.b));
  let rq         = clamp(brightness - bloom.threshold + bloom.knee, 0.0, 2.0 * bloom.knee);
  let weight     = max(bloom.knee * rq * rq, brightness - bloom.threshold)
                 / max(brightness, 0.0001);
  return vec4<f32>(c * weight, 1.0);
}

// 9-tap separable Gaussian, sigma ≈ 2.  Weights are normalized to sum 1.
const W0: f32 = 0.20416;
const W1: f32 = 0.18009;
const W2: f32 = 0.12388;
const W3: f32 = 0.06626;
const W4: f32 = 0.02763;

@fragment
fn fs_blur_h(in: VertexOutput) -> @location(0) vec4<f32> {
  let tx = 1.0 / f32(textureDimensions(src_tex).x);
  var c  = textureSample(src_tex, src_samp, in.uv).rgb * W0;
  c += textureSample(src_tex, src_samp, in.uv + vec2( tx, 0.0)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-tx, 0.0)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2( 2.0*tx, 0.0)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-2.0*tx, 0.0)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2( 3.0*tx, 0.0)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-3.0*tx, 0.0)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2( 4.0*tx, 0.0)).rgb * W4;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-4.0*tx, 0.0)).rgb * W4;
  return vec4<f32>(c, 1.0);
}

@fragment
fn fs_blur_v(in: VertexOutput) -> @location(0) vec4<f32> {
  let ty = 1.0 / f32(textureDimensions(src_tex).y);
  var c  = textureSample(src_tex, src_samp, in.uv).rgb * W0;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  ty)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -ty)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  2.0*ty)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -2.0*ty)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  3.0*ty)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -3.0*ty)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  4.0*ty)).rgb * W4;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -4.0*ty)).rgb * W4;
  return vec4<f32>(c, 1.0);
}
`,P=`// Bloom composite: adds the blurred bright regions back to the source HDR.

struct BloomUniforms {
  threshold: f32,
  knee     : f32,
  strength : f32,
  _pad     : f32,
}

@group(0) @binding(0) var<uniform> params   : BloomUniforms;
@group(0) @binding(1) var          hdr_tex  : texture_2d<f32>;
@group(0) @binding(2) var          bloom_tex: texture_2d<f32>;
@group(0) @binding(3) var          samp     : sampler;

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

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let hdr   = textureSample(hdr_tex,   samp, in.uv).rgb;
  // bloom_tex is half-res; bilinear upsample happens automatically
  let glow  = textureSample(bloom_tex, samp, in.uv).rgb;
  return vec4<f32>(hdr + glow * params.strength, 1.0);
}
`,G=`// Screen-Space Global Illumination — ray march pass.
// Cosine-weighted hemisphere rays in view space; hits sample previous frame's lit scene.

struct SSGIUniforms {
  view        : mat4x4<f32>,   // offset   0
  proj        : mat4x4<f32>,   // offset  64
  inv_proj    : mat4x4<f32>,   // offset 128
  invViewProj : mat4x4<f32>,   // offset 192
  prevViewProj: mat4x4<f32>,   // offset 256
  camPos      : vec3<f32>,     // offset 320
  numRays     : u32,           // offset 332
  numSteps    : u32,           // offset 336
  radius      : f32,           // offset 340
  thickness   : f32,           // offset 344
  strength    : f32,           // offset 348
  frameIndex  : u32,           // offset 352
}                              // stride 368 (padded to align 16)

@group(0) @binding(0) var<uniform> u: SSGIUniforms;

@group(1) @binding(0) var depth_tex    : texture_depth_2d;
@group(1) @binding(1) var normal_tex   : texture_2d<f32>;
@group(1) @binding(2) var prev_radiance: texture_2d<f32>;
@group(1) @binding(3) var noise_tex    : texture_2d<f32>;
@group(1) @binding(4) var lin_samp     : sampler;

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

fn view_pos_at(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let h   = u.inv_proj * ndc;
  return h.xyz / h.w;
}

@fragment
fn fs_ssgi(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);
  let depth = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) { return vec4<f32>(0.0); }

  let vp = view_pos_at(in.uv, depth);

  // World normal → view space
  let nm      = textureLoad(normal_tex, coord, 0);
  let N_world = normalize(nm.rgb * 2.0 - 1.0);
  let N_vs    = normalize((u.view * vec4<f32>(N_world, 0.0)).xyz);

  // Per-pixel TBN from tiled 4×4 noise (cos/sin rotation angle in rg)
  let noise_coord = coord % vec2<i32>(4, 4);
  let noise_val   = textureLoad(noise_tex, noise_coord, 0).rg;
  let cos_a = noise_val.x * 2.0 - 1.0;
  let sin_a = noise_val.y * 2.0 - 1.0;

  var up = vec3<f32>(0.0, 1.0, 0.0);
  if (abs(N_vs.y) > 0.99) { up = vec3<f32>(1.0, 0.0, 0.0); }
  let T_raw = normalize(cross(up, N_vs));
  let B_raw = cross(N_vs, T_raw);
  // Rotate tangent frame by per-pixel noise angle
  let T = cos_a * T_raw - sin_a * B_raw;
  let B = sin_a * T_raw + cos_a * B_raw;

  let screen_dim = vec2<f32>(textureDimensions(depth_tex));
  let screen_i   = vec2<i32>(screen_dim);
  var accum = vec3<f32>(0.0);
  let nr    = f32(u.numRays);
  let ns    = f32(u.numSteps);

  for (var i = 0u; i < u.numRays; i++) {
    // Cosine-weighted hemisphere with golden-ratio temporal jitter
    let phi       = 6.28318530 * fract(f32(i) / nr + f32(u.frameIndex) * 0.618033988);
    let ur        = fract(f32(u.frameIndex * u.numRays + i) * 0.381966011);
    let cos_theta = sqrt(ur);
    let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
    let ray_local = vec3<f32>(sin_theta * cos(phi), sin_theta * sin(phi), cos_theta);
    let ray_vs    = T * ray_local.x + B * ray_local.y + N_vs * ray_local.z;

    for (var s = 0u; s < u.numSteps; s++) {
      let t  = (f32(s) + 1.0) / ns;
      let p  = vp + ray_vs * (u.radius * t);
      if (p.z >= 0.0) { break; } // stepped behind the camera

      let clip  = u.proj * vec4<f32>(p, 1.0);
      let inv_w = 1.0 / clip.w;
      let ray_uv = vec2<f32>(
         clip.x * inv_w * 0.5 + 0.5,
        -clip.y * inv_w * 0.5 + 0.5,
      );
      if (any(ray_uv < vec2<f32>(0.0)) || any(ray_uv > vec2<f32>(1.0))) { break; }

      // Depth at ray UV (nearest texel to avoid sampler type restrictions)
      let ray_tc       = clamp(vec2<i32>(ray_uv * screen_dim), vec2<i32>(0), screen_i - vec2<i32>(1));
      let stored_depth = textureLoad(depth_tex, ray_tc, 0);
      if (stored_depth >= 1.0) { continue; } // hit sky — keep stepping

      let stored_h = u.inv_proj * vec4<f32>(ray_uv.x * 2.0 - 1.0, 1.0 - ray_uv.y * 2.0, stored_depth, 1.0);
      let stored_z = stored_h.z / stored_h.w;

      // View-space Z is negative in front; hit when ray just passed behind surface.
      if (p.z < stored_z && stored_z - p.z < u.thickness) {
        accum += textureSampleLevel(prev_radiance, lin_samp, ray_uv, 0.0).rgb;
        break;
      }
    }
  }

  return vec4<f32>(accum * u.strength / nr, 1.0);
}
`,C=`// Screen-Space Global Illumination — temporal accumulation pass.
// Reprojects SSGI into previous frame, AABB-clamps, blends 10% new / 90% history.

struct SSGIUniforms {
  view        : mat4x4<f32>,
  proj        : mat4x4<f32>,
  inv_proj    : mat4x4<f32>,
  invViewProj : mat4x4<f32>,
  prevViewProj: mat4x4<f32>,
  camPos      : vec3<f32>,
  numRays     : u32,
  numSteps    : u32,
  radius      : f32,
  thickness   : f32,
  strength    : f32,
  frameIndex  : u32,
}

@group(0) @binding(0) var<uniform> u: SSGIUniforms;

@group(1) @binding(0) var raw_ssgi    : texture_2d<f32>;
@group(1) @binding(1) var ssgi_history: texture_2d<f32>;
@group(1) @binding(2) var depth_tex   : texture_depth_2d;
@group(1) @binding(3) var lin_samp    : sampler;

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

@fragment
fn fs_temporal(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord   = vec2<i32>(in.clip_pos.xy);
  let current = textureLoad(raw_ssgi, coord, 0).rgb;

  // Sky pixels carry no indirect irradiance
  let depth = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) { return vec4<f32>(0.0); }

  // Reproject to previous frame
  let ndc       = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, depth, 1.0);
  let world_h   = u.invViewProj * ndc;
  let world_pos = world_h.xyz / world_h.w;
  let prev_clip = u.prevViewProj * vec4<f32>(world_pos, 1.0);
  let prev_uv   = vec2<f32>(
     prev_clip.x / prev_clip.w * 0.5 + 0.5,
    -prev_clip.y / prev_clip.w * 0.5 + 0.5,
  );

  // Disocclusion or out-of-frame: trust current sample fully
  if (any(prev_uv < vec2<f32>(0.0)) || any(prev_uv > vec2<f32>(1.0))) {
    return vec4<f32>(current, 1.0);
  }

  // AABB clamp: 3×3 neighbourhood min/max of raw SSGI prevents ghosting
  let dim = vec2<i32>(textureDimensions(raw_ssgi));
  var nb_min = vec3<f32>(1e9);
  var nb_max = vec3<f32>(-1e9);
  for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
      let nc = clamp(coord + vec2<i32>(dx, dy), vec2<i32>(0), dim - vec2<i32>(1));
      let s  = textureLoad(raw_ssgi, nc, 0).rgb;
      nb_min = min(nb_min, s);
      nb_max = max(nb_max, s);
    }
  }

  let history         = textureSampleLevel(ssgi_history, lin_samp, prev_uv, 0.0).rgb;
  let history_clamped = clamp(history, nb_min, nb_max);

  // 10% new / 90% history → effective ~40-sample average with 4 rays/frame
  return vec4<f32>(mix(history_clamped, current, 0.1), 1.0);
}
`,f=`
struct Particle {
  position : vec3<f32>,  // offset  0
  life     : f32,        // offset 12  (-1 = dead)
  velocity : vec3<f32>,  // offset 16
  max_life : f32,        // offset 28
  color    : vec4<f32>,  // offset 32
  size     : f32,        // offset 48
  rotation : f32,        // offset 52
  _pad     : vec2<f32>,  // offset 56
}                        // total: 64 bytes

struct ComputeUniforms {
  world_pos     : vec3<f32>,
  spawn_count   : u32,
  world_quat    : vec4<f32>,
  spawn_offset  : u32,
  max_particles : u32,
  frame_seed    : u32,
  _pad0         : u32,
  dt            : f32,
  time          : f32,
  _pad1         : vec2<f32>,
  spawn_color   : vec4<f32>,
}

fn pcg_hash(v: u32) -> u32 {
  let state = v * 747796405u + 2891336453u;
  let word  = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

fn rand_f32(seed: u32) -> f32 {
  return f32(pcg_hash(seed)) / 4294967295.0;
}

fn rand_range(lo: f32, hi: f32, seed: u32) -> f32 {
  return lo + rand_f32(seed) * (hi - lo);
}

fn quat_rotate(q: vec4<f32>, v: vec3<f32>) -> vec3<f32> {
  let t = 2.0 * cross(q.xyz, v);
  return v + q.w * t + cross(q.xyz, t);
}

// Uniform sample in a spherical cap of half-angle acos(cos_max) around +Y.
fn sample_cone(seed0: u32, seed1: u32, cos_max: f32) -> vec3<f32> {
  let cos_theta = mix(cos_max, 1.0, rand_f32(seed0));
  let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
  let phi       = rand_f32(seed1) * 6.28318530717958647;
  return vec3<f32>(sin_theta * cos(phi), cos_theta, sin_theta * sin(phi));
}

// 3-component gradient noise helpers for curl noise
fn hash3(p: vec3<f32>) -> vec3<f32> {
  var q = vec3<f32>(
    dot(p, vec3<f32>(127.1, 311.7, 74.7)),
    dot(p, vec3<f32>(269.5, 183.3, 246.1)),
    dot(p, vec3<f32>(113.5,  271.9, 124.6)),
  );
  return fract(sin(q) * 43758.5453123);
}

fn noise3(p: vec3<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(dot(hash3(i + vec3(0.,0.,0.)) * 2.0 - 1.0, f - vec3(0.,0.,0.)),
            dot(hash3(i + vec3(1.,0.,0.)) * 2.0 - 1.0, f - vec3(1.,0.,0.)), u.x),
        mix(dot(hash3(i + vec3(0.,1.,0.)) * 2.0 - 1.0, f - vec3(0.,1.,0.)),
            dot(hash3(i + vec3(1.,1.,0.)) * 2.0 - 1.0, f - vec3(1.,1.,0.)), u.x), u.y),
    mix(mix(dot(hash3(i + vec3(0.,0.,1.)) * 2.0 - 1.0, f - vec3(0.,0.,1.)),
            dot(hash3(i + vec3(1.,0.,1.)) * 2.0 - 1.0, f - vec3(1.,0.,1.)), u.x),
        mix(dot(hash3(i + vec3(0.,1.,1.)) * 2.0 - 1.0, f - vec3(0.,1.,1.)),
            dot(hash3(i + vec3(1.,1.,1.)) * 2.0 - 1.0, f - vec3(1.,1.,1.)), u.x), u.y), u.z);
}

fn curl_noise(p: vec3<f32>) -> vec3<f32> {
  let e  = 0.1;
  let ex = vec3<f32>(e,   0.0, 0.0);
  let ey = vec3<f32>(0.0, e,   0.0);
  let ez = vec3<f32>(0.0, 0.0, e  );
  // Three decorrelated potential fields: Fx=noise3(p), Fy=noise3(p+o1), Fz=noise3(p+o2)
  let o1 = vec3<f32>(31.416, 27.183, 14.142);
  let o2 = vec3<f32>(62.832, 54.366, 28.284);
  // curl(F).x = dFz/dy - dFy/dz
  let cx = (noise3(p + o2 + ey) - noise3(p + o2 - ey))
         - (noise3(p + o1 + ez) - noise3(p + o1 - ez));
  // curl(F).y = dFx/dz - dFz/dx
  let cy = (noise3(p + ez)      - noise3(p - ez))
         - (noise3(p + o2 + ex) - noise3(p + o2 - ex));
  // curl(F).z = dFy/dx - dFx/dy
  let cz = (noise3(p + o1 + ex) - noise3(p + o1 - ex))
         - (noise3(p + ey)      - noise3(p - ey));
  return vec3<f32>(cx, cy, cz) / (2.0 * e);
}

// FBM curl noise: sums octaves at increasing frequencies / decreasing amplitudes.
// Normalized so output magnitude matches single-octave curl_noise.
fn curl_noise_fbm(p: vec3<f32>, octaves: i32) -> vec3<f32> {
  var result    = vec3<f32>(0.0);
  var freq      = 1.0;
  var amp       = 0.5;
  var total_amp = 0.0;
  for (var o = 0; o < octaves; o++) {
    result    += curl_noise(p * freq) * amp;
    total_amp += amp;
    freq      *= 2.0;
    amp       *= 0.5;
  }
  return result / total_amp;
}
`;function B(n){switch(n.kind){case"sphere":{const e=Math.cos(n.solidAngle).toFixed(6),t=n.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${e});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${t};
  p.velocity = world_dir * speed;
}`}case"cone":{const e=Math.cos(n.angle).toFixed(6),t=n.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${e});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${t};
  p.velocity = world_dir * speed;
}`}case"box":{const[e,t,r]=n.halfExtents.map(i=>i.toFixed(6));return`{
  let local_off = vec3<f32>(
    (rand_f32(seed + 10u) * 2.0 - 1.0) * ${e},
    (rand_f32(seed + 11u) * 2.0 - 1.0) * ${t},
    (rand_f32(seed + 12u) * 2.0 - 1.0) * ${r},
  );
  let up = quat_rotate(uniforms.world_quat, vec3<f32>(0.0, 1.0, 0.0));
  p.position = uniforms.world_pos + quat_rotate(uniforms.world_quat, local_off);
  p.velocity = up * speed;
}`}}}function d(n){switch(n.type){case"gravity":return`p.velocity.y -= ${n.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${n.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[e,t,r]=n.direction.map(i=>i.toFixed(6));return`p.velocity += vec3<f32>(${e}, ${t}, ${r}) * ${n.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const e=n.speed.toFixed(6),t=n.strength.toFixed(6);return`{
  let swirl_angle = uniforms.time * ${e};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${t} * uniforms.dt;
}`}case"vortex":return`{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${n.strength.toFixed(6)} * uniforms.dt;
}`;case"curl_noise":{const e=n.octaves??1,t=e>1?`curl_noise_fbm(cn_pos, ${e})`:"curl_noise(cn_pos)";return`{
  let cn_pos = p.position * ${n.scale.toFixed(6)} + uniforms.time * ${n.timeScale.toFixed(6)};
  p.velocity += ${t} * ${n.strength.toFixed(6)} * uniforms.dt;
}`}case"size_random":return`p.size = rand_range(${n.min.toFixed(6)}, ${n.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;case"size_over_lifetime":return`p.size = mix(${n.start.toFixed(6)}, ${n.end.toFixed(6)}, t);`;case"color_over_lifetime":{const[e,t,r,i]=n.startColor.map(o=>o.toFixed(6)),[c,l,a,u]=n.endColor.map(o=>o.toFixed(6));return`p.color = mix(vec4<f32>(${e}, ${t}, ${r}, ${i}), vec4<f32>(${c}, ${l}, ${a}, ${u}), t);`}case"block_collision":return`{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`}}function v(n,e){return n?n.filter(t=>t.trigger===e).flatMap(t=>t.actions.map(d)).join(`
  `):""}function j(n){const{emitter:e,events:t}=n,[r,i]=e.lifetime.map(o=>o.toFixed(6)),[c,l]=e.initialSpeed.map(o=>o.toFixed(6)),[a,u]=e.initialSize.map(o=>o.toFixed(6));return`
${f}

@group(0) @binding(0) var<storage, read_write> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;
@group(1) @binding(0) var<uniform>             uniforms   : ComputeUniforms;

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= uniforms.spawn_count) { return; }

  let idx  = (uniforms.spawn_offset + gid.x) % uniforms.max_particles;
  // Use the globally unique cumulative spawn index as the seed so consecutive frames
  // never collide on gid.x + frame_seed = (gid.x+1) + (frame_seed-1).
  let seed = pcg_hash(uniforms.spawn_offset + gid.x);

  let speed = rand_range(${c}, ${l}, seed + 1u);

  var p: Particle;
  p.life     = 0.0;
  p.max_life = rand_range(${r}, ${i}, seed + 2u);
  p.color    = uniforms.spawn_color;
  p.size     = rand_range(${a}, ${u}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${B(e.shape)}

  ${v(t,"on_spawn")}

  particles[idx] = p;
}
`}function N(n){return n.modifiers.some(e=>e.type==="block_collision")}const O=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function I(n){const e=n.modifiers.some(i=>i.type==="block_collision"),t=n.modifiers.map(d).join(`
  `),r=v(n.events,"on_death");return`
${f}
${e?O:""}

@group(0) @binding(0) var<storage, read_write> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;
@group(1) @binding(0) var<uniform>             uniforms   : ComputeUniforms;

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= uniforms.max_particles) { return; }

  var p = particles[idx];
  if (p.life < 0.0) { return; }

  p.life += uniforms.dt;
  if (p.life >= p.max_life) {
    ${r}
    particles[idx].life = -1.0;
    return;
  }

  let t = p.life / p.max_life;

  ${t}

  p.position += p.velocity * uniforms.dt;
  particles[idx] = p;
}
`}const R=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.
// Two entry points used as two sequential dispatches within one compute pass:
//   cs_compact      — ceil(maxParticles/64) workgroups, fills alive_list
//   cs_write_indirect — 1 workgroup, copies alive_count → indirect.instanceCount

struct Particle {
  position : vec3<f32>,
  life     : f32,
  velocity : vec3<f32>,
  max_life : f32,
  color    : vec4<f32>,
  size     : f32,
  rotation : f32,
  _pad     : vec2<f32>,
}

struct CompactUniforms {
  max_particles: u32,
  _pad0        : u32,
  _pad1        : u32,
  _pad2        : u32,
}

@group(0) @binding(0) var<storage, read>       particles  : array<Particle>;
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;
@group(1) @binding(0) var<uniform>             uniforms   : CompactUniforms;

@compute @workgroup_size(64)
fn cs_compact(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= uniforms.max_particles) { return; }
  if (particles[idx].life < 0.0) { return; }
  let slot = atomicAdd(&counter, 1u);
  alive_list[slot] = idx;
}

@compute @workgroup_size(1)
fn cs_write_indirect() {
  // indirect layout: [vertexCount, instanceCount, firstVertex, firstInstance]
  indirect[1] = atomicLoad(&counter);
}
`,E=`// Particle GBuffer render pass — camera-facing billboard quads.
// Each instance reads one alive particle and writes to the deferred GBuffer.
// Normal is the billboard face direction (toward camera) for deferred lighting.

struct Particle {
  position : vec3<f32>,
  life     : f32,
  velocity : vec3<f32>,
  max_life : f32,
  color    : vec4<f32>,
  size     : f32,
  rotation : f32,
  _pad     : vec2<f32>,
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

struct ParticleRenderUniforms {
  roughness : f32,
  metallic  : f32,
  _pad      : vec2<f32>,
}

@group(0) @binding(0) var<storage, read> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read> alive_list : array<u32>;
@group(1) @binding(0) var<uniform>       camera     : CameraUniforms;
@group(2) @binding(0) var<uniform>       mat_params : ParticleRenderUniforms;

struct VertexOutput {
  @builtin(position) clip_pos  : vec4<f32>,
  @location(0)       color     : vec4<f32>,
  @location(1)       uv        : vec2<f32>,
  @location(2)       world_pos : vec3<f32>,
  @location(3)       face_norm : vec3<f32>,
}

// 2-triangle quad: 6 vertex positions in [-0.5, 0.5]²
fn quad_offset(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(-0.5, -0.5); }
    case 1u: { return vec2<f32>( 0.5, -0.5); }
    case 2u: { return vec2<f32>(-0.5,  0.5); }
    case 3u: { return vec2<f32>( 0.5, -0.5); }
    case 4u: { return vec2<f32>( 0.5,  0.5); }
    default: { return vec2<f32>(-0.5,  0.5); }
  }
}

fn quad_uv(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(0.0, 1.0); }
    case 1u: { return vec2<f32>(1.0, 1.0); }
    case 2u: { return vec2<f32>(0.0, 0.0); }
    case 3u: { return vec2<f32>(1.0, 1.0); }
    case 4u: { return vec2<f32>(1.0, 0.0); }
    default: { return vec2<f32>(0.0, 0.0); }
  }
}

@vertex
fn vs_main(
  @builtin(vertex_index)   vid: u32,
  @builtin(instance_index) iid: u32,
) -> VertexOutput {
  let p_idx = alive_list[iid];
  let p     = particles[p_idx];

  // Camera right and up from the view matrix rows (column-major storage)
  let cam_right = vec3<f32>(camera.view[0].x, camera.view[1].x, camera.view[2].x);
  let cam_up    = vec3<f32>(camera.view[0].y, camera.view[1].y, camera.view[2].y);

  // Rotate quad corner around particle center using particle.rotation angle
  let ofs    = quad_offset(vid);
  let c      = cos(p.rotation);
  let s      = sin(p.rotation);
  let rotated = vec2<f32>(c * ofs.x - s * ofs.y, s * ofs.x + c * ofs.y);

  let world_pos = p.position
    + cam_right * rotated.x * p.size
    + cam_up    * rotated.y * p.size;

  let face_norm = normalize(camera.position - p.position);

  var out: VertexOutput;
  out.clip_pos  = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color     = p.color;
  out.uv        = quad_uv(vid);
  out.world_pos = world_pos;
  out.face_norm = face_norm;
  return out;
}

struct GBufferOutput {
  @location(0) albedo_roughness : vec4<f32>,  // rgba8unorm
  @location(1) normal_metallic  : vec4<f32>,  // rgba16float
}

@fragment
fn fs_main(in: VertexOutput) -> GBufferOutput {
  // Circular clip for round particles
  let d = length(in.uv - 0.5) * 2.0;
  if (d > 1.0) { discard; }

  // Encode world-space normal as [0,1]
  let N = normalize(in.face_norm);

  var out: GBufferOutput;
  out.albedo_roughness = vec4<f32>(in.color.rgb, mat_params.roughness);
  out.normal_metallic  = vec4<f32>(N * 0.5 + 0.5, mat_params.metallic);
  return out;
}
`,T=`// Particle forward HDR render pass — velocity-aligned billboard quads.
// Writes directly to the HDR buffer with alpha blending.
// Used for transparent effects like rain, smoke, sparks.

struct Particle {
  position : vec3<f32>,
  life     : f32,
  velocity : vec3<f32>,
  max_life : f32,
  color    : vec4<f32>,
  size     : f32,
  rotation : f32,
  _pad     : vec2<f32>,
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

@group(0) @binding(0) var<storage, read> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read> alive_list : array<u32>;
@group(1) @binding(0) var<uniform>       camera     : CameraUniforms;

struct VertexOutput {
  @builtin(position) clip_pos : vec4<f32>,
  @location(0)       color    : vec4<f32>,
  @location(1)       uv       : vec2<f32>,
}

// Quad UV: x in [-0.5, 0.5], y in [-0.5, 0.5].
// y=−0.5 is the tail (toward velocity), y=+0.5 is the head.
fn quad_offset(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(-0.5, -0.5); }
    case 1u: { return vec2<f32>( 0.5, -0.5); }
    case 2u: { return vec2<f32>(-0.5,  0.5); }
    case 3u: { return vec2<f32>( 0.5, -0.5); }
    case 4u: { return vec2<f32>( 0.5,  0.5); }
    default: { return vec2<f32>(-0.5,  0.5); }
  }
}

fn quad_uv(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(0.0, 1.0); }
    case 1u: { return vec2<f32>(1.0, 1.0); }
    case 2u: { return vec2<f32>(0.0, 0.0); }
    case 3u: { return vec2<f32>(1.0, 1.0); }
    case 4u: { return vec2<f32>(1.0, 0.0); }
    default: { return vec2<f32>(0.0, 0.0); }
  }
}

@vertex
fn vs_main(
  @builtin(vertex_index)   vid: u32,
  @builtin(instance_index) iid: u32,
) -> VertexOutput {
  let p_idx = alive_list[iid];
  let p     = particles[p_idx];

  let ofs = quad_offset(vid);

  // Velocity-aligned billboard: long axis follows velocity direction.
  let vel     = p.velocity;
  let spd     = length(vel);
  let vel_dir = select(vec3<f32>(0.0, 1.0, 0.0), vel / max(spd, 0.001), spd > 0.001);
  let cam_dir = normalize(camera.position - p.position);
  // right is perpendicular to both velocity and cam direction
  let right   = normalize(cross(vel_dir, cam_dir));

  // Minimal stretch so each drop stays compact
  let stretch = 1.0 + spd * 0.04;

  let world_pos = p.position
    + right   * ofs.x * p.size
    + vel_dir * ofs.y * p.size * stretch;

  var out: VertexOutput;
  out.clip_pos = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color    = p.color;
  out.uv       = quad_uv(vid);
  return out;
}

const EMIT_SCALE: f32 = 4.0;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Fade alpha at the tips of the streak (uv.y near 0 or 1)
  let t = abs(in.uv.y * 2.0 - 1.0);
  let alpha = in.color.a * (1.0 - t * t);
  return vec4<f32>(in.color.rgb * EMIT_SCALE, alpha);
}

// ---- Camera-aligned billboard (snow, soft particles) ------------------------

@vertex
fn vs_camera(
  @builtin(vertex_index)   vid: u32,
  @builtin(instance_index) iid: u32,
) -> VertexOutput {
  let p_idx = alive_list[iid];
  let p     = particles[p_idx];

  let ofs = quad_offset(vid);

  // Extract world-space right and up from the view matrix rows.
  // Column-major mat4x4: view[col][row], so row 0 = right, row 1 = up.
  let right = vec3<f32>(camera.view[0][0], camera.view[1][0], camera.view[2][0]);
  let up    = vec3<f32>(camera.view[0][1], camera.view[1][1], camera.view[2][1]);

  let world_pos = p.position
    + right * ofs.x * p.size
    + up    * ofs.y * p.size;

  var out: VertexOutput;
  out.clip_pos = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color    = p.color;
  out.uv       = quad_uv(vid);
  return out;
}

@fragment
fn fs_snow(in: VertexOutput) -> @location(0) vec4<f32> {
  // Soft circular disc with radial falloff from center.
  let uv = in.uv * 2.0 - 1.0;
  let d2 = dot(uv, uv);
  if (d2 > 1.0) { discard; }
  let alpha = in.color.a * (1.0 - d2);
  return vec4<f32>(in.color.rgb * EMIT_SCALE, alpha);
}

// Hard square pixel — no radial falloff, no discard. Suits chunky debris that
// should read as a solid colored pixel rather than a soft glow. Skips
// EMIT_SCALE so the output matches the source color after tonemapping.
@fragment
fn fs_pixel(in: VertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(in.color.rgb, in.color.a);
}
`,D=`// Auto-exposure — two-pass histogram approach.
//
// cs_histogram : samples the HDR scene texture (every 4th pixel), bins each
//                pixel's log2-luminance into 64 workgroup-local bins, then
//                flushes to the global histogram atomically.
// cs_adapt     : reads the 64-bin histogram, computes a weighted average
//                log-luminance (skipping the darkest 5% and brightest 2% of
//                samples), derives the target linear exposure that maps the
//                average to 18% gray, then lerps the current exposure toward
//                that target with a time-constant controlled by adapt_speed.

const NUM_BINS      : u32 = 64u;
const LOG_LUM_MIN   : f32 = -10.0;   // log2 luminance range bottom (2^-10 ≈ 0.001)
const LOG_LUM_MAX   : f32 =   6.0;   // log2 luminance range top   (2^6  = 64)
const LOG_LUM_RANGE : f32 = 16.0;    // LOG_LUM_MAX - LOG_LUM_MIN
const GRAY_LOG2     : f32 = -2.474;  // log2(0.18) — target middle-grey point

struct AutoExposureParams {
  dt          : f32,
  adapt_speed : f32,   // EV/second rate constant (higher = faster adaptation)
  min_exposure: f32,   // minimum linear exposure multiplier
  max_exposure: f32,   // maximum linear exposure multiplier
  low_pct     : f32,   // fraction of darkest samples to ignore (default 0.05)
  high_pct    : f32,   // fraction of brightest samples to ignore (default 0.02)
  _pad        : vec2<f32>,
}

struct ExposureBuffer {
  value : f32,
  _pad0 : f32,
  _pad1 : f32,
  _pad2 : f32,
}

@group(0) @binding(0) var                        hdr_tex  : texture_2d<f32>;
@group(0) @binding(1) var<storage, read_write>   histogram: array<atomic<u32>>;  // 64 bins
@group(0) @binding(2) var<storage, read_write>   exposure : ExposureBuffer;
@group(0) @binding(3) var<uniform>               params   : AutoExposureParams;

// ---- Pass 1: Histogram ------------------------------------------------------

var<workgroup> wg_hist: array<atomic<u32>, 64>;

@compute @workgroup_size(8, 8)
fn cs_histogram(
  @builtin(global_invocation_id)    gid: vec3<u32>,
  @builtin(local_invocation_index)  lid: u32,
) {
  // wg_hist is zero-initialized per WGSL spec — no explicit clear needed.

  let size  = textureDimensions(hdr_tex);
  let coord = gid.xy * 4u;   // sample every 4th pixel in each dimension

  if (coord.x < size.x && coord.y < size.y) {
    let rgb = textureLoad(hdr_tex, vec2<i32>(coord), 0).rgb;
    let lum = dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
    if (lum > 1e-5) {
      let t   = clamp((log2(lum) - LOG_LUM_MIN) / LOG_LUM_RANGE, 0.0, 1.0);
      let bin = min(u32(t * f32(NUM_BINS)), NUM_BINS - 1u);
      atomicAdd(&wg_hist[bin], 1u);
    }
  }
  workgroupBarrier();

  // Each thread (lid 0-63) flushes one histogram bin to the global buffer.
  atomicAdd(&histogram[lid], atomicLoad(&wg_hist[lid]));
}

// ---- Pass 2: Adapt ----------------------------------------------------------

var<workgroup> wg_bins: array<u32, 64>;

@compute @workgroup_size(64)
fn cs_adapt(@builtin(local_invocation_index) lid: u32) {
  // Read and clear the global histogram for this frame.
  wg_bins[lid] = atomicExchange(&histogram[lid], 0u);
  workgroupBarrier();

  // Only thread 0 performs the sequential reduction.
  if (lid != 0u) { return; }

  var total = 0u;
  for (var i = 0u; i < NUM_BINS; i++) { total += wg_bins[i]; }
  if (total == 0u) { return; }

  // Skip the darkest low_pct and brightest high_pct samples.
  let low_cut  = u32(f32(total) * params.low_pct);
  let high_cut = total - u32(f32(total) * params.high_pct);

  var acc     = 0u;
  var sum_log = 0.0;
  var cnt     = 0u;
  for (var i = 0u; i < NUM_BINS; i++) {
    let b       = wg_bins[i];
    let b_start = acc;
    let b_end   = acc + b;
    acc = b_end;
    if (b_end > low_cut && b_start < high_cut) {
      let in_cnt  = min(b_end, high_cut) - max(b_start, low_cut);
      let log_lum = LOG_LUM_MIN + (f32(i) + 0.5) / f32(NUM_BINS) * LOG_LUM_RANGE;
      sum_log += log_lum * f32(in_cnt);
      cnt     += in_cnt;
    }
  }
  if (cnt == 0u) { return; }

  // target exposure = 0.18 / avg_lum  →  in log-space: GRAY_LOG2 - avg_log
  let avg_log    = sum_log / f32(cnt);
  let target_ev  = clamp(GRAY_LOG2 - avg_log,
                         log2(params.min_exposure),
                         log2(params.max_exposure));
  let target_exp = exp2(target_ev);

  // Exponential smoothing toward target.
  let blend = 1.0 - exp(-params.adapt_speed * params.dt);
  exposure.value = exposure.value + (target_exp - exposure.value) * blend;
}
`;class _{constructor(e,t,r,i,c,l,a){s(this,"colorAtlas");s(this,"normalAtlas");s(this,"merAtlas");s(this,"heightAtlas");s(this,"blockSize");s(this,"blockCount");s(this,"_atlasWidth");s(this,"_atlasHeight");this.colorAtlas=e,this.normalAtlas=t,this.merAtlas=r,this.heightAtlas=i,this.blockSize=c,this._atlasWidth=l,this._atlasHeight=a,this.blockCount=Math.floor(l/c)}static async load(e,t,r,i,c,l=16){async function a(S){const k=await(await fetch(S)).blob();return createImageBitmap(k,{colorSpaceConversion:"none"})}const[u,o,m,x]=await Promise.all([a(t),a(r),a(i),a(c)]),g=u.width,h=u.height,b=p.fromBitmap(e,u,{srgb:!0}),w=p.fromBitmap(e,o,{srgb:!1}),y=p.fromBitmap(e,m,{srgb:!1}),z=p.fromBitmap(e,x,{srgb:!1});return new _(b,w,y,z,l,g,h)}uvTransform(e){const t=this.blockSize/this._atlasWidth,r=this.blockSize/this._atlasHeight;return[e*t,0,t,r]}destroy(){this.colorAtlas.destroy(),this.normalAtlas.destroy(),this.merAtlas.destroy(),this.heightAtlas.destroy()}}export{_ as B,P as a,F as b,q as c,C as d,N as e,j as f,I as g,M as h,R as i,E as j,D as k,W as m,L as n,T as r,G as s};
