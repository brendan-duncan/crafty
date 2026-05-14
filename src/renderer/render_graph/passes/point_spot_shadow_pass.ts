import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import type { PointLight } from '../../../engine/components/point_light.js';
import type { SpotLight } from '../../../engine/components/spot_light.js';
import type { Mesh } from '../../../assets/mesh.js';
import type { Mat4 } from '../../../math/mat4.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../../assets/mesh.js';
import shadowWgsl from '../../../shaders/point_spot_shadow.wgsl?raw';

export const MAX_POINT_LIGHTS = 32;
export const MAX_SPOT_LIGHTS = 32;
export const MAX_SHADOW_POINT_LIGHTS = 4;
export const MAX_SHADOW_SPOT_LIGHTS = 8;
export const VSM_POINT_SIZE = 256;
export const VSM_SPOT_SIZE = 512;
export const PROJ_TEX_SIZE = 256;

const SHADOW_UNIFORM_SIZE = 80;
const MODEL_UNIFORM_SIZE = 64;
const POINT_SHADOW_PASSES = 6 * MAX_SHADOW_POINT_LIGHTS;
const TOTAL_SHADOW_PASSES = POINT_SHADOW_PASSES + MAX_SHADOW_SPOT_LIGHTS;

export const POINT_VSM_KEY = 'pointspot:point-vsm';
export const SPOT_VSM_KEY = 'pointspot:spot-vsm';
export const PROJ_TEX_KEY = 'pointspot:proj-array';

const POINT_VSM_DESC: TextureDesc = {
  label: 'PointVSM',
  format: 'rgba16float',
  width: VSM_POINT_SIZE, height: VSM_POINT_SIZE,
  depthOrArrayLayers: MAX_SHADOW_POINT_LIGHTS * 6,
};
const SPOT_VSM_DESC: TextureDesc = {
  label: 'SpotVSM',
  format: 'rgba16float',
  width: VSM_SPOT_SIZE, height: VSM_SPOT_SIZE,
  depthOrArrayLayers: MAX_SHADOW_SPOT_LIGHTS,
};
const PROJ_TEX_DESC: TextureDesc = {
  label: 'ProjTexArray',
  format: 'rgba8unorm',
  width: PROJ_TEX_SIZE, height: PROJ_TEX_SIZE,
  depthOrArrayLayers: MAX_SHADOW_SPOT_LIGHTS,
  extraUsage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
};

export type DrawItem = { mesh: Mesh; modelMatrix: Mat4 };

export interface PointSpotShadowOutputs {
  pointVsm: ResourceHandle;
  spotVsm: ResourceHandle;
  projTex: ResourceHandle;
}

/**
 * Builds variance shadow maps for shadow-casting point and spot lights
 * (render-graph version). Uses a 'transfer' graph node and runs many internal
 * render sub-passes (one per cube face / spot slot) inside a single setExecute.
 */
export class PointSpotShadowPass extends Pass<undefined, PointSpotShadowOutputs> {
  readonly name = 'PointSpotShadowPass';

  private readonly _device: GPUDevice;
  private readonly _pointPipeline: GPURenderPipeline;
  private readonly _spotPipeline: GPURenderPipeline;
  private readonly _shadowBufs: GPUBuffer[];
  private readonly _shadowBGs: GPUBindGroup[];
  private readonly _modelBgl: GPUBindGroupLayout;
  private readonly _modelBufs: GPUBuffer[] = [];
  private readonly _modelBGs: GPUBindGroup[] = [];
  private readonly _pointDepth: GPUTexture;
  private readonly _pointDepthView: GPUTextureView;
  private readonly _spotDepth: GPUTexture;
  private readonly _spotDepthView: GPUTextureView;

  private readonly _shadowScratch = new Float32Array(SHADOW_UNIFORM_SIZE / 4);

  private _snapshot: DrawItem[] = [];
  private _pointLights: PointLight[] = [];
  private _spotLights: SpotLight[] = [];

  // Per-frame view caches keyed by physical texture identity.
  private _cachedPointTex: GPUTexture | null = null;
  private _cachedPointFaceViews: GPUTextureView[] = [];
  private _cachedSpotTex: GPUTexture | null = null;
  private _cachedSpotFaceViews: GPUTextureView[] = [];

  private constructor(
    device: GPUDevice,
    pointPipeline: GPURenderPipeline,
    spotPipeline: GPURenderPipeline,
    shadowBufs: GPUBuffer[],
    shadowBGs: GPUBindGroup[],
    modelBgl: GPUBindGroupLayout,
    pointDepth: GPUTexture,
    pointDepthView: GPUTextureView,
    spotDepth: GPUTexture,
    spotDepthView: GPUTextureView,
  ) {
    super();
    this._device = device;
    this._pointPipeline = pointPipeline;
    this._spotPipeline = spotPipeline;
    this._shadowBufs = shadowBufs;
    this._shadowBGs = shadowBGs;
    this._modelBgl = modelBgl;
    this._pointDepth = pointDepth;
    this._pointDepthView = pointDepthView;
    this._spotDepth = spotDepth;
    this._spotDepthView = spotDepthView;
  }

