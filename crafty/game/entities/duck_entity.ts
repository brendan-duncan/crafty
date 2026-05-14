import { GameObject, Scene, MeshRenderer } from '../../../src/engine/index.js';
import { PbrMaterial } from '../../../src/renderer/materials/pbr_material.js';
import { World, BiomeType, BlockType } from '../../../src/block/index.js';
import { Mesh } from '../../../src/assets/mesh.js';
import { NPCEntity } from '../npc_entity.js';
import { DuckAI } from '../components/duck_ai.js';
import { DucklingAI } from '../components/duckling_ai.js';
import { createDuckBodyMesh, createDuckHeadMesh, createDuckBillMesh } from '../assets/duck_mesh.js';

const DUCKLING_SCALE = 0.5;

export class Duck extends NPCEntity {
  private static _body: Mesh | null = null;
  private static _head: Mesh | null = null;
  private static _bill: Mesh | null = null;

  static initMeshes(device: GPUDevice): void {
    if (!Duck._body) {
      Duck._body = createDuckBodyMesh(device);
      Duck._head = createDuckHeadMesh(device);
      Duck._bill = createDuckBillMesh(device);
    }
  }

  static meshes(): { body: Mesh; head: Mesh; bill: Mesh } {
    return { body: Duck._body!, head: Duck._head!, bill: Duck._bill! };
  }

  static spawn(wx: number, wz: number, world: World, scene: Scene): Duck | null {
    const topY = world.getTopBlockY(wx, wz, 200);
    if (topY <= 0) return null;
    const biome = world.getBiomeAt(wx, topY, wz);
    if (biome !== BiomeType.GrassyPlains) return null;

    const blockBelow = world.getBlockType(Math.floor(wx), Math.floor(topY - 1), Math.floor(wz));
    const spawnY = blockBelow === BlockType.WATER ? Math.floor(topY - 0.05) : topY;

    const duck = new Duck(world, scene);
    duck.position.set(wx + 0.5, spawnY, wz + 0.5);

    const body = new GameObject({ name: 'Duck.Body' });
    body.position.set(0, 0.15, 0);
    body.addComponent(new MeshRenderer(Duck._body!, new PbrMaterial({ albedo: [0.93, 0.93, 0.93, 1], roughness: 0.9 })));
    duck.addChild(body);

    const head = new GameObject({ name: 'Duck.Head' });
    head.position.set(0, 0.32, -0.12);
    head.addComponent(new MeshRenderer(Duck._head!, new PbrMaterial({ albedo: [0.08, 0.32, 0.10, 1], roughness: 0.9 })));
    duck.addChild(head);

    const bill = new GameObject({ name: 'Duck.Bill' });
    bill.position.set(0, 0.27, -0.205);
    bill.addComponent(new MeshRenderer(Duck._bill!, new PbrMaterial({ albedo: [1.0, 0.55, 0.05, 1], roughness: 0.8 })));
    duck.addChild(bill);

    duck.addComponent(new DuckAI(world));
    scene.add(duck);
    return duck;
  }

  constructor(world: World, scene: Scene) {
    super('Duck', world, scene);
  }
}

export class Duckling extends NPCEntity {
  private static _body: Mesh | null = null;
  private static _head: Mesh | null = null;
  private static _bill: Mesh | null = null;

  static initMeshes(device: GPUDevice): void {
    if (!Duckling._body) {
      Duckling._body = createDuckBodyMesh(device, DUCKLING_SCALE);
      Duckling._head = createDuckHeadMesh(device, DUCKLING_SCALE);
      Duckling._bill = createDuckBillMesh(device, DUCKLING_SCALE);
    }
  }

  static spawn(parentDuck: Duck, world: World, scene: Scene): void {
    const angle = Math.random() * Math.PI * 2;
    const dist = 0.5 + Math.random() * 1.0;
    const wx = parentDuck.position.x + Math.cos(angle) * dist;
    const wz = parentDuck.position.z + Math.sin(angle) * dist;

    const topY = world.getTopBlockY(Math.floor(wx), Math.floor(wz), 200);
    if (topY <= 0) return;

    const s = DUCKLING_SCALE;
    const duckling = new Duckling(world, scene);
    duckling.position.set(wx, topY, wz);

    const body = new GameObject({ name: 'Duckling.Body' });
    body.position.set(0, 0.15 * s, 0);
    body.addComponent(new MeshRenderer(Duckling._body!, new PbrMaterial({ albedo: [0.95, 0.87, 0.25, 1], roughness: 0.9 })));
    duckling.addChild(body);

    const head = new GameObject({ name: 'Duckling.Head' });
    head.position.set(0, 0.32 * s, -0.12 * s);
    head.addComponent(new MeshRenderer(Duckling._head!, new PbrMaterial({ albedo: [0.88, 0.78, 0.15, 1], roughness: 0.9 })));
    duckling.addChild(head);

    const bill = new GameObject({ name: 'Duckling.Bill' });
    bill.position.set(0, 0.27 * s, -0.205 * s);
    bill.addComponent(new MeshRenderer(Duckling._bill!, new PbrMaterial({ albedo: [1.0, 0.55, 0.05, 1], roughness: 0.8 })));
    duckling.addChild(bill);

    duckling.addComponent(new DucklingAI(parentDuck, world));
    scene.add(duckling);
  }

  constructor(world: World, scene: Scene) {
    super('Duckling', world, scene);
  }
}
