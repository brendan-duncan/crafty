import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { Scene } from '../../engine/scene.js';
import type { Camera } from '../../engine/components/camera.js';
import type { DirectionalLight, CascadeData } from '../../engine/components/directional_light.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import shadowWgsl from '../../shaders/shadow.wgsl?raw';

const SHADOW_SIZE = 2048;
const MAX_CASCADES = 4;

export class ShadowPass extends RenderPass {
  readonly name = 'ShadowPass';

  readonly shadowMap: GPUTexture;
  readonly shadowMapView: GPUTextureView;
  readonly shadowMapArrayViews: GPUTextureView[];

  private _pipeline: GPURenderPipeline;
  private _shadowBindGroups: GPUBindGroup[];
  private _shadowUniformBuffers: GPUBuffer[];
  private _modelUniformBuffers: GPUBuffer[] = [];
  private _modelBindGroups: GPUBindGroup[] = [];
  private _cascadeCount: number;
  private _cascades: CascadeData[] = [];

  private _modelBGL: GPUBindGroupLayout;

  private constructor(
    shadowMap: GPUTexture,
    shadowMapView: GPUTextureView,
    shadowMapArrayViews: GPUTextureView[],
    pipeline: GPURenderPipeline,
    shadowBindGroups: GPUBindGroup[],
    shadowUniformBuffers: GPUBuffer[],
    modelBGL: GPUBindGroupLayout,
    cascadeCount: number,
  ) {
    super();
    this.shadowMap = shadowMap;
    this.shadowMapView = shadowMapView;
    this.shadowMapArrayViews = shadowMapArrayViews;
    this._pipeline = pipeline;
    this._shadowBindGroups = shadowBindGroups;
    this._shadowUniformBuffers = shadowUniformBuffers;
    this._modelBGL = modelBGL;
    this._cascadeCount = cascadeCount;
  }

  static create(ctx: RenderContext, cascadeCount = 3): ShadowPass {
    const { device } = ctx;

    const shadowMap = device.createTexture({
      label: 'ShadowMap',
      size: { width: SHADOW_SIZE, height: SHADOW_SIZE, depthOrArrayLayers: MAX_CASCADES },
      format: 'depth32float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    const shadowMapView = shadowMap.createView({ dimension: '2d-array' });
    const shadowMapArrayViews = Array.from({ length: MAX_CASCADES }, (_, i) =>
      shadowMap.createView({ dimension: '2d', baseArrayLayer: i, arrayLayerCount: 1 }),
    );

    const shadowBGL = device.createBindGroupLayout({
      label: 'ShadowBGL',
      entries: [{
        binding: 0, visibility: GPUShaderStage.VERTEX,
        buffer: { type: 'uniform' },
      }],
    });

    const modelBGL = device.createBindGroupLayout({
      label: 'ModelBGL',
      entries: [{
        binding: 0, visibility: GPUShaderStage.VERTEX,
        buffer: { type: 'uniform' },
      }],
    });

    // One buffer + bind group per cascade so each writeBuffer targets a distinct buffer.
    // If all cascades shared one buffer, the last writeBuffer would win for every pass.
    const shadowUniformBuffers: GPUBuffer[] = [];
    const shadowBindGroups: GPUBindGroup[] = [];
    for (let i = 0; i < MAX_CASCADES; i++) {
      const buf = device.createBuffer({
        label: `ShadowUniformBuffer ${i}`,
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      shadowUniformBuffers.push(buf);
      shadowBindGroups.push(device.createBindGroup({
        label: `ShadowBindGroup ${i}`,
        layout: shadowBGL,
        entries: [{ binding: 0, resource: { buffer: buf } }],
      }));
    }

    const shaderModule = device.createShaderModule({ label: 'ShadowShader', code: shadowWgsl });

    const pipeline = device.createRenderPipeline({
      label: 'ShadowPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [shadowBGL, modelBGL] }),
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [{
          arrayStride: VERTEX_STRIDE,
          attributes: [VERTEX_ATTRIBUTES[0]], // position only
        }],
      },
      depthStencil: {
        format: 'depth32float',
        depthWriteEnabled: true,
        depthCompare: 'less',
        depthBias: 2,
        depthBiasSlopeScale: 1.5,
        depthBiasClamp: 0.0,
      },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
    });

    return new ShadowPass(
      shadowMap, shadowMapView, shadowMapArrayViews,
      pipeline, shadowBindGroups, shadowUniformBuffers,
      modelBGL, cascadeCount,
    );
  }

  updateScene(_scene: Scene, camera: Camera, light: DirectionalLight, shadowFar?: number): void {
    this._cascades = light.computeCascadeMatrices(camera, shadowFar);
    this._cascadeCount = Math.min(this._cascades.length, MAX_CASCADES);
  }

  execute(encoder: GPUCommandEncoder, ctx: RenderContext): void {
    const { device } = ctx;
    const meshRenderers = this._getMeshRenderers(ctx);

    // Ensure we have enough model uniform buffers
    this._ensureModelBuffers(device, meshRenderers.length);

    for (let c = 0; c < this._cascadeCount; c++) {
      if (c >= this._cascades.length) {
        break;
      }
      const cascade = this._cascades[c];

      ctx.queue.writeBuffer(this._shadowUniformBuffers[c], 0, cascade.lightViewProj.data.buffer as ArrayBuffer);

      const pass = encoder.beginRenderPass({
        label: `ShadowPass cascade ${c}`,
        colorAttachments: [],
        depthStencilAttachment: {
          view: this.shadowMapArrayViews[c],
          depthClearValue: 1,
          depthLoadOp: 'clear',
          depthStoreOp: 'store',
        },
      });
      pass.setPipeline(this._pipeline);
      pass.setBindGroup(0, this._shadowBindGroups[c]);

      for (let i = 0; i < meshRenderers.length; i++) {
        const { mesh, modelMatrix } = meshRenderers[i];

        const buf = this._modelUniformBuffers[i];
        ctx.queue.writeBuffer(buf, 0, modelMatrix.data.buffer as ArrayBuffer);

        pass.setBindGroup(1, this._modelBindGroups[i]);
        pass.setVertexBuffer(0, mesh.vertexBuffer);
        pass.setIndexBuffer(mesh.indexBuffer, 'uint32');
        pass.drawIndexed(mesh.indexCount);
      }
      pass.end();
    }
  }

  private _getMeshRenderers(_ctx: RenderContext) {
    return this._sceneSnapshot ?? [];
  }

  private _sceneSnapshot: Array<{ mesh: import('../../assets/mesh.js').Mesh; modelMatrix: import('../../math/mat4.js').Mat4 }> = [];

  setSceneSnapshot(snapshot: typeof this._sceneSnapshot): void {
    this._sceneSnapshot = snapshot;
  }

  private _ensureModelBuffers(device: GPUDevice, count: number): void {
    while (this._modelUniformBuffers.length < count) {
      const buf = device.createBuffer({
        label: `ModelUniform ${this._modelUniformBuffers.length}`,
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      const bg = device.createBindGroup({
        layout: this._modelBGL,
        entries: [{ binding: 0, resource: { buffer: buf } }],
      });
      this._modelUniformBuffers.push(buf);
      this._modelBindGroups.push(bg);
    }
  }

  destroy(): void {
    this.shadowMap.destroy();
    for (const buf of this._shadowUniformBuffers) {
      buf.destroy();
    }
    for (const buf of this._modelUniformBuffers) {
      buf.destroy();
    }
  }
}
