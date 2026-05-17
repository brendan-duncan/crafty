import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import hbaoWgsl from '../../../shaders/hbao_plus.wgsl?raw';
import ssaoBlurWgsl from '../../../shaders/ssao_blur.wgsl?raw';
import type { AOBlurQuality } from './gtao_pass.js';

const AO_FORMAT: GPUTextureFormat = 'r8unorm';
const UNIFORM_SIZE = 208; // 3×mat4(192) + params(16)

/**
 * Generate the 4×4 jitter-noise tile (uniform random rg per texel) used to
 * jitter the per-direction starting angle and march offset.
 */
function generateNoise(): Uint8Array {
  const noise = new Uint8Array(16 * 4);
  for (let i = 0; i < 16; i++) {
    noise[i * 4 + 0] = Math.round(Math.random() * 255);
    noise[i * 4 + 1] = Math.round(Math.random() * 255);
    noise[i * 4 + 2] = 128;
    noise[i * 4 + 3] = 255;
  }
  return noise;
}

export interface HBAOPlusDeps {
  /** GBuffer normal+metallic (rgba16float). */
  normal: ResourceHandle;
  /** GBuffer depth (depth32float). */
  depth: ResourceHandle;
}

export interface HBAOPlusOutputs {
  /** Half-resolution blurred AO factor (`r8unorm`). */
  ao: ResourceHandle;
}

/**
 * HBAO+ (NVIDIA Horizon-Based AO, plus variant).
 *
 * For each of N screen-space directions (default 8), march a few steps from
 * the pixel and track the maximum "horizon" angle above the tangent plane.
 * The unoccluded contribution from that direction is `max(sin(h) - sin(bias),
 * 0)`; AO is the averaged occlusion across all directions.
 *
 * The "+" denotes per-pixel jitter (we tile a 4×4 noise texture) and an
 * angle bias to suppress self-occlusion on flat surfaces. Compared to GTAO,
 * the integral is approximate (no projected-normal correction, no cosine
 * weighting) — cheaper, sharper at creases, and slightly more prone to
 * directional banding on grazing surfaces. Compared to classic SSAO,
 * horizon tracking eliminates the noisy variance of independent sample
 * occlusion tests.
 *
 * Output goes through the same separable bilateral / box-blur pipelines as
 * SSAO so the AO factor is interchangeable downstream.
 */
export class HBAOPlusPass extends Pass<HBAOPlusDeps, HBAOPlusOutputs> {
  readonly name = 'HBAOPlusPass';

  private readonly _hbaoPipeline: GPURenderPipeline;
  private readonly _blurHPipeline: GPURenderPipeline;
  private readonly _blurVPipeline: GPURenderPipeline;
  private readonly _boxBlurPipeline: GPURenderPipeline;
  private _blurQuality: AOBlurQuality;
  private readonly _uniformBuffer: GPUBuffer;
  private readonly _noiseTex: GPUTexture;
  private readonly _noiseView: GPUTextureView;
  private readonly _hbaoBgl1: GPUBindGroupLayout;
  private readonly _blurBgl: GPUBindGroupLayout;
  private readonly _hbaoBg0: GPUBindGroup;
  private readonly _blurSampler: GPUSampler;

  private readonly _cameraScratch = new Float32Array(48);
  private readonly _paramsScratch = new Float32Array(4);

  private constructor(
    hbaoPipeline: GPURenderPipeline,
    blurHPipeline: GPURenderPipeline,
    blurVPipeline: GPURenderPipeline,
    boxBlurPipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    noiseTex: GPUTexture,
    noiseView: GPUTextureView,
    hbaoBgl1: GPUBindGroupLayout,
    blurBgl: GPUBindGroupLayout,
    hbaoBg0: GPUBindGroup,
    blurSampler: GPUSampler,
    blurQuality: AOBlurQuality,
  ) {
    super();
    this._hbaoPipeline = hbaoPipeline;
    this._blurHPipeline = blurHPipeline;
    this._blurVPipeline = blurVPipeline;
    this._boxBlurPipeline = boxBlurPipeline;
    this._blurQuality = blurQuality;
    this._uniformBuffer = uniformBuffer;
    this._noiseTex = noiseTex;
    this._noiseView = noiseView;
    this._hbaoBgl1 = hbaoBgl1;
    this._blurBgl = blurBgl;
    this._hbaoBg0 = hbaoBg0;
    this._blurSampler = blurSampler;
  }

