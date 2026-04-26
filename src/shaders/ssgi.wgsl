// Screen-Space Global Illumination — ray march pass.
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
