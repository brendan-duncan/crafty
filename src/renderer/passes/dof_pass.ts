import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import { HDR_FORMAT } from './lighting_pass.js';
import dofWgsl from '../../shaders/dof.wgsl?raw';

// focus_distance, focus_range, bokeh_radius, near, far, _pad×3  →  8 × f32 = 32 bytes
const UNIFORM_SIZE = 32;

export class DofPass extends RenderPass {
  readonly name = 'DofPass';

  // Full-res composited result — read by BloomPass.
  readonly resultView: GPUTextureView;

  private _result  : GPUTexture;
  private _half    : GPUTexture;
  private _halfView: GPUTextureView;

  // 0 = Crafty (48-tap Fibonacci), 1 = Litecraft (Archimedean spiral)
  mode = 0;

  private _prefilterPipeline   : GPURenderPipeline;
  private _compositePipeline   : GPURenderPipeline;
  private _litecraftPipeline   : GPURenderPipeline;

  private _uniformBuffer: GPUBuffer;

  private _prefilterBG : GPUBindGroup;  // group 0: uniforms + hdr + depth + sampler
  private _compBG0     : GPUBindGroup;  // group 0 for composite: uniforms + hdr + sampler (no depth)
  private _compBG1     : GPUBindGroup;  // group 1 for composite: half_tex

  private constructor(
    result: GPUTexture, resultView: GPUTextureView,
    half: GPUTexture, halfView: GPUTextureView,
    prefilterPipeline: GPURenderPipeline,
    compositePipeline: GPURenderPipeline,
    litecraftPipeline: GPURenderPipeline,
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
    this._litecraftPipeline = litecraftPipeline;
    this._uniformBuffer = uniformBuffer;
    this._prefilterBG   = prefilterBG;
    this._compBG0       = compBG0;
    this._compBG1       = compBG1;
  }

  // hdrView   — TAA resolved output (rgba16float, full-res)
  // depthView — GBuffer depth (depth32float, full-res)
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

    const litecraftPipeline = device.createRenderPipeline({
      label: 'DofLitecraftPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [bgl0Composite, bgl1] }),
      vertex:   { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_litecraft', targets: [{ format: HDR_FORMAT }] },
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
      prefilterPipeline, compositePipeline, litecraftPipeline,
      uniformBuffer, prefilterBG, compBG0, compBG1,
    );
  }

  // focusDistance : nearest depth that starts to blur (world units) — everything closer is sharp
  // focusRange    : distance over which blur ramps from 0 to max beyond focusDistance
  // bokehRadius   : max blur in half-res texels
  updateParams(
    ctx: RenderContext,
    focusDistance = 30.0,
    focusRange = 60.0,
    bokehRadius = 6.0,
    near = 0.1,
    far  = 1000.0,
    blurScale = 1.0,
  ): void {
    ctx.device.queue.writeBuffer(this._uniformBuffer, 0,
      new Float32Array([focusDistance, focusRange, bokehRadius, near, far, blurScale, 0, 0]).buffer as ArrayBuffer);
  }

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
      pass.setPipeline(this.mode === 1 ? this._litecraftPipeline : this._compositePipeline);
      pass.setBindGroup(0, this._compBG0);
      pass.setBindGroup(1, this._compBG1);
      pass.draw(3);
      pass.end();
    }
  }

  destroy(): void {
    this._result.destroy();
    this._half.destroy();
    this._uniformBuffer.destroy();
  }
}
