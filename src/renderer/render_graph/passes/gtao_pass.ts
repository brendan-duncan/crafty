import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import gtaoWgsl from '../../../shaders/gtao.wgsl?raw';
import ssaoBlurWgsl from '../../../shaders/ssao_blur.wgsl?raw';

export type AOBlurQuality = 'performance' | 'quality';

const AO_FORMAT: GPUTextureFormat = 'r8unorm';
const UNIFORM_SIZE = 208; // 3×mat4(192) + params(16)

/**
 * Generate the 4×4 jitter-noise tile. Each texel stores two uniform [0,1]
 * random values in rg, used by the shader as slice-angle jitter (rnd.x) and
 * step-offset jitter (rnd.y).
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

export interface GTAODeps {
  /** GBuffer normal+metallic (rgba16float). */
  normal: ResourceHandle;
  /** GBuffer depth (depth32float). */
  depth: ResourceHandle;
}

export interface GTAOOutputs {
  /** Half-resolution blurred AO factor (`r8unorm`). */
  ao: ResourceHandle;
}

/**
 * Ground Truth Ambient Occlusion (Jiménez et al., GDC 2016).
 *
 * Slice-based horizon integration with projected-normal correction. For each
 * slice through the view direction:
 *
 * 1. March left and right in screen space, tracking the maximum horizon
 *    cosine on each side (the "tightest" horizon angle).
 * 2. Project the surface normal onto the slice plane to get a signed
 *    projected-normal angle `n` relative to the view direction.
 * 3. Clamp horizons to the visible hemisphere `[n - π/2, n + π/2]`.
 * 4. Evaluate the cosine-weighted slice integral analytically:
 *    `(sin(h_pos − n) − sin(h_neg − n)) / 2`, weighted by the projected
 *    normal length.
 *
 * The result is averaged across slices and raised to the `strength` exponent
 * to control contrast. Output goes through the same separable bilateral /
 * box-blur pipelines as SSAO so consumers see an interchangeable AO factor.
 *
 * Compared to classic hemisphere SSAO: smoother falloff, no light-bleed
 * haloing at silhouettes, and a more physically meaningful AO term — at the
 * cost of more arithmetic per pixel (the analytical integral, projected
 * normal math, atan2 per slice).
 */
export class GTAOPass extends Pass<GTAODeps, GTAOOutputs> {
  readonly name = 'GTAOPass';

  private readonly _gtaoPipeline: GPURenderPipeline;
  private readonly _blurHPipeline: GPURenderPipeline;
  private readonly _blurVPipeline: GPURenderPipeline;
  private readonly _boxBlurPipeline: GPURenderPipeline;
  private _blurQuality: AOBlurQuality;
  private readonly _uniformBuffer: GPUBuffer;
  private readonly _noiseTex: GPUTexture;
  private readonly _noiseView: GPUTextureView;
  private readonly _gtaoBgl1: GPUBindGroupLayout;
  private readonly _blurBgl: GPUBindGroupLayout;
  private readonly _gtaoBg0: GPUBindGroup;
  private readonly _blurSampler: GPUSampler;

  private readonly _cameraScratch = new Float32Array(48);
  private readonly _paramsScratch = new Float32Array(4);

  private constructor(
    gtaoPipeline: GPURenderPipeline,
    blurHPipeline: GPURenderPipeline,
    blurVPipeline: GPURenderPipeline,
    boxBlurPipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    noiseTex: GPUTexture,
    noiseView: GPUTextureView,
    gtaoBgl1: GPUBindGroupLayout,
    blurBgl: GPUBindGroupLayout,
    gtaoBg0: GPUBindGroup,
    blurSampler: GPUSampler,
    blurQuality: AOBlurQuality,
  ) {
    super();
    this._gtaoPipeline = gtaoPipeline;
    this._blurHPipeline = blurHPipeline;
    this._blurVPipeline = blurVPipeline;
    this._boxBlurPipeline = boxBlurPipeline;
    this._blurQuality = blurQuality;
    this._uniformBuffer = uniformBuffer;
    this._noiseTex = noiseTex;
    this._noiseView = noiseView;
    this._gtaoBgl1 = gtaoBgl1;
    this._blurBgl = blurBgl;
    this._gtaoBg0 = gtaoBg0;
    this._blurSampler = blurSampler;
  }

