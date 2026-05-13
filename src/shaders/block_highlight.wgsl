// Block selection highlight — two draw calls sharing this shader:
//   draw(36): semi-transparent dark face overlay (6 faces × 2 triangles × 3 verts)
//   draw(36, 36): thick edge outlines (12 edges × 2 quads × 3 verts, offset into same array)
//
// Corner index encoding: bit 0 = x, bit 1 = y, bit 2 = z (0=min, 1=max side).

struct Uniforms {
  viewProj   : mat4x4<f32>,
  blockPos   : vec3<f32>,
  crackStage : f32,
}

@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var crack_atlas  : texture_2d<f32>;
@group(0) @binding(2) var crack_sampler: sampler;

// ── 36 vertices for 6 faces (triangle-list, cullMode=none) ──────────────────
// Each row: two triangles covering one face of the unit cube.
const FACE_CI: array<u32, 36> = array<u32, 36>(
  0u,3u,2u, 0u,1u,3u,   // -Z  (ci 0,1,2,3 → z=0 face)
  4u,6u,7u, 4u,7u,5u,   // +Z  (ci 4,5,6,7 → z=1 face)
  0u,6u,4u, 0u,2u,6u,   // -X  (ci 0,2,4,6 → x=0 face)
  1u,5u,7u, 1u,7u,3u,   // +X  (ci 1,3,5,7 → x=1 face)
  0u,5u,1u, 0u,4u,5u,   // -Y  (ci 0,1,4,5 → y=0 face)
  2u,3u,7u, 2u,7u,6u,   // +Y  (ci 2,3,6,7 → y=1 face)
);

// ── 72 vertices for 12 edges rendered as quads (triangle-list) ───────────────
// Each edge is two thin quads (one in each perpendicular plane), so 4 triangles.
// W = half-width of each quad in world units.
const W: f32 = 0.04;
const E: f32 = 0.002;   // small inset so edges sit on the block surface

// For each of the 12 cube edges, 6 vertices (2 triangles = 1 quad in the primary plane).
// We render each edge as two perpendicular quads by using a second index buffer offset.
// Layout: for edge i, primary-plane quad at [i*6 .. i*6+5].

// 12 edge corner-index pairs (each edge = two corners)
const EDGE_A: array<u32, 12> = array<u32, 12>(
  0u, 2u, 4u, 6u,   // X-axis edges (vary x, fix y,z)
  0u, 1u, 4u, 5u,   // Y-axis edges (vary y, fix x,z)
  0u, 1u, 2u, 3u,   // Z-axis edges (vary z, fix x,y)
);
const EDGE_B: array<u32, 12> = array<u32, 12>(
  1u, 3u, 5u, 7u,
  2u, 3u, 6u, 7u,
  4u, 5u, 6u, 7u,
);

// Per-edge offset axis for the primary quad: 0=X,1=Y,2=Z axis edges get perpendicular in Y or Z.
// We expand the primary quad by ±W in the "secondary" axis.
// Edge type 0 (X-axis): primary quad expands in Y → secondary in Z handled separately.
// Edge type 1 (Y-axis): primary quad expands in X → secondary in Z.
// Edge type 2 (Z-axis): primary quad expands in X → secondary in Y.
// We encode the expand axis for the primary quad as u32.
const EDGE_TYPE: array<u32, 12> = array<u32, 12>(
  0u,0u,0u,0u,   // X edges
  1u,1u,1u,1u,   // Y edges
  2u,2u,2u,2u,   // Z edges
);

fn ci_to_pos(ci: u32) -> vec3<f32> {
  return u.blockPos + vec3<f32>(
    mix(E, 1.0 - E, f32((ci >> 0u) & 1u)),
    mix(E, 1.0 - E, f32((ci >> 1u) & 1u)),
    mix(E, 1.0 - E, f32((ci >> 2u) & 1u)),
  );
}

// ── Vertex shader for the face overlay ──────────────────────────────────────

// Clip-space depth bias: subtract a fraction of clip.w from clip.z, which
// pushes the rasterised NDC depth toward the camera by a fixed 0.001 (1‰).
// Reliable across drivers/depth formats; the WebGPU `depthBias` pipeline
// state is implementation-defined for `depth32float`.
const Z_BIAS: f32 = 0.001;

fn bias_clip(clip: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(clip.x, clip.y, clip.z - Z_BIAS * clip.w, clip.w);
}

struct FaceOutput {
  @builtin(position) clip_pos : vec4<f32>,
  @location(0)       world_pos : vec3<f32>,
}

@vertex
fn vs_face(@builtin(vertex_index) vid: u32) -> FaceOutput {
  let ci  = FACE_CI[vid];
  let pos = u.blockPos + vec3<f32>(
    mix(-0.001, 1.001, f32((ci >> 0u) & 1u)),
    mix(-0.001, 1.001, f32((ci >> 1u) & 1u)),
    mix(-0.001, 1.001, f32((ci >> 2u) & 1u)),
  );
  var out: FaceOutput;
  out.clip_pos  = bias_clip(u.viewProj * vec4<f32>(pos, 1.0));
  out.world_pos = pos;
  return out;
}

