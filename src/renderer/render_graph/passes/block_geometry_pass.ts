import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import type { Chunk, ChunkMesh } from '../../../block/chunk.js';
import type { BlockTexture } from '../../../assets/block_texture.js';
import { blockTextureOffsetData, BlockType, BLOCK_ATLAS_WIDTH_DIVIDED } from '../../../block/block_type.js';
import chunkGeometryWgsl from '../../../shaders/chunk_geometry.wgsl?raw';

const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16; // 4 mat4 + vec3+f32 + f32+pad
const BLOCK_DATA_STRIDE = 16;
const CHUNK_UNIFORM_ALIGNMENT = 256;
const MAX_CHUNK_SLOTS = 2048;

const FLOATS_PER_VERT = 5;
const BYTES_PER_VERT = FLOATS_PER_VERT * 4;
const CHUNK_SIZE = 16;

export const GBUF_ALBEDO_FORMAT: GPUTextureFormat = 'rgba8unorm';
export const GBUF_NORMAL_FORMAT: GPUTextureFormat = 'rgba16float';
export const GBUF_DEPTH_FORMAT: GPUTextureFormat = 'depth32float';

interface ChunkGpu {
  ox: number; oy: number; oz: number;
  slot: number;
  opaqueBuffer: GPUBuffer | null;
  opaqueCount: number;
  transparentBuffer: GPUBuffer | null;
  transparentCount: number;
  propBuffer: GPUBuffer | null;
  propCount: number;
}

export interface BlockGeometryDeps {
  /** Pre-existing GBuffer to load + write into. If absent, the pass creates fresh attachments. */
  gbuffer?: { albedo: ResourceHandle; normal: ResourceHandle; depth: ResourceHandle };
  /** Whether this pass is the first to write the gbuffer (clear) or an incremental writer (load). */
  loadOp?: GPULoadOp;
}

export interface BlockGeometryOutputs {
  albedo: ResourceHandle;
  normal: ResourceHandle;
  depth: ResourceHandle;
}

/**
 * G-buffer fill pass for voxel world chunks (render-graph version).
 *
 * Rasterises opaque, transparent and prop chunk geometry into the GBuffer
 * attachments (albedo+roughness, normal+metallic, depth). When `deps.gbuffer`
 * is supplied the pass loads + writes those handles; otherwise it creates a
 * fresh transient GBuffer and clears it.
 */
export class BlockGeometryPass extends Pass<BlockGeometryDeps, BlockGeometryOutputs> {
  readonly name = 'BlockGeometryPass';

  /** Number of draw calls issued during the most recent execute. */
  drawCalls = 0;
  /** Triangle count submitted during the most recent execute. */
  triangles = 0;

  private readonly _device: GPUDevice;
  private readonly _opaquePipeline: GPURenderPipeline;
  private readonly _transparentPipeline: GPURenderPipeline;
  private readonly _propPipeline: GPURenderPipeline;
  private readonly _cameraBuffer: GPUBuffer;
  private readonly _cameraBindGroup: GPUBindGroup;
  private readonly _sharedBindGroup: GPUBindGroup;
  private readonly _chunkUniformBuffer: GPUBuffer;
  private readonly _chunkBindGroup: GPUBindGroup;

  private readonly _slotFreeList: number[] = [];
  private _slotHighWater = 0;
  private readonly _chunks = new Map<Chunk, ChunkGpu>();
  private readonly _frustumPlanes = new Float32Array(24);

  private readonly _cameraData = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
  private readonly _chunkUniformAB = new ArrayBuffer(32);
  private readonly _chunkUniformF = new Float32Array(this._chunkUniformAB);
  private readonly _chunkUniformU = new Uint32Array(this._chunkUniformAB);
  private _debugChunks = false;

  private constructor(
    device: GPUDevice,
    opaquePipeline: GPURenderPipeline,
    transparentPipeline: GPURenderPipeline,
    propPipeline: GPURenderPipeline,
    cameraBuffer: GPUBuffer,
    cameraBindGroup: GPUBindGroup,
    sharedBindGroup: GPUBindGroup,
    chunkUniformBuffer: GPUBuffer,
    chunkBindGroup: GPUBindGroup,
  ) {
    super();
    this._device = device;
    this._opaquePipeline = opaquePipeline;
    this._transparentPipeline = transparentPipeline;
    this._propPipeline = propPipeline;
    this._cameraBuffer = cameraBuffer;
    this._cameraBindGroup = cameraBindGroup;
    this._sharedBindGroup = sharedBindGroup;
    this._chunkUniformBuffer = chunkUniformBuffer;
    this._chunkBindGroup = chunkBindGroup;
  }

