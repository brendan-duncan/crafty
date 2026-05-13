import { GameObject, Scene, MeshRenderer } from '../../../src/engine/index.js';
import { PbrMaterial } from '../../../src/renderer/materials/pbr_material.js';
import { World, BiomeType, BlockType } from '../../../src/block/index.js';
import { Mesh } from '../../../src/assets/mesh.js';
import { NPCEntity } from '../npc_entity.js';
import { BeeAI } from '../components/bee_ai.js';
import { createBeeBodyMesh, createBeeStripeMesh, createBeeHeadMesh, createBeeEyeMesh, createBeeWingMesh } from '../assets/bee_mesh.js';

const BEE_YELLOW: [number, number, number, number] = [0.95, 0.82, 0.15, 1];
const BEE_BLACK: [number, number, number, number] = [0.10, 0.10, 0.10, 1];
const BEE_BROWN: [number, number, number, number] = [0.30, 0.18, 0.08, 1];
const WING_WHITE: [number, number, number, number] = [0.95, 0.95, 0.98, 0.45];
const ROUGH = 0.7;

export class Bee extends NPCEntity {
  private static _body: Mesh | null = null;
  private static _stripe: Mesh | null = null;
  private static _head: Mesh | null = null;
  private static _eye: Mesh | null = null;
  private static _wing: Mesh | null = null;

  static flowerPositions = new Set<string>();

  static initMeshes(device: GPUDevice): void {
    if (!Bee._body) {
      Bee._body = createBeeBodyMesh(device);
      Bee._stripe = createBeeStripeMesh(device);
      Bee._head = createBeeHeadMesh(device);
      Bee._eye = createBeeEyeMesh(device);
      Bee._wing = createBeeWingMesh(device);
    }
  }

  static spawn(wx: number, wz: number, world: World, scene: Scene): Bee | null {
    const topY = world.getTopBlockY(wx, wz, 200);
    if (topY <= 0) return null;
    const biome = world.getBiomeAt(wx, topY, wz);
    if (biome !== BiomeType.GrassyPlains) return null;

    if (world.getBlockType(wx, topY + 1, wz) !== BlockType.NONE) return null;
    if (world.getBlockType(wx, topY + 2, wz) !== BlockType.NONE) return null;
    if (world.getBlockType(wx, topY + 3, wz) !== BlockType.NONE) return null;

    const flightAltitude = 2.5 + Math.random() * 1.5;

    const bee = new Bee(world, scene);
    bee.position.set(wx + 0.5, topY + flightAltitude, wz + 0.5);

    const yellowMat = new PbrMaterial({ albedo: BEE_YELLOW, roughness: ROUGH });
    const blackMat = new PbrMaterial({ albedo: BEE_BLACK, roughness: ROUGH });
    const brownMat = new PbrMaterial({ albedo: BEE_BROWN, roughness: ROUGH });
    const wingMat = new PbrMaterial({ albedo: WING_WHITE, roughness: 0.3, metallic: 0, transparent: true });

    const body = new GameObject('Bee.Body');
    body.addComponent(new MeshRenderer(Bee._body!, yellowMat));
    bee.addChild(body);

    const stripe1 = new GameObject('Bee.Stripe1');
    stripe1.position.set(0, 0, 0.06);
    stripe1.addComponent(new MeshRenderer(Bee._stripe!, blackMat));
    bee.addChild(stripe1);

    const stripe2 = new GameObject('Bee.Stripe2');
    stripe2.position.set(0, 0, 0.14);
    stripe2.addComponent(new MeshRenderer(Bee._stripe!, blackMat));
    bee.addChild(stripe2);

    const head = new GameObject('Bee.Head');
    head.position.set(0, 0.05, -0.19);
    head.addComponent(new MeshRenderer(Bee._head!, brownMat));
    bee.addChild(head);

    const eyeL = new GameObject('Bee.EyeL');
    eyeL.position.set(-0.045, 0.05, -0.22);
    eyeL.addComponent(new MeshRenderer(Bee._eye!, blackMat));
    bee.addChild(eyeL);

    const eyeR = new GameObject('Bee.EyeR');
    eyeR.position.set(0.045, 0.05, -0.22);
    eyeR.addComponent(new MeshRenderer(Bee._eye!, blackMat));
    bee.addChild(eyeR);

    const wingL = new GameObject('Bee.WingL');
    wingL.position.set(-0.10, 0.10, 0);
    wingL.addComponent(new MeshRenderer(Bee._wing!, wingMat));
    bee.addChild(wingL);

    const wingR = new GameObject('Bee.WingR');
    wingR.position.set(0.10, 0.10, 0);
    wingR.addComponent(new MeshRenderer(Bee._wing!, wingMat));
    bee.addChild(wingR);

    bee.addComponent(new BeeAI(world));
    scene.add(bee);
    return bee;
  }

  constructor(world: World, scene: Scene) {
    super('Bee', world, scene);
  }
}
