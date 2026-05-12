import { World } from '../../src/block/index.js';
import type { Chunk, ChunkMesh } from '../../src/block/index.js';
import type { Scene } from '../../src/engine/index.js';
import type { Mesh } from '../../src/assets/mesh.js';
import { spawnDuck, spawnDuckling } from './duck_spawning.js';
import { spawnPig } from './pig_spawning.js';
import { spawnCreeper } from './creeper_spawning.js';

const CHUNK_SIZE     = 16;
const DUCK_CHANCE    = 0.15;
const PIG_CHANCE     = 0.20;
const CREEPER_CHANCE = 0.08;
const DUCKLING_CHANCE = 0.25;
const DUCKLING_COUNT  = 5;
const BABY_PIG_CHANCE = 0.25;

export interface AnimalMeshes {
  duckBody: Mesh;    duckHead: Mesh;    duckBill: Mesh;
  ducklingBody: Mesh; ducklingHead: Mesh; ducklingBill: Mesh;
  pigBody: Mesh;     pigHead: Mesh;     pigSnout: Mesh;
  babyPigBody: Mesh; babyPigHead: Mesh; babyPigSnout: Mesh;
  creeperBody: Mesh; creeperHead: Mesh;
}

/**
 * Registers an {@link World.onChunkAdded} handler that spawns animals
 * throughout the world as new chunks are generated. Each XZ column is
 * processed at most once (regardless of how many vertical chunks are added
 * for that column) so animals don't pile up as underground layers load.
 *
 * Call this after any existing onChunkAdded handler is set (e.g. the renderer)
 * so that the renderer's callback is preserved.
 */
export function setupAnimalSpawning(world: World, scene: Scene, meshes: AnimalMeshes): void {
  // Column-level deduplication: key = "cx:cz" for the XZ chunk coordinate.
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

    _spawnInColumn(cx, cz, world, scene, meshes);
  };
}

function _spawnInColumn(cx: number, cz: number, world: World, scene: Scene, meshes: AnimalMeshes): void {
  const baseX = cx * CHUNK_SIZE;
  const baseZ = cz * CHUNK_SIZE;

  if (Math.random() < DUCK_CHANCE) {
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const wx = Math.floor(baseX + Math.random() * CHUNK_SIZE);
      const wz = Math.floor(baseZ + Math.random() * CHUNK_SIZE);
      const parent = spawnDuck(wx, wz, world, scene, meshes.duckBody, meshes.duckHead, meshes.duckBill);
      if (parent && Math.random() < DUCKLING_CHANCE) {
        for (let d = 0; d < DUCKLING_COUNT; d++) {
          spawnDuckling(parent, world, scene, meshes.ducklingBody, meshes.ducklingHead, meshes.ducklingBill);
        }
      }
    }
  }

  if (Math.random() < PIG_CHANCE) {
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const wx = Math.floor(baseX + Math.random() * CHUNK_SIZE);
      const wz = Math.floor(baseZ + Math.random() * CHUNK_SIZE);
      if (Math.random() < BABY_PIG_CHANCE) {
        spawnPig(wx, wz, world, scene, meshes.babyPigBody, meshes.babyPigHead, meshes.babyPigSnout, 0.55);
      } else {
        spawnPig(wx, wz, world, scene, meshes.pigBody, meshes.pigHead, meshes.pigSnout, 1.0);
      }
    }
  }

  if (Math.random() < CREEPER_CHANCE) {
    const wx = Math.floor(baseX + Math.random() * CHUNK_SIZE);
    const wz = Math.floor(baseZ + Math.random() * CHUNK_SIZE);
    spawnCreeper(wx, wz, world, scene, meshes.creeperBody, meshes.creeperHead);
  }
}