// Crack overlay sampled from the last column of the block atlas.
// The atlas is 25 × 25 tiles; the rightmost column (x = 24) holds 9 crack
// stages stacked from top (least cracked) to bottom (most cracked).
const CRACK_ATLAS_TILES   : f32 = 25.0;
const CRACK_ATLAS_COL     : f32 = 24.0;
const CRACK_ATLAS_STAGES  : f32 = 9.0;

fn crack_alpha(local: vec3<f32>, stage: f32) -> f32 {
  if (stage < 0.5) { return 0.0; }

  // Pick the dominant face axis (largest distance from block center = the face
  // the fragment lies on) and derive 0..1 face UV from the other two axes.
  let dx = abs(local.x - 0.5);
  let dy = abs(local.y - 0.5);
  let dz = abs(local.z - 0.5);
  var face_uv: vec2<f32>;
  if (dx >= dy && dx >= dz) {
    face_uv = vec2<f32>(local.z, local.y);   // ±X face
  } else if (dy >= dx && dy >= dz) {
    face_uv = vec2<f32>(local.x, local.z);   // ±Y face
  } else {
    face_uv = vec2<f32>(local.x, local.y);   // ±Z face
  }

  // Pick the crack tile for this break stage (1 → top tile, 9 → bottom tile)
  // and remap face UV into the tile's slot in the atlas.
  let stage_idx = clamp(floor(stage) - 1.0, 0.0, CRACK_ATLAS_STAGES - 1.0);
  let atlas_uv = vec2<f32>(
    (CRACK_ATLAS_COL + face_uv.x) / CRACK_ATLAS_TILES,
    (stage_idx       + face_uv.y) / CRACK_ATLAS_TILES,
  );

  // The crack tile uses opaque dark pixels for the cracks; we treat luminance
  // inverse as the crack strength so a black crack pattern reads as a strong
  // dark overlay even on RGB-only crack textures.
  let s = textureSampleLevel(crack_atlas, crack_sampler, atlas_uv, 0.0);
  let lum = dot(s.rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
  return s.a * (1.0 - lum);
}

@fragment
fn fs_face(in: FaceOutput) -> @location(0) vec4<f32> {
  let crack = crack_alpha(in.world_pos - u.blockPos, u.crackStage);
  let alpha = min(0.35 + crack * 0.5, 0.9);
  return vec4<f32>(0.0, 0.0, 0.0, alpha);
}

// ── Vertex shader for edge quads ─────────────────────────────────────────────
// Each edge renders as two quads (primary + secondary perpendicular planes).
// First 72 vertices = primary plane quads, next 72 = secondary plane quads.

@vertex
fn vs_edge(@builtin(vertex_index) vid: u32) -> @builtin(position) vec4<f32> {
  let secondary = vid >= 72u;
  let local_vid = vid % 72u;
  let edge_idx  = local_vid / 6u;          // 0..11
  let vert_idx  = local_vid % 6u;          // 0..5 (two triangles: 012, 034... wait, 0-1-2, 0-2-3)

  let A = ci_to_pos(EDGE_A[edge_idx]);
  let B = ci_to_pos(EDGE_B[edge_idx]);

  // Quad vertex offsets along the perpendicular axis.
  // Quad pattern for 6 verts: 0=A-perp, 1=B-perp, 2=B+perp, 3=A+perp (→ tris 0,1,2 and 0,2,3)
  let quad_v = array<u32, 6>(0u, 1u, 2u, 0u, 2u, 3u);
  let qv     = quad_v[vert_idx];

  // Side flag: -1 for perp0, +1 for perp1
  let side = select(-W, W, qv == 1u || qv == 2u);
  // Endpoint flag: A or B
  let at_b = (qv == 1u || qv == 2u || (qv == 3u));  // B endpoints
  // Actually remap: 0→A-, 1→B-, 2→B+, 3→A+
  let use_b = (qv == 1u || qv == 2u);
  let base  = select(A, B, use_b);
  let sgn   = select(-W, W, qv == 2u || qv == 3u);

  let etype = EDGE_TYPE[edge_idx];
  var off = vec3<f32>(0.0);
  if (!secondary) {
    // Primary perpendicular axis
    if (etype == 0u) { off.y = sgn; }        // X-edge: expand in Y
    else if (etype == 1u) { off.x = sgn; }   // Y-edge: expand in X
    else { off.x = sgn; }                     // Z-edge: expand in X
  } else {
    // Secondary perpendicular axis
    if (etype == 0u) { off.z = sgn; }        // X-edge: expand in Z
    else if (etype == 1u) { off.z = sgn; }   // Y-edge: expand in Z
    else { off.y = sgn; }                     // Z-edge: expand in Y
  }

  return bias_clip(u.viewProj * vec4<f32>(base + off, 1.0));
}

@fragment
fn fs_edge() -> @location(0) vec4<f32> {
  return vec4<f32>(0.0, 0.0, 0.0, 0.8);
}
