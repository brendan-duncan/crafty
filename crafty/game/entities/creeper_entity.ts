import { GameObject, Scene, MeshRenderer } from '../../../src/engine/index.js';
import { PbrMaterial } from '../../../src/renderer/materials/pbr_material.js';
import { World } from '../../../src/block/index.js';
import { Mesh } from '../../../src/assets/mesh.js';
import { NPCEntity } from '../npc_entity.js';
import { CreeperAI } from '../components/creeper_ai.js';
import { createCreeperBodyMesh, createCreeperHeadMesh } from '../assets/creeper_mesh.js';

const CREEPER_GREEN: [number, number, number, number] = [0.37, 0.82, 0.22, 1];

export class Creeper extends NPCEntity {
  private static _body: Mesh | null = null;
  private static _head: Mesh | null = null;

  static onExplode: ((x: number, y: number, z: number) => void) | null = null;
  static onBlockDestroyed: ((x: number, y: number, z: number) => void) | null = null;

  static initMeshes(device: GPUDevice): void {
    if (!Creeper._body) {
      Creeper._body = createCreeperBodyMesh(device);
      Creeper._head = createCreeperHeadMesh(device);
    }
  }

  static spawn(wx: number, wz: number, world: World, scene: Scene): Creeper | null {
    const topY = world.getTopBlockY(wx, wz, 200);
    if (topY <= 0) return null;

    const creeper = new Creeper(world, scene);
    creeper.position.set(wx + 0.5, topY, wz + 0.5);

    const body = new GameObject('Creeper.Body');
    body.position.set(0, 0.90, 0);
    body.addComponent(new MeshRenderer(Creeper._body!, new PbrMaterial({ albedo: CREEPER_GREEN, roughness: 0.85 })));
    creeper.addChild(body);

    const head = new GameObject('Creeper.Head');
    head.position.set(0, 1.28, -0.14);
    head.addComponent(new MeshRenderer(Creeper._head!, new PbrMaterial({ albedo: CREEPER_GREEN, roughness: 0.85 })));
    creeper.addChild(head);

    creeper.addComponent(new CreeperAI(world, scene));
    scene.add(creeper);
    return creeper;
  }

  constructor(world: World, scene: Scene) {
    super('Creeper', world, scene);
  }
}
