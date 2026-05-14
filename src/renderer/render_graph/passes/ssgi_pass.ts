import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import type { Mat4 } from '../../../math/mat4.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import ssgiWgsl from '../../../shaders/ssgi.wgsl?raw';
import ssgiTemporalWgsl from '../../../shaders/ssgi_temporal.wgsl?raw';

const UNIFORM_SIZE = 368;

export interface SSGISettings {
  numRays: number;
  numSteps: number;
  radius: number;
  thickness: number;
  strength: number;
}

export const DEFAULT_SSGI: SSGISettings = {
  numRays: 4, numSteps: 16, radius: 3.0, thickness: 0.5, strength: 1.0,
};

export const SSGI_HISTORY_KEY = 'ssgi:history';

function generateNoise(): Uint8Array<ArrayBuffer> {
  const noise = new Uint8Array(new ArrayBuffer(16 * 4));
  for (let i = 0; i < 16; i++) {
    const angle = Math.random() * Math.PI * 2;
    noise[i * 4 + 0] = Math.round((Math.cos(angle) * 0.5 + 0.5) * 255);
    noise[i * 4 + 1] = Math.round((Math.sin(angle) * 0.5 + 0.5) * 255);
    noise[i * 4 + 2] = 128;
    noise[i * 4 + 3] = 255;
  }
  return noise;
}

export interface SSGIDeps {
  /** Previous-frame radiance to bounce light from (typically TAA history). */
  prevRadiance: ResourceHandle;
  /** GBuffer normal+metallic. */
  normal: ResourceHandle;
  /** GBuffer depth. */
  depth: ResourceHandle;
}

export interface SSGIOutputs {
  /** Temporally-accumulated GI texture. */
  result: ResourceHandle;
}

/**
 * Screen-space global illumination (render-graph version).
 *
 * Two render passes plus a copy:
 *   1. ray march → raw GI
 *   2. temporal accumulate raw + history → result
 *   3. copy result → history
 */
export class SSGIPass extends Pass<SSGIDeps, SSGIOutputs> {
  readonly name = 'SSGIPass';

  private readonly _device: GPUDevice;
  private readonly _uniformBuffer: GPUBuffer;
  private readonly _noiseTex: GPUTexture;
  private readonly _noiseView: GPUTextureView;
  private readonly _ssgiPipeline: GPURenderPipeline;
  private readonly _temporalPipeline: GPURenderPipeline;
  private readonly _ssgiTexBgl: GPUBindGroupLayout;
  private readonly _tempTexBgl: GPUBindGroupLayout;
  private readonly _uniformBg: GPUBindGroup;
  private readonly _sampler: GPUSampler;

  private _settings: SSGISettings = DEFAULT_SSGI;
  private _frameIndex = 0;
  private readonly _scratch = new Float32Array(UNIFORM_SIZE / 4);
  private readonly _scratchU32 = new Uint32Array(this._scratch.buffer);

  private constructor(
    device: GPUDevice,
    uniformBuffer: GPUBuffer,
    noiseTex: GPUTexture,
    noiseView: GPUTextureView,
    ssgiPipeline: GPURenderPipeline,
    temporalPipeline: GPURenderPipeline,
    ssgiTexBgl: GPUBindGroupLayout,
    tempTexBgl: GPUBindGroupLayout,
    uniformBg: GPUBindGroup,
    sampler: GPUSampler,
  ) {
    super();
    this._device = device;
    this._uniformBuffer = uniformBuffer;
    this._noiseTex = noiseTex;
    this._noiseView = noiseView;
    this._ssgiPipeline = ssgiPipeline;
    this._temporalPipeline = temporalPipeline;
    this._ssgiTexBgl = ssgiTexBgl;
    this._tempTexBgl = tempTexBgl;
    this._uniformBg = uniformBg;
    this._sampler = sampler;
  }

