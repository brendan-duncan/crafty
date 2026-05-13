var K=Object.defineProperty;var Q=(c,g,r)=>g in c?K(c,g,{enumerable:!0,configurable:!0,writable:!0,value:r}):c[g]=r;var t=(c,g,r)=>Q(c,typeof g!="symbol"?g+"":g,r);import{R as e1,C as r1,a as n1,d as F,c as E,M as i1}from"./mesh-BZCnqQH3.js";const t1=`const PERM: array<i32, 256> = array<i32, 256>(\r
  151, 160, 137, 91, 90, 15,\r
  131, 13, 201, 95, 96, 53, 194, 233, 7, 225,\r
  140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,\r
  190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117,\r
  35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171,\r
  168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,\r
  111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,\r
  102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208,\r
  89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173,\r
  186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255,\r
  82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223,\r
  183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167,\r
  43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178,\r
  185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191,\r
  179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 180,\r
  199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138,\r
  236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,\r
  61, 156, 181,\r
);\r
\r
fn perm(i: i32) -> i32 {\r
  return PERM[(i & 255)];\r
}\r
\r
fn fade(t: f32) -> f32 {\r
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\r
}\r
\r
fn grad(hash: i32, x: f32, y: f32, z: f32) -> f32 {\r
  let h = hash & 15;\r
  let u = select(x, y, h < 8);\r
  let v = select(select(y, x, h < 4), select(z, y, h == 12 || h == 14), h >= 8);\r
  return (select(-u, u, (h & 1) == 0)) + (select(-v, v, (h & 2) == 0));\r
}\r
\r
fn perlin_noise_3d(p: vec3<f32>) -> f32 {\r
  let X = i32(floor(p.x)) & 255;\r
  let Y = i32(floor(p.y)) & 255;\r
  let Z = i32(floor(p.z)) & 255;\r
  let x = p.x - floor(p.x);\r
  let y = p.y - floor(p.y);\r
  let z = p.z - floor(p.z);\r
  let u = fade(x);\r
  let v = fade(y);\r
  let w = fade(z);\r
\r
  let A = perm(X) + Y;\r
  let AA = perm(A) + Z;\r
  let AB = perm(A + 1) + Z;\r
  let B = perm(X + 1) + Y;\r
  let BA = perm(B) + Z;\r
  let BB = perm(B + 1) + Z;\r
\r
  return mix(\r
    mix(\r
      mix(grad(perm(AA), x, y, z), grad(perm(BA), x - 1.0, y, z), u),\r
      mix(grad(perm(AB), x, y - 1.0, z), grad(perm(BB), x - 1.0, y - 1.0, z), u),\r
      v\r
    ),\r
    mix(\r
      mix(grad(perm(AA + 1), x, y, z - 1.0), grad(perm(BA + 1), x - 1.0, y, z - 1.0), u),\r
      mix(grad(perm(AB + 1), x, y - 1.0, z - 1.0), grad(perm(BB + 1), x - 1.0, y - 1.0, z - 1.0), u),\r
      v\r
    ),\r
    w\r
  );\r
}\r
\r
fn perlin_fbm_3d(p: vec3<f32>, octaves: u32) -> f32 {\r
  var value = 0.0;\r
  var amplitude = 0.5;\r
  var frequency = 1.0;\r
\r
  for (var i = 0u; i < octaves; i++) {\r
    value += amplitude * perlin_noise_3d(p * frequency);\r
    amplitude *= 0.5;\r
    frequency *= 2.0;\r
  }\r
\r
  return value;\r
}\r
\r
struct DensityUniforms {\r
  grid_size       : vec4<f32>,\r
  isolevel        : f32,\r
  _pad0           : f32,\r
  _pad1           : f32,\r
  _pad2           : f32,\r
  grid_extent     : vec4<f32>,\r
  grid_offset     : vec4<f32>,\r
\r
  noise_scale     : f32,\r
  noise_height    : f32,\r
  detail_scale    : f32,\r
  detail_strength : f32,\r
  _pad4           : vec4<f32>,\r
\r
  brush_center    : vec4<f32>,\r
  brush_radius    : f32,\r
  brush_strength  : f32,\r
  brush_enabled   : f32,\r
};\r
\r
@group(0) @binding(0) var<storage, read_write> density: array<f32>;\r
@group(0) @binding(1) var<uniform> uni: DensityUniforms;\r
\r
fn density_index(p: vec3<u32>) -> u32 {\r
  let gs = vec3<u32>(uni.grid_size.xyz);\r
  return p.z * gs.x * gs.y +\r
         p.y * gs.x +\r
         p.x;\r
}\r
\r
@compute @workgroup_size(8, 4, 8)\r
fn cs_generate(@builtin(global_invocation_id) gid: vec3<u32>) {\r
  let gs = vec3<u32>(uni.grid_size.xyz);\r
  if (gid.x >= gs.x ||\r
      gid.y >= gs.y ||\r
      gid.z >= gs.z) {\r
    return;\r
  }\r
\r
  let cell_count = vec3<f32>(gs - vec3<u32>(1u));\r
  let grid_cell_size = uni.grid_extent.xyz / cell_count;\r
  let grid_origin = uni.grid_offset.xyz;\r
  let world_pos = vec3<f32>(gid) * grid_cell_size + grid_origin;\r
\r
  let noise_pos = vec3<f32>(world_pos.x, 0.0, world_pos.z) * uni.noise_scale;\r
  let base_noise = perlin_fbm_3d(noise_pos, 4u);\r
  let terrain_height = uni.noise_height * base_noise;\r
\r
  let detail_pos = world_pos * uni.detail_scale;\r
  let detail_noise = perlin_fbm_3d(detail_pos, 2u);\r
\r
  let density_val = world_pos.y - terrain_height + uni.detail_strength * detail_noise;\r
\r
  let idx = density_index(gid);\r
  density[idx] = density_val;\r
}\r
\r
@compute @workgroup_size(8, 4, 8)\r
fn cs_brush(@builtin(global_invocation_id) gid: vec3<u32>) {\r
  let gs = vec3<u32>(uni.grid_size.xyz);\r
  if (gid.x >= gs.x ||\r
      gid.y >= gs.y ||\r
      gid.z >= gs.z) {\r
    return;\r
  }\r
\r
  if (uni.brush_enabled == 0.0) {\r
    return;\r
  }\r
\r
  let cell_count = vec3<f32>(gs - vec3<u32>(1u));\r
  let grid_cell_size = uni.grid_extent.xyz / cell_count;\r
  let grid_origin = uni.grid_offset.xyz;\r
  let world_pos = vec3<f32>(gid) * grid_cell_size + grid_origin;\r
\r
  let dist = length(world_pos - uni.brush_center.xyz);\r
  let idx = density_index(gid);\r
\r
  if (dist < uni.brush_radius) {\r
    let t = 1.0 - dist / uni.brush_radius;\r
    density[idx] -= uni.brush_strength * t;\r
  }\r
}\r
`,s1=`const CORNERS: array<vec3<f32>, 8> = array<vec3<f32>, 8>(\r
  vec3<f32>(0.0, 0.0, 0.0),\r
  vec3<f32>(1.0, 0.0, 0.0),\r
  vec3<f32>(1.0, 0.0, 1.0),\r
  vec3<f32>(0.0, 0.0, 1.0),\r
  vec3<f32>(0.0, 1.0, 0.0),\r
  vec3<f32>(1.0, 1.0, 0.0),\r
  vec3<f32>(1.0, 1.0, 1.0),\r
  vec3<f32>(0.0, 1.0, 1.0),\r
);\r
\r
const CORNER_INDEX_FROM_EDGE: array<vec2<i32>, 12> = array<vec2<i32>, 12>(\r
  vec2<i32>(0, 1),\r
  vec2<i32>(1, 2),\r
  vec2<i32>(2, 3),\r
  vec2<i32>(3, 0),\r
  vec2<i32>(4, 5),\r
  vec2<i32>(5, 6),\r
  vec2<i32>(6, 7),\r
  vec2<i32>(7, 4),\r
  vec2<i32>(0, 4),\r
  vec2<i32>(1, 5),\r
  vec2<i32>(2, 6),\r
  vec2<i32>(3, 7),\r
);\r
\r
fn interp(a: f32, b: f32, iso: f32) -> f32 {\r
  let eps = 0.0001;\r
  if (abs(iso - a) < eps) {\r
    return 0.0;\r
  }\r
  if (abs(iso - b) < eps) {\r
    return 1.0;\r
  }\r
  return (iso - a) / (b - a);\r
}\r
\r
struct McUniforms {\r
  grid_size        : vec4<f32>,\r
  isolevel         : f32,\r
  _pad0            : f32,\r
  _pad1            : f32,\r
  _pad2            : f32,\r
  grid_extent      : vec4<f32>,\r
  grid_offset      : vec4<f32>,\r
};\r
\r
struct Vertex {\r
  pos: vec3<f32>,\r
  norm: vec3<f32>,\r
};\r
\r
@group(0) @binding(0) var<storage, read> density: array<f32>;\r
@group(0) @binding(1) var<storage, read_write> vertices: array<Vertex>;\r
@group(0) @binding(2) var<storage, read_write> vertex_counter: atomic<u32>;\r
@group(0) @binding(3) var<storage, read_write> indirect_args: array<u32>;\r
@group(0) @binding(4) var<uniform> uni: McUniforms;\r
@group(0) @binding(5) var<storage, read> edge_table: array<u32>;\r
@group(0) @binding(6) var<storage, read> tri_table: array<array<i32, 16>, 256>;\r
\r
fn density_index(p: vec3<u32>) -> u32 {\r
  let gs = vec3<u32>(uni.grid_size.xyz);\r
  return p.z * gs.x * gs.y +\r
         p.y * gs.x +\r
         p.x;\r
}\r
\r
@compute @workgroup_size(8, 4, 8)\r
fn cs_march(@builtin(global_invocation_id) gid: vec3<u32>) {\r
  let gs = vec3<u32>(uni.grid_size.xyz);\r
  let cell_count = gs - vec3<u32>(1u);\r
\r
  if (gid.x >= cell_count.x ||\r
      gid.y >= cell_count.y ||\r
      gid.z >= cell_count.z) {\r
    return;\r
  }\r
\r
  var density_vals: array<f32, 8>;\r
  var cube_idx: u32 = 0u;\r
\r
  for (var i = 0u; i < 8u; i++) {\r
    let corner_pos = gid + vec3<u32>(CORNERS[i]);\r
    let dens_idx = density_index(corner_pos);\r
    density_vals[i] = density[dens_idx];\r
    if (density_vals[i] < uni.isolevel) {\r
      cube_idx |= (1u << i);\r
    }\r
  }\r
\r
  let flags = edge_table[cube_idx];\r
  if (flags == 0u) {\r
    return;\r
  }\r
\r
  var edge_verts: array<vec3<f32>, 12>;\r
\r
  for (var i = 0u; i < 12u; i++) {\r
    if ((flags & (1u << i)) != 0u) {\r
      let edge = CORNER_INDEX_FROM_EDGE[i];\r
      let idx0 = u32(edge[0]);\r
      let idx1 = u32(edge[1]);\r
      let d0 = density_vals[idx0];\r
      let d1 = density_vals[idx1];\r
      let t = interp(d0, d1, uni.isolevel);\r
      let p0 = CORNERS[idx0];\r
      let p1 = CORNERS[idx1];\r
      edge_verts[i] = p0 + t * (p1 - p0);\r
    }\r
  }\r
\r
  let tris = tri_table[cube_idx];\r
\r
  let grid_cell_size = uni.grid_extent.xyz / vec3<f32>(gs - vec3<u32>(1u));\r
  let grid_origin = uni.grid_offset.xyz;\r
\r
  for (var i = 0; i < 16; i += 3) {\r
    if (tris[i] < 0) {\r
      break;\r
    }\r
\r
    var tri_verts: array<vec3<f32>, 3>;\r
\r
    for (var j = 0; j < 3; j++) {\r
      let edge_idx = u32(tris[i + j]);\r
      let ev = edge_verts[edge_idx];\r
      let grid_pos = vec3<f32>(gid) + ev;\r
      let world_pos = grid_pos * grid_cell_size + grid_origin;\r
\r
      tri_verts[j] = world_pos;\r
    }\r
\r
    var e0 = tri_verts[1] - tri_verts[0];\r
    var e1 = tri_verts[2] - tri_verts[0];\r
    var n = cross(e0, e1);\r
    var len2 = dot(n, n);\r
    if (len2 < 1e-12) {\r
      continue;\r
    }\r
    var norm = n / sqrt(len2);\r
\r
    let slot = atomicAdd(&vertex_counter, 3u);\r
\r
    for (var j = 0u; j < 3u; j++) {\r
      let vert_idx = slot + j;\r
      vertices[vert_idx].pos = tri_verts[j];\r
      vertices[vert_idx].norm = norm;\r
    }\r
  }\r
}\r
\r
@compute @workgroup_size(1)\r
fn cs_write_indirect() {\r
  let count = atomicLoad(&vertex_counter);\r
  indirect_args[0] = count;\r
  indirect_args[1] = 1u;\r
  indirect_args[2] = 0u;\r
  indirect_args[3] = 0u;\r
}\r
`,a1=`struct McVertex {\r
  pos: vec3<f32>,\r
  norm: vec3<f32>,\r
};\r
\r
struct VertexOutput {\r
  @builtin(position) fragPos: vec4<f32>,\r
  @location(0) worldPos: vec3<f32>,\r
  @location(1) normal: vec3<f32>,\r
};\r
\r
@group(0) @binding(0) var<uniform> renderUni: RenderUniforms;\r
@group(0) @binding(1) var<storage, read> vertices: array<McVertex>;\r
\r
struct RenderUniforms {\r
  view: mat4x4<f32>,\r
  proj: mat4x4<f32>,\r
  viewProj: mat4x4<f32>,\r
  invViewProj: mat4x4<f32>,\r
  camPos: vec3<f32>,\r
  near: f32,\r
  far: f32,\r
  _pad0: vec2<f32>,\r
};\r
\r
@vertex\r
fn vs_main(@builtin(vertex_index) idx: u32) -> VertexOutput {\r
  let v = vertices[idx];\r
  var out: VertexOutput;\r
  out.worldPos = v.pos;\r
  out.normal = v.norm;\r
  out.fragPos = renderUni.viewProj * vec4<f32>(v.pos, 1.0);\r
  return out;\r
}\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let lightDir = normalize(vec3<f32>(0.5, 1.0, 0.3));\r
  let lightColor = vec3<f32>(1.0, 0.95, 0.9);\r
  let ambientColor = vec3<f32>(0.2, 0.25, 0.3);\r
\r
  let baseColor = vec3<f32>(0.42, 0.35, 0.28);\r
\r
  var n = normalize(in.normal);\r
  let ndotl = max(0.0, dot(n, lightDir));\r
  \r
  let diffuse = ndotl * lightColor;\r
  let specPower = 16.0;\r
  let viewDir = normalize(renderUni.camPos - in.worldPos);\r
  let halfDir = normalize(lightDir + viewDir);\r
  let spec = pow(max(0.0, dot(n, halfDir)), specPower) * 0.5;\r
\r
  let finalColor = baseColor * (ambientColor + diffuse) + vec3<f32>(spec);\r
  return vec4<f32>(finalColor, 1.0);\r
}\r
`,o1=[0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0],d1=[[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1],[3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1],[3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1],[3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1],[9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1],[9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1],[2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1],[8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1],[9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1],[4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1],[3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1],[1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1],[4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1],[4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1],[9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1],[1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1],[5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1],[2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1],[9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1],[0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1],[2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1],[10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1],[4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1],[5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1],[5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1],[9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1],[0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1],[1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1],[10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1],[8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1],[2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1],[7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1],[9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1],[2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1],[11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1],[9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1],[5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1],[11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1],[11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1],[1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1],[9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1],[5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1],[2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1],[0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1],[5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1],[6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1],[0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1],[3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1],[6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1],[5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1],[1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1],[10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1],[6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1],[1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1],[8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1],[7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1],[3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1],[5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1],[0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1],[9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1],[8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1],[5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1],[0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1],[6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1],[10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1],[10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1],[8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1],[1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1],[3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1],[0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1],[10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1],[0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1],[3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1],[6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1],[9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1],[8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1],[3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1],[6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1],[0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1],[10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1],[10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1],[1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1],[2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1],[7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1],[7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1],[2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1],[1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1],[11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1],[8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1],[0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1],[7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1],[10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1],[2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1],[6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1],[7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1],[2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1],[1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1],[10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1],[10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1],[0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1],[7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1],[6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1],[8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1],[9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1],[6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1],[4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1],[10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1],[8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1],[0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1],[1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1],[8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1],[10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1],[4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1],[10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1],[5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1],[11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1],[9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1],[6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1],[7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1],[3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1],[7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1],[9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1],[3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1],[6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1],[9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1],[1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1],[4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1],[7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1],[6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1],[3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1],[0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1],[6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1],[1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1],[0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1],[11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1],[6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1],[5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1],[9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1],[1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1],[1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1],[10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1],[0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1],[5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1],[10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1],[11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1],[0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1],[9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1],[7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1],[2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1],[8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1],[9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1],[9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1],[1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1],[9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1],[9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1],[5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1],[0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1],[10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1],[2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1],[0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1],[0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1],[9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1],[5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1],[3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1],[5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1],[8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1],[0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1],[9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1],[0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1],[1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1],[3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1],[4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1],[9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1],[11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1],[11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1],[2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1],[9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1],[3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1],[1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1],[4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1],[4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1],[0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1],[3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1],[3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1],[0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1],[9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1],[1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]],u1=`
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
`,c1={gridSize:[32,24,32],gridExtent:[32,24,32],gridOffset:[-16,-8,-16],isolevel:0,noiseScale:.08,noiseHeight:10,detailScale:.3,detailStrength:1,maxVertices:128*1024};class N extends n1{constructor(r,u,i,s,n,e,l,f,o,a,y,_,b,v,p,m,d,x,G,U,S,w,B,P,M){super();t(this,"name","MarchingCubesPass");t(this,"_config");t(this,"_colorView");t(this,"_depthView");t(this,"_densityBuffer");t(this,"_vertexBuffer");t(this,"_vertexCounter");t(this,"_indirectBuffer");t(this,"_edgeTableBuffer");t(this,"_triTableBuffer");t(this,"_densityUniforms");t(this,"_mcUniforms");t(this,"_renderUniforms");t(this,"_densityPipeline");t(this,"_brushPipeline");t(this,"_marchPipeline");t(this,"_indirectPipeline");t(this,"_renderPipeline");t(this,"_densityBG");t(this,"_marchBG");t(this,"_renderBG");t(this,"_generated",!1);t(this,"_viewProj",new F);t(this,"_sphereMesh");t(this,"_brushSphereUniforms");t(this,"_brushSpherePipeline");t(this,"_brushSphereBG");t(this,"_brushSphereUniBuf");t(this,"_brush",{enabled:!1,center:new E,radius:2,strength:.2});t(this,"_zeroU32",new Uint32Array([0]));t(this,"_densityUniBuf",new Float32Array(64));this._config=r,this._colorView=u,this._depthView=i,this._densityBuffer=s,this._vertexBuffer=n,this._vertexCounter=e,this._indirectBuffer=l,this._edgeTableBuffer=f,this._triTableBuffer=o,this._densityUniforms=a,this._mcUniforms=y,this._renderUniforms=_,this._densityPipeline=b,this._brushPipeline=v,this._marchPipeline=p,this._indirectPipeline=m,this._renderPipeline=d,this._densityBG=x,this._marchBG=G,this._renderBG=U,this._sphereMesh=S,this._brushSphereUniforms=w,this._brushSpherePipeline=B,this._brushSphereBG=P,this._brushSphereUniBuf=M}static create(r,u,i,s={}){const n={...c1,...s},{device:e}=r,l=n.gridSize[0]*n.gridSize[1]*n.gridSize[2],f=e.createBuffer({label:"McDensityBuffer",size:l*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),o=e.createBuffer({label:"McVertexBuffer",size:n.maxVertices*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.VERTEX}),a=e.createBuffer({label:"McVertexCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(a,0,new Uint32Array([0]));const y=e.createBuffer({label:"McIndirectBuffer",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(y,0,new Uint32Array([0,1,0,0]));const _=new Uint32Array(o1),b=e.createBuffer({label:"McEdgeTable",size:_.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(b,0,_);const v=new Int32Array(256*16);for(let O=0;O<256;O++)for(let A=0;A<16;A++)v[O*16+A]=d1[O][A];const p=e.createBuffer({label:"McTriTable",size:v.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(p,0,v);const m=e.createBuffer({label:"McDensityUniforms",size:256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=e.createBuffer({label:"McMarchUniforms",size:256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=e.createBuffer({label:"McRenderUniforms",size:512,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),G=e.createBindGroupLayout({label:"McDensityBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),U=e.createBindGroupLayout({label:"McMarchBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:6,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}}]}),S=e.createBindGroupLayout({label:"McRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),w=e.createShaderModule({label:"McDensityShader",code:t1}),B=e.createShaderModule({label:"McMarchShader",code:s1}),P=e.createShaderModule({label:"McRenderShader",code:a1}),M=e.createPipelineLayout({bindGroupLayouts:[G]}),z=e.createPipelineLayout({bindGroupLayouts:[U]}),D=e.createPipelineLayout({bindGroupLayouts:[S]}),C=e.createComputePipeline({label:"McDensityPipeline",layout:M,compute:{module:w,entryPoint:"cs_generate"}}),R=e.createComputePipeline({label:"McBrushPipeline",layout:M,compute:{module:w,entryPoint:"cs_brush"}}),L=e.createComputePipeline({label:"McMarchPipeline",layout:z,compute:{module:B,entryPoint:"cs_march"}}),k=e.createComputePipeline({label:"McIndirectPipeline",layout:z,compute:{module:B,entryPoint:"cs_write_indirect"}}),V=e.createRenderPipeline({label:"McRenderPipeline",layout:D,vertex:{module:P,entryPoint:"vs_main",buffers:[]},fragment:{module:P,entryPoint:"fs_main",targets:[{format:r.format}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),T=e.createBindGroup({label:"McDensityBG",layout:G,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:m}}]}),j=e.createBindGroup({label:"McMarchBG",layout:U,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:y}},{binding:4,resource:{buffer:d}},{binding:5,resource:{buffer:b}},{binding:6,resource:{buffer:p}}]}),I=e.createBindGroup({label:"McRenderBG",layout:S,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:o}}]}),h=new Float32Array(64);h[0]=n.gridSize[0],h[1]=n.gridSize[1],h[2]=n.gridSize[2],h[4]=n.isolevel,h[8]=n.gridExtent[0],h[9]=n.gridExtent[1],h[10]=n.gridExtent[2],h[12]=n.gridOffset[0],h[13]=n.gridOffset[1],h[14]=n.gridOffset[2],e.queue.writeBuffer(d,0,h);const H=i1.createSphere(e,1,16,16),q=e.createShaderModule({label:"McBrushSphereShader",code:u1}),Y=e.createBindGroupLayout({label:"McBrushSphereBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),X=e.createPipelineLayout({bindGroupLayouts:[Y]}),Z=e.createRenderPipeline({label:"McBrushSpherePipeline",layout:X,vertex:{module:q,entryPoint:"vs_main",buffers:[{arrayStride:48,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},fragment:{module:q,entryPoint:"fs_main",targets:[{format:r.format,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),W=e.createBuffer({label:"McBrushSphereUniforms",size:96,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),$=new Float32Array(24),J=e.createBindGroup({label:"McBrushSphereBG",layout:Y,entries:[{binding:0,resource:{buffer:W}}]});return new N(n,u,i,f,o,a,y,b,p,m,d,x,C,R,L,k,V,T,j,I,H,W,Z,J,$)}updateAttachments(r,u){this._colorView=r,this._depthView=u}setBrush(r,u,i,s=!0){this._brush.enabled=s,this._brush.center=r.clone(),this._brush.radius=u,this._brush.strength=i}updateCamera(r,u,i,s,n,e,l,f){const o=new Float32Array(70);let a=0;o.set(u.data,a),a+=16,o.set(i.data,a),a+=16,o.set(s.data,a),a+=16,o.set(n.data,a),a+=16,o[a++]=e.x,o[a++]=e.y,o[a++]=e.z,o[a++]=l,o[a]=f,this._viewProj=s,r.queue.writeBuffer(this._renderUniforms,0,o)}execute(r,u){const i=this._densityUniBuf;i[0]=this._config.gridSize[0],i[1]=this._config.gridSize[1],i[2]=this._config.gridSize[2],i[4]=this._config.isolevel,i[8]=this._config.gridExtent[0],i[9]=this._config.gridExtent[1],i[10]=this._config.gridExtent[2],i[12]=this._config.gridOffset[0],i[13]=this._config.gridOffset[1],i[14]=this._config.gridOffset[2],i[16]=this._config.noiseScale,i[17]=this._config.noiseHeight,i[18]=this._config.detailScale,i[19]=this._config.detailStrength,i[24]=this._brush.center.x,i[25]=this._brush.center.y,i[26]=this._brush.center.z,i[28]=this._brush.radius,i[29]=this._brush.strength,i[30]=this._brush.enabled?1:0,u.queue.writeBuffer(this._densityUniforms,0,i),u.queue.writeBuffer(this._vertexCounter,0,this._zeroU32);const s=r.beginComputePass({label:"McCompute"});this._generated||(s.setPipeline(this._densityPipeline),s.setBindGroup(0,this._densityBG),s.dispatchWorkgroups(Math.ceil(this._config.gridSize[0]/8),Math.ceil(this._config.gridSize[1]/4),Math.ceil(this._config.gridSize[2]/8)),this._generated=!0),this._brush.enabled&&(s.setPipeline(this._brushPipeline),s.setBindGroup(0,this._densityBG),s.dispatchWorkgroups(Math.ceil(this._config.gridSize[0]/8),Math.ceil(this._config.gridSize[1]/4),Math.ceil(this._config.gridSize[2]/8))),s.setPipeline(this._marchPipeline),s.setBindGroup(0,this._marchBG),s.dispatchWorkgroups(Math.ceil((this._config.gridSize[0]-1)/8),Math.ceil((this._config.gridSize[1]-1)/4),Math.ceil((this._config.gridSize[2]-1)/8)),s.setPipeline(this._indirectPipeline),s.setBindGroup(0,this._marchBG),s.dispatchWorkgroups(1),s.end();const n=r.beginRenderPass({label:"McRender",colorAttachments:[{view:this._colorView,loadOp:"clear",storeOp:"store",clearValue:{r:.45,g:.65,b:.9,a:1}}],depthStencilAttachment:{view:this._depthView,depthLoadOp:"clear",depthStoreOp:"store",depthClearValue:1}});n.setPipeline(this._renderPipeline),n.setBindGroup(0,this._renderBG),n.drawIndirect(this._indirectBuffer,0);{const e=this._brushSphereUniBuf;e.set(this._viewProj.data,0),e[16]=this._brush.center.x,e[17]=this._brush.center.y,e[18]=this._brush.center.z,e[19]=this._brush.radius,this._brush.strength>=0?(e[20]=0,e[21]=1,e[22]=0,e[23]=.25):(e[20]=1,e[21]=0,e[22]=0,e[23]=.25),u.device.queue.writeBuffer(this._brushSphereUniforms,0,e.buffer,e.byteOffset,e.byteLength),n.setPipeline(this._brushSpherePipeline),n.setBindGroup(0,this._brushSphereBG),n.setVertexBuffer(0,this._sphereMesh.vertexBuffer),n.setIndexBuffer(this._sphereMesh.indexBuffer,"uint32"),n.drawIndexed(this._sphereMesh.indexCount)}n.end()}destroy(){this._densityBuffer.destroy(),this._vertexBuffer.destroy(),this._vertexCounter.destroy(),this._indirectBuffer.destroy(),this._edgeTableBuffer.destroy(),this._triTableBuffer.destroy(),this._densityUniforms.destroy(),this._mcUniforms.destroy(),this._renderUniforms.destroy(),this._sphereMesh.destroy()}}async function l1(){const c=document.getElementById("canvas"),g=document.getElementById("fps");c.width=c.clientWidth*devicePixelRatio,c.height=c.clientHeight*devicePixelRatio;const r=await e1.create(c,{enableErrorHandling:!1}),u=r.device;let i=u.createTexture({label:"McDepthTexture",size:{width:r.width,height:r.height},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT});const s=new E(0,10,25),n=new r1(0,-15*Math.PI/180,15);n.usePointerLock=!1,n.attach(c);const e={position:s,rotation:{x:0,y:0,z:0,w:1}};let l=2,f=.2,o=!1,a=new E;window.addEventListener("keydown",d=>{d.key==="1"?(f=Math.abs(f),console.log("Add mode")):d.key==="2"?(f=-Math.abs(f),console.log("Remove mode")):d.key==="ArrowUp"?(l=Math.min(8,l+.5),console.log("Brush radius:",l)):d.key==="ArrowDown"&&(l=Math.max(.5,l-.5),console.log("Brush radius:",l))}),c.addEventListener("pointerdown",d=>{d.button===2&&(d.preventDefault(),o=!0)}),c.addEventListener("contextmenu",d=>{d.preventDefault()}),window.addEventListener("pointerup",d=>{d.button===2&&(o=!1)});const y=r.getCurrentTexture().createView(),_=N.create(r,y,i.createView());let b=performance.now(),v=0,p=0;async function m(){const d=performance.now(),x=(d-b)*.001;if(b=d,v++,p+=x,p>=.5){const j=Math.round(v/p);g.textContent=`FPS: ${j}`,v=0,p=0;const I=document.getElementById("brush-info"),h=f>0?"Add":"Remove";I.textContent=`Brush: ${h} | Radius: ${l.toFixed(1)}`}(r.canvas.width!==r.canvas.clientWidth*devicePixelRatio||r.canvas.height!==r.canvas.clientHeight*devicePixelRatio)&&(r.canvas.width=r.canvas.clientWidth*devicePixelRatio,r.canvas.height=r.canvas.clientHeight*devicePixelRatio,i.destroy(),i=u.createTexture({label:"McDepthTexture",size:{width:r.width,height:r.height},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT})),n.update(e,x);const U=Math.sin(n.yaw),S=Math.cos(n.yaw),w=Math.sin(n.pitch),B=Math.cos(n.pitch),P=new E(-U*B,-w,-S*B).normalize();a=s.add(P.scale(15));const M=s.add(P),z=F.lookAt(s,M,new E(0,1,0)),D=r.width/r.height,C=F.perspective(60*Math.PI/180,D,.1,200),R=C.multiply(z),L=R.invert();_.updateCamera(r,z,C,R,L,s,.1,200),_.setBrush(a,l,f,o);const V=r.getCurrentTexture().createView();_.updateAttachments(V,i.createView());const T=u.createCommandEncoder({label:"McMainEncoder"});_.enabled&&_.execute(T,r),u.queue.submit([T.finish()]),requestAnimationFrame(m)}m()}l1();
