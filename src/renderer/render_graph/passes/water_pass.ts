import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import type { Chunk, ChunkMesh } from '../../../block/chunk.js';
import type { Texture } from '../../../assets/texture.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import type { Mat4 } from '../../../math/mat4.js';
import waterWgsl from '../../../shaders/water.wgsl?raw';

const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16;
const WATER_UNIFORM_SIZE = 16;
const CHUNK_UNIFORM_SIZE = 16;

const FLOATS_PER_VERT = 3;
const BYTES_PER_VERT = FLOATS_PER_VERT * 4;

const CHUNK_SIZE = 16;

interface ChunkWaterGpu {
  ox: number; oy: number; oz: number;
  buffer: GPUBuffer | null;
  vertexCount: number;
  uniformBuffer: GPUBuffer;
  chunkBG: GPUBindGroup;
}

export interface WaterDeps {
  hdr: ResourceHandle;
  depth: ResourceHandle;
}

export class WaterPass extends Pass<WaterDeps, void> {
  readonly name = 'WaterPass';

  private readonly _device: GPUDevice;
  private readonly _pipeline: GPURenderPipeline;
  private readonly _cameraBuffer: GPUBuffer;
  private readonly _waterBuffer: GPUBuffer;
  private readonly _cameraBG: GPUBindGroup;
  private readonly _waterBG: GPUBindGroup;
  private readonly _sceneBGL: GPUBindGroupLayout;
  private readonly _chunkBGL: GPUBindGroupLayout;
  private readonly _skyTexture: Texture;
  private readonly _dudvTexture: Texture;
  private readonly _gradientTexture: Texture;
  private readonly _sampler: GPUSampler;
  private readonly _chunks = new Map<Chunk, ChunkWaterGpu>();
  private readonly _frustumPlanes = new Float32Array(24);
  private readonly _cameraScratch = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
  private readonly _waterScratch = new Float32Array(4);

  private constructor(
    device: GPUDevice,
    pipeline: GPURenderPipeline,
    cameraBuffer: GPUBuffer,
    waterBuffer: GPUBuffer,
    cameraBG: GPUBindGroup,
    waterBG: GPUBindGroup,
    sceneBGL: GPUBindGroupLayout,
    chunkBGL: GPUBindGroupLayout,
    skyTexture: Texture,
    dudvTexture: Texture,
    gradientTexture: Texture,
    sampler: GPUSampler,
  ) {
    super();
    this._device = device;
    this._pipeline = pipeline;
    this._cameraBuffer = cameraBuffer;
    this._waterBuffer = waterBuffer;
    this._cameraBG = cameraBG;
    this._waterBG = waterBG;
    this._sceneBGL = sceneBGL;
    this._chunkBGL = chunkBGL;
    this._skyTexture = skyTexture;
    this._dudvTexture = dudvTexture;
    this._gradientTexture = gradientTexture;
    this._sampler = sampler;
  }

