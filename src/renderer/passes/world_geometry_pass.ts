import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { GBuffer } from '../gbuffer.js';
import type { Chunk, ChunkMesh } from '../../block/chunk.js';
import type { BlockTexture } from '../../assets/block_texture.js';
import { blockTextureOffsetData, BlockType, BLOCK_ATLAS_WIDTH_DIVIDED } from '../../block/block_type.js';
import type { Mat4 } from '../../math/mat4.js';
import chunkGeometryWgsl from '../../shaders/chunk_geometry.wgsl?raw';

const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16; // 4 mat4 + vec3+f32 + f32+pad = 288 bytes
const CHUNK_UNIFORM_SIZE  = 16;                 // vec3f + f32 pad
const BLOCK_DATA_STRIDE   = 16;                 // 4 u32s: sideTile, bottomTile, topTile, pad

const FLOATS_PER_VERT = 5;
const BYTES_PER_VERT  = FLOATS_PER_VERT * 4;

interface ChunkGpu {
  opaqueBuffer      : GPUBuffer | null;
  opaqueCount       : number;
  transparentBuffer : GPUBuffer | null;
  transparentCount  : number;
  uniformBuffer     : GPUBuffer;
  chunkBindGroup    : GPUBindGroup;
}

export class WorldGeometryPass extends RenderPass {
  readonly name = 'WorldGeometryPass';

  private _gbuffer           : GBuffer;
  private _device            : GPUDevice;
  private _opaquePipeline    : GPURenderPipeline;
  private _transparentPipeline: GPURenderPipeline;
  private _cameraBuffer      : GPUBuffer;
  private _cameraBindGroup   : GPUBindGroup;
  private _sharedBindGroup   : GPUBindGroup;
  private _chunkBGL          : GPUBindGroupLayout;
  private _chunks            = new Map<Chunk, ChunkGpu>();

  private constructor(
    device             : GPUDevice,
    gbuffer            : GBuffer,
    opaquePipeline     : GPURenderPipeline,
    transparentPipeline: GPURenderPipeline,
    cameraBuffer       : GPUBuffer,
    cameraBindGroup    : GPUBindGroup,
    sharedBindGroup    : GPUBindGroup,
    chunkBGL           : GPUBindGroupLayout,
  ) {
    super();
    this._device             = device;
    this._gbuffer            = gbuffer;
    this._opaquePipeline     = opaquePipeline;
    this._transparentPipeline = transparentPipeline;
    this._cameraBuffer       = cameraBuffer;
    this._cameraBindGroup    = cameraBindGroup;
    this._sharedBindGroup    = sharedBindGroup;
    this._chunkBGL           = chunkBGL;
  }

