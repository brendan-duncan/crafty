import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import type { CloudNoiseTextures } from '../../../assets/cloud_noise.js';
import type { CloudSettings } from './cloud_pass.js';
import cloudShadowWgsl from '../../../shaders/cloud_shadow.wgsl?raw';

const SHADOW_SIZE = 1024;
const SHADOW_FORMAT: GPUTextureFormat = 'r8unorm';
const UNIFORM_SIZE = 48;

export const CLOUD_SHADOW_KEY = 'cloud:shadow';
const CLOUD_SHADOW_DESC: TextureDesc = {
  label: 'CloudShadowTexture',
  format: SHADOW_FORMAT,
  width: SHADOW_SIZE,
  height: SHADOW_SIZE,
};

export interface CloudShadowOutputs {
  shadow: ResourceHandle;
}

/**
 * Renders a top-down cloud shadow map (render-graph version).
 *
 * Outputs a persistent r8unorm transmittance texture sampled by the lighting
 * pass to attenuate sun light. Re-rendered every other frame since clouds
 * animate slowly.
 */
export class CloudShadowPass extends Pass<undefined, CloudShadowOutputs> {
  readonly name = 'CloudShadowPass';

  private readonly _pipeline: GPURenderPipeline;
  private readonly _uniformBuffer: GPUBuffer;
  private readonly _uniformBg: GPUBindGroup;
  private readonly _noiseBg: GPUBindGroup;
  private _frameCount = 0;
  private readonly _data = new Float32Array(UNIFORM_SIZE / 4);

  private constructor(
    pipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    uniformBg: GPUBindGroup,
    noiseBg: GPUBindGroup,
  ) {
    super();
    this._pipeline = pipeline;
    this._uniformBuffer = uniformBuffer;
    this._uniformBg = uniformBg;
    this._noiseBg = noiseBg;
  }

  static create(ctx: RenderContext, noises: CloudNoiseTextures): CloudShadowPass {
    const { device } = ctx;

    const uniformBuffer = device.createBuffer({
      label: 'CloudShadowUniform', size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uniformBgl = device.createBindGroupLayout({
      label: 'CloudShadowUniformBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const noiseBgl = device.createBindGroupLayout({
      label: 'CloudShadowNoiseBGL',
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

    const uniformBg = device.createBindGroup({
      label: 'CloudShadowUniformBG', layout: uniformBgl,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });
    const noiseBg = device.createBindGroup({
      label: 'CloudShadowNoiseBG', layout: noiseBgl,
      entries: [
        { binding: 0, resource: noises.baseView },
        { binding: 1, resource: noises.detailView },
        { binding: 2, resource: noiseSampler },
      ],
    });

    const shader = ctx.createShaderModule(cloudShadowWgsl, 'CloudShadowShader');
    const pipeline = device.createRenderPipeline({
      label: 'CloudShadowPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBgl, noiseBgl] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: SHADOW_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new CloudShadowPass(pipeline, uniformBuffer, uniformBg, noiseBg);
  }

  /** Upload per-frame cloud + shadow projection params. */
  update(
    ctx: RenderContext,
    settings: CloudSettings,
    worldOrigin: [number, number],
    worldExtent: number,
  ): void {
    this._data[0] = settings.cloudBase;
    this._data[1] = settings.cloudTop;
    this._data[2] = settings.coverage;
    this._data[3] = settings.density;
    this._data[4] = settings.windOffset[0];
    this._data[5] = settings.windOffset[1];
    this._data[6] = worldOrigin[0];
    this._data[7] = worldOrigin[1];
    this._data[8] = worldExtent;
    this._data[9] = settings.extinction;
    ctx.queue.writeBuffer(this._uniformBuffer, 0, this._data.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph): CloudShadowOutputs {
    const shadow = graph.importPersistentTexture(CLOUD_SHADOW_KEY, CLOUD_SHADOW_DESC);
    let outShadow!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      // Always declare a write each frame so the persistent texture survives
      // and downstream consumers can declare a read on the latest version.
      // The shader skips the actual draw on alternate frames (clouds animate
      // slowly enough that the previous frame's output is reused).
      outShadow = b.write(shadow, 'attachment', {
        loadOp: 'load', storeOp: 'store',
      });
      b.setExecute((pctx) => {
        if (this._frameCount++ % 2 !== 0) return;
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._uniformBg);
        enc.setBindGroup(1, this._noiseBg);
        enc.draw(3);
      });
    });

    return { shadow: outShadow };
  }

  destroy(): void {
    this._uniformBuffer.destroy();
  }
}
