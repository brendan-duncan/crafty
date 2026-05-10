import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import { HDR_FORMAT } from './lighting_pass.js';
import dofWgsl from '../../shaders/dof.wgsl?raw';

// focus_distance, focus_range, bokeh_radius, near, far, _pad×3  →  8 × f32 = 32 bytes
const UNIFORM_SIZE = 32;

/**
 * Two-stage depth-of-field post-process: a half-resolution prefilter writes
 * scene colour and signed circle-of-confusion into the alpha channel, then a
 * full-resolution composite blurs the half-res buffer and blends it with the
 * sharp source.
 *
 * Inputs sampled:
 *  - `hdrView`: full-res HDR colour (typically the TAA resolved output)
 *  - `depthView`: GBuffer depth32float used to compute the CoC
 *
 * Output: a full-res HDR texture exposed as {@link resultView}, intended as
 * the input to the bloom pass.
 *
 * Shader: `dof.wgsl` (entry points `fs_prefilter` and `fs_composite`).
 */
export class DofPass extends RenderPass {
  /** Identifier used in render-graph diagnostics. */
  readonly name = 'DofPass';

  /** Full-res composited DOF result, intended to be sampled by the bloom pass. */
  readonly resultView: GPUTextureView;

  private _result  : GPUTexture;
  private _half    : GPUTexture;
  private _halfView: GPUTextureView;

  private _prefilterPipeline   : GPURenderPipeline;
  private _compositePipeline   : GPURenderPipeline;

  private _uniformBuffer: GPUBuffer;
  private readonly _scratch = new Float32Array(8);

  private _prefilterBG : GPUBindGroup;  // group 0: uniforms + hdr + depth + sampler
  private _compBG0     : GPUBindGroup;  // group 0 for composite: uniforms + hdr + sampler (no depth)
  private _compBG1     : GPUBindGroup;  // group 1 for composite: half_tex

  private constructor(
    result: GPUTexture, resultView: GPUTextureView,
    half: GPUTexture, halfView: GPUTextureView,
    prefilterPipeline: GPURenderPipeline,
    compositePipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    prefilterBG: GPUBindGroup,
    compBG0: GPUBindGroup,
    compBG1: GPUBindGroup,
  ) {
    super();
    this._result   = result;
    this.resultView = resultView;
    this._half     = half;
    this._halfView = halfView;
    this._prefilterPipeline = prefilterPipeline;
    this._compositePipeline = compositePipeline;
    this._uniformBuffer = uniformBuffer;
    this._prefilterBG   = prefilterBG;
    this._compBG0       = compBG0;
    this._compBG1       = compBG1;
  }

