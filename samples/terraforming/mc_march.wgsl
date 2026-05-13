const CORNERS: array<vec3<f32>, 8> = array<vec3<f32>, 8>(
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
