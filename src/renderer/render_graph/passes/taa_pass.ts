import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import type { Mat4 } from '../../../math/mat4.js';
import { halton } from '../../../math/random.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import taaWgsl from '../../../shaders/taa.wgsl?raw';

/**
 * Adds a sub-pixel NDC offset by folding into the x/y rows of `vp`. A 2D NDC
 * shift is equivalent to adding `jx*w` / `jy*w` to each output, which is the
 * same as adding `jx` / `jy` times the w-row into the x and y rows.
 */
function _applyJitter(vp: Mat4, jx: number, jy: number): Mat4 {
  const m = vp.clone();
  for (let c = 0; c < 4; c++) {
    m.data[c * 4 + 0] += jx * m.data[c * 4 + 3];
    m.data[c * 4 + 1] += jy * m.data[c * 4 + 3];
  }
  return m;
}

const TAA_UNIFORM_SIZE = 128; // invViewProj + prevViewProj

export const TAA_HISTORY_KEY = 'taa:history';

const HISTORY_DESC: TextureDesc = {
  label: 'TAAHistory',
  format: HDR_FORMAT,
  width: 0,  // overwritten per frame
  height: 0,
};

/**
 * How {@link TAAPass} sources its resolve target.
 *
 * - `ResourceHandle` — write into the supplied handle. Must be `rgba16float`.
 * - `'backbuffer'`   — write the canvas directly. Requires the canvas to be
 *                      configured with `rgba16float` (i.e. HDR canvas); throws
 *                      otherwise, because TAA blends in HDR and routing it to a
 *                      SDR canvas produces washed-out output.
 * - `'auto'`         — use the backbuffer when registered AND the canvas format
 *                      is `rgba16float`; otherwise create a transient HDR
 *                      texture (the legacy default).
 * - `undefined`      — always create a transient HDR (`rgba16float`) texture.
 */
export type TAATargetSpec = ResourceHandle | 'backbuffer' | 'auto';

export interface TAADeps {
  /** Lit HDR color to anti-alias. */
  hdr: ResourceHandle;
  /** GBuffer depth32float used for reprojection. */
  depth: ResourceHandle;
  /**
   * Where the resolved frame is written. See {@link TAATargetSpec}. When this
   * routes to the backbuffer, the canvas is also used as the COPY_SRC for the
   * persistent history texture (the graph's `RenderContext` configures the
   * swapchain with COPY_SRC).
   */
  output?: TAATargetSpec;
}

export interface TAAOutputs {
  /** Resolved (history-blended) HDR. */
  resolved: ResourceHandle;
  /** Persistent history texture for next frame's SSGI reads. */
  history: ResourceHandle;
}

/**
 * Temporal anti-aliasing pass (render-graph version).
 *
 * Reprojects the previous frame's history into the current frame and blends
 * with the jittered lit color to converge sub-pixel detail. The history
 * texture is persistent in the graph cache so SSGI and the next frame's TAA
 * can read it.
 */
export class TAAPass extends Pass<TAADeps, TAAOutputs> {
  readonly name = 'TAAPass';

  private readonly _pipeline: GPURenderPipeline;
  private readonly _textureBgl: GPUBindGroupLayout;
  private readonly _uniformBg: GPUBindGroup;
  private readonly _uniformBuffer: GPUBuffer;
  private readonly _sampler: GPUSampler;
  private readonly _scratch = new Float32Array(TAA_UNIFORM_SIZE / 4);

  /** Halton sample count before the jitter sequence repeats. */
  sampleCount = 16;
  private _frameIndex = 0;
  private _prevViewProj: Mat4 | null = null;

  private constructor(
    pipeline: GPURenderPipeline,
    textureBgl: GPUBindGroupLayout,
    uniformBg: GPUBindGroup,
    uniformBuffer: GPUBuffer,
    sampler: GPUSampler,
  ) {
    super();
    this._pipeline = pipeline;
    this._textureBgl = textureBgl;
    this._uniformBg = uniformBg;
    this._uniformBuffer = uniformBuffer;
    this._sampler = sampler;
  }

