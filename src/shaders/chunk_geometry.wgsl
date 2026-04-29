// GBuffer fill pass for voxel chunk geometry.
// Vertex layout: position(vec3f) + face(f32, 0-5) + blockType(f32).
// Writes albedo+roughness and normal+metallic (same encoding as geometry.wgsl).

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

struct ChunkUniforms {
  offset: vec3<f32>,
  _pad  : f32,
}

struct BlockData {
  sideTile  : u32,
  bottomTile: u32,
  topTile   : u32,
  _pad      : u32,
}

@group(0) @binding(0) var<uniform>       camera      : CameraUniforms;
@group(1) @binding(0) var                color_atlas : texture_2d<f32>;
@group(1) @binding(1) var                normal_atlas: texture_2d<f32>;
@group(1) @binding(2) var                mer_atlas   : texture_2d<f32>;
@group(1) @binding(3) var                atlas_samp  : sampler;
@group(1) @binding(4) var<storage, read> block_data  : array<BlockData>;
@group(2) @binding(0) var<uniform>       chunk       : ChunkUniforms;

const ATLAS_COLS: u32 = 25u;
const INV_COLS  : f32 = 1.0 / 25.0;
const INV_ROWS  : f32 = 1.0 / 25.0;

// World-space face normals, indexed by face id (0=back/-Z … 5=top/+Y)
const FACE_NORMALS = array<vec3<f32>, 6>(
  vec3<f32>( 0,  0, -1),  // 0 back  -Z
  vec3<f32>( 0,  0,  1),  // 1 front +Z
  vec3<f32>(-1,  0,  0),  // 2 left  -X
  vec3<f32>( 1,  0,  0),  // 3 right +X
  vec3<f32>( 0, -1,  0),  // 4 bottom-Y
  vec3<f32>( 0,  1,  0),  // 5 top   +Y
);

// Tangent xyz + bitangent handedness w for each face.
// B = cross(N, T) * w  →  TBN maps tangent-space normals to world space.
const FACE_TANGENTS = array<vec4<f32>, 6>(
  vec4<f32>( 1,  0,  0, 1),  // back
  vec4<f32>( 1,  0,  0, 1),  // front
  vec4<f32>( 0,  0,  1, 1),  // left
  vec4<f32>( 0,  0, -1, 1),  // right
  vec4<f32>( 1,  0,  0, 1),  // bottom
  vec4<f32>( 1,  0,  0, 1),  // top
);

struct VertexInput {
  @location(0) position  : vec3<f32>,
  @location(1) face      : f32,
  @location(2) block_type: f32,
}

struct VertexOutput {
  @builtin(position) clip_pos  : vec4<f32>,
  @location(0)       world_pos : vec3<f32>,
  @location(1)       world_norm: vec3<f32>,
  @location(2)       world_tan : vec4<f32>,
  @location(3)       face_f    : f32,
  @location(4)       block_f   : f32,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let wp   = vin.position + chunk.offset;
  let face = u32(vin.face);
  var out: VertexOutput;
  out.clip_pos   = camera.viewProj * vec4<f32>(wp, 1.0);
  out.world_pos  = wp;
  out.world_norm = FACE_NORMALS[face];
  out.world_tan  = FACE_TANGENTS[face];
  out.face_f     = vin.face;
  out.block_f    = vin.block_type;
  return out;
}

struct FragOutput {
  @location(0) albedo_roughness: vec4<f32>,
  @location(1) normal_metallic : vec4<f32>,
}

fn atlas_uv(world_pos: vec3<f32>, face: u32, block_type: u32) -> vec2<f32> {
  let bd = block_data[block_type];
  var tile: u32;
  if face == 4u      { tile = bd.bottomTile; }
  else if face == 5u { tile = bd.topTile; }
  else               { tile = bd.sideTile; }

  var local_uv: vec2<f32>;
  if face == 2u || face == 3u {
    local_uv = vec2<f32>(fract(world_pos.z), 1.0 - fract(world_pos.y));
  } else if face == 4u || face == 5u {
    local_uv = fract(world_pos.xz);
  } else {
    local_uv = vec2<f32>(fract(world_pos.x), 1.0 - fract(world_pos.y));
  }

  let tileX = f32(tile % ATLAS_COLS);
  let tileY = f32(tile / ATLAS_COLS);
  return (vec2<f32>(tileX, tileY) + local_uv) * vec2<f32>(INV_COLS, INV_ROWS);
}

