import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import bloomWgsl from '../../../shaders/bloom.wgsl?raw';
import bloomCompositeWgsl from '../../../shaders/bloom_composite.wgsl?raw';

const UNIFORM_SIZE = 16; // threshold + knee + strength + pad

export interface BloomDeps {
  /** HDR scene to bloom (read sampled). */
  hdr: ResourceHandle;
}

export interface BloomOutputs {
  /** Full-resolution HDR + bloom composite. */
  result: ResourceHandle;
}

/**
 * HDR bloom (render-graph version). Prefilter → 2× H/V blur ping-pong →
 * composite, all on transient half-res textures except the final full-res
 * result.
 */
export class BloomPass extends Pass<BloomDeps, BloomOutputs> {
  readonly name = 'BloomPass';

  private readonly _device: GPUDevice;
  private readonly _singleBgl: GPUBindGroupLayout;
  private readonly _compositeBgl: GPUBindGroupLayout;
  private readonly _prefilterPipeline: GPURenderPipeline;
  private readonly _blurHPipeline: GPURenderPipeline;
  private readonly _blurVPipeline: GPURenderPipeline;
  private readonly _compositePipeline: GPURenderPipeline;
  private readonly _uniformBuffer: GPUBuffer;
  private readonly _sampler: GPUSampler;
  private readonly _scratch = new Float32Array(4);

  private constructor(
    device: GPUDevice,
    singleBgl: GPUBindGroupLayout,
    compositeBgl: GPUBindGroupLayout,
    prefilterPipeline: GPURenderPipeline,
    blurHPipeline: GPURenderPipeline,
    blurVPipeline: GPURenderPipeline,
    compositePipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    sampler: GPUSampler,
  ) {
    super();
    this._device = device;
    this._singleBgl = singleBgl;
    this._compositeBgl = compositeBgl;
    this._prefilterPipeline = prefilterPipeline;
    this._blurHPipeline = blurHPipeline;
    this._blurVPipeline = blurVPipeline;
    this._compositePipeline = compositePipeline;
    this._uniformBuffer = uniformBuffer;
    this._sampler = sampler;
  }

