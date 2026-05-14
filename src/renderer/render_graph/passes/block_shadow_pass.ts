// Renders chunk (voxel) opaque/transparent/prop geometry into the shadow map cascades
// (render-graph version). Writes to the persistent shadow map produced by `ShadowPass`
// using `depthLoadOp: 'load'`, one render pass per cascade.
import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import type { Chunk, ChunkMesh } from '../../../block/chunk.js';
import type { CascadeData } from '../../../engine/components/directional_light.js';
import type { BlockTexture } from '../../../assets/block_texture.js';
import { blockTextureOffsetData, BlockType, BLOCK_ATLAS_WIDTH_DIVIDED } from '../../../block/block_type.js';
import shadowWgsl from '../../../shaders/shadow.wgsl?raw';
import chunkShadowWgsl from '../../../shaders/chunk_shadow.wgsl?raw';
import propShadowWgsl from '../../../shaders/prop_shadow.wgsl?raw';

const MAX_CASCADES = 4;
const BYTES_PER_VERT = 5 * 4;

interface ChunkShadowGpu {
  ox: number;
  oz: number;
  opaqueBuffer: GPUBuffer | null;
  opaqueCount: number;
  transparentBuffer: GPUBuffer | null;
  transparentCount: number;
  propBuffer: GPUBuffer | null;
  propCount: number;
  modelBuffer: GPUBuffer;
  modelBG: GPUBindGroup;
}

export interface BlockShadowDeps {
  /** Persistent shadow map handle (from ShadowPass output). */
  shadowMap: ResourceHandle;
  /** Per-cascade light view-projection matrices. */
  cascades: readonly CascadeData[];
  /** Camera world-space position used for chunk distance culling. */
  camPos: { x: number; z: number };
}

export interface BlockShadowOutputs {
  /** Shadow map handle after all block-shadow cascade writes. */
  shadowMap: ResourceHandle;
}

/**
 * Voxel-world chunk shadow pass (render-graph version).
 *
 * Appends opaque, alpha-tested transparent, and cross-billboard prop geometry
 * to the cascades produced by `ShadowPass`. Each cascade is a separate graph
 * node writing the same persistent shadow map at a different array slice with
 * `depthLoadOp: 'load'`.
 */
export class BlockShadowPass extends Pass<BlockShadowDeps, BlockShadowOutputs> {
  readonly name = 'BlockShadowPass';

  /** Square chunk radius around the camera within which shadow geometry is drawn. */
  shadowChunkRadius = 4;

  private readonly _device: GPUDevice;
  private readonly _opaquePipeline: GPURenderPipeline;
  private readonly _transparentPipeline: GPURenderPipeline;
  private readonly _propPipeline: GPURenderPipeline;
  private readonly _cascadeBuffers: GPUBuffer[];
  private readonly _cascadeBindGroups: GPUBindGroup[];
  private readonly _modelBgl: GPUBindGroupLayout;
  private readonly _atlasBg: GPUBindGroup;
  private readonly _orientBg_X: GPUBindGroup;
  private readonly _orientBg_Z: GPUBindGroup;
  private readonly _chunks = new Map<Chunk, ChunkShadowGpu>();

  private constructor(
    device: GPUDevice,
    opaquePipeline: GPURenderPipeline,
    transparentPipeline: GPURenderPipeline,
    propPipeline: GPURenderPipeline,
    cascadeBuffers: GPUBuffer[],
    cascadeBindGroups: GPUBindGroup[],
    modelBgl: GPUBindGroupLayout,
    atlasBg: GPUBindGroup,
    orientBg_X: GPUBindGroup,
    orientBg_Z: GPUBindGroup,
  ) {
    super();
    this._device = device;
    this._opaquePipeline = opaquePipeline;
    this._transparentPipeline = transparentPipeline;
    this._propPipeline = propPipeline;
    this._cascadeBuffers = cascadeBuffers;
    this._cascadeBindGroups = cascadeBindGroups;
    this._modelBgl = modelBgl;
    this._atlasBg = atlasBg;
    this._orientBg_X = orientBg_X;
    this._orientBg_Z = orientBg_Z;
  }

