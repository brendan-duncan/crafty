import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { GBuffer } from '../gbuffer.js';
import type { Mat4 } from '../../math/mat4.js';
import { HDR_FORMAT } from './lighting_pass.js';
import ssgiWgsl from '../../shaders/ssgi.wgsl?raw';
import ssgiTemporalWgsl from '../../shaders/ssgi_temporal.wgsl?raw';

// 5×mat4(320) + camPos(12) + numRays+numSteps+radius+thickness+strength+frameIndex(24) = 356 → padded to 368
const UNIFORM_SIZE = 368;

/**
 * Tuning parameters for the screen-space global illumination ray march.
 */
export interface SSGISettings {
  /** Number of stochastic rays cast per pixel per frame. */
  numRays  : number;
  /** Number of march steps along each ray. */
  numSteps : number;
  /** Maximum march distance in view-space units. */
  radius   : number;
  /** Surface thickness used for hit acceptance during ray marching. */
  thickness: number;
  /** Output intensity multiplier for the GI contribution. */
  strength : number;
}

/** Default SSGI settings tuned for typical scenes. */
export const DEFAULT_SSGI: SSGISettings = {
  numRays: 4, numSteps: 16, radius: 3.0, thickness: 0.5, strength: 1.0,
};

function generateNoise(): Uint8Array<ArrayBuffer> {
  const noise = new Uint8Array(new ArrayBuffer(16 * 4)); // 4×4 rgba8unorm
  for (let i = 0; i < 16; i++) {
    const angle = Math.random() * Math.PI * 2;
    noise[i * 4 + 0] = Math.round((Math.cos(angle) * 0.5 + 0.5) * 255);
    noise[i * 4 + 1] = Math.round((Math.sin(angle) * 0.5 + 0.5) * 255);
    noise[i * 4 + 2] = 128;
    noise[i * 4 + 3] = 255;
  }
  return noise;
}

/**
 * Screen-space global illumination pass. Casts stochastic rays in screen space
 * against the previous frame's lit radiance to estimate one bounce of indirect
 * light, then accumulates the result temporally using a reprojected history.
 *
 * Inputs sampled: G-buffer depth and normal/metallic, previous-frame radiance,
 * tiled noise, and the SSGI history buffer.
 * Output: temporally-stable indirect radiance exposed as `resultView`.
 */
export class SSGIPass extends RenderPass {
  readonly name = 'SSGIPass';

  /** Final temporally-accumulated GI texture view, consumed by downstream passes. */
  readonly resultView: GPUTextureView;

  private _uniformBuffer : GPUBuffer;
  private _noiseTexture  : GPUTexture;
  private _rawTexture    : GPUTexture;
  private _rawView       : GPUTextureView;
  private _historyTexture: GPUTexture;
  private _resultTexture : GPUTexture;

  private _ssgiPipeline    : GPURenderPipeline;
  private _temporalPipeline: GPURenderPipeline;
  private _ssgiBG0 : GPUBindGroup;
  private _ssgiBG1 : GPUBindGroup;
  private _tempBG0 : GPUBindGroup;
  private _tempBG1 : GPUBindGroup;

  private _settings  : SSGISettings;
  private _frameIndex: number = 0;

  private readonly _width : number;
  private readonly _height: number;

  private constructor(
    uniformBuffer: GPUBuffer,
    noiseTexture: GPUTexture,
    rawTexture: GPUTexture,
    rawView: GPUTextureView,
    historyTexture: GPUTexture,
    resultTexture: GPUTexture,
    resultView: GPUTextureView,
    ssgiPipeline: GPURenderPipeline,
    temporalPipeline: GPURenderPipeline,
    ssgiBG0: GPUBindGroup,
    ssgiBG1: GPUBindGroup,
    tempBG0: GPUBindGroup,
    tempBG1: GPUBindGroup,
    settings: SSGISettings,
    width: number,
    height: number,
  ) {
    super();
    this._uniformBuffer   = uniformBuffer;
    this._noiseTexture    = noiseTexture;
    this._rawTexture      = rawTexture;
    this._rawView         = rawView;
    this._historyTexture  = historyTexture;
    this._resultTexture   = resultTexture;
    this.resultView       = resultView;
    this._ssgiPipeline    = ssgiPipeline;
    this._temporalPipeline = temporalPipeline;
    this._ssgiBG0 = ssgiBG0;
    this._ssgiBG1 = ssgiBG1;
    this._tempBG0 = tempBG0;
    this._tempBG1 = tempBG1;
    this._settings  = settings;
    this._width  = width;
    this._height = height;
  }

