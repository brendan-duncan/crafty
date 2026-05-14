import type { RenderContext } from '../../src/renderer/render_context.js';
import { Pass } from '../../src/renderer/render_graph/pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../../src/renderer/render_graph/index.js';
import { VERTEX_STRIDE, type Mesh } from '../../src/assets/mesh.js';

const GBUF_ALBEDO_FORMAT: GPUTextureFormat = 'rgba8unorm';
const GBUF_NORMAL_FORMAT: GPUTextureFormat = 'rgba16float';
const GBUF_DEPTH_FORMAT: GPUTextureFormat = 'depth32float';

const CAMERA_UNIFORM_SIZE = 64;   // mat4 viewProj
const MODEL_UNIFORM_SIZE = 80;    // mat4 model + vec4 baseColor

const slicGeoWgsl = /* wgsl */ `
struct Camera { viewProj: mat4x4<f32> }
struct Model  {
  model:     mat4x4<f32>,
  baseColor: vec4f,
}

@group(0) @binding(0) var<uniform> camera: Camera;
@group(1) @binding(0) var<uniform> model:  Model;

struct VOut {
  @builtin(position) pos: vec4f,
  @location(0) worldNormal: vec3f,
}

@vertex
fn vs_main(@location(0) p: vec3f, @location(1) n: vec3f) -> VOut {
  let worldPos = (model.model * vec4f(p, 1.0)).xyz;
  // Pure rotation/uniform-scale assumed for the slice demo.
  let worldNormal = normalize((model.model * vec4f(n, 0.0)).xyz);
  var out: VOut;
  out.pos = camera.viewProj * vec4f(worldPos, 1.0);
  out.worldNormal = worldNormal;
  return out;
}

struct FOut {
  @location(0) albedo: vec4f,
  @location(1) normal: vec4f,
}

@fragment
fn fs_main(in: VOut) -> FOut {
  var o: FOut;
  o.albedo = vec4f(model.baseColor.rgb, 1.0);
  o.normal = vec4f(normalize(in.worldNormal) * 0.5 + 0.5, 1.0);
  return o;
}
`;

/** One mesh instance to render this frame. */
export interface SliceDrawItem {
  mesh: Mesh;
  /** column-major mat4 (16 floats) */
  modelMatrix: Float32Array;
  /** Linear RGB base color. */
  color: { r: number; g: number; b: number };
}

export interface SliceGeometryDeps {
  /** column-major mat4 (16 floats) */
  viewProj: Float32Array;
  drawItems: readonly SliceDrawItem[];
}

export interface SliceGeometryOutputs {
  albedo: ResourceHandle;
  normal: ResourceHandle;
  depth: ResourceHandle;
}

/**
 * Slice demo: minimal deferred geometry pass. Rasterises a list of
 * {@link SliceDrawItem}s into a 2-attachment G-buffer (albedo + world normal)
 * with a `depth32float` depth attachment.
 *
 * Vertex layout (24 bytes/vertex, three `vec3f` attributes):
 *   `position: vec3f, normal: vec3f, color: vec3f`.
 */
export class SliceGeometryPass extends Pass<SliceGeometryDeps, SliceGeometryOutputs> {
  readonly name = 'SliceGeometryPass';

  private readonly _device: GPUDevice;
  private readonly _pipeline: GPURenderPipeline;
  private readonly _modelBgl: GPUBindGroupLayout;
  private readonly _cameraBuffer: GPUBuffer;
  private readonly _cameraBindGroup: GPUBindGroup;
  /** One model uniform buffer + bind group per draw slot, grown on demand. */
  private readonly _modelBuffers: GPUBuffer[] = [];
  private readonly _modelBindGroups: GPUBindGroup[] = [];
  private readonly _modelScratch = new Float32Array(MODEL_UNIFORM_SIZE / 4);

  private constructor(
    device: GPUDevice,
    pipeline: GPURenderPipeline,
    modelBgl: GPUBindGroupLayout,
    cameraBuffer: GPUBuffer,
    cameraBindGroup: GPUBindGroup,
  ) {
    super();
    this._device = device;
    this._pipeline = pipeline;
    this._modelBgl = modelBgl;
    this._cameraBuffer = cameraBuffer;
    this._cameraBindGroup = cameraBindGroup;
  }

