import { GameObject, Scene, MeshRenderer } from '../../../src/engine/index.js';
import { PbrMaterial } from '../../../src/renderer/materials/pbr_material.js';
import { World, BiomeType } from '../../../src/block/index.js';
import { Mesh } from '../../../src/assets/mesh.js';
import { NPCEntity } from '../npc_entity.js';
import { PigAI } from '../components/pig_ai.js';
import { createPigBodyMesh, createPigHeadMesh, createPigSnoutMesh } from '../assets/pig_mesh.js';

const PINK: [number, number, number, number] = [0.96, 0.70, 0.72, 1];
const SNOUT_PINK: [number, number, number, number] = [0.98, 0.76, 0.78, 1];
const BABY_SCALE = 0.55;

export class Pig extends NPCEntity {
  private static _body: Mesh | null = null;
  private static _head: Mesh | null = null;
  private static _snout: Mesh | null = null;
  private static _babyBody: Mesh | null = null;
  private static _babyHead: Mesh | null = null;
  private static _babySnout: Mesh | null = null;

  static initMeshes(device: GPUDevice): void {
    if (!Pig._body) {
      Pig._body = createPigBodyMesh(device, 1.0);
      Pig._head = createPigHeadMesh(device, 1.0);
      Pig._snout = createPigSnoutMesh(device, 1.0);
      Pig._babyBody = createPigBodyMesh(device, BABY_SCALE);
      Pig._babyHead = createPigHeadMesh(device, BABY_SCALE);
      Pig._babySnout = createPigSnoutMesh(device, BABY_SCALE);
    }
  }

  static spawn(wx: number, wz: number, world: World, scene: Scene, isBaby = false): Pig | null {
    const topY = world.getTopBlockY(wx, wz, 200);
    if (topY <= 0) return null;
    const biome = world.getBiomeAt(wx, topY, wz);
    if (biome !== BiomeType.GrassyPlains) return null;

    const scale = isBaby ? BABY_SCALE : 1.0;
    const pig = new Pig(world, scene);
    pig.position.set(wx + 0.5, topY, wz + 0.5);

    const s = scale;
    const bodyMesh = isBaby ? Pig._babyBody! : Pig._body!;
    const headMesh = isBaby ? Pig._babyHead! : Pig._head!;
    const snoutMesh = isBaby ? Pig._babySnout! : Pig._snout!;

    const body = new GameObject({ name: 'Pig.Body' });
    body.position.set(0, 0.35 * s, 0);
    body.addComponent(new MeshRenderer(bodyMesh, new PbrMaterial({ albedo: PINK, roughness: 0.85 })));
    pig.addChild(body);

    const head = new GameObject({ name: 'Pig.Head' });
    head.position.set(0, 0.35 * s, -0.48 * s);
    head.addComponent(new MeshRenderer(headMesh, new PbrMaterial({ albedo: PINK, roughness: 0.85 })));
    pig.addChild(head);

    const snout = new GameObject({ name: 'Pig.Snout' });
    snout.position.set(0, 0.31 * s, -0.70 * s);
    snout.addComponent(new MeshRenderer(snoutMesh, new PbrMaterial({ albedo: SNOUT_PINK, roughness: 0.80 })));
    pig.addChild(snout);

    pig.addComponent(new PigAI(world));
    scene.add(pig);
    return pig;
  }

  constructor(world: World, scene: Scene) {
    super('Pig', world, scene);
  }
}
