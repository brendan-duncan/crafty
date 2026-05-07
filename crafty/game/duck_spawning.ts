import { GameObject, Scene, MeshRenderer } from '../../src/engine/index.js';
import { PbrMaterial } from '../../src/engine/materials/pbr_material.js';
import { World, BiomeType, BlockType } from '../../src/block/index.js';
import type { Mesh } from '../../src/assets/mesh.js';
import { DuckAI } from '../../src/engine/components/duck_ai.js';

export function spawnDuck(
  wx: number,
  wz: number,
  world: World,
  scene: Scene,
  duckBodyMesh: Mesh,
  duckHeadMesh: Mesh,
  duckBillMesh: Mesh,
): void {
  const topY = world.getTopBlockY(wx, wz, 200);
  if (topY <= 0) {
    return;
  }
  const biome = world.getBiomeAt(wx, topY, wz);
  if (biome !== BiomeType.GrassyPlains) {
    return;
  }

  // Check if spawning over water - ducks should float on water surface
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
): void {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const dist  = 8 + Math.random() * 20;
    spawnDuck(
      Math.floor(spawnX + Math.cos(angle) * dist),
      Math.floor(spawnZ + Math.sin(angle) * dist),
      world,
      scene,
      duckBodyMesh,
      duckHeadMesh,
      duckBillMesh,
    );
  }
}
