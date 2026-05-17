import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import type { Texture } from '../../../assets/texture.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import skyWgsl from '../../../shaders/sky.wgsl?raw';

// invViewProj (mat4 = 64) + cameraPos (vec3 = 12) + exposure (4) = 80 bytes
const SKY_UNIFORM_SIZE = 80;

/**
 * How a {@link SkyTexturePass} output is sourced.
 *
 * - `ResourceHandle` — write into the supplied handle.
 * - `'backbuffer'`   — write into the graph's registered backbuffer.
 * - `'auto'`         — use the backbuffer when one is registered; otherwise
 *                      create a transient HDR texture.
 * - `undefined`      — always create a transient HDR (`rgba16float`) texture
 *                      (legacy default).
 */
export type SkyTargetSpec = ResourceHandle | 'backbuffer' | 'auto';

export interface SkyTextureDeps {
  /**
   * Where the sky color is written. See {@link SkyTargetSpec}.
   * Backwards-compatible alias `hdr` is honored when `output` is absent.
   */
  output?: SkyTargetSpec;
  /** @deprecated use `output` instead. */
  hdr?: ResourceHandle;
  /** Defaults to `'clear'` when sky is the first writer, else `'load'`. */
  load?: GPULoadOp;
}

export interface SkyTextureOutputs {
  /** Resulting handle after the sky has been rendered. */
  hdr: ResourceHandle;
}

/**
 * Renders the sky as a fullscreen background by sampling an equirectangular
 * HDR texture (render-graph version).
 *
 * Issued as the first color writer of the frame: clears the HDR target and
 * shades each pixel by reconstructing its world-space view direction from
 * `invViewProj` and sampling the supplied sky texture. Output exposure is
 * configurable per frame.
 */
export class SkyTexturePass extends Pass<SkyTextureDeps, SkyTextureOutputs> {
  readonly name = 'SkyTexturePass';

  /** Output exposure multiplier; uploaded by {@link updateCamera}. */
  exposure = 0.2;

  private readonly _device: GPUDevice;
  private readonly _shader: GPUShaderModule;
  private readonly _pipelineLayout: GPUPipelineLayout;
  private readonly _pipelineCache = new Map<GPUTextureFormat, GPURenderPipeline>();
  private readonly _uniformBuffer: GPUBuffer;
  private readonly _uniformBg: GPUBindGroup;
  private _textureBg: GPUBindGroup;
  private readonly _textureBgl: GPUBindGroupLayout;
  private readonly _sampler: GPUSampler;
  private readonly _scratch = new Float32Array(SKY_UNIFORM_SIZE / 4);

  private constructor(
    device: GPUDevice,
    shader: GPUShaderModule,
    pipelineLayout: GPUPipelineLayout,
    uniformBuffer: GPUBuffer,
    uniformBg: GPUBindGroup,
    textureBg: GPUBindGroup,
    textureBgl: GPUBindGroupLayout,
    sampler: GPUSampler,
  ) {
    super();
    this._device = device;
    this._shader = shader;
    this._pipelineLayout = pipelineLayout;
    this._uniformBuffer = uniformBuffer;
    this._uniformBg = uniformBg;
    this._textureBg = textureBg;
    this._textureBgl = textureBgl;
    this._sampler = sampler;
  }

  static create(ctx: RenderContext, skyTexture: Texture): SkyTexturePass {
    const { device } = ctx;

    const uniformBuffer = device.createBuffer({
      label: 'SkyUniformBuffer',
      size: SKY_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uniformBgl = device.createBindGroupLayout({
      label: 'SkyUniformBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    const textureBgl = device.createBindGroupLayout({
      label: 'SkyTextureBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const sampler = device.createSampler({
      label: 'SkySampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'repeat', addressModeV: 'clamp-to-edge',
    });

    const uniformBg = device.createBindGroup({
      layout: uniformBgl,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const textureBg = device.createBindGroup({
      layout: textureBgl,
      entries: [
        { binding: 0, resource: skyTexture.view },
        { binding: 1, resource: sampler },
      ],
    });

    const shader = ctx.createShaderModule(skyWgsl, 'SkyShader');
    const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [uniformBgl, textureBgl] });

    return new SkyTexturePass(device, shader, pipelineLayout, uniformBuffer, uniformBg, textureBg, textureBgl, sampler);
  }

  private _getPipeline(format: GPUTextureFormat): GPURenderPipeline {
    let pipeline = this._pipelineCache.get(format);
    if (pipeline) return pipeline;
    pipeline = this._device.createRenderPipeline({
      label: `SkyPipeline[${format}]`,
      layout: this._pipelineLayout,
      vertex: { module: this._shader, entryPoint: 'vs_main' },
      fragment: { module: this._shader, entryPoint: 'fs_main', targets: [{ format }] },
      primitive: { topology: 'triangle-list' },
    });
    this._pipelineCache.set(format, pipeline);
    return pipeline;
  }

  /** Replace the equirectangular HDR sky source. */
  setSkyTexture(skyTexture: Texture): void {
    this._textureBg = this._device.createBindGroup({
      layout: this._textureBgl,
      entries: [
        { binding: 0, resource: skyTexture.view },
        { binding: 1, resource: this._sampler },
      ],
    });
  }

  /**
   * Uploads the inverse view-projection (used to reconstruct view directions),
   * camera position, and the current {@link exposure} into the sky uniform
   * buffer. Reads matrices from `ctx.activeCamera`.
   */
  updateCamera(ctx: RenderContext): void {
    const camera = ctx.activeCamera;
    if (!camera) {
      throw new Error('SkyTexturePass.updateCamera: ctx.activeCamera is null');
    }
    const camPos = camera.position();
    const data = this._scratch;
    data.set(camera.inverseViewProjectionMatrix().data, 0);
    data[16] = camPos.x;
    data[17] = camPos.y;
    data[18] = camPos.z;
    data[19] = this.exposure;
    ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: SkyTextureDeps = {}): SkyTextureOutputs {
    const { ctx } = graph;
    const resolved = this._resolveColorTarget(graph, deps.output ?? deps.hdr);
    const format = resolved.format;
    const hasInput = resolved.handle !== null;
    let hdr!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      const target = resolved.handle ?? b.createTexture({
        label: 'sky.hdr',
        format,
        width: ctx.width,
        height: ctx.height,
        extraUsage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
      });
      hdr = b.write(target, 'attachment', {
        loadOp: deps.load ?? (hasInput ? 'load' : 'clear'),
        storeOp: 'store',
        clearValue: [0, 0, 0, 1],
      });
      b.setExecute((pctx) => {
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._getPipeline(format));
        enc.setBindGroup(0, this._uniformBg);
        enc.setBindGroup(1, this._textureBg);
        enc.draw(3);
      });
    });

    return { hdr };
  }

  private _resolveColorTarget(
    graph: RenderGraph,
    spec: SkyTargetSpec | undefined,
  ): { handle: ResourceHandle | null; format: GPUTextureFormat } {
    if (spec === undefined) {
      return { handle: null, format: HDR_FORMAT };
    }
    if (spec === 'backbuffer') {
      const bb = graph.getBackbuffer();
      return { handle: bb, format: graph.ctx.format };
    }
    if (spec === 'auto') {
      try {
        const bb = graph.getBackbuffer();
        return { handle: bb, format: graph.ctx.format };
      } catch {
        return { handle: null, format: HDR_FORMAT };
      }
    }
    const info = graph.getResourceInfo(spec.id);
    return { handle: spec, format: (info?.format as GPUTextureFormat) ?? HDR_FORMAT };
  }

  destroy(): void {
    this._uniformBuffer.destroy();
  }
}