  static create(ctx: RenderContext): SSGIPass {
    const { device } = ctx;

    const uniformBuffer = device.createBuffer({
      label: 'SSGIUniforms', size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const noiseTex = device.createTexture({
      label: 'SSGINoise', size: { width: 4, height: 4 },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    device.queue.writeTexture({ texture: noiseTex }, generateNoise(),
      { bytesPerRow: 4 * 4, rowsPerImage: 4 }, { width: 4, height: 4 });

    const sampler = device.createSampler({
      label: 'SSGILinearSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const uniformBgl = device.createBindGroupLayout({
      label: 'SSGIUniformBGL',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX,
        buffer: { type: 'uniform' },
      }],
    });
    const ssgiTexBgl = device.createBindGroupLayout({
      label: 'SSGITexBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });
    const tempTexBgl = device.createBindGroupLayout({
      label: 'SSGITempTexBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const uniformBg = device.createBindGroup({
      layout: uniformBgl,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const ssgiShader = ctx.createShaderModule(ssgiWgsl, 'SSGIShader');
    const temporalShader = ctx.createShaderModule(ssgiTemporalWgsl, 'SSGITempShader');

    const ssgiPipeline = device.createRenderPipeline({
      label: 'SSGIPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBgl, ssgiTexBgl] }),
      vertex: { module: ssgiShader, entryPoint: 'vs_main' },
      fragment: { module: ssgiShader, entryPoint: 'fs_ssgi', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });
    const temporalPipeline = device.createRenderPipeline({
      label: 'SSGITempPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBgl, tempTexBgl] }),
      vertex: { module: temporalShader, entryPoint: 'vs_main' },
      fragment: { module: temporalShader, entryPoint: 'fs_temporal', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new SSGIPass(
      device, uniformBuffer, noiseTex, noiseTex.createView(),
      ssgiPipeline, temporalPipeline,
      ssgiTexBgl, tempTexBgl,
      uniformBg, sampler,
    );
  }

  /** Upload per-frame camera + settings + frame counter. */
  updateCamera(
    ctx: RenderContext,
    view: Mat4, proj: Mat4, invProj: Mat4, invViewProj: Mat4, prevViewProj: Mat4,
    camPos: { x: number; y: number; z: number },
  ): void {
    const data = this._scratch;
    data.set(view.data, 0);
    data.set(proj.data, 16);
    data.set(invProj.data, 32);
    data.set(invViewProj.data, 48);
    data.set(prevViewProj.data, 64);
    data[80] = camPos.x; data[81] = camPos.y; data[82] = camPos.z;
    const u32 = this._scratchU32;
    u32[83] = this._settings.numRays;
    u32[84] = this._settings.numSteps;
    data[85] = this._settings.radius;
    data[86] = this._settings.thickness;
    data[87] = this._settings.strength;
    u32[88] = this._frameIndex++;
    ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
  }

  updateSettings(settings: Partial<SSGISettings>): void {
    this._settings = { ...this._settings, ...settings };
  }

  addToGraph(graph: RenderGraph, deps: SSGIDeps): SSGIOutputs {
    const { ctx } = graph;
    const fullDesc: TextureDesc = { format: HDR_FORMAT, width: ctx.width, height: ctx.height };

    const history = graph.importPersistentTexture(SSGI_HISTORY_KEY, {
      ...fullDesc,
      label: 'SSGIHistory',
    });

    let raw!: ResourceHandle;
    let result!: ResourceHandle;

    // 1. Ray march → raw
    graph.addPass('SSGIPass.rayMarch', 'render', (b: PassBuilder) => {
      raw = b.createTexture({ label: 'SSGIRaw', ...fullDesc });
      raw = b.write(raw, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 0] });
      b.read(deps.depth, 'sampled');
      b.read(deps.normal, 'sampled');
      b.read(deps.prevRadiance, 'sampled');
      b.setExecute((pctx, res) => {
        const bg = this._device.createBindGroup({
          layout: this._ssgiTexBgl,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.depth) },
            { binding: 1, resource: res.getTextureView(deps.normal) },
            { binding: 2, resource: res.getTextureView(deps.prevRadiance) },
            { binding: 3, resource: this._noiseView },
            { binding: 4, resource: this._sampler },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._ssgiPipeline);
        enc.setBindGroup(0, this._uniformBg);
        enc.setBindGroup(1, bg);
        enc.draw(3);
      });
    });

    // 2. Temporal accumulate
    graph.addPass('SSGIPass.temporal', 'render', (b: PassBuilder) => {
      result = b.createTexture({
        label: 'SSGIResult',
        ...fullDesc,
        extraUsage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
      });
      result = b.write(result, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 0] });
      b.read(raw, 'sampled');
      b.read(history, 'sampled');
      b.read(deps.depth, 'sampled');
      b.setExecute((pctx, res) => {
        const bg = this._device.createBindGroup({
          layout: this._tempTexBgl,
          entries: [
            { binding: 0, resource: res.getTextureView(raw) },
            { binding: 1, resource: res.getTextureView(history) },
            { binding: 2, resource: res.getTextureView(deps.depth) },
            { binding: 3, resource: this._sampler },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._temporalPipeline);
        enc.setBindGroup(0, this._uniformBg);
        enc.setBindGroup(1, bg);
        enc.draw(3);
      });
    });

    // 3. Copy result → history for next frame
    graph.addPass('SSGIPass.copyHistory', 'transfer', (b: PassBuilder) => {
      b.read(result, 'copy-src');
      b.write(history, 'copy-dst');
      b.setExecute((pctx, res) => {
        pctx.commandEncoder.copyTextureToTexture(
          { texture: res.getTexture(result) },
          { texture: res.getTexture(history) },
          { width: ctx.width, height: ctx.height },
        );
      });
    });

    return { result };
  }

  destroy(): void {
    this._uniformBuffer.destroy();
    this._noiseTex.destroy();
  }
}
