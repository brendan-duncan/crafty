import { Vec3, perlinNoise3, perlinNoise3Seed, perlinRidgeNoise3, perlinTurbulenceNoise3, Random } from '../math/index.js';
import { BiomeType } from './biome_type.js';
import { BlockType, isBlockWater, isBlockProp, isBlockSemiTransparent, isBlockEmittingLight } from './block_type.js';

// Pre-loaded blocks from the 6 axis-aligned neighbor chunks.
// Pass Uint8Array references (not copies) so getType() can index them directly.
export interface ChunkNeighbors {
  negX?: Uint8Array;
  posX?: Uint8Array;
  negY?: Uint8Array;
  posY?: Uint8Array;
  negZ?: Uint8Array;
  posZ?: Uint8Array;
}

export interface ChunkMesh {
  opaque: Float32Array;
  opaqueCount: number;
  transparent: Float32Array;
  transparentCount: number;
  water: Float32Array;
  waterCount: number;
  prop: Float32Array;
  propCount: number;
}

export class Chunk {
  static CHUNK_WIDTH = 16;
  static CHUNK_HEIGHT = 16;
  static CHUNK_DEPTH = 16;
  static WATER_HEIGHT = 15;

  // Vertex positions for 6 faces × 6 verts = 36 verts, matches CUBE_POSITION_VERTICES in lc_chunk.c
  static readonly CUBE_VERTS = new Float32Array([
    // Back face (face 0, normal -Z)
    -0.5, -0.5, -0.5,   0.5,  0.5, -0.5,   0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,  -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5,
    // Front face (face 1, normal +Z)
    -0.5, -0.5,  0.5,   0.5, -0.5,  0.5,   0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,  -0.5,  0.5,  0.5,  -0.5, -0.5,  0.5,
    // Left face (face 2, normal -X)
    -0.5,  0.5,  0.5,  -0.5,  0.5, -0.5,  -0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,
    // Right face (face 3, normal +X)
     0.5,  0.5,  0.5,   0.5, -0.5, -0.5,   0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,   0.5,  0.5,  0.5,   0.5, -0.5,  0.5,
    // Bottom face (face 4, normal -Y)
    -0.5, -0.5, -0.5,   0.5, -0.5, -0.5,   0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,  -0.5, -0.5,  0.5,  -0.5, -0.5, -0.5,
    // Top face (face 5, normal +Y)
    -0.5,  0.5, -0.5,   0.5,  0.5,  0.5,   0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,  -0.5,  0.5, -0.5,  -0.5,  0.5,  0.5,
  ]);
  blocks = new Uint8Array(Chunk.CHUNK_WIDTH * Chunk.CHUNK_HEIGHT * Chunk.CHUNK_DEPTH);
  globalPosition = new Vec3();
  opaqueIndex = -1;
  transparentIndex = -1;
  waterIndex = -1;
  drawCommandIndex = -1;
  chunkDataIndex = -1;
  aabbTreeIndex = -1;
  aliveBlocks = 0;
  opaqueBlocks = 0;
  transparentBlocks = 0;
  waterBlocks = 0;
  lightBlocks = 0;
  isDeleted = false;

  constructor(px: number, py: number, pz: number) {
    this.globalPosition.set(px, py, pz);
  }

