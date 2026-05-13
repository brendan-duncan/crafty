import { Mat4, Vec3, Quaternion } from '../src/math/index.js';
import { ForwardPass } from '../src/renderer/passes/forward_pass.js';
import type { ForwardDrawItem } from '../src/renderer/passes/forward_pass.js';
import { DirectionalShadowPass } from '../src/renderer/passes/directional_shadow_pass.js';
import type { DirectionalShadowDrawItem } from '../src/renderer/passes/directional_shadow_pass.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { CameraControls } from '../src/engine/camera_controls.js';
import { Scene } from '../src/engine/scene.js';
import { GameObject } from '../src/engine/game_object.js';
import { MeshRenderer } from '../src/engine/components/mesh_renderer.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { Mesh } from '../src/assets/mesh.js';
import { BlockType } from '../src/block/block_type.js';
import { DuckAI } from '../crafty/game/components/duck_ai.js';
import { PigAI } from '../crafty/game/components/pig_ai.js';
import { CreeperAI } from '../crafty/game/components/creeper_ai.js';
import { BeeAI } from '../crafty/game/components/bee_ai.js';
import { createDuckBodyMesh, createDuckHeadMesh, createDuckBillMesh } from '../crafty/game/assets/duck_mesh.js';
import { createPigBodyMesh, createPigHeadMesh, createPigSnoutMesh } from '../crafty/game/assets/pig_mesh.js';
import { createCreeperBodyMesh, createCreeperHeadMesh } from '../crafty/game/assets/creeper_mesh.js';
import { createBeeBodyMesh, createBeeStripeMesh, createBeeHeadMesh, createBeeEyeMesh, createBeeWingMesh } from '../crafty/game/assets/bee_mesh.js';

interface HeadBob {
  go: GameObject;
  baseY: number;
  phase: number;
}

interface BeeWings {
  wingL: GameObject;
  wingR: GameObject;
  phase: number;
}

interface BeeHover {
  root: GameObject;
  phase: number;
}

interface AnimationState {
  roots: GameObject[];
  headBobs: HeadBob[];
  beeWings: BeeWings | null;
  beeHover: BeeHover | null;
}

const PLANE_Y = 0;

class MockWorld {
  getTopBlockY(_wx: number, _wz: number, _maxY: number): number {
    return PLANE_Y;
  }
  getBlockType(_wx: number, _wy: number, _wz: number): number {
    return BlockType.NONE;
  }
  mineBlock(_wx: number, _wy: number, _wz: number): boolean {
    return false;
  }
}

function buildDuck(device: GPUDevice, scene: Scene, world: MockWorld): AnimationState {
  const duckBodyMesh = createDuckBodyMesh(device);
  const duckHeadMesh = createDuckHeadMesh(device);
  const duckBillMesh = createDuckBillMesh(device);

  const root = new GameObject('Duck');
  root.position.set(0.5, PLANE_Y, 0.5);

  const bodyGO = new GameObject('Duck.Body');
  bodyGO.position.set(0, 0.15, 0);
  bodyGO.addComponent(new MeshRenderer(duckBodyMesh, new PbrMaterial({ albedo: [0.93, 0.93, 0.93, 1], roughness: 0.9 })));
  root.addChild(bodyGO);

  const headGO = new GameObject('Duck.Head');
  headGO.position.set(0, 0.32, -0.12);
  headGO.addComponent(new MeshRenderer(duckHeadMesh, new PbrMaterial({ albedo: [0.08, 0.32, 0.10, 1], roughness: 0.9 })));
  root.addChild(headGO);

  const billGO = new GameObject('Duck.Bill');
  billGO.position.set(0, 0.27, -0.205);
  billGO.addComponent(new MeshRenderer(duckBillMesh, new PbrMaterial({ albedo: [1.0, 0.55, 0.05, 1], roughness: 0.8 })));
  root.addChild(billGO);

  root.addComponent(new DuckAI(world as any));
  scene.add(root);

  return {
    roots: [root],
    headBobs: [{ go: headGO, baseY: headGO.position.y, phase: Math.random() * Math.PI * 2 }],
    beeWings: null,
    beeHover: null,
  };
}

