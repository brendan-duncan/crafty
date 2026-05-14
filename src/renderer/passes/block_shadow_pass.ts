// Renders chunk (voxel) opaque geometry into the shadow map cascades.
// Runs after ShadowPass (uses depthLoadOp:'load') and writes to the same shadow map array views.
// Vertex format matches BlockGeometryPass: [x,y,z,face,blockType] (stride=20), reading only xyz.
import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { Chunk, ChunkMesh } from '../../block/chunk.js';
import type { CascadeData } from '../../engine/components/directional_light.js';
import type { BlockTexture } from '../../assets/block_texture.js';
import { blockTextureOffsetData, BlockType, BLOCK_ATLAS_WIDTH_DIVIDED } from '../../block/block_type.js';
import shadowWgsl      from '../../shaders/shadow.wgsl?raw';
import chunkShadowWgsl from '../../shaders/chunk_shadow.wgsl?raw';
import propShadowWgsl  from '../../shaders/prop_shadow.wgsl?raw';

const MAX_CASCADES = 4;
const BYTES_PER_VERT = 5 * 4;  // [x,y,z,face,blockType] — shadow shader only reads xyz

interface ChunkShadowGpu {
  ox: number;   // chunk world-space X origin (for distance culling)
  oz: number;   // chunk world-space Z origin
  opaqueBuffer: GPUBuffer | null;
  opaqueCount: number;
  transparentBuffer: GPUBuffer | null;
  transparentCount: number;
  propBuffer: GPUBuffer | null;
  propCount: number;
  modelBuffer: GPUBuffer;  // 64-byte translation matrix (world offset)
  modelBG: GPUBindGroup;
}

/**
 * Renders voxel-world chunk geometry (opaque blocks, alpha-tested transparent
 * blocks, and cross-billboard props) into each cascade of the directional-light
 * shadow map array.
 *
 * Runs after the main ShadowPass with depthLoadOp:'load', appending world
 * occluders to the same depth32float cascade views. Uses three pipelines: a
 * depth-only pipeline for opaque chunks, an alpha-test pipeline that samples
 * the block atlas for transparent foliage, and a billboard-expansion pipeline
 * that draws each prop twice (X- and Z-axis quads) to form a cross-shaped
 * shadow. Chunks are culled against a square radius around the camera.
 */
export class BlockShadowPass extends RenderPass {
  readonly name = 'BlockShadowPass';

  /** Square chunk radius around the camera within which shadow geometry is drawn. Independent of render distance. */
  shadowChunkRadius = 4;   // chunks; independent of render distance

  private _camX = 0;
  private _camZ = 0;
  private _device: GPUDevice;
  private _shadowMapArrayViews: GPUTextureView[];
  private _pipeline: GPURenderPipeline;
  private _transparentPipeline: GPURenderPipeline;
  private _propPipeline: GPURenderPipeline;
  private _cascadeBGs: GPUBindGroup[];
  private _cascadeBuffers: GPUBuffer[];
  private _modelBGL: GPUBindGroupLayout;
  private _atlasBG: GPUBindGroup;
  private _orientBG_X: GPUBindGroup;  // right=(1,0,0) for XY-plane quads
  private _orientBG_Z: GPUBindGroup;  // right=(0,0,1) for ZY-plane quads
  private _chunks = new Map<Chunk, ChunkShadowGpu>();
  private _cascades: CascadeData[] = [];

  private constructor(
    device: GPUDevice,
    shadowMapArrayViews: GPUTextureView[],
    pipeline: GPURenderPipeline,
    transparentPipeline: GPURenderPipeline,
    propPipeline: GPURenderPipeline,
    cascadeBGs: GPUBindGroup[],
    cascadeBuffers: GPUBuffer[],
    modelBGL: GPUBindGroupLayout,
    atlasBG: GPUBindGroup,
    orientBG_X: GPUBindGroup,
    orientBG_Z: GPUBindGroup,
  ) {
    super();
    this._device = device;
    this._shadowMapArrayViews = shadowMapArrayViews;
    this._pipeline = pipeline;
    this._transparentPipeline = transparentPipeline;
    this._propPipeline = propPipeline;
    this._cascadeBGs = cascadeBGs;
    this._cascadeBuffers = cascadeBuffers;
    this._modelBGL = modelBGL;
    this._atlasBG = atlasBG;
    this._orientBG_X = orientBG_X;
    this._orientBG_Z = orientBG_Z;
  }

