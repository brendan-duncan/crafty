import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { PointLight } from '../../engine/components/point_light.js';
import type { SpotLight } from '../../engine/components/spot_light.js';
import type { Mesh } from '../../assets/mesh.js';
import type { Mat4 } from '../../math/mat4.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import shadowWgsl from '../../shaders/point_spot_shadow.wgsl?raw';

export const MAX_POINT_LIGHTS        = 32;
export const MAX_SPOT_LIGHTS         = 32;
export const MAX_SHADOW_POINT_LIGHTS = 4;
export const MAX_SHADOW_SPOT_LIGHTS  = 8;
export const VSM_POINT_SIZE          = 256;
export const VSM_SPOT_SIZE           = 512;
export const PROJ_TEX_SIZE           = 256;

const SHADOW_UNIFORM_SIZE = 80;  // mat4(64) + vec3(12, at align16) + f32(4) = 80
const MODEL_UNIFORM_SIZE  = 64;  // mat4(64)

// Total render passes: 6 faces × MAX_SHADOW_POINT_LIGHTS + MAX_SHADOW_SPOT_LIGHTS
const POINT_SHADOW_PASSES = 6 * MAX_SHADOW_POINT_LIGHTS;
const TOTAL_SHADOW_PASSES = POINT_SHADOW_PASSES + MAX_SHADOW_SPOT_LIGHTS;

export type DrawItem = { mesh: Mesh; modelMatrix: Mat4 };

export class PointSpotShadowPass extends RenderPass {
  readonly name = 'PointSpotShadowPass';

  // Public VSM textures — consumed by PointSpotLightPass
  readonly pointVsmView: GPUTextureView;
  readonly spotVsmView : GPUTextureView;
  readonly projTexView : GPUTextureView;

  private _pointVsmTex : GPUTexture;
  private _spotVsmTex  : GPUTexture;
  private _projTexArray: GPUTexture;
  private _pointDepth  : GPUTexture;  // temporary depth for point face renders
  private _spotDepth   : GPUTexture;  // temporary depth for spot renders

  private _pointFaceViews: GPUTextureView[];  // per-face colour views for rendering
  private _spotFaceViews : GPUTextureView[];  // per-slot colour views
  private _pointDepthView: GPUTextureView;
  private _spotDepthView : GPUTextureView;

  private _pointPipeline: GPURenderPipeline;
  private _spotPipeline : GPURenderPipeline;

  // One shadow uniform buffer per potential render pass (6*4 point + 8 spot = 32)
  private _shadowBufs: GPUBuffer[];
  private _shadowBGs : GPUBindGroup[];

  // Pool of per-model uniform buffers (shared across all passes since model matrices
  // don't change between shadow passes)
  private _modelBufs: GPUBuffer[] = [];
  private _modelBGs : GPUBindGroup[] = [];
  private _modelBGL : GPUBindGroupLayout;

  private _snapshot : DrawItem[] = [];
  private _pointLights: PointLight[] = [];
  private _spotLights : SpotLight[]  = [];

  private constructor(
    pointVsmTex  : GPUTexture,
    spotVsmTex   : GPUTexture,
    projTexArray : GPUTexture,
    pointDepth   : GPUTexture,
    spotDepth    : GPUTexture,
    pointFaceViews: GPUTextureView[],
    spotFaceViews : GPUTextureView[],
    pointDepthView: GPUTextureView,
    spotDepthView : GPUTextureView,
    pointPipeline : GPURenderPipeline,
    spotPipeline  : GPURenderPipeline,
    shadowBufs    : GPUBuffer[],
    shadowBGs     : GPUBindGroup[],
    modelBGL      : GPUBindGroupLayout,
  ) {
    super();
    this._pointVsmTex  = pointVsmTex;
    this._spotVsmTex   = spotVsmTex;
    this._projTexArray = projTexArray;
    this._pointDepth   = pointDepth;
    this._spotDepth    = spotDepth;
    this._pointFaceViews = pointFaceViews;
    this._spotFaceViews  = spotFaceViews;
    this._pointDepthView = pointDepthView;
    this._spotDepthView  = spotDepthView;
    this._pointPipeline  = pointPipeline;
    this._spotPipeline   = spotPipeline;
    this._shadowBufs     = shadowBufs;
    this._shadowBGs      = shadowBGs;
    this._modelBGL       = modelBGL;

    // Cube-array view over the point VSM (MAX_SHADOW_POINT_LIGHTS cubes × 6 faces)
    this.pointVsmView = pointVsmTex.createView({
      dimension: 'cube-array',
      arrayLayerCount: MAX_SHADOW_POINT_LIGHTS * 6,
    });
    // 2D-array view over spot VSM
    this.spotVsmView = spotVsmTex.createView({ dimension: '2d-array' });
    // 2D-array view over projection texture
    this.projTexView = projTexArray.createView({ dimension: '2d-array' });
  }

