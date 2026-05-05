import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { CloudNoiseTextures } from '../../assets/cloud_noise.js';
import cloudShadowWgsl from '../../shaders/cloud_shadow.wgsl?raw';

const SHADOW_SIZE = 1024;
const SHADOW_FORMAT: GPUTextureFormat = 'r8unorm';

// 12 floats × 4 bytes = 48 bytes
// Layout mirrors CloudShadowUniforms in cloud_shadow.wgsl
const UNIFORM_SIZE = 48;

export interface CloudShadowSettings {
  cloudBase: number;
  cloudTop: number;
  coverage: number;
  density: number;
  windOffset: [number, number];
  extinction: number;
}

export class CloudShadowPass extends RenderPass {
  readonly name = 'CloudShadowPass';

  readonly shadowTexture: GPUTexture;
  readonly shadowView: GPUTextureView;

  private _pipeline: GPURenderPipeline;
  private _uniformBuffer: GPUBuffer;
  private _uniformBG: GPUBindGroup;
  private _noiseBG: GPUBindGroup;
  private _frameCount = 0;

  private constructor(
    shadowTexture: GPUTexture,
    shadowView: GPUTextureView,
    pipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    uniformBG: GPUBindGroup,
    noiseBG: GPUBindGroup,
  ) {
    super();
    this.shadowTexture = shadowTexture;
    this.shadowView = shadowView;
    this._pipeline = pipeline;
    this._uniformBuffer = uniformBuffer;
    this._uniformBG = uniformBG;
    this._noiseBG = noiseBG;
  }

  static create(ctx: RenderContext, noises: CloudNoiseTextures): CloudShadowPass {
    const { device } = ctx;

    const shadowTexture = device.createTexture({
      label: 'CloudShadowTexture',
      size: { width: SHADOW_SIZE, height: SHADOW_SIZE },
      format: SHADOW_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    const shadowView = shadowTexture.createView();

    const uniformBuffer = device.createBuffer({
      label: 'CloudShadowUniform',
      size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uniformBGL = device.createBindGroupLayout({
      label: 'CloudShadowUniformBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    const noiseSampler = device.createSampler({
      label: 'CloudNoiseSampler',
      magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
      addressModeU: 'repeat', addressModeV: 'repeat', addressModeW: 'repeat',
    });

    const noiseBGL = device.createBindGroupLayout({
      label: 'CloudShadowNoiseBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '3d' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '3d' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const uniformBG = device.createBindGroup({
      label: 'CloudShadowUniformBG', layout: uniformBGL,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const noiseBG = device.createBindGroup({
      label: 'CloudShadowNoiseBG', layout: noiseBGL,
      entries: [
        { binding: 0, resource: noises.baseView },
        { binding: 1, resource: noises.detailView },
        { binding: 2, resource: noiseSampler },
      ],
    });

    const shader = device.createShaderModule({ label: 'CloudShadowShader', code: cloudShadowWgsl });
    const pipeline = device.createRenderPipeline({
      label: 'CloudShadowPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBGL, noiseBGL] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: {
        module: shader, entryPoint: 'fs_main',
        targets: [{ format: SHADOW_FORMAT }],
      },
      primitive: { topology: 'triangle-list' },
    });

    return new CloudShadowPass(shadowTexture, shadowView, pipeline, uniformBuffer, uniformBG, noiseBG);
  }

  update(
    ctx: RenderContext,
    settings: CloudShadowSettings,
    worldOrigin: [number, number],
    worldExtent: number,
  ): void {
    const data = new Float32Array(UNIFORM_SIZE / 4);
    data[0]  = settings.cloudBase;
    data[1]  = settings.cloudTop;
    data[2]  = settings.coverage;
    data[3]  = settings.density;
    data[4]  = settings.windOffset[0];
    data[5]  = settings.windOffset[1];
    data[6]  = worldOrigin[0];
    data[7]  = worldOrigin[1];
    data[8]  = worldExtent;
    data[9]  = settings.extinction;
    // data[10] and data[11] = 0 (padding)
    ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    // Update shadow map every other frame — clouds animate slowly so the
    // previous frame's map is visually indistinguishable on the skipped frame.
    if (this._frameCount++ % 2 !== 0) {
      return;
    }
    const pass = encoder.beginRenderPass({
      label: 'CloudShadowPass',
      colorAttachments: [{
        view: this.shadowView,
        clearValue: [1, 0, 0, 1],
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._uniformBG);
    pass.setBindGroup(1, this._noiseBG);
    pass.draw(3);
    pass.end();
  }

  destroy(): void {
    this.shadowTexture.destroy();
    this._uniformBuffer.destroy();
  }
}
