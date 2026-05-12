import { GameObject, Scene, MeshRenderer } from '../../src/engine/index.js';
import { PbrMaterial } from '../../src/renderer/materials/pbr_material.js';
import { World, BiomeType, BlockType } from '../../src/block/index.js';
import type { Mesh } from '../../src/assets/mesh.js';
import { DuckAI } from './components/duck_ai.js';
import { DucklingAI } from './components/duckling_ai.js';

const DUCKLING_COUNT  = 5;
const DUCKLING_SCALE  = 0.5;

export function spawnDuck(
  wx: number,
  wz: number,
  world: World,
  scene: Scene,
  duckBodyMesh: Mesh,
  duckHeadMesh: Mesh,
  duckBillMesh: Mesh,
): GameObject | null {
  const topY = world.getTopBlockY(wx, wz, 200);
  if (topY <= 0) {
    return null;
  }
  const biome = world.getBiomeAt(wx, topY, wz);
  if (biome !== BiomeType.GrassyPlains) {
    return null;
  }

  const blockBelow = world.getBlockType(Math.floor(wx), Math.floor(topY - 1), Math.floor(wz));
  const spawnY = blockBelow === BlockType.WATER ? Math.floor(topY - 0.05) : topY;

  const duckRoot = new GameObject('Duck');
  duckRoot.position.set(wx + 0.5, spawnY, wz + 0.5);

  const bodyGO = new GameObject('Duck.Body');
  bodyGO.position.set(0, 0.15, 0);
  bodyGO.addComponent(new MeshRenderer(duckBodyMesh, new PbrMaterial({ albedo: [0.93, 0.93, 0.93, 1], roughness: 0.9 })));
  duckRoot.addChild(bodyGO);

  const headGO = new GameObject('Duck.Head');
  headGO.position.set(0, 0.32, -0.12);
  headGO.addComponent(new MeshRenderer(duckHeadMesh, new PbrMaterial({ albedo: [0.08, 0.32, 0.10, 1], roughness: 0.9 })));
  duckRoot.addChild(headGO);

  const billGO = new GameObject('Duck.Bill');
  billGO.position.set(0, 0.27, -0.205);
  billGO.addComponent(new MeshRenderer(duckBillMesh, new PbrMaterial({ albedo: [1.0, 0.55, 0.05, 1], roughness: 0.8 })));
  duckRoot.addChild(billGO);

  duckRoot.addComponent(new DuckAI(world));
  scene.add(duckRoot);
  return duckRoot;
}

/**
 * Spawns a single duckling that follows {@link parentDuck}.
 *
 * The duckling is placed within 1.5 blocks of the parent's current position.
 * It uses a 0.5-scale version of the duck meshes and is colored yellow to
 * distinguish it from the adult.
 */
export function spawnDuckling(
  parentDuck: GameObject,
  world: World,
  scene: Scene,
  bodyMesh: Mesh,
  headMesh: Mesh,
  billMesh: Mesh,
): void {
  const angle = Math.random() * Math.PI * 2;
  const dist  = 0.5 + Math.random() * 1.0;
  const wx = parentDuck.position.x + Math.cos(angle) * dist;
  const wz = parentDuck.position.z + Math.sin(angle) * dist;

  const topY = world.getTopBlockY(Math.floor(wx), Math.floor(wz), 200);
  if (topY <= 0) {
    return;
  }

  const s = DUCKLING_SCALE;
  const root = new GameObject('Duckling');
  root.position.set(wx, topY, wz);

  const bodyGO = new GameObject('Duckling.Body');
  bodyGO.position.set(0, 0.15 * s, 0);
  bodyGO.addComponent(new MeshRenderer(bodyMesh, new PbrMaterial({ albedo: [0.95, 0.87, 0.25, 1], roughness: 0.9 })));
  root.addChild(bodyGO);

  const headGO = new GameObject('Duckling.Head');
  headGO.position.set(0, 0.32 * s, -0.12 * s);
  headGO.addComponent(new MeshRenderer(headMesh, new PbrMaterial({ albedo: [0.88, 0.78, 0.15, 1], roughness: 0.9 })));
  root.addChild(headGO);

  const billGO = new GameObject('Duckling.Bill');
  billGO.position.set(0, 0.27 * s, -0.205 * s);
  billGO.addComponent(new MeshRenderer(billMesh, new PbrMaterial({ albedo: [1.0, 0.55, 0.05, 1], roughness: 0.8 })));
  root.addChild(billGO);

  root.addComponent(new DucklingAI(parentDuck, world));
  scene.add(root);
}

export function spawnDucksAroundPoint(
  spawnX: number,
  spawnZ: number,
  count: number,
  world: World,
  scene: Scene,
  duckBodyMesh: Mesh,
  duckHeadMesh: Mesh,
  duckBillMesh: Mesh,
  ducklingBodyMesh: Mesh,
  ducklingHeadMesh: Mesh,
  ducklingBillMesh: Mesh,
  ducklingChance = 0.25,
): void {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const dist  = 8 + Math.random() * 20;
    const parentDuck = spawnDuck(
      Math.floor(spawnX + Math.cos(angle) * dist),
      Math.floor(spawnZ + Math.sin(angle) * dist),
      world,
      scene,
      duckBodyMesh,
      duckHeadMesh,
      duckBillMesh,
    );

    if (parentDuck && Math.random() < ducklingChance) {
      for (let d = 0; d < DUCKLING_COUNT; d++) {
        spawnDuckling(parentDuck, world, scene, ducklingBodyMesh, ducklingHeadMesh, ducklingBillMesh);
      }
    }
  }
}