function buildDuckFamily(device: GPUDevice, scene: Scene, world: MockWorld): AnimationState {
  const bodyMesh = createDuckBodyMesh(device);
  const headMesh = createDuckHeadMesh(device);
  const billMesh = createDuckBillMesh(device);
  const babyBodyMesh = createDuckBodyMesh(device, 0.5);
  const babyHeadMesh = createDuckHeadMesh(device, 0.5);
  const babyBillMesh = createDuckBillMesh(device, 0.5);

  const s = 0.5;
  const ducklingColors = [
    [0.95, 0.87, 0.25, 1] as [number, number, number, number],
    [0.92, 0.84, 0.22, 1] as [number, number, number, number],
    [0.97, 0.89, 0.28, 1] as [number, number, number, number],
    [0.90, 0.82, 0.20, 1] as [number, number, number, number],
    [0.88, 0.80, 0.18, 1] as [number, number, number, number],
  ];

  const roots: GameObject[] = [];
  const headBobs: HeadBob[] = [];

  // Parent duck at center
  const duckRoot = new GameObject('Duck');
  duckRoot.position.set(0.5, PLANE_Y, 0.5);

  const duckBody = new GameObject('Duck.Body');
  duckBody.position.set(0, 0.15, 0);
  duckBody.addComponent(new MeshRenderer(bodyMesh, new PbrMaterial({ albedo: [0.93, 0.93, 0.93, 1], roughness: 0.9 })));
  duckRoot.addChild(duckBody);

  const duckHead = new GameObject('Duck.Head');
  duckHead.position.set(0, 0.32, -0.12);
  duckHead.addComponent(new MeshRenderer(headMesh, new PbrMaterial({ albedo: [0.08, 0.32, 0.10, 1], roughness: 0.9 })));
  duckRoot.addChild(duckHead);

  const duckBill = new GameObject('Duck.Bill');
  duckBill.position.set(0, 0.27, -0.205);
  duckBill.addComponent(new MeshRenderer(billMesh, new PbrMaterial({ albedo: [1.0, 0.55, 0.05, 1], roughness: 0.8 })));
  duckRoot.addChild(duckBill);

  duckRoot.addComponent(new DuckAI(world as any));
  scene.add(duckRoot);
  roots.push(duckRoot);
  headBobs.push({ go: duckHead, baseY: duckHead.position.y, phase: Math.random() * Math.PI * 2 });

  // 5 ducklings in a circle around the parent
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const dist = 0.8 + Math.random() * 0.4;
    const dx = Math.cos(angle) * dist;
    const dz = Math.sin(angle) * dist;

    const dRoot = new GameObject('Duckling');
    dRoot.position.set(0.5 + dx, PLANE_Y, 0.5 + dz);

    const dBody = new GameObject('Duckling.Body');
    dBody.position.set(0, 0.15 * s, 0);
    dBody.addComponent(new MeshRenderer(babyBodyMesh, new PbrMaterial({ albedo: ducklingColors[i], roughness: 0.9 })));
    dRoot.addChild(dBody);

    const dHead = new GameObject('Duckling.Head');
    dHead.position.set(0, 0.32 * s, -0.12 * s);
    dHead.addComponent(new MeshRenderer(babyHeadMesh, new PbrMaterial({ albedo: [0.88, 0.78, 0.15, 1], roughness: 0.9 })));
    dRoot.addChild(dHead);

    const dBill = new GameObject('Duckling.Bill');
    dBill.position.set(0, 0.27 * s, -0.205 * s);
    dBill.addComponent(new MeshRenderer(babyBillMesh, new PbrMaterial({ albedo: [1.0, 0.55, 0.05, 1], roughness: 0.8 })));
    dRoot.addChild(dBill);

    dRoot.addComponent(new DuckAI(world as any));
    scene.add(dRoot);
    roots.push(dRoot);
    headBobs.push({ go: dHead, baseY: dHead.position.y, phase: Math.random() * Math.PI * 2 });
  }

  return {
    roots,
    headBobs,
    beeWings: null,
    beeHover: null,
  };
}

