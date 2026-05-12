import { Mat4, Vec3 } from '../src/math/index.js';
import { Material } from '../src/renderer/material.js';
import type { MaterialPassType } from '../src/renderer/material.js';
import { ForwardPass } from '../src/renderer/passes/forward_pass.js';
import type { ForwardDrawItem } from '../src/renderer/passes/forward_pass.js';
import { DirectionalShadowPass } from '../src/renderer/passes/directional_shadow_pass.js';
import type { DirectionalShadowDrawItem } from '../src/renderer/passes/directional_shadow_pass.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { CameraControls } from '../src/engine/camera_controls.js';
import { Mesh } from '../src/assets/mesh.js';
import forwardProceduralWgsl from './forward_procedural.wgsl?raw';

const ALIGNMENT = 256;

class ProceduralMaterial extends Material {
  readonly shaderId = 'procedural';

  baseColor   = new Float32Array([0.15, 0.35, 0.75, 1.0]);
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
    return forwardProceduralWgsl;
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

function createFallbackCubemap(device: GPUDevice): GPUTexture {
  const tex = device.createTexture({
    size: { width: 1, height: 1, depthOrArrayLayers: 6 },
    format: 'rgba16float',
    dimension: '2d',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    mipLevelCount: 1,
  });
  const data = new Uint16Array([0x3800, 0x3800, 0x3800, 0x3C00]);
  for (let i = 0; i < 6; i++) {
    device.queue.writeTexture(
      { texture: tex, origin: { x: 0, y: 0, z: i } },
      data,
      { bytesPerRow: 8 },
      { width: 1, height: 1 },
    );
  }
  return tex;
}

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const fpsEl = document.getElementById('fps')!;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const ctx = await RenderContext.create(canvas);
  const { device } = ctx;

  // IBL fallback textures
  const irradianceTex = createFallbackCubemap(device);
  const prefilterTex = createFallbackCubemap(device);
  const brdfTex = device.createTexture({
    size: { width: 1, height: 1 },
    format: 'rgba16float',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  device.queue.writeTexture(
    { texture: brdfTex },
    new Uint16Array([0x3C00, 0x0000, 0, 0]),
    { bytesPerRow: 8 },
    { width: 1, height: 1 },
  );

  const iblTextures = {
    irradiance: irradianceTex,
    prefiltered: prefilterTex,
    brdfLut: brdfTex,
    irradianceView: irradianceTex.createView({ dimension: 'cube' }),
    prefilteredView: prefilterTex.createView({ dimension: 'cube' }),
    brdfLutView: brdfTex.createView(),
    levels: 1,
    destroy() {
      irradianceTex.destroy();
      prefilterTex.destroy();
      brdfTex.destroy();
    },
  };

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
  const SHADOW_SIZE = 2048;
  const forwardPass = ForwardPass.create(ctx, iblTextures);
  const dirShadowTex = device.createTexture({
    label: 'DirShadowTex',
    size: { width: SHADOW_SIZE, height: SHADOW_SIZE },
    format: 'depth32float',
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
  });
  const dirShadowView = dirShadowTex.createView();
  const dirShadowPass = DirectionalShadowPass.create(ctx, dirShadowView);

  // Camera
  const camPos = new Vec3(0, 4, 12);
  const cameraControls = new CameraControls(0, -0.25, 5, 0.002);
  cameraControls.attach(canvas);

  // Animation state
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

    // Resize
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
          Mat4.rotationY(time * 40 * Math.PI / 180),
        ),
        normalMatrix: Mat4.identity(),
        material: matB,
      },
      {
        mesh: sphereMesh,
        modelMatrix: Mat4.translation(
          Math.sin(time * 0.6) * spread, 1.5, Math.cos(time * 0.6) * spread,
        ).multiply(
          Mat4.rotationY(time * 60 * Math.PI / 180),
        ),
        normalMatrix: Mat4.identity(),
        material: matC,
      },
      {
        mesh: coneMesh,
        modelMatrix: Mat4.translation(
          Math.sin(time * 0.6 + Math.PI) * spread, 1.5, Math.cos(time * 0.6 + Math.PI) * spread,
        ),
        normalMatrix: Mat4.identity(),
        material: matA,
      },
    ];

    // Update procedural material time uniform
    matA.time = time;
    matB.time = time;
    matC.time = time;
    matA.markDirty();
    matB.markDirty();
    matC.markDirty();

    // Shadow draw items
    const shadowItems: DirectionalShadowDrawItem[] = items.map((item) => ({
      mesh: item.mesh,
      modelMatrix: item.modelMatrix,
    }));

    // Execute
    const encoder = device.createCommandEncoder({ label: 'ProceduralDemoEncoder' });

    dirShadowPass.setDrawItems(shadowItems);
    dirShadowPass.updateCamera(ctx, lightViewProj);
    if (dirShadowPass.enabled) {
      dirShadowPass.execute(encoder, ctx);
    }

    // Copy directional shadow map into forward pass shadow array (layer 0)
    forwardPass.copyShadowMapToArray(encoder, dirShadowTex, 0);

    forwardPass.updateLights(ctx, directionalLight, [], []);
    forwardPass.setDrawItems(items);
    forwardPass.execute(encoder, ctx);

    device.queue.submit([encoder.finish()]);

    requestAnimationFrame(render);
  }

  render();
}

main();