  static create(ctx: RenderContext): BloomPass {
    const { device } = ctx;

    const uniformBuffer = device.createBuffer({
      label: 'BloomUniforms', size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([1.0, 0.5, 0.3, 0]).buffer as ArrayBuffer);

    const sampler = device.createSampler({
      label: 'BloomSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const singleBgl = device.createBindGroupLayout({
      label: 'BloomSingleBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });
    const compositeBgl = device.createBindGroupLayout({
      label: 'BloomCompositeBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const bloomShader = ctx.createShaderModule(bloomWgsl, 'BloomShader');
    const compositeShader = ctx.createShaderModule(bloomCompositeWgsl, 'BloomComposite');
    const singleLayout = device.createPipelineLayout({ bindGroupLayouts: [singleBgl] });
    const compositeLayout = device.createPipelineLayout({ bindGroupLayouts: [compositeBgl] });

    const makeSingle = (entryPoint: string, label: string): GPURenderPipeline =>
      device.createRenderPipeline({
        label, layout: singleLayout,
        vertex: { module: bloomShader, entryPoint: 'vs_main' },
        fragment: { module: bloomShader, entryPoint, targets: [{ format: HDR_FORMAT }] },
        primitive: { topology: 'triangle-list' },
      });

    return new BloomPass(
      device, singleBgl, compositeBgl,
      makeSingle('fs_prefilter', 'BloomPrefilterPipeline'),
      makeSingle('fs_blur_h', 'BloomBlurHPipeline'),
      makeSingle('fs_blur_v', 'BloomBlurVPipeline'),
      device.createRenderPipeline({
        label: 'BloomCompositePipeline', layout: compositeLayout,
        vertex: { module: compositeShader, entryPoint: 'vs_main' },
        fragment: { module: compositeShader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
        primitive: { topology: 'triangle-list' },
      }),
      uniformBuffer, sampler,
    );
  }

  updateParams(ctx: RenderContext, threshold = 1.0, knee = 0.5, strength = 0.3): void {
    this._scratch[0] = threshold;
    this._scratch[1] = knee;
    this._scratch[2] = strength;
    this._scratch[3] = 0;
    ctx.queue.writeBuffer(this._uniformBuffer, 0, this._scratch.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: BloomDeps): BloomOutputs {
    const { ctx } = graph;
    const halfDesc: TextureDesc = {
      format: HDR_FORMAT,
      width: Math.max(1, ctx.width >> 1),
      height: Math.max(1, ctx.height >> 1),
    };
    const fullDesc: TextureDesc = {
      format: HDR_FORMAT,
      width: ctx.width,
      height: ctx.height,
    };

    let half1!: ResourceHandle;
    let half2!: ResourceHandle;
    let result!: ResourceHandle;

    const makeSingleBg = (texView: GPUTextureView): GPUBindGroup =>
      this._device.createBindGroup({
        layout: this._singleBgl,
        entries: [
          { binding: 0, resource: { buffer: this._uniformBuffer } },
          { binding: 1, resource: texView },
          { binding: 2, resource: this._sampler },
        ],
      });

    // 1. Prefilter: HDR → half1
    graph.addPass('BloomPass.prefilter', 'render', (b: PassBuilder) => {
      half1 = b.createTexture({ label: 'BloomHalf1', ...halfDesc });
      half1 = b.write(half1, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
      b.read(deps.hdr, 'sampled');
      b.setExecute((pctx, res) => {
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._prefilterPipeline);
        enc.setBindGroup(0, makeSingleBg(res.getTextureView(deps.hdr)));
        enc.draw(3);
      });
    });

    // 2. Two iterations of horizontal+vertical blur (half1 ↔ half2).
    for (let iter = 0; iter < 2; iter++) {
      const inputForH = half1;
      let outH!: ResourceHandle;
      graph.addPass(`BloomPass.blurH${iter}`, 'render', (b: PassBuilder) => {
        half2 = iter === 0 ? b.createTexture({ label: 'BloomHalf2', ...halfDesc }) : half2;
        outH = b.write(half2, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
        b.read(inputForH, 'sampled');
        b.setExecute((pctx, res) => {
          const enc = pctx.renderPassEncoder!;
          enc.setPipeline(this._blurHPipeline);
          enc.setBindGroup(0, makeSingleBg(res.getTextureView(inputForH)));
          enc.draw(3);
        });
      });
      half2 = outH;

      const inputForV = half2;
      let outV!: ResourceHandle;
      graph.addPass(`BloomPass.blurV${iter}`, 'render', (b: PassBuilder) => {
        outV = b.write(half1, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
        b.read(inputForV, 'sampled');
        b.setExecute((pctx, res) => {
          const enc = pctx.renderPassEncoder!;
          enc.setPipeline(this._blurVPipeline);
          enc.setBindGroup(0, makeSingleBg(res.getTextureView(inputForV)));
          enc.draw(3);
        });
      });
      half1 = outV;
    }

    // 3. Composite: HDR + blurred half1 → result
    const finalHalf = half1;
    graph.addPass('BloomPass.composite', 'render', (b: PassBuilder) => {
      result = b.createTexture({ label: 'BloomResult', ...fullDesc });
      result = b.write(result, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
      b.read(deps.hdr, 'sampled');
      b.read(finalHalf, 'sampled');
      b.setExecute((pctx, res) => {
        const bg = this._device.createBindGroup({
          layout: this._compositeBgl,
          entries: [
            { binding: 0, resource: { buffer: this._uniformBuffer } },
            { binding: 1, resource: res.getTextureView(deps.hdr) },
            { binding: 2, resource: res.getTextureView(finalHalf) },
            { binding: 3, resource: this._sampler },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._compositePipeline);
        enc.setBindGroup(0, bg);
        enc.draw(3);
      });
    });

    return { result };
  }

  destroy(): void {
    this._uniformBuffer.destroy();
  }
}