fn shade(in: VertexOutput, uv: vec2<f32>) -> FragOutput {
  let albedo_samp = textureSample(color_atlas,  atlas_samp, uv);
  let mer         = textureSample(mer_atlas,     atlas_samp, uv);
  let n_ts        = textureSample(normal_atlas,  atlas_samp, uv).rgb * 2.0 - 1.0;

  let N       = normalize(in.world_norm);
  let T       = normalize(in.world_tan.xyz);
  let T_ortho = normalize(T - N * dot(T, N));
  let B       = cross(N, T_ortho) * in.world_tan.w;
  let tbn     = mat3x3<f32>(T_ortho, B, N);
  let mapped_N = normalize(tbn * n_ts);

  var out: FragOutput;
  out.albedo_roughness = vec4<f32>(albedo_samp.rgb, mer.b);
  out.normal_metallic  = vec4<f32>(mapped_N * 0.5 + 0.5, mer.r);
  return out;
}

@fragment
fn fs_opaque(in: VertexOutput) -> FragOutput {
  let uv = atlas_uv(in.world_pos, u32(in.face_f), u32(in.block_f));
  if textureSample(color_atlas, atlas_samp, uv).a < 0.5 { discard; }
  return shade(in, uv);
}

@fragment
fn fs_transparent(in: VertexOutput) -> FragOutput {
  let uv = atlas_uv(in.world_pos, u32(in.face_f), u32(in.block_f));
  if textureSample(color_atlas, atlas_samp, uv).a < 0.5 { discard; }
  return shade(in, uv);
}

// ---- Prop billboard -------------------------------------------------------

struct PropVertexOutput {
  @builtin(position) clip_pos : vec4<f32>,
  @location(0)       world_pos: vec3<f32>,
  @location(1)       uv       : vec2<f32>,
  @location(2)       block_f  : f32,
  @location(3)       face_norm: vec3<f32>,
}

fn billboard_offset(vid: u32) -> vec2<f32> {
  switch vid % 6u {
    case 0u: { return vec2<f32>(-0.5, -0.5); }
    case 1u: { return vec2<f32>( 0.5, -0.5); }
    case 2u: { return vec2<f32>(-0.5,  0.5); }
    case 3u: { return vec2<f32>( 0.5, -0.5); }
    case 4u: { return vec2<f32>( 0.5,  0.5); }
    default: { return vec2<f32>(-0.5,  0.5); }
  }
}

fn billboard_uv(vid: u32) -> vec2<f32> {
  switch vid % 6u {
    case 0u: { return vec2<f32>(0.0, 1.0); }
    case 1u: { return vec2<f32>(1.0, 1.0); }
    case 2u: { return vec2<f32>(0.0, 0.0); }
    case 3u: { return vec2<f32>(1.0, 1.0); }
    case 4u: { return vec2<f32>(1.0, 0.0); }
    default: { return vec2<f32>(0.0, 0.0); }
  }
}

@vertex
fn vs_prop(vin: VertexInput, @builtin(vertex_index) vid: u32) -> PropVertexOutput {
  let center = vin.position + chunk.offset;

  // Camera right and up from the view matrix rows (column-major storage).
  let cam_right = vec3<f32>(camera.view[0].x, camera.view[1].x, camera.view[2].x);
  let cam_up    = vec3<f32>(camera.view[0].y, camera.view[1].y, camera.view[2].y);

  let off = billboard_offset(vid);
  let wp  = center + cam_right * off.x + cam_up * off.y;

  var out: PropVertexOutput;
  out.clip_pos  = camera.viewProj * vec4<f32>(wp, 1.0);
  out.world_pos = wp;
  out.uv        = billboard_uv(vid);
  out.block_f   = vin.block_type;
  out.face_norm = normalize(camera.position - center);
  return out;
}

@fragment
fn fs_prop(in: PropVertexOutput) -> FragOutput {
  let tile  = block_data[u32(in.block_f)].sideTile;
  let tileX = f32(tile % ATLAS_COLS);
  let tileY = f32(tile / ATLAS_COLS);
  let uv    = (vec2<f32>(tileX, tileY) + in.uv) * vec2<f32>(INV_COLS, INV_ROWS);

  let albedo_samp = textureSample(color_atlas, atlas_samp, uv);
  if albedo_samp.a < 0.5 { discard; }

  let mer = textureSample(mer_atlas, atlas_samp, uv);
  let N   = normalize(in.face_norm);

  var out: FragOutput;
  out.albedo_roughness = vec4<f32>(albedo_samp.rgb, mer.b);
  out.normal_metallic  = vec4<f32>(N * 0.5 + 0.5, mer.r);
  return out;
}
