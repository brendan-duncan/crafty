import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { DeferredLightingPass } from './deferred_lighting_pass.js';
import type { GBuffer } from '../gbuffer.js';
import { halton } from '../../math/random.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import taaWgsl from '../../shaders/taa.wgsl?raw';

// invViewProj (mat4) + prevViewProj (mat4) = 128 bytes
const TAA_UNIFORM_SIZE = 128;

/**
 * Temporal anti-aliasing pass. Reprojects the previous-frame history into the
 * current frame using depth + camera matrices, then blends it with the jittered
 * lit color to converge sub-pixel detail across frames.
 *
 * Inputs sampled: lit HDR color, TAA history, G-buffer depth.
 * Output: resolved HDR color exposed as `resolvedView`; the result is also
 * copied back into the history texture for the next frame.
 */
export class TAAPass extends RenderPass {
  readonly name = 'TAAPass';

  private _resolved: GPUTexture;
  /** Final anti-aliased HDR view consumed by downstream post-processing. */
  readonly resolvedView: GPUTextureView;
  private _history: GPUTexture;
  private _historyView: GPUTextureView;

  private _pipeline: GPURenderPipeline;
  private _uniformBuffer: GPUBuffer;
  private _uniformBG: GPUBindGroup;
  private _textureBG: GPUBindGroup;

  private readonly _width: number;
  private readonly _height: number;
  private readonly _scratch = new Float32Array(TAA_UNIFORM_SIZE / 4);

  /** Halton sample count before the jitter sequence repeats. */
  sampleCount = 16;
  private _frameIndex = 0;

  /** View of the history texture, useful for debugging or external consumers. */
  get historyView(): GPUTextureView { return this._historyView; }

  private constructor(
    resolved: GPUTexture,
    resolvedView: GPUTextureView,
    history: GPUTexture,
    historyView: GPUTextureView,
    pipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    uniformBG: GPUBindGroup,
    textureBG: GPUBindGroup,
    width: number,
    height: number,
  ) {
    super();
    this._resolved = resolved;
    this.resolvedView = resolvedView;
    this._history = history;
    this._historyView = historyView;
    this._pipeline = pipeline;
    this._uniformBuffer = uniformBuffer;
    this._uniformBG = uniformBG;
    this._textureBG = textureBG;
    this._width = width;
    this._height = height;
  }

  /**
   * Constructs the pass and allocates the resolved + history textures, the
   * uniform buffer, the pipeline, and bind groups.
   *
   * @param ctx Render context providing device and screen size.
   * @param lightingPass Lighting pass providing the HDR color view to anti-alias.
   * @param gbuffer G-buffer providing the depth view for reprojection.
   * @returns Configured TAAPass instance.
   */
  static create(ctx: RenderContext, lightingPass: DeferredLightingPass, gbuffer: GBuffer): TAAPass {
    const { device, width, height } = ctx;

    const resolved = device.createTexture({
      label: 'TAA Resolved',
      size: { width, height },
      format: HDR_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
    });

    const history = device.createTexture({
      label: 'TAA History',
      size: { width, height },
      format: HDR_FORMAT,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const resolvedView = resolved.createView();
    const historyView  = history.createView();

    const uniformBuffer = device.createBuffer({
      label: 'TAAUniformBuffer',
      size: TAA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uniformBGL = device.createBindGroupLayout({
      label: 'TAAUniformBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    const textureBGL = device.createBindGroupLayout({
      label: 'TAATextureBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const linearSampler = device.createSampler({
      label: 'TAALinearSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const uniformBG = device.createBindGroup({
      layout: uniformBGL,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const textureBG = device.createBindGroup({
      layout: textureBGL,
      entries: [
        { binding: 0, resource: lightingPass.outputView },
        { binding: 1, resource: historyView },
        { binding: 2, resource: gbuffer.depthView },
        { binding: 3, resource: linearSampler },
      ],
    });

    const shader = ctx.createShaderModule(taaWgsl, 'TAAShader');
    const pipeline = device.createRenderPipeline({
      label: 'TAAPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBGL, textureBGL] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new TAAPass(
      resolved, resolvedView, history, historyView,
      pipeline, uniformBuffer, uniformBG, textureBG,
      width, height,
    );
  }

  /**
   * Picks the next Halton-sequence sub-pixel offset, applies it to
   * `ctx.activeCamera` (so downstream geometry passes see a jittered VP via
   * {@link Camera.jitteredViewProjectionMatrix}), and uploads the reprojection
   * uniform (`invViewProj` + previous-frame `viewProj`).
   *
   * Must run BEFORE any geometry-fill pass's `updateCamera(ctx)` in the same
   * frame — otherwise those passes will read an un-jittered VP and TAA will
   * have nothing to converge.
   */
  updateCamera(ctx: RenderContext): void {
    const camera = ctx.activeCamera;
    if (!camera) {
      throw new Error('TAAPass.updateCamera: ctx.activeCamera is null');
    }
    const hi = (this._frameIndex % this.sampleCount) + 1;
    const jx = (halton(hi, 2) - 0.5) * (2 / ctx.width);
    const jy = (halton(hi, 3) - 0.5) * (2 / ctx.height);
    camera.applyJitter(jx, jy);

    const data = this._scratch;
    data.set(camera.inverseViewProjectionMatrix().data, 0);
    data.set(camera.previousViewProjectionMatrix().data, 16);
    ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
    this._frameIndex++;
  }

  /** Resets the Halton sample index so the next frame restarts the jitter pattern. */
  resetJitter(): void {
    this._frameIndex = 0;
  }

  /**
   * Records the resolve render and the resolved-to-history copy used by the
   * next frame's reprojection.
   *
   * @param encoder Command encoder to record into.
   * @param _ctx Render context (unused).
   */
  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    const pass = encoder.beginRenderPass({
      label: 'TAAPass',
      colorAttachments: [{
        view: this.resolvedView,
        clearValue: [0, 0, 0, 1],
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._uniformBG);
    pass.setBindGroup(1, this._textureBG);
    pass.draw(3);
    pass.end();

    // Copy resolved → history so next frame can reproject into it
    encoder.copyTextureToTexture(
      { texture: this._resolved },
      { texture: this._history },
      { width: this._width, height: this._height },
    );
  }

  /** Releases the resolved + history textures and the uniform buffer. */
  destroy(): void {
    this._resolved.destroy();
    this._history.destroy();
    this._uniformBuffer.destroy();
  }
}
