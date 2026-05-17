import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import dofWgsl from '../../../shaders/dof.wgsl?raw';

const UNIFORM_SIZE = 32; // focusDistance + focusRange + bokehRadius + near + far + 3×pad

export interface DofDeps {
  hdr: ResourceHandle;
  depth: ResourceHandle;
}

export interface DofOutputs {
  result: ResourceHandle;
}

/**
 * Two-stage depth-of-field post-process (render-graph version).
 *
 * Half-resolution prefilter writes scene color and signed circle-of-confusion
 * into the alpha channel; then a full-resolution composite blurs the half-res
 * buffer and blends with the sharp source.
 */
export class DofPass extends Pass<DofDeps, DofOutputs> {
  readonly name = 'DofPass';

  private readonly _bglPrefilter: GPUBindGroupLayout;
  private readonly _bglComp0: GPUBindGroupLayout;
  private readonly _bglComp1: GPUBindGroupLayout;
  private readonly _prefilterPipeline: GPURenderPipeline;
  private readonly _compositePipeline: GPURenderPipeline;
  private readonly _uniformBuffer: GPUBuffer;
  private readonly _sampler: GPUSampler;
  private readonly _scratch = new Float32Array(8);

  private constructor(
    bglPrefilter: GPUBindGroupLayout,
    bglComp0: GPUBindGroupLayout,
    bglComp1: GPUBindGroupLayout,
    prefilterPipeline: GPURenderPipeline,
    compositePipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    sampler: GPUSampler,
  ) {
    super();
    this._bglPrefilter = bglPrefilter;
    this._bglComp0 = bglComp0;
    this._bglComp1 = bglComp1;
    this._prefilterPipeline = prefilterPipeline;
    this._compositePipeline = compositePipeline;
    this._uniformBuffer = uniformBuffer;
    this._sampler = sampler;
  }

  static create(ctx: RenderContext): DofPass {
    const { device } = ctx;

    const uniformBuffer = device.createBuffer({
      label: 'DofUniforms', size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(uniformBuffer, 0,
      new Float32Array([30.0, 60.0, 6.0, 0.1, 1000.0, 1.0, 0, 0]).buffer as ArrayBuffer);

    const sampler = device.createSampler({
      label: 'DofSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const bglPrefilter = device.createBindGroupLayout({
      label: 'DofBGL0Prefilter',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });
    const bglComp0 = device.createBindGroupLayout({
      label: 'DofBGL0Composite',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });
    const bglComp1 = device.createBindGroupLayout({
      label: 'DofBGL1',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }],
    });

    const shader = device.createShaderModule({ label: 'DofShader', code: dofWgsl });
    const prefilterPipeline = device.createRenderPipeline({
      label: 'DofPrefilterPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [bglPrefilter] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_prefilter', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });
    const compositePipeline = device.createRenderPipeline({
      label: 'DofCompositePipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [bglComp0, bglComp1] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_composite', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new DofPass(bglPrefilter, bglComp0, bglComp1,
      prefilterPipeline, compositePipeline, uniformBuffer, sampler);
  }

  updateParams(
    ctx: RenderContext,
    focusDistance = 30.0,
    focusRange = 60.0,
    bokehRadius = 6.0,
    near = 0.1,
    far = 1000.0,
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
    ctx.queue.writeBuffer(this._uniformBuffer, 0, this._scratch.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: DofDeps): DofOutputs {
    const { ctx } = graph;
    const halfDesc: TextureDesc = {
      format: HDR_FORMAT,
      width: Math.max(1, ctx.width >> 1),
      height: Math.max(1, ctx.height >> 1),
    };
    const fullDesc: TextureDesc = { format: HDR_FORMAT, width: ctx.width, height: ctx.height };

    let half!: ResourceHandle;
    let result!: ResourceHandle;

    graph.addPass('DofPass.prefilter', 'render', (b: PassBuilder) => {
      half = b.createTexture({ label: 'DofHalf', ...halfDesc });
      half = b.write(half, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 0] });
      b.read(deps.hdr, 'sampled');
      b.read(deps.depth, 'sampled');
      b.setExecute((pctx, res) => {
        const bg = res.getOrCreateBindGroup({
          layout: this._bglPrefilter,
          entries: [
            { binding: 0, resource: { buffer: this._uniformBuffer } },
            { binding: 1, resource: res.getTextureView(deps.hdr) },
            { binding: 2, resource: res.getTextureView(deps.depth) },
            { binding: 3, resource: this._sampler },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._prefilterPipeline);
        enc.setBindGroup(0, bg);
        enc.draw(3);
      });
    });

    graph.addPass('DofPass.composite', 'render', (b: PassBuilder) => {
      result = b.createTexture({ label: 'DofResult', ...fullDesc });
      result = b.write(result, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
      b.read(deps.hdr, 'sampled');
      b.read(half, 'sampled');
      b.setExecute((pctx, res) => {
        const bg0 = res.getOrCreateBindGroup({
          layout: this._bglComp0,
          entries: [
            { binding: 0, resource: { buffer: this._uniformBuffer } },
            { binding: 1, resource: res.getTextureView(deps.hdr) },
            { binding: 3, resource: this._sampler },
          ],
        });
        const bg1 = res.getOrCreateBindGroup({
          layout: this._bglComp1,
          entries: [{ binding: 0, resource: res.getTextureView(half) }],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._compositePipeline);
        enc.setBindGroup(0, bg0);
        enc.setBindGroup(1, bg1);
        enc.draw(3);
      });
    });

    return { result };
  }

  destroy(): void {
    this._uniformBuffer.destroy();
  }
}
