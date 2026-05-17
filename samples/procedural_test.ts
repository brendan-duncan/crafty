import { Mat4, Vec3 } from '../src/math/index.js';
import { Material } from '../src/renderer/material.js';
import type { MaterialPassType } from '../src/renderer/material.js';
import { ForwardPass } from '../src/renderer/passes/forward_pass.js';
import type { ForwardDrawItem } from '../src/renderer/passes/forward_pass.js';
import { DirectionalShadowPass } from '../src/renderer/passes/directional_shadow_pass.js';
import type { DirectionalShadowDrawItem } from '../src/renderer/passes/directional_shadow_pass.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { RenderGraph } from '../src/renderer/render_graph.js';
import { Mesh } from '../src/assets/mesh.js';
import proceduralWgsl from './procedural_test.wgsl?raw';
import { Camera, GameObject } from '../src/index.js';

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

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const fpsEl = document.getElementById('fps')!;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const ctx = await RenderContext.create(canvas);
  const { device } = ctx;

  // Meshes
  const planeMesh = Mesh.createPlane(device, 30, 30);
  const cubeMesh = Mesh.createCube(device, 1.5);
  const sphereMesh = Mesh.createSphere(device, 0.9, 24, 24);
  const coneMesh = Mesh.createCone(device, 0.8, 1.6, 20);

  // Procedural material instances with different colors
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

  // Forward pass + shadow pass
  const forwardPass = ForwardPass.create(ctx, { clearColor: [0.2, 0.2, 0.45, 1.0] });
  const dirShadowPass = DirectionalShadowPass.create(ctx, forwardPass.getShadowMap(0));

  // Camera
  const cameraGO = new GameObject({ position: new Vec3(0, 4, 12) });
  const camera = cameraGO.addComponent(Camera.createPerspective(60, 0.1, 100, ctx.width / ctx.height));
  const cameraController = CameraController.create({ yaw: 0, pitch: 0, speed: 5, sensitivity: 0.002, pointerLock: false });
  cameraController.attach(canvas);

  // Animation state

  const renderGraph = new RenderGraph();
  renderGraph.addPass(dirShadowPass);
  renderGraph.addPass(forwardPass);

  async function frame() {
    ctx.update();

    const currentView = ctx.backbufferView;

    fpsEl.textContent = `FPS: ${ctx.fps}`;

    // Camera
    cameraController.update(cameraGO, ctx.deltaTime);
    camera.updateRender(ctx);
    ctx.activeCamera = camera;

    forwardPass.updateCamera(ctx);

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
      shadowMap: forwardPass.getShadowMap(0),
    };

    // Animated objects
    const spread = 4.0;
    const items: ForwardDrawItem[] = [
      {
        mesh: planeMesh,
        modelMatrix: Mat4.translation(0, -0.5, 0),
        normalMatrix: Mat4.identity(),
        material: matA,
      },
      {
        mesh: cubeMesh,
        modelMatrix: Mat4.translation(0, 1.5, 0).multiply(
          Mat4.rotationY(ctx.elapsedTime * 40 * Math.PI / 180),
        ),
        normalMatrix: Mat4.identity(),
        material: matB,
      },
      {
        mesh: sphereMesh,
        modelMatrix: Mat4.translation(
          Math.sin(ctx.elapsedTime * 0.6) * spread, 1.5, Math.cos(ctx.elapsedTime * 0.6) * spread,
        ).multiply(
          Mat4.rotationY(ctx.elapsedTime * 60 * Math.PI / 180),
        ),
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

    // Update procedural material time uniform
    matA.time = ctx.elapsedTime;
    matB.time = ctx.elapsedTime;
    matC.time = ctx.elapsedTime;
    matA.markDirty();
    matB.markDirty();
    matC.markDirty();

    // Shadow draw items
    const shadowItems: DirectionalShadowDrawItem[] = items.map((item) => ({
      mesh: item.mesh,
      modelMatrix: item.modelMatrix,
    }));

    // Render
    dirShadowPass.setDrawItems(shadowItems);
    dirShadowPass.updateCamera(ctx, lightViewProj);

    forwardPass.updateLights(ctx, directionalLight, [], []);
    forwardPass.setDrawItems(items);
    forwardPass.setOutput(currentView, ctx.backbufferDepthView);

    renderGraph.execute(ctx);

    requestAnimationFrame(frame);
  }

  frame();
}

main();