  static create(ctx: RenderContext, blurQuality: AOBlurQuality = 'quality'): HBAOPlusPass {
    const { device } = ctx;

    const noiseTex = device.createTexture({
      label: 'HbaoNoise',
      size: { width: 4, height: 4 },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    device.queue.writeTexture(
      { texture: noiseTex },
      generateNoise().buffer as ArrayBuffer,
      { bytesPerRow: 4 * 4, rowsPerImage: 4 },
      { width: 4, height: 4 },
    );
    const noiseView = noiseTex.createView();

    const uniformBuffer = device.createBuffer({
      label: 'HbaoUniforms',
      size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(uniformBuffer, 192, new Float32Array([1.0, 0.1, 2.0, 0]).buffer as ArrayBuffer);

    const blurSampler = device.createSampler({
      label: 'HbaoBlurSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const hbaoBgl0 = device.createBindGroupLayout({
      label: 'HbaoBGL0',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const hbaoBgl1 = device.createBindGroupLayout({
      label: 'HbaoBGL1',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      ],
    });
    const blurBgl = device.createBindGroupLayout({
      label: 'HbaoBlurBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const hbaoShader = ctx.createShaderModule(hbaoWgsl, 'HbaoShader');
    const blurShader = ctx.createShaderModule(ssaoBlurWgsl, 'HbaoBlurShader');

    const hbaoPipeline = device.createRenderPipeline({
      label: 'HbaoPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [hbaoBgl0, hbaoBgl1] }),
      vertex: { module: hbaoShader, entryPoint: 'vs_main' },
      fragment: { module: hbaoShader, entryPoint: 'fs_hbao', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const blurHPipeline = device.createRenderPipeline({
      label: 'HbaoBlurHPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [blurBgl] }),
      vertex: { module: blurShader, entryPoint: 'vs_main' },
      fragment: { module: blurShader, entryPoint: 'fs_blur_h', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const blurVPipeline = device.createRenderPipeline({
      label: 'HbaoBlurVPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [blurBgl] }),
      vertex: { module: blurShader, entryPoint: 'vs_main' },
      fragment: { module: blurShader, entryPoint: 'fs_blur_v', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const boxBlurPipeline = device.createRenderPipeline({
      label: 'HbaoBoxBlurPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [blurBgl] }),
      vertex: { module: blurShader, entryPoint: 'vs_main' },
      fragment: { module: blurShader, entryPoint: 'fs_blur', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const hbaoBg0 = device.createBindGroup({
      label: 'HbaoBG0',
      layout: hbaoBgl0,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    return new HBAOPlusPass(
      hbaoPipeline,
      blurHPipeline,
      blurVPipeline,
      boxBlurPipeline,
      uniformBuffer,
      noiseTex,
      noiseView,
      hbaoBgl1,
      blurBgl,
      hbaoBg0,
      blurSampler,
      blurQuality,
    );
  }

  updateCamera(ctx: RenderContext): void {
    const camera = ctx.activeCamera;
    if (!camera) {
      throw new Error('HBAOPlusPass.updateCamera: ctx.activeCamera is null');
    }
    const data = this._cameraScratch;
    data.set(camera.viewMatrix().data, 0);
    data.set(camera.projectionMatrix().data, 16);
    data.set(camera.inverseProjectionMatrix().data, 32);
    ctx.device.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
  }

  setBlurQuality(quality: AOBlurQuality): void {
    this._blurQuality = quality;
  }

  /**
   * `radius` — world-space sampling radius.
   * `bias`   — tangent angle bias in radians; horizons within this much of
   *            the tangent plane are treated as unoccluded (suppresses
   *            shimmer on flat surfaces).
   * `strength` — multiplier on the averaged occlusion before subtraction
   *              from 1 (higher → darker).
   */
  updateParams(ctx: RenderContext, radius = 1.0, bias = 0.1, strength = 2.0): void {
    this._paramsScratch[0] = radius;
    this._paramsScratch[1] = bias;
    this._paramsScratch[2] = strength;
    this._paramsScratch[3] = 0;
    ctx.device.queue.writeBuffer(this._uniformBuffer, 192, this._paramsScratch.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: HBAOPlusDeps): HBAOPlusOutputs {
    const { ctx } = graph;
    const hw = Math.max(1, ctx.width >> 1);
    const hh = Math.max(1, ctx.height >> 1);
    const halfDesc: TextureDesc = { format: AO_FORMAT, width: hw, height: hh };

    let raw!: ResourceHandle;
    let ao!: ResourceHandle;

    graph.addPass('HBAOPlusPass.raw', 'render', (b: PassBuilder) => {
      raw = b.createTexture({ label: 'HbaoRaw', ...halfDesc });
      raw = b.write(raw, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
      b.read(deps.normal, 'sampled');
      b.read(deps.depth, 'sampled');

      b.setExecute((pctx, res) => {
        const bg1 = res.getOrCreateBindGroup({
          label: 'HbaoBG1',
          layout: this._hbaoBgl1,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.normal) },
            { binding: 1, resource: res.getTextureView(deps.depth) },
            { binding: 2, resource: this._noiseView },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._hbaoPipeline);
        enc.setBindGroup(0, this._hbaoBg0);
        enc.setBindGroup(1, bg1);
        enc.draw(3);
      });
    });

    if (this._blurQuality === 'quality') {
      let horiz!: ResourceHandle;
      graph.addPass('HBAOPlusPass.blurH', 'render', (b: PassBuilder) => {
        horiz = b.createTexture({ label: 'HbaoBlurH', ...halfDesc });
        horiz = b.write(horiz, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
        b.read(raw, 'sampled');
        b.read(deps.depth, 'sampled');

        b.setExecute((pctx, res) => {
          const bg = res.getOrCreateBindGroup({
            label: 'HbaoBlurHBG',
            layout: this._blurBgl,
            entries: [
              { binding: 0, resource: res.getTextureView(raw) },
              { binding: 1, resource: res.getTextureView(deps.depth) },
              { binding: 2, resource: this._blurSampler },
            ],
          });
          const enc = pctx.renderPassEncoder!;
          enc.setPipeline(this._blurHPipeline);
          enc.setBindGroup(0, bg);
          enc.draw(3);
        });
      });

      graph.addPass('HBAOPlusPass.blurV', 'render', (b: PassBuilder) => {
        ao = b.createTexture({ label: 'HbaoBlurred', ...halfDesc });
        ao = b.write(ao, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
        b.read(horiz, 'sampled');
        b.read(deps.depth, 'sampled');

        b.setExecute((pctx, res) => {
          const bg = res.getOrCreateBindGroup({
            label: 'HbaoBlurVBG',
            layout: this._blurBgl,
            entries: [
              { binding: 0, resource: res.getTextureView(horiz) },
              { binding: 1, resource: res.getTextureView(deps.depth) },
              { binding: 2, resource: this._blurSampler },
            ],
          });
          const enc = pctx.renderPassEncoder!;
          enc.setPipeline(this._blurVPipeline);
          enc.setBindGroup(0, bg);
          enc.draw(3);
        });
      });
    } else {
      graph.addPass('HBAOPlusPass.boxBlur', 'render', (b: PassBuilder) => {
        ao = b.createTexture({ label: 'HbaoBoxBlurred', ...halfDesc });
        ao = b.write(ao, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
        b.read(raw, 'sampled');
        b.read(deps.depth, 'sampled');

        b.setExecute((pctx, res) => {
          const bg = res.getOrCreateBindGroup({
            label: 'HbaoBoxBlurBG',
            layout: this._blurBgl,
            entries: [
              { binding: 0, resource: res.getTextureView(raw) },
              { binding: 1, resource: res.getTextureView(deps.depth) },
              { binding: 2, resource: this._blurSampler },
            ],
          });
          const enc = pctx.renderPassEncoder!;
          enc.setPipeline(this._boxBlurPipeline);
          enc.setBindGroup(0, bg);
          enc.draw(3);
        });
      });
    }

    return { ao };
  }

  destroy(): void {
    this._uniformBuffer.destroy();
    this._noiseTex.destroy();
  }
}