  static create(ctx: RenderContext, blockTexture: BlockTexture): BlockShadowPass {
    const { device } = ctx;

    const cascadeBgl = device.createBindGroupLayout({
      label: 'BlockShadowCascadeBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const modelBgl = device.createBindGroupLayout({
      label: 'BlockShadowModelBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const atlasBgl = device.createBindGroupLayout({
      label: 'BlockShadowAtlasBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
      ],
    });

    const cascadeBuffers: GPUBuffer[] = [];
    const cascadeBindGroups: GPUBindGroup[] = [];
    for (let i = 0; i < MAX_CASCADES; i++) {
      const buf = device.createBuffer({
        label: `BlockShadowCascadeBuf${i}`,
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      cascadeBuffers.push(buf);
      cascadeBindGroups.push(device.createBindGroup({
        label: `BlockShadowCascadeBG${i}`,
        layout: cascadeBgl,
        entries: [{ binding: 0, resource: { buffer: buf } }],
      }));
    }

    const numBlocks = BlockType.MAX as number;
    const blockDataBuf = device.createBuffer({
      label: 'BlockShadowBlockDataBuf',
      size: Math.max(numBlocks * 16, 16),
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const COLS = BLOCK_ATLAS_WIDTH_DIVIDED;
    const blockArr = new Uint32Array(numBlocks * 4);
    for (let bt = 0; bt < numBlocks; bt++) {
      const tod = blockTextureOffsetData[bt];
      if (tod) {
        blockArr[bt * 4 + 0] = tod.sideFace.y * COLS + tod.sideFace.x;
        blockArr[bt * 4 + 1] = tod.bottomFace.y * COLS + tod.bottomFace.x;
        blockArr[bt * 4 + 2] = tod.topFace.y * COLS + tod.topFace.x;
      }
    }
    device.queue.writeBuffer(blockDataBuf, 0, blockArr);

    const atlasSampler = device.createSampler({
      label: 'BlockShadowAtlasSampler', magFilter: 'nearest', minFilter: 'nearest',
    });
    const atlasBg = device.createBindGroup({
      label: 'BlockShadowAtlasBG', layout: atlasBgl,
      entries: [
        { binding: 0, resource: blockTexture.colorAtlas.view },
        { binding: 1, resource: atlasSampler },
        { binding: 2, resource: { buffer: blockDataBuf } },
      ],
    });

    const opaqueShader = ctx.createShaderModule(shadowWgsl, 'BlockShadowShader');
    const opaquePipeline = device.createRenderPipeline({
      label: 'BlockShadowPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [cascadeBgl, modelBgl] }),
      vertex: {
        module: opaqueShader, entryPoint: 'vs_main',
        buffers: [{
          arrayStride: BYTES_PER_VERT,
          attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
        }],
      },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    const transpShader = ctx.createShaderModule(chunkShadowWgsl, 'BlockShadowTranspShader');
    const transparentPipeline = device.createRenderPipeline({
      label: 'BlockShadowTransparentPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [cascadeBgl, modelBgl, atlasBgl] }),
      vertex: {
        module: transpShader, entryPoint: 'vs_main',
        buffers: [{
          arrayStride: BYTES_PER_VERT,
          attributes: [
            { shaderLocation: 0, offset: 0, format: 'float32x3' },
            { shaderLocation: 1, offset: 12, format: 'float32' },
            { shaderLocation: 2, offset: 16, format: 'float32' },
          ],
        }],
      },
      fragment: { module: transpShader, entryPoint: 'fs_alpha_test', targets: [] },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    const orientBgl = device.createBindGroupLayout({
      label: 'BlockShadowOrientBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const makeOrientBg = (label: string, rx: number, ry: number, rz: number): GPUBindGroup => {
      const buf = device.createBuffer({ label, size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      device.queue.writeBuffer(buf, 0, new Float32Array([rx, ry, rz, 0]));
      return device.createBindGroup({ label, layout: orientBgl, entries: [{ binding: 0, resource: { buffer: buf } }] });
    };
    const orientBg_X = makeOrientBg('BlockShadowOrientBG_X', 1, 0, 0);
    const orientBg_Z = makeOrientBg('BlockShadowOrientBG_Z', 0, 0, 1);

    const propShader = ctx.createShaderModule(propShadowWgsl, 'BlockShadowPropShader');
    const propPipeline = device.createRenderPipeline({
      label: 'BlockShadowPropPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [cascadeBgl, modelBgl, atlasBgl, orientBgl] }),
      vertex: {
        module: propShader, entryPoint: 'vs_main',
        buffers: [{
          arrayStride: BYTES_PER_VERT,
          attributes: [
            { shaderLocation: 0, offset: 0, format: 'float32x3' },
            { shaderLocation: 1, offset: 12, format: 'float32' },
            { shaderLocation: 2, offset: 16, format: 'float32' },
          ],
        }],
      },
      fragment: { module: propShader, entryPoint: 'fs_alpha_test', targets: [] },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    return new BlockShadowPass(
      device, opaquePipeline, transparentPipeline, propPipeline,
      cascadeBuffers, cascadeBindGroups, modelBgl, atlasBg, orientBg_X, orientBg_Z,
    );
  }

  /** Register a chunk for shadow rendering, allocating its model + vertex buffers. */
  addChunk(chunk: Chunk, mesh: ChunkMesh): void {
    const existing = this._chunks.get(chunk);
    if (existing) {
      this._replaceMeshBuffer(existing, mesh);
    } else {
      this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
    }
  }

  updateChunk(chunk: Chunk, mesh: ChunkMesh): void {
    this.addChunk(chunk, mesh);
  }

  removeChunk(chunk: Chunk): void {
    const gpu = this._chunks.get(chunk);
    if (!gpu) return;
    gpu.opaqueBuffer?.destroy();
    gpu.transparentBuffer?.destroy();
    gpu.propBuffer?.destroy();
    gpu.modelBuffer.destroy();
    this._chunks.delete(chunk);
  }

  addToGraph(graph: RenderGraph, deps: BlockShadowDeps): BlockShadowOutputs {
    const N = Math.min(deps.cascades.length, this._cascadeBuffers.length);
    let shadowMap = deps.shadowMap;

    for (let c = 0; c < N; c++) {
      const cascadeIdx = c;
      const cascadeShadow = shadowMap;
      let nextShadow!: ResourceHandle;
      graph.addPass(`BlockShadowPass.cascade${cascadeIdx}`, 'render', (b: PassBuilder) => {
        nextShadow = b.write(cascadeShadow, 'depth-attachment', {
          depthLoadOp: 'load',
          depthStoreOp: 'store',
          view: { dimension: '2d', baseArrayLayer: cascadeIdx, arrayLayerCount: 1 },
        });
        b.setExecute((pctx) => {
          // Upload this cascade's view-proj matrix.
          this._device.queue.writeBuffer(
            this._cascadeBuffers[cascadeIdx], 0,
            deps.cascades[cascadeIdx].lightViewProj.data.buffer as ArrayBuffer,
          );

          const enc = pctx.renderPassEncoder!;
          enc.setBindGroup(0, this._cascadeBindGroups[cascadeIdx]);

          const maxDist = this.shadowChunkRadius * 16;
          const maxDist2 = maxDist * maxDist;
          const camX = deps.camPos.x;
          const camZ = deps.camPos.z;

          // Opaque
          enc.setPipeline(this._opaquePipeline);
          for (const gpu of this._chunks.values()) {
            if (!gpu.opaqueBuffer || gpu.opaqueCount === 0) continue;
            const dx = gpu.ox - camX, dz = gpu.oz - camZ;
            if (dx * dx + dz * dz > maxDist2) continue;
            enc.setBindGroup(1, gpu.modelBG);
            enc.setVertexBuffer(0, gpu.opaqueBuffer);
            enc.draw(gpu.opaqueCount);
          }

          // Transparent (alpha-tested)
          enc.setPipeline(this._transparentPipeline);
          enc.setBindGroup(2, this._atlasBg);
          for (const gpu of this._chunks.values()) {
            if (!gpu.transparentBuffer || gpu.transparentCount === 0) continue;
            const dx = gpu.ox - camX, dz = gpu.oz - camZ;
            if (dx * dx + dz * dz > maxDist2) continue;
            enc.setBindGroup(1, gpu.modelBG);
            enc.setVertexBuffer(0, gpu.transparentBuffer);
            enc.draw(gpu.transparentCount);
          }

          // Props (X then Z orientations)
          enc.setPipeline(this._propPipeline);
          enc.setBindGroup(2, this._atlasBg);
          for (const orientBg of [this._orientBg_X, this._orientBg_Z]) {
            enc.setBindGroup(3, orientBg);
            for (const gpu of this._chunks.values()) {
              if (!gpu.propBuffer || gpu.propCount === 0) continue;
              const dx = gpu.ox - camX, dz = gpu.oz - camZ;
              if (dx * dx + dz * dz > maxDist2) continue;
              enc.setBindGroup(1, gpu.modelBG);
              enc.setVertexBuffer(0, gpu.propBuffer);
              enc.draw(gpu.propCount);
            }
          }
        });
      });
      shadowMap = nextShadow;
    }

    return { shadowMap };
  }

  destroy(): void {
    for (const buf of this._cascadeBuffers) buf.destroy();
    for (const gpu of this._chunks.values()) {
      gpu.opaqueBuffer?.destroy();
      gpu.transparentBuffer?.destroy();
      gpu.propBuffer?.destroy();
      gpu.modelBuffer.destroy();
    }
    this._chunks.clear();
  }

  private _createChunkGpu(chunk: Chunk, mesh: ChunkMesh): ChunkShadowGpu {
    const t = chunk.globalPosition;
    const mat = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      t.x, t.y, t.z, 1,
    ]);
    const modelBuffer = this._device.createBuffer({
      label: 'BlockShadowModelBuf', size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this._device.queue.writeBuffer(modelBuffer, 0, mat.buffer);
    const modelBG = this._device.createBindGroup({
      label: 'BlockShadowModelBG', layout: this._modelBgl,
      entries: [{ binding: 0, resource: { buffer: modelBuffer } }],
    });

    const gpu: ChunkShadowGpu = {
      ox: t.x, oz: t.z,
      opaqueBuffer: null, opaqueCount: 0,
      transparentBuffer: null, transparentCount: 0,
      propBuffer: null, propCount: 0,
      modelBuffer, modelBG,
    };
    this._replaceMeshBuffer(gpu, mesh);
    return gpu;
  }

  private _replaceMeshBuffer(gpu: ChunkShadowGpu, mesh: ChunkMesh): void {
    gpu.opaqueBuffer?.destroy();
    gpu.opaqueBuffer = null;
    gpu.opaqueCount = mesh.opaqueCount;
    if (mesh.opaqueCount > 0) {
      const buf = this._device.createBuffer({
        label: 'BlockShadowOpaqueBuf',
        size: mesh.opaqueCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.opaque.buffer, 0, mesh.opaqueCount * BYTES_PER_VERT);
      gpu.opaqueBuffer = buf;
    }

    gpu.transparentBuffer?.destroy();
    gpu.transparentBuffer = null;
    gpu.transparentCount = mesh.transparentCount;
    if (mesh.transparentCount > 0) {
      const buf = this._device.createBuffer({
        label: 'BlockShadowTransparentBuf',
        size: mesh.transparentCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.transparent.buffer, 0, mesh.transparentCount * BYTES_PER_VERT);
      gpu.transparentBuffer = buf;
    }

    gpu.propBuffer?.destroy();
    gpu.propBuffer = null;
    gpu.propCount = mesh.propCount;
    if (mesh.propCount > 0) {
      const buf = this._device.createBuffer({
        label: 'BlockShadowPropBuf',
        size: mesh.propCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.prop.buffer, 0, mesh.propCount * BYTES_PER_VERT);
      gpu.propBuffer = buf;
    }
  }
}
