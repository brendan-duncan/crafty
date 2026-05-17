import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../../assets/mesh.js';
import type { Mesh } from '../../../assets/mesh.js';
import type { Mat4 } from '../../../math/mat4.js';
import { Vec3 } from '../../../math/vec3.js';
import shadowCubeWgsl from '../../../shaders/shadow_cube.wgsl?raw';

const CAMERA_UNIFORM_SIZE = 80;
const MODEL_UNIFORM_SIZE = 64;

export interface PointShadowDrawItem {
  mesh: Mesh;
  modelMatrix: Mat4;
}

export interface PointShadowDeps {
  resolution?: number;
}

export interface PointShadowOutputs {
  shadowCube: ResourceHandle;
}

export class PointShadowPass extends Pass<PointShadowDeps, PointShadowOutputs> {
  readonly name = 'PointShadowPass';

  private readonly _pipeline: GPURenderPipeline;
  private readonly _modelBGL: GPUBindGroupLayout;

  private readonly _cameraBuffers: GPUBuffer[];
  private readonly _cameraBindGroups: GPUBindGroup[];

  private readonly _modelBuffers: GPUBuffer[] = [];
  private readonly _modelBindGroups: GPUBindGroup[] = [];

  private _drawItems: PointShadowDrawItem[] = [];
  private readonly _modelData = new Float32Array(16);
  private readonly _cameraScratch = new Float32Array(CAMERA_UNIFORM_SIZE / 4);

  private constructor(
    pipeline: GPURenderPipeline,
    modelBGL: GPUBindGroupLayout,
    cameraBuffers: GPUBuffer[],
    cameraBindGroups: GPUBindGroup[],
  ) {
    super();
    this._pipeline = pipeline;
    this._modelBGL = modelBGL;
    this._cameraBuffers = cameraBuffers;
    this._cameraBindGroups = cameraBindGroups;
  }

  static create(ctx: RenderContext): PointShadowPass {
    const { device } = ctx;

    const cameraBGL = device.createBindGroupLayout({
      label: 'PointShadowCameraBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    const modelBGL = device.createBindGroupLayout({
      label: 'PointShadowModelBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
      ],
    });

    const cameraBuffers: GPUBuffer[] = [];
    const cameraBindGroups: GPUBindGroup[] = [];
    for (let i = 0; i < 6; i++) {
      const buffer = device.createBuffer({
        label: `PointShadowCameraBuffer_Face${i}`,
        size: CAMERA_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      cameraBuffers.push(buffer);
      cameraBindGroups.push(device.createBindGroup({
        label: `PointShadowCameraBindGroup_Face${i}`,
        layout: cameraBGL,
        entries: [{ binding: 0, resource: { buffer } }],
      }));
    }

    const shaderModule = ctx.createShaderModule(shadowCubeWgsl, 'PointShadowShader');

    const pipeline = device.createRenderPipeline({
      label: 'PointShadowPipeline',
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
        cullMode: 'front',
      },
    });

    return new PointShadowPass(pipeline, modelBGL, cameraBuffers, cameraBindGroups);
  }

  setDrawItems(items: PointShadowDrawItem[]): void {
    this._drawItems = items;
  }

  updateCamera(ctx: RenderContext, lightPosition: Vec3, viewProjections: Mat4[], farPlane: number): void {
    const data = this._cameraScratch;
    for (let face = 0; face < 6; face++) {
      data.set(viewProjections[face].data, 0);
      data[16] = lightPosition.x;
      data[17] = lightPosition.y;
      data[18] = lightPosition.z;
      data[19] = farPlane;
      ctx.queue.writeBuffer(this._cameraBuffers[face], 0, data);
    }
  }

  addToGraph(graph: RenderGraph, deps: PointShadowDeps = {}): PointShadowOutputs {
    const { ctx } = graph;
    const resolution = deps.resolution ?? 256;

    let shadowCube!: ResourceHandle;

    for (let face = 0; face < 6; face++) {
      graph.addPass(`${this.name}_face${face}`, 'render', (b: PassBuilder) => {
        if (face === 0) {
          shadowCube = b.createTexture({
            label: 'PointShadowCube',
            format: 'depth32float',
            width: resolution,
            height: resolution,
            depthOrArrayLayers: 6,
            extraUsage: GPUTextureUsage.TEXTURE_BINDING,
          } as TextureDesc);
        } else {
          b.read(shadowCube, 'sampled');
        }
        b.write(shadowCube, 'depth-attachment', {
          depthLoadOp: 'clear', depthStoreOp: 'store', depthClearValue: 1.0,
          view: { dimension: '2d', baseArrayLayer: face, arrayLayerCount: 1 },
        });

        b.setExecute((pctx) => {
          this._ensureModelBuffers(ctx.device, this._drawItems.length);

          for (let i = 0; i < this._drawItems.length; i++) {
            this._modelData.set(this._drawItems[i].modelMatrix.data, 0);
            ctx.queue.writeBuffer(this._modelBuffers[i], 0, this._modelData);
          }

          const enc = pctx.renderPassEncoder!;
          enc.setPipeline(this._pipeline);
          enc.setBindGroup(0, this._cameraBindGroups[face]);

          for (let i = 0; i < this._drawItems.length; i++) {
            const item = this._drawItems[i];
            enc.setBindGroup(1, this._modelBindGroups[i]);
            enc.setVertexBuffer(0, item.mesh.vertexBuffer);
            enc.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
            enc.drawIndexed(item.mesh.indexCount);
          }
        });
      });
    }

    return { shadowCube };
  }

  private _ensureModelBuffers(device: GPUDevice, count: number): void {
    while (this._modelBuffers.length < count) {
      const idx = this._modelBuffers.length;
      const buffer = device.createBuffer({
        label: `PointShadowModelBuffer${idx}`,
        size: MODEL_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this._modelBuffers.push(buffer);

      const bindGroup = device.createBindGroup({
        label: `PointShadowModelBG${idx}`,
        layout: this._modelBGL,
        entries: [{ binding: 0, resource: { buffer } }],
      });
      this._modelBindGroups.push(bindGroup);
    }
  }

  destroy(): void {
    for (const buffer of this._cameraBuffers) {
      buffer.destroy();
    }
    for (const buffer of this._modelBuffers) {
      buffer.destroy();
    }
  }
}