  static create(
    ctx: RenderContext,
    skyTexture: Texture,
    dudvTexture: Texture,
    gradientTexture: Texture,
  ): WaterPass {
    const { device } = ctx;

    const cameraBGL = device.createBindGroupLayout({
      label: 'WaterCameraBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });

    const waterBGL = device.createBindGroupLayout({
      label: 'WaterUniformBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });

    const chunkBGL = device.createBindGroupLayout({
      label: 'WaterChunkBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });

    const sceneBGL = device.createBindGroupLayout({
      label: 'WaterSceneBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const sampler = device.createSampler({
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'repeat', addressModeV: 'repeat',
    });

    const cameraBuffer = device.createBuffer({
      label: 'WaterCameraBuffer', size: CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const waterBuffer = device.createBuffer({
      label: 'WaterUniformBuffer', size: WATER_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const cameraBG = device.createBindGroup({
      label: 'WaterCameraBG', layout: cameraBGL,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });
    const waterBG = device.createBindGroup({
      label: 'WaterUniformBG', layout: waterBGL,
      entries: [{ binding: 0, resource: { buffer: waterBuffer } }],
    });

    const shader = ctx.createShaderModule(waterWgsl, 'WaterShader');
    const layout = device.createPipelineLayout({
      bindGroupLayouts: [cameraBGL, waterBGL, chunkBGL, sceneBGL],
    });

    const vertexLayout: GPUVertexBufferLayout = {
      arrayStride: BYTES_PER_VERT,
      attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
    };

    const pipeline = device.createRenderPipeline({
      label: 'WaterPipeline',
      layout,
      vertex: { module: shader, entryPoint: 'vs_main', buffers: [vertexLayout] },
      fragment: {
        module: shader, entryPoint: 'fs_main',
        targets: [{
          format: HDR_FORMAT,
          blend: {
            color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
            alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
          },
        }],
      },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    return new WaterPass(
      device, pipeline, cameraBuffer, waterBuffer, cameraBG, waterBG,
      sceneBGL, chunkBGL, skyTexture, dudvTexture, gradientTexture, sampler,
    );
  }

  setSkyTexture(skyTexture: Texture): void {
    (this._skyTexture as Texture) = skyTexture;
  }

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
    data[67] = near;
    data[68] = far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
    this._extractFrustumPlanes(viewProj.data);
  }

  updateTime(ctx: RenderContext, time: number, skyIntensity = 1.0): void {
    this._waterScratch[0] = time;
    this._waterScratch[1] = skyIntensity;
    this._waterScratch[2] = 0;
    this._waterScratch[3] = 0;
    ctx.queue.writeBuffer(this._waterBuffer, 0, this._waterScratch.buffer as ArrayBuffer);
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
    this.addChunk(chunk, mesh);
  }

  removeChunk(chunk: Chunk): void {
    const gpu = this._chunks.get(chunk);
    if (!gpu) return;
    gpu.buffer?.destroy();
    gpu.uniformBuffer.destroy();
    this._chunks.delete(chunk);
  }

  addToGraph(graph: RenderGraph, deps: WaterDeps): void {
    const { ctx } = graph;
    const { width, height } = ctx;

    let refrac!: ResourceHandle;

    // Pass 1: Copy HDR scene into refraction texture
    graph.addPass(`${this.name}.copy`, 'transfer', (b: PassBuilder) => {
      b.read(deps.hdr, 'copy-src');
      refrac = b.createTexture({
        label: 'WaterRefraction',
        format: HDR_FORMAT,
        width,
        height,
      } as TextureDesc);
      b.write(refrac, 'copy-dst');

      b.setExecute((pctx, res) => {
        pctx.commandEncoder.copyTextureToTexture(
          { texture: res.getTexture(deps.hdr) },
          { texture: res.getTexture(refrac) },
          { width, height, depthOrArrayLayers: 1 },
        );
      });
    });

    // Pass 2: Render water chunks onto HDR
    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      b.read(refrac, 'sampled');
      b.read(deps.depth, 'sampled');
      b.write(deps.hdr, 'attachment', { loadOp: 'load', storeOp: 'store' });

      b.setExecute((pctx, res) => {
        const sceneBG = this._device.createBindGroup({
          label: 'WaterSceneBG',
          layout: this._sceneBGL,
          entries: [
            { binding: 0, resource: res.getTextureView(refrac) },
            { binding: 1, resource: res.getTextureView(deps.depth) },
            { binding: 2, resource: this._dudvTexture.view },
            { binding: 3, resource: this._gradientTexture.view },
            { binding: 4, resource: this._skyTexture.view },
            { binding: 5, resource: this._sampler },
          ],
        });

        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._cameraBG);
        enc.setBindGroup(1, this._waterBG);
        enc.setBindGroup(3, sceneBG);

        for (const gpu of this._chunks.values()) {
          if (!gpu.buffer || gpu.vertexCount === 0) continue;
          if (!this._isVisible(gpu.ox, gpu.oy, gpu.oz)) continue;
          enc.setBindGroup(2, gpu.chunkBG);
          enc.setVertexBuffer(0, gpu.buffer);
          enc.draw(gpu.vertexCount);
        }
      });
    });
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    this._waterBuffer.destroy();
    for (const gpu of this._chunks.values()) {
      gpu.buffer?.destroy();
      gpu.uniformBuffer.destroy();
    }
    this._chunks.clear();
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

  private _isVisible(ox: number, oy: number, oz: number): boolean {
    const p = this._frustumPlanes;
    const mx = ox + CHUNK_SIZE, my = oy + CHUNK_SIZE, mz = oz + CHUNK_SIZE;
    for (let i = 0; i < 6; i++) {
      const a = p[i*4], b = p[i*4+1], c = p[i*4+2], d = p[i*4+3];
      if (a*(a>=0?mx:ox) + b*(b>=0?my:oy) + c*(c>=0?mz:oz) + d < 0) return false;
    }
    return true;
  }

  private _createChunkGpu(chunk: Chunk, mesh: ChunkMesh): ChunkWaterGpu {
    const uniformBuffer = this._device.createBuffer({
      label: `WaterChunkBuf(${chunk.globalPosition.x},${chunk.globalPosition.y},${chunk.globalPosition.z})`,
      size: CHUNK_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this._device.queue.writeBuffer(uniformBuffer, 0,
      new Float32Array([chunk.globalPosition.x, chunk.globalPosition.y, chunk.globalPosition.z, 0]));

    const chunkBG = this._device.createBindGroup({
      label: 'WaterChunkBG', layout: this._chunkBGL,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const gpu: ChunkWaterGpu = {
      ox: chunk.globalPosition.x, oy: chunk.globalPosition.y, oz: chunk.globalPosition.z,
      buffer: null, vertexCount: 0, uniformBuffer, chunkBG,
    };
    this._replaceMeshBuffer(gpu, mesh);
    return gpu;
  }

  private _replaceMeshBuffer(gpu: ChunkWaterGpu, mesh: ChunkMesh): void {
    gpu.buffer?.destroy();
    gpu.buffer = null;
    gpu.vertexCount = mesh.waterCount;
    if (mesh.waterCount > 0) {
      const buf = this._device.createBuffer({
        label: 'WaterVertexBuf',
        size: mesh.waterCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.water.buffer, 0, mesh.waterCount * BYTES_PER_VERT);
      gpu.buffer = buf;
    }
  }
}
