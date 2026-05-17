import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import { SKINNED_VERTEX_ATTRIBUTES, SKINNED_VERTEX_STRIDE } from '../../../assets/skinned_mesh.js';
import type { SkinnedMesh } from '../../../assets/skinned_mesh.js';
import type { Mat4 } from '../../../math/mat4.js';
import { Material, MaterialPassType } from '../../material.js';
import { GBUF_ALBEDO_FORMAT, GBUF_NORMAL_FORMAT, GBUF_DEPTH_FORMAT } from './block_geometry_pass.js';

const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16;
const MODEL_UNIFORM_SIZE = 128;

export interface SkinnedDrawItem {
  mesh: SkinnedMesh;
  modelMatrix: Mat4;
  normalMatrix: Mat4;
  material: Material;
  jointMatrices: Float32Array;
}

export interface SkinnedGeometryDeps {
  /** Pre-existing GBuffer to load + write into. */
  gbuffer: { albedo: ResourceHandle; normal: ResourceHandle; depth: ResourceHandle };
}

export interface SkinnedGeometryOutputs {
  albedo: ResourceHandle;
  normal: ResourceHandle;
  depth: ResourceHandle;
}

/**
 * Geometry pass for skinned (animated) meshes (render-graph version).
 *
 * Performs GPU skinning in the vertex shader from per-mesh joint matrices,
 * then loads + writes albedo/normal/depth on top of the existing GBuffer.
 * Pipelines are cached per `material.shaderId`.
 */
export class SkinnedGeometryPass extends Pass<SkinnedGeometryDeps, SkinnedGeometryOutputs> {
  readonly name = 'SkinnedGeometryPass';

  private readonly _ctx: RenderContext;
  private readonly _device: GPUDevice;
  private readonly _cameraBgl: GPUBindGroupLayout;
  private readonly _modelJointBgl: GPUBindGroupLayout;
  private readonly _pipelineCache = new Map<string, GPURenderPipeline>();
  private readonly _cameraBuffer: GPUBuffer;
  private readonly _cameraBindGroup: GPUBindGroup;

  private readonly _modelBuffers: GPUBuffer[] = [];
  private readonly _jointBuffers: (GPUBuffer | null)[] = [];
  private readonly _jointBufferSizes: number[] = [];
  private readonly _modelJointBindGroups: (GPUBindGroup | null)[] = [];

  private _drawItems: SkinnedDrawItem[] = [];

  private readonly _modelData = new Float32Array(32);
  private readonly _cameraScratch = new Float32Array(CAMERA_UNIFORM_SIZE / 4);

  private constructor(
    ctx: RenderContext,
    device: GPUDevice,
    cameraBgl: GPUBindGroupLayout,
    modelJointBgl: GPUBindGroupLayout,
    cameraBuffer: GPUBuffer,
    cameraBindGroup: GPUBindGroup,
  ) {
    super();
    this._ctx = ctx;
    this._device = device;
    this._cameraBgl = cameraBgl;
    this._modelJointBgl = modelJointBgl;
    this._cameraBuffer = cameraBuffer;
    this._cameraBindGroup = cameraBindGroup;
  }

  static create(ctx: RenderContext): SkinnedGeometryPass {
    const { device } = ctx;

    const cameraBgl = device.createBindGroupLayout({
      label: 'SkinnedGeomCameraBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const modelJointBgl = device.createBindGroupLayout({
      label: 'SkinnedGeomModelJointBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
      ],
    });