  /**
   * Build the pass and create the three pipelines (opaque, transparent alpha-test,
   * prop billboard), per-cascade uniform buffers, atlas/sampler bind group, and
   * the two orientation bind groups used to expand prop quads.
   *
   * @param ctx Render context providing the GPU device.
   * @param shadowMapArrayViews One depth32float view per cascade slice; written with depthLoadOp:'load'.
   * @param cascadeCount Number of cascades to allocate uniforms for; clamped to MAX_CASCADES.
   * @param blockTexture Block atlas (color) and per-block tile offset metadata used for alpha discard.
   * @returns A ready-to-use BlockShadowPass instance.
   */
  static create(ctx: RenderContext, shadowMapArrayViews: GPUTextureView[], cascadeCount: number, blockTexture: BlockTexture): BlockShadowPass {
    const { device } = ctx;

    const cascadeBGL = device.createBindGroupLayout({
      label: 'BlockShadowCascadeBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const modelBGL = device.createBindGroupLayout({
      label: 'BlockShadowModelBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const atlasBGL = device.createBindGroupLayout({
      label: 'BlockShadowAtlasBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
      ],
    });

    const cascadeBuffers: GPUBuffer[] = [];
    const cascadeBGs: GPUBindGroup[] = [];
    for (let i = 0; i < Math.min(cascadeCount, MAX_CASCADES); i++) {
      const buf = device.createBuffer({ label: `BlockShadowCascadeBuf${i}`, size: 64, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      cascadeBuffers.push(buf);
      cascadeBGs.push(device.createBindGroup({ label: `BlockShadowCascadeBG${i}`, layout: cascadeBGL, entries: [{ binding: 0, resource: { buffer: buf } }] }));
    }

    // Block data buffer: sideTile, bottomTile, topTile, pad per block type
    const numBlocks = BlockType.MAX as number;
    const blockDataBuf = device.createBuffer({
      label: 'BlockShadowBlockDataBuf',
      size : Math.max(numBlocks * 16, 16),
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const COLS = BLOCK_ATLAS_WIDTH_DIVIDED;
    const blockArr = new Uint32Array(numBlocks * 4);
    for (let bt = 0; bt < numBlocks; bt++) {
      const tod = blockTextureOffsetData[bt];
      if (tod) {
        blockArr[bt * 4 + 0] = tod.sideFace.y   * COLS + tod.sideFace.x;
        blockArr[bt * 4 + 1] = tod.bottomFace.y * COLS + tod.bottomFace.x;
        blockArr[bt * 4 + 2] = tod.topFace.y    * COLS + tod.topFace.x;
      }
    }
    device.queue.writeBuffer(blockDataBuf, 0, blockArr);

    const atlasSampler = device.createSampler({
      label: 'BlockShadowAtlasSampler',
      magFilter: 'nearest', minFilter: 'nearest',
    });
    const atlasBG = device.createBindGroup({
      label: 'BlockShadowAtlasBG', layout: atlasBGL,
      entries: [
        { binding: 0, resource: blockTexture.colorAtlas.view },
        { binding: 1, resource: atlasSampler },
        { binding: 2, resource: { buffer: blockDataBuf } },
      ],
    });

    // Opaque pipeline: depth-only, no fragment shader, reads only xyz.
    const opaqueShader = device.createShaderModule({ label: 'BlockShadowShader', code: shadowWgsl });
    const opaqueLayout = device.createPipelineLayout({ bindGroupLayouts: [cascadeBGL, modelBGL] });
    const pipeline = device.createRenderPipeline({
      label   : 'BlockShadowPipeline',
      layout  : opaqueLayout,
      vertex  : {
        module: opaqueShader, entryPoint: 'vs_main',
        buffers: [{
          arrayStride: BYTES_PER_VERT,
          attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
        }],
      },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    // Transparent pipeline: reads xyz + face + blockType, discards low-alpha texels.
    const transpShader = device.createShaderModule({ label: 'BlockShadowTranspShader', code: chunkShadowWgsl });
    const transpLayout = device.createPipelineLayout({ bindGroupLayouts: [cascadeBGL, modelBGL, atlasBGL] });
    const transparentPipeline = device.createRenderPipeline({
      label: 'BlockShadowTransparentPipeline',
      layout: transpLayout,
      vertex: {
        module: transpShader, entryPoint: 'vs_main',
        buffers: [{
          arrayStride: BYTES_PER_VERT,
          attributes: [
            { shaderLocation: 0, offset:  0, format: 'float32x3' },
            { shaderLocation: 1, offset: 12, format: 'float32'   },
            { shaderLocation: 2, offset: 16, format: 'float32'   },
          ],
        }],
      },
      fragment: { module: transpShader, entryPoint: 'fs_alpha_test', targets: [] },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    // Prop pipeline: expands billboard centres into quads; drawn twice per cascade
    // (X-axis and Z-axis) to form a cross-shaped shadow.
    const orientBGL = device.createBindGroupLayout({
      label: 'BlockShadowOrientBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const makeOrientBG = (label: string, rx: number, ry: number, rz: number): GPUBindGroup => {
      const buf = device.createBuffer({ label, size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      device.queue.writeBuffer(buf, 0, new Float32Array([rx, ry, rz, 0]));
      return device.createBindGroup({ label, layout: orientBGL, entries: [{ binding: 0, resource: { buffer: buf } }] });
    };
    const orientBG_X = makeOrientBG('BlockShadowOrientBG_X', 1, 0, 0);
    const orientBG_Z = makeOrientBG('BlockShadowOrientBG_Z', 0, 0, 1);

    const propShader = device.createShaderModule({ label: 'BlockShadowPropShader', code: propShadowWgsl });
    const propLayout = device.createPipelineLayout({ bindGroupLayouts: [cascadeBGL, modelBGL, atlasBGL, orientBGL] });
    const propPipeline = device.createRenderPipeline({
      label: 'BlockShadowPropPipeline',
      layout: propLayout,
      vertex: {
        module: propShader, entryPoint: 'vs_main',
        buffers: [{
          arrayStride: BYTES_PER_VERT,
          attributes : [
            { shaderLocation: 0, offset:  0, format: 'float32x3' },
            { shaderLocation: 1, offset: 12, format: 'float32'   },
            { shaderLocation: 2, offset: 16, format: 'float32'   },
          ],
        }],
      },
      fragment: { module: propShader, entryPoint: 'fs_alpha_test', targets: [] },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    return new BlockShadowPass(device, shadowMapArrayViews, pipeline, transparentPipeline, propPipeline, cascadeBGs, cascadeBuffers, modelBGL, atlasBG, orientBG_X, orientBG_Z);
  }

  /**
   * Upload per-cascade light view-projection matrices and cache the camera's
   * horizontal position for chunk distance culling on the next execute.
   *
   * @param ctx Render context providing the GPU queue.
   * @param cascades Per-cascade data containing light view-projection matrices.
   * @param camX Camera world X used for radius culling.
   * @param camZ Camera world Z used for radius culling.
   */
  update(ctx: RenderContext, cascades: CascadeData[], camX: number, camZ: number): void {
    this._cascades = cascades;
    this._camX = camX;
    this._camZ = camZ;
    const n = Math.min(cascades.length, this._cascadeBuffers.length);
    for (let i = 0; i < n; i++) {
      ctx.queue.writeBuffer(this._cascadeBuffers[i], 0, cascades[i].lightViewProj.data.buffer as ArrayBuffer);
    }
  }

  /**
   * Register a chunk for shadow rendering, allocating its model uniform and
   * vertex buffers (opaque, transparent, prop). If the chunk is already
   * registered the buffers are replaced in place.
   *
   * @param chunk Chunk to register.
   * @param mesh Mesh data containing opaque, transparent, and prop vertex streams.
   */
  addChunk(chunk: Chunk, mesh: ChunkMesh): void {
    const existing = this._chunks.get(chunk);
    if (existing) {
      this._replaceMeshBuffer(existing, mesh);
    } else {
      this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
    }
  }

  /**
   * Replace the GPU vertex buffers for an already-registered chunk, or register
   * it if it has not been seen before.
   *
   * @param chunk Chunk whose mesh has changed.
   * @param mesh Updated mesh data.
   */
  updateChunk(chunk: Chunk, mesh: ChunkMesh): void {
    const existing = this._chunks.get(chunk);
    if (existing) {
      this._replaceMeshBuffer(existing, mesh);
    } else {
      this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
    }
  }

  /**
   * Drop a chunk and free its GPU buffers. No-op if the chunk has not been registered.
   *
   * @param chunk Chunk to remove.
   */
  removeChunk(chunk: Chunk): void {
    const gpu = this._chunks.get(chunk);
    if (!gpu) {
      return;
    }
    gpu.opaqueBuffer?.destroy();
    gpu.transparentBuffer?.destroy();
    gpu.propBuffer?.destroy();
    gpu.modelBuffer.destroy();
    this._chunks.delete(chunk);
  }

  /**
   * For each cascade, append world chunk geometry to its shadow map: opaque
   * blocks first (depth-only), then alpha-tested transparent blocks, then props
   * drawn twice (X and Z orientations) to form a cross-shaped shadow. Chunks
   * outside shadowChunkRadius from the camera are skipped.
   *
   * @param encoder Command encoder to record into.
   * @param _ctx Render context (unused; resources are owned by the pass).
   */
  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    const cascadeCount = Math.min(this._cascades.length, this._cascadeBuffers.length);
    for (let c = 0; c < cascadeCount; c++) {
      const pass = encoder.beginRenderPass({
        label: `BlockShadowPass cascade ${c}`,
        colorAttachments: [],
        depthStencilAttachment: {
          view: this._shadowMapArrayViews[c],
          depthLoadOp: 'load',
          depthStoreOp: 'store',
        },
      });
      pass.setBindGroup(0, this._cascadeBGs[c]);

      const maxDist = this.shadowChunkRadius * 16; // CHUNK_WIDTH
      const maxDist2 = maxDist * maxDist;

      // Opaque geometry: depth-only pipeline, no fragment shader.
      pass.setPipeline(this._pipeline);
      for (const gpu of this._chunks.values()) {
        if (!gpu.opaqueBuffer || gpu.opaqueCount === 0) {
          continue;
        }
        const dx = gpu.ox - this._camX, dz = gpu.oz - this._camZ;
        if (dx * dx + dz * dz > maxDist2) {
          continue;
        }
        pass.setBindGroup(1, gpu.modelBG);
        pass.setVertexBuffer(0, gpu.opaqueBuffer);
        pass.draw(gpu.opaqueCount);
      }

      // Transparent geometry: alpha-test pipeline, samples atlas to discard.
      pass.setPipeline(this._transparentPipeline);
      pass.setBindGroup(2, this._atlasBG);
      for (const gpu of this._chunks.values()) {
        if (!gpu.transparentBuffer || gpu.transparentCount === 0) {
          continue;
        }
        const dx = gpu.ox - this._camX, dz = gpu.oz - this._camZ;
        if (dx * dx + dz * dz > maxDist2) {
          continue;
        }
        pass.setBindGroup(1, gpu.modelBG);
        pass.setVertexBuffer(0, gpu.transparentBuffer);
        pass.draw(gpu.transparentCount);
      }

      // Prop geometry: drawn twice (X and Z orientations) to form a cross shadow.
      pass.setPipeline(this._propPipeline);
      pass.setBindGroup(2, this._atlasBG);
      for (const orientBG of [this._orientBG_X, this._orientBG_Z]) {
        pass.setBindGroup(3, orientBG);
        for (const gpu of this._chunks.values()) {
          if (!gpu.propBuffer || gpu.propCount === 0) {
            continue;
          }
          const dx = gpu.ox - this._camX, dz = gpu.oz - this._camZ;
          if (dx * dx + dz * dz > maxDist2) {
            continue;
          }
          pass.setBindGroup(1, gpu.modelBG);
          pass.setVertexBuffer(0, gpu.propBuffer);
          pass.draw(gpu.propCount);
        }
      }

      pass.end();
    }
  }

  /**
   * Release all GPU resources owned by the pass: cascade uniform buffers and
   * every per-chunk model/vertex buffer. Clears the chunk registry.
   */
  destroy(): void {
    for (const buf of this._cascadeBuffers) {
      buf.destroy();
    }
    for (const gpu of this._chunks.values()) {
      gpu.opaqueBuffer?.destroy();
      gpu.transparentBuffer?.destroy();
      gpu.propBuffer?.destroy();
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
    const modelBuffer = this._device.createBuffer({ label: 'BlockShadowModelBuf', size: 64, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    this._device.queue.writeBuffer(modelBuffer, 0, mat.buffer);
    const modelBG = this._device.createBindGroup({ label: 'BlockShadowModelBG', layout: this._modelBGL, entries: [{ binding: 0, resource: { buffer: modelBuffer } }] });

    const gpu: ChunkShadowGpu = { ox: t.x, oz: t.z, opaqueBuffer: null, opaqueCount: 0, transparentBuffer: null, transparentCount: 0, propBuffer: null, propCount: 0, modelBuffer, modelBG };
    this._replaceMeshBuffer(gpu, mesh);
    return gpu;
  }

  private _replaceMeshBuffer(gpu: ChunkShadowGpu, mesh: ChunkMesh): void {
    gpu.opaqueBuffer?.destroy();
    gpu.opaqueBuffer = null;
    gpu.opaqueCount  = mesh.opaqueCount;
    if (mesh.opaqueCount > 0) {
      const buf = this._device.createBuffer({
        label: 'BlockShadowOpaqueBuf',
        size : mesh.opaqueCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.opaque.buffer, 0, mesh.opaqueCount * BYTES_PER_VERT);
      gpu.opaqueBuffer = buf;
    }

    gpu.transparentBuffer?.destroy();
    gpu.transparentBuffer = null;
    gpu.transparentCount  = mesh.transparentCount;
    if (mesh.transparentCount > 0) {
      const buf = this._device.createBuffer({
        label: 'BlockShadowTransparentBuf',
        size : mesh.transparentCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.transparent.buffer, 0, mesh.transparentCount * BYTES_PER_VERT);
      gpu.transparentBuffer = buf;
    }

    gpu.propBuffer?.destroy();
    gpu.propBuffer = null;
    gpu.propCount  = mesh.propCount;
    if (mesh.propCount > 0) {
      const buf = this._device.createBuffer({
        label: 'BlockShadowPropBuf',
        size : mesh.propCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.prop.buffer, 0, mesh.propCount * BYTES_PER_VERT);
      gpu.propBuffer = buf;
    }
  }
}
