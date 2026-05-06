import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import type { Mesh } from '../../assets/mesh.js';
import type { Mat4 } from '../../math/mat4.js';
import { Vec3 } from '../../math/vec3.js';
import shadowCubeWgsl from '../../shaders/shadow_cube.wgsl?raw';

const CAMERA_UNIFORM_SIZE = 6 * 64 + 16; // 6 mat4s + vec3 + f32 (with padding)
const MODEL_UNIFORM_SIZE = 64;

export interface PointShadowDrawItem {
  mesh: Mesh;
  modelMatrix: Mat4;
}

export class PointShadowPass extends RenderPass {
  readonly name = 'PointShadowPass';

  private _pipeline: GPURenderPipeline;
  private _cameraBGL: GPUBindGroupLayout;
  private _modelBGL: GPUBindGroupLayout;

  private _cameraBuffer: GPUBuffer;
  private _cameraBindGroup: GPUBindGroup | null = null;

  private _modelBuffers: GPUBuffer[] = [];
  private _modelBindGroups: GPUBindGroup[] = [];

  private _drawItems: PointShadowDrawItem[] = [];
  private _shadowCubeFaceViews: GPUTextureView[] = [];

  private readonly _modelData = new Float32Array(16);

  private constructor(
    pipeline: GPURenderPipeline,
    cameraBGL: GPUBindGroupLayout,
    modelBGL: GPUBindGroupLayout,
    cameraBuffer: GPUBuffer,
    shadowCubeFaceViews: GPUTextureView[],
  ) {
    super();
    this._pipeline = pipeline;
    this._cameraBGL = cameraBGL;
    this._modelBGL = modelBGL;
    this._cameraBuffer = cameraBuffer;
    this._shadowCubeFaceViews = shadowCubeFaceViews;
  }

  static create(ctx: RenderContext, shadowCubeTexture: GPUTexture): PointShadowPass {
    const { device } = ctx;

    // Create views for each cube face
    const shadowCubeFaceViews: GPUTextureView[] = [];
    for (let i = 0; i < 6; i++) {
      shadowCubeFaceViews.push(
        shadowCubeTexture.createView({
          dimension: '2d',
          baseArrayLayer: i,
          arrayLayerCount: 1,
        })
      );
    }

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

    const cameraBuffer = device.createBuffer({
      label: 'PointShadowCameraBuffer',
      size: CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const shaderModule = device.createShaderModule({
      label: 'PointShadowShader',
      code: shadowCubeWgsl,
    });

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

    return new PointShadowPass(pipeline, cameraBGL, modelBGL, cameraBuffer, shadowCubeFaceViews);
  }

  setDrawItems(items: PointShadowDrawItem[]): void {
    this._drawItems = items;
  }

  updateCamera(ctx: RenderContext, lightPosition: Vec3, viewProjections: Mat4[], farPlane: number): void {
    const data = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
    // Write 6 view-projection matrices
    for (let i = 0; i < 6; i++) {
      data.set(viewProjections[i].data, i * 16);
    }
    // Write light position and far plane
    const offset = 6 * 16;
    data[offset + 0] = lightPosition.x;
    data[offset + 1] = lightPosition.y;
    data[offset + 2] = lightPosition.z;
    data[offset + 3] = farPlane;

    ctx.queue.writeBuffer(this._cameraBuffer, 0, data);

    if (!this._cameraBindGroup) {
      this._cameraBindGroup = ctx.device.createBindGroup({
        label: 'PointShadowCameraBindGroup',
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

    // Render to each cube face
    for (let face = 0; face < 6; face++) {
      const pass = encoder.beginRenderPass({
        label: `PointShadowPass_Face${face}`,
        colorAttachments: [],
        depthStencilAttachment: {
          view: this._shadowCubeFaceViews[face],
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
    this._cameraBuffer.destroy();
    for (const buffer of this._modelBuffers) {
      buffer.destroy();
    }
  }
}
