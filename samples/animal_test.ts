import { Mat4, Vec3 } from '../src/math/index.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph } from '../src/renderer/render_graph/index.js';
import { ForwardPass, type ForwardDrawItem } from '../src/renderer/render_graph/passes/forward_pass.js';
import { ShadowPass, type ShadowMeshDraw } from '../src/renderer/render_graph/passes/shadow_pass.js';
import { TonemapPass } from '../src/renderer/render_graph/passes/tonemap_pass.js';
import type { DirectionalLight } from '../src/renderer/directional_light.js';
import type { CascadeData } from '../src/engine/components/directional_light.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { Scene } from '../src/engine/scene.js';
import { GameObject } from '../src/engine/game_object.js';
import { Camera } from '../src/engine/components/camera.js';
import { MeshRenderer } from '../src/engine/components/mesh_renderer.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { Mesh } from '../src/assets/mesh.js';
import { BlockType } from '../src/block/block_type.js';
import { BiomeType } from '../src/block/biome_type.js';
import { createRenderGraphViz } from '../src/renderer/render_graph/ui/render_graph_viz.js';
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

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const fpsEl = document.getElementById('fps')!;
  const select = document.getElementById('animal-select') as HTMLSelectElement;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const { device } = ctx;
  const cache = new PhysicalResourceCache(device);

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

  const groundGO = new GameObject({ name: 'Ground' });
  groundGO.position.set(0, PLANE_Y, 0);
  const groundRenderer = groundGO.addComponent(new MeshRenderer(planeMesh, planeMaterial));
  groundRenderer.castShadow = false;
  scene.add(groundGO);

  const shadowPass = ShadowPass.create(ctx);
  const forwardPass = ForwardPass.create(ctx);
  const tonemapPass = TonemapPass.create(ctx);
  tonemapPass.updateParams(ctx, 1.0, false, false);
  const graphViz = createRenderGraphViz(null).attach();

  const cameraGO = new GameObject({ name: 'Camera' });
  cameraGO.position.set(-1, 2.0, -1);
  const camera = cameraGO.addComponent(Camera.createPerspective(60, 0.1, 100, ctx.width / ctx.height));

  const cameraController = CameraController.create({
    yaw: 180, pitch: 0.5, speed: 3, sensitivity: 0.002, pointerLock: false,
  });
  cameraController.attach(canvas);

  let animState: AnimationState | null = null;
  function buildAndShow(type: string): void {
    if (animState) {
      for (const root of animState.roots) {
        scene.remove(root);
      }
    }
    switch (type) {
      case 'duck':     animState = buildDuck(scene, world); break;
      case 'duckling': animState = buildDuckFamily(scene, world); break;
      case 'pig':      animState = buildPig(scene, world); break;
      case 'creeper':  animState = buildCreeper(scene, world); break;
      case 'bee':      animState = buildBee(scene, world); break;
    }
  }

  select.addEventListener('change', () => buildAndShow(select.value));
  buildAndShow(select.value);

  let isolateAnimal = false;
  window.addEventListener('keydown', (e) => {
    if (e.key === 'c' || e.key === 'C') {
      isolateAnimal = !isolateAnimal;
      console.log(`Isolate animal: ${isolateAnimal ? 'ON' : 'OFF'}`);
      groundGO.enabled = !isolateAnimal;
    }
  });

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    cache.trimUnused();
  });
  resizeObserver.observe(canvas);

  function frame(): void {
    ctx.update();
    fpsEl.textContent = `FPS: ${ctx.fps}`;

    cameraController.update(cameraGO as any, ctx.deltaTime);
    camera.updateRender(ctx);
    ctx.activeCamera = camera;

    scene.update(ctx.deltaTime);

    const sunDir = new Vec3(0.4, -0.7, 0.5).normalize();
    const center = new Vec3(0, 1, 0);
    const shadowDist = 25;
    const lv = Mat4.lookAt(center.sub(sunDir.scale(shadowDist)), center, Vec3.UP);
    const lp = Mat4.orthographic(-12, 12, -12, 12, 1, 50);
    const cascades: CascadeData[] = [{
      lightViewProj: lp.multiply(lv),
      splitFar: 100,
      depthRange: 49,
      texelWorldSize: 24 / 2048,
    }];

    const directionalLight: DirectionalLight = {
      direction: sunDir,
      intensity: 5.5,
      color: new Vec3(1.0, 0.95, 0.9),
      castShadows: true,
      cascades,
    };

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

    const shadowItems: ShadowMeshDraw[] = meshRenderers
      .filter((mr) => mr.castShadow && mr.gameObject.enabled)
      .map((mr) => ({
        mesh: mr.mesh,
        modelMatrix: mr.gameObject.localToWorld(),
      }));

    forwardPass.setDrawItems(drawItems);
    forwardPass.updateCamera(ctx);
    forwardPass.updateLights(ctx, directionalLight, [], []);

    const graph = new RenderGraph(ctx, cache);
    const bb = graph.setBackbuffer('canvas');

    const shadow = shadowPass.addToGraph(graph, { cascades, drawItems: shadowItems });
    const lit = forwardPass.addToGraph(graph, {
      clearColor: [1, 1, 1, 1],
      shadowMapSource: shadow.shadowMap,
    });
    tonemapPass.addToGraph(graph, { hdr: lit.output, backbuffer: bb });

    const compiled = graph.compile();
    graphViz.setGraph(graph, compiled);
    void graph.execute(compiled);

    requestAnimationFrame(frame);
  }

  frame();
}

main().catch(err => {
  document.body.innerHTML = `<pre style="color:red;padding:1rem">${err.message ?? err}</pre>`;
  console.error(err);
});
