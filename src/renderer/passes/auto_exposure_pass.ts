import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import autoExposureWgsl from '../../shaders/auto_exposure.wgsl?raw';

const NUM_BINS       = 64;
const PARAMS_SIZE    = 32;   // AutoExposureParams: 8 × f32
const EXPOSURE_SIZE  = 16;   // ExposureBuffer: 4 × f32
const HISTOGRAM_SIZE = NUM_BINS * 4;   // 64 × u32

/**
 * Tunable parameters for the auto-exposure adaptation algorithm.
 */
export interface AutoExposureSettings {
  adaptSpeed  : number;   // EV/second rate constant (default 1.5)
  minExposure : number;   // minimum linear multiplier   (default 0.1)
  maxExposure : number;   // maximum linear multiplier   (default 10)
  lowPct      : number;   // darkest fraction to skip   (default 0.05)
  highPct     : number;   // brightest fraction to skip (default 0.02)
}

/**
 * Sensible default auto-exposure settings (mid-speed adaptation, 0.1×–10× range).
 */
export const DEFAULT_AUTO_EXPOSURE: AutoExposureSettings = {
  adaptSpeed:  1.5,
  minExposure: 0.1,
  maxExposure: 10.0,
  lowPct:      0.05,
  highPct:     0.02,
};

export class AutoExposurePass extends RenderPass {
  readonly name = 'AutoExposurePass';

  // Shared with TonemapPass — contains the current linear exposure multiplier.
  readonly exposureBuffer: GPUBuffer;

  private readonly _histogramPipeline : GPUComputePipeline;
  private readonly _adaptPipeline     : GPUComputePipeline;
  private readonly _bindGroup         : GPUBindGroup;
  private readonly _paramsBuffer      : GPUBuffer;
  private readonly _histogramBuffer   : GPUBuffer;
  private readonly _hdrWidth          : number;
  private readonly _hdrHeight         : number;

  private constructor(
    histogramPipeline: GPUComputePipeline,
    adaptPipeline: GPUComputePipeline,
    bindGroup: GPUBindGroup,
    paramsBuffer: GPUBuffer,
    histogramBuffer: GPUBuffer,
    exposureBuffer: GPUBuffer,
    hdrWidth: number,
    hdrHeight: number,
  ) {
    super();
    this._histogramPipeline = histogramPipeline;
    this._adaptPipeline     = adaptPipeline;
    this._bindGroup         = bindGroup;
    this._paramsBuffer      = paramsBuffer;
    this._histogramBuffer   = histogramBuffer;
    this.exposureBuffer     = exposureBuffer;
    this._hdrWidth          = hdrWidth;
    this._hdrHeight         = hdrHeight;
  }

  static create(
    ctx        : RenderContext,
    hdrTexture : GPUTexture,
    settings   : AutoExposureSettings = DEFAULT_AUTO_EXPOSURE,
  ): AutoExposurePass {
    const { device } = ctx;

    const bgl = device.createBindGroupLayout({
      label: 'AutoExposureBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer:  { type: 'storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer:  { type: 'storage' } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer:  { type: 'uniform' } },
      ],
    });

    const histogramBuffer = device.createBuffer({
      label: 'AutoExposureHistogram',
      size: HISTOGRAM_SIZE,
      usage: GPUBufferUsage.STORAGE,
    });

    const exposureBuffer = device.createBuffer({
      label: 'AutoExposureValue',
      size: EXPOSURE_SIZE,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    // Initialise to neutral exposure (1.0).
    device.queue.writeBuffer(exposureBuffer, 0, new Float32Array([1.0, 0, 0, 0]));

    const paramsBuffer = device.createBuffer({
      label: 'AutoExposureParams',
      size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    AutoExposurePass._writeParams(device, paramsBuffer, 0, settings);

    const bindGroup = device.createBindGroup({
      label: 'AutoExposureBG',
      layout: bgl,
      entries: [
        { binding: 0, resource: hdrTexture.createView() },
        { binding: 1, resource: { buffer: histogramBuffer } },
        { binding: 2, resource: { buffer: exposureBuffer  } },
        { binding: 3, resource: { buffer: paramsBuffer    } },
      ],
    });

    const layout = device.createPipelineLayout({ bindGroupLayouts: [bgl] });
    const module = ctx.createShaderModule(autoExposureWgsl, 'AutoExposure');

    const histogramPipeline = device.createComputePipeline({
      label: 'AutoExposureHistogramPipeline', layout,
      compute: { module, entryPoint: 'cs_histogram' },
    });
    const adaptPipeline = device.createComputePipeline({
      label: 'AutoExposureAdaptPipeline', layout,
      compute: { module, entryPoint: 'cs_adapt' },
    });

    return new AutoExposurePass(
      histogramPipeline, adaptPipeline,
      bindGroup, paramsBuffer, histogramBuffer, exposureBuffer,
      hdrTexture.width, hdrTexture.height,
    );
  }

  enabled = true;
  private readonly _resetScratch = new Float32Array([1.0, 0, 0, 0]);

  update(ctx: RenderContext, settings: AutoExposureSettings = DEFAULT_AUTO_EXPOSURE): void {
    if (!this.enabled) {
      ctx.device.queue.writeBuffer(this.exposureBuffer, 0, this._resetScratch);
      return;
    }
    AutoExposurePass._writeParams(ctx.device, this._paramsBuffer, ctx.deltaTime, settings);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    if (!this.enabled) {
      return;
    }
    const pass = encoder.beginComputePass({ label: 'AutoExposurePass' });

    // Build luminance histogram from the HDR scene (sampling every 4th pixel).
    pass.setPipeline(this._histogramPipeline);
    pass.setBindGroup(0, this._bindGroup);
    pass.dispatchWorkgroups(
      Math.ceil(this._hdrWidth  / 32),
      Math.ceil(this._hdrHeight / 32),
    );

    // Reduce histogram → compute target exposure → temporally smooth.
    pass.setPipeline(this._adaptPipeline);
    pass.dispatchWorkgroups(1);

    pass.end();
  }

  destroy(): void {
    this._paramsBuffer.destroy();
    this._histogramBuffer.destroy();
    this.exposureBuffer.destroy();
  }

  private static _paramsScratch = new Float32Array(8);

  private static _writeParams(
    device  : GPUDevice,
    buf     : GPUBuffer,
    dt      : number,
    s       : AutoExposureSettings,
  ): void {
    const d = AutoExposurePass._paramsScratch;
    d[0] = dt;
    d[1] = s.adaptSpeed;
    d[2] = s.minExposure;
    d[3] = s.maxExposure;
    d[4] = s.lowPct;
    d[5] = s.highPct;
    d[6] = 0;
    d[7] = 0;
    device.queue.writeBuffer(buf, 0, d);
  }
}
