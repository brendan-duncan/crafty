import { World } from '../../src/block/index.js';
import type { Chunk, ChunkMesh } from '../../src/block/index.js';
import type { Scene } from '../../src/engine/index.js';
import { Duck, Duckling } from './entities/duck_entity.js';
import { Pig } from './entities/pig_entity.js';
import { Creeper } from './entities/creeper_entity.js';
import { Bee } from './entities/bee_entity.js';

const CHUNK_SIZE     = 16;
const DUCK_CHANCE    = 0.15;
const PIG_CHANCE     = 0.20;
const CREEPER_CHANCE = 0.01;
const BEE_CHANCE     = 0.10;
const DUCKLING_CHANCE = 0.25;
const DUCKLING_COUNT  = 5;
const BABY_PIG_CHANCE = 0.25;

export function setupAnimalSpawning(world: World, scene: Scene): void {
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

    _spawnInColumn(cx, cz, world, scene);
  };
}

function _spawnInColumn(cx: number, cz: number, world: World, scene: Scene): void {
  const baseX = cx * CHUNK_SIZE;
  const baseZ = cz * CHUNK_SIZE;

  if (Math.random() < DUCK_CHANCE) {
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const wx = Math.floor(baseX + Math.random() * CHUNK_SIZE);
      const wz = Math.floor(baseZ + Math.random() * CHUNK_SIZE);
      const parent = Duck.spawn(wx, wz, world, scene);
      if (parent && Math.random() < DUCKLING_CHANCE) {
        for (let d = 0; d < DUCKLING_COUNT; d++) {
          Duckling.spawn(parent, world, scene);
        }
      }
    }
  }

  if (Math.random() < PIG_CHANCE) {
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const wx = Math.floor(baseX + Math.random() * CHUNK_SIZE);
      const wz = Math.floor(baseZ + Math.random() * CHUNK_SIZE);
      Pig.spawn(wx, wz, world, scene, Math.random() < BABY_PIG_CHANCE);
    }
  }

  if (Math.random() < CREEPER_CHANCE) {
    const wx = Math.floor(baseX + Math.random() * CHUNK_SIZE);
    const wz = Math.floor(baseZ + Math.random() * CHUNK_SIZE);
    Creeper.spawn(wx, wz, world, scene);
  }

  if (Math.random() < BEE_CHANCE) {
    const wx = Math.floor(baseX + Math.random() * CHUNK_SIZE);
    const wz = Math.floor(baseZ + Math.random() * CHUNK_SIZE);
    Bee.spawn(wx, wz, world, scene);
  }
}