  static create(ctx: RenderContext): SliceGeometryPass {
    const { device } = ctx;

    const cameraBgl = device.createBindGroupLayout({
      label: 'SliceGeo.cameraBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const modelBgl = device.createBindGroupLayout({
      label: 'SliceGeo.modelBGL',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: 'uniform' },
      }],
    });

    const cameraBuffer = device.createBuffer({
      label: 'SliceGeo.camera',
      size: CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const cameraBindGroup = device.createBindGroup({
      label: 'SliceGeo.cameraBG',
      layout: cameraBgl,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });

    const shader = device.createShaderModule({ label: 'SliceGeo.shader', code: slicGeoWgsl });
    const pipeline = device.createRenderPipeline({
      label: 'SliceGeo.pipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [cameraBgl, modelBgl] }),
      vertex: {
        module: shader,
        entryPoint: 'vs_main',
        buffers: [{
          // Stride matches the engine Mesh layout (48 bytes); slice shader
          // only consumes position + normal — uv (offset 24) and tangent
          // (offset 32) are skipped. WebGPU rejects declared attributes
          // that have no matching shader input, so don't list them here.
          arrayStride: VERTEX_STRIDE,
          attributes: [
            { shaderLocation: 0, offset: 0,  format: 'float32x3' },
            { shaderLocation: 1, offset: 12, format: 'float32x3' },
          ],
        }],
      },
      fragment: {
        module: shader,
        entryPoint: 'fs_main',
        targets: [
          { format: GBUF_ALBEDO_FORMAT },
          { format: GBUF_NORMAL_FORMAT },
        ],
      },
      depthStencil: {
        format: GBUF_DEPTH_FORMAT,
        depthWriteEnabled: true,
        depthCompare: 'less',
      },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
    });

    return new SliceGeometryPass(device, pipeline, modelBgl, cameraBuffer, cameraBindGroup);
  }

  addToGraph(graph: RenderGraph, deps: SliceGeometryDeps): SliceGeometryOutputs {
    const { ctx } = graph;
    const screen = { width: ctx.width, height: ctx.height };

    let albedo!: ResourceHandle;
    let normal!: ResourceHandle;
    let depth!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      albedo = b.createTexture({ label: 'slice.albedo', format: GBUF_ALBEDO_FORMAT, ...screen });
      normal = b.createTexture({ label: 'slice.normal', format: GBUF_NORMAL_FORMAT, ...screen });
      depth = b.createTexture({ label: 'slice.depth', format: GBUF_DEPTH_FORMAT, ...screen });
      albedo = b.write(albedo, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
      normal = b.write(normal, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0.5, 0.5, 1, 1] });
      depth = b.write(depth, 'depth-attachment', {
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
        depthClearValue: 1.0,
      });

      b.setExecute((pctx) => {
        const enc = pctx.renderPassEncoder!;
        // Upload camera viewProj once per frame.
        ctx.queue.writeBuffer(this._cameraBuffer, 0, deps.viewProj.buffer as ArrayBuffer, deps.viewProj.byteOffset, CAMERA_UNIFORM_SIZE);
        this._growModelSlots(deps.drawItems.length);

        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._cameraBindGroup);

        for (let i = 0; i < deps.drawItems.length; i++) {
          const item = deps.drawItems[i];
          const s = this._modelScratch;
          s.set(item.modelMatrix, 0);
          s[16] = item.color.r; s[17] = item.color.g; s[18] = item.color.b; s[19] = 1;
          ctx.queue.writeBuffer(this._modelBuffers[i], 0, s.buffer as ArrayBuffer);
          enc.setBindGroup(1, this._modelBindGroups[i]);
          enc.setVertexBuffer(0, item.mesh.vertexBuffer);
          enc.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
          enc.drawIndexed(item.mesh.indexCount);
        }
      });
    });

    return { albedo, normal, depth };
  }

  /** Lazily allocate one (model uniform buffer + bind group) per draw slot. */
  private _growModelSlots(count: number): void {
    while (this._modelBuffers.length < count) {
      const buf = this._device.createBuffer({
        label: `SliceGeo.model[${this._modelBuffers.length}]`,
        size: MODEL_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      const bg = this._device.createBindGroup({
        label: `SliceGeo.modelBG[${this._modelBindGroups.length}]`,
        layout: this._modelBgl,
        entries: [{ binding: 0, resource: { buffer: buf } }],
      });
      this._modelBuffers.push(buf);
      this._modelBindGroups.push(bg);
    }
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    for (const b of this._modelBuffers) b.destroy();
    this._modelBuffers.length = 0;
    this._modelBindGroups.length = 0;
  }
}
