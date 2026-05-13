import { GameObject, Scene, MeshRenderer } from '../../src/engine/index.js';
import { PbrMaterial } from '../../src/renderer/materials/pbr_material.js';
import { World, BiomeType, BlockType } from '../../src/block/index.js';
import type { Mesh } from '../../src/assets/mesh.js';
import { BeeAI } from './components/bee_ai.js';

const BEE_YELLOW:  [number, number, number, number] = [0.95, 0.82, 0.15, 1];
const BEE_BLACK:   [number, number, number, number] = [0.10, 0.10, 0.10, 1];
const BEE_BROWN:   [number, number, number, number] = [0.30, 0.18, 0.08, 1];
const WING_WHITE:  [number, number, number, number] = [0.95, 0.95, 0.98, 0.45];

const ROUGH = 0.7;

/**
 * Spawns a single bee at world column (wx, wz).
 *
 * Only spawns on GrassyPlains biome with at least 3 blocks of vertical
 * clearance above the spawn point.
 */
export function spawnBee(
  wx: number,
  wz: number,
  world: World,
  scene: Scene,
  bodyMesh: Mesh,
  stripeMesh: Mesh,
  headMesh: Mesh,
  eyeMesh: Mesh,
  wingMesh: Mesh,
): void {
  const topY = world.getTopBlockY(wx, wz, 200);
  if (topY <= 0) {
    return;
  }
  const biome = world.getBiomeAt(wx, topY, wz);
  if (biome !== BiomeType.GrassyPlains) {
    return;
  }

  // Require 3 blocks of vertical clearance above the ground
  if (world.getBlockType(wx, topY + 1, wz) !== BlockType.NONE) return;
  if (world.getBlockType(wx, topY + 2, wz) !== BlockType.NONE) return;
  if (world.getBlockType(wx, topY + 3, wz) !== BlockType.NONE) return;

  const flightAltitude = 2.5 + Math.random() * 1.5;

  const beeRoot = new GameObject('Bee');
  beeRoot.position.set(wx + 0.5, topY + flightAltitude, wz + 0.5);

  const yellowMat = new PbrMaterial({ albedo: BEE_YELLOW, roughness: ROUGH });
  const blackMat  = new PbrMaterial({ albedo: BEE_BLACK,  roughness: ROUGH });
  const brownMat  = new PbrMaterial({ albedo: BEE_BROWN,  roughness: ROUGH });
  const wingMat   = new PbrMaterial({ albedo: WING_WHITE, roughness: 0.3, metallic: 0, transparent: true });

  // Body
  const bodyGO = new GameObject('Bee.Body');
  bodyGO.addComponent(new MeshRenderer(bodyMesh, yellowMat));
  beeRoot.addChild(bodyGO);

  // Stripes (two black bands across the back half)
  const stripe1 = new GameObject('Bee.Stripe1');
  stripe1.position.set(0, 0, 0.06);
  stripe1.addComponent(new MeshRenderer(stripeMesh, blackMat));
  beeRoot.addChild(stripe1);

  const stripe2 = new GameObject('Bee.Stripe2');
  stripe2.position.set(0, 0, 0.14);
  stripe2.addComponent(new MeshRenderer(stripeMesh, blackMat));
  beeRoot.addChild(stripe2);

  // Head (flat against the front of the body)
  const headGO = new GameObject('Bee.Head');
  headGO.position.set(0, 0.05, -0.19);
  headGO.addComponent(new MeshRenderer(headMesh, brownMat));
  beeRoot.addChild(headGO);

  // Eyes (flush against the front face of the head)
  const eyeL = new GameObject('Bee.EyeL');
  eyeL.position.set(-0.045, 0.05, -0.22);
  eyeL.addComponent(new MeshRenderer(eyeMesh, blackMat));
  beeRoot.addChild(eyeL);

  const eyeR = new GameObject('Bee.EyeR');
  eyeR.position.set(0.045, 0.05, -0.22);
  eyeR.addComponent(new MeshRenderer(eyeMesh, blackMat));
  beeRoot.addChild(eyeR);

  // Wings (two horizontal translucent wings on top)
  const wingL = new GameObject('Bee.WingL');
  wingL.position.set(-0.10, 0.10, 0);
  wingL.addComponent(new MeshRenderer(wingMesh, wingMat));
  beeRoot.addChild(wingL);

  const wingR = new GameObject('Bee.WingR');
  wingR.position.set(0.10, 0.10, 0);
  wingR.addComponent(new MeshRenderer(wingMesh, wingMat));
  beeRoot.addChild(wingR);

  beeRoot.addComponent(new BeeAI(world));
  scene.add(beeRoot);
}

/**
 * Spawns a group of bees scattered around a point.
 */
export function spawnBeesAroundPoint(
  spawnX: number,
  spawnZ: number,
  count: number,
  world: World,
  scene: Scene,
  bodyMesh: Mesh,
  stripeMesh: Mesh,
  headMesh: Mesh,
  eyeMesh: Mesh,
  wingMesh: Mesh,
): void {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const dist  = 8 + Math.random() * 20;
    spawnBee(
      Math.floor(spawnX + Math.cos(angle) * dist),
      Math.floor(spawnZ + Math.sin(angle) * dist),
      world, scene, bodyMesh, stripeMesh, headMesh, eyeMesh, wingMesh,
    );
  }
}
