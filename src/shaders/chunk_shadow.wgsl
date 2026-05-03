// Shadow pass for transparent chunk geometry — samples color atlas alpha for discard.
// Opaque chunks use the simpler shadow.wgsl (no fragment shader needed).

struct ShadowUniforms {
  lightViewProj: mat4x4<f32>,
}
struct ModelUniforms {
  model: mat4x4<f32>,
}
struct BlockData {
  sideTile  : u32,
  bottomTile: u32,
  topTile   : u32,
  _pad      : u32,
}

@group(0) @binding(0) var<uniform>       shadow    : ShadowUniforms;
@group(1) @binding(0) var<uniform>       model     : ModelUniforms;
@group(2) @binding(0) var                color_atlas: texture_2d<f32>;
@group(2) @binding(1) var                atlas_samp : sampler;
@group(2) @binding(2) var<storage, read> block_data : array<BlockData>;

const ATLAS_COLS: u32 = 25u;
const INV_COLS  : f32 = 1.0 / 25.0;
const INV_ROWS  : f32 = 1.0 / 25.0;

struct VertexInput {
  @location(0) position  : vec3<f32>,
  @location(1) face      : f32,
  @location(2) block_type: f32,
}

struct VertexOutput {
  @builtin(position)              clip_pos : vec4<f32>,
  @location(0)                    world_pos: vec3<f32>,
  @location(1) @interpolate(flat) face_f   : f32,
  @location(2) @interpolate(flat) block_f  : f32,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let wp = (model.model * vec4<f32>(vin.position, 1.0)).xyz;
  var out: VertexOutput;
  out.clip_pos  = shadow.lightViewProj * vec4<f32>(wp, 1.0);
  out.world_pos = wp;
  out.face_f    = vin.face;
  out.block_f   = vin.block_type;
  return out;
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

@fragment
fn fs_alpha_test(in: VertexOutput) {
  let uv = atlas_uv(in.world_pos, u32(in.face_f), u32(in.block_f));
  if textureSample(color_atlas, atlas_samp, uv).a < 0.5 { discard; }
}
