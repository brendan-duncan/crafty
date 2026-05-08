import { GameObject, Scene, MeshRenderer } from '../../src/engine/index.js';
import { PbrMaterial } from '../../src/engine/materials/pbr_material.js';
import { World, BiomeType } from '../../src/block/index.js';
import type { Mesh } from '../../src/assets/mesh.js';
import { PigAI } from '../../src/engine/components/pig_ai.js';

const PINK:       [number, number, number, number] = [0.96, 0.70, 0.72, 1];
const SNOUT_PINK: [number, number, number, number] = [0.98, 0.76, 0.78, 1];

/**
 * Spawns a single pig (or baby pig) at world column (wx, wz).
 *
 * Only spawns on GrassyPlains biome. Scale 1.0 = adult, ~0.55 = baby.
 * The three meshes must already be built at the correct scale.
 */
export function spawnPig(
  wx: number,
  wz: number,
  world: World,
  scene: Scene,
  bodyMesh: Mesh,
  headMesh: Mesh,
  snoutMesh: Mesh,
  scale = 1.0,
): void {
  const topY = world.getTopBlockY(wx, wz, 200);
  if (topY <= 0) {
    return;
  }
  const biome = world.getBiomeAt(wx, topY, wz);
  if (biome !== BiomeType.GrassyPlains) {
    return;
  }

  const s = scale;
  const pigRoot = new GameObject('Pig');
  pigRoot.position.set(wx + 0.5, topY, wz + 0.5);

  // Body (contains legs + tail in its mesh); center lifted above ground.
  // bodyGO is at y = leg_height(0.20) + body_half(0.15) = 0.35 * s from root.
  const bodyGO = new GameObject('Pig.Body');
  bodyGO.position.set(0, 0.35 * s, 0);
  bodyGO.addComponent(new MeshRenderer(bodyMesh, new PbrMaterial({ albedo: PINK, roughness: 0.85 })));
  pigRoot.addChild(bodyGO);

  // Head: same height as body center, pushed forward.
  const headGO = new GameObject('Pig.Head');
  headGO.position.set(0, 0.35 * s, -0.48 * s);
  headGO.addComponent(new MeshRenderer(headMesh, new PbrMaterial({ albedo: PINK, roughness: 0.85 })));
  pigRoot.addChild(headGO);

  // Snout: slightly below head center, in front of the head.
  const snoutGO = new GameObject('Pig.Snout');
  snoutGO.position.set(0, 0.31 * s, -0.70 * s);
  snoutGO.addComponent(new MeshRenderer(snoutMesh, new PbrMaterial({ albedo: SNOUT_PINK, roughness: 0.80 })));
  pigRoot.addChild(snoutGO);

  pigRoot.addComponent(new PigAI(world));
  scene.add(pigRoot);
}

/**
 * Spawns a mixed group of adult and baby pigs scattered around a point.
 *
 * @param spawnX      - Centre X coordinate.
 * @param spawnZ      - Centre Z coordinate.
 * @param count       - Number of pigs to attempt (fewer may spawn due to biome checks).
 * @param babyChance  - Fraction of pigs that are babies (0–1, default 0.25).
 */
export function spawnPigsAroundPoint(
  spawnX: number,
  spawnZ: number,
  count: number,
  world: World,
  scene: Scene,
  bodyMesh: Mesh,
  headMesh: Mesh,
  snoutMesh: Mesh,
  babyBodyMesh: Mesh,
  babyHeadMesh: Mesh,
  babySnoutMesh: Mesh,
  babyChance = 0.25,
): void {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const dist  = 8 + Math.random() * 20;
    const wx = Math.floor(spawnX + Math.cos(angle) * dist);
    const wz = Math.floor(spawnZ + Math.sin(angle) * dist);
    const isBaby = Math.random() < babyChance;
    if (isBaby) {
      spawnPig(wx, wz, world, scene, babyBodyMesh, babyHeadMesh, babySnoutMesh, 0.55);
    } else {
      spawnPig(wx, wz, world, scene, bodyMesh, headMesh, snoutMesh, 1.0);
    }
  }
}
