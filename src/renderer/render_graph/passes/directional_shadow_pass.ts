import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../../assets/mesh.js';
import type { Mesh } from '../../../assets/mesh.js';
import type { Mat4 } from '../../../math/mat4.js';
import shadowWgsl from '../../../shaders/shadow.wgsl?raw';

const CAMERA_UNIFORM_SIZE = 64;
const MODEL_UNIFORM_SIZE = 64;

export interface DirectionalShadowDrawItem {
  mesh: Mesh;
  modelMatrix: Mat4;
}

export interface DirectionalShadowDeps {
  resolution: number;
}

export interface DirectionalShadowOutputs {
  shadowMap: ResourceHandle;
}

export class DirectionalShadowPass extends Pass<DirectionalShadowDeps, DirectionalShadowOutputs> {
  readonly name = 'DirectionalShadowPass';

  private readonly _pipeline: GPURenderPipeline;
  private readonly _modelBGL: GPUBindGroupLayout;

  private readonly _cameraBuffer: GPUBuffer;
  private readonly _cameraBindGroup: GPUBindGroup;

  private readonly _modelBuffers: GPUBuffer[] = [];
  private readonly _modelBindGroups: GPUBindGroup[] = [];

  private _drawItems: DirectionalShadowDrawItem[] = [];
  private readonly _modelData = new Float32Array(16);
  private readonly _cameraScratch = new Float32Array(16);

  private constructor(
    pipeline: GPURenderPipeline,
    modelBGL: GPUBindGroupLayout,
    cameraBuffer: GPUBuffer,
    cameraBindGroup: GPUBindGroup,
  ) {
    super();
    this._pipeline = pipeline;
    this._modelBGL = modelBGL;
    this._cameraBuffer = cameraBuffer;
    this._cameraBindGroup = cameraBindGroup;
  }

  static create(ctx: RenderContext): DirectionalShadowPass {
    const { device } = ctx;

    const cameraBGL = device.createBindGroupLayout({
      label: 'DirectionalShadowCameraBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
      ],
    });

    const modelBGL = device.createBindGroupLayout({
      label: 'DirectionalShadowModelBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
      ],
    });

    const cameraBuffer = device.createBuffer({
      label: 'DirectionalShadowCameraBuffer',
      size: CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const cameraBindGroup = device.createBindGroup({
      label: 'DirectionalShadowCameraBindGroup',
      layout: cameraBGL,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });

    const shaderModule = ctx.createShaderModule(shadowWgsl, 'DirectionalShadowShader');

    const pipeline = device.createRenderPipeline({
      label: 'DirectionalShadowPipeline',
      layout: device.createPipelineLayout({
        bindGroupLayouts: [cameraBGL, modelBGL],
      }),
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [{
          arrayStride: VERTEX_STRIDE,
          attributes: [VERTEX_ATTRIBUTES[0]],
        }],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [],
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

    return new DirectionalShadowPass(pipeline, modelBGL, cameraBuffer, cameraBindGroup);
  }

  setDrawItems(items: DirectionalShadowDrawItem[]): void {
    this._drawItems = items;
  }

  updateCamera(ctx: RenderContext, lightViewProj: Mat4): void {
    const data = this._cameraScratch;
    data.set(lightViewProj.data, 0);
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data);
  }

  addToGraph(graph: RenderGraph, deps: DirectionalShadowDeps): DirectionalShadowOutputs {
    const { ctx } = graph;

    let shadowMap!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      shadowMap = b.createTexture({
        label: 'DirectionalShadowMap',
        format: 'depth32float',
        width: deps.resolution,
        height: deps.resolution,
        extraUsage: GPUTextureUsage.TEXTURE_BINDING,
      } as TextureDesc);
      b.write(shadowMap, 'depth-attachment', {
        depthLoadOp: 'clear', depthStoreOp: 'store', depthClearValue: 1.0,
      });

      b.setExecute((pctx) => {
        this._ensureModelBuffers(ctx.device, this._drawItems.length);

        for (let i = 0; i < this._drawItems.length; i++) {
          this._modelData.set(this._drawItems[i].modelMatrix.data, 0);
          ctx.queue.writeBuffer(this._modelBuffers[i], 0, this._modelData);
        }

        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._cameraBindGroup);

        for (let i = 0; i < this._drawItems.length; i++) {
          const item = this._drawItems[i];
          enc.setBindGroup(1, this._modelBindGroups[i]);
          enc.setVertexBuffer(0, item.mesh.vertexBuffer);
          enc.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
          enc.drawIndexed(item.mesh.indexCount);
        }
      });
    });

    return { shadowMap };
  }

  private _ensureModelBuffers(device: GPUDevice, count: number): void {
    while (this._modelBuffers.length < count) {
      const idx = this._modelBuffers.length;
      const buffer = device.createBuffer({
        label: `DirectionalShadowModelBuffer${idx}`,
        size: MODEL_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this._modelBuffers.push(buffer);

      const bindGroup = device.createBindGroup({
        label: `DirectionalShadowModelBG${idx}`,
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
