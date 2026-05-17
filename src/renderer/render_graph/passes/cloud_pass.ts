import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import type { CloudNoiseTextures } from '../../../assets/cloud_noise.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import cloudsWgsl from '../../../shaders/clouds.wgsl?raw';

const CLOUD_CAMERA_UNIFORM_SIZE = 96;
const CLOUD_UNIFORM_SIZE = 48;
const CLOUD_LIGHT_UNIFORM_SIZE = 32;

export interface CloudSettings {
  cloudBase: number;
  cloudTop: number;
  coverage: number;
  density: number;
  windOffset: [number, number];
  anisotropy: number;
  extinction: number;
  ambientColor: [number, number, number];
  exposure: number;
}

export const DEFAULT_CLOUD_SETTINGS: CloudSettings = {
  cloudBase: 5,
  cloudTop: 15,
  coverage: 0.55,
  density: 1.0,
  windOffset: [0, 0],
  anisotropy: 0.85,
  extinction: 0.25,
  ambientColor: [0.4, 0.55, 0.7],
  exposure: 0.2,
};

export interface CloudDeps {
  /**
   * Optional HDR target. When omitted the pass creates+clears a fresh HDR
   * texture (typical, since clouds replace the sky).
   */
  hdr?: ResourceHandle;
  /** GBuffer depth for occlusion early-out. */
  depth: ResourceHandle;
}

export interface CloudOutputs {
  hdr: ResourceHandle;
}

/**
 * Volumetric cloud + procedural sky pass (render-graph version).
 */
export class CloudPass extends Pass<CloudDeps, CloudOutputs> {
  readonly name = 'CloudPass';

  private readonly _device: GPUDevice;
  private readonly _pipeline: GPURenderPipeline;
  private readonly _cameraBuffer: GPUBuffer;
  private readonly _cloudBuffer: GPUBuffer;
  private readonly _lightBuffer: GPUBuffer;
  private readonly _sceneBg: GPUBindGroup;
  private readonly _lightBg: GPUBindGroup;
  private readonly _depthBgl: GPUBindGroupLayout;
  private readonly _noiseSkyBg: GPUBindGroup;
  private readonly _depthSampler: GPUSampler;
  private readonly _cameraScratch = new Float32Array(CLOUD_CAMERA_UNIFORM_SIZE / 4);
  private readonly _lightScratch = new Float32Array(CLOUD_LIGHT_UNIFORM_SIZE / 4);
  private readonly _settingsScratch = new Float32Array(CLOUD_UNIFORM_SIZE / 4);

  private constructor(
    device: GPUDevice,
    pipeline: GPURenderPipeline,
    cameraBuffer: GPUBuffer,
    cloudBuffer: GPUBuffer,
    lightBuffer: GPUBuffer,
    sceneBg: GPUBindGroup,
    lightBg: GPUBindGroup,
    depthBgl: GPUBindGroupLayout,
    noiseSkyBg: GPUBindGroup,
    depthSampler: GPUSampler,
  ) {
    super();
    this._device = device;
    this._pipeline = pipeline;
    this._cameraBuffer = cameraBuffer;
    this._cloudBuffer = cloudBuffer;
    this._lightBuffer = lightBuffer;
    this._sceneBg = sceneBg;
    this._lightBg = lightBg;
    this._depthBgl = depthBgl;
    this._noiseSkyBg = noiseSkyBg;
    this._depthSampler = depthSampler;
  }

