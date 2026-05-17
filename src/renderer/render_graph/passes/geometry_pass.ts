import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE, type Mesh } from '../../../assets/mesh.js';
import type { Mat4 } from '../../../math/mat4.js';
import { Material, MaterialPassType } from '../../material.js';
import { GBUF_ALBEDO_FORMAT, GBUF_NORMAL_FORMAT, GBUF_DEPTH_FORMAT } from './block_geometry_pass.js';

const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16; // 4 mat4 + vec3+f32 + vec3+f32
const MODEL_UNIFORM_SIZE = 128;                 // 2 mat4 (model + normal)

/**
 * One mesh instance to be drawn into the G-buffer this frame.
 * `normalMatrix` is the inverse-transpose of the upper 3×3 of `modelMatrix`,
 * stored as a `Mat4` for uniform alignment.
 */
export interface DrawItem {
  mesh: Mesh;
  modelMatrix: Mat4;
  normalMatrix: Mat4;
  material: Material;
}

export interface GeometryDeps {
  /** Pre-existing GBuffer to load + write into. If absent, the pass creates fresh attachments and clears them. */
  gbuffer?: { albedo: ResourceHandle; normal: ResourceHandle; depth: ResourceHandle };
  /** When `gbuffer` is provided, defaults to `'load'`; otherwise `'clear'`. */
  loadOp?: GPULoadOp;
}

export interface GeometryOutputs {
  albedo: ResourceHandle;
  normal: ResourceHandle;
  depth: ResourceHandle;
}

/**
 * Deferred geometry pass for material-bearing meshes (render-graph version).
 *
 * Rasterises {@link DrawItem}s into the GBuffer (albedo+roughness,
 * normal+metallic, depth32float). Each draw supplies its own {@link Material};
 * pipelines are cached per `material.shaderId`. Camera uniforms and per-draw
 * model uniforms are owned by the pass.
 */
export class GeometryPass extends Pass<GeometryDeps, GeometryOutputs> {
  readonly name = 'GeometryPass';

  private readonly _ctx: RenderContext;
  private readonly _device: GPUDevice;
  private readonly _cameraBgl: GPUBindGroupLayout;
  private readonly _modelBgl: GPUBindGroupLayout;
  private readonly _pipelineCache = new Map<string, GPURenderPipeline>();

  private readonly _cameraBuffer: GPUBuffer;
  private readonly _cameraBindGroup: GPUBindGroup;

  private readonly _modelBuffers: GPUBuffer[] = [];
  private readonly _modelBindGroups: GPUBindGroup[] = [];

  private _drawItems: DrawItem[] = [];

  private readonly _modelData = new Float32Array(32);
  private readonly _cameraScratch = new Float32Array(CAMERA_UNIFORM_SIZE / 4);

  private constructor(
    ctx: RenderContext,
    device: GPUDevice,
    cameraBgl: GPUBindGroupLayout,
    modelBgl: GPUBindGroupLayout,
    cameraBuffer: GPUBuffer,
    cameraBindGroup: GPUBindGroup,
  ) {
    super();
    this._ctx = ctx;
    this._device = device;
    this._cameraBgl = cameraBgl;
    this._modelBgl = modelBgl;
    this._cameraBuffer = cameraBuffer;
    this._cameraBindGroup = cameraBindGroup;
  }