  // Vertex layout: [x, y, z, normal(0-5), blockType] — 5 floats per vertex.
  // Water vertices: [x, z] pairs — 2 floats per vertex.
  generateVertices(neighbors?: ChunkNeighbors): ChunkMesh {
    const W = Chunk.CHUNK_WIDTH;
    const H = Chunk.CHUNK_HEIGHT;
    const D = Chunk.CHUNK_DEPTH;
    const FLOATS_PER_VERT = 5;

    // Count blocks for tight buffer allocation
    let opaqueCount = 0;
    let semiTransCount = 0;
    let propCount = 0;
    for (let i = 0; i < this.blocks.length; i++) {
      const bt = this.blocks[i];
      if (bt === BlockType.NONE || isBlockWater(bt)) continue;
      if (isBlockProp(bt)) propCount++;
      else if (isBlockSemiTransparent(bt)) semiTransCount++;
      else opaqueCount++;
    }

    const opaqueBuffer = new Float32Array(opaqueCount * 36 * FLOATS_PER_VERT);
    const transparentBuffer = new Float32Array(semiTransCount * 36 * FLOATS_PER_VERT);
    const propBuffer = new Float32Array(propCount * 6 * FLOATS_PER_VERT);

    // drawnFaces[(x * H + y) * 6 + face] — bit z marks face as already merged into a quad
    const drawnFaces = new Uint16Array(W * H * 6);

    let opaqueIdx = 0;
    let transparentIdx = 0;
    let propIdx = 0;
    let hasWater = false;
    const waterXZ = new Uint8Array(W * D);  // [x * D + z] = 1 if water present

    const setBit = (x: number, y: number, z: number, face: number) => {
      drawnFaces[(x * H + y) * 6 + face] |= (1 << z);
    };
    const checkBit = (x: number, y: number, z: number, face: number): boolean => {
      return (drawnFaces[(x * H + y) * 6 + face] & (1 << z)) !== 0;
    };
    const getType = (x: number, y: number, z: number): number => {
      if (x < 0)   return neighbors?.negX ? neighbors.negX[(W - 1) + y * W + z * W * H] : BlockType.NONE;
      if (x >= W)  return neighbors?.posX ? neighbors.posX[0       + y * W + z * W * H] : BlockType.NONE;
      if (y < 0)   return neighbors?.negY ? neighbors.negY[x + (H - 1) * W + z * W * H] : BlockType.NONE;
      if (y >= H)  return neighbors?.posY ? neighbors.posY[x + 0       * W + z * W * H] : BlockType.NONE;
      if (z < 0)   return neighbors?.negZ ? neighbors.negZ[x + y * W + (D - 1) * W * H] : BlockType.NONE;
      if (z >= D)  return neighbors?.posZ ? neighbors.posZ[x + y * W + 0       * W * H] : BlockType.NONE;
      return this.blocks[x + y * W + z * W * H];
    };
    const skipCheck = (b1: number, b2: number): boolean => {
      if (b2 === BlockType.NONE) return false;
      if (isBlockProp(b1) || isBlockProp(b2)) return false;
      if (!isBlockWater(b1) && isBlockWater(b2)) return false;
      return true;
    };

    const cv = Chunk.CUBE_VERTS;

    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        for (let z = 0; z < D; z++) {
          const blockType = getType(x, y, z);
          if (blockType === BlockType.NONE) continue;

          if (isBlockWater(blockType)) {
            waterXZ[x * D + z] = 1;
            hasWater = true;
            continue;
          }

          const isProp = isBlockProp(blockType);

          if (isProp) {
            // Single camera-facing billboard quad centered in the block.
            // Vertex shader expands to corners using vertex_index % 6 + camera right/up.
            for (let v = 0; v < 6; v++) {
              propBuffer[propIdx++] = x + 0.5;
              propBuffer[propIdx++] = y + 0.5;
              propBuffer[propIdx++] = z + 0.5;
              propBuffer[propIdx++] = 6;         // face=6 signals billboard
              propBuffer[propIdx++] = blockType;
            }
            continue;
          }

          const useTransparent = isBlockSemiTransparent(blockType);

          const skipBack   = skipCheck(blockType, getType(x, y, z - 1)) || checkBit(x, y, z, 0);
          const skipFront  = skipCheck(blockType, getType(x, y, z + 1)) || checkBit(x, y, z, 1);
          const skipLeft   = skipCheck(blockType, getType(x - 1, y, z)) || checkBit(x, y, z, 2);
          const skipRight  = skipCheck(blockType, getType(x + 1, y, z)) || checkBit(x, y, z, 3);
          const skipBottom = skipCheck(blockType, getType(x, y - 1, z)) || checkBit(x, y, z, 4);
          const skipTop    = skipCheck(blockType, getType(x, y + 1, z)) || checkBit(x, y, z, 5);

          if (skipBack && skipFront && skipLeft && skipRight && skipBottom && skipTop) continue;

          // Find max Y extent shared by back/front and left/right sections
          let maxY = y;
          if (!skipBack || !skipFront || !skipLeft || !skipRight) {
            let ySearch = y;
            while (ySearch < H) {
              if (getType(x, ySearch, z) === blockType) {
                maxY = ySearch;
              } else {
                break;
              }
              ySearch++;
            }
          }

          // Back + Front: XY quads at fixed Z, greedy-merge in X then Y
          if (!skipBack || !skipFront) {
            let maxX = x;
            let xSearch = x;
            let maxY2 = 0;
            while (xSearch < W) {
              if (getType(xSearch, y, z) === blockType) {
                let ySearch = y;
                while (ySearch <= maxY) {
                  if (getType(xSearch, ySearch, z) === blockType) {
                    maxY2 = ySearch;
                  } else {
                    break;
                  }
                  ySearch++;
                }
                if (maxY2 === maxY) {
                  maxX = xSearch;
                  xSearch++;
                } else {
                  break;
                }
              } else {
                break;
              }
            }

            for (let xm = x; xm <= maxX; xm++) {
              for (let ym = y; ym <= maxY; ym++) {
                if (!skipBack)  setBit(xm, ym, z, 0);
                if (!skipFront) setBit(xm, ym, z, 1);
              }
            }

            let startI: number, endI: number;
            if (!skipBack && !skipFront) { startI = 0; endI = 12; }
            else if (!skipBack)          { startI = 0; endI = 6; }
            else                         { startI = 6; endI = 12; }

            const toAddX = maxX + 1 - x;
            const toAddY = maxY + 1 - y;
            const buf = useTransparent ? transparentBuffer : opaqueBuffer;
            let wi = useTransparent ? transparentIdx : opaqueIdx;

            for (let i = startI; i < endI; i++) {
              const vx = cv[i * 3], vy = cv[i * 3 + 1], vz = cv[i * 3 + 2];
              buf[wi++] = x + 0.5 * (toAddX - 1) + 0.5 + vx * toAddX;
              buf[wi++] = y + 0.5 * (toAddY - 1) + 0.5 + vy * toAddY;
              buf[wi++] = z + 0.5 + vz;
              buf[wi++] = i < 6 ? 0 : 1;
              buf[wi++] = blockType;
            }

            if (useTransparent) transparentIdx = wi; else opaqueIdx = wi;
          }

          // Left + Right: ZY quads at fixed X, greedy-merge in Z then Y
          if (!skipLeft || !skipRight) {
            let maxZ = z;
            let zSearch = z;
            let maxY2 = 0;
            while (zSearch < D) {
              if (getType(x, y, zSearch) === blockType) {
                let ySearch = y;
                while (ySearch <= maxY) {
                  if (getType(x, ySearch, zSearch) === blockType) {
                    maxY2 = ySearch;
                  } else {
                    break;
                  }
                  ySearch++;
                }
                if (maxY2 === maxY) {
                  maxZ = zSearch;
                  zSearch++;
                } else {
                  break;
                }
              } else {
                break;
              }
            }

            for (let zm = z; zm <= maxZ; zm++) {
              for (let ym = y; ym <= maxY; ym++) {
                if (!skipLeft)  setBit(x, ym, zm, 2);
                if (!skipRight) setBit(x, ym, zm, 3);
              }
            }

            let startI: number, endI: number;
            if (!skipLeft && !skipRight) { startI = 12; endI = 24; }
            else if (!skipLeft)          { startI = 12; endI = 18; }
            else                         { startI = 18; endI = 24; }

            const toAddZ = maxZ + 1 - z;
            const toAddY = maxY + 1 - y;
            const buf = useTransparent ? transparentBuffer : opaqueBuffer;
            let wi = useTransparent ? transparentIdx : opaqueIdx;

            for (let i = startI; i < endI; i++) {
              const vx = cv[i * 3], vy = cv[i * 3 + 1], vz = cv[i * 3 + 2];
              buf[wi++] = x + 0.5 + vx;
              buf[wi++] = y + 0.5 * (toAddY - 1) + 0.5 + vy * toAddY;
              buf[wi++] = z + 0.5 * (toAddZ - 1) + 0.5 + vz * toAddZ;
              buf[wi++] = i < 18 ? 2 : 3;
              buf[wi++] = blockType;
            }

            if (useTransparent) transparentIdx = wi; else opaqueIdx = wi;
          }

          // Bottom + Top: XZ quads at fixed Y, greedy-merge in X then Z
          if (!skipBottom || !skipTop) {
            let maxX = x;
            let xSearch = x;
            while (xSearch < W) {
              if (getType(xSearch, y, z) === blockType) {
                maxX = xSearch;
              } else {
                break;
              }
              xSearch++;
            }

            let maxZ = z;
            let zSearch = z;
            let maxX2 = 0;
            while (zSearch < D) {
              if (getType(x, y, zSearch) === blockType) {
                let xSearch2 = x;
                while (xSearch2 <= maxX) {
                  if (getType(xSearch2, y, zSearch) === blockType) {
                    maxX2 = xSearch2;
                  } else {
                    break;
                  }
                  xSearch2++;
                }
                if (maxX2 === maxX) {
                  maxZ = zSearch;
                  zSearch++;
                } else {
                  break;
                }
              } else {
                break;
              }
            }

            for (let xm = x; xm <= maxX; xm++) {
              for (let zm = z; zm <= maxZ; zm++) {
                if (!skipBottom) setBit(xm, y, zm, 4);
                if (!skipTop)    setBit(xm, y, zm, 5);
              }
            }

            let startI: number, endI: number;
            if (!skipBottom && !skipTop) { startI = 24; endI = 36; }
            else if (!skipBottom)        { startI = 24; endI = 30; }
            else                         { startI = 30; endI = 36; }

            const toAddX = maxX + 1 - x;
            const toAddZ = maxZ + 1 - z;
            const buf = useTransparent ? transparentBuffer : opaqueBuffer;
            let wi = useTransparent ? transparentIdx : opaqueIdx;

            for (let i = startI; i < endI; i++) {
              const vx = cv[i * 3], vy = cv[i * 3 + 1], vz = cv[i * 3 + 2];
              buf[wi++] = x + 0.5 * (toAddX - 1) + 0.5 + vx * toAddX;
              buf[wi++] = y + 0.5 + vy;
              buf[wi++] = z + 0.5 * (toAddZ - 1) + 0.5 + vz * toAddZ;
              buf[wi++] = i < 30 ? 4 : 5;
              buf[wi++] = blockType;
            }

            if (useTransparent) transparentIdx = wi; else opaqueIdx = wi;
          }
        }
      }
    }

    // Water: one quad per (x,z) cell that actually contains a water block.
    let waterBuffer = new Float32Array(0);
    let waterVertCount = 0;
    if (hasWater) {
      waterBuffer = new Float32Array(W * D * 6 * 2);
      let wi = 0;
      for (let wx = 0; wx < W; wx++) {
        for (let wz = 0; wz < D; wz++) {
          if (!waterXZ[wx * D + wz]) continue;
          waterBuffer[wi++] = wx;     waterBuffer[wi++] = wz;
          waterBuffer[wi++] = wx + 1; waterBuffer[wi++] = wz;
          waterBuffer[wi++] = wx + 1; waterBuffer[wi++] = wz + 1;
          waterBuffer[wi++] = wx;     waterBuffer[wi++] = wz;
          waterBuffer[wi++] = wx;     waterBuffer[wi++] = wz + 1;
          waterBuffer[wi++] = wx + 1; waterBuffer[wi++] = wz + 1;
        }
      }
      waterVertCount = wi / 2;
    }

    return {
      opaque: opaqueBuffer.subarray(0, opaqueIdx),
      opaqueCount: opaqueIdx / FLOATS_PER_VERT,
      transparent: transparentBuffer.subarray(0, transparentIdx),
      transparentCount: transparentIdx / FLOATS_PER_VERT,
      water: waterBuffer,
      waterCount: waterVertCount,
      prop: propBuffer.subarray(0, propIdx),
      propCount: propIdx / FLOATS_PER_VERT,
    };
  }

  generateBlocks(seed: number): void {
    // Pass 1: place all terrain blocks first so that up_block checks in pass 2
    // see the fully-populated chunk instead of uninitialized air.
    for (let z = 0; z < Chunk.CHUNK_DEPTH; z++) {
      for (let y = 0; y < Chunk.CHUNK_HEIGHT; y++) {
        for (let x = 0; x < Chunk.CHUNK_WIDTH; x++) {
          if (this.getBlock(x, y, z) !== BlockType.NONE) continue;
          const g_x = x + this.globalPosition.x;
          const g_y = y + this.globalPosition.y;
          const g_z = z + this.globalPosition.z;
          this.setBlock(x, y, z, this._generateBlock(g_x, g_y, g_z, seed));
        }
      }
    }
    // Pass 2: place props and trees now that the full terrain is in place.
    for (let z = 0; z < Chunk.CHUNK_DEPTH; z++) {
      for (let y = 0; y < Chunk.CHUNK_HEIGHT; y++) {
        for (let x = 0; x < Chunk.CHUNK_WIDTH; x++) {
          if (this.getBlock(x, y, z) === BlockType.NONE) continue;
          const g_x = x + this.globalPosition.x;
          const g_y = y + this.globalPosition.y;
          const g_z = z + this.globalPosition.z;
          this._generateAdditionalBlocks(x, y, z, g_x, g_y, g_z, seed);
        }
      }
    }
  }

  setBlock(x: number, y: number, z: number, blockId: number): void {
    if (x < 0 || x >= Chunk.CHUNK_WIDTH || y < 0 || y >= Chunk.CHUNK_HEIGHT || z < 0 || z >= Chunk.CHUNK_DEPTH) {
      return;
    }
    const index = x + y * Chunk.CHUNK_WIDTH + z * Chunk.CHUNK_WIDTH * Chunk.CHUNK_HEIGHT;
    const old = this.blocks[index];

    if (old !== BlockType.NONE) {
      this.aliveBlocks--;
      if (isBlockWater(old)) this.waterBlocks--;
      else if (isBlockSemiTransparent(old)) this.transparentBlocks--;
      else this.opaqueBlocks--;
      if (isBlockEmittingLight(old)) this.lightBlocks--;
    }

    this.blocks[index] = blockId;

    if (blockId !== BlockType.NONE) {
      this.aliveBlocks++;
      if (isBlockWater(blockId)) this.waterBlocks++;
      else if (isBlockSemiTransparent(blockId)) this.transparentBlocks++;
      else this.opaqueBlocks++;
      if (isBlockEmittingLight(blockId)) this.lightBlocks++;
    }
  }

  getBlock(x: number, y: number, z: number): number {
    if (x < 0 || x >= Chunk.CHUNK_WIDTH || y < 0 || y >= Chunk.CHUNK_HEIGHT || z < 0 || z >= Chunk.CHUNK_DEPTH) {
      return BlockType.NONE; // Air for out-of-bounds
    }
    const index = x + y * Chunk.CHUNK_WIDTH + z * Chunk.CHUNK_WIDTH * Chunk.CHUNK_HEIGHT;
    return this.blocks[index];
  }

  getBlockIndex(x: number, y: number, z: number): number {
    if (x < 0 || x >= Chunk.CHUNK_WIDTH || y < 0 || y >= Chunk.CHUNK_HEIGHT || z < 0 || z >= Chunk.CHUNK_DEPTH) {
      return -1; // Invalid index for out-of-bounds
    }
    const index = x + y * Chunk.CHUNK_WIDTH + z * Chunk.CHUNK_WIDTH * Chunk.CHUNK_HEIGHT;
    return index;
  }

  _generateAdditionalBlocks(p_x: number, p_y: number, p_z: number, _p_gX: number, p_gY: number, _p_gZ: number, _seed: number): void {
    const block_type = this.getBlock(p_x, p_y, p_z);

    const left_block = this.getBlock(p_x - 1, p_y, p_z);
    const right_block = this.getBlock(p_x + 1, p_y, p_z);
    const front_block = this.getBlock(p_x, p_y, p_z + 1);
    const back_block = this.getBlock(p_x, p_y, p_z - 1);
    const up_block = this.getBlock(p_x, p_y + 1, p_z);

    if (block_type == BlockType.SAND) {
      //Cactus
      if (p_gY > 0 && (Random.global.randomUint32() % 512) == 0) {
        const cactus_height = Random.global.randomUint32() % 5;
        for (let i = 0; i < cactus_height; i++) {
          this.setBlock(p_x, p_y + i, p_z, BlockType.CACTUS);
        }
      }
      //Dead bush
      else if ((Random.global.randomUint32() % 128) == 0) {
        this.setBlock(p_x, p_y + 1, p_z, BlockType.DEAD_BUSH);
      }
    } else if (block_type == BlockType.SNOW || block_type == BlockType.GRASS_SNOW) {
      //Dead bush
      if ((Random.global.randomUint32() % 16) == 0 && p_gY > 12 && (up_block == BlockType.NONE || isBlockWater(up_block)) && (left_block == BlockType.NONE || back_block == BlockType.NONE)) {
        this.setBlock(p_x, p_y + 1, p_z, BlockType.DEAD_BUSH);
      } else if ((Random.global.randomUint32() % 16) == 0 && p_gY > 12 && p_gY < 300 && p_y < Chunk.CHUNK_HEIGHT - 5 && p_x > 2 && p_z > 2 && p_x < Chunk.CHUNK_WIDTH - 2 &&
                 p_z < Chunk.CHUNK_DEPTH - 2 && up_block == BlockType.NONE && right_block == BlockType.NONE && front_block == BlockType.NONE && back_block == BlockType.NONE) {
        const MIN_TREE_HEIGHT = 5;

        //Generate trunk
        const tree_height = Math.max(Random.global.randomUint32() % 5, MIN_TREE_HEIGHT);

        for (let i = 0; i < tree_height; i++) {
          this.setBlock(p_x, p_y + i, p_z, BlockType.TRUNK);
        }

        //Generate tree leaves
        for (let iy = -2; iy <= 2; iy++) {
          const minH = (iy < -1 || iy > 1) ? 0 : -1;
          const maxH = (iy < -1 || iy > 1) ? 0 : 1;
          for (let ix = -1 + minH; ix <= 1 + maxH; ix++) {
            const x1 = Math.abs(ix - p_x);
            for (let iz = -1 + minH; iz <= 1 + maxH; iz++) {
              const z1 = Math.abs(iz - p_z);
              const total = ix * ix + iy * iy + iz * iz;

              const sample_block_type = this.getBlock(p_x + ix, p_y + tree_height + iy, p_z + iz);

              if (total + 2 < Random.global.randomUint32() % 24 && x1 != 2 - minH && x1 != 2 + maxH && z1 != 2 - minH && z1 != 2 + maxH &&
                  (sample_block_type == BlockType.NONE || sample_block_type == BlockType.SNOWYLEAVES)) {
                this.setBlock(p_x + ix, p_y + tree_height + iy, p_z + iz, BlockType.SNOWYLEAVES);
              }
            }
          }
        }
      }
    } else if (block_type == BlockType.GRASS || block_type == BlockType.DIRT) {
      //generate a tree (only on dry land — up_block must be air, not water)
      if ((Random.global.randomUint32() % 2) == 0 && p_gY > Chunk.WATER_HEIGHT && p_gY < 300 && p_y < Chunk.CHUNK_HEIGHT - 5 && p_x > 2 && p_z > 2 && p_x < Chunk.CHUNK_WIDTH - 2
            && p_z < Chunk.CHUNK_DEPTH - 2 && up_block == BlockType.NONE && right_block == BlockType.NONE && front_block == BlockType.NONE && back_block == BlockType.NONE) {
        const MIN_TREE_HEIGHT = 5;

        //Generate trunk
        const tree_height = Math.max(Random.global.randomUint32() % 5, MIN_TREE_HEIGHT);

        for (let i = 0; i < tree_height; i++) {
          this.setBlock(p_x, p_y + i, p_z, BlockType.TRUNK);
        }

        //Generate tree leaves
        for (let iy = -2; iy <= 2; iy++) {
          const minH = (iy < -1 || iy > 1) ? 0 : -1;
          const maxH = (iy < -1 || iy > 1) ? 0 : 1;
          for (let ix = -1 + minH; ix <= 1 + maxH; ix++) {
            const x1 = Math.abs(ix - p_x);
            for (let iz = -1 + minH; iz <= 1 + maxH; iz++) {
              const z1 = Math.abs(iz - p_z);
              const total = ix * ix + iy * iy + iz * iz;

              const sample_block_type = this.getBlock(p_x + ix, p_y + tree_height + iy, p_z + iz);

              if (total + 2 < Random.global.randomUint32() % 24 && x1 != 2 - minH && x1 != 2 + maxH && z1 != 2 - minH && z1 != 2 + maxH &&
                  (sample_block_type == BlockType.NONE || sample_block_type == BlockType.TREELEAVES)) {
                this.setBlock(p_x + ix, p_y + tree_height + iy, p_z + iz, BlockType.TREELEAVES);
              }
            }
          }
        }
      } else if (p_gY > Chunk.WATER_HEIGHT && up_block == BlockType.NONE && (left_block == BlockType.NONE || back_block == BlockType.NONE)) {
        //grass prop
        if ((Random.global.randomUint32() % 8) == 0) {
          this.setBlock(p_x, p_y + 1, p_z, BlockType.GRASS_PROP);
        }
        //flower prop
        else if ((Random.global.randomUint32() % 8) == 0) {
          this.setBlock(p_x, p_y + 1, p_z, BlockType.FLOWER);
        }
      }
    }
  }

  _generateBlock(p_x: number, p_y: number, p_z: number, seed: number): number {
    const biome = Chunk._determineBiome(p_x, p_z, seed);
    const surfaceHeight = this._calculateSurfaceHeight(p_x, p_y, p_z, seed, biome);

    if (p_y < surfaceHeight) {
      return this._generateBlockBasedOnBiome(biome, p_x, p_y, p_z, surfaceHeight);
    } else if (p_y < Chunk.WATER_HEIGHT + 1) {
      return BlockType.WATER;
    }
    return BlockType.NONE;
  }

  _generateBlockBasedOnBiome(biome: BiomeType, p_x: number, p_y: number, p_z: number, surfaceHeight: number): BlockType {
    const depth = Math.floor(surfaceHeight) - p_y; // 0 = surface block, 1 = one below, etc.
    const aboveWater = surfaceHeight > Chunk.WATER_HEIGHT;

    switch (biome) {
      case BiomeType.GrassyPlains: {
        if (depth === 0) return aboveWater ? BlockType.GRASS : BlockType.DIRT;
        if (depth <= 3)  return BlockType.DIRT;
        return BlockType.STONE;
      }
      case BiomeType.Desert: {
        if (depth <= 3) return BlockType.SAND;
        return BlockType.STONE;
      }
      case BiomeType.SnowyPlains: {
        if (depth === 0) return BlockType.GRASS_SNOW;
        if (depth <= 2)  return BlockType.SNOW;
        return BlockType.STONE;
      }
      case BiomeType.SnowyMountains: {
        if (depth === 0) return BlockType.GRASS_SNOW;
        if (depth <= 4)  return BlockType.SNOW;
        return BlockType.STONE;
      }
      case BiomeType.RockyMountains: {
        // Rare snow patches on exposed peaks
        if (depth === 0) {
          const patch = Math.abs(perlinTurbulenceNoise3(p_x / 64.0, p_y / 64.0, p_z / 64.0, 2.0, 0.6, 1));
          if (aboveWater && patch < 0.12) return BlockType.SNOW;
        }
        return BlockType.STONE;
      }
      default:
        return BlockType.GRASS;
    }
  }

  // Biome is determined from 2D (x, z) position only — y has no influence.
  // Uses three independent noise fields: temperature, moisture, and elevation.
  static _determineBiome(p_x: number, p_z: number, seed: number): BiomeType {
    const temperature = perlinNoise3Seed(p_x / 512.0, 0, p_z / 512.0, 0, 0, 0, seed + 31337);
    const moisture    = perlinNoise3Seed(p_x / 400.0, 0, p_z / 400.0, 0, 0, 0, seed + 99991);
    const elevation   = Math.abs(perlinNoise3Seed(p_x / 800.0, 0, p_z / 800.0, 0, 0, 0, seed + 7919));

    if (elevation > 0.48) {
      return temperature < 0.1 ? BiomeType.SnowyMountains : BiomeType.RockyMountains;
    }
    if (temperature < -0.28) return BiomeType.SnowyPlains;
    if (temperature > 0.32 && moisture < 0.0) return BiomeType.Desert;
    return BiomeType.GrassyPlains;
  }

  _calculateSurfaceHeight(p_x: number, p_y: number, p_z: number, seed: number, biome: BiomeType = BiomeType.GrassyPlains): number {
    this._calculateContinentalness(p_x, p_z);

    // Scale terrain amplitude and base offset per biome so each has a distinct feel.
    let amplitudeScale = 1.0;
    let baseOffset     = 0.0;
    switch (biome) {
      case BiomeType.SnowyMountains: amplitudeScale = 2.0; baseOffset = 16; break;
      case BiomeType.RockyMountains: amplitudeScale = 1.7; baseOffset = 10; break;
      case BiomeType.SnowyPlains:    amplitudeScale = 0.75; break;
      case BiomeType.Desert:         amplitudeScale = 0.35; baseOffset = 2; break;
      default:                       amplitudeScale = 1.0; break;
    }

    const surfaceHeightMultiplier = Math.abs(perlinNoise3Seed(p_x / 1024.0, 0, p_z / 1024.0, 0, 0, 0, seed) * 450) * amplitudeScale;
    let surfaceHeight = Math.abs(perlinNoise3Seed(p_x / 256.0, p_y / 512.0, p_z / 256.0, 0, 0, 0, seed) * surfaceHeightMultiplier);
    const flatness = perlinRidgeNoise3(p_x / 256.0, 0, p_z / 256.0, 2.0, 0.6, 1.2, 6) * 12;

    surfaceHeight += flatness + baseOffset;
    return surfaceHeight;
  }

  _calculateContinentalness(p_x: number, p_z: number): number {
    let noise = perlinNoise3(p_x / 2048.0, 0.0, p_z / 2048.0, 0, 0, 0);

    noise = Math.max(Math.min(noise, 1.0), -1.0);

    return noise;
  }
}
