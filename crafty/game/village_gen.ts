import { World, BlockType, BiomeType, isBlockWater } from '../../src/block/index.js';
import type { Chunk, ChunkMesh } from '../../src/block/index.js';

const CHUNK_SIZE = 16;
const VILLAGE_CHANCE = 0.025;

const W = BlockType.SPRUCE_PLANKS;
const G = BlockType.GLASS;
const R = BlockType.SPRUCE_PLANKS;

// House footprint: 7 wide (X) x 5 deep (Z) x 4 tall (Y)
// Each cell: 0=air, 1=plank wall/floor, 2=glass, 3=roof
// y=0: floor
// y=1: walls with door opening (front center) and glass window (back center)
// y=2: walls with door opening continued
// y=3: flat roof
const _FLOOR: number[][] = [
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1],
];

const _WALL_L1: number[][] = [
  [1,1,1,2,1,1,1],  // z=0: back wall, glass at center x=3
  [1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1],
  [1,1,1,0,1,1,1],  // z=4: front wall, door opening at x=3
];

const _WALL_L2: number[][] = [
  [1,1,1,2,1,1,1],  // z=0: back wall, glass at center x=3
  [1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1],
  [1,0,0,0,0,0,1],
  [1,1,1,0,1,1,1],  // z=4: front wall, door opening continues at x=3
];

const _ROOF: number[][] = [
  [3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3],
];

function _placeHouse(cx: number, groundY: number, cz: number, world: World): void {
  const layers = [_FLOOR, _WALL_L1, _WALL_L2, _ROOF];
  for (let dy = 0; dy < layers.length; dy++) {
    const layer = layers[dy];
    for (let dz = 0; dz < 5; dz++) {
      for (let dx = 0; dx < 7; dx++) {
        const val = layer[dz][dx];
        if (val === 0) continue;
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
      if (block !== BlockType.NONE && isBlockWater(block)) return true;
    }
  }
  return false;
}

function _hasWaterUnderHouse(world: World, hx: number, hy: number, hz: number): boolean {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const block = world.getBlockType(hx + dx * 2, hy - 1, hz + dz * 2);
      if (block !== BlockType.NONE && isBlockWater(block)) return true;
    }
  }
  return false;
}

function _isFlatEnough(world: World, baseX: number, baseZ: number, refY: number): boolean {
  for (let dx = 0; dx < CHUNK_SIZE; dx += 4) {
    for (let dz = 0; dz < CHUNK_SIZE; dz += 4) {
      const y = world.getTopBlockY(baseX + dx, baseZ + dz, 200);
      if (y <= 0 || Math.abs(y - refY) > 1.5) return false;
    }
  }
  return true;
}

export function setupVillageGeneration(world: World): void {
  const processedColumns = new Set<string>();

  const prev = world.onChunkAdded;
  world.onChunkAdded = (chunk: Chunk, chunkMesh: ChunkMesh): void => {
    prev?.(chunk, chunkMesh);

    if (chunk.aliveBlocks === 0) return;

    const cx = Math.floor(chunk.globalPosition.x / CHUNK_SIZE);
    const cz = Math.floor(chunk.globalPosition.z / CHUNK_SIZE);
    const key = `${cx}:${cz}`;
    if (processedColumns.has(key)) return;
    processedColumns.add(key);

    const baseX = cx * CHUNK_SIZE;
    const baseZ = cz * CHUNK_SIZE;
    const centerWX = baseX + 8;
    const centerWZ = baseZ + 8;

    const topY = world.getTopBlockY(centerWX, centerWZ, 200);
    if (topY <= 0) return;

    // Reject columns where any sample point under the village is water
    if (_hasWaterUnderColumn(world, baseX, baseZ, topY)) return;

    const biome = world.getBiomeAt(centerWX, topY, centerWZ);
    if (biome !== BiomeType.GrassyPlains) return;

    if (!_isFlatEnough(world, baseX, baseZ, topY)) return;

    if (Math.random() >= VILLAGE_CHANCE) return;

    const houseCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < houseCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 4 + Math.random() * 6;
      const hx = Math.floor(centerWX + Math.cos(angle) * dist);
      const hz = Math.floor(centerWZ + Math.sin(angle) * dist);
      const hy = world.getTopBlockY(hx, hz, 200);
      if (hy <= 0) continue;
      if (Math.abs(hy - topY) > 1.5) continue;
      // Check the ground under the house footprint isn't water
      if (_hasWaterUnderHouse(world, hx, hy, hz)) continue;
      _placeHouse(hx, hy, hz, world);
    }
  };
}
