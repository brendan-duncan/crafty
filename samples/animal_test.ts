import { Mat4, Vec3 } from '../src/math/index.js';
import { ForwardPass } from '../src/renderer/passes/forward_pass.js';
import type { ForwardDrawItem } from '../src/renderer/passes/forward_pass.js';
import { DirectionalShadowPass } from '../src/renderer/passes/directional_shadow_pass.js';
import type { DirectionalShadowDrawItem } from '../src/renderer/passes/directional_shadow_pass.js';
import { RenderContext, RenderGraph } from '../src/renderer/index.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { Scene } from '../src/engine/scene.js';
import { GameObject } from '../src/engine/game_object.js';
import { Camera } from '../src/engine/components/camera.js';
import { MeshRenderer } from '../src/engine/components/mesh_renderer.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { Mesh } from '../src/assets/mesh.js';
import { BlockType } from '../src/block/block_type.js';
import { BiomeType } from '../src/block/biome_type.js';
import { Duck, Duckling } from '../crafty/game/entities/duck_entity.js';
import { Pig } from '../crafty/game/entities/pig_entity.js';
import { Creeper } from '../crafty/game/entities/creeper_entity.js';
import { Bee } from '../crafty/game/entities/bee_entity.js';

interface AnimationState {
  roots: GameObject[];
}

const PLANE_Y = 0;

class MockWorld {
  getTopBlockY(_wx: number, _wz: number, _maxY: number): number {
    return PLANE_Y + 1;
  }
  getBlockType(_wx: number, _wy: number, _wz: number): number {
    return BlockType.NONE;
  }
  getBiomeAt(_wx: number, _wy: number, _wz: number): BiomeType {
    return BiomeType.GrassyPlains;
  }
  mineBlock(_wx: number, _wy: number, _wz: number): boolean {
    return false;
  }
}

function buildDuck(scene: Scene, world: MockWorld): AnimationState {
  const duck = Duck.spawn(0, 0, world as any, scene);
  duck?.setStatic();
  return { roots: duck ? [duck] : [] };
}

function buildDuckFamily(scene: Scene, world: MockWorld): AnimationState {
  const roots: GameObject[] = [];
  const parent = Duck.spawn(0, 0, world as any, scene);
  parent?.setStatic();
  if (parent) {
    roots.push(parent);
    for (let i = 0; i < 5; i++) {
      const duckling = Duckling.spawn(parent, world as any, scene);
      duckling?.setStatic();
      roots.push(duckling!);
    }
  }
  return { roots };
}

function buildPig(scene: Scene, world: MockWorld): AnimationState {
  const pig = Pig.spawn(0, 0, world as any, scene);
  pig?.setStatic();
  return { roots: pig ? [pig] : [] };
}

function buildCreeper(scene: Scene, world: MockWorld): AnimationState {
  const creeper = Creeper.spawn(0, 0, world as any, scene);
  creeper?.setStatic();
  creeper?.position.set(0, 0.5, 0);
  return { roots: creeper ? [creeper] : [] };
}