  static create(ctx: RenderContext): TAAPass {
    const { device } = ctx;

    const uniformBuffer = device.createBuffer({
      label: 'TAAUniformBuffer',
      size: TAA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uniformBgl = device.createBindGroupLayout({
      label: 'TAAUniformBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const textureBgl = device.createBindGroupLayout({
      label: 'TAATextureBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const sampler = device.createSampler({
      label: 'TAALinearSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const uniformBg = device.createBindGroup({
      layout: uniformBgl,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const shader = ctx.createShaderModule(taaWgsl, 'TAAShader');
    const pipeline = device.createRenderPipeline({
      label: 'TAAPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBgl, textureBgl] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new TAAPass(pipeline, textureBgl, uniformBg, uniformBuffer, sampler);
  }

  /** Previous frame's un-jittered viewProj (for SSGI reprojection etc.), or null until the first {@link updateCamera}. */
  get prevViewProj(): Mat4 | null {
    return this._prevViewProj;
  }

  /**
   * Returns a sub-pixel jittered viewProj for this frame's vertex passes.
   * Pure: does not mutate jitter state — that happens in {@link updateCamera}.
   */
  jitter(ctx: RenderContext, viewProj: Mat4): Mat4 {
    const hi = (this._frameIndex % this.sampleCount) + 1;
    const jx = (halton(hi, 2) - 0.5) * (2 / ctx.width);
    const jy = (halton(hi, 3) - 0.5) * (2 / ctx.height);
    return _applyJitter(viewProj, jx, jy);
  }

  /**
   * Upload reprojection uniforms and advance jitter state for next frame.
   *
   * `viewProj` is the current frame's un-jittered VP. The pass writes
   * `prevViewProj ?? viewProj` to the TAA uniform (so the first frame reprojects
   * from itself, no ghosting), then stores `viewProj` as next frame's previous
   * and bumps the Halton index.
   *
   * Call **after** any other pass that reads {@link prevViewProj}
   * (e.g. `SSGIPass.updateCamera`) — this call mutates internal state.
   */
  updateCamera(ctx: RenderContext, invViewProj: Mat4, viewProj: Mat4): void {
    const prev = this._prevViewProj ?? viewProj;
    const data = this._scratch;
    data.set(invViewProj.data, 0);
    data.set(prev.data, 16);
    ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
    this._prevViewProj = viewProj;
    this._frameIndex++;
  }

  /** Clears jitter history so the next frame reprojects from itself, not stale data. */
  resetJitter(): void {
    this._frameIndex = 0;
    this._prevViewProj = null;
  }

  addToGraph(graph: RenderGraph, deps: TAADeps): TAAOutputs {
    const { ctx } = graph;
    const explicitTarget = this._resolveTarget(graph, deps.output);

    const history = graph.importPersistentTexture(TAA_HISTORY_KEY, {
      ...HISTORY_DESC,
      width: ctx.width,
      height: ctx.height,
    });

    let resolved!: ResourceHandle;
    let nextHistory!: ResourceHandle;

    // Pass 1: render the resolved frame from {hdr, history, depth}.
    graph.addPass('TAAPass.resolve', 'render', (b: PassBuilder) => {
      const target = explicitTarget ?? b.createTexture({
        label: 'TAAResolved',
        format: HDR_FORMAT,
        width: ctx.width,
        height: ctx.height,
        extraUsage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
      });
      resolved = b.write(target, 'attachment', {
        loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1],
      });
      b.read(deps.hdr, 'sampled');
      b.read(history, 'sampled');
      b.read(deps.depth, 'sampled');

      b.setExecute((pctx, res) => {
        const textureBg = res.getOrCreateBindGroup({
          layout: this._textureBgl,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.hdr) },
            { binding: 1, resource: res.getTextureView(history) },
            { binding: 2, resource: res.getTextureView(deps.depth) },
            { binding: 3, resource: this._sampler },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._uniformBg);
        enc.setBindGroup(1, textureBg);
        enc.draw(3);
      });
    });

    // Pass 2: copy resolved → history for next frame.
    graph.addPass('TAAPass.copyHistory', 'transfer', (b: PassBuilder) => {
      b.read(resolved, 'copy-src');
      nextHistory = b.write(history, 'copy-dst');
      b.setExecute((pctx, res) => {
        pctx.commandEncoder.copyTextureToTexture(
          { texture: res.getTexture(resolved) },
          { texture: res.getTexture(history) },
          { width: ctx.width, height: ctx.height },
        );
      });
    });

    return { resolved, history: nextHistory };
  }

  /**
   * Resolve a {@link TAATargetSpec} into an explicit handle (or null to mean
   * "create a transient"). Throws when the spec asks for an incompatible
   * target (e.g. an explicit `'backbuffer'` on a SDR canvas).
   */
  private _resolveTarget(graph: RenderGraph, spec: TAATargetSpec | undefined): ResourceHandle | null {
    if (spec === undefined) return null;
    if (spec === 'backbuffer') {
      const bb = graph.getBackbuffer();
      const info = graph.getResourceInfo(bb.id);
      if (info?.format !== HDR_FORMAT) {
        throw new Error(
          `[TAAPass] output: 'backbuffer' requires canvas format ${HDR_FORMAT}, got ${info?.format}.`,
        );
      }
      return bb;
    }
    if (spec === 'auto') {
      try {
        const bb = graph.getBackbuffer();
        const info = graph.getResourceInfo(bb.id);
        // Only safe on an HDR canvas — see TAATargetSpec doc.
        return info?.format === HDR_FORMAT ? bb : null;
      } catch {
        return null;
      }
    }
    const info = graph.getResourceInfo(spec.id);
    if (info?.format !== HDR_FORMAT) {
      throw new Error(
        `[TAAPass] output handle must have format ${HDR_FORMAT}, got ${info?.format}.`,
      );
    }
    return spec;
  }

  destroy(): void {
    this._uniformBuffer.destroy();
  }
}
