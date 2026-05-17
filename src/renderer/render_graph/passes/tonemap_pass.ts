import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import tonemapWgsl from '../../../shaders/tonemap.wgsl?raw';

// TonemapParams uniform layout (16 bytes):
//  [0] exposure  f32
//  [1] flags     u32  (bit 0: enable ACES, bit 1: skip gamma for HDR canvas)
//  [2] _pad0     f32
//  [3] _pad1     f32
const PARAMS_SIZE = 16;

export interface TonemapDeps {
  hdr: ResourceHandle;
  backbuffer: ResourceHandle;
}

/**
 * Final HDR-to-SDR tone-mapping pass (render-graph version).
 *
 * Samples an HDR input, applies an exposure multiplier and an optional ACES
 * filmic curve, then writes the result to the supplied backbuffer attachment.
 * The HDR input handle is supplied each frame via {@link addToGraph}; the
 * pass owns the pipeline, sampler, and params uniform buffer.
 */
export class TonemapPass extends Pass<TonemapDeps, void> {
  readonly name = 'TonemapPass';

  private readonly _pipeline: GPURenderPipeline;
  private readonly _hdrBgl: GPUBindGroupLayout;
  private readonly _paramsBg: GPUBindGroup;
  private readonly _paramsBuf: GPUBuffer;
  private readonly _sampler: GPUSampler;
  private readonly _paramsAB = new ArrayBuffer(PARAMS_SIZE);
  private readonly _paramsF = new Float32Array(this._paramsAB);
  private readonly _paramsU = new Uint32Array(this._paramsAB);

  private constructor(
    pipeline: GPURenderPipeline,
    hdrBgl: GPUBindGroupLayout,
    paramsBg: GPUBindGroup,
    paramsBuf: GPUBuffer,
    sampler: GPUSampler,
  ) {
    super();
    this._pipeline = pipeline;
    this._hdrBgl = hdrBgl;
    this._paramsBg = paramsBg;
    this._paramsBuf = paramsBuf;
    this._sampler = sampler;
  }

  /**
   * @param ctx Render context.
   * @param outputFormat Format of the backbuffer attachment the tonemap will
   *   write to. Defaults to `ctx.format` (canvas swapchain format).
   */
  static create(ctx: RenderContext, outputFormat?: GPUTextureFormat): TonemapPass {
    const { device, format } = ctx;
    const finalFormat = outputFormat ?? format;

    const hdrBgl = device.createBindGroupLayout({
      label: 'TonemapBGL0',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const paramsBgl = device.createBindGroupLayout({
      label: 'TonemapBGL1',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });

    const sampler = device.createSampler({
      label: 'TonemapSampler', magFilter: 'linear', minFilter: 'linear',
    });

    const paramsBuf = device.createBuffer({
      label: 'TonemapParams',
      size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const paramsBg = device.createBindGroup({
      label: 'TonemapBG1',
      layout: paramsBgl,
      entries: [{ binding: 0, resource: { buffer: paramsBuf } }],
    });

    const shader = ctx.createShaderModule(tonemapWgsl, 'TonemapShader');

    const pipeline = device.createRenderPipeline({
      label: 'TonemapPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [hdrBgl, paramsBgl] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: finalFormat }] },
      primitive: { topology: 'triangle-list' },
    });

    return new TonemapPass(pipeline, hdrBgl, paramsBg, paramsBuf, sampler);
  }

  addToGraph(graph: RenderGraph, deps: TonemapDeps): void {
    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      b.read(deps.hdr, 'sampled');
      b.write(deps.backbuffer, 'attachment', {
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: [0, 0, 0, 1],
      });
      b.setExecute((pctx, res) => {
        const hdrBg = res.getOrCreateBindGroup({
          label: 'TonemapBG0',
          layout: this._hdrBgl,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.hdr) },
            { binding: 1, resource: this._sampler },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, hdrBg);
        enc.setBindGroup(1, this._paramsBg);
        enc.draw(3);
      });
    });
  }

  /**
   * @param ctx Render context whose queue receives the buffer write.
   * @param exposure Linear exposure multiplier applied before the curve.
   * @param useAces Enable ACES filmic curve.
   * @param hdrCanvas Skip the gamma encode (for HDR swapchains).
   */
  updateParams(ctx: RenderContext, exposure: number, useAces: boolean, hdrCanvas: boolean): void {
    let flags = 0;
    if (useAces) flags |= 1;
    if (hdrCanvas) flags |= 2;
    this._paramsF[0] = exposure;
    this._paramsU[1] = flags;
    this._paramsF[2] = 0;
    this._paramsF[3] = 0;
    ctx.queue.writeBuffer(this._paramsBuf, 0, this._paramsAB);
  }

  destroy(): void {
    this._paramsBuf.destroy();
  }
}