  /**
   * Allocates the half-res working texture, full-res result texture, both
   * pipelines (prefilter + composite) and their bind groups.
   *
   * @param ctx - Active render context (provides device and target dimensions).
   * @param hdrView - Full-res HDR colour to read (e.g. TAA resolved rgba16float).
   * @param depthView - Full-res GBuffer depth32float view.
   * @returns A configured DOF pass instance.
   */
  static create(
    ctx: RenderContext,
    hdrView: GPUTextureView,
    depthView: GPUTextureView,
  ): DofPass {
    const { device, width, height } = ctx;
    const halfW = Math.max(1, width  >> 1);
    const halfH = Math.max(1, height >> 1);

    const half   = device.createTexture({ label: 'DofHalf',   size: { width: halfW, height: halfH }, format: HDR_FORMAT, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });
    const result = device.createTexture({ label: 'DofResult', size: { width, height },               format: HDR_FORMAT, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });

    const halfView   = half.createView();
    const resultView = result.createView();

    const uniformBuffer = device.createBuffer({
      label: 'DofUniforms', size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    // Defaults: focusDist=30, focusRange=60, bokehRadius=6, near=0.1, far=1000
    device.queue.writeBuffer(uniformBuffer, 0,
      new Float32Array([30.0, 60.0, 6.0, 0.1, 1000.0, 0, 0, 0]).buffer as ArrayBuffer);

    const sampler = device.createSampler({
      label: 'DofSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    // Group 0 for prefilter: uniforms + hdr + depth + sampler
    const bgl0Prefilter = device.createBindGroupLayout({
      label: 'DofBGL0Prefilter',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    // Group 0 for composite: uniforms + hdr + (slot 2 unused) + sampler
    // Binding indices match the shader; slot 2 is omitted because fs_composite never reads dep_tex.
    const bgl0Composite = device.createBindGroupLayout({
      label: 'DofBGL0Composite',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    // Group 1 for composite: half_tex (prefiltered CoC + colour)
    const bgl1 = device.createBindGroupLayout({
      label: 'DofBGL1',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      ],
    });

    const shader = device.createShaderModule({ label: 'DofShader', code: dofWgsl });

    const prefilterPipeline = device.createRenderPipeline({
      label: 'DofPrefilterPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [bgl0Prefilter] }),
      vertex:   { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_prefilter', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const compositePipeline = device.createRenderPipeline({
      label: 'DofCompositePipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [bgl0Composite, bgl1] }),
      vertex:   { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_composite', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const prefilterBG = device.createBindGroup({
      label: 'DofPrefilterBG', layout: bgl0Prefilter,
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: hdrView },
        { binding: 2, resource: depthView },
        { binding: 3, resource: sampler },
      ],
    });

    const compBG0 = device.createBindGroup({
      label: 'DofCompBG0', layout: bgl0Composite,
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: hdrView },
        { binding: 3, resource: sampler },
      ],
    });

    const compBG1 = device.createBindGroup({
      label: 'DofCompBG1', layout: bgl1,
      entries: [{ binding: 0, resource: halfView }],
    });

    return new DofPass(
      result, resultView, half, halfView,
      prefilterPipeline, compositePipeline,
      uniformBuffer, prefilterBG, compBG0, compBG1,
    );
  }

  /**
   * Uploads the depth-of-field tuning parameters to the GPU uniform buffer.
   *
   * @param ctx - Active render context providing the GPU queue.
   * @param focusDistance - Nearest world-space depth that starts to blur; everything closer remains sharp.
   * @param focusRange - World-space distance over which blur ramps from zero to {@link bokehRadius}.
   * @param bokehRadius - Maximum blur radius expressed in half-resolution texels.
   * @param near - Camera near-plane distance, used to linearise depth.
   * @param far - Camera far-plane distance, used to linearise depth.
   * @param blurScale - Scalar multiplier applied to the final blur radius.
   */
  updateParams(
    ctx: RenderContext,
    focusDistance = 30.0,
    focusRange = 60.0,
    bokehRadius = 6.0,
    near = 0.1,
    far  = 1000.0,
    blurScale = 1.0,
  ): void {
    this._scratch[0] = focusDistance;
    this._scratch[1] = focusRange;
    this._scratch[2] = bokehRadius;
    this._scratch[3] = near;
    this._scratch[4] = far;
    this._scratch[5] = blurScale;
    this._scratch[6] = 0;
    this._scratch[7] = 0;
    ctx.device.queue.writeBuffer(this._uniformBuffer, 0, this._scratch.buffer as ArrayBuffer);
  }

  /**
   * Encodes both DOF render passes: a half-res prefilter that packs colour
   * and signed circle-of-confusion, followed by a full-res composite that
   * blurs the half-res image and mixes it with the sharp source.
   *
   * @param encoder - GPU command encoder to record into.
   * @param _ctx - Active render context (unused).
   */
  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    // 1. Prefilter: full-res HDR + depth → half-res (RGB=colour, A=signed CoC)
    {
      const pass = encoder.beginRenderPass({
        label: 'DofPrefilter',
        colorAttachments: [{ view: this._halfView, clearValue: [0, 0, 0, 0], loadOp: 'clear', storeOp: 'store' }],
      });
      pass.setPipeline(this._prefilterPipeline);
      pass.setBindGroup(0, this._prefilterBG);
      pass.draw(3);
      pass.end();
    }

    // 2. Composite: disc blur on half-res + mix with sharp full-res → result
    {
      const pass = encoder.beginRenderPass({
        label: 'DofComposite',
        colorAttachments: [{ view: this.resultView, clearValue: [0, 0, 0, 1], loadOp: 'clear', storeOp: 'store' }],
      });
      pass.setPipeline(this._compositePipeline);
      pass.setBindGroup(0, this._compBG0);
      pass.setBindGroup(1, this._compBG1);
      pass.draw(3);
      pass.end();
    }
  }

  /** Releases the half-res working texture, full-res result and uniform buffer. */
  destroy(): void {
    this._result.destroy();
    this._half.destroy();
    this._uniformBuffer.destroy();
  }
}
