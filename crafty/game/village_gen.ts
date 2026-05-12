import { World, BlockType, BiomeType, isBlockWater } from '../../src/block/index.js';
import type { Chunk, ChunkMesh } from '../../src/block/index.js';
import { Random } from '../../src/math/index.js';

const CHUNK_SIZE = 16;
const VILLAGE_CHANCE = 0.25;

const W = BlockType.SPRUCE_PLANKS;
const G = BlockType.GLASS;
const R = BlockType.SPRUCE_PLANKS;

const _FLOOR: number[][] = [
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
];

const _WALL_L1: number[][] = [
  [1,1,1,2,1,1,1],
  [1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1],
  [1,1,1,0,1,1,1],
];

const _WALL_L2: number[][] = [
  [1,1,1,2,1,1,1],
  [1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1],
  [1,1,1,0,1,1,1],
];

const _ROOF: number[][] = [
  [3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3],
];

function _placeHouse(cx: number, groundY: number, cz: number, world: World): void {
  for (let dz = 0; dz < 5; dz++) {
    for (let dx = 0; dx < 7; dx++) {
      const topY = world.getTopBlockY(cx + dx, cz + dz, 200);
      if (topY > groundY) {
        for (let clearY = groundY + 1; clearY <= topY; clearY++) {
          world.setBlockType(cx + dx, clearY, cz + dz, BlockType.NONE);
        }
      } else if (topY < groundY) {
        for (let fillY = topY + 1; fillY <= groundY; fillY++) {
          world.setBlockType(cx + dx, fillY, cz + dz, BlockType.DIRT);
        }
      }
    }
  }

  const layers = [_FLOOR, _WALL_L1, _WALL_L2, _ROOF];
  for (let dy = 0; dy < layers.length; dy++) {
    const layer = layers[dy];
    for (let dz = 0; dz < 5; dz++) {
      for (let dx = 0; dx < 7; dx++) {
        const val = layer[dz][dx];
        if (val === 0) {
          continue;
        }
        const blockType = val === 2 ? G : val === 3 ? R : W;
        world.setBlockType(cx + dx, groundY + dy, cz + dz, blockType);
      }
    }
  }
}

function _hasWaterUnderColumn(world: World, baseX: number, baseZ: number, refY: number): boolean {
  for (let dx = 4; dx <= 12; dx += 4) {
    for (let dz = 4; dz <= 12; dz += 4) {
      const block = world.getBlockType(baseX + dx, refY - 1, baseZ + dz);
      if (block !== BlockType.NONE && isBlockWater(block)) {
        return true;
      }
    }
  }
  return false;
}

function _hasWaterUnderHouse(world: World, hx: number, hy: number, hz: number): boolean {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const block = world.getBlockType(hx + dx * 2, hy - 1, hz + dz * 2);
      if (block !== BlockType.NONE && isBlockWater(block)) {
        return true;
      }
    }
  }
  return false;
}

function _isFlatEnough(world: World, baseX: number, baseZ: number, refY: number): boolean {
  for (let dx = 0; dx < CHUNK_SIZE; dx += 4) {
    for (let dz = 0; dz < CHUNK_SIZE; dz += 4) {
      const y = world.getTopBlockY(baseX + dx, baseZ + dz, 200);
      if (y <= 0 || Math.abs(y - refY) > 1.5) {
        return false;
      }
    }
  }
  return true;
}

function _chunkSeed(worldSeed: number, cx: number, cz: number): number {
  const A = 73856093;
  const B = 19349663;
  let n = worldSeed ^ (cx * A) ^ (cz * B);
  n = (n >>> 0) * 2654435761 >>> 0;
  n = (n ^ (n >>> 16)) >>> 0;
  return n;
}

export function setupVillageGeneration(world: World): void {
  const processedColumns = new Set<string>();

  const prev = world.onChunkAdded;
  world.onChunkAdded = (chunk: Chunk, chunkMesh: ChunkMesh): void => {
    prev?.(chunk, chunkMesh);

    if (chunk.aliveBlocks === 0) {
      return;
    }

    const cx = Math.floor(chunk.globalPosition.x / CHUNK_SIZE);
    const cz = Math.floor(chunk.globalPosition.z / CHUNK_SIZE);
    const key = `${cx}:${cz}`;
    if (processedColumns.has(key)) {
      return;
    }
    processedColumns.add(key);

    const baseX = cx * CHUNK_SIZE;
    const baseZ = cz * CHUNK_SIZE;
    const centerWX = baseX + 8;
    const centerWZ = baseZ + 8;

    const topY = world.getTopBlockY(centerWX, centerWZ, 200);
    if (topY <= 0) {
      return;
    }

    if (_hasWaterUnderColumn(world, baseX, baseZ, topY)) {
      return;
    }

    const biome = world.getBiomeAt(centerWX, topY, centerWZ);
    if (biome !== BiomeType.GrassyPlains) {
      return;
    }

    const rng = new Random(_chunkSeed(world.seed, cx, cz));

    if (rng.randomFloat() >= VILLAGE_CHANCE) {
      return;
    }

    const houseCount = 2 + Math.floor(rng.randomFloat(0, 3));
    for (let i = 0; i < houseCount; i++) {
      const angle = rng.randomFloat(0, Math.PI * 2);
      const dist = rng.randomFloat(4, 10);
      const hx = Math.floor(centerWX + Math.cos(angle) * dist);
      const hz = Math.floor(centerWZ + Math.sin(angle) * dist);
      const hy = world.getTopBlockY(hx, hz, 200);
      if (hy <= 0) {
        continue;
      }
      if (Math.abs(hy - topY) > 1.5) {
        continue;
      }
      if (_hasWaterUnderHouse(world, hx, hy, hz)) {
        continue;
      }
      _placeHouse(hx, hy, hz, world);
    }
  };
}