  static create(ctx: RenderContext, noises: CloudNoiseTextures): CloudPass {
    const { device } = ctx;

    const cameraBuffer = device.createBuffer({
      label: 'CloudCameraBuffer', size: CLOUD_CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const cloudBuffer = device.createBuffer({
      label: 'CloudUniformBuffer', size: CLOUD_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const lightBuffer = device.createBuffer({
      label: 'CloudLightBuffer', size: CLOUD_LIGHT_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const sceneBgl = device.createBindGroupLayout({
      label: 'CloudSceneBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });
    const lightBgl = device.createBindGroupLayout({
      label: 'CloudLightBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const depthBgl = device.createBindGroupLayout({
      label: 'CloudDepthBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });
    const noiseSkyBgl = device.createBindGroupLayout({
      label: 'CloudNoiseSkyBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '3d' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '3d' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const noiseSampler = device.createSampler({
      label: 'CloudNoiseSampler',
      magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
      addressModeU: 'mirror-repeat', addressModeV: 'mirror-repeat', addressModeW: 'mirror-repeat',
    });
    const depthSampler = device.createSampler({ label: 'CloudDepthSampler' });

    const sceneBg = device.createBindGroup({
      label: 'CloudSceneBG', layout: sceneBgl,
      entries: [
        { binding: 0, resource: { buffer: cameraBuffer } },
        { binding: 1, resource: { buffer: cloudBuffer } },
      ],
    });
    const lightBg = device.createBindGroup({
      label: 'CloudLightBG', layout: lightBgl,
      entries: [{ binding: 0, resource: { buffer: lightBuffer } }],
    });
    const noiseSkyBg = device.createBindGroup({
      label: 'CloudNoiseSkyBG', layout: noiseSkyBgl,
      entries: [
        { binding: 0, resource: noises.baseView },
        { binding: 1, resource: noises.detailView },
        { binding: 2, resource: noiseSampler },
      ],
    });

    const shader = ctx.createShaderModule(cloudsWgsl, 'CloudShader');
    const pipeline = device.createRenderPipeline({
      label: 'CloudPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [sceneBgl, lightBgl, depthBgl, noiseSkyBgl] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new CloudPass(device, pipeline, cameraBuffer, cloudBuffer, lightBuffer,
      sceneBg, lightBg, depthBgl, noiseSkyBg, depthSampler);
  }

  updateCamera(ctx: RenderContext): void {
    const camera = ctx.activeCamera;
    if (!camera) {
      throw new Error('CloudPass.updateCamera: ctx.activeCamera is null');
    }
    const camPos = camera.position();
    const data = this._cameraScratch;
    data.set(camera.inverseViewProjectionMatrix().data, 0);
    data[16] = camPos.x; data[17] = camPos.y; data[18] = camPos.z;
    data[19] = camera.near;
    data[20] = camera.far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
  }

  updateLight(
    ctx: RenderContext,
    dir: { x: number; y: number; z: number },
    color: { x: number; y: number; z: number },
    intensity: number,
  ): void {
    const data = this._lightScratch;
    data[0] = dir.x; data[1] = dir.y; data[2] = dir.z; data[3] = intensity;
    data[4] = color.x; data[5] = color.y; data[6] = color.z;
    ctx.queue.writeBuffer(this._lightBuffer, 0, data.buffer as ArrayBuffer);
  }

  updateSettings(ctx: RenderContext, s: CloudSettings): void {
    const data = this._settingsScratch;
    data[0] = s.cloudBase;
    data[1] = s.cloudTop;
    data[2] = s.coverage;
    data[3] = s.density;
    data[4] = s.windOffset[0];
    data[5] = s.windOffset[1];
    data[6] = s.anisotropy;
    data[7] = s.extinction;
    data[8] = s.ambientColor[0];
    data[9] = s.ambientColor[1];
    data[10] = s.ambientColor[2];
    data[11] = s.exposure;
    ctx.queue.writeBuffer(this._cloudBuffer, 0, data.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: CloudDeps): CloudOutputs {
    const { ctx } = graph;
    const hasInput = !!deps.hdr;
    let target: ResourceHandle = deps.hdr ?? (undefined as unknown as ResourceHandle);
    let hdr!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      if (!hasInput) {
        target = b.createTexture({
          label: 'cloud.hdr',
          format: HDR_FORMAT,
          width: ctx.width,
          height: ctx.height,
          extraUsage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
        });
      }
      hdr = b.write(target, 'attachment', {
        loadOp: hasInput ? 'load' : 'clear',
        storeOp: 'store',
        clearValue: [0, 0, 0, 1],
      });
      b.read(deps.depth, 'sampled');

      b.setExecute((pctx, res) => {
        const depthBg = this._device.createBindGroup({
          label: 'CloudDepthBG', layout: this._depthBgl,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.depth) },
            { binding: 1, resource: this._depthSampler },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._sceneBg);
        enc.setBindGroup(1, this._lightBg);
        enc.setBindGroup(2, depthBg);
        enc.setBindGroup(3, this._noiseSkyBg);
        enc.draw(3);
      });
    });

    return { hdr };
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    this._cloudBuffer.destroy();
    this._lightBuffer.destroy();
  }
}
