import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, BufferDesc } from '../index.js';
import autoExposureWgsl from '../../../shaders/auto_exposure.wgsl?raw';

const NUM_BINS = 64;
const PARAMS_SIZE = 32;
const EXPOSURE_SIZE = 16;
const HISTOGRAM_SIZE = NUM_BINS * 4;

export interface AutoExposureSettings {
  adaptSpeed: number;
  minExposure: number;
  maxExposure: number;
  lowPct: number;
  highPct: number;
}

export const DEFAULT_AUTO_EXPOSURE: AutoExposureSettings = {
  adaptSpeed: 1.5,
  minExposure: 0.1,
  maxExposure: 10.0,
  lowPct: 0.05,
  highPct: 0.02,
};

export const EXPOSURE_BUFFER_KEY = 'lighting:exposure';
export const EXPOSURE_BUFFER_DESC: BufferDesc = {
  label: 'AutoExposureValue',
  size: EXPOSURE_SIZE,
  extraUsage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
};

export interface AutoExposureDeps {
  /** HDR scene texture sampled to build the luminance histogram. */
  hdr: ResourceHandle;
}

export interface AutoExposureOutputs {
  /** Persistent storage buffer holding the smoothed exposure value. */
  exposureBuffer: ResourceHandle;
}

/**
 * Auto-exposure compute pass (render-graph version).
 *
 * Two compute dispatches per frame: build a 64-bin luminance histogram of the
 * HDR scene, then reduce + temporally smooth into a 1-float exposure value.
 * The exposure buffer is persistent so downstream passes (composite) can read
 * it via a stable handle.
 */
export class AutoExposurePass extends Pass<AutoExposureDeps, AutoExposureOutputs> {
  readonly name = 'AutoExposurePass';

  enabled = true;

  private readonly _device: GPUDevice;
  private readonly _bgl: GPUBindGroupLayout;
  private readonly _histogramPipeline: GPUComputePipeline;
  private readonly _adaptPipeline: GPUComputePipeline;
  private readonly _paramsBuffer: GPUBuffer;
  private readonly _histogramBuffer: GPUBuffer;
  private _settings: AutoExposureSettings = DEFAULT_AUTO_EXPOSURE;
  private _dt = 0;

  // Cached reference to the resolved persistent exposure buffer.
  private _exposureBufferRef: GPUBuffer | null = null;
  // Whether the exposure buffer has been initialized to a sane value.
  private _initialized = false;

  private readonly _resetScratch = new Float32Array([1.0, 0, 0, 0]);
  private static _paramsScratch = new Float32Array(8);

  private constructor(
    device: GPUDevice,
    bgl: GPUBindGroupLayout,
    histogramPipeline: GPUComputePipeline,
    adaptPipeline: GPUComputePipeline,
    paramsBuffer: GPUBuffer,
    histogramBuffer: GPUBuffer,
  ) {
    super();
    this._device = device;
    this._bgl = bgl;
    this._histogramPipeline = histogramPipeline;
    this._adaptPipeline = adaptPipeline;
    this._paramsBuffer = paramsBuffer;
    this._histogramBuffer = histogramBuffer;
  }

  static create(ctx: RenderContext, settings: AutoExposureSettings = DEFAULT_AUTO_EXPOSURE): AutoExposurePass {
    const { device } = ctx;

    const bgl = device.createBindGroupLayout({
      label: 'AutoExposureBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      ],
    });

    const histogramBuffer = device.createBuffer({
      label: 'AutoExposureHistogram',
      size: HISTOGRAM_SIZE,
      usage: GPUBufferUsage.STORAGE,
    });

    const paramsBuffer = device.createBuffer({
      label: 'AutoExposureParams',
      size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    AutoExposurePass._writeParams(device, paramsBuffer, 0, settings);

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
      device, bgl, histogramPipeline, adaptPipeline,
      paramsBuffer, histogramBuffer,
    );
  }

  /** Update auto-exposure settings and the per-frame delta time. */
  update(_ctx: RenderContext, dt: number, settings: AutoExposureSettings = DEFAULT_AUTO_EXPOSURE): void {
    this._dt = dt;
    this._settings = settings;
    AutoExposurePass._writeParams(this._device, this._paramsBuffer, dt, settings);
  }

  addToGraph(graph: RenderGraph, deps: AutoExposureDeps): AutoExposureOutputs {
    const exposureBuffer = graph.importPersistentBuffer(EXPOSURE_BUFFER_KEY, EXPOSURE_BUFFER_DESC);
    let outBuffer!: ResourceHandle;

    if (!this.enabled) {
      // Pass disabled: keep the exposure buffer at neutral 1.0 and skip the dispatch.
      graph.addPass(this.name + '.disabled', 'transfer', (b: PassBuilder) => {
        outBuffer = b.write(exposureBuffer, 'copy-dst');
        b.setExecute((_pctx, res) => {
          this._device.queue.writeBuffer(res.getBuffer(exposureBuffer), 0, this._resetScratch);
        });
      });
      this._initialized = true;
      return { exposureBuffer: outBuffer };
    }

    graph.addPass(this.name, 'compute', (b: PassBuilder) => {
      b.read(deps.hdr, 'sampled');
      outBuffer = b.write(exposureBuffer, 'storage-read-write');

      b.setExecute((pctx, res) => {
        const expBuf = res.getBuffer(exposureBuffer);
        if (this._exposureBufferRef !== expBuf) {
          this._exposureBufferRef = expBuf;
          this._initialized = false;
        }
        if (!this._initialized) {
          this._device.queue.writeBuffer(expBuf, 0, this._resetScratch);
          this._initialized = true;
        }

        const hdrTex = res.getTexture(deps.hdr);
        const bg = this._device.createBindGroup({
          label: 'AutoExposureBG',
          layout: this._bgl,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.hdr) },
            { binding: 1, resource: { buffer: this._histogramBuffer } },
            { binding: 2, resource: { buffer: expBuf } },
            { binding: 3, resource: { buffer: this._paramsBuffer } },
          ],
        });

        // Refresh params (caller may have skipped update()).
        AutoExposurePass._writeParams(this._device, this._paramsBuffer, this._dt, this._settings);

        const enc = pctx.computePassEncoder!;
        enc.setBindGroup(0, bg);

        enc.setPipeline(this._histogramPipeline);
        enc.dispatchWorkgroups(
          Math.ceil(hdrTex.width / 32),
          Math.ceil(hdrTex.height / 32),
        );

        enc.setPipeline(this._adaptPipeline);
        enc.dispatchWorkgroups(1);
      });
    });

    return { exposureBuffer: outBuffer };
  }

  destroy(): void {
    this._paramsBuffer.destroy();
    this._histogramBuffer.destroy();
  }

  private static _writeParams(
    device: GPUDevice, buf: GPUBuffer, dt: number, s: AutoExposureSettings,
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
