import { Mat4, Vec3 } from '../src/math/index.js';
import { Material } from '../src/renderer/material.js';
import type { MaterialPassType } from '../src/renderer/material.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph } from '../src/renderer/render_graph/index.js';
import { ForwardPass, type ForwardDrawItem } from '../src/renderer/render_graph/passes/forward_pass.js';
import { ShadowPass, type ShadowMeshDraw } from '../src/renderer/render_graph/passes/shadow_pass.js';
import { TonemapPass } from '../src/renderer/render_graph/passes/tonemap_pass.js';
import type { DirectionalLight } from '../src/renderer/directional_light.js';
import type { CascadeData } from '../src/engine/components/directional_light.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { Mesh } from '../src/assets/mesh.js';
import proceduralWgsl from './procedural_test.wgsl?raw';
import { Camera, GameObject } from '../src/index.js';
import { createRenderGraphViz } from '../src/renderer/render_graph/ui/render_graph_viz.js';

const ALIGNMENT = 256;

class ProceduralMaterial extends Material {
  readonly shaderId = 'procedural';

  baseColor = new Float32Array([0.15, 0.35, 0.75, 1.0]);
  accentColor = new Float32Array([1.0, 0.3, 0.1, 1.0]);
  patternScale = 2.0;
  time = 0.0;
  animSpeed = 1.0;
  edgeWidth = 0.04;

  private static _bglCache = new WeakMap<GPUDevice, GPUBindGroupLayout>();
  private _device: GPUDevice | null = null;
  private _buffer: GPUBuffer | null = null;
  private _bindGroup: GPUBindGroup | null = null;
  private _dirty = true;

  getShaderCode(_passType: MaterialPassType): string {
    return proceduralWgsl;
  }