  static create(ctx: RenderContext): GeometryPass {
    const { device } = ctx;

    const cameraBgl = device.createBindGroupLayout({
      label: 'GeomCameraBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const modelBgl = device.createBindGroupLayout({
      label: 'GeomModelBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });

    const cameraBuffer = device.createBuffer({
      label: 'GeomCameraBuffer',
      size: CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const cameraBindGroup = device.createBindGroup({
      label: 'GeomCameraBindGroup', layout: cameraBgl,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });

    return new GeometryPass(ctx, device, cameraBgl, modelBgl, cameraBuffer, cameraBindGroup);
  }

  /** Replace the per-frame draw items. */
  setDrawItems(items: DrawItem[]): void {
    this._drawItems = items;
  }

  /** Upload per-frame camera uniforms. */
  updateCamera(
    ctx: RenderContext,
    view: Mat4, proj: Mat4, viewProj: Mat4, invViewProj: Mat4,
    camPos: { x: number; y: number; z: number },
    near: number, far: number,
  ): void {
    const data = this._cameraScratch;
    data.set(view.data, 0);
    data.set(proj.data, 16);
    data.set(viewProj.data, 32);
    data.set(invViewProj.data, 48);
    data[64] = camPos.x; data[65] = camPos.y; data[66] = camPos.z;
    data[67] = near; data[68] = far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: GeometryDeps = {}): GeometryOutputs {
    const { ctx } = graph;
    const screenDesc = (format: GPUTextureFormat): TextureDesc => ({
      format, width: ctx.width, height: ctx.height,
    });

    let albedo: ResourceHandle = deps.gbuffer ? deps.gbuffer.albedo : (undefined as unknown as ResourceHandle);
    let normal: ResourceHandle = deps.gbuffer ? deps.gbuffer.normal : (undefined as unknown as ResourceHandle);
    let depth: ResourceHandle = deps.gbuffer ? deps.gbuffer.depth : (undefined as unknown as ResourceHandle);

    let outAlbedo!: ResourceHandle;
    let outNormal!: ResourceHandle;
    let outDepth!: ResourceHandle;

    const load = deps.loadOp ?? (deps.gbuffer ? 'load' : 'clear');

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      if (!deps.gbuffer) {
        albedo = b.createTexture({ label: 'gbuffer.albedo', ...screenDesc(GBUF_ALBEDO_FORMAT) });
        normal = b.createTexture({ label: 'gbuffer.normal', ...screenDesc(GBUF_NORMAL_FORMAT) });
        depth = b.createTexture({ label: 'gbuffer.depth', ...screenDesc(GBUF_DEPTH_FORMAT) });
      }
      outAlbedo = b.write(albedo, 'attachment', { loadOp: load, storeOp: 'store', clearValue: [0, 0, 0, 1] });
      outNormal = b.write(normal, 'attachment', { loadOp: load, storeOp: 'store', clearValue: [0, 0, 0, 0] });
      outDepth = b.write(depth, 'depth-attachment', {
        depthLoadOp: load, depthStoreOp: 'store', depthClearValue: 1.0,
      });

      b.setExecute((pctx) => {
        this._ensurePerDrawBuffers(this._drawItems.length);

        for (let i = 0; i < this._drawItems.length; i++) {
          const item = this._drawItems[i];
          const md = this._modelData;
          md.set(item.modelMatrix.data, 0);
          md.set(item.normalMatrix.data, 16);
          this._device.queue.writeBuffer(this._modelBuffers[i], 0, md.buffer as ArrayBuffer);
          item.material.update?.(this._device.queue);
        }

        const enc = pctx.renderPassEncoder!;
        enc.setBindGroup(0, this._cameraBindGroup);

        for (let i = 0; i < this._drawItems.length; i++) {
          const item = this._drawItems[i];
          const variantMask = 'variantMask' in item.material ? (item.material as any).variantMask as number : 0;
          enc.setPipeline(this._getPipeline(item.material, variantMask));
          enc.setBindGroup(1, this._modelBindGroups[i]);
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
      material.getShaderCode(MaterialPassType.Geometry, variantMask),
      `GeometryShader[${key}]`,
      defines,
    );
    pipeline = this._device.createRenderPipeline({
      label: `GeometryPipeline[${key}]`,
      layout: this._device.createPipelineLayout({
        bindGroupLayouts: [this._cameraBgl, this._modelBgl, material.getBindGroupLayout(this._device, variantMask)],
      }),
      vertex: {
        module: shaderModule, entryPoint: 'vs_main',
        buffers: [{ arrayStride: VERTEX_STRIDE, attributes: VERTEX_ATTRIBUTES }],
      },
      fragment: {
        module: shaderModule, entryPoint: 'fs_main',
        targets: [
          { format: GBUF_ALBEDO_FORMAT },
          { format: GBUF_NORMAL_FORMAT },
        ],
      },
      depthStencil: { format: GBUF_DEPTH_FORMAT, depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
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
      this._modelBindGroups.push(this._device.createBindGroup({
        layout: this._modelBgl,
        entries: [{ binding: 0, resource: { buffer: mb } }],
      }));
    }
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    for (const b of this._modelBuffers) b.destroy();
  }
}
