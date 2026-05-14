import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import tonemapWgsl from '../../shaders/tonemap.wgsl?raw';

// TonemapParams uniform layout (16 bytes):
//  [0] exposure  f32
//  [1] flags     u32  (bit 0: enable ACES, bit 1: skip gamma for HDR canvas)
//  [2] _pad0     f32
//  [3] _pad1     f32
const PARAMS_SIZE = 16;

/**
 * Final HDR-to-SDR tone-mapping pass. Samples an HDR input, applies an
 * exposure multiplier and an optional ACES filmic curve, then writes the
 * result to the swapchain (or a caller-specified output format).
 *
 * Inputs sampled: HDR color view supplied at construction time.
 * Output: the current swapchain texture acquired through `ctx.getCurrentTexture()`.
 */
export class TonemapPass extends RenderPass {
  readonly name = 'TonemapPass';

  private _pipeline: GPURenderPipeline;
  private _bg0: GPUBindGroup;
  private _bg1: GPUBindGroup;
  private _paramsBuf: GPUBuffer;
  private readonly _paramsAB = new ArrayBuffer(PARAMS_SIZE);
  private readonly _paramsF  = new Float32Array(this._paramsAB);
  private readonly _paramsU  = new Uint32Array(this._paramsAB);

  private constructor(
    pipeline: GPURenderPipeline,
    bg0: GPUBindGroup,
    bg1: GPUBindGroup,
    paramsBuf: GPUBuffer,
  ) {
    super();
    this._pipeline = pipeline;
    this._bg0 = bg0;
    this._bg1 = bg1;
    this._paramsBuf = paramsBuf;
  }

  /**
   * Constructs the pass with its sampler, params buffer, pipeline, and bind groups.
   *
   * @param ctx Render context providing the device and default swapchain format.
   * @param hdrView HDR input texture view to tone map.
   * @param outputFormat Optional output texture format; defaults to `ctx.format`.
   * @returns Configured TonemapPass instance.
   */
  // hdrView — input HDR texture to tone map
  // outputFormat — format of the output texture (typically ctx.format for canvas)
  static create(
    ctx: RenderContext,
    hdrView: GPUTextureView,
    outputFormat?: GPUTextureFormat,
  ): TonemapPass {
    const { device, format } = ctx;
    const finalFormat = outputFormat ?? format;

    const bgl0 = device.createBindGroupLayout({
      label: 'TonemapBGL0',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const bgl1 = device.createBindGroupLayout({
      label: 'TonemapBGL1',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    const sampler = device.createSampler({
      label: 'TonemapSampler',
      magFilter: 'linear',
      minFilter: 'linear',
    });

    const paramsBuf = device.createBuffer({
      label: 'TonemapParams',
      size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bg0 = device.createBindGroup({
      label: 'TonemapBG0',
      layout: bgl0,
      entries: [
        { binding: 0, resource: hdrView },
        { binding: 1, resource: sampler },
      ],
    });

    const bg1 = device.createBindGroup({
      label: 'TonemapBG1',
      layout: bgl1,
      entries: [
        { binding: 0, resource: { buffer: paramsBuf } },
      ],
    });

    const shader = device.createShaderModule({
      label: 'TonemapShader',
      code: tonemapWgsl,
    });

    const layout = device.createPipelineLayout({
      bindGroupLayouts: [bgl0, bgl1],
    });

    const pipeline = device.createRenderPipeline({
      label: 'TonemapPipeline',
      layout,
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: {
        module: shader,
        entryPoint: 'fs_main',
        targets: [{ format: finalFormat }],
      },
      primitive: { topology: 'triangle-list' },
    });

    return new TonemapPass(pipeline, bg0, bg1, paramsBuf);
  }

  /**
   * Uploads the tone-mapping parameters to the GPU uniform buffer.
   *
   * @param ctx Render context whose queue receives the buffer write.
   * @param exposure Linear exposure multiplier applied before the curve.
   * @param useAces When true, enable the ACES filmic tone curve.
   * @param hdrCanvas When true, skip the final gamma encode (for HDR swapchains).
   */
  // Update tonemap parameters
  // exposure  — exposure multiplier (typically from auto-exposure, or manual value)
  // useAces   — enable ACES filmic tone mapping
  // hdrCanvas — skip gamma correction for HDR canvas output
  updateParams(ctx: RenderContext, exposure: number, useAces: boolean, hdrCanvas: boolean): void {
    const f = this._paramsF;
    const u = this._paramsU;

    let flags = 0;
    if (useAces) {
      flags |= 1;
    }
    if (hdrCanvas) {
      flags |= 2;
    }

    f[0] = exposure;
    u[1] = flags;
    f[2] = 0;
    f[3] = 0;

    ctx.queue.writeBuffer(this._paramsBuf, 0, this._paramsAB);
  }

  /**
   * Records the full-screen tone-mapping draw into the current swapchain texture.
   *
   * @param encoder Command encoder to record into.
   * @param ctx Render context used to acquire the current backbuffer texture.
   */
  execute(encoder: GPUCommandEncoder, ctx: RenderContext): void {
    const pass = encoder.beginRenderPass({
      label: 'TonemapPass',
      colorAttachments: [
        {
          view: ctx.backbufferView,
          clearValue: [0, 0, 0, 1],
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._bg0);
    pass.setBindGroup(1, this._bg1);
    pass.draw(3);
    pass.end();
  }

  /** Releases the params uniform buffer owned by this pass. */
  destroy(): void {
    this._paramsBuf.destroy();
  }
}
