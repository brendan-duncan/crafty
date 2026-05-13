const PERM: array<i32, 256> = array<i32, 256>(
  151, 160, 137, 91, 90, 15,
  131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
  140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
  190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117,
  35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171,
  168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
  111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
  102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208,
  89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173,
  186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255,
  82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223,
  183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167,
  43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178,
  185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191,
  179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 180,
  199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138,
  236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
  61, 156, 181,
);

fn perm(i: i32) -> i32 {
  return PERM[(i & 255)];
}

fn fade(t: f32) -> f32 {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

fn grad(hash: i32, x: f32, y: f32, z: f32) -> f32 {
  let h = hash & 15;
  let u = select(x, y, h < 8);
  let v = select(select(y, x, h < 4), select(z, y, h == 12 || h == 14), h >= 8);
  return (select(-u, u, (h & 1) == 0)) + (select(-v, v, (h & 2) == 0));
}

fn perlin_noise_3d(p: vec3<f32>) -> f32 {
  let X = i32(floor(p.x)) & 255;
  let Y = i32(floor(p.y)) & 255;
  let Z = i32(floor(p.z)) & 255;
  let x = p.x - floor(p.x);
  let y = p.y - floor(p.y);
  let z = p.z - floor(p.z);
  let u = fade(x);
  let v = fade(y);
  let w = fade(z);

  let A = perm(X) + Y;
  let AA = perm(A) + Z;
  let AB = perm(A + 1) + Z;
  let B = perm(X + 1) + Y;
  let BA = perm(B) + Z;
  let BB = perm(B + 1) + Z;

  return mix(
    mix(
      mix(grad(perm(AA), x, y, z), grad(perm(BA), x - 1.0, y, z), u),
      mix(grad(perm(AB), x, y - 1.0, z), grad(perm(BB), x - 1.0, y - 1.0, z), u),
      v
    ),
    mix(
      mix(grad(perm(AA + 1), x, y, z - 1.0), grad(perm(BA + 1), x - 1.0, y, z - 1.0), u),
      mix(grad(perm(AB + 1), x, y - 1.0, z - 1.0), grad(perm(BB + 1), x - 1.0, y - 1.0, z - 1.0), u),
      v
    ),
    w
  );
}

fn perlin_fbm_3d(p: vec3<f32>, octaves: u32) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var frequency = 1.0;

  for (var i = 0u; i < octaves; i++) {
    value += amplitude * perlin_noise_3d(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return value;
}

struct DensityUniforms {
  grid_size       : vec3<u32>,
  _pad0           : u32,
  isolevel        : f32,
  _pad1           : vec3<f32>,
  grid_extent     : vec3<f32>,
  _pad2           : f32,
  grid_offset     : vec3<f32>,
  _pad3           : f32,

  noise_scale     : f32,
  noise_height    : f32,
  detail_scale    : f32,
  detail_strength : f32,
  _pad4           : vec4<f32>,

  brush_center    : vec3<f32>,
  _pad5           : f32,
  brush_radius    : f32,
  brush_strength  : f32,
  brush_enabled   : u32,
  _pad6           : u32,
};

@group(0) @binding(0) var<storage, read_write> density: array<f32>;
@group(0) @binding(1) var<uniform> uni: DensityUniforms;

fn density_index(p: vec3<u32>) -> u32 {
  return p.z * uni.grid_size.x * uni.grid_size.y +
         p.y * uni.grid_size.x +
         p.x;
}

fn sphere_sdf(p: vec3<f32>, center: vec3<f32>, radius: f32) -> f32 {
  return length(p - center) - radius;
}

@compute @workgroup_size(8, 4, 8)
fn cs_generate(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= uni.grid_size.x ||
      gid.y >= uni.grid_size.y ||
      gid.z >= uni.grid_size.z) {
    return;
  }

  let grid_cell_size = uni.grid_extent / vec3<f32>(uni.grid_size);
  let grid_origin = uni.grid_offset;
  let world_pos = vec3<f32>(gid) * grid_cell_size + grid_origin;

  let noise_pos = world_pos * uni.noise_scale;
  let base_noise = perlin_fbm_3d(noise_pos, 4u);

  let detail_pos = world_pos * uni.detail_scale;
  let detail_noise = perlin_fbm_3d(detail_pos, 2u);

  let height_val = world_pos.y - uni.noise_height * (0.5 + 0.5 * base_noise);
  let density_val = height_val + uni.detail_strength * detail_noise;

  let sphere_dist = sphere_sdf(world_pos, vec3<f32>(0.0, 2.0, 0.0), 5.0);
  let final_density = max(density_val, sphere_dist);

  let idx = density_index(gid);
  density[idx] = final_density;
}

@compute @workgroup_size(8, 4, 8)
fn cs_brush(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= uni.grid_size.x ||
      gid.y >= uni.grid_size.y ||
      gid.z >= uni.grid_size.z) {
    return;
  }

  if (uni.brush_enabled == 0u) {
    return;
  }

  let grid_cell_size = uni.grid_extent / vec3<f32>(uni.grid_size);
  let grid_origin = uni.grid_offset;
  let world_pos = vec3<f32>(gid) * grid_cell_size + grid_origin;

  let dist = length(world_pos - uni.brush_center);
  let idx = density_index(gid);

  if (dist < uni.brush_radius) {
    let t = 1.0 - dist / uni.brush_radius;
    density[idx] -= uni.brush_strength * t;
  }
}
