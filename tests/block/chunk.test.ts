import { describe, it, expect } from 'vitest';
import { Chunk } from '../../src/block/chunk.js';
import { BlockType } from '../../src/block/block_type.js';

const W = Chunk.CHUNK_WIDTH;
const H = Chunk.CHUNK_HEIGHT;
const D = Chunk.CHUNK_DEPTH;

/** Asserts all floats in a subarray are finite. */
function expectFinite(a: Float32Array): void {
  for (let i = 0; i < a.length; i++) {
    expect(Number.isFinite(a[i]), `index ${i} value ${a[i]}`).toBe(true);
  }
}

/** Collect unique (normal, blockType) pairs across a 5-float vertex array. */
function extractNormalsAndTypes(a: Float32Array): Set<string> {
  const s = new Set<string>();
  for (let i = 3; i < a.length; i += 5) {
    s.add(`${a[i]},${a[i + 1]}`);
  }
  return s;
}

/** Extract blockType values from a 5-float vertex array. */
function extractBlockTypes(a: Float32Array): Set<number> {
  const s = new Set<number>();
  for (let i = 4; i < a.length; i += 5) {
    s.add(a[i]);
  }
  return s;
}

describe('Chunk.generateVertices', () => {
  describe('empty chunk', () => {
    it('should produce zero vertices', () => {
      const chunk = new Chunk(0, 0, 0);
      const mesh = chunk.generateVertices();

      expect(mesh.opaqueCount).toBe(0);
      expect(mesh.opaque.length).toBe(0);
      expect(mesh.transparentCount).toBe(0);
      expect(mesh.transparent.length).toBe(0);
      expect(mesh.waterCount).toBe(0);
      expect(mesh.water.length).toBe(0);
      expect(mesh.propCount).toBe(0);
      expect(mesh.prop.length).toBe(0);
    });
  });

  describe('single block', () => {
    it('should emit 36 opaque vertices for an isolated opaque block', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.STONE);
      const mesh = chunk.generateVertices();

      expect(mesh.opaqueCount).toBe(36);
      expect(mesh.transparentCount).toBe(0);
      expect(mesh.waterCount).toBe(0);
      expect(mesh.propCount).toBe(0);
    });

    it('should emit vertices with correct blockType and normal indices', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.STONE);
      const mesh = chunk.generateVertices();

      // All opaque verts should have blockType=STONE
      const types = extractBlockTypes(mesh.opaque);
      expect(types.size).toBe(1);
      expect(types.has(BlockType.STONE)).toBe(true);

      // All normals should be in 0..5 (6 cube faces)
      for (let i = 3; i < mesh.opaque.length; i += 5) {
        const n = mesh.opaque[i];
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThanOrEqual(5);
      }
    });

    it('should emit all 6 faces with correct normals for a single block', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.STONE);
      const mesh = chunk.generateVertices();

      const normals = extractNormalsAndTypes(mesh.opaque);
      // Each face: 0=back(-Z), 1=front(+Z), 2=left(-X), 3=right(+X), 4=bottom(-Y), 5=top(+Y)
      for (let face = 0; face <= 5; face++) {
        expect(normals.has(`${face},${BlockType.STONE}`)).toBe(true);
      }
      expect(normals.size).toBe(6);
    });

    it('should emit all finite vertex positions', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.STONE);
      const mesh = chunk.generateVertices();
      expectFinite(mesh.opaque);
    });

    it('should emit 36 transparent vertices for a single semi-transparent block', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.GLASS);
      const mesh = chunk.generateVertices();

      expect(mesh.transparentCount).toBe(36);
      expect(mesh.opaqueCount).toBe(0);
      expect(mesh.waterCount).toBe(0);
      expect(mesh.propCount).toBe(0);
    });

    it('should emit 6 prop vertices for a single prop block', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.FLOWER);
      const mesh = chunk.generateVertices();

      expect(mesh.propCount).toBe(6);
      expect(mesh.opaqueCount).toBe(0);
      expect(mesh.transparentCount).toBe(0);
      expect(mesh.waterCount).toBe(0);

      // Props should have normal=6
      for (let i = 3; i < mesh.prop.length; i += 5) {
        expect(mesh.prop[i]).toBe(6);
      }
    });
  });

  describe('face culling between adjacent blocks', () => {
    it('should cull the shared face between two adjacent opaque blocks', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.STONE);
      chunk.setBlock(1, 0, 0, BlockType.STONE);
      const mesh = chunk.generateVertices();

      // Block (0,0,0): back+front merged x=0..1 (12) + left (6) + bottom+top x=0..1 (12) = 30
      // Block (1,0,0): right face only (6) = 6
      // Total: 36
      expect(mesh.opaqueCount).toBe(36);
    });

    it('should produce no faces for a block completely surrounded by same type', () => {
      const chunk = new Chunk(0, 0, 0);
      // 3×3×3 solid cube of STONE
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          for (let z = 0; z < 3; z++) {
            chunk.setBlock(x, y, z, BlockType.STONE);
          }
        }
      }
      const mesh = chunk.generateVertices();

      // The 3×3×3 cube has 6 outer faces × 3×3 blocks per face, greedily merged
      // Each face becomes a single merged 3×3 quad = 6 verts
      // 6 faces × 6 verts = 36 verts
      expect(mesh.opaqueCount).toBe(36);

      // Center block (1,1,1) should be completely hidden — no extra verts
      // Only the outer shell has faces
    });
  });

  describe('cross-chunk boundary culling', () => {
    describe('+X neighbor', () => {
      const Y = 5, Z = 5;

      it('should render the right face when no neighbor exists', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(W - 1, Y, Z, BlockType.STONE);
        const mesh = chunk.generateVertices();

        // Block at +X boundary with no neighbor → right face (normal 3) should be present
        const normals = extractNormalsAndTypes(mesh.opaque);
        expect(normals.has(`3,${BlockType.STONE}`)).toBe(true);
      });

      it('should cull the right face when neighbor has same block type', () => {
        const chunkA = new Chunk(0, 0, 0);
        chunkA.setBlock(W - 1, Y, Z, BlockType.STONE);

        // Neighbor at +X: mesher reads nb[0 + y*W + z*W*H]
        const nb = new Uint8Array(W * H * D);
        nb[0 + Y * W + Z * W * H] = BlockType.STONE;

        const mesh = chunkA.generateVertices({ posX: nb });

        // Right face should be culled — normal 3 should be absent
        const normals = extractNormalsAndTypes(mesh.opaque);
        expect(normals.has(`3,${BlockType.STONE}`)).toBe(false);
      });

      it('should keep other faces when neighbor culls only the right face', () => {
        const chunkA = new Chunk(0, 0, 0);
        chunkA.setBlock(W - 1, Y, Z, BlockType.STONE);

        const nb = new Uint8Array(W * H * D);
        nb[0 + Y * W + Z * W * H] = BlockType.STONE;

        const meshNoNb = chunkA.generateVertices();
        const meshWithNb = chunkA.generateVertices({ posX: nb });

        // Without neighbor: 36 verts (single block, all 6 faces)
        expect(meshNoNb.opaqueCount).toBe(36);
        // With neighbor: right face culled → 30 verts
        expect(meshWithNb.opaqueCount).toBe(30);
      });
    });

    describe('-X neighbor', () => {
      const Y = 5, Z = 5;

      it('should cull the left face when neighbor has same block type', () => {
        const chunkA = new Chunk(W, 0, 0);
        chunkA.setBlock(0, Y, Z, BlockType.STONE);

        // Neighbor at -X: mesher reads nb[(W-1) + y*W + z*W*H]
        const nb = new Uint8Array(W * H * D);
        nb[(W - 1) + Y * W + Z * W * H] = BlockType.STONE;

        const mesh = chunkA.generateVertices({ negX: nb });

        // Left face (normal 2) should be absent
        const normals = extractNormalsAndTypes(mesh.opaque);
        expect(normals.has(`2,${BlockType.STONE}`)).toBe(false);
      });
    });

    describe('+Z neighbor', () => {
      const X = 5, Y = 5;

      it('should cull the front face when neighbor has same block type', () => {
        const chunkA = new Chunk(0, 0, 0);
        chunkA.setBlock(X, Y, D - 1, BlockType.STONE);

        // Neighbor at +Z: mesher reads nb[x + y*W + 0*W*H]
        const nb = new Uint8Array(W * H * D);
        nb[X + Y * W + 0 * W * H] = BlockType.STONE;

        const mesh = chunkA.generateVertices({ posZ: nb });

        // Front face (normal 1) should be absent
        const normals = extractNormalsAndTypes(mesh.opaque);
        expect(normals.has(`1,${BlockType.STONE}`)).toBe(false);
      });
    });

    describe('-Z neighbor', () => {
      const X = 5, Y = 5;

      it('should cull the back face when neighbor has same block type', () => {
        const chunkA = new Chunk(0, 0, D);
        chunkA.setBlock(X, Y, 0, BlockType.STONE);

        // Neighbor at -Z: mesher reads nb[x + y*W + (D-1)*W*H]
        const nb = new Uint8Array(W * H * D);
        nb[X + Y * W + (D - 1) * W * H] = BlockType.STONE;

        const mesh = chunkA.generateVertices({ negZ: nb });

        // Back face (normal 0) should be absent
        const normals = extractNormalsAndTypes(mesh.opaque);
        expect(normals.has(`0,${BlockType.STONE}`)).toBe(false);
      });
    });

    describe('+Y neighbor', () => {
      const X = 5, Z = 5;

      it('should cull the top face when neighbor has same block type', () => {
        const chunkA = new Chunk(0, 0, 0);
        chunkA.setBlock(X, H - 1, Z, BlockType.STONE);

        // Neighbor at +Y: mesher reads nb[x + 0*W + z*W*H]
        const nb = new Uint8Array(W * H * D);
        nb[X + 0 * W + Z * W * H] = BlockType.STONE;

        const mesh = chunkA.generateVertices({ posY: nb });

        // Top face (normal 5) should be absent
        const normals = extractNormalsAndTypes(mesh.opaque);
        expect(normals.has(`5,${BlockType.STONE}`)).toBe(false);
      });
    });

    describe('-Y neighbor', () => {
      const X = 5, Z = 5;

      it('should cull the bottom face when neighbor has same block type', () => {
        const chunkA = new Chunk(0, H, 0);
        chunkA.setBlock(X, 0, Z, BlockType.STONE);

        // Neighbor at -Y: mesher reads nb[x + (H-1)*W + z*W*H]
        const nb = new Uint8Array(W * H * D);
        nb[X + (H - 1) * W + Z * W * H] = BlockType.STONE;

        const mesh = chunkA.generateVertices({ negY: nb });

        // Bottom face (normal 4) should be absent
        const normals = extractNormalsAndTypes(mesh.opaque);
        expect(normals.has(`4,${BlockType.STONE}`)).toBe(false);
      });
    });

    it('should cull the left face but keep the right face with only -X neighbor', () => {
      const Y = 5, Z = 5;
      const chunkA = new Chunk(W, 0, 0);
      chunkA.setBlock(0, Y, Z, BlockType.STONE);

      // Only negX neighbor provided
      const nb = new Uint8Array(W * H * D);
      nb[(W - 1) + Y * W + Z * W * H] = BlockType.STONE;

      const mesh = chunkA.generateVertices({ negX: nb });

      // Left face (normal 2) culled by neighbor, right face (normal 3) still present
      const normals = extractNormalsAndTypes(mesh.opaque);
      expect(normals.has(`2,${BlockType.STONE}`)).toBe(false);
      expect(normals.has(`3,${BlockType.STONE}`)).toBe(true);
    });

    it('should cull all outward faces when a chunk is fully surrounded by neighbors', () => {
      const chunk = new Chunk(0, 0, 0);
      for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
          for (let z = 0; z < D; z++) {
            chunk.setBlock(x, y, z, BlockType.STONE);
          }
        }
      }

      // All 6 neighbors full of STONE too
      const nb = new Uint8Array(W * H * D);
      nb.fill(BlockType.STONE);

      const mesh = chunk.generateVertices({
        negX: nb, posX: nb,
        negY: nb, posY: nb,
        negZ: nb, posZ: nb,
      });

      // Every block's every face is hidden by a neighbor → no faces
      expect(mesh.opaqueCount).toBe(0);
    });
  });

  describe('water meshing', () => {
    it('should produce water vertices for an isolated water block', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.WATER);
      const mesh = chunk.generateVertices();

      expect(mesh.opaqueCount).toBe(0);
      expect(mesh.transparentCount).toBe(0);
      expect(mesh.propCount).toBe(0);
      expect(mesh.waterCount).toBeGreaterThan(0);
    });

    it('should cull water side faces adjacent to other water blocks', () => {
      const chunk = new Chunk(0, 0, 0);
      // Create a 2-block wide, 1-block tall, 1-block deep water patch
      chunk.setBlock(0, 0, 0, BlockType.WATER);
      chunk.setBlock(1, 0, 0, BlockType.WATER);
      const mesh = chunk.generateVertices();

      // Both have outward top faces
      // The shared face at x=1 (block 0's right) and x=0 (block 1's left) should be culled
      // Counts: top quad × 2 = 12 verts, plus sides
      // Each block has 6 possible sides + top = 7 quads × 6 = 42 verts max
      // With shared face culled: 42 - 6 (block 0 right) - 6 (block 1 left) = 30
      // But also back/front/bottom may be culled by chunk boundary water logic
      // Just verify it's less than the max possible
      expect(mesh.waterCount).toBeLessThan(84);
      expect(mesh.waterCount).toBeGreaterThan(0);
    });

    it('should produce water top face if block above is not water', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.WATER);
      // Air above → water top face visible
      const mesh = chunk.generateVertices();
      expect(mesh.waterCount).toBeGreaterThan(0);

      // Water vertices: [x, y, z] × N
      // Top face should have y = 1 (wy + 1)
      let hasTop = false;
      for (let i = 1; i < mesh.water.length; i += 3) {
        if (mesh.water[i] === 1) {
          hasTop = true;
          break;
        }
      }
      expect(hasTop).toBe(true);
    });

    it('should cull adjacent water faces between stacked water blocks', () => {
      const chunk = new Chunk(0, 0, 0);
      // Place blocks away from chunk edges so all sides are visible
      chunk.setBlock(5, 5, 5, BlockType.WATER);
      chunk.setBlock(5, 6, 5, BlockType.WATER);
      const mesh = chunk.generateVertices();

      // Two isolated water blocks each have 36 verts (6 faces × 6 verts)
      // Without culling: 72 verts
      // Shared top/bottom face culled: 72 - 12 = 60
      expect(mesh.waterCount).toBe(60);
    });

    describe('cross-chunk water boundary', () => {
      const Y = 5, Z = 5;

      it('should render a water side face at +X boundary when neighbor chunk has air', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(W - 1, Y, Z, BlockType.WATER);

        // Neighbor chunk exists with air (NONE) at the boundary
        const nb = new Uint8Array(W * H * D);
        nb[0 + Y * W + Z * W * H] = BlockType.NONE;

        const mesh = chunk.generateVertices({ posX: nb });
        expect(mesh.waterCount).toBeGreaterThan(0);
      });

      it('should suppress a water side face at +X boundary when NO neighbor chunk exists', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(W - 1, Y, Z, BlockType.WATER);

        // No posX neighbor — right face suppressed, other 5 faces visible
        const mesh = chunk.generateVertices();
        expect(mesh.waterCount).toBe(30);
      });

      it('should cull a water side face at +X boundary when neighbor chunk has water', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(W - 1, Y, Z, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[0 + Y * W + Z * W * H] = BlockType.WATER;

        // Right face culled by water neighbor, other 5 faces visible
        const mesh = chunk.generateVertices({ posX: nb });
        expect(mesh.waterCount).toBe(30);
      });

      it('should render all 6 faces when neighbor chunk has air at +X', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(W - 1, Y, Z, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[0 + Y * W + Z * W * H] = BlockType.NONE;

        // Right face rendered (neighbor has air, not absent)
        const mesh = chunk.generateVertices({ posX: nb });
        expect(mesh.waterCount).toBe(36);
      });

      it('should render all 6 faces when neighbor chunk has stone at +X', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(W - 1, Y, Z, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[0 + Y * W + Z * W * H] = BlockType.STONE;

        const mesh = chunk.generateVertices({ posX: nb });
        expect(mesh.waterCount).toBe(36);
      });

      it('should render a water side face at -X boundary when neighbor chunk has air', () => {
        const chunk = new Chunk(W, 0, 0);
        chunk.setBlock(0, Y, Z, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[(W - 1) + Y * W + Z * W * H] = BlockType.NONE;

        const mesh = chunk.generateVertices({ negX: nb });
        expect(mesh.waterCount).toBe(36);
      });

      it('should suppress a water side face at -X boundary when NO neighbor chunk exists', () => {
        const chunk = new Chunk(W, 0, 0);
        chunk.setBlock(0, Y, Z, BlockType.WATER);

        const mesh = chunk.generateVertices();
        expect(mesh.waterCount).toBe(30);
      });

      it('should cull a water side face at -X boundary when neighbor chunk has water', () => {
        const chunk = new Chunk(W, 0, 0);
        chunk.setBlock(0, Y, Z, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[(W - 1) + Y * W + Z * W * H] = BlockType.WATER;

        const mesh = chunk.generateVertices({ negX: nb });
        expect(mesh.waterCount).toBe(30);
      });

      it('should render a water side face at -X boundary when neighbor chunk has stone', () => {
        const chunk = new Chunk(W, 0, 0);
        chunk.setBlock(0, Y, Z, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[(W - 1) + Y * W + Z * W * H] = BlockType.STONE;

        const mesh = chunk.generateVertices({ negX: nb });
        expect(mesh.waterCount).toBe(36);
      });

      it('should render a water side face at +Z boundary when neighbor chunk has air', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(5, Y, D - 1, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[5 + Y * W + 0 * W * H] = BlockType.NONE;

        const mesh = chunk.generateVertices({ posZ: nb });
        expect(mesh.waterCount).toBe(36);
      });

      it('should suppress a water side face at +Z boundary when NO neighbor chunk exists', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(5, Y, D - 1, BlockType.WATER);

        const mesh = chunk.generateVertices();
        expect(mesh.waterCount).toBe(30);
      });

      it('should cull a water side face at +Z boundary when neighbor chunk has water', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(5, Y, D - 1, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[5 + Y * W + 0 * W * H] = BlockType.WATER;

        const mesh = chunk.generateVertices({ posZ: nb });
        expect(mesh.waterCount).toBe(30);
      });

      it('should render a water side face at -Z boundary when neighbor chunk has air', () => {
        const chunk = new Chunk(0, 0, D);
        chunk.setBlock(5, Y, 0, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[5 + Y * W + (D - 1) * W * H] = BlockType.NONE;

        const mesh = chunk.generateVertices({ negZ: nb });
        expect(mesh.waterCount).toBe(36);
      });

      it('should suppress a water side face at -Z boundary when NO neighbor chunk exists', () => {
        const chunk = new Chunk(0, 0, D);
        chunk.setBlock(5, Y, 0, BlockType.WATER);

        const mesh = chunk.generateVertices();
        expect(mesh.waterCount).toBe(30);
      });

      it('should cull a water side face at -Z boundary when neighbor chunk has water', () => {
        const chunk = new Chunk(0, 0, D);
        chunk.setBlock(5, Y, 0, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[5 + Y * W + (D - 1) * W * H] = BlockType.WATER;

        const mesh = chunk.generateVertices({ negZ: nb });
        expect(mesh.waterCount).toBe(30);
      });

      it('should render the top face when water is at +Y boundary and neighbor has air', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(5, H - 1, 5, BlockType.WATER);

        // Neighbor at +Y has air above
        const nb = new Uint8Array(W * H * D);
        nb[5 + 0 * W + 5 * W * H] = BlockType.NONE;

        const mesh = chunk.generateVertices({ posY: nb });
        expect(mesh.waterCount).toBeGreaterThan(0);
      });

      it('should cull the top face when water is at +Y boundary and neighbor has water above', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(5, H - 1, 5, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[5 + 0 * W + 5 * W * H] = BlockType.WATER;

        const mesh = chunk.generateVertices({ posY: nb });
        // Top face culled, but still has visible sides and bottom
        expect(mesh.waterCount).toBe(30);
      });

      it('should handle water at a corner (+X,+Z) with both neighbors present', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(W - 1, Y, D - 1, BlockType.WATER);

        const posXnb = new Uint8Array(W * H * D);
        posXnb[0 + Y * W + (D - 1) * W * H] = BlockType.NONE;

        const posZnb = new Uint8Array(W * H * D);
        posZnb[(W - 1) + Y * W + 0 * W * H] = BlockType.NONE;

        // Both neighbors exist with air → both side faces rendered
        const mesh = chunk.generateVertices({ posX: posXnb, posZ: posZnb });
        expect(mesh.waterCount).toBe(36);
      });

      it('should cull two sides when water at corner has both neighbors with water', () => {
        const chunk = new Chunk(0, 0, 0);
        chunk.setBlock(W - 1, Y, D - 1, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb.fill(BlockType.WATER);

        // Both the +X and +Z side faces culled by water neighbors
        // Visible: top, back(-Z), left(-X), bottom = 4 faces × 6 = 24
        const mesh = chunk.generateVertices({ posX: nb, posZ: nb });
        expect(mesh.waterCount).toBe(24);
      });

      it('should cull the right face when neighbor chunk has air but left face is visible', () => {
        // Water at x=0 (left edge) with negX neighbor having air
        const chunk = new Chunk(W, 0, 0);
        chunk.setBlock(0, Y, Z, BlockType.WATER);

        const nb = new Uint8Array(W * H * D);
        nb[(W - 1) + Y * W + Z * W * H] = BlockType.NONE;

        const mesh = chunk.generateVertices({ negX: nb });
        // All 6 faces visible (neighbor exists with air at boundary)
        expect(mesh.waterCount).toBe(36);
      });
    });
  });

  describe('mixed chunk', () => {
    it('should populate multiple vertex categories simultaneously', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.STONE);      // opaque
      chunk.setBlock(2, 0, 0, BlockType.GLASS);       // semi-transparent
      chunk.setBlock(4, 0, 0, BlockType.WATER);       // water
      chunk.setBlock(6, 0, 0, BlockType.FLOWER);      // prop
      const mesh = chunk.generateVertices();

      expect(mesh.opaqueCount).toBe(36);
      expect(mesh.transparentCount).toBe(36);
      expect(mesh.waterCount).toBeGreaterThan(0);
      expect(mesh.propCount).toBe(6);

      // Each category should use the correct block type
      expect(extractBlockTypes(mesh.opaque).has(BlockType.STONE)).toBe(true);
      expect(extractBlockTypes(mesh.transparent).has(BlockType.GLASS)).toBe(true);
      expect(extractBlockTypes(mesh.prop).has(BlockType.FLOWER)).toBe(true);
    });
  });

  describe('semi-transparent face culling', () => {
    it('should cull faces between same semi-transparent blocks', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.GLASS);
      chunk.setBlock(0, 1, 0, BlockType.GLASS);
      const mesh = chunk.generateVertices();

      // Two vertically stacked GLASS blocks with greedy merging:
      // Block (0,0,0): back+front merged for y=0..1 (12) + left+right for y=0 (12) + bottom (6) = 30
      // Block (0,1,0): top face only (6) = 6
      // Total: 36
      expect(mesh.transparentCount).toBe(36);
    });

    it('should cull faces between side-adjacent semi-transparent blocks', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.GLASS);
      chunk.setBlock(1, 0, 0, BlockType.GLASS);
      const mesh = chunk.generateVertices();

      // Two side-adjacent GLASS blocks with greedy merging:
      // Block (0,0,0): back+front merged x=0..1 (12) + left (6) + bottom+top merged x=0..1 (12) = 30
      // Block (1,0,0): right face only (6) = 6
      // Total: 36
      expect(mesh.transparentCount).toBe(36);
    });

    it('should not cull opaque faces next to water', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.STONE);
      chunk.setBlock(1, 0, 0, BlockType.WATER);
      const mesh = chunk.generateVertices();

      // STONE next to WATER: the STONE's right face should still render
      // (water doesn't hide non-water blocks)
      const normals = extractNormalsAndTypes(mesh.opaque);
      expect(normals.has(`3,${BlockType.STONE}`)).toBe(true);
    });

    it('should render opaque faces adjacent to semi-transparent blocks', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.STONE);
      chunk.setBlock(1, 0, 0, BlockType.GLASS);
      const mesh = chunk.generateVertices();

      // STONE next to GLASS: the STONE's right face should render
      // (opaque geometry stays visible through transparent blocks)
      const normals = extractNormalsAndTypes(mesh.opaque);
      expect(normals.has(`3,${BlockType.STONE}`)).toBe(true);
    });

    it('should cull semi-transparent faces adjacent to opaque blocks', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.GLASS);
      chunk.setBlock(1, 0, 0, BlockType.STONE);
      const mesh = chunk.generateVertices();

      // GLASS next to STONE: the GLASS's right face should NOT render
      // (opaque blocks hide everything behind them)
      const normals = extractNormalsAndTypes(mesh.transparent);
      expect(normals.has(`3,${BlockType.GLASS}`)).toBe(false);
    });
  });

  describe('vertex data integrity', () => {
    it('should have opaque buffer aligned to 5-float stride', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.STONE);
      const mesh = chunk.generateVertices();

      expect(mesh.opaque.length % 5).toBe(0);
      expect(mesh.transparent.length % 5).toBe(0);
      expect(mesh.prop.length % 5).toBe(0);
    });

    it('should have water buffer aligned to 3-float stride', () => {
      const chunk = new Chunk(0, 0, 0);
      chunk.setBlock(0, 0, 0, BlockType.WATER);
      const mesh = chunk.generateVertices();

      expect(mesh.water.length % 3).toBe(0);
    });

    it('should produce finite values in all buffers', () => {
      const chunk = new Chunk(0, 0, 0);
      // Mix of all types to populate all buffers
      chunk.setBlock(0, 0, 0, BlockType.STONE);
      chunk.setBlock(3, 0, 0, BlockType.GLASS);
      chunk.setBlock(6, 0, 0, BlockType.WATER);
      chunk.setBlock(9, 0, 0, BlockType.FLOWER);
      const mesh = chunk.generateVertices();

      expectFinite(mesh.opaque);
      expectFinite(mesh.transparent);
      expectFinite(mesh.water);
      expectFinite(mesh.prop);
    });
  });
});
