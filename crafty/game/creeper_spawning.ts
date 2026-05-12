import { GameObject, Scene, MeshRenderer } from '../../src/engine/index.js';
import { PbrMaterial } from '../../src/engine/materials/pbr_material.js';
import { World, BlockType } from '../../src/block/index.js';
import type { Mesh } from '../../src/assets/mesh.js';
import { CreeperAI } from './components/creeper_ai.js';

const CREEPER_GREEN: [number, number, number, number] = [0.37, 0.62, 0.22, 1];

export function spawnCreeper(
  wx: number,
  wz: number,
  world: World,
  scene: Scene,
  bodyMesh: Mesh,
  headMesh: Mesh,
): void {
  const topY = world.getTopBlockY(wx, wz, 200);
  if (topY <= 0) {
    return;
  }

  const root = new GameObject('Creeper');
  root.position.set(wx + 0.5, topY, wz + 0.5);

  const bodyGO = new GameObject('Creeper.Body');
  bodyGO.position.set(0, 0.90, 0);
  bodyGO.addComponent(new MeshRenderer(bodyMesh, new PbrMaterial({ albedo: CREEPER_GREEN, roughness: 0.85 })));
  root.addChild(bodyGO);

  const headGO = new GameObject('Creeper.Head');
  headGO.position.set(0, 1.28, -0.14);
  headGO.addComponent(new MeshRenderer(headMesh, new PbrMaterial({ albedo: CREEPER_GREEN, roughness: 0.85 })));
  root.addChild(headGO);

  root.addComponent(new CreeperAI(world, scene));
  scene.add(root);
}

export function spawnCreepersAroundPoint(
  spawnX: number,
  spawnZ: number,
  count: number,
  world: World,
  scene: Scene,
  bodyMesh: Mesh,
  headMesh: Mesh,
): void {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const dist  = 12 + Math.random() * 20;
    spawnCreeper(
      Math.floor(spawnX + Math.cos(angle) * dist),
      Math.floor(spawnZ + Math.sin(angle) * dist),
      world, scene, bodyMesh, headMesh,
    );
  }
}