  getBindGroupLayout(device: GPUDevice): GPUBindGroupLayout {
    let layout = ProceduralMaterial._bglCache.get(device);
    if (!layout) {
      layout = device.createBindGroupLayout({
        label: 'ProceduralMaterialBGL',
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: 'uniform' },
          },
        ],
      });
      ProceduralMaterial._bglCache.set(device, layout);
    }
    return layout;
  }

  getBindGroup(device: GPUDevice): GPUBindGroup {
    if (!this._buffer || this._device !== device) {
      this._device = device;
      this._buffer = device.createBuffer({
        label: 'ProceduralMaterialUniforms',
        size: ALIGNMENT,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this._bindGroup = device.createBindGroup({
        label: 'ProceduralMaterialBindGroup',
        layout: this.getBindGroupLayout(device),
        entries: [{ binding: 0, resource: { buffer: this._buffer } }],
      });
      this._dirty = true;
    }
    return this._bindGroup!;
  }

  private readonly _data = new Float32Array(ALIGNMENT / 4);

  update(queue: GPUQueue): void {
    if (!this._dirty || !this._buffer) {
      return;
    }
    const data = this._data;
    data.set(this.baseColor, 0);
    data.set(this.accentColor, 4);
    data[8] = this.patternScale;
    data[9] = this.time;
    data[10] = this.animSpeed;
    data[11] = this.edgeWidth;
    queue.writeBuffer(this._buffer, 0, data);
    this._dirty = false;
  }

  markDirty(): void {
    this._dirty = true;
  }

  destroy(): void {
    this._buffer?.destroy();
    this._buffer = null;
    this._bindGroup = null;
  }
}

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const fpsEl = document.getElementById('fps')!;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const { device } = ctx;
  const cache = new PhysicalResourceCache(device);

  const planeMesh = Mesh.createPlane(device, 30, 30);
  const cubeMesh = Mesh.createCube(device, 1.5);
  const sphereMesh = Mesh.createSphere(device, 0.9, 24, 24);
  const coneMesh = Mesh.createCone(device, 0.8, 1.6, 20);

  const matA = new ProceduralMaterial();
  matA.baseColor.set([0.1, 0.3, 0.8, 1.0]);
  matA.accentColor.set([1.0, 0.4, 0.1, 1.0]);
  matA.patternScale = 1.5;

  const matB = new ProceduralMaterial();
  matB.baseColor.set([0.6, 0.0, 0.4, 1.0]);
  matB.accentColor.set([0.0, 1.0, 0.6, 1.0]);
  matB.patternScale = 2.5;
  matB.animSpeed = 1.5;

  const matC = new ProceduralMaterial();
  matC.baseColor.set([0.0, 0.2, 0.2, 1.0]);
  matC.accentColor.set([1.0, 0.8, 0.0, 1.0]);
  matC.patternScale = 3.0;
  matC.edgeWidth = 0.08;

  const cameraGO = new GameObject({ position: new Vec3(0, 4, 12) });
  const camera = cameraGO.addComponent(Camera.createPerspective(60, 0.1, 100, ctx.width / ctx.height));
  const cameraController = CameraController.create({ yaw: 0, pitch: 0, speed: 5, sensitivity: 0.002, pointerLock: false });
  cameraController.attach(canvas);

  const shadowPass = ShadowPass.create(ctx);
  const forwardPass = ForwardPass.create(ctx);
  const tonemapPass = TonemapPass.create(ctx);
  tonemapPass.updateParams(ctx, 1.0, false, false);
  const graphViz = createRenderGraphViz(null).attach();

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

    cameraController.update(cameraGO, ctx.deltaTime);
    camera.updateRender(ctx);
    ctx.activeCamera = camera;

    // Single-cascade directional light covering the small scene.
    const sunDir = new Vec3(0.4, -0.7, -0.5).normalize();
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
      intensity: 1.5,
      color: new Vec3(1.0, 0.95, 0.9),
      castShadows: true,
      cascades,
    };

    const spread = 4.0;
    const items: ForwardDrawItem[] = [
      { mesh: planeMesh,  modelMatrix: Mat4.translation(0, -0.5, 0), normalMatrix: Mat4.identity(), material: matA },
      {
        mesh: cubeMesh,
        modelMatrix: Mat4.translation(0, 1.5, 0).multiply(Mat4.rotationY(ctx.elapsedTime * 40 * Math.PI / 180)),
        normalMatrix: Mat4.identity(),
        material: matB,
      },
      {
        mesh: sphereMesh,
        modelMatrix: Mat4.translation(
          Math.sin(ctx.elapsedTime * 0.6) * spread, 1.5, Math.cos(ctx.elapsedTime * 0.6) * spread,
        ).multiply(Mat4.rotationY(ctx.elapsedTime * 60 * Math.PI / 180)),
        normalMatrix: Mat4.identity(),
        material: matC,
      },
      {
        mesh: coneMesh,
        modelMatrix: Mat4.translation(
          Math.sin(ctx.elapsedTime * 0.6 + Math.PI) * spread, 1.5, Math.cos(ctx.elapsedTime * 0.6 + Math.PI) * spread,
        ),
        normalMatrix: Mat4.identity(),
        material: matA,
      },
    ];

    matA.time = ctx.elapsedTime;
    matB.time = ctx.elapsedTime;
    matC.time = ctx.elapsedTime;
    matA.markDirty();
    matB.markDirty();
    matC.markDirty();

    const shadowItems: ShadowMeshDraw[] = items.map((it) => ({ mesh: it.mesh, modelMatrix: it.modelMatrix }));

    forwardPass.setDrawItems(items);
    forwardPass.updateCamera(ctx);
    forwardPass.updateLights(ctx, directionalLight, [], []);

    const graph = new RenderGraph(ctx, cache);
    const bb = graph.setBackbuffer('canvas');

    const shadow = shadowPass.addToGraph(graph, { cascades, drawItems: shadowItems });
    const lit = forwardPass.addToGraph(graph, {
      clearColor: [0.2, 0.2, 0.45, 1.0],
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
