var K=Object.defineProperty;var Q=(c,g,n)=>g in c?K(c,g,{enumerable:!0,configurable:!0,writable:!0,value:n}):c[g]=n;var r=(c,g,n)=>Q(c,typeof g!="symbol"?g+"":g,n);import{R as e1}from"./render_context-B2ePmOhh.js";import{C as n1,M as R,V as z,d as i1}from"./mesh-nHZSLt8E.js";import{R as r1}from"./render_pass-BouxMEb8.js";const t1=`const PERM: array<i32, 256> = array<i32, 256>(
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
  grid_size       : vec4<f32>,
  isolevel        : f32,
  _pad0           : f32,
  _pad1           : f32,
  _pad2           : f32,
  grid_extent     : vec4<f32>,
  grid_offset     : vec4<f32>,

  noise_scale     : f32,
  noise_height    : f32,
  detail_scale    : f32,
  detail_strength : f32,
  _pad4           : vec4<f32>,

  brush_center    : vec4<f32>,
  brush_radius    : f32,
  brush_strength  : f32,
  brush_enabled   : f32,
};

@group(0) @binding(0) var<storage, read_write> density: array<f32>;
@group(0) @binding(1) var<uniform> uni: DensityUniforms;

fn density_index(p: vec3<u32>) -> u32 {
  let gs = vec3<u32>(uni.grid_size.xyz);
  return p.z * gs.x * gs.y +
         p.y * gs.x +
         p.x;
}

@compute @workgroup_size(8, 4, 8)
fn cs_generate(@builtin(global_invocation_id) gid: vec3<u32>) {
  let gs = vec3<u32>(uni.grid_size.xyz);
  if (gid.x >= gs.x ||
      gid.y >= gs.y ||
      gid.z >= gs.z) {
    return;
  }

  let cell_count = vec3<f32>(gs - vec3<u32>(1u));
  let grid_cell_size = uni.grid_extent.xyz / cell_count;
  let grid_origin = uni.grid_offset.xyz;
  let world_pos = vec3<f32>(gid) * grid_cell_size + grid_origin;

  let noise_pos = vec3<f32>(world_pos.x, 0.0, world_pos.z) * uni.noise_scale;
  let base_noise = perlin_fbm_3d(noise_pos, 4u);
  let terrain_height = uni.noise_height * base_noise;

  let detail_pos = world_pos * uni.detail_scale;
  let detail_noise = perlin_fbm_3d(detail_pos, 2u);

  let density_val = world_pos.y - terrain_height + uni.detail_strength * detail_noise;

  let idx = density_index(gid);
  density[idx] = density_val;
}

@compute @workgroup_size(8, 4, 8)
fn cs_brush(@builtin(global_invocation_id) gid: vec3<u32>) {
  let gs = vec3<u32>(uni.grid_size.xyz);
  if (gid.x >= gs.x ||
      gid.y >= gs.y ||
      gid.z >= gs.z) {
    return;
  }

  if (uni.brush_enabled == 0.0) {
    return;
  }

  let cell_count = vec3<f32>(gs - vec3<u32>(1u));
  let grid_cell_size = uni.grid_extent.xyz / cell_count;
  let grid_origin = uni.grid_offset.xyz;
  let world_pos = vec3<f32>(gid) * grid_cell_size + grid_origin;

  let dist = length(world_pos - uni.brush_center.xyz);
  let idx = density_index(gid);

  if (dist < uni.brush_radius) {
    let t = 1.0 - dist / uni.brush_radius;
    density[idx] -= uni.brush_strength * t;
  }
}
`,s1=`const CORNERS: array<vec3<f32>, 8> = array<vec3<f32>, 8>(
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
  if (abs(iso - a) < eps) {
    return 0.0;
  }
  if (abs(iso - b) < eps) {
    return 1.0;
  }
  return (iso - a) / (b - a);
}

struct McUniforms {
  grid_size        : vec4<f32>,
  isolevel         : f32,
  _pad0            : f32,
  _pad1            : f32,
  _pad2            : f32,
  grid_extent      : vec4<f32>,
  grid_offset      : vec4<f32>,
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
  let gs = vec3<u32>(uni.grid_size.xyz);
  return p.z * gs.x * gs.y +
         p.y * gs.x +
         p.x;
}

@compute @workgroup_size(8, 4, 8)
fn cs_march(@builtin(global_invocation_id) gid: vec3<u32>) {
  let gs = vec3<u32>(uni.grid_size.xyz);
  let cell_count = gs - vec3<u32>(1u);

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

  let grid_cell_size = uni.grid_extent.xyz / vec3<f32>(gs - vec3<u32>(1u));
  let grid_origin = uni.grid_offset.xyz;

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
    if (len2 < 1e-12) {
      continue;
    }
    var norm = n / sqrt(len2);

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
`,o1=`struct McVertex {
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
`,a1=[0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0],u1=[[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1],[3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1],[3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1],[3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1],[9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1],[9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1],[2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1],[8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1],[9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1],[4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1],[3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1],[1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1],[4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1],[4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1],[9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1],[1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1],[5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1],[2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1],[9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1],[0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1],[2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1],[10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1],[4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1],[5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1],[5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1],[9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1],[0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1],[1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1],[10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1],[8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1],[2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1],[7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1],[9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1],[2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1],[11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1],[9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1],[5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1],[11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1],[11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1],[1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1],[9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1],[5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1],[2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1],[0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1],[5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1],[6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1],[0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1],[3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1],[6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1],[5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1],[1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1],[10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1],[6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1],[1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1],[8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1],[7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1],[3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1],[5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1],[0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1],[9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1],[8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1],[5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1],[0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1],[6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1],[10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1],[10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1],[8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1],[1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1],[3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1],[0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1],[10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1],[0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1],[3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1],[6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1],[9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1],[8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1],[3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1],[6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1],[0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1],[10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1],[10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1],[1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1],[2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1],[7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1],[7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1],[2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1],[1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1],[11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1],[8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1],[0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1],[7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1],[10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1],[2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1],[6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1],[7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1],[2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1],[1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1],[10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1],[10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1],[0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1],[7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1],[6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1],[8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1],[9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1],[6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1],[4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1],[10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1],[8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1],[0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1],[1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1],[8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1],[10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1],[4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1],[10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1],[5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1],[11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1],[9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1],[6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1],[7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1],[3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1],[7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1],[9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1],[3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1],[6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1],[9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1],[1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1],[4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1],[7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1],[6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1],[3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1],[0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1],[6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1],[0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1],[11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1],[6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1],[5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1],[9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1],[1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1],[1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1],[10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1],[0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1],[5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1],[10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1],[11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1],[9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1],[7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1],[2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1],[8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1],[9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1],[9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1],[1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1],[9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1],[9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1],[5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1],[0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1],[10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1],[2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1],[0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1],[0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1],[9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1],[5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1],[3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1],[5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1],[8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1],[0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1],[9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1],[0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1],[1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1],[3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1],[4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1],[9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1],[11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1],[11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1],[2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1],[9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1],[3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1],[1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1],[4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1],[4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1],[0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1],[3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1],[3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1],[0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1],[9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1],[1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]],d1=`
  struct Uniforms {
    viewProj: mat4x4<f32>,
    brushCenter: vec3<f32>,
    brushRadius: f32,
    brushColor: vec4<f32>,
  };

  @group(0) @binding(0) var<uniform> uni: Uniforms;

  @vertex
  fn vs_main(@location(0) pos: vec3<f32>) -> @builtin(position) vec4<f32> {
    let worldPos = uni.brushCenter + pos * uni.brushRadius;
    return uni.viewProj * vec4<f32>(worldPos, 1.0);
  }

  @fragment
  fn fs_main() -> @location(0) vec4<f32> {
    return uni.brushColor;
  }
`,c1={gridSize:[32,24,32],gridExtent:[32,24,32],gridOffset:[-16,-8,-16],isolevel:0,noiseScale:.08,noiseHeight:10,detailScale:.3,detailStrength:1,maxVertices:128*1024};class O extends r1{constructor(n,d,i,s,t,e,l,f,a,o,_,u,b,v,y,S,p,m,w,B,M,P,x,G,U){super();r(this,"name","MarchingCubesPass");r(this,"_config");r(this,"_colorView");r(this,"_depthView");r(this,"_densityBuffer");r(this,"_vertexBuffer");r(this,"_vertexCounter");r(this,"_indirectBuffer");r(this,"_edgeTableBuffer");r(this,"_triTableBuffer");r(this,"_densityUniforms");r(this,"_mcUniforms");r(this,"_renderUniforms");r(this,"_densityPipeline");r(this,"_brushPipeline");r(this,"_marchPipeline");r(this,"_indirectPipeline");r(this,"_renderPipeline");r(this,"_densityBG");r(this,"_marchBG");r(this,"_renderBG");r(this,"_generated",!1);r(this,"_viewProj",new R);r(this,"_sphereMesh");r(this,"_brushSphereUniforms");r(this,"_brushSpherePipeline");r(this,"_brushSphereBG");r(this,"_brushSphereUniBuf");r(this,"_brush",{enabled:!1,center:new z,radius:2,strength:.2});r(this,"_zeroU32",new Uint32Array([0]));r(this,"_densityUniBuf",new Float32Array(64));this._config=n,this._colorView=d,this._depthView=i,this._densityBuffer=s,this._vertexBuffer=t,this._vertexCounter=e,this._indirectBuffer=l,this._edgeTableBuffer=f,this._triTableBuffer=a,this._densityUniforms=o,this._mcUniforms=_,this._renderUniforms=u,this._densityPipeline=b,this._brushPipeline=v,this._marchPipeline=y,this._indirectPipeline=S,this._renderPipeline=p,this._densityBG=m,this._marchBG=w,this._renderBG=B,this._sphereMesh=M,this._brushSphereUniforms=P,this._brushSpherePipeline=x,this._brushSphereBG=G,this._brushSphereUniBuf=U}static create(n,d,i,s={}){const t={...c1,...s},{device:e}=n,l=t.gridSize[0]*t.gridSize[1]*t.gridSize[2],f=e.createBuffer({label:"McDensityBuffer",size:l*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),a=e.createBuffer({label:"McVertexBuffer",size:t.maxVertices*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.VERTEX}),o=e.createBuffer({label:"McVertexCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(o,0,new Uint32Array([0]));const _=e.createBuffer({label:"McIndirectBuffer",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(_,0,new Uint32Array([0,1,0,0]));const u=new Uint32Array(a1),b=e.createBuffer({label:"McEdgeTable",size:u.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(b,0,u);const v=new Int32Array(256*16);for(let E=0;E<256;E++)for(let C=0;C<16;C++)v[E*16+C]=u1[E][C];const y=e.createBuffer({label:"McTriTable",size:v.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(y,0,v);const S=e.createBuffer({label:"McDensityUniforms",size:256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=e.createBuffer({label:"McMarchUniforms",size:256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=e.createBuffer({label:"McRenderUniforms",size:512,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),w=e.createBindGroupLayout({label:"McDensityBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),B=e.createBindGroupLayout({label:"McMarchBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:6,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}}]}),M=e.createBindGroupLayout({label:"McRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),P=n.createShaderModule(t1,"McDensityShader"),x=n.createShaderModule(s1,"McMarchShader"),G=n.createShaderModule(o1,"McRenderShader"),U=e.createPipelineLayout({bindGroupLayouts:[w]}),T=e.createPipelineLayout({bindGroupLayouts:[B]}),V=e.createPipelineLayout({bindGroupLayouts:[M]}),j=e.createComputePipeline({label:"McDensityPipeline",layout:U,compute:{module:P,entryPoint:"cs_generate"}}),I=e.createComputePipeline({label:"McBrushPipeline",layout:U,compute:{module:P,entryPoint:"cs_brush"}}),k=e.createComputePipeline({label:"McMarchPipeline",layout:T,compute:{module:x,entryPoint:"cs_march"}}),F=e.createComputePipeline({label:"McIndirectPipeline",layout:T,compute:{module:x,entryPoint:"cs_write_indirect"}}),N=e.createRenderPipeline({label:"McRenderPipeline",layout:V,vertex:{module:G,entryPoint:"vs_main",buffers:[]},fragment:{module:G,entryPoint:"fs_main",targets:[{format:n.format}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),q=e.createBindGroup({label:"McDensityBG",layout:w,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:S}}]}),Y=e.createBindGroup({label:"McMarchBG",layout:B,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:_}},{binding:4,resource:{buffer:p}},{binding:5,resource:{buffer:b}},{binding:6,resource:{buffer:y}}]}),W=e.createBindGroup({label:"McRenderBG",layout:M,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:a}}]}),h=new Float32Array(64);h[0]=t.gridSize[0],h[1]=t.gridSize[1],h[2]=t.gridSize[2],h[4]=t.isolevel,h[8]=t.gridExtent[0],h[9]=t.gridExtent[1],h[10]=t.gridExtent[2],h[12]=t.gridOffset[0],h[13]=t.gridOffset[1],h[14]=t.gridOffset[2],e.queue.writeBuffer(p,0,h);const X=i1.createSphere(e,1,16,16),A=n.createShaderModule(d1,"McBrushSphereShader"),L=e.createBindGroupLayout({label:"McBrushSphereBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),H=e.createPipelineLayout({bindGroupLayouts:[L]}),Z=e.createRenderPipeline({label:"McBrushSpherePipeline",layout:H,vertex:{module:A,entryPoint:"vs_main",buffers:[{arrayStride:48,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},fragment:{module:A,entryPoint:"fs_main",targets:[{format:n.format,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),D=e.createBuffer({label:"McBrushSphereUniforms",size:96,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),$=new Float32Array(24),J=e.createBindGroup({label:"McBrushSphereBG",layout:L,entries:[{binding:0,resource:{buffer:D}}]});return new O(t,d,i,f,a,o,_,b,y,S,p,m,j,I,k,F,N,q,Y,W,X,D,Z,J,$)}updateAttachments(n,d){this._colorView=n,this._depthView=d}setBrush(n,d,i,s=!0){this._brush.enabled=s,this._brush.center=n.clone(),this._brush.radius=d,this._brush.strength=i}updateCamera(n,d,i,s,t,e,l,f){const a=new Float32Array(70);let o=0;a.set(d.data,o),o+=16,a.set(i.data,o),o+=16,a.set(s.data,o),o+=16,a.set(t.data,o),o+=16,a[o++]=e.x,a[o++]=e.y,a[o++]=e.z,a[o++]=l,a[o]=f,this._viewProj=s,n.queue.writeBuffer(this._renderUniforms,0,a)}execute(n,d){const i=this._densityUniBuf;i[0]=this._config.gridSize[0],i[1]=this._config.gridSize[1],i[2]=this._config.gridSize[2],i[4]=this._config.isolevel,i[8]=this._config.gridExtent[0],i[9]=this._config.gridExtent[1],i[10]=this._config.gridExtent[2],i[12]=this._config.gridOffset[0],i[13]=this._config.gridOffset[1],i[14]=this._config.gridOffset[2],i[16]=this._config.noiseScale,i[17]=this._config.noiseHeight,i[18]=this._config.detailScale,i[19]=this._config.detailStrength,i[24]=this._brush.center.x,i[25]=this._brush.center.y,i[26]=this._brush.center.z,i[28]=this._brush.radius,i[29]=this._brush.strength,i[30]=this._brush.enabled?1:0,d.queue.writeBuffer(this._densityUniforms,0,i),d.queue.writeBuffer(this._vertexCounter,0,this._zeroU32);const s=n.beginComputePass({label:"McCompute"});this._generated||(s.setPipeline(this._densityPipeline),s.setBindGroup(0,this._densityBG),s.dispatchWorkgroups(Math.ceil(this._config.gridSize[0]/8),Math.ceil(this._config.gridSize[1]/4),Math.ceil(this._config.gridSize[2]/8)),this._generated=!0),this._brush.enabled&&(s.setPipeline(this._brushPipeline),s.setBindGroup(0,this._densityBG),s.dispatchWorkgroups(Math.ceil(this._config.gridSize[0]/8),Math.ceil(this._config.gridSize[1]/4),Math.ceil(this._config.gridSize[2]/8))),s.setPipeline(this._marchPipeline),s.setBindGroup(0,this._marchBG),s.dispatchWorkgroups(Math.ceil((this._config.gridSize[0]-1)/8),Math.ceil((this._config.gridSize[1]-1)/4),Math.ceil((this._config.gridSize[2]-1)/8)),s.setPipeline(this._indirectPipeline),s.setBindGroup(0,this._marchBG),s.dispatchWorkgroups(1),s.end();const t=n.beginRenderPass({label:"McRender",colorAttachments:[{view:this._colorView,loadOp:"clear",storeOp:"store",clearValue:{r:.45,g:.65,b:.9,a:1}}],depthStencilAttachment:{view:this._depthView,depthLoadOp:"clear",depthStoreOp:"store",depthClearValue:1}});t.setPipeline(this._renderPipeline),t.setBindGroup(0,this._renderBG),t.drawIndirect(this._indirectBuffer,0);{const e=this._brushSphereUniBuf;e.set(this._viewProj.data,0),e[16]=this._brush.center.x,e[17]=this._brush.center.y,e[18]=this._brush.center.z,e[19]=this._brush.radius,this._brush.strength>=0?(e[20]=0,e[21]=1,e[22]=0,e[23]=.25):(e[20]=1,e[21]=0,e[22]=0,e[23]=.25),d.device.queue.writeBuffer(this._brushSphereUniforms,0,e.buffer,e.byteOffset,e.byteLength),t.setPipeline(this._brushSpherePipeline),t.setBindGroup(0,this._brushSphereBG),t.setVertexBuffer(0,this._sphereMesh.vertexBuffer),t.setIndexBuffer(this._sphereMesh.indexBuffer,"uint32"),t.drawIndexed(this._sphereMesh.indexCount)}t.end()}destroy(){this._densityBuffer.destroy(),this._vertexBuffer.destroy(),this._vertexCounter.destroy(),this._indirectBuffer.destroy(),this._edgeTableBuffer.destroy(),this._triTableBuffer.destroy(),this._densityUniforms.destroy(),this._mcUniforms.destroy(),this._renderUniforms.destroy(),this._sphereMesh.destroy()}}async function l1(){const c=document.getElementById("canvas"),g=document.getElementById("fps");c.width=c.clientWidth*devicePixelRatio,c.height=c.clientHeight*devicePixelRatio;const n=await e1.create(c,{enableErrorHandling:!1}),d=n.device,i=new z(0,10,25),s=n1.create({yaw:0,pitch:-15*Math.PI/180,speed:15,sensitivity:.002,pointerLock:!1});s.attach(c);const t={position:i,rotation:{x:0,y:0,z:0,w:1}};let e=2,l=.2,f=!1,a=new z;window.addEventListener("keydown",u=>{u.key==="1"?(l=Math.abs(l),console.log("Add mode")):u.key==="2"?(l=-Math.abs(l),console.log("Remove mode")):u.key==="ArrowUp"?(e=Math.min(8,e+.5),console.log("Brush radius:",e)):u.key==="ArrowDown"&&(e=Math.max(.5,e-.5),console.log("Brush radius:",e))}),c.addEventListener("pointerdown",u=>{u.button===2&&(u.preventDefault(),f=!0)}),c.addEventListener("contextmenu",u=>{u.preventDefault()}),window.addEventListener("pointerup",u=>{u.button===2&&(f=!1)});const o=O.create(n,n.backbufferView,n.backbufferDepthView);async function _(){n.update(),g.textContent=`FPS: ${n.fps}`;const u=document.getElementById("brush-info"),b=l>0?"Add":"Remove";u.textContent=`Brush: ${b} | Radius: ${e.toFixed(1)}`,s.update(t,n.deltaTime);const v=Math.sin(s.yaw),y=Math.cos(s.yaw),S=Math.sin(s.pitch),p=Math.cos(s.pitch),m=new z(-v*p,-S,-y*p).normalize();a=i.add(m.scale(15));const w=i.add(m),B=R.lookAt(i,w,new z(0,1,0)),M=n.width/n.height,P=R.perspective(60*Math.PI/180,M,.1,200),x=P.multiply(B),G=x.invert();o.updateCamera(n,B,P,x,G,i,.1,200),o.setBrush(a,e,l,f),o.updateAttachments(n.backbufferView,n.backbufferDepthView);const U=d.createCommandEncoder({label:"McMainEncoder"});o.enabled&&o.execute(U,n),d.queue.submit([U.finish()]),requestAnimationFrame(_)}_()}l1();
