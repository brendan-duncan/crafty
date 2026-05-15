import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import type { Texture } from '../../../assets/texture.js';
import type { Mat4 } from '../../../math/mat4.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import skyWgsl from '../../../shaders/sky.wgsl?raw';

// invViewProj (mat4 = 64) + cameraPos (vec3 = 12) + exposure (4) = 80 bytes
const SKY_UNIFORM_SIZE = 80;

export interface SkyTextureDeps {
  /**
   * Optional HDR target the sky is written into. When omitted the pass
   * creates a fresh `rgba16float` screen-sized texture (the typical case
   * since the sky is normally the first color writer in the frame).
   */
  hdr?: ResourceHandle;
  /** Defaults to `'clear'` when sky is the first writer, else `'load'`. */
  load?: GPULoadOp;
}

export interface SkyTextureOutputs {
  /** Resulting HDR handle after the sky has been rendered. */
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

  private readonly _device: GPUDevice;
  private readonly _pipeline: GPURenderPipeline;
  private readonly _uniformBuffer: GPUBuffer;
  private readonly _uniformBg: GPUBindGroup;
  private _textureBg: GPUBindGroup;
  private readonly _textureBgl: GPUBindGroupLayout;
  private readonly _sampler: GPUSampler;
  private readonly _scratch = new Float32Array(SKY_UNIFORM_SIZE / 4);

  private constructor(
    device: GPUDevice,
    pipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    uniformBg: GPUBindGroup,
    textureBg: GPUBindGroup,
    textureBgl: GPUBindGroupLayout,
    sampler: GPUSampler,
  ) {
    super();
    this._device = device;
    this._pipeline = pipeline;
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
    const pipeline = device.createRenderPipeline({
      label: 'SkyPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBgl, textureBgl] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new SkyTexturePass(device, pipeline, uniformBuffer, uniformBg, textureBg, textureBgl, sampler);
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
   * camera position, and an exposure multiplier into the sky uniform buffer.
   */
  updateCamera(
    ctx: RenderContext,
    invViewProj: Mat4,
    cameraPos: { x: number; y: number; z: number },
    exposure = 0.2,
  ): void {
    const data = this._scratch;
    data.set(invViewProj.data, 0);
    data[16] = cameraPos.x;
    data[17] = cameraPos.y;
    data[18] = cameraPos.z;
    data[19] = exposure;
    ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: SkyTextureDeps = {}): SkyTextureOutputs {
    const { ctx } = graph;
    const hasInput = !!deps.hdr;
    let target: ResourceHandle = deps.hdr ?? (undefined as unknown as ResourceHandle);
    let hdr!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      if (!hasInput) {
        target = b.createTexture({
          label: 'sky.hdr',
          format: HDR_FORMAT,
          width: ctx.width,
          height: ctx.height,
          extraUsage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
        });
      }
      hdr = b.write(target, 'attachment', {
        loadOp: deps.load ?? (hasInput ? 'load' : 'clear'),
        storeOp: 'store',
        clearValue: [0, 0, 0, 1],
      });
      b.setExecute((pctx) => {
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._uniformBg);
        enc.setBindGroup(1, this._textureBg);
        enc.draw(3);
      });
    });

    return { hdr };
  }

  destroy(): void {
    this._uniformBuffer.destroy();
  }
}