    const cameraBuffer = device.createBuffer({
      label: 'SkinnedGeomCameraBuffer',
      size: CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const cameraBindGroup = device.createBindGroup({
      label: 'SkinnedGeomCameraBG', layout: cameraBgl,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });

    return new SkinnedGeometryPass(ctx, device, cameraBgl, modelJointBgl, cameraBuffer, cameraBindGroup);
  }

  setDrawItems(items: SkinnedDrawItem[]): void {
    this._drawItems = items;
  }

  updateCamera(ctx: RenderContext): void {
    const camera = ctx.activeCamera;
    if (!camera) {
      throw new Error('SkinnedGeometryPass.updateCamera: ctx.activeCamera is null');
    }
    const camPos = camera.position();
    const data = this._cameraScratch;
    data.set(camera.viewMatrix().data, 0);
    data.set(camera.projectionMatrix().data, 16);
    data.set(camera.jitteredViewProjectionMatrix().data, 32);
    data.set(camera.inverseViewProjectionMatrix().data, 48);
    data[64] = camPos.x; data[65] = camPos.y; data[66] = camPos.z;
    data[67] = camera.near; data[68] = camera.far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: SkinnedGeometryDeps): SkinnedGeometryOutputs {
    let outAlbedo!: ResourceHandle;
    let outNormal!: ResourceHandle;
    let outDepth!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      outAlbedo = b.write(deps.gbuffer.albedo, 'attachment', { loadOp: 'load', storeOp: 'store' });
      outNormal = b.write(deps.gbuffer.normal, 'attachment', { loadOp: 'load', storeOp: 'store' });
      outDepth = b.write(deps.gbuffer.depth, 'depth-attachment', { depthLoadOp: 'load', depthStoreOp: 'store' });

      b.setExecute((pctx) => {
        if (this._drawItems.length === 0) return;
        this._ensurePerDrawBuffers(this._drawItems.length);

        for (let i = 0; i < this._drawItems.length; i++) {
          const item = this._drawItems[i];

          const md = this._modelData;
          md.set(item.modelMatrix.data, 0);
          md.set(item.normalMatrix.data, 16);
          this._device.queue.writeBuffer(this._modelBuffers[i], 0, md.buffer as ArrayBuffer);

          item.material.update?.(this._device.queue);

          const jBytes = item.jointMatrices.byteLength;
          if ((this._jointBufferSizes[i] ?? 0) < jBytes || !this._jointBuffers[i]) {
            this._jointBuffers[i]?.destroy();
            const buf = this._device.createBuffer({
              label: `SkinnedGeomJointBuffer[${i}]`,
              size: Math.max(jBytes, 64),
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });
            this._jointBuffers[i] = buf;
            this._jointBufferSizes[i] = jBytes;
            this._modelJointBindGroups[i] = this._device.createBindGroup({
              label: `SkinnedGeomModelJointBG[${i}]`, layout: this._modelJointBgl,
              entries: [
                { binding: 0, resource: { buffer: this._modelBuffers[i] } },
                { binding: 1, resource: { buffer: buf } },
              ],
            });
          }
          this._device.queue.writeBuffer(this._jointBuffers[i]!, 0,
            item.jointMatrices.buffer as ArrayBuffer, item.jointMatrices.byteOffset, jBytes);
        }

        const enc = pctx.renderPassEncoder!;
        enc.setBindGroup(0, this._cameraBindGroup);

        for (let i = 0; i < this._drawItems.length; i++) {
          const item = this._drawItems[i];
          const variantMask = 'variantMask' in item.material ? (item.material as any).variantMask as number : 0;
          enc.setPipeline(this._getPipeline(item.material, variantMask));
          enc.setBindGroup(1, this._modelJointBindGroups[i]!);
          enc.setBindGroup(2, item.material.getBindGroup(this._device));
          enc.setVertexBuffer(0, item.mesh.vertexBuffer);
          enc.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
          enc.drawIndexed(item.mesh.indexCount);
        }
      });
    });

    return { albedo: outAlbedo, normal: outNormal, depth: outDepth };
  }

  private _getPipeline(material: Material, variantMask: number): GPURenderPipeline {
    const key = `${material.shaderId}:${variantMask}`;
    let pipeline = this._pipelineCache.get(key);
    if (pipeline) return pipeline;

    const defines: Record<string, string> = {};
    if (variantMask & 1) defines['HAS_ALBEDO_MAP'] = '1';
    if (variantMask & 2) defines['HAS_NORMAL_MAP'] = '1';
    if (variantMask & 4) defines['HAS_MER_MAP'] = '1';

    const shaderModule = this._ctx.createShaderModule(
      material.getShaderCode(MaterialPassType.SkinnedGeometry, variantMask),
      `SkinnedGeometryShader[${key}]`,
      defines,
    );
    pipeline = this._device.createRenderPipeline({
      label: `SkinnedGeometryPipeline[${key}]`,
      layout: this._device.createPipelineLayout({
        bindGroupLayouts: [this._cameraBgl, this._modelJointBgl, material.getBindGroupLayout(this._device, variantMask)],
      }),
      vertex: {
        module: shaderModule, entryPoint: 'vs_main',
        buffers: [{ arrayStride: SKINNED_VERTEX_STRIDE, attributes: SKINNED_VERTEX_ATTRIBUTES }],
      },
      fragment: {
        module: shaderModule, entryPoint: 'fs_main',
        targets: [{ format: GBUF_ALBEDO_FORMAT }, { format: GBUF_NORMAL_FORMAT }],
      },
      depthStencil: { format: GBUF_DEPTH_FORMAT, depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });
    this._pipelineCache.set(key, pipeline);
    return pipeline;
  }

  private _ensurePerDrawBuffers(count: number): void {
    while (this._modelBuffers.length < count) {
      const mb = this._device.createBuffer({
        size: MODEL_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this._modelBuffers.push(mb);
      this._jointBuffers.push(null);
      this._jointBufferSizes.push(0);
      this._modelJointBindGroups.push(null);
    }
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    for (const b of this._modelBuffers) b.destroy();
    for (const b of this._jointBuffers) b?.destroy();
  }
}
