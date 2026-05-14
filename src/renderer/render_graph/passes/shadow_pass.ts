import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import type { Scene } from '../../../engine/scene.js';
import type { Camera } from '../../../engine/components/camera.js';
import type { DirectionalLight, CascadeData } from '../../../engine/components/directional_light.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE, type Mesh } from '../../../assets/mesh.js';
import type { Mat4 } from '../../../math/mat4.js';
import shadowWgsl from '../../../shaders/shadow.wgsl?raw';

const SHADOW_SIZE = 2048;
const MAX_CASCADES = 4;

/** Stable persistent-texture key for the directional shadow map. */
export const SHADOW_MAP_KEY = 'shadow:directional';

const SHADOW_MAP_DESC: TextureDesc = {
  label: 'ShadowMap',
  format: 'depth32float',
  width: SHADOW_SIZE,
  height: SHADOW_SIZE,
  depthOrArrayLayers: MAX_CASCADES,
};

export interface ShadowMeshDraw {
  mesh: Mesh;
  modelMatrix: Mat4;
}

export interface ShadowDeps {
  /**
   * One entry per active cascade (max 4); typically computed by
   * `DirectionalLight.computeCascadeMatrices`. If empty, the most recent
   * cascades cached via {@link updateScene} are used.
   */
  cascades: readonly CascadeData[];
  /** Mesh instances rasterised into every cascade. */
  drawItems: readonly ShadowMeshDraw[];
}

export interface ShadowOutputs {
  /** Handle to the persistent depth32float 2D-array shadow map. */
  shadowMap: ResourceHandle;
  /** Number of cascades actually rendered this frame. */
  cascadeCount: number;
}

/**
 * Cascaded shadow map (CSM) pass for the scene's directional sun light
 * (render-graph version).
 *
 * Renders depth from the directional light's POV into a persistent
 * `depth32float` 2D array texture (one render pass per cascade). The shadow
 * map texture lives on the graph's persistent resource cache and survives
 * graph rebuilds; downstream passes (lighting, godrays) consume it via the
 * handle returned from {@link addToGraph}.
 */
export class ShadowPass extends Pass<ShadowDeps, ShadowOutputs> {
  readonly name = 'ShadowPass';

  private readonly _device: GPUDevice;
  private readonly _pipeline: GPURenderPipeline;
  private readonly _modelBgl: GPUBindGroupLayout;
  /** One uniform buffer + bind group per cascade; persists across frames. */
  private readonly _cascadeBuffers: GPUBuffer[];
  private readonly _cascadeBindGroups: GPUBindGroup[];
  /** Per-instance model uniform buffers, grown on demand. */
  private readonly _modelBuffers: GPUBuffer[] = [];
  private readonly _modelBindGroups: GPUBindGroup[] = [];

  private _cascades: readonly CascadeData[] = [];

  private constructor(
    device: GPUDevice,
    pipeline: GPURenderPipeline,
    modelBgl: GPUBindGroupLayout,
    cascadeBuffers: GPUBuffer[],
    cascadeBindGroups: GPUBindGroup[],
  ) {
    super();
    this._device = device;
    this._pipeline = pipeline;
    this._modelBgl = modelBgl;
    this._cascadeBuffers = cascadeBuffers;
    this._cascadeBindGroups = cascadeBindGroups;
  }

