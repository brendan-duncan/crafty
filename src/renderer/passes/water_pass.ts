import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { Chunk, ChunkMesh } from '../../block/chunk.js';
import type { Texture } from '../../assets/texture.js';
import { HDR_FORMAT } from './lighting_pass.js';
import type { Mat4 } from '../../math/mat4.js';
import waterWgsl from '../../shaders/water.wgsl?raw';

// Matches WorldGeometryPass camera uniform layout: 4×mat4 + vec3 + near + far + pad×3 = 288 bytes
const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16;
const WATER_UNIFORM_SIZE  = 16;  // time + pad×3
const CHUNK_UNIFORM_SIZE  = 16;  // vec3f offset + f32 pad

const FLOATS_PER_VERT = 2;  // [x, z]
const BYTES_PER_VERT  = FLOATS_PER_VERT * 4;

interface ChunkWaterGpu {
  buffer        : GPUBuffer | null;
  vertexCount   : number;
  uniformBuffer : GPUBuffer;
  chunkBG       : GPUBindGroup;
}

export class WaterPass extends RenderPass {
  readonly name = 'WaterPass';

  private _device          : GPUDevice;
  private _hdrTexture      : GPUTexture;
  private _hdrView         : GPUTextureView;
  private _refractionTex   : GPUTexture;
  private _pipeline        : GPURenderPipeline;
  private _cameraBuffer    : GPUBuffer;
  private _waterBuffer     : GPUBuffer;
  private _cameraBG        : GPUBindGroup;
  private _waterBG         : GPUBindGroup;
  private _sceneBG         : GPUBindGroup;
  private _sceneBGL        : GPUBindGroupLayout;
  private _chunkBGL        : GPUBindGroupLayout;
  private _skyTexture      : Texture;
  private _dudvTexture     : Texture;
  private _gradientTexture : Texture;
  private _chunks          = new Map<Chunk, ChunkWaterGpu>();

  private constructor(
    device          : GPUDevice,
    hdrTexture      : GPUTexture,
    hdrView         : GPUTextureView,
    refractionTex   : GPUTexture,
    pipeline        : GPURenderPipeline,
    cameraBuffer    : GPUBuffer,
    waterBuffer     : GPUBuffer,
    cameraBG        : GPUBindGroup,
    waterBG         : GPUBindGroup,
    sceneBG         : GPUBindGroup,
    sceneBGL        : GPUBindGroupLayout,
    chunkBGL        : GPUBindGroupLayout,
    skyTexture      : Texture,
    dudvTexture     : Texture,
    gradientTexture : Texture,
  ) {
    super();
    this._device          = device;
    this._hdrTexture      = hdrTexture;
    this._hdrView         = hdrView;
    this._refractionTex   = refractionTex;
    this._pipeline        = pipeline;
    this._cameraBuffer    = cameraBuffer;
    this._waterBuffer     = waterBuffer;
    this._cameraBG        = cameraBG;
    this._waterBG         = waterBG;
    this._sceneBG         = sceneBG;
    this._sceneBGL        = sceneBGL;
    this._chunkBGL        = chunkBGL;
    this._skyTexture      = skyTexture;
    this._dudvTexture     = dudvTexture;
    this._gradientTexture = gradientTexture;
  }