  static create(ctx: RenderContext, gbuffer: GBuffer, blockTexture: BlockTexture): WorldGeometryPass {
    const { device } = ctx;

    const cameraBGL = device.createBindGroupLayout({
      label: 'ChunkCameraBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });

    const sharedBGL = device.createBindGroupLayout({
      label: 'ChunkSharedBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },          // color atlas
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },          // normal atlas
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },          // MER atlas
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },     // block data
      ],
    });

    const chunkBGL = device.createBindGroupLayout({
      label: 'ChunkOffsetBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });

    // Build block data storage buffer: 4 u32s per block type (sideTile, bottomTile, topTile, pad)
    const numBlocks     = BlockType.MAX as number;
    const blockDataBuf  = device.createBuffer({
      label: 'BlockDataBuffer',
      size : Math.max(numBlocks * BLOCK_DATA_STRIDE, 16),
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const COLS = BLOCK_ATLAS_WIDTH_DIVIDED; // 25
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
      label: 'ChunkAtlasSampler',
      magFilter: 'nearest', minFilter: 'nearest',
      addressModeU: 'repeat', addressModeV: 'repeat',
    });

    const sharedBindGroup = device.createBindGroup({
      label  : 'ChunkSharedBG',
      layout : sharedBGL,
      entries: [
        { binding: 0, resource: blockTexture.colorAtlas.view  },
        { binding: 1, resource: blockTexture.normalAtlas.view },
        { binding: 2, resource: blockTexture.merAtlas.view    },
        { binding: 3, resource: atlasSampler },
        { binding: 4, resource: { buffer: blockDataBuf } },
      ],
    });

    const cameraBuffer = device.createBuffer({
      label: 'ChunkCameraBuffer',
      size : CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const cameraBindGroup = device.createBindGroup({
      label  : 'ChunkCameraBG',
      layout : cameraBGL,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });

    const shader = device.createShaderModule({ label: 'ChunkGeometryShader', code: chunkGeometryWgsl });
    const layout = device.createPipelineLayout({ bindGroupLayouts: [cameraBGL, sharedBGL, chunkBGL] });

    const vertexLayout: GPUVertexBufferLayout = {
      arrayStride: BYTES_PER_VERT,
      attributes : [
        { shaderLocation: 0, offset: 0,  format: 'float32x3' }, // position
        { shaderLocation: 1, offset: 12, format: 'float32'   }, // face
        { shaderLocation: 2, offset: 16, format: 'float32'   }, // blockType
      ],
    };

    const colorTargets: GPUColorTargetState[] = [
      { format: 'rgba8unorm'  },  // albedo + roughness
      { format: 'rgba16float' },  // normal + metallic
    ];

    const opaquePipeline = device.createRenderPipeline({
      label : 'ChunkOpaquePipeline',
      layout,
      vertex  : { module: shader, entryPoint: 'vs_main',       buffers: [vertexLayout] },
      fragment: { module: shader, entryPoint: 'fs_opaque',      targets: colorTargets   },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive   : { topology: 'triangle-list', cullMode: 'back' },
    });

    const transparentPipeline = device.createRenderPipeline({
      label : 'ChunkTransparentPipeline',
      layout,
      vertex  : { module: shader, entryPoint: 'vs_main',       buffers: [vertexLayout] },
      fragment: { module: shader, entryPoint: 'fs_transparent', targets: colorTargets   },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive   : { topology: 'triangle-list', cullMode: 'back' },
    });

    return new WorldGeometryPass(device, gbuffer, opaquePipeline, transparentPipeline, cameraBuffer, cameraBindGroup, sharedBindGroup, chunkBGL);
  }

  updateGBuffer(gbuffer: GBuffer): void {
    this._gbuffer = gbuffer;
  }

  addChunk(chunk: Chunk, mesh: ChunkMesh): void {
    const existing = this._chunks.get(chunk);
    if (existing) {
      this._replaceMeshBuffers(existing, mesh);
    } else {
      this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
    }
  }

  updateChunk(chunk: Chunk, mesh: ChunkMesh): void {
    const existing = this._chunks.get(chunk);
    if (existing) {
      this._replaceMeshBuffers(existing, mesh);
    } else {
      this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
    }
  }

  removeChunk(chunk: Chunk): void {
    const gpuData = this._chunks.get(chunk);
    if (!gpuData) return;
    gpuData.opaqueBuffer?.destroy();
    gpuData.transparentBuffer?.destroy();
    gpuData.uniformBuffer.destroy();
    this._chunks.delete(chunk);
  }

  updateCamera(
    ctx: RenderContext,
    view: Mat4, proj: Mat4, viewProj: Mat4, invViewProj: Mat4,
    camPos: { x: number; y: number; z: number },
    near: number, far: number,
  ): void {
    const data = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
    data.set(view.data,         0);
    data.set(proj.data,        16);
    data.set(viewProj.data,    32);
    data.set(invViewProj.data, 48);
    data[64] = camPos.x; data[65] = camPos.y; data[66] = camPos.z;
    data[67] = near;
    data[68] = far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    const pass = encoder.beginRenderPass({
      label: 'WorldGeometryPass',
      colorAttachments: [
        { view: this._gbuffer.albedoRoughnessView, loadOp: 'load', storeOp: 'store' },
        { view: this._gbuffer.normalMetallicView,  loadOp: 'load', storeOp: 'store' },
      ],
      depthStencilAttachment: {
        view: this._gbuffer.depthView,
        depthLoadOp: 'load', depthStoreOp: 'store',
      },
    });

    pass.setBindGroup(0, this._cameraBindGroup);
    pass.setBindGroup(1, this._sharedBindGroup);

    pass.setPipeline(this._opaquePipeline);
    for (const gpuData of this._chunks.values()) {
      if (gpuData.opaqueBuffer && gpuData.opaqueCount > 0) {
        pass.setBindGroup(2, gpuData.chunkBindGroup);
        pass.setVertexBuffer(0, gpuData.opaqueBuffer);
        pass.draw(gpuData.opaqueCount);
      }
    }

    pass.setPipeline(this._transparentPipeline);
    for (const gpuData of this._chunks.values()) {
      if (gpuData.transparentBuffer && gpuData.transparentCount > 0) {
        pass.setBindGroup(2, gpuData.chunkBindGroup);
        pass.setVertexBuffer(0, gpuData.transparentBuffer);
        pass.draw(gpuData.transparentCount);
      }
    }

    pass.end();
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    for (const gpuData of this._chunks.values()) {
      gpuData.opaqueBuffer?.destroy();
      gpuData.transparentBuffer?.destroy();
      gpuData.uniformBuffer.destroy();
    }
    this._chunks.clear();
  }

  private _createChunkGpu(chunk: Chunk, mesh: ChunkMesh): ChunkGpu {
    const uniformBuffer = this._device.createBuffer({
      label: `ChunkOffsetBuf(${chunk.globalPosition.x},${chunk.globalPosition.y},${chunk.globalPosition.z})`,
      size : CHUNK_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const offsetData = new Float32Array([chunk.globalPosition.x, chunk.globalPosition.y, chunk.globalPosition.z, 0]);
    this._device.queue.writeBuffer(uniformBuffer, 0, offsetData);

    const chunkBindGroup = this._device.createBindGroup({
      label  : 'ChunkOffsetBG',
      layout : this._chunkBGL,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const gpuData: ChunkGpu = {
      opaqueBuffer     : null,
      opaqueCount      : 0,
      transparentBuffer: null,
      transparentCount : 0,
      uniformBuffer,
      chunkBindGroup,
    };
    this._replaceMeshBuffers(gpuData, mesh);
    return gpuData;
  }

  private _replaceMeshBuffers(gpuData: ChunkGpu, mesh: ChunkMesh): void {
    gpuData.opaqueBuffer?.destroy();
    gpuData.transparentBuffer?.destroy();
    gpuData.opaqueBuffer      = null;
    gpuData.transparentBuffer = null;
    gpuData.opaqueCount       = mesh.opaqueCount;
    gpuData.transparentCount  = mesh.transparentCount;

    if (mesh.opaqueCount > 0) {
      const buf = this._device.createBuffer({
        label: 'ChunkOpaqueBuf',
        size : mesh.opaqueCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.opaque.buffer, 0, mesh.opaqueCount * BYTES_PER_VERT);
      gpuData.opaqueBuffer = buf;
    }

    if (mesh.transparentCount > 0) {
      const buf = this._device.createBuffer({
        label: 'ChunkTransparentBuf',
        size : mesh.transparentCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.transparent.buffer, 0, mesh.transparentCount * BYTES_PER_VERT);
      gpuData.transparentBuffer = buf;
    }
  }
}
