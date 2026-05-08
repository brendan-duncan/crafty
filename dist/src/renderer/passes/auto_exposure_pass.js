import { RenderPass } from '../render_pass.js';
import autoExposureWgsl from '../../shaders/auto_exposure.wgsl?raw';
const NUM_BINS = 64;
const PARAMS_SIZE = 32; // AutoExposureParams: 8 × f32
const EXPOSURE_SIZE = 16; // ExposureBuffer: 4 × f32
const HISTOGRAM_SIZE = NUM_BINS * 4; // 64 × u32
/**
 * Sensible default auto-exposure settings (mid-speed adaptation, 0.1×–10× range).
 */
export const DEFAULT_AUTO_EXPOSURE = {
    adaptSpeed: 1.5,
    minExposure: 0.1,
    maxExposure: 10.0,
    lowPct: 0.05,
    highPct: 0.02,
};
export class AutoExposurePass extends RenderPass {
    name = 'AutoExposurePass';
    // Shared with TonemapPass — contains the current linear exposure multiplier.
    exposureBuffer;
    _histogramPipeline;
    _adaptPipeline;
    _bindGroup;
    _paramsBuffer;
    _histogramBuffer;
    _hdrWidth;
    _hdrHeight;
    constructor(histogramPipeline, adaptPipeline, bindGroup, paramsBuffer, histogramBuffer, exposureBuffer, hdrWidth, hdrHeight) {
        super();
        this._histogramPipeline = histogramPipeline;
        this._adaptPipeline = adaptPipeline;
        this._bindGroup = bindGroup;
        this._paramsBuffer = paramsBuffer;
        this._histogramBuffer = histogramBuffer;
        this.exposureBuffer = exposureBuffer;
        this._hdrWidth = hdrWidth;
        this._hdrHeight = hdrHeight;
    }
    static create(ctx, hdrTexture, settings = DEFAULT_AUTO_EXPOSURE) {
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
                { binding: 2, resource: { buffer: exposureBuffer } },
                { binding: 3, resource: { buffer: paramsBuffer } },
            ],
        });
        const layout = device.createPipelineLayout({ bindGroupLayouts: [bgl] });
        const module = device.createShaderModule({ label: 'AutoExposure', code: autoExposureWgsl });
        const histogramPipeline = device.createComputePipeline({
            label: 'AutoExposureHistogramPipeline', layout,
            compute: { module, entryPoint: 'cs_histogram' },
        });
        const adaptPipeline = device.createComputePipeline({
            label: 'AutoExposureAdaptPipeline', layout,
            compute: { module, entryPoint: 'cs_adapt' },
        });
        return new AutoExposurePass(histogramPipeline, adaptPipeline, bindGroup, paramsBuffer, histogramBuffer, exposureBuffer, hdrTexture.width, hdrTexture.height);
    }
    enabled = true;
    update(ctx, dt, settings = DEFAULT_AUTO_EXPOSURE) {
        if (!this.enabled) {
            ctx.device.queue.writeBuffer(this.exposureBuffer, 0, new Float32Array([1.0, 0, 0, 0]));
            return;
        }
        AutoExposurePass._writeParams(ctx.device, this._paramsBuffer, dt, settings);
    }
    execute(encoder, _ctx) {
        if (!this.enabled) {
            return;
        }
        const pass = encoder.beginComputePass({ label: 'AutoExposurePass' });
        // Build luminance histogram from the HDR scene (sampling every 4th pixel).
        pass.setPipeline(this._histogramPipeline);
        pass.setBindGroup(0, this._bindGroup);
        pass.dispatchWorkgroups(Math.ceil(this._hdrWidth / 32), Math.ceil(this._hdrHeight / 32));
        // Reduce histogram → compute target exposure → temporally smooth.
        pass.setPipeline(this._adaptPipeline);
        pass.dispatchWorkgroups(1);
        pass.end();
    }
    destroy() {
        this._paramsBuffer.destroy();
        this._histogramBuffer.destroy();
        this.exposureBuffer.destroy();
    }
    static _writeParams(device, buf, dt, s) {
        device.queue.writeBuffer(buf, 0, new Float32Array([
            dt, s.adaptSpeed, s.minExposure, s.maxExposure, s.lowPct, s.highPct, 0, 0,
        ]));
    }
}