  static create(ctx: RenderContext): ShadowPass {
    const { device } = ctx;

    const cascadeBgl = device.createBindGroupLayout({
      label: 'ShadowBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const modelBgl = device.createBindGroupLayout({
      label: 'ShadowModelBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });

    const cascadeBuffers: GPUBuffer[] = [];
    const cascadeBindGroups: GPUBindGroup[] = [];
    for (let i = 0; i < MAX_CASCADES; i++) {
      const buf = device.createBuffer({
        label: `ShadowUniformBuffer ${i}`,
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      cascadeBuffers.push(buf);
      cascadeBindGroups.push(device.createBindGroup({
        label: `ShadowBindGroup ${i}`,
        layout: cascadeBgl,
        entries: [{ binding: 0, resource: { buffer: buf } }],
      }));
    }

    const shaderModule = ctx.createShaderModule(shadowWgsl, 'ShadowShader');

    const pipeline = device.createRenderPipeline({
      label: 'ShadowPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [cascadeBgl, modelBgl] }),
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [{
          arrayStride: VERTEX_STRIDE,
          attributes: [VERTEX_ATTRIBUTES[0]],
        }],
      },
      depthStencil: {
        format: 'depth32float',
        depthWriteEnabled: true,
        depthCompare: 'less',
        depthBias: 2,
        depthBiasSlopeScale: 2.5,
        depthBiasClamp: 0.0,
      },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
    });

    return new ShadowPass(device, pipeline, modelBgl, cascadeBuffers, cascadeBindGroups);
  }

  /**
   * Convenience: recompute cascade matrices from the supplied scene/camera/light
   * and cache them for the next {@link addToGraph} call. Equivalent to passing
   * the cascades directly via deps.
   */
  updateScene(_scene: Scene, camera: Camera, light: DirectionalLight, shadowFar?: number): void {
    this._cascades = light.computeCascadeMatrices(camera, shadowFar);
  }

  /** Most recently computed cascades (from {@link updateScene}). */
  get cascades(): readonly CascadeData[] {
    return this._cascades;
  }

  addToGraph(graph: RenderGraph, deps: ShadowDeps): ShadowOutputs {
    const cascades = deps.cascades.length > 0 ? deps.cascades : this._cascades;
    const N = Math.min(cascades.length, MAX_CASCADES);

    let shadowMap = graph.importPersistentTexture(SHADOW_MAP_KEY, SHADOW_MAP_DESC);

    for (let c = 0; c < N; c++) {
      const cascadeIdx = c;
      const cascade = cascades[cascadeIdx];
      const cascadeShadow = shadowMap;
      let nextShadow!: ResourceHandle;
      graph.addPass(`ShadowPass.cascade${cascadeIdx}`, 'render', (b: PassBuilder) => {
        nextShadow = b.write(cascadeShadow, 'depth-attachment', {
          depthLoadOp: 'clear',
          depthStoreOp: 'store',
          depthClearValue: 1.0,
          view: { dimension: '2d', baseArrayLayer: cascadeIdx, arrayLayerCount: 1 },
        });
        b.setExecute((pctx) => {
          this._device.queue.writeBuffer(
            this._cascadeBuffers[cascadeIdx], 0,
            cascade.lightViewProj.data.buffer as ArrayBuffer,
          );
          this._ensureModelBuffers(deps.drawItems.length);

          const enc = pctx.renderPassEncoder!;
          enc.setPipeline(this._pipeline);
          enc.setBindGroup(0, this._cascadeBindGroups[cascadeIdx]);
          for (let i = 0; i < deps.drawItems.length; i++) {
            const item = deps.drawItems[i];
            this._device.queue.writeBuffer(
              this._modelBuffers[i], 0,
              item.modelMatrix.data.buffer as ArrayBuffer,
            );
            enc.setBindGroup(1, this._modelBindGroups[i]);
            enc.setVertexBuffer(0, item.mesh.vertexBuffer);
            enc.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
            enc.drawIndexed(item.mesh.indexCount);
          }
        });
      });
      shadowMap = nextShadow;
    }

    return { shadowMap, cascadeCount: N };
  }

  private _ensureModelBuffers(count: number): void {
    while (this._modelBuffers.length < count) {
      const buf = this._device.createBuffer({
        label: `ShadowModelBuffer ${this._modelBuffers.length}`,
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      const bg = this._device.createBindGroup({
        layout: this._modelBgl,
        entries: [{ binding: 0, resource: { buffer: buf } }],
      });
      this._modelBuffers.push(buf);
      this._modelBindGroups.push(bg);
    }
  }

  destroy(): void {
    for (const buf of this._cascadeBuffers) buf.destroy();
    for (const buf of this._modelBuffers) buf.destroy();
  }
}

export { SHADOW_SIZE, MAX_CASCADES };