  static create(ctx: RenderContext, blurQuality: AOBlurQuality = 'quality'): GTAOPass {
    const { device } = ctx;

    const noiseTex = device.createTexture({
      label: 'GtaoNoise',
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
      label: 'GtaoUniforms',
      size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(uniformBuffer, 192, new Float32Array([1.0, 0.1, 2.0, 0]).buffer as ArrayBuffer);

    const blurSampler = device.createSampler({
      label: 'GtaoBlurSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const gtaoBgl0 = device.createBindGroupLayout({
      label: 'GtaoBGL0',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const gtaoBgl1 = device.createBindGroupLayout({
      label: 'GtaoBGL1',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      ],
    });
    const blurBgl = device.createBindGroupLayout({
      label: 'GtaoBlurBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const gtaoShader = ctx.createShaderModule(gtaoWgsl, 'GtaoShader');
    const blurShader = ctx.createShaderModule(ssaoBlurWgsl, 'GtaoBlurShader');

    const gtaoPipeline = device.createRenderPipeline({
      label: 'GtaoPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [gtaoBgl0, gtaoBgl1] }),
      vertex: { module: gtaoShader, entryPoint: 'vs_main' },
      fragment: { module: gtaoShader, entryPoint: 'fs_gtao', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const blurHPipeline = device.createRenderPipeline({
      label: 'GtaoBlurHPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [blurBgl] }),
      vertex: { module: blurShader, entryPoint: 'vs_main' },
      fragment: { module: blurShader, entryPoint: 'fs_blur_h', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const blurVPipeline = device.createRenderPipeline({
      label: 'GtaoBlurVPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [blurBgl] }),
      vertex: { module: blurShader, entryPoint: 'vs_main' },
      fragment: { module: blurShader, entryPoint: 'fs_blur_v', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const boxBlurPipeline = device.createRenderPipeline({
      label: 'GtaoBoxBlurPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [blurBgl] }),
      vertex: { module: blurShader, entryPoint: 'vs_main' },
      fragment: { module: blurShader, entryPoint: 'fs_blur', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const gtaoBg0 = device.createBindGroup({
      label: 'GtaoBG0',
      layout: gtaoBgl0,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    return new GTAOPass(
      gtaoPipeline,
      blurHPipeline,
      blurVPipeline,
      boxBlurPipeline,
      uniformBuffer,
      noiseTex,
      noiseView,
      gtaoBgl1,
      blurBgl,
      gtaoBg0,
      blurSampler,
      blurQuality,
    );
  }

  updateCamera(ctx: RenderContext): void {
    const camera = ctx.activeCamera;
    if (!camera) {
      throw new Error('GTAOPass.updateCamera: ctx.activeCamera is null');
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
   * `bias`   — thickness bias; samples farther than `radius*(1 + bias*10)`
   *            from the surface don't lower the horizon (avoids haunting
   *            from background geometry).
   * `strength` — exponent applied to visibility (higher → more contrast).
   */
  updateParams(ctx: RenderContext, radius = 1.0, bias = 0.1, strength = 2.0): void {
    this._paramsScratch[0] = radius;
    this._paramsScratch[1] = bias;
    this._paramsScratch[2] = strength;
    this._paramsScratch[3] = 0;
    ctx.device.queue.writeBuffer(this._uniformBuffer, 192, this._paramsScratch.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: GTAODeps): GTAOOutputs {
    const { ctx } = graph;
    const hw = Math.max(1, ctx.width >> 1);
    const hh = Math.max(1, ctx.height >> 1);
    const halfDesc: TextureDesc = { format: AO_FORMAT, width: hw, height: hh };

    let raw!: ResourceHandle;
    let ao!: ResourceHandle;

    graph.addPass('GTAOPass.raw', 'render', (b: PassBuilder) => {
      raw = b.createTexture({ label: 'GtaoRaw', ...halfDesc });
      raw = b.write(raw, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
      b.read(deps.normal, 'sampled');
      b.read(deps.depth, 'sampled');

      b.setExecute((pctx, res) => {
        const bg1 = res.getOrCreateBindGroup({
          label: 'GtaoBG1',
          layout: this._gtaoBgl1,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.normal) },
            { binding: 1, resource: res.getTextureView(deps.depth) },
            { binding: 2, resource: this._noiseView },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._gtaoPipeline);
        enc.setBindGroup(0, this._gtaoBg0);
        enc.setBindGroup(1, bg1);
        enc.draw(3);
      });
    });

    if (this._blurQuality === 'quality') {
      let horiz!: ResourceHandle;
      graph.addPass('GTAOPass.blurH', 'render', (b: PassBuilder) => {
        horiz = b.createTexture({ label: 'GtaoBlurH', ...halfDesc });
        horiz = b.write(horiz, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
        b.read(raw, 'sampled');
        b.read(deps.depth, 'sampled');

        b.setExecute((pctx, res) => {
          const bg = res.getOrCreateBindGroup({
            label: 'GtaoBlurHBG',
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

      graph.addPass('GTAOPass.blurV', 'render', (b: PassBuilder) => {
        ao = b.createTexture({ label: 'GtaoBlurred', ...halfDesc });
        ao = b.write(ao, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
        b.read(horiz, 'sampled');
        b.read(deps.depth, 'sampled');

        b.setExecute((pctx, res) => {
          const bg = res.getOrCreateBindGroup({
            label: 'GtaoBlurVBG',
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
      graph.addPass('GTAOPass.boxBlur', 'render', (b: PassBuilder) => {
        ao = b.createTexture({ label: 'GtaoBoxBlurred', ...halfDesc });
        ao = b.write(ao, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
        b.read(raw, 'sampled');
        b.read(deps.depth, 'sampled');

        b.setExecute((pctx, res) => {
          const bg = res.getOrCreateBindGroup({
            label: 'GtaoBoxBlurBG',
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