  // hdrTexture  — lighting pass output; must have COPY_SRC usage (source for refraction copy)
  // hdrView     — render target for water output
  // depthView   — GBuffer depth (depth32float) for manual depth test in shader
  // skyTexture  — equirectangular HDR sky for reflection
  // dudvTexture — DUDV ripple/distortion map
  // gradientTexture — 1D colour gradient for water depth tinting
  static create(
    ctx             : RenderContext,
    hdrTexture      : GPUTexture,
    hdrView         : GPUTextureView,
    depthView       : GPUTextureView,
    skyTexture      : Texture,
    dudvTexture     : Texture,
    gradientTexture : Texture,
  ): WaterPass {
    const { device, width, height } = ctx;

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
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },           // refraction
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },           // depth
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },           // dudv
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },           // gradient
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },           // sky (equirect)
        { binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const { refractionTex, refractionView } = WaterPass._makeRefractionTex(device, width, height);
    const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear', addressModeU: 'repeat', addressModeV: 'repeat' });

    const cameraBuffer = device.createBuffer({ label: 'WaterCameraBuffer', size: CAMERA_UNIFORM_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const waterBuffer  = device.createBuffer({ label: 'WaterUniformBuffer', size: WATER_UNIFORM_SIZE,  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });

    const cameraBG = device.createBindGroup({ label: 'WaterCameraBG', layout: cameraBGL, entries: [{ binding: 0, resource: { buffer: cameraBuffer } }] });
    const waterBG  = device.createBindGroup({ label: 'WaterUniformBG',  layout: waterBGL,  entries: [{ binding: 0, resource: { buffer: waterBuffer  } }] });

    const sceneBG = WaterPass._makeSceneBG(device, sceneBGL, refractionView, depthView, dudvTexture, gradientTexture, skyTexture, sampler);

    const shader   = device.createShaderModule({ label: 'WaterShader', code: waterWgsl });
    const layout   = device.createPipelineLayout({ bindGroupLayouts: [cameraBGL, waterBGL, chunkBGL, sceneBGL] });

    const vertexLayout: GPUVertexBufferLayout = {
      arrayStride: BYTES_PER_VERT,
      attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }],
    };

    const pipeline = device.createRenderPipeline({
      label   : 'WaterPipeline',
      layout,
      vertex  : { module: shader, entryPoint: 'vs_main', buffers: [vertexLayout] },
      fragment: {
        module: shader, entryPoint: 'fs_main',
        targets: [{
          format: HDR_FORMAT,
          blend: {
            color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
            alpha: { srcFactor: 'one',       dstFactor: 'one-minus-src-alpha', operation: 'add' },
          },
        }],
      },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    return new WaterPass(
      device, hdrTexture, hdrView, refractionTex, pipeline,
      cameraBuffer, waterBuffer, cameraBG, waterBG, sceneBG, sceneBGL, chunkBGL,
      skyTexture, dudvTexture, gradientTexture,
    );
  }

  // Call on resize or sky change: recreates the refraction texture and scene bind group.
  // Pass skyTexture when the sky has changed; omit to keep the existing sky.
  // Per-chunk vertex/uniform data is always preserved.
  updateRenderTargets(hdrTexture: GPUTexture, hdrView: GPUTextureView, depthView: GPUTextureView, skyTexture?: Texture): void {
    this._refractionTex.destroy();
    this._hdrTexture = hdrTexture;
    this._hdrView    = hdrView;
    if (skyTexture) this._skyTexture = skyTexture;
    const { width, height } = hdrTexture;
    const { refractionTex, refractionView } = WaterPass._makeRefractionTex(this._device, width, height);
    this._refractionTex = refractionTex;
    const sampler = this._device.createSampler({ magFilter: 'linear', minFilter: 'linear', addressModeU: 'repeat', addressModeV: 'repeat' });
    this._sceneBG = WaterPass._makeSceneBG(this._device, this._sceneBGL, refractionView, depthView, this._dudvTexture, this._gradientTexture, this._skyTexture, sampler);
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

  updateTime(ctx: RenderContext, time: number, skyIntensity: number = 1.0): void {
    ctx.queue.writeBuffer(this._waterBuffer, 0, new Float32Array([time, skyIntensity, 0, 0]).buffer as ArrayBuffer);
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
    gpu.buffer?.destroy();
    gpu.uniformBuffer.destroy();
    this._chunks.delete(chunk);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    // Copy the lit scene into the refraction texture before water overwrites it.
    const { width, height } = this._refractionTex;
    encoder.copyTextureToTexture(
      { texture: this._hdrTexture },
      { texture: this._refractionTex },
      { width, height, depthOrArrayLayers: 1 },
    );

    const pass = encoder.beginRenderPass({
      label: 'WaterPass',
      colorAttachments: [{ view: this._hdrView, loadOp: 'load', storeOp: 'store' }],
    });

    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._cameraBG);
    pass.setBindGroup(1, this._waterBG);
    pass.setBindGroup(3, this._sceneBG);

    for (const [, gpu] of this._chunks) {
      if (!gpu.buffer || gpu.vertexCount === 0) continue;
      pass.setBindGroup(2, gpu.chunkBG);
      pass.setVertexBuffer(0, gpu.buffer);
      pass.draw(gpu.vertexCount);
    }

    pass.end();
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    this._waterBuffer.destroy();
    this._refractionTex.destroy();
    for (const gpu of this._chunks.values()) {
      gpu.buffer?.destroy();
      gpu.uniformBuffer.destroy();
    }
    this._chunks.clear();
  }

  private static _makeRefractionTex(device: GPUDevice, width: number, height: number): { refractionTex: GPUTexture; refractionView: GPUTextureView } {
    const refractionTex  = device.createTexture({ label: 'WaterRefractionTex', size: { width, height }, format: HDR_FORMAT, usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING });
    const refractionView = refractionTex.createView();
    return { refractionTex, refractionView };
  }

  private static _makeSceneBG(
    device: GPUDevice, layout: GPUBindGroupLayout,
    refractionView: GPUTextureView, depthView: GPUTextureView,
    dudv: Texture, gradient: Texture, sky: Texture, sampler: GPUSampler,
  ): GPUBindGroup {
    return device.createBindGroup({
      label: 'WaterSceneBG', layout,
      entries: [
        { binding: 0, resource: refractionView   },
        { binding: 1, resource: depthView         },
        { binding: 2, resource: dudv.view         },
        { binding: 3, resource: gradient.view     },
        { binding: 4, resource: sky.view          },
        { binding: 5, resource: sampler           },
      ],
    });
  }

  private _createChunkGpu(chunk: Chunk, mesh: ChunkMesh): ChunkWaterGpu {
    const uniformBuffer = this._device.createBuffer({
      label: `WaterChunkBuf(${chunk.globalPosition.x},${chunk.globalPosition.y},${chunk.globalPosition.z})`,
      size: CHUNK_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this._device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([chunk.globalPosition.x, chunk.globalPosition.y, chunk.globalPosition.z, 0]));

    const chunkBG = this._device.createBindGroup({
      label: 'WaterChunkBG', layout: this._chunkBGL,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const gpu: ChunkWaterGpu = { buffer: null, vertexCount: 0, uniformBuffer, chunkBG };
    this._replaceMeshBuffer(gpu, mesh);
    return gpu;
  }

  private _replaceMeshBuffer(gpu: ChunkWaterGpu, mesh: ChunkMesh): void {
    gpu.buffer?.destroy();
    gpu.buffer      = null;
    gpu.vertexCount = mesh.waterCount;
    if (mesh.waterCount > 0) {
      const buf = this._device.createBuffer({
        label: 'WaterVertexBuf',
        size : mesh.waterCount * BYTES_PER_VERT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this._device.queue.writeBuffer(buf, 0, mesh.water.buffer, 0, mesh.waterCount * BYTES_PER_VERT);
      gpu.buffer = buf;
    }
  }
}
