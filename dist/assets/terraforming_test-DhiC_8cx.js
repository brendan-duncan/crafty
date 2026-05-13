var Y=Object.defineProperty;var F=(c,h,n)=>h in c?Y(c,h,{enumerable:!0,configurable:!0,writable:!0,value:n}):c[h]=n;var o=(c,h,n)=>F(c,typeof h!="symbol"?h+"":h,n);import{R as W,V as B,a as X,M as N}from"./render_pass-Cg-XJLDQ.js";const H=`const PERM: array<i32, 256> = array<i32, 256>(
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
`,Z=`const CORNERS: array<vec3<f32>, 8> = array<vec3<f32>, 8>(
  vec3<f32>(0.0, 0.0, 0.0),
  vec3<f32>(1.0, 0.0, 0.0),
  vec3<f32>(1.0, 0.0, 1.0),
  vec3<f32>(0.0, 0.0, 1.0),
  vec3<f32>(0.0, 1.0, 0.0),
  vec3<f32>(1.0, 1.0, 0.0),
  vec3<f32>(1.0, 1.0, 1.0),
  vec3<f32>(0.0, 1.0, 1.0),
);

const CORNER_INDEX_FROM_EDGE: array<vec2<i32>, 12> = array<vec2<i32>, 12>(
  vec2<i32>(0, 1),
  vec2<i32>(1, 2),
  vec2<i32>(2, 3),
  vec2<i32>(3, 0),
  vec2<i32>(4, 5),
  vec2<i32>(5, 6),
  vec2<i32>(6, 7),
  vec2<i32>(7, 4),
  vec2<i32>(0, 4),
  vec2<i32>(1, 5),
  vec2<i32>(2, 6),
  vec2<i32>(3, 7),
);

fn interp(a: f32, b: f32, iso: f32) -> f32 {
  let eps = 0.0001;
  if (abs(iso - b) < eps) {
    return 0.5;
  }
  if (abs(iso - a) < eps) {
    return 0.0;
  }
  return (iso - a) / (b - a);
}

struct McUniforms {
  grid_size        : vec3<u32>,
  _pad0            : u32,
  isolevel         : f32,
  _pad1            : vec3<f32>,
  grid_extent      : vec3<f32>,
  _pad2            : f32,
  grid_offset      : vec3<f32>,
  _pad3            : f32,
};

struct Vertex {
  pos: vec3<f32>,
  norm: vec3<f32>,
};

@group(0) @binding(0) var<storage, read> density: array<f32>;
@group(0) @binding(1) var<storage, read_write> vertices: array<Vertex>;
@group(0) @binding(2) var<storage, read_write> vertex_counter: atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect_args: array<u32>;
@group(0) @binding(4) var<uniform> uni: McUniforms;
@group(0) @binding(5) var<storage, read> edge_table: array<u32>;
@group(0) @binding(6) var<storage, read> tri_table: array<array<i32, 16>, 256>;

fn density_index(p: vec3<u32>) -> u32 {
  return p.z * uni.grid_size.x * uni.grid_size.y +
         p.y * uni.grid_size.x +
         p.x;
}

@compute @workgroup_size(8, 4, 8)
fn cs_march(@builtin(global_invocation_id) gid: vec3<u32>) {
  let cell_count = uni.grid_size - vec3<u32>(1u);

  if (gid.x >= cell_count.x ||
      gid.y >= cell_count.y ||
      gid.z >= cell_count.z) {
    return;
  }

  var density_vals: array<f32, 8>;
  var cube_idx: u32 = 0u;

  for (var i = 0u; i < 8u; i++) {
    let corner_pos = gid + vec3<u32>(CORNERS[i]);
    let dens_idx = density_index(corner_pos);
    density_vals[i] = density[dens_idx];
    if (density_vals[i] < uni.isolevel) {
      cube_idx |= (1u << i);
    }
  }

  let flags = edge_table[cube_idx];
  if (flags == 0u) {
    return;
  }

  var edge_verts: array<vec3<f32>, 12>;

  for (var i = 0u; i < 12u; i++) {
    if ((flags & (1u << i)) != 0u) {
      let edge = CORNER_INDEX_FROM_EDGE[i];
      let idx0 = u32(edge[0]);
      let idx1 = u32(edge[1]);
      let d0 = density_vals[idx0];
      let d1 = density_vals[idx1];
      let t = interp(d0, d1, uni.isolevel);
      let p0 = CORNERS[idx0];
      let p1 = CORNERS[idx1];
      edge_verts[i] = p0 + t * (p1 - p0);
    }
  }

  let tris = tri_table[cube_idx];

  let grid_cell_size = uni.grid_extent / vec3<f32>(uni.grid_size - vec3<u32>(1u));
  let grid_origin = uni.grid_offset;

  for (var i = 0; i < 16; i += 3) {
    if (tris[i] < 0) {
      break;
    }

    var tri_verts: array<vec3<f32>, 3>;

    for (var j = 0; j < 3; j++) {
      let edge_idx = u32(tris[i + j]);
      let ev = edge_verts[edge_idx];
      let grid_pos = vec3<f32>(gid) + ev;
      let world_pos = grid_pos * grid_cell_size + grid_origin;

      tri_verts[j] = world_pos;
    }

    var e0 = tri_verts[1] - tri_verts[0];
    var e1 = tri_verts[2] - tri_verts[0];
    var n = cross(e0, e1);
    var len2 = dot(n, n);
    var norm = vec3<f32>(0.0, 1.0, 0.0);
    if (len2 > 1e-12) {
      norm = n / sqrt(len2);
    }

    let slot = atomicAdd(&vertex_counter, 3u);

    for (var j = 0u; j < 3u; j++) {
      let vert_idx = slot + j;
      vertices[vert_idx].pos = tri_verts[j];
      vertices[vert_idx].norm = norm;
    }
  }
}

@compute @workgroup_size(1)
fn cs_write_indirect() {
  let count = atomicLoad(&vertex_counter);
  indirect_args[0] = count;
  indirect_args[1] = 1u;
  indirect_args[2] = 0u;
  indirect_args[3] = 0u;
}
`,Q=`struct McVertex {
  pos: vec3<f32>,
  norm: vec3<f32>,
};

struct VertexOutput {
  @builtin(position) fragPos: vec4<f32>,
  @location(0) worldPos: vec3<f32>,
  @location(1) normal: vec3<f32>,
};

@group(0) @binding(0) var<uniform> renderUni: RenderUniforms;
@group(0) @binding(1) var<storage, read> vertices: array<McVertex>;

struct RenderUniforms {
  view: mat4x4<f32>,
  proj: mat4x4<f32>,
  viewProj: mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  camPos: vec3<f32>,
  near: f32,
  far: f32,
  _pad0: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) idx: u32) -> VertexOutput {
  let v = vertices[idx];
  var out: VertexOutput;
  out.worldPos = v.pos;
  out.normal = v.norm;
  out.fragPos = renderUni.viewProj * vec4<f32>(v.pos, 1.0);
  return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let lightDir = normalize(vec3<f32>(0.5, 1.0, 0.3));
  let lightColor = vec3<f32>(1.0, 0.95, 0.9);
  let ambientColor = vec3<f32>(0.2, 0.25, 0.3);

  let baseColor = vec3<f32>(0.42, 0.35, 0.28);

  var n = normalize(in.normal);
  let ndotl = max(0.0, dot(n, lightDir));
  
  let diffuse = ndotl * lightColor;
  let specPower = 16.0;
  let viewDir = normalize(renderUni.camPos - in.worldPos);
  let halfDir = normalize(lightDir + viewDir);
  let spec = pow(max(0.0, dot(n, halfDir)), specPower) * 0.5;

  let finalColor = baseColor * (ambientColor + diffuse) + vec3<f32>(spec);
  return vec4<f32>(finalColor, 1.0);
}
`,$=[0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,451,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,451,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,1797,2060,1804,1541,1295,1030,778,515,265,0],J=[[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,2,10,9,0,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1],[3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1],[3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1],[3,10,1,9,8,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1],[9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1],[2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1],[8,4,7,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[11,4,7,11,0,4,11,2,0,-1,-1,-1,-1,-1,-1,-1],[9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1],[4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1],[3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1],[1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1],[4,7,8,9,0,2,10,2,0,-1,-1,-1,-1,-1,-1,-1],[4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1],[9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1],[1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1],[5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1],[2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1],[9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1],[0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1],[2,1,5,2,8,1,2,5,4,8,11,1,-1,-1,-1,-1],[9,5,4,10,1,10,11,10,3,-1,-1,-1,-1,-1,-1,-1],[4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1],[5,4,0,5,0,10,5,10,1,10,0,2,-1,-1,-1,-1],[11,10,4,11,4,8,10,5,4,8,4,1,-1,-1,-1,-1],[9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1],[0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1],[1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1],[1,2,10,0,8,3,5,7,9,-1,-1,-1,-1,-1,-1,-1],[9,7,8,9,5,7,2,0,9,2,9,10,-1,-1,-1,-1],[2,10,5,2,9,5,2,7,9,2,3,7,-1,-1,-1,-1],[8,2,3,8,7,2,8,5,7,9,7,5,-1,-1,-1,-1],[9,5,2,9,2,0,5,7,2,3,2,7,-1,-1,-1,-1],[0,7,8,0,5,7,0,1,5,2,3,11,-1,-1,-1,-1],[3,11,2,7,11,3,7,3,5,7,5,1,-1,-1,-1,-1],[10,7,8,10,3,7,10,1,3,5,7,9,-1,-1,-1,-1],[10,7,8,10,3,7,10,1,3,9,1,5,-1,-1,-1,-1],[8,0,5,8,5,7,10,1,2,10,2,0,-1,-1,-1,-1],[2,3,7,2,7,10,3,5,7,7,9,1,-1,-1,-1,-1],[11,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,5,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,9,0,5,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,8,3,1,9,8,5,11,6,-1,-1,-1,-1,-1,-1,-1],[1,2,10,11,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,0,8,1,2,10,5,11,6,-1,-1,-1,-1,-1,-1,-1],[9,2,10,9,0,2,5,11,6,-1,-1,-1,-1,-1,-1,-1],[2,10,9,2,9,3,2,3,8,5,11,6,-1,-1,-1,-1],[6,3,11,6,5,3,0,8,3,-1,-1,-1,-1,-1,-1,-1],[6,5,11,0,8,11,0,11,5,0,5,9,-1,-1,-1,-1],[3,11,6,3,0,11,0,1,11,-1,-1,-1,-1,-1,-1,-1],[6,5,11,6,11,1,1,11,9,-1,-1,-1,-1,-1,-1,-1],[6,3,10,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1],[0,8,11,0,11,5,0,5,1,5,11,10,-1,-1,-1,-1],[3,10,1,3,5,10,5,6,10,-1,-1,-1,-1,-1,-1,-1],[6,5,10,6,10,1,5,8,10,1,10,0,-1,-1,-1,-1],[5,8,4,5,11,8,11,6,8,-1,-1,-1,-1,-1,-1,-1],[4,5,8,4,3,5,3,11,5,3,6,11,-1,-1,-1,-1],[5,11,8,5,6,11,1,9,0,4,8,0,-1,-1,-1,-1],[11,6,5,11,5,1,11,1,7,7,1,9,-1,-1,-1,-1],[1,2,10,4,8,5,4,5,11,5,8,6,-1,-1,-1,-1],[10,1,2,10,3,1,8,5,11,8,4,5,-1,-1,-1,-1],[9,2,10,9,0,2,5,11,8,5,8,4,-1,-1,-1,-1],[9,3,1,9,6,3,9,5,6,7,3,6,-1,-1,-1,-1],[6,8,3,6,5,8,5,4,8,-1,-1,-1,-1,-1,-1,-1],[8,6,5,8,5,4,9,2,0,2,10,0,-1,-1,-1,-1],[6,3,11,6,5,3,8,4,0,8,0,1,-1,-1,-1,-1],[9,1,7,9,6,1,9,5,6,7,6,4,-1,-1,-1,-1],[4,5,8,8,5,6,10,1,2,10,2,3,-1,-1,-1,-1],[4,8,6,4,6,5,10,3,1,3,10,9,-1,-1,-1,-1],[6,5,8,6,8,3,2,0,10,0,9,10,-1,-1,-1,-1],[6,5,9,6,9,4,4,9,1,-1,-1,-1,-1,-1,-1,-1],[4,9,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,11,2,4,9,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,9,5,0,1,2,2,11,2,-1,-1,-1,-1,-1,-1,-1],[5,1,9,5,8,1,5,6,8,11,8,6,-1,-1,-1,-1],[2,1,5,2,5,3,1,8,5,5,6,8,-1,-1,-1,-1],[0,9,1,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,6,11,3,5,6,5,1,6,-1,-1,-1,-1,-1,-1,-1],[11,6,5,10,1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[6,11,5,2,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,6,11,5,0,8,3,-1,-1,-1,-1,-1,-1,-1],[6,11,5,3,0,8,1,2,10,-1,-1,-1,-1,-1,-1,-1],[2,3,5,2,5,10,3,6,5,5,8,0,-1,-1,-1,-1],[1,2,10,9,3,6,3,5,6,3,4,5,-1,-1,-1,-1],[0,8,3,11,6,5,10,1,2,9,1,0,-1,-1,-1,-1],[9,1,0,10,3,5,3,11,5,3,6,11,-1,-1,-1,-1],[7,6,11,7,10,6,10,2,6,-1,-1,-1,-1,-1,-1,-1],[3,0,8,11,7,10,11,10,2,10,7,6,-1,-1,-1,-1],[0,1,9,10,2,6,10,6,7,6,2,11,-1,-1,-1,-1],[7,6,11,7,10,6,12,8,3,8,9,3,-1,-1,-1,-1],[6,7,10,6,10,2,7,8,10,8,1,10,-1,-1,-1,-1],[3,0,8,10,2,7,2,6,7,2,10,6,-1,-1,-1,-1],[7,6,10,7,10,2,8,1,9,8,0,1,-1,-1,-1,-1],[7,6,10,7,10,2,9,3,8,3,4,8,-1,-1,-1,-1],[2,6,11,2,5,6,2,1,5,4,7,8,-1,-1,-1,-1],[3,6,11,0,8,7,2,5,6,2,1,5,-1,-1,-1,-1],[1,5,2,5,6,2,5,4,6,7,6,4,-1,-1,-1,-1],[3,6,11,3,5,6,3,8,5,4,8,5,-1,-1,-1,-1],[8,1,10,8,10,7,8,7,4,10,2,7,-1,-1,-1,-1],[9,0,1,10,2,7,2,6,7,2,10,6,-1,-1,-1,-1],[10,2,7,10,7,6,2,0,7,7,4,0,-1,-1,-1,-1],[7,2,6,7,6,10,2,3,6,6,8,3,-1,-1,-1,-1],[2,6,11,3,6,2,3,8,6,3,4,8,9,1,0,-1],[4,8,6,4,6,5,6,8,3,6,3,11,10,2,1,-1],[9,1,0,11,7,10,7,6,10,7,4,6,-1,-1,-1,-1],[10,2,1,10,7,2,6,11,7,3,8,4,-1,-1,-1,-1],[7,2,6,7,6,11,2,0,6,6,8,0,5,4,9,-1],[3,6,11,5,6,3,5,4,6,9,1,0,-1,-1,-1,-1],[6,11,5,11,7,5,1,9,0,4,8,0,-1,-1,-1,-1],[10,2,1,10,7,2,11,7,10,6,3,5,-1,-1,-1,-1],[7,6,11,7,10,6,12,8,3,8,9,3,5,4,9,-1],[6,7,10,6,10,2,8,3,10,8,10,9,8,9,4,-1],[10,2,6,10,6,7,9,0,5,9,5,4,-1,-1,-1,-1],[3,6,11,5,6,3,0,9,4,0,8,9,-1,-1,-1,-1],[11,6,5,8,3,10,3,2,10,3,9,2,-1,-1,-1,-1],[5,4,9,6,11,5,10,2,6,2,3,6,-1,-1,-1,-1],[0,8,3,5,4,9,10,2,11,10,11,6,-1,-1,-1,-1],[9,1,0,6,11,5,11,2,5,11,10,2,-1,-1,-1,-1],[4,5,8,4,8,3,5,6,8,5,11,6,1,2,10,-1],[1,2,10,3,6,11,3,5,6,3,4,5,-1,-1,-1,-1],[0,9,1,5,6,11,5,8,6,5,11,2,-1,-1,-1,-1],[6,11,5,6,5,2,2,5,3,-1,-1,-1,-1,-1,-1,-1],[11,5,6,11,6,10,10,6,2,-1,-1,-1,-1,-1,-1,-1],[3,6,11,3,5,6,2,3,5,2,5,0,-1,-1,-1,-1],[0,9,1,5,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,7,6,1,6,10,6,7,11,-1,-1,-1,-1,-1,-1,-1],[0,8,3,1,7,10,1,10,6,7,11,6,-1,-1,-1,-1],[10,6,1,10,1,9,11,6,7,-1,-1,-1,-1,-1,-1,-1],[7,1,6,7,11,1,3,8,9,8,1,9,-1,-1,-1,-1],[1,2,10,1,10,4,1,4,7,7,4,6,-1,-1,-1,-1],[6,1,10,6,7,1,0,8,3,2,10,3,-1,-1,-1,-1],[7,1,9,7,6,1,3,0,8,3,8,2,-1,-1,-1,-1],[3,8,2,3,1,8,1,7,8,7,6,4,-1,-1,-1,-1],[2,4,7,2,7,10,4,1,7,7,9,1,-1,-1,-1,-1],[6,1,10,6,7,1,4,7,9,0,8,3,-1,-1,-1,-1],[1,9,3,1,3,2,3,9,7,7,9,4,-1,-1,-1,-1],[4,7,3,4,3,9,7,6,3,3,8,2,-1,-1,-1,-1],[2,11,10,4,7,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,3,0,8,11,10,2,4,7,1,-1,-1,-1,-1],[11,10,2,11,2,4,11,4,7,9,0,1,-1,-1,-1,-1],[8,2,4,8,4,9,2,11,4,7,4,1,-1,-1,-1,-1],[10,4,7,10,2,4,2,3,4,-1,-1,-1,-1,-1,-1,-1],[1,10,2,0,8,3,4,7,10,4,10,2,-1,-1,-1,-1],[4,7,10,4,10,2,9,0,2,2,10,0,-1,-1,-1,-1],[9,4,7,9,7,2,3,7,2,2,8,7,-1,-1,-1,-1],[2,11,10,3,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,8,3,4,8,4,7,11,10,2,-1,-1,-1,-1],[9,0,1,11,10,3,10,7,3,10,4,7,-1,-1,-1,-1],[10,3,11,10,7,3,8,4,7,7,9,1,-1,-1,-1,-1],[7,2,3,7,10,2,7,4,10,4,5,10,-1,-1,-1,-1],[1,10,8,1,8,0,10,2,8,4,8,5,-1,-1,-1,-1],[0,2,10,0,10,9,2,3,10,4,10,5,-1,-1,-1,-1],[10,3,8,10,8,4,3,7,8,5,4,9,-1,-1,-1,-1],[11,5,10,11,7,5,7,3,5,-1,-1,-1,-1,-1,-1,-1],[0,8,3,5,10,11,5,7,10,7,6,10,-1,-1,-1,-1],[1,9,0,5,10,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,8,3,1,9,8,10,11,5,-1,-1,-1,-1,-1,-1,-1],[11,1,10,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,1,10,11,1,7,10,7,6,10,-1,-1,-1,-1],[9,7,5,9,2,7,7,2,6,-1,-1,-1,-1,-1,-1,-1],[7,5,9,7,9,3,5,6,9,3,8,9,-1,-1,-1,-1],[2,6,11,2,1,6,1,5,6,-1,-1,-1,-1,-1,-1,-1],[1,6,11,1,5,6,3,0,8,-1,-1,-1,-1,-1,-1,-1],[0,2,9,2,6,9,2,11,6,-1,-1,-1,-1,-1,-1,-1],[6,11,2,6,2,8,8,2,3,-1,-1,-1,-1,-1,-1,-1],[6,11,1,6,1,10,10,1,2,-1,-1,-1,-1,-1,-1,-1],[1,10,2,0,8,6,8,11,6,-1,-1,-1,-1,-1,-1,-1],[10,2,6,10,6,11,0,9,6,9,5,6,-1,-1,-1,-1],[6,11,3,6,3,10,5,6,9,6,8,3,-1,-1,-1,-1],[5,8,4,5,2,8,5,10,2,11,8,2,-1,-1,-1,-1],[5,0,4,5,11,0,5,10,11,11,2,0,-1,-1,-1,-1],[2,8,5,2,5,10,8,4,5,9,5,0,-1,-1,-1,-1],[9,5,0,10,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[6,11,3,10,3,11,4,8,5,-1,-1,-1,-1,-1,-1,-1],[5,10,11,5,11,4,11,6,4,0,8,1,-1,-1,-1,-1],[10,11,5,11,6,5,11,7,6,8,3,4,-1,-1,-1,-1],[5,2,10,5,8,2,5,4,8,11,6,3,-1,-1,-1,-1],[11,6,5,11,5,2,2,5,1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,11,6,5,11,5,2,5,1,2,-1,-1,-1,-1],[9,6,5,9,3,6,9,0,3,-1,-1,-1,-1,-1,-1,-1],[6,5,9,6,9,3,8,3,9,-1,-1,-1,-1,-1,-1,-1],[5,1,2,5,6,1,6,11,1,-1,-1,-1,-1,-1,-1,-1],[1,2,5,8,3,6,3,11,6,-1,-1,-1,-1,-1,-1,-1],[0,9,2,2,9,5,2,5,11,-1,-1,-1,-1,-1,-1,-1],[3,8,2,8,5,2,8,11,5,-1,-1,-1,-1,-1,-1,-1],[5,1,10,1,7,10,1,9,7,-1,-1,-1,-1,-1,-1,-1],[10,1,7,10,7,3,1,9,7,0,8,3,-1,-1,-1,-1],[9,7,1,9,1,0,7,6,1,2,10,1,-1,-1,-1,-1],[7,6,1,7,1,10,6,3,1,2,1,8,-1,-1,-1,-1],[1,10,2,8,1,2,8,4,1,8,7,4,-1,-1,-1,-1],[3,0,8,1,2,10,4,7,1,7,10,1,-1,-1,-1,-1],[10,2,1,10,1,4,4,1,9,-1,-1,-1,-1,-1,-1,-1],[8,2,3,4,1,10,4,7,1,-1,-1,-1,-1,-1,-1,-1],[10,4,7,10,2,4,11,2,10,7,5,4,-1,-1,-1,-1],[0,8,3,4,7,10,11,2,10,7,10,4,-1,-1,-1,-1],[1,9,0,10,2,11,10,7,2,7,4,2,-1,-1,-1,-1],[8,2,3,8,1,2,4,7,10,4,10,11,-1,-1,-1,-1],[2,4,7,2,11,4,11,3,4,-1,-1,-1,-1,-1,-1,-1],[8,1,2,8,0,1,4,7,11,4,11,3,-1,-1,-1,-1],[11,4,7,11,7,2,2,7,9,9,7,1,-1,-1,-1,-1],[11,4,7,11,7,2,8,3,7,3,2,7,-1,-1,-1,-1],[4,7,11,9,4,11,9,11,2,9,2,0,-1,-1,-1,-1],[3,8,7,8,11,7,8,1,11,10,11,2,-1,-1,-1,-1],[0,8,2,2,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[11,7,10,7,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,10,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,10,7,0,1,10,1,9,10,-1,-1,-1,-1,-1,-1,-1],[3,8,4,3,4,10,1,10,4,-1,-1,-1,-1,-1,-1,-1],[1,10,0,10,4,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,3,4,8,4,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[10,4,7,10,2,4,2,9,4,-1,-1,-1,-1,-1,-1,-1],[9,2,4,9,4,0,2,3,4,-1,-1,-1,-1,-1,-1,-1],[4,10,2,10,8,2,8,7,2,-1,-1,-1,-1,-1,-1,-1],[0,8,2,4,10,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,9,1,2,4,9,4,10,9,7,9,8,-1,-1,-1,-1],[2,3,8,2,8,4,4,8,10,-1,-1,-1,-1,-1,-1,-1],[10,7,4,10,4,2,2,4,1,-1,-1,-1,-1,-1,-1,-1],[9,1,0,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,3,8,1,2,8,1,8,0,4,8,7,-1,-1,-1,-1],[7,2,4,7,4,10,2,3,4,1,4,0,-1,-1,-1,-1],[7,2,4,7,4,10,9,1,4,1,10,4,-1,-1,-1,-1],[8,7,4,8,4,2,2,4,1,-1,-1,-1,-1,-1,-1,-1],[2,9,1,2,4,9,4,8,9,-1,-1,-1,-1,-1,-1,-1],[4,8,2,4,2,10,8,1,2,-1,-1,-1,-1,-1,-1,-1],[10,4,2,10,2,9,9,2,1,-1,-1,-1,-1,-1,-1,-1],[9,1,0,3,8,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,8,4,1,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,3,8,2,8,10,10,8,7,-1,-1,-1,-1,-1,-1,-1],[9,1,0,10,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,10,2,7,7,2,3,-1,-1,-1,-1,-1,-1,-1],[9,1,0,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[7,1,8,1,7,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[10,2,1,10,1,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[7,1,8,7,10,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,8,7,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,7,1,8,1,3,3,1,2,-1,-1,-1,-1,-1,-1,-1],[10,2,1,10,1,7,9,0,1,-1,-1,-1,-1,-1,-1,-1],[10,2,1,7,3,10,7,8,3,-1,-1,-1,-1,-1,-1,-1],[7,3,10,7,8,3,9,0,3,-1,-1,-1,-1,-1,-1,-1],[7,8,3,7,10,8,10,2,8,2,1,8,-1,-1,-1,-1],[10,2,1,10,1,9,10,9,3,3,9,0,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]],K={gridSize:[32,24,32],gridExtent:[32,24,32],gridOffset:[-16,-8,-16],isolevel:0,noiseScale:.08,noiseHeight:10,detailScale:.3,detailStrength:1,maxVertices:128*1024};class k extends X{constructor(n,l,t,s,r,e,p,f,d,a,g,m,x,w,u,M,v,y,U,i){super();o(this,"name","MarchingCubesPass");o(this,"_config");o(this,"_colorView");o(this,"_depthView");o(this,"_densityBuffer");o(this,"_vertexBuffer");o(this,"_vertexCounter");o(this,"_indirectBuffer");o(this,"_edgeTableBuffer");o(this,"_triTableBuffer");o(this,"_densityUniforms");o(this,"_mcUniforms");o(this,"_renderUniforms");o(this,"_densityPipeline");o(this,"_brushPipeline");o(this,"_marchPipeline");o(this,"_indirectPipeline");o(this,"_renderPipeline");o(this,"_densityBG");o(this,"_marchBG");o(this,"_renderBG");o(this,"_brush",{enabled:!1,center:new B,radius:2,strength:.2});o(this,"_zeroU32",new Uint32Array([0]));o(this,"_densityUniBuf",new Float32Array(64));this._config=n,this._colorView=l,this._depthView=t,this._densityBuffer=s,this._vertexBuffer=r,this._vertexCounter=e,this._indirectBuffer=p,this._edgeTableBuffer=f,this._triTableBuffer=d,this._densityUniforms=a,this._mcUniforms=g,this._renderUniforms=m,this._densityPipeline=x,this._brushPipeline=w,this._marchPipeline=u,this._indirectPipeline=M,this._renderPipeline=v,this._densityBG=y,this._marchBG=U,this._renderBG=i}static create(n,l,t,s={}){const r={...K,...s},{device:e}=n,p=r.gridSize[0]*r.gridSize[1]*r.gridSize[2],f=e.createBuffer({label:"McDensityBuffer",size:p*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=e.createBuffer({label:"McVertexBuffer",size:r.maxVertices*24,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.VERTEX}),a=e.createBuffer({label:"McVertexCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(a,0,new Uint32Array([0]));const g=e.createBuffer({label:"McIndirectBuffer",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(g,0,new Uint32Array([0,1,0,0]));const m=new Uint32Array($),x=e.createBuffer({label:"McEdgeTable",size:m.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(x,0,m);const w=new Int32Array(256*16);for(let A=0;A<256;A++)for(let O=0;O<16;O++)w[A*16+O]=J[A][O];const u=e.createBuffer({label:"McTriTable",size:w.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(u,0,w);const M=e.createBuffer({label:"McDensityUniforms",size:256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),v=e.createBuffer({label:"McMarchUniforms",size:256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),y=e.createBuffer({label:"McRenderUniforms",size:512,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),U=e.createBindGroupLayout({label:"McDensityBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),i=e.createBindGroupLayout({label:"McMarchBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:6,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}}]}),b=e.createBindGroupLayout({label:"McRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),P=e.createShaderModule({label:"McDensityShader",code:H}),z=e.createShaderModule({label:"McMarchShader",code:Z}),G=e.createShaderModule({label:"McRenderShader",code:Q}),S=e.createPipelineLayout({bindGroupLayouts:[U]}),E=e.createPipelineLayout({bindGroupLayouts:[i]}),T=e.createPipelineLayout({bindGroupLayouts:[b]}),C=e.createComputePipeline({label:"McDensityPipeline",layout:S,compute:{module:P,entryPoint:"cs_generate"}}),D=e.createComputePipeline({label:"McBrushPipeline",layout:S,compute:{module:P,entryPoint:"cs_brush"}}),I=e.createComputePipeline({label:"McMarchPipeline",layout:E,compute:{module:z,entryPoint:"cs_march"}}),V=e.createComputePipeline({label:"McIndirectPipeline",layout:E,compute:{module:z,entryPoint:"cs_write_indirect"}}),R=e.createRenderPipeline({label:"McRenderPipeline",layout:T,vertex:{module:G,entryPoint:"vs_main",buffers:[]},fragment:{module:G,entryPoint:"fs_main",targets:[{format:n.format}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),L=e.createBindGroup({label:"McDensityBG",layout:U,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:M}}]}),j=e.createBindGroup({label:"McMarchBG",layout:i,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:g}},{binding:4,resource:{buffer:v}},{binding:5,resource:{buffer:x}},{binding:6,resource:{buffer:u}}]}),q=e.createBindGroup({label:"McRenderBG",layout:b,entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:{buffer:d}}]}),_=new Float32Array(64);return _[0]=r.gridSize[0],_[1]=r.gridSize[1],_[2]=r.gridSize[2],_[4]=r.isolevel,_[8]=r.gridExtent[0],_[9]=r.gridExtent[1],_[10]=r.gridExtent[2],_[12]=r.gridOffset[0],_[13]=r.gridOffset[1],_[14]=r.gridOffset[2],e.queue.writeBuffer(v,0,_),new k(r,l,t,f,d,a,g,x,u,M,v,y,C,D,I,V,R,L,j,q)}updateAttachments(n,l){this._colorView=n,this._depthView=l}setBrush(n,l,t){this._brush.enabled=!0,this._brush.center=n.clone(),this._brush.radius=l,this._brush.strength=t}clearBrush(){this._brush.enabled=!1}updateCamera(n,l,t,s,r,e,p,f){const d=new Float32Array(70);let a=0;d.set(l.data,a),a+=16,d.set(t.data,a),a+=16,d.set(s.data,a),a+=16,d.set(r.data,a),a+=16,d[a++]=e.x,d[a++]=e.y,d[a++]=e.z,d[a++]=p,d[a]=f,n.queue.writeBuffer(this._renderUniforms,0,d)}execute(n,l){const t=this._densityUniBuf;t[0]=this._config.gridSize[0],t[1]=this._config.gridSize[1],t[2]=this._config.gridSize[2],t[4]=this._config.isolevel,t[8]=this._config.gridExtent[0],t[9]=this._config.gridExtent[1],t[10]=this._config.gridExtent[2],t[12]=this._config.gridOffset[0],t[13]=this._config.gridOffset[1],t[14]=this._config.gridOffset[2],t[16]=this._config.noiseScale,t[17]=this._config.noiseHeight,t[18]=this._config.detailScale,t[19]=this._config.detailStrength,this._brush.enabled?(t[24]=this._brush.center.x,t[25]=this._brush.center.y,t[26]=this._brush.center.z,t[28]=this._brush.radius,t[29]=this._brush.strength,t[32]=1):t[32]=0,l.queue.writeBuffer(this._densityUniforms,0,t),l.queue.writeBuffer(this._vertexCounter,0,this._zeroU32);const s=n.beginComputePass({label:"McCompute"});s.setPipeline(this._densityPipeline),s.setBindGroup(0,this._densityBG),s.dispatchWorkgroups(Math.ceil(this._config.gridSize[0]/8),Math.ceil(this._config.gridSize[1]/4),Math.ceil(this._config.gridSize[2]/8)),this._brush.enabled&&(s.setPipeline(this._brushPipeline),s.setBindGroup(0,this._densityBG),s.dispatchWorkgroups(Math.ceil(this._config.gridSize[0]/8),Math.ceil(this._config.gridSize[1]/4),Math.ceil(this._config.gridSize[2]/8))),s.setPipeline(this._marchPipeline),s.setBindGroup(0,this._marchBG),s.dispatchWorkgroups(Math.ceil((this._config.gridSize[0]-1)/8),Math.ceil((this._config.gridSize[1]-1)/4),Math.ceil((this._config.gridSize[2]-1)/8)),s.setPipeline(this._indirectPipeline),s.setBindGroup(0,this._marchBG),s.dispatchWorkgroups(1),s.end();const r=n.beginRenderPass({label:"McRender",colorAttachments:[{view:this._colorView,loadOp:"clear",storeOp:"store",clearValue:{r:.45,g:.65,b:.9,a:1}}],depthStencilAttachment:{view:this._depthView,depthLoadOp:"clear",depthStoreOp:"store",depthClearValue:1}});r.setPipeline(this._renderPipeline),r.setBindGroup(0,this._renderBG),r.drawIndirect(this._indirectBuffer,0),r.end()}destroy(){this._densityBuffer.destroy(),this._vertexBuffer.destroy(),this._vertexCounter.destroy(),this._indirectBuffer.destroy(),this._edgeTableBuffer.destroy(),this._triTableBuffer.destroy(),this._densityUniforms.destroy(),this._mcUniforms.destroy(),this._renderUniforms.destroy()}}async function e1(){const c=document.getElementById("canvas"),h=document.getElementById("fps");c.width=c.clientWidth*devicePixelRatio,c.height=c.clientHeight*devicePixelRatio;const n=await W.create(c,{enableErrorHandling:!1}),l=n.device;let t=l.createTexture({label:"McDepthTexture",size:{width:n.width,height:n.height},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT});const s=new B(0,10,25);let r=0,e=-15*Math.PI/180,p=!1,f=0,d=0,a=2,g=.2,m=!1,x=new B;c.addEventListener("mousedown",i=>{i.button===0&&(p=!0,f=i.clientX,d=i.clientY)}),window.addEventListener("mouseup",()=>{p=!1}),window.addEventListener("mousemove",i=>{if(p){const b=i.clientX-f,P=i.clientY-d;r-=b*.005,e-=P*.005,e=Math.max(-Math.PI/2+.01,Math.min(Math.PI/2-.01,e)),f=i.clientX,d=i.clientY}}),window.addEventListener("keydown",i=>{const P=new B(-Math.sin(r)*Math.cos(e),-Math.sin(e),-Math.cos(r)*Math.cos(e)).normalize(),z=new B(Math.cos(r),0,-Math.sin(r)).normalize();i.key==="w"||i.key==="W"?s.add(P.scale(.8)):i.key==="s"||i.key==="S"?s.sub(P.scale(.8)):i.key==="a"||i.key==="A"?s.sub(z.scale(.8)):i.key==="d"||i.key==="D"?s.add(z.scale(.8)):i.key==="q"||i.key==="Q"?s.y-=.8:i.key==="e"||i.key==="E"?s.y+=.8:i.key==="1"?(g=Math.abs(g),console.log("Add mode")):i.key==="2"?(g=-Math.abs(g),console.log("Remove mode")):i.key==="ArrowUp"?(a=Math.min(8,a+.5),console.log("Brush radius:",a)):i.key==="ArrowDown"&&(a=Math.max(.5,a-.5),console.log("Brush radius:",a))}),c.addEventListener("pointerdown",i=>{if(i.button===2){i.preventDefault(),m=!0;const b=new B(-Math.sin(r)*Math.cos(e),-Math.sin(e),-Math.cos(r)*Math.cos(e)).normalize();x=s.add(b.scale(15))}}),c.addEventListener("contextmenu",i=>{i.preventDefault()}),window.addEventListener("pointerup",i=>{i.button===2&&(m=!1)});const w=n.getCurrentTexture().createView(),u=k.create(n,w,t.createView());let M=performance.now(),v=0,y=0;async function U(){const i=performance.now(),b=(i-M)*.001;if(M=i,v++,y+=b,y>=.5){const L=Math.round(v/y);h.textContent=`FPS: ${L}`,v=0,y=0}(n.canvas.width!==n.canvas.clientWidth*devicePixelRatio||n.canvas.height!==n.canvas.clientHeight*devicePixelRatio)&&(n.canvas.width=n.canvas.clientWidth*devicePixelRatio,n.canvas.height=n.canvas.clientHeight*devicePixelRatio,t.destroy(),t=l.createTexture({label:"McDepthTexture",size:{width:n.width,height:n.height},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}));const z=new B(-Math.sin(r)*Math.cos(e),-Math.sin(e),-Math.cos(r)*Math.cos(e)).normalize(),G=s.add(z),S=N.lookAt(s,G,new B(0,1,0)),E=n.width/n.height,T=N.perspective(60*Math.PI/180,E,.1,200),C=T.multiply(S),D=C.invert();u.updateCamera(n,S,T,C,D,s,.1,200),m?u.setBrush(x,a,g):u.clearBrush();const V=n.getCurrentTexture().createView();u.updateAttachments(V,t.createView());const R=l.createCommandEncoder({label:"McMainEncoder"});u.enabled&&u.execute(R,n),l.queue.submit([R.finish()]),requestAnimationFrame(U)}U()}e1();