function buildPig(device: GPUDevice, scene: Scene, world: MockWorld): AnimationState {
  const bodyMesh = createPigBodyMesh(device);
  const headMesh = createPigHeadMesh(device);
  const snoutMesh = createPigSnoutMesh(device);

  const root = new GameObject('Pig');
  root.position.set(0.5, PLANE_Y, 0.5);

  const bodyGO = new GameObject('Pig.Body');
  bodyGO.position.set(0, 0.35, 0);
  bodyGO.addComponent(new MeshRenderer(bodyMesh, new PbrMaterial({ albedo: [0.96, 0.70, 0.72, 1], roughness: 0.85 })));
  root.addChild(bodyGO);

  const headGO = new GameObject('Pig.Head');
  headGO.position.set(0, 0.35, -0.48);
  headGO.addComponent(new MeshRenderer(headMesh, new PbrMaterial({ albedo: [0.96, 0.70, 0.72, 1], roughness: 0.85 })));
  root.addChild(headGO);

  const snoutGO = new GameObject('Pig.Snout');
  snoutGO.position.set(0, 0.31, -0.70);
  snoutGO.addComponent(new MeshRenderer(snoutMesh, new PbrMaterial({ albedo: [0.98, 0.76, 0.78, 1], roughness: 0.80 })));
  root.addChild(snoutGO);

  root.addComponent(new PigAI(world as any));
  scene.add(root);

  return {
    roots: [root],
    headBobs: [{ go: headGO, baseY: headGO.position.y, phase: Math.random() * Math.PI * 2 }],
    beeWings: null,
    beeHover: null,
  };
}

function buildCreeper(device: GPUDevice, scene: Scene, world: MockWorld): AnimationState {
  const bodyMesh = createCreeperBodyMesh(device);
  const headMesh = createCreeperHeadMesh(device);

  const root = new GameObject('Creeper');
  root.position.set(0.5, PLANE_Y, 0.5);

  const bodyGO = new GameObject('Creeper.Body');
  bodyGO.position.set(0, 0.90, 0);
  bodyGO.addComponent(new MeshRenderer(bodyMesh, new PbrMaterial({ albedo: [0.37, 0.82, 0.22, 1], roughness: 0.85 })));
  root.addChild(bodyGO);

  const headGO = new GameObject('Creeper.Head');
  headGO.position.set(0, 1.28, -0.14);
  headGO.addComponent(new MeshRenderer(headMesh, new PbrMaterial({ albedo: [0.37, 0.82, 0.22, 1], roughness: 0.85 })));
  root.addChild(headGO);

  root.addComponent(new CreeperAI(world as any, scene));
  scene.add(root);

  return {
    roots: [root],
    headBobs: [],
    beeWings: null,
    beeHover: null,
  };
}