  /**
   * Constructs the pass and allocates uniform buffer, noise, raw/history/result
   * textures, pipelines, and bind groups.
   *
   * @param ctx Render context providing the device and screen size.
   * @param gbuffer G-buffer providing depth and normal/metallic views.
   * @param prevRadianceView Previous-frame lit radiance texture sampled by ray hits.
   * @param settings Initial SSGI tuning parameters.
   * @returns Configured SSGIPass instance.
   */
  static create(
    ctx: RenderContext,
    gbuffer: GBuffer,
    prevRadianceView: GPUTextureView,
    settings: SSGISettings = DEFAULT_SSGI,
  ): SSGIPass {
    const { device, width, height } = ctx;

    const uniformBuffer = device.createBuffer({
      label: 'SSGIUniforms', size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const noiseTex = device.createTexture({
      label: 'SSGINoise', size: { width: 4, height: 4 },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    device.queue.writeTexture(
      { texture: noiseTex },
      generateNoise(),
      { bytesPerRow: 4 * 4, rowsPerImage: 4 },
      { width: 4, height: 4 },
    );
    const noiseView = noiseTex.createView();

    const rawTexture = device.createTexture({
      label: 'SSGIRaw', size: { width, height }, format: HDR_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    const rawView = rawTexture.createView();

    const historyTexture = device.createTexture({
      label: 'SSGIHistory', size: { width, height }, format: HDR_FORMAT,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });
    const historyView = historyTexture.createView();

    const resultTexture = device.createTexture({
      label: 'SSGIResult', size: { width, height }, format: HDR_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
    });
    const resultView = resultTexture.createView();

    const linSampler = device.createSampler({
      label: 'SSGILinearSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    // ─── SSGI ray march bind group layouts ────────────────────────────────────
    const uniformBGL = device.createBindGroupLayout({
      label: 'SSGIUniformBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });

    const ssgiTexBGL = device.createBindGroupLayout({
      label: 'SSGITexBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    // ─── Temporal accumulation bind group layout ──────────────────────────────
    const tempTexBGL = device.createBindGroupLayout({
      label: 'SSGITempTexBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const ssgiBG0 = device.createBindGroup({
      label: 'SSGIUniformBG', layout: uniformBGL,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const ssgiBG1 = device.createBindGroup({
      label: 'SSGITexBG', layout: ssgiTexBGL,
      entries: [
        { binding: 0, resource: gbuffer.depthView },
        { binding: 1, resource: gbuffer.normalMetallicView },
        { binding: 2, resource: prevRadianceView },
        { binding: 3, resource: noiseView },
        { binding: 4, resource: linSampler },
      ],
    });

    const tempBG0 = device.createBindGroup({
      label: 'SSGITempUniformBG', layout: uniformBGL,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const tempBG1 = device.createBindGroup({
      label: 'SSGITempTexBG', layout: tempTexBGL,
      entries: [
        { binding: 0, resource: rawView },
        { binding: 1, resource: historyView },
        { binding: 2, resource: gbuffer.depthView },
        { binding: 3, resource: linSampler },
      ],
    });

    const ssgiShader    = device.createShaderModule({ label: 'SSGIShader',    code: ssgiWgsl         });
    const temporalShader = device.createShaderModule({ label: 'SSGITempShader', code: ssgiTemporalWgsl });

    const ssgiPipeline = device.createRenderPipeline({
      label: 'SSGIPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBGL, ssgiTexBGL] }),
      vertex:   { module: ssgiShader, entryPoint: 'vs_main' },
      fragment: { module: ssgiShader, entryPoint: 'fs_ssgi', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const temporalPipeline = device.createRenderPipeline({
      label: 'SSGITempPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBGL, tempTexBGL] }),
      vertex:   { module: temporalShader, entryPoint: 'vs_main' },
      fragment: { module: temporalShader, entryPoint: 'fs_temporal', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new SSGIPass(
      uniformBuffer, noiseTex,
      rawTexture, rawView, historyTexture, resultTexture, resultView,
      ssgiPipeline, temporalPipeline,
      ssgiBG0, ssgiBG1, tempBG0, tempBG1,
      settings, width, height,
    );
  }

  /**
   * Uploads the per-frame camera matrices, camera position, current SSGI
   * settings, and increments the frame index used to decorrelate noise.
   * Call once per frame before {@link execute}.
   *
   * @param ctx Render context whose queue receives the buffer write.
   * @param view World-to-view matrix.
   * @param proj View-to-clip matrix.
   * @param invProj Inverse of `proj` for view-space reconstruction.
   * @param invViewProj Inverse of view*proj for world-space reconstruction.
   * @param prevViewProj Previous frame's view*proj for temporal reprojection.
   * @param camPos Current world-space camera position.
   */
  updateCamera(
    ctx: RenderContext,
    view: Mat4, proj: Mat4, invProj: Mat4, invViewProj: Mat4, prevViewProj: Mat4,
    camPos: { x: number; y: number; z: number },
  ): void {
    const data = new Float32Array(UNIFORM_SIZE / 4);
    data.set(view.data,         0);
    data.set(proj.data,        16);
    data.set(invProj.data,     32);
    data.set(invViewProj.data, 48);
    data.set(prevViewProj.data, 64);
    data[80] = camPos.x; data[81] = camPos.y; data[82] = camPos.z;

    const u32 = new Uint32Array(data.buffer);
    u32[83] = this._settings.numRays;
    u32[84] = this._settings.numSteps;
    data[85] = this._settings.radius;
    data[86] = this._settings.thickness;
    data[87] = this._settings.strength;
    u32[88]  = this._frameIndex++;

    ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
  }

  /**
   * Merges the given fields into the current SSGI settings; the new values
   * take effect on the next {@link updateCamera} call that uploads them.
   *
   * @param settings Partial settings to overlay onto the current ones.
   */
  updateSettings(settings: Partial<SSGISettings>): void {
    this._settings = { ...this._settings, ...settings };
  }

  /**
   * Records the ray-march, temporal accumulation, and history copy sub-passes.
   *
   * @param encoder Command encoder to record into.
   * @param _ctx Render context (unused).
   */
  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    // 1. Ray march → raw SSGI
    {
      const pass = encoder.beginRenderPass({
        label: 'SSGIRayMarch',
        colorAttachments: [{ view: this._rawView, clearValue: [0, 0, 0, 0], loadOp: 'clear', storeOp: 'store' }],
      });
      pass.setPipeline(this._ssgiPipeline);
      pass.setBindGroup(0, this._ssgiBG0);
      pass.setBindGroup(1, this._ssgiBG1);
      pass.draw(3);
      pass.end();
    }

    // 2. Temporal accumulation → result
    {
      const pass = encoder.beginRenderPass({
        label: 'SSGITemporal',
        colorAttachments: [{ view: this.resultView, clearValue: [0, 0, 0, 0], loadOp: 'clear', storeOp: 'store' }],
      });
      pass.setPipeline(this._temporalPipeline);
      pass.setBindGroup(0, this._tempBG0);
      pass.setBindGroup(1, this._tempBG1);
      pass.draw(3);
      pass.end();
    }

    // 3. Copy result → history for next frame's accumulation
    encoder.copyTextureToTexture(
      { texture: this._resultTexture },
      { texture: this._historyTexture },
      { width: this._width, height: this._height },
    );
  }

  /** Releases the uniform buffer, noise texture, and raw/history/result textures. */
  destroy(): void {
    this._uniformBuffer.destroy();
    this._noiseTexture.destroy();
    this._rawTexture.destroy();
    this._historyTexture.destroy();
    this._resultTexture.destroy();
  }
}
