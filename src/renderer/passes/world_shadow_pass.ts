// Renders chunk (voxel) opaque geometry into the shadow map cascades.
// Runs after ShadowPass (uses depthLoadOp:'load') and writes to the same shadow map array views.
// Vertex format matches WorldGeometryPass: [x,y,z,face,blockType] (stride=20), reading only xyz.
import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { Chunk, ChunkMesh } from '../../block/chunk.js';
import type { CascadeData } from '../../engine/components/directional_light.js';
import shadowWgsl from '../../shaders/shadow.wgsl?raw';

const MAX_CASCADES    = 4;
const BYTES_PER_VERT  = 5 * 4;  // [x,y,z,face,blockType] — shadow shader only reads xyz

interface ChunkShadowGpu {
  opaqueBuffer : GPUBuffer | null;
  opaqueCount  : number;
  modelBuffer  : GPUBuffer;  // 64-byte translation matrix (world offset)
  modelBG      : GPUBindGroup;
}

export class WorldShadowPass extends RenderPass {
  readonly name = 'WorldShadowPass';

  private _device             : GPUDevice;
  private _shadowMapArrayViews: GPUTextureView[];
  private _pipeline           : GPURenderPipeline;
  private _cascadeBGs         : GPUBindGroup[];
  private _cascadeBuffers     : GPUBuffer[];
  private _modelBGL           : GPUBindGroupLayout;
  private _chunks             = new Map<Chunk, ChunkShadowGpu>();
  private _cascades           : CascadeData[] = [];

  private constructor(
    device             : GPUDevice,
    shadowMapArrayViews: GPUTextureView[],
    pipeline           : GPURenderPipeline,
    cascadeBGs         : GPUBindGroup[],
    cascadeBuffers     : GPUBuffer[],
    modelBGL           : GPUBindGroupLayout,
  ) {
    super();
    this._device              = device;
    this._shadowMapArrayViews = shadowMapArrayViews;
    this._pipeline            = pipeline;
    this._cascadeBGs          = cascadeBGs;
    this._cascadeBuffers      = cascadeBuffers;
    this._modelBGL            = modelBGL;
  }

  static create(ctx: RenderContext, shadowMapArrayViews: GPUTextureView[], cascadeCount: number): WorldShadowPass {
    const { device } = ctx;

    const cascadeBGL = device.createBindGroupLayout({
      label: 'WorldShadowCascadeBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const modelBGL = device.createBindGroupLayout({
      label: 'WorldShadowModelBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });

    const cascadeBuffers: GPUBuffer[] = [];
    const cascadeBGs: GPUBindGroup[] = [];
    for (let i = 0; i < Math.min(cascadeCount, MAX_CASCADES); i++) {
      const buf = device.createBuffer({ label: `WorldShadowCascadeBuf${i}`, size: 64, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      cascadeBuffers.push(buf);
      cascadeBGs.push(device.createBindGroup({ label: `WorldShadowCascadeBG${i}`, layout: cascadeBGL, entries: [{ binding: 0, resource: { buffer: buf } }] }));
    }

    const shader = device.createShaderModule({ label: 'WorldShadowShader', code: shadowWgsl });
    const layout = device.createPipelineLayout({ bindGroupLayouts: [cascadeBGL, modelBGL] });

    // Read only xyz (3×f32) from the 5-float chunk vertex; skip face+blockType via stride.
    const pipeline = device.createRenderPipeline({
      label   : 'WorldShadowPipeline',
      layout,
      vertex  : {
        module: shader, entryPoint: 'vs_main',
        buffers: [{
          arrayStride: BYTES_PER_VERT,
          attributes : [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
        }],
      },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive   : { topology: 'triangle-list', cullMode: 'back' },
    });

    return new WorldShadowPass(device, shadowMapArrayViews, pipeline, cascadeBGs, cascadeBuffers, modelBGL);
  }

  // Feed cascade data from main.ts (same array returned by sun.computeCascadeMatrices).
  update(ctx: RenderContext, cascades: CascadeData[]): void {
    this._cascades = cascades;
    const n = Math.min(cascades.length, this._cascadeBuffers.length);
    for (let i = 0; i < n; i++) {
      ctx.queue.writeBuffer(this._cascadeBuffers[i], 0, cascades[i].lightViewProj.data.buffer as ArrayBuffer);
    }
  }

  addChunk(chunk: Chunk, mesh: ChunkMesh): void {
    const existing = this._chunks.get(chunk);
    if (existing) {
      this._replaceMeshBuffer(existing, mesh);
    } else {
      this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
    }
  }

  updateChunk(chunk: Chunk, mesh: ChunkMesh): void {
    const existing = this._chunks.get(chunk);
    if (existing) {
      this._replaceMeshBuffer(existing, mesh);
    } else {
      this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
    }
  }

  removeChunk(chunk: Chunk): void {
    const gpu = this._chunks.get(chunk);
    if (!gpu) return;
    gpu.opaqueBuffer?.destroy();
    gpu.modelBuffer.destroy();
    this._chunks.delete(chunk);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    const cascadeCount = Math.min(this._cascades.length, this._cascadeBuffers.length);
    for (let c = 0; c < cascadeCount; c++) {
      const pass = encoder.beginRenderPass({
        label: `WorldShadowPass cascade ${c}`,
        colorAttachments: [],
        depthStencilAttachment: {
          view: this._shadowMapArrayViews[c],
          depthLoadOp : 'load',
          depthStoreOp: 'store',
        },
      });
      pass.setPipeline(this._pipeline);
      pass.setBindGroup(0, this._cascadeBGs[c]);

      for (const gpu of this._chunks.values()) {
        if (!gpu.opaqueBuffer || gpu.opaqueCount === 0) continue;
        pass.setBindGroup(1, gpu.modelBG);
        pass.setVertexBuffer(0, gpu.opaqueBuffer);
        pass.draw(gpu.opaqueCount);
      }

      pass.end();
    }
  }

  destroy(): void {
    for (const buf of this._cascadeBuffers) buf.destroy();
    for (const gpu of this._chunks.values()) {
      gpu.opaqueBuffer?.destroy();
      gpu.modelBuffer.destroy();
    }
    this._chunks.clear();
  }

  private _createChunkGpu(chunk: Chunk, mesh: ChunkMesh): ChunkShadowGpu {
    // Translation matrix: column-major identity + translation (cx, cy, cz).
    const t = chunk.globalPosition;
    const mat = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      t.x, t.y, t.z, 1,
    ]);
    const modelBuffer = this._device.createBuffer({ label: 'WorldShadowModelBuf', size: 64, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    this._device.queue.writeBuffer(modelBuffer, 0, mat.buffer);
    const modelBG = this._device.createBindGroup({ label: 'WorldShadowModelBG', layout: this._modelBGL, entries: [{ binding: 0, resource: { buffer: modelBuffer } }] });

    const gpu: ChunkShadowGpu = { opaqueBuffer: null, opaqueCount: 0, modelBuffer, modelBG };
    this._replaceMeshBuffer(gpu, mesh);
    return gpu;
  }

  private _replaceMeshBuffer(gpu: ChunkShadowGpu, mesh: ChunkMesh): void {
    gpu.opaqueBuffer?.destroy();
    gpu.opaqueBuffer = null;
    gpu.opaqueCount  = mesh.opaqueCount;
    if (mesh.opaqueCount > 0) {
      const buf = this._device.createBuffer({
        label: 'WorldShadowOpaqueBuf',
        size : mesh.opaqueCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.opaque.buffer, 0, mesh.opaqueCount * BYTES_PER_VERT);
      gpu.opaqueBuffer = buf;
    }
  }
}