function buildBee(device: GPUDevice, scene: Scene, world: MockWorld): AnimationState {
  const bodyMesh = createBeeBodyMesh(device);
  const stripeMesh = createBeeStripeMesh(device);
  const headMesh = createBeeHeadMesh(device);
  const eyeMesh = createBeeEyeMesh(device);
  const wingMesh = createBeeWingMesh(device);

  const flightAltitude = 2.5;

  const root = new GameObject('Bee');
  root.position.set(0.5, PLANE_Y + flightAltitude, 0.5);

  const yellowMat = new PbrMaterial({ albedo: [0.95, 0.82, 0.15, 1], roughness: 0.7 });
  const blackMat = new PbrMaterial({ albedo: [0.10, 0.10, 0.10, 1], roughness: 0.7 });
  const brownMat = new PbrMaterial({ albedo: [0.30, 0.18, 0.08, 1], roughness: 0.7 });
  const wingMat = new PbrMaterial({ albedo: [0.95, 0.95, 0.98, 0.45], roughness: 0.3, metallic: 0, transparent: true });

  const bodyGO = new GameObject('Bee.Body');
  bodyGO.addComponent(new MeshRenderer(bodyMesh, yellowMat));
  root.addChild(bodyGO);

  const stripe1 = new GameObject('Bee.Stripe1');
  stripe1.position.set(0, 0, 0.06);
  stripe1.addComponent(new MeshRenderer(stripeMesh, blackMat));
  root.addChild(stripe1);

  const stripe2 = new GameObject('Bee.Stripe2');
  stripe2.position.set(0, 0, 0.14);
  stripe2.addComponent(new MeshRenderer(stripeMesh, blackMat));
  root.addChild(stripe2);

  const headGO = new GameObject('Bee.Head');
  headGO.position.set(0, 0.05, -0.19);
  headGO.addComponent(new MeshRenderer(headMesh, brownMat));
  root.addChild(headGO);

  const eyeL = new GameObject('Bee.EyeL');
  eyeL.position.set(-0.045, 0.05, -0.22);
  eyeL.addComponent(new MeshRenderer(eyeMesh, blackMat));
  root.addChild(eyeL);

  const eyeR = new GameObject('Bee.EyeR');
  eyeR.position.set(0.045, 0.05, -0.22);
  eyeR.addComponent(new MeshRenderer(eyeMesh, blackMat));
  root.addChild(eyeR);

  const wingL = new GameObject('Bee.WingL');
  wingL.position.set(-0.10, 0.10, 0);
  wingL.addComponent(new MeshRenderer(wingMesh, wingMat));
  root.addChild(wingL);

  const wingR = new GameObject('Bee.WingR');
  wingR.position.set(0.10, 0.10, 0);
  wingR.addComponent(new MeshRenderer(wingMesh, wingMat));
  root.addChild(wingR);

  root.addComponent(new BeeAI(world as any));
  scene.add(root);

  return {
    roots: [root],
    headBobs: [],
    beeWings: { wingL, wingR, phase: Math.random() * Math.PI * 2 },
    beeHover: { root, phase: Math.random() * Math.PI * 2 },
  };
}

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const fpsEl = document.getElementById('fps')!;
  const select = document.getElementById('animal-select') as HTMLSelectElement;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const ctx = await RenderContext.create(canvas);
  const { device } = ctx;

  const planeMesh = Mesh.createPlane(device, 20, 20);
  const planeMaterial = new PbrMaterial({
    albedo: [0.5, 0.7, 0.5, 1.0],
    roughness: 0.9,
    metallic: 0.0,
  });

  const scene = new Scene();
  const world = new MockWorld();

  // Plane ground (static)
  const groundGO = new GameObject('Ground');
  groundGO.position.set(0, PLANE_Y, 0);
  const groundRenderer = groundGO.addComponent(new MeshRenderer(planeMesh, planeMaterial));
  groundRenderer.castShadow = false;
  scene.add(groundGO);

  // Forward pass + shadow pass
  const SHADOW_SIZE = 2048;
  const forwardPass = ForwardPass.create(ctx);
  const dirShadowTex = device.createTexture({
    label: 'DirShadowTex',
    size: { width: SHADOW_SIZE, height: SHADOW_SIZE },
    format: 'depth32float',
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
  });
  const dirShadowView = dirShadowTex.createView();
  const dirShadowPass = DirectionalShadowPass.create(ctx, dirShadowView);

  // Camera
  const camPos = new Vec3(0, 1.5, 3);
  const cameraControls = new CameraControls(0, 0.5, 3, 0.002);
  cameraControls.attach(canvas);

  // Animation state
  let animState: AnimationState | null = null;

  function buildAndShow(type: string) {
    // Remove previous animals
    if (animState) {
      for (const root of animState.roots) {
        scene.remove(root);
      }
    }

    switch (type) {
      case 'duck':
        animState = buildDuck(device, scene, world);
        break;
      case 'duckling':
        animState = buildDuckFamily(device, scene, world);
        break;
      case 'pig':
        animState = buildPig(device, scene, world);
        break;
      case 'creeper':
        animState = buildCreeper(device, scene, world);
        break;
      case 'bee':
        animState = buildBee(device, scene, world);
        break;
    }
  }

  select.addEventListener('change', () => buildAndShow(select.value));
  buildAndShow(select.value);

  // Timing
  let time = 0;
  let lastTime = performance.now();
  let frameCount = 0;
  let fpsAccum = 0;

  async function render() {
    const now = performance.now();
    const dt = (now - lastTime) * 0.001;
    lastTime = now;
    time += dt;

    frameCount++;
    fpsAccum += dt;
    if (fpsAccum >= 0.5) {
      fpsEl.textContent = `FPS: ${Math.round(frameCount / fpsAccum)}`;
      frameCount = 0;
      fpsAccum = 0;
    }

    if (ctx.canvas.width !== ctx.canvas.clientWidth || ctx.canvas.height !== ctx.canvas.clientHeight) {
      ctx.canvas.width = ctx.canvas.clientWidth;
      ctx.canvas.height = ctx.canvas.clientHeight;
      forwardPass.resize(device, ctx.width, ctx.height);
    }

    // Camera
    const fakeGO = {
      position: camPos,
      rotation: { x: 0, y: 0, z: 0, w: 1 },
    };
    cameraControls.update(fakeGO as any, dt);

    const sinY = Math.sin(cameraControls.yaw);
    const cosY = Math.cos(cameraControls.yaw);
    const sinP = Math.sin(cameraControls.pitch);
    const cosP = Math.cos(cameraControls.pitch);
    const forward = new Vec3(-sinY * cosP, -sinP, -cosY * cosP).normalize();
    const target = camPos.add(forward);
    const view = Mat4.lookAt(camPos, target, new Vec3(0, 1, 0));
    const aspect = ctx.width / ctx.height;
    const proj = Mat4.perspective(60 * Math.PI / 180, aspect, 0.1, 100);
    const viewProj = proj.multiply(view);
    const invViewProj = viewProj.invert();

    forwardPass.updateCamera(ctx, view, proj, viewProj, invViewProj, camPos, 0.1, 100);

    // Animate animals
    if (animState) {
      for (const hb of animState.headBobs) {
        hb.phase += dt * 2;
        hb.go.position.y = hb.baseY + Math.sin(hb.phase) * 0.008;
      }
      if (animState.beeWings) {
        animState.beeWings.phase += dt * 18;
        const angle = Math.sin(animState.beeWings.phase) * 0.4;
        const q = Quaternion.fromAxisAngle(new Vec3(1, 0, 0), angle);
        animState.beeWings.wingL.rotation = q;
        animState.beeWings.wingR.rotation = q;
      }
      if (animState.beeHover) {
        animState.beeHover.phase += dt * 2.5;
        const hoverOffset = Math.sin(animState.beeHover.phase) * 0.15;
        animState.beeHover.root.position.y = PLANE_Y + 2.5 + hoverOffset;
      }
    }

    // Sun
    const sunDir = new Vec3(0.4, -0.7, -0.5).normalize();
    const sceneCenter = new Vec3(0, 1, 0);
    const shadowDist = 25;
    const shadowCamPos = sceneCenter.sub(sunDir.scale(shadowDist));
    const lightView = Mat4.lookAt(shadowCamPos, sceneCenter, new Vec3(0, 1, 0));
    const lightProj = Mat4.orthographic(-12, 12, -12, 12, 1, 50);
    const lightViewProj = lightProj.multiply(lightView);

    const directionalLight = {
      direction: sunDir,
      intensity: 1.5,
      color: new Vec3(1.0, 0.95, 0.9),
      castShadows: true,
      lightViewProj,
      shadowMap: dirShadowView,
    };

    // Collect draw items from scene
    const meshRenderers = scene.collectMeshRenderers();
    const drawItems: ForwardDrawItem[] = meshRenderers.map((mr) => {
      const w = mr.gameObject.localToWorld();
      return {
        mesh: mr.mesh,
        modelMatrix: w,
        normalMatrix: w.normalMatrix(),
        material: mr.material,
      };
    });

    const shadowItems: DirectionalShadowDrawItem[] = meshRenderers
      .filter((mr) => mr.castShadow)
      .map((mr) => ({
        mesh: mr.mesh,
        modelMatrix: mr.gameObject.localToWorld(),
      }));

    // Execute
    const encoder = device.createCommandEncoder({ label: 'AnimalDisplayEncoder' });

    dirShadowPass.setDrawItems(shadowItems);
    dirShadowPass.updateCamera(ctx, lightViewProj);
    if (dirShadowPass.enabled) {
      dirShadowPass.execute(encoder, ctx);
    }

    forwardPass.copyShadowMapToArray(encoder, dirShadowTex, 0);
    forwardPass.updateLights(ctx, directionalLight, [], []);
    forwardPass.setDrawItems(drawItems);
    forwardPass.execute(encoder, ctx);

    device.queue.submit([encoder.finish()]);

    requestAnimationFrame(render);
  }

  render();
}

main();