  static create(ctx: RenderContext, blockTexture: BlockTexture): BlockGeometryPass {
    const { device } = ctx;

    const cameraBgl = device.createBindGroupLayout({
      label: 'ChunkCameraBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });

    const sharedBgl = device.createBindGroupLayout({
      label: 'ChunkSharedBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
      ],
    });

    const chunkBgl = device.createBindGroupLayout({
      label: 'ChunkOffsetBGL',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: 'uniform', hasDynamicOffset: true, minBindingSize: 32 },
      }],
    });

    const numBlocks = BlockType.MAX as number;
    const blockDataBuf = device.createBuffer({
      label: 'BlockDataBuffer',
      size: Math.max(numBlocks * BLOCK_DATA_STRIDE, 16),
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
      label: 'ChunkAtlasSampler',
      magFilter: 'nearest', minFilter: 'nearest',
      addressModeU: 'repeat', addressModeV: 'repeat',
    });

    const sharedBindGroup = device.createBindGroup({
      label: 'ChunkSharedBG', layout: sharedBgl,
      entries: [
        { binding: 0, resource: blockTexture.colorAtlas.view },
        { binding: 1, resource: blockTexture.normalAtlas.view },
        { binding: 2, resource: blockTexture.merAtlas.view },
        { binding: 3, resource: atlasSampler },
        { binding: 4, resource: { buffer: blockDataBuf } },
      ],
    });

    const cameraBuffer = device.createBuffer({
      label: 'ChunkCameraBuffer',
      size: CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const cameraBindGroup = device.createBindGroup({
      label: 'ChunkCameraBG', layout: cameraBgl,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });

    const shader = ctx.createShaderModule(chunkGeometryWgsl, 'ChunkGeometryShader');
    const layout = device.createPipelineLayout({ bindGroupLayouts: [cameraBgl, sharedBgl, chunkBgl] });

    const vertexLayout: GPUVertexBufferLayout = {
      arrayStride: BYTES_PER_VERT,
      attributes: [
        { shaderLocation: 0, offset: 0, format: 'float32x3' },
        { shaderLocation: 1, offset: 12, format: 'float32' },
        { shaderLocation: 2, offset: 16, format: 'float32' },
      ],
    };

    const colorTargets: GPUColorTargetState[] = [
      { format: GBUF_ALBEDO_FORMAT },
      { format: GBUF_NORMAL_FORMAT },
    ];

    const opaquePipeline = device.createRenderPipeline({
      label: 'ChunkOpaquePipeline',
      layout,
      vertex: { module: shader, entryPoint: 'vs_main', buffers: [vertexLayout] },
      fragment: { module: shader, entryPoint: 'fs_opaque', targets: colorTargets },
      depthStencil: { format: GBUF_DEPTH_FORMAT, depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
    });

    const transparentPipeline = device.createRenderPipeline({
      label: 'ChunkTransparentPipeline',
      layout,
      vertex: { module: shader, entryPoint: 'vs_main', buffers: [vertexLayout] },
      fragment: { module: shader, entryPoint: 'fs_transparent', targets: colorTargets },
      depthStencil: { format: GBUF_DEPTH_FORMAT, depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
    });

    const propPipeline = device.createRenderPipeline({
      label: 'ChunkPropPipeline',
      layout,
      vertex: { module: shader, entryPoint: 'vs_prop', buffers: [vertexLayout] },
      fragment: { module: shader, entryPoint: 'fs_prop', targets: colorTargets },
      depthStencil: { format: GBUF_DEPTH_FORMAT, depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    const chunkUniformBuffer = device.createBuffer({
      label: 'ChunkUniformBuffer',
      size: MAX_CHUNK_SLOTS * CHUNK_UNIFORM_ALIGNMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const chunkBindGroup = device.createBindGroup({
      label: 'ChunkOffsetBG', layout: chunkBgl,
      entries: [{ binding: 0, resource: { buffer: chunkUniformBuffer, size: 32 } }],
    });

    return new BlockGeometryPass(
      device, opaquePipeline, transparentPipeline, propPipeline,
      cameraBuffer, cameraBindGroup, sharedBindGroup,
      chunkUniformBuffer, chunkBindGroup,
    );
  }

  /** Register or replace a chunk's GPU mesh data. */
  addChunk(chunk: Chunk, mesh: ChunkMesh): void {
    const existing = this._chunks.get(chunk);
    if (existing) this._replaceMeshBuffers(existing, mesh);
    else this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
  }

  updateChunk(chunk: Chunk, mesh: ChunkMesh): void {
    this.addChunk(chunk, mesh);
  }

  removeChunk(chunk: Chunk): void {
    const gpuData = this._chunks.get(chunk);
    if (!gpuData) return;
    gpuData.opaqueBuffer?.destroy();
    gpuData.transparentBuffer?.destroy();
    gpuData.propBuffer?.destroy();
    this._freeSlot(gpuData.slot);
    this._chunks.delete(chunk);
  }

  /**
   * Upload per-frame camera state from `ctx.activeCamera` and recompute the
   * cached frustum planes. Uniform uses the TAA-jittered VP (sub-pixel motion);
   * frustum planes use the un-jittered VP.
   */
  updateCamera(ctx: RenderContext): void {
    const camera = ctx.activeCamera;
    if (!camera) {
      throw new Error('BlockGeometryPass.updateCamera: ctx.activeCamera is null');
    }
    const camPos = camera.position();
    const data = this._cameraData;
    data.set(camera.viewMatrix().data, 0);
    data.set(camera.projectionMatrix().data, 16);
    data.set(camera.jitteredViewProjectionMatrix().data, 32);
    data.set(camera.inverseViewProjectionMatrix().data, 48);
    data[64] = camPos.x; data[65] = camPos.y; data[66] = camPos.z;
    data[67] = camera.near;
    data[68] = camera.far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
    this._extractFrustumPlanes(camera.viewProjectionMatrix().data);
  }

  private _extractFrustumPlanes(m: Float32Array | number[]): void {
    const p = this._frustumPlanes;
    p[ 0]=m[3]+m[0]; p[ 1]=m[7]+m[4]; p[ 2]=m[11]+m[ 8]; p[ 3]=m[15]+m[12];
    p[ 4]=m[3]-m[0]; p[ 5]=m[7]-m[4]; p[ 6]=m[11]-m[ 8]; p[ 7]=m[15]-m[12];
    p[ 8]=m[3]+m[1]; p[ 9]=m[7]+m[5]; p[10]=m[11]+m[ 9]; p[11]=m[15]+m[13];
    p[12]=m[3]-m[1]; p[13]=m[7]-m[5]; p[14]=m[11]-m[ 9]; p[15]=m[15]-m[13];
    p[16]=m[2];      p[17]=m[6];      p[18]=m[10];        p[19]=m[14];
    p[20]=m[3]-m[2]; p[21]=m[7]-m[6]; p[22]=m[11]-m[10]; p[23]=m[15]-m[14];
  }

  setDebugChunks(enabled: boolean): void {
    if (this._debugChunks === enabled) return;
    this._debugChunks = enabled;
    for (const [, gpu] of this._chunks) {
      this._writeChunkUniforms(gpu.slot, gpu.ox, gpu.oy, gpu.oz);
    }
  }

  private _isVisible(ox: number, oy: number, oz: number): boolean {
    const p = this._frustumPlanes;
    const mx = ox + CHUNK_SIZE, my = oy + CHUNK_SIZE, mz = oz + CHUNK_SIZE;
    for (let i = 0; i < 6; i++) {
      const a = p[i*4], b = p[i*4+1], c = p[i*4+2], d = p[i*4+3];
      if (a*(a>=0?mx:ox) + b*(b>=0?my:oy) + c*(c>=0?mz:oz) + d < 0) return false;
    }
    return true;
  }

  addToGraph(graph: RenderGraph, deps: BlockGeometryDeps = {}): BlockGeometryOutputs {
    const { ctx } = graph;
    const screenDesc = (format: GPUTextureFormat): TextureDesc => ({
      format, width: ctx.width, height: ctx.height,
    });

    let albedo: ResourceHandle;
    let normal: ResourceHandle;
    let depth: ResourceHandle;

    if (deps.gbuffer) {
      albedo = deps.gbuffer.albedo;
      normal = deps.gbuffer.normal;
      depth = deps.gbuffer.depth;
    } else {
      // Will be assigned inside the pass setup; use definite-assignment bangs.
      albedo = undefined as unknown as ResourceHandle;
      normal = undefined as unknown as ResourceHandle;
      depth = undefined as unknown as ResourceHandle;
    }

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
      outNormal = b.write(normal, 'attachment', { loadOp: load, storeOp: 'store', clearValue: [0.5, 0.5, 1, 1] });
      outDepth = b.write(depth, 'depth-attachment', {
        depthLoadOp: load, depthStoreOp: 'store', depthClearValue: 1.0,
      });

      b.setExecute((pctx) => {
        const enc = pctx.renderPassEncoder!;
        enc.setBindGroup(0, this._cameraBindGroup);
        enc.setBindGroup(1, this._sharedBindGroup);

        let dc = 0, tris = 0;
        const visible: ChunkGpu[] = [];
        for (const gpuData of this._chunks.values()) {
          if (this._isVisible(gpuData.ox, gpuData.oy, gpuData.oz)) visible.push(gpuData);
        }

        enc.setPipeline(this._opaquePipeline);
        for (const gpu of visible) {
          if (gpu.opaqueBuffer && gpu.opaqueCount > 0) {
            enc.setBindGroup(2, this._chunkBindGroup, [gpu.slot * CHUNK_UNIFORM_ALIGNMENT]);
            enc.setVertexBuffer(0, gpu.opaqueBuffer);
            enc.draw(gpu.opaqueCount);
            dc++; tris += gpu.opaqueCount / 3;
          }
        }

        enc.setPipeline(this._transparentPipeline);
        for (const gpu of visible) {
          if (gpu.transparentBuffer && gpu.transparentCount > 0) {
            enc.setBindGroup(2, this._chunkBindGroup, [gpu.slot * CHUNK_UNIFORM_ALIGNMENT]);
            enc.setVertexBuffer(0, gpu.transparentBuffer);
            enc.draw(gpu.transparentCount);
            dc++; tris += gpu.transparentCount / 3;
          }
        }

        enc.setPipeline(this._propPipeline);
        for (const gpu of visible) {
          if (gpu.propBuffer && gpu.propCount > 0) {
            enc.setBindGroup(2, this._chunkBindGroup, [gpu.slot * CHUNK_UNIFORM_ALIGNMENT]);
            enc.setVertexBuffer(0, gpu.propBuffer);
            enc.draw(gpu.propCount);
            dc++; tris += gpu.propCount / 3;
          }
        }

        this.drawCalls = dc;
        this.triangles = tris;
      });
    });

    return { albedo: outAlbedo, normal: outNormal, depth: outDepth };
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    this._chunkUniformBuffer.destroy();
    for (const gpu of this._chunks.values()) {
      gpu.opaqueBuffer?.destroy();
      gpu.transparentBuffer?.destroy();
      gpu.propBuffer?.destroy();
    }
    this._chunks.clear();
  }

  private _allocSlot(): number {
    return this._slotFreeList.length > 0 ? this._slotFreeList.pop()! : this._slotHighWater++;
  }

  private _freeSlot(slot: number): void {
    this._slotFreeList.push(slot);
  }

  private _writeChunkUniforms(slot: number, cx: number, cy: number, cz: number): void {
    const hash = (cx * 73856093) ^ (cy * 19349663) ^ (cz * 83492791);
    const r = ((hash & 0xFF) / 255.0) * 0.6 + 0.4;
    const g = (((hash >> 8) & 0xFF) / 255.0) * 0.6 + 0.4;
    const b = (((hash >> 16) & 0xFF) / 255.0) * 0.6 + 0.4;

    const f = this._chunkUniformF;
    const u = this._chunkUniformU;
    f[0] = cx; f[1] = cy; f[2] = cz;
    u[3] = this._debugChunks ? 1 : 0;
    f[4] = r; f[5] = g; f[6] = b; f[7] = 0;

    this._device.queue.writeBuffer(this._chunkUniformBuffer, slot * CHUNK_UNIFORM_ALIGNMENT, this._chunkUniformAB);
  }

  private _createChunkGpu(chunk: Chunk, mesh: ChunkMesh): ChunkGpu {
    const slot = this._allocSlot();
    this._writeChunkUniforms(slot, chunk.globalPosition.x, chunk.globalPosition.y, chunk.globalPosition.z);
    const gpuData: ChunkGpu = {
      ox: chunk.globalPosition.x,
      oy: chunk.globalPosition.y,
      oz: chunk.globalPosition.z,
      slot,
      opaqueBuffer: null, opaqueCount: 0,
      transparentBuffer: null, transparentCount: 0,
      propBuffer: null, propCount: 0,
    };
    this._replaceMeshBuffers(gpuData, mesh);
    return gpuData;
  }

  private _replaceMeshBuffers(gpuData: ChunkGpu, mesh: ChunkMesh): void {
    gpuData.opaqueBuffer?.destroy();
    gpuData.transparentBuffer?.destroy();
    gpuData.propBuffer?.destroy();
    gpuData.opaqueBuffer = null;
    gpuData.transparentBuffer = null;
    gpuData.propBuffer = null;
    gpuData.opaqueCount = mesh.opaqueCount;
    gpuData.transparentCount = mesh.transparentCount;
    gpuData.propCount = mesh.propCount;

    if (mesh.opaqueCount > 0) {
      const buf = this._device.createBuffer({
        label: 'ChunkOpaqueBuf',
        size: mesh.opaqueCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.opaque.buffer, 0, mesh.opaqueCount * BYTES_PER_VERT);
      gpuData.opaqueBuffer = buf;
    }

    if (mesh.transparentCount > 0) {
      const buf = this._device.createBuffer({
        label: 'ChunkTransparentBuf',
        size: mesh.transparentCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.transparent.buffer, 0, mesh.transparentCount * BYTES_PER_VERT);
      gpuData.transparentBuffer = buf;
    }

    if (mesh.propCount > 0) {
      const buf = this._device.createBuffer({
        label: 'ChunkPropBuf',
        size: mesh.propCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.prop.buffer, 0, mesh.propCount * BYTES_PER_VERT);
      gpuData.propBuffer = buf;
    }
  }
}