  static create(ctx: RenderContext): PointSpotShadowPass {
    const { device } = ctx;

    // VSM colour textures
    const pointVsmTex = device.createTexture({
      label: 'PointVSM',
      size: { width: VSM_POINT_SIZE, height: VSM_POINT_SIZE, depthOrArrayLayers: MAX_SHADOW_POINT_LIGHTS * 6 },
      format: 'rgba16float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    const spotVsmTex = device.createTexture({
      label: 'SpotVSM',
      size: { width: VSM_SPOT_SIZE, height: VSM_SPOT_SIZE, depthOrArrayLayers: MAX_SHADOW_SPOT_LIGHTS },
      format: 'rgba16float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    // Projection texture array — default all-white (no gobo)
    const projTexArray = device.createTexture({
      label: 'ProjTexArray',
      size: { width: PROJ_TEX_SIZE, height: PROJ_TEX_SIZE, depthOrArrayLayers: MAX_SHADOW_SPOT_LIGHTS },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    // Fill all layers with white
    const whitePixels = new Uint8Array(PROJ_TEX_SIZE * PROJ_TEX_SIZE * 4).fill(255);
    for (let layer = 0; layer < MAX_SHADOW_SPOT_LIGHTS; layer++) {
      device.queue.writeTexture(
        { texture: projTexArray, origin: { x: 0, y: 0, z: layer } },
        whitePixels,
        { bytesPerRow: PROJ_TEX_SIZE * 4, rowsPerImage: PROJ_TEX_SIZE },
        { width: PROJ_TEX_SIZE, height: PROJ_TEX_SIZE, depthOrArrayLayers: 1 },
      );
    }

    // Temporary depth buffers (reused per pass)
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

    // Per-face/slot render attachment views
    const pointFaceViews = Array.from({ length: MAX_SHADOW_POINT_LIGHTS * 6 }, (_, i) =>
      pointVsmTex.createView({ dimension: '2d', baseArrayLayer: i, arrayLayerCount: 1 }),
    );
    const spotFaceViews = Array.from({ length: MAX_SHADOW_SPOT_LIGHTS }, (_, i) =>
      spotVsmTex.createView({ dimension: '2d', baseArrayLayer: i, arrayLayerCount: 1 }),
    );
    const pointDepthView = pointDepth.createView();
    const spotDepthView  = spotDepth.createView();

    // Bind group layouts (shared between both pipelines)
    const shadowBGL = device.createBindGroupLayout({
      label: 'PSShadowBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const modelBGL = device.createBindGroupLayout({
      label: 'PSModelBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });

    // Shadow uniform buffers + bind groups (one per potential render pass)
    const shadowBufs: GPUBuffer[] = [];
    const shadowBGs : GPUBindGroup[] = [];
    for (let i = 0; i < TOTAL_SHADOW_PASSES; i++) {
      const buf = device.createBuffer({
        label: `PSShadowUniform ${i}`,
        size: SHADOW_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      shadowBufs.push(buf);
      shadowBGs.push(device.createBindGroup({
        label: `PSShadowBG ${i}`,
        layout: shadowBGL,
        entries: [{ binding: 0, resource: { buffer: buf } }],
      }));
    }

    const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [shadowBGL, modelBGL] });
    const shaderModule   = device.createShaderModule({ label: 'PointSpotShadowShader', code: shadowWgsl });

    const vertexState = {
      module: shaderModule,
      buffers: [{
        arrayStride: VERTEX_STRIDE,
        attributes: [VERTEX_ATTRIBUTES[0]],  // position only
      }],
    };

    const pointPipeline = device.createRenderPipeline({
      label: 'PointShadowPipeline',
      layout: pipelineLayout,
      vertex: { ...vertexState, entryPoint: 'vs_point' },
      fragment: { module: shaderModule, entryPoint: 'fs_point', targets: [{ format: 'rgba16float' }] },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
    });

    const spotPipeline = device.createRenderPipeline({
      label: 'SpotShadowPipeline',
      layout: pipelineLayout,
      vertex: { ...vertexState, entryPoint: 'vs_spot' },
      fragment: { module: shaderModule, entryPoint: 'fs_spot', targets: [{ format: 'rgba16float' }] },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
    });

    return new PointSpotShadowPass(
      pointVsmTex, spotVsmTex, projTexArray,
      pointDepth, spotDepth,
      pointFaceViews, spotFaceViews,
      pointDepthView, spotDepthView,
      pointPipeline, spotPipeline,
      shadowBufs, shadowBGs,
      modelBGL,
    );
  }

  update(pointLights: PointLight[], spotLights: SpotLight[], snapshot: DrawItem[]): void {
    this._pointLights = pointLights;
    this._spotLights  = spotLights;
    this._snapshot    = snapshot;
  }

  // Copy a 256×256 rgba8unorm GPUTexture into projection texture slot `slot`.
  setProjectionTexture(encoder: GPUCommandEncoder, slot: number, src: GPUTexture): void {
    encoder.copyTextureToTexture(
      { texture: src },
      { texture: this._projTexArray, origin: { x: 0, y: 0, z: slot } },
      { width: PROJ_TEX_SIZE, height: PROJ_TEX_SIZE, depthOrArrayLayers: 1 },
    );
  }

  execute(encoder: GPUCommandEncoder, ctx: RenderContext): void {
    const { device } = ctx;
    const items = this._snapshot;
    this._ensureModelBuffers(device, items.length);

    // Write model matrices once (same across all shadow passes)
    for (let i = 0; i < items.length; i++) {
      ctx.queue.writeBuffer(this._modelBufs[i], 0, items[i].modelMatrix.data.buffer as ArrayBuffer);
    }

    let bufIdx = 0;

    // ---- Point light shadow passes ------------------------------------------
    let shadowPointIdx = 0;
    for (const pl of this._pointLights) {
      if (!pl.castShadow || shadowPointIdx >= MAX_SHADOW_POINT_LIGHTS) continue;

      const pos       = pl.worldPosition();
      const faceVPs   = pl.cubeFaceViewProjs();
      const uniform   = new Float32Array(SHADOW_UNIFORM_SIZE / 4);
      uniform[16] = pos.x; uniform[17] = pos.y; uniform[18] = pos.z;
      uniform[19] = pl.radius;

      for (let face = 0; face < 6; face++) {
        uniform.set(faceVPs[face].data, 0);
        ctx.queue.writeBuffer(this._shadowBufs[bufIdx], 0, uniform.buffer as ArrayBuffer);

        const layerIdx = shadowPointIdx * 6 + face;
        const pass = encoder.beginRenderPass({
          label: `PointShadow light${shadowPointIdx} face${face}`,
          colorAttachments: [{
            view: this._pointFaceViews[layerIdx],
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

    // ---- Spot light shadow passes -------------------------------------------
    let shadowSpotIdx = 0;
    for (const sl of this._spotLights) {
      if (!sl.castShadow || shadowSpotIdx >= MAX_SHADOW_SPOT_LIGHTS) continue;

      const vp      = sl.lightViewProj();
      const pos     = sl.worldPosition();
      const uniform = new Float32Array(SHADOW_UNIFORM_SIZE / 4);
      uniform.set(vp.data, 0);
      uniform[16] = pos.x; uniform[17] = pos.y; uniform[18] = pos.z;
      uniform[19] = sl.range;
      ctx.queue.writeBuffer(this._shadowBufs[bufIdx], 0, uniform.buffer as ArrayBuffer);

      const pass = encoder.beginRenderPass({
        label: `SpotShadow light${shadowSpotIdx}`,
        colorAttachments: [{
          view: this._spotFaceViews[shadowSpotIdx],
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

  private _ensureModelBuffers(device: GPUDevice, count: number): void {
    while (this._modelBufs.length < count) {
      const buf = device.createBuffer({
        label: `PSModelUniform ${this._modelBufs.length}`,
        size: MODEL_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this._modelBufs.push(buf);
      this._modelBGs.push(device.createBindGroup({
        layout: this._modelBGL,
        entries: [{ binding: 0, resource: { buffer: buf } }],
      }));
    }
  }

  destroy(): void {
    this._pointVsmTex.destroy();
    this._spotVsmTex.destroy();
    this._projTexArray.destroy();
    this._pointDepth.destroy();
    this._spotDepth.destroy();
    for (const buf of this._shadowBufs) buf.destroy();
    for (const buf of this._modelBufs)  buf.destroy();
  }
}
