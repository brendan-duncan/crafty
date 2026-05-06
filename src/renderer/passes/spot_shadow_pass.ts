import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import type { Mesh } from '../../assets/mesh.js';
import type { Mat4 } from '../../math/mat4.js';
import shadowWgsl from '../../shaders/shadow.wgsl?raw';

const CAMERA_UNIFORM_SIZE = 64; // 1 mat4
const MODEL_UNIFORM_SIZE = 64;  // 1 mat4

export interface SpotShadowDrawItem {
  mesh: Mesh;
  modelMatrix: Mat4;
}

export class SpotShadowPass extends RenderPass {
  readonly name = 'SpotShadowPass';

  private _pipeline: GPURenderPipeline;
  private _cameraBGL: GPUBindGroupLayout;
  private _modelBGL: GPUBindGroupLayout;

  private _cameraBuffer: GPUBuffer;
  private _cameraBindGroup: GPUBindGroup | null = null;

  private _modelBuffers: GPUBuffer[] = [];
  private _modelBindGroups: GPUBindGroup[] = [];

  private _drawItems: SpotShadowDrawItem[] = [];
  private _shadowMapView: GPUTextureView;

  private readonly _modelData = new Float32Array(16);

  private constructor(
    pipeline: GPURenderPipeline,
    cameraBGL: GPUBindGroupLayout,
    modelBGL: GPUBindGroupLayout,
    cameraBuffer: GPUBuffer,
    shadowMapView: GPUTextureView,
  ) {
    super();
    this._pipeline = pipeline;
    this._cameraBGL = cameraBGL;
    this._modelBGL = modelBGL;
    this._cameraBuffer = cameraBuffer;
    this._shadowMapView = shadowMapView;
  }

  static create(ctx: RenderContext, shadowMapView: GPUTextureView): SpotShadowPass {
    const { device } = ctx;

    const cameraBGL = device.createBindGroupLayout({
      label: 'SpotShadowCameraBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
      ],
    });

    const modelBGL = device.createBindGroupLayout({
      label: 'SpotShadowModelBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
      ],
    });

    const cameraBuffer = device.createBuffer({
      label: 'SpotShadowCameraBuffer',
      size: CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const shaderModule = device.createShaderModule({
      label: 'SpotShadowShader',
      code: shadowWgsl,
    });

    const pipeline = device.createRenderPipeline({
      label: 'SpotShadowPipeline',
      layout: device.createPipelineLayout({
        bindGroupLayouts: [cameraBGL, modelBGL],
      }),
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [{
          arrayStride: VERTEX_STRIDE,
          attributes: [VERTEX_ATTRIBUTES[0]], // Only position needed
        }],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [], // Depth-only output
      },
      depthStencil: {
        format: 'depth32float',
        depthWriteEnabled: true,
        depthCompare: 'less',
        depthBias: 1,
        depthBiasSlopeScale: 1.5,
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: 'back',
      },
    });

    return new SpotShadowPass(pipeline, cameraBGL, modelBGL, cameraBuffer, shadowMapView);
  }

  setDrawItems(items: SpotShadowDrawItem[]): void {
    this._drawItems = items;
  }

  updateCamera(ctx: RenderContext, lightViewProj: Mat4): void {
    const data = new Float32Array(16);
    data.set(lightViewProj.data, 0);
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data);

    if (!this._cameraBindGroup) {
      this._cameraBindGroup = ctx.device.createBindGroup({
        label: 'SpotShadowCameraBindGroup',
        layout: this._cameraBGL,
        entries: [{ binding: 0, resource: { buffer: this._cameraBuffer } }],
      });
    }
  }

  execute(encoder: GPUCommandEncoder, ctx: RenderContext): void {
    if (!this._cameraBindGroup) {
      return;
    }

    this._ensureModelBuffers(ctx.device, this._drawItems.length);

    // Write all model matrices
    for (let i = 0; i < this._drawItems.length; i++) {
      const item = this._drawItems[i];
      this._modelData.set(item.modelMatrix.data, 0);
      ctx.queue.writeBuffer(this._modelBuffers[i], 0, this._modelData);
    }

    const pass = encoder.beginRenderPass({
      label: 'SpotShadowPass',
      colorAttachments: [],
      depthStencilAttachment: {
        view: this._shadowMapView,
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      },
    });

    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._cameraBindGroup);

    for (let i = 0; i < this._drawItems.length; i++) {
      const item = this._drawItems[i];
      pass.setBindGroup(1, this._modelBindGroups[i]);
      pass.setVertexBuffer(0, item.mesh.vertexBuffer);
      pass.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
      pass.drawIndexed(item.mesh.indexCount);
    }

    pass.end();
  }

  private _ensureModelBuffers(device: GPUDevice, count: number): void {
    while (this._modelBuffers.length < count) {
      const idx = this._modelBuffers.length;
      const buffer = device.createBuffer({
        label: `SpotShadowModelBuffer${idx}`,
        size: MODEL_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this._modelBuffers.push(buffer);

      const bindGroup = device.createBindGroup({
        label: `SpotShadowModelBG${idx}`,
        layout: this._modelBGL,
        entries: [{ binding: 0, resource: { buffer } }],
      });
      this._modelBindGroups.push(bindGroup);
    }
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    for (const buffer of this._modelBuffers) {
      buffer.destroy();
    }
  }
}