  static create(ctx: RenderContext): PointSpotShadowPass {
    const { device } = ctx;

    const pointDepth = device.createTexture({
      label: 'PointShadowDepth',
      size: { width: VSM_POINT_SIZE, height: VSM_POINT_SIZE },
      format: 'depth32float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    const spotDepth = device.createTexture({
      label: 'SpotShadowDepth',
      size: { width: VSM_SPOT_SIZE, height: VSM_SPOT_SIZE },
      format: 'depth32float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const shadowBgl = device.createBindGroupLayout({
      label: 'PSShadowBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const modelBgl = device.createBindGroupLayout({
      label: 'PSModelBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });

    const shadowBufs: GPUBuffer[] = [];
    const shadowBGs: GPUBindGroup[] = [];
    for (let i = 0; i < TOTAL_SHADOW_PASSES; i++) {
      const buf = device.createBuffer({
        label: `PSShadowUniform ${i}`,
        size: SHADOW_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      shadowBufs.push(buf);
      shadowBGs.push(device.createBindGroup({
        label: `PSShadowBG ${i}`, layout: shadowBgl,
        entries: [{ binding: 0, resource: { buffer: buf } }],
      }));
    }

    const layout = device.createPipelineLayout({ bindGroupLayouts: [shadowBgl, modelBgl] });
    const shaderModule = ctx.createShaderModule(shadowWgsl, 'PointSpotShadowShader');
    const vertexState = {
      module: shaderModule,
      buffers: [{ arrayStride: VERTEX_STRIDE, attributes: [VERTEX_ATTRIBUTES[0]] }],
    };

    const pointPipeline = device.createRenderPipeline({
      label: 'PointShadowPipeline', layout,
      vertex: { ...vertexState, entryPoint: 'vs_point' },
      fragment: { module: shaderModule, entryPoint: 'fs_point', targets: [{ format: 'rgba16float' }] },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
    });
    const spotPipeline = device.createRenderPipeline({
      label: 'SpotShadowPipeline', layout,
      vertex: { ...vertexState, entryPoint: 'vs_spot' },
      fragment: { module: shaderModule, entryPoint: 'fs_spot', targets: [{ format: 'rgba16float' }] },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
    });

    return new PointSpotShadowPass(
      device, pointPipeline, spotPipeline,
      shadowBufs, shadowBGs, modelBgl,
      pointDepth, pointDepth.createView(),
      spotDepth, spotDepth.createView(),
    );
  }

  update(pointLights: PointLight[], spotLights: SpotLight[], snapshot: DrawItem[]): void {
    this._pointLights = pointLights;
    this._spotLights = spotLights;
    this._snapshot = snapshot;
  }

  addToGraph(graph: RenderGraph): PointSpotShadowOutputs {
    const pointVsm = graph.importPersistentTexture(POINT_VSM_KEY, POINT_VSM_DESC);
    const spotVsm = graph.importPersistentTexture(SPOT_VSM_KEY, SPOT_VSM_DESC);
    const projTex = graph.importPersistentTexture(PROJ_TEX_KEY, PROJ_TEX_DESC);

    let outPoint!: ResourceHandle;
    let outSpot!: ResourceHandle;
    let outProj!: ResourceHandle;

    graph.addPass(this.name, 'transfer', (b: PassBuilder) => {
      // Track usage so the pool gives the right flags.
      outPoint = b.write(pointVsm, 'attachment');
      outSpot = b.write(spotVsm, 'attachment');
      outProj = b.write(projTex, 'copy-dst');

      b.setExecute((pctx, res) => {
        const items = this._snapshot;
        this._ensureModelBuffers(items.length);

        const pointTex = res.getTexture(pointVsm);
        const spotTex = res.getTexture(spotVsm);
        const projTexResolved = res.getTexture(projTex);

        // Rebuild per-face views if the underlying physical textures changed
        // (persistent textures don't change unless the cache trims; cheap to compare).
        if (this._cachedPointTex !== pointTex) {
          this._cachedPointTex = pointTex;
          this._cachedPointFaceViews = Array.from({ length: MAX_SHADOW_POINT_LIGHTS * 6 }, (_, i) =>
            pointTex.createView({ dimension: '2d', baseArrayLayer: i, arrayLayerCount: 1 }),
          );
        }
        if (this._cachedSpotTex !== spotTex) {
          this._cachedSpotTex = spotTex;
          this._cachedSpotFaceViews = Array.from({ length: MAX_SHADOW_SPOT_LIGHTS }, (_, i) =>
            spotTex.createView({ dimension: '2d', baseArrayLayer: i, arrayLayerCount: 1 }),
          );
        }

        // Copy projection textures for spotlights with goboes.
        for (let i = 0; i < this._spotLights.length && i < MAX_SHADOW_SPOT_LIGHTS; i++) {
          const sl = this._spotLights[i];
          if (sl.projectionTexture) {
            pctx.commandEncoder.copyTextureToTexture(
              { texture: sl.projectionTexture },
              { texture: projTexResolved, origin: { x: 0, y: 0, z: i } },
              { width: PROJ_TEX_SIZE, height: PROJ_TEX_SIZE, depthOrArrayLayers: 1 },
            );
          }
        }

        // Upload model matrices once.
        for (let i = 0; i < items.length; i++) {
          this._device.queue.writeBuffer(this._modelBufs[i], 0, items[i].modelMatrix.data.buffer as ArrayBuffer);
        }

        let bufIdx = 0;
        let shadowPointIdx = 0;
        for (const pl of this._pointLights) {
          if (!pl.castShadow || shadowPointIdx >= MAX_SHADOW_POINT_LIGHTS) continue;

          const pos = pl.worldPosition();
          const faceVPs = pl.cubeFaceViewProjs();
          const u = this._shadowScratch;
          u[16] = pos.x; u[17] = pos.y; u[18] = pos.z; u[19] = pl.radius;

          for (let face = 0; face < 6; face++) {
            u.set(faceVPs[face].data, 0);
            this._device.queue.writeBuffer(this._shadowBufs[bufIdx], 0, u.buffer as ArrayBuffer);

            const layerIdx = shadowPointIdx * 6 + face;
            const pass = pctx.commandEncoder.beginRenderPass({
              label: `PointShadow light${shadowPointIdx} face${face}`,
              colorAttachments: [{
                view: this._cachedPointFaceViews[layerIdx],
                clearValue: { r: 1, g: 1, b: 0, a: 1 },
                loadOp: 'clear', storeOp: 'store',
              }],
              depthStencilAttachment: {
                view: this._pointDepthView,
                depthClearValue: 1, depthLoadOp: 'clear', depthStoreOp: 'discard',
              },
            });
            pass.setPipeline(this._pointPipeline);
            pass.setBindGroup(0, this._shadowBGs[bufIdx]);
            this._drawItems(pass, items);
            pass.end();
            bufIdx++;
          }
          shadowPointIdx++;
        }

        let shadowSpotIdx = 0;
        for (const sl of this._spotLights) {
          if (!sl.castShadow || shadowSpotIdx >= MAX_SHADOW_SPOT_LIGHTS) continue;

          const vp = sl.lightViewProj();
          const pos = sl.worldPosition();
          const u = this._shadowScratch;
          u.set(vp.data, 0);
          u[16] = pos.x; u[17] = pos.y; u[18] = pos.z; u[19] = sl.range;
          this._device.queue.writeBuffer(this._shadowBufs[bufIdx], 0, u.buffer as ArrayBuffer);

          const pass = pctx.commandEncoder.beginRenderPass({
            label: `SpotShadow light${shadowSpotIdx}`,
            colorAttachments: [{
              view: this._cachedSpotFaceViews[shadowSpotIdx],
              clearValue: { r: 1, g: 1, b: 0, a: 1 },
              loadOp: 'clear', storeOp: 'store',
            }],
            depthStencilAttachment: {
              view: this._spotDepthView,
              depthClearValue: 1, depthLoadOp: 'clear', depthStoreOp: 'discard',
            },
          });
          pass.setPipeline(this._spotPipeline);
          pass.setBindGroup(0, this._shadowBGs[bufIdx]);
          this._drawItems(pass, items);
          pass.end();
          bufIdx++;
          shadowSpotIdx++;
        }
      });
    });

    return { pointVsm: outPoint, spotVsm: outSpot, projTex: outProj };
  }

  private _drawItems(pass: GPURenderPassEncoder, items: DrawItem[]): void {
    for (let i = 0; i < items.length; i++) {
      const { mesh } = items[i];
      pass.setBindGroup(1, this._modelBGs[i]);
      pass.setVertexBuffer(0, mesh.vertexBuffer);
      pass.setIndexBuffer(mesh.indexBuffer, 'uint32');
      pass.drawIndexed(mesh.indexCount);
    }
  }

  private _ensureModelBuffers(count: number): void {
    while (this._modelBufs.length < count) {
      const buf = this._device.createBuffer({
        label: `PSModelUniform ${this._modelBufs.length}`,
        size: MODEL_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this._modelBufs.push(buf);
      this._modelBGs.push(this._device.createBindGroup({
        layout: this._modelBgl,
        entries: [{ binding: 0, resource: { buffer: buf } }],
      }));
    }
  }

  destroy(): void {
    this._pointDepth.destroy();
    this._spotDepth.destroy();
    for (const buf of this._shadowBufs) buf.destroy();
    for (const buf of this._modelBufs) buf.destroy();
  }
}