function buildBee(scene: Scene, world: MockWorld): AnimationState {
  const bee = Bee.spawn(0, 0, world as any, scene);
  bee?.setStatic();
  bee?.position.set(0, 1.5, 0);
  return { roots: bee ? [bee] : [] };
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

  Duck.initMeshes(device);
  Duckling.initMeshes(device);
  Pig.initMeshes(device);
  Creeper.initMeshes(device);
  Bee.initMeshes(device);

  // Plane ground (static)
  const groundGO = new GameObject({ name: 'Ground' });
  groundGO.position.set(0, PLANE_Y, 0);
  const groundRenderer = groundGO.addComponent(new MeshRenderer(planeMesh, planeMaterial));
  groundRenderer.castShadow = false;
  scene.add(groundGO);

  // Render graph — the forward pass owns the shadow-map array internally.
  // Create a 2D view of layer 0 for the directional shadow pass to render
  // directly into, eliminating any need for a shadow-copy pass.
  const forwardPass = ForwardPass.create(ctx, { clearColor: [1, 1, 1, 1] });
  const dirShadowLayer = forwardPass.getShadowMap(0);
  const dirShadowPass = DirectionalShadowPass.create(ctx, dirShadowLayer);

  const graph = new RenderGraph();
  graph.addPass(dirShadowPass);
  graph.addPass(forwardPass);

  // Camera
  const cameraGO = new GameObject({ name: 'Camera' });
  cameraGO.position.set(-1, 2.0, -1);
  const camera = cameraGO.addComponent(Camera.createPerspective(60, 0.1, 100, ctx.width / ctx.height));

  const cameraController = CameraController.create({
    yaw: 180, pitch: 0.5, speed: 3, sensitivity: 0.002, pointerLock: false });
  cameraController.attach(canvas);

  // Animation state
  let animState: AnimationState | null = null;

  function buildAndShow(type: string) {
    if (animState) {
      for (const root of animState.roots) {
        scene.remove(root);
      }
    }

    switch (type) {
      case 'duck':
        animState = buildDuck(scene, world);
        break;
      case 'duckling':
        animState = buildDuckFamily(scene, world);
        break;
      case 'pig':
        animState = buildPig(scene, world);
        break;
      case 'creeper':
        animState = buildCreeper(scene, world);
        break;
      case 'bee':
        animState = buildBee(scene, world);
        break;
    }
  }

  select.addEventListener('change', () => buildAndShow(select.value));
  buildAndShow(select.value);

  // Timing
  let isolateAnimal = false;

  window.addEventListener('keydown', (e) => {
    if (e.key === 'c' || e.key === 'C') {
      isolateAnimal = !isolateAnimal;
      console.log(`Isolate animal: ${isolateAnimal ? 'ON' : 'OFF'}`);
      groundGO.enabled = !isolateAnimal;
    }
  });

  async function render() {
    ctx.update();

    forwardPass.setOutput(ctx.backbufferView, ctx.backbufferDepthView);

    fpsEl.textContent = `FPS: ${ctx.fps}`;

    // Camera
    cameraController.update(cameraGO as any, ctx.deltaTime);

    const view = camera.viewMatrix();
    const proj = camera.projectionMatrix();
    const viewProj = camera.viewProjectionMatrix();
    const invViewProj = viewProj.invert();
    const camPos = camera.position();

    forwardPass.updateCamera(ctx, view, proj, viewProj, invViewProj, camPos, 0.1, 100);

    // Tick AI components (movement & animation)
    scene.update(ctx.deltaTime);

    // Sun
    const sunDir = new Vec3(0.4, -0.7, 0.5).normalize();
    const sceneCenter = new Vec3(0, 1, 0);
    const shadowDist = 25;
    const shadowCamPos = sceneCenter.sub(sunDir.scale(shadowDist));
    const lightView = Mat4.lookAt(shadowCamPos, sceneCenter, new Vec3(0, 1, 0));
    const lightProj = Mat4.orthographic(-12, 12, -12, 12, 1, 50);
    const lightViewProj = lightProj.multiply(lightView);

    const directionalLight = {
      direction: sunDir,
      intensity: 5.5,
      color: new Vec3(1.0, 0.95, 0.9),
      castShadows: true,
      lightViewProj,
      shadowMap: dirShadowLayer,
    };

    // Collect draw items
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
      .filter((mr) => mr.castShadow && mr.gameObject.enabled)
      .map((mr) => ({
        mesh: mr.mesh,
        modelMatrix: mr.gameObject.localToWorld(),
      }));

    // Stage per-frame data on passes
    dirShadowPass.setDrawItems(shadowItems);
    dirShadowPass.updateCamera(ctx, lightViewProj);
    forwardPass.updateLights(ctx, directionalLight, [], []);
    forwardPass.setDrawItems(drawItems);

    // Execute the full render graph (shadow → forward)
    await graph.execute(ctx);

    requestAnimationFrame(render);
  }

  render();
}

main();
