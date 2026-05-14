import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import type { Mat4 } from '../../../math/mat4.js';
import compositeWgsl from '../../../shaders/composite.wgsl?raw';

// Merged replacement for FogPass + UnderwaterPass + TonemapPass.

// params uniform layout (64 bytes):
//  [0..2]  fog_color
//  [3]     depth_density
//  [4]     depth_begin
//  [5]     depth_end
//  [6]     depth_curve
//  [7]     height_density
//  [8]     height_min
//  [9]     height_max
//  [10]    height_curve
//  [11]    fog_flags  (u32: bit 0 = depth, bit 1 = height)
//  [12]    uw_time
//  [13]    is_underwater
//  [14]    tonemap_flags (u32: bit 0 = aces, bit 1 = debug_ao, bit 2 = hdr_canvas)
//  [15]    _pad
const PARAMS_SIZE = 64;
const STAR_UNI_SIZE = 96;

export interface CompositeDeps {
  /** Post-bloom (or post-DOF/TAA) HDR scene texture. */
  input: ResourceHandle;
  /** SSAO occlusion texture (used for the debug-AO output mode). */
  ao: ResourceHandle;
  /** GBuffer depth32float for fog reconstruction and stars. */
  depth: ResourceHandle;
  /** Shared CameraUniforms (typically owned by DeferredLightingPass). */
  cameraBuffer: ResourceHandle;
  /** Shared LightUniforms (only sun direction is read). */
  lightBuffer: ResourceHandle;
  /** Auto-exposure storage buffer used for tonemapping. */
  exposureBuffer: ResourceHandle;
  /** Backbuffer attachment to write to. */
  backbuffer: ResourceHandle;
}

/**
 * Final fullscreen pass that composes the post-processed HDR scene with fog,
 * stars, the underwater effect and tonemapping into the backbuffer
 * (render-graph version). Replaces the legacy fog + underwater + tonemap
 * pass chain by combining all three operations in a single fragment shader,
 * eliminating two intermediate HDR textures and two render-pass boundaries.
 */
export class CompositePass extends Pass<CompositeDeps, void> {
  readonly name = 'CompositePass';

  // ── Fog properties ────────────────────────────────────────────────────────
  depthFogEnabled = true;
  depthDensity = 1.0;
  depthBegin = 32;
  depthEnd = 128;
  depthCurve = 1.5;
  heightFogEnabled = false;
  heightDensity = 0.7;
  heightMin = 48;
  heightMax = 80;
  heightCurve = 1.0;
  fogColor: [number, number, number] = [1.0, 1.0, 1.0];

  private readonly _device: GPUDevice;
  private readonly _pipeline: GPURenderPipeline;
  private readonly _texturesBgl: GPUBindGroupLayout;
  private readonly _bufBgl: GPUBindGroupLayout;
  private readonly _paramsBgl: GPUBindGroupLayout;
  private readonly _paramsBuf: GPUBuffer;
  private readonly _starBuf: GPUBuffer;
  private readonly _sampler: GPUSampler;
  private readonly _paramsAB = new ArrayBuffer(PARAMS_SIZE);
  private readonly _paramsF = new Float32Array(this._paramsAB);
  private readonly _paramsU = new Uint32Array(this._paramsAB);
  private readonly _starScratch = new Float32Array(STAR_UNI_SIZE / 4);

  private constructor(
    device: GPUDevice,
    pipeline: GPURenderPipeline,
    texturesBgl: GPUBindGroupLayout,
    bufBgl: GPUBindGroupLayout,
    paramsBgl: GPUBindGroupLayout,
    paramsBuf: GPUBuffer,
    starBuf: GPUBuffer,
    sampler: GPUSampler,
  ) {
    super();
    this._device = device;
    this._pipeline = pipeline;
    this._texturesBgl = texturesBgl;
    this._bufBgl = bufBgl;
    this._paramsBgl = paramsBgl;
    this._paramsBuf = paramsBuf;
    this._starBuf = starBuf;
    this._sampler = sampler;
  }

  static create(ctx: RenderContext): CompositePass {
    const { device, format } = ctx;

    const texturesBgl = device.createBindGroupLayout({
      label: 'CompositeBGL0',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const bufBgl = device.createBindGroupLayout({
      label: 'CompositeBGL1',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }, // camera
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }, // light
      ],
    });

    const paramsBgl = device.createBindGroupLayout({
      label: 'CompositeBGL2',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
      ],
    });

    const sampler = device.createSampler({ label: 'CompositeSampler', magFilter: 'linear', minFilter: 'linear' });
    const paramsBuf = device.createBuffer({ label: 'CompositeParams', size: PARAMS_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const starBuf = device.createBuffer({ label: 'CompositeStars', size: STAR_UNI_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });

    // The exposure binding inside the params bind group is rebuilt per-frame
    // since it references a virtual buffer; here we only build the layout +
    // params/stars sub-bindings. The full bind group is constructed in setExecute.
    // Instead, store paramsBgl and rebuild per frame.

    const shader = device.createShaderModule({ label: 'CompositeShader', code: compositeWgsl });
    const pipeline = device.createRenderPipeline({
      label: 'CompositePipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [texturesBgl, bufBgl, paramsBgl] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format }] },
      primitive: { topology: 'triangle-list' },
    });

    // The bind group for params/stars/exposure is rebuilt each frame inside
    // setExecute, since the exposure buffer comes from a virtual handle whose
    // physical resource may differ from frame to frame.
    return new CompositePass(device, pipeline, texturesBgl, bufBgl, paramsBgl, paramsBuf, starBuf, sampler);
  }

  /** Pack fog/underwater/tonemap parameters into the GPU uniform buffer. */
  updateParams(
    ctx: RenderContext,
    isUnderwater: boolean,
    uwTime: number,
    aces: boolean,
    debugAO: boolean,
    hdrCanvas: boolean,
  ): void {
    const f = this._paramsF;
    const u = this._paramsU;

    let fogFlags = 0;
    if (this.depthFogEnabled) fogFlags |= 1;
    if (this.heightFogEnabled) fogFlags |= 2;

    let tonemapFlags = 0;
    if (aces) tonemapFlags |= 1;
    if (debugAO) tonemapFlags |= 2;
    if (hdrCanvas) tonemapFlags |= 4;

    f[0] = this.fogColor[0]; f[1] = this.fogColor[1]; f[2] = this.fogColor[2];
    f[3] = this.depthDensity;
    f[4] = this.depthBegin;
    f[5] = this.depthEnd;
    f[6] = this.depthCurve;
    f[7] = this.heightDensity;
    f[8] = this.heightMin;
    f[9] = this.heightMax;
    f[10] = this.heightCurve;
    u[11] = fogFlags;
    f[12] = uwTime;
    f[13] = isUnderwater ? 1.0 : 0.0;
    u[14] = tonemapFlags;
    f[15] = 0;

    ctx.queue.writeBuffer(this._paramsBuf, 0, this._paramsAB);
  }

  updateStars(
    ctx: RenderContext,
    invViewProj: Mat4,
    camPos: { x: number; y: number; z: number },
    sunDir: { x: number; y: number; z: number },
  ): void {
    const data = this._starScratch;
    data.set(invViewProj.data, 0);
    data[16] = camPos.x; data[17] = camPos.y; data[18] = camPos.z; data[19] = 0;
    data[20] = sunDir.x; data[21] = sunDir.y; data[22] = sunDir.z; data[23] = 0;
    ctx.queue.writeBuffer(this._starBuf, 0, data.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: CompositeDeps): void {
    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      b.read(deps.input, 'sampled');
      b.read(deps.ao, 'sampled');
      b.read(deps.depth, 'sampled');
      b.read(deps.cameraBuffer, 'uniform');
      b.read(deps.lightBuffer, 'uniform');
      b.read(deps.exposureBuffer, 'storage-read');
      b.write(deps.backbuffer, 'attachment', {
        loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1],
      });

      b.setExecute((pctx, res) => {
        const bg0 = this._device.createBindGroup({
          label: 'CompositeBG0',
          layout: this._texturesBgl,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.input) },
            { binding: 1, resource: res.getTextureView(deps.ao) },
            { binding: 2, resource: res.getTextureView(deps.depth) },
            { binding: 3, resource: this._sampler },
          ],
        });
        const bg1 = this._device.createBindGroup({
          label: 'CompositeBG1',
          layout: this._bufBgl,
          entries: [
            { binding: 0, resource: { buffer: res.getBuffer(deps.cameraBuffer) } },
            { binding: 1, resource: { buffer: res.getBuffer(deps.lightBuffer) } },
          ],
        });
        const bg2 = this._device.createBindGroup({
          label: 'CompositeBG2',
          layout: this._paramsBgl,
          entries: [
            { binding: 0, resource: { buffer: this._paramsBuf } },
            { binding: 1, resource: { buffer: this._starBuf } },
            { binding: 2, resource: { buffer: res.getBuffer(deps.exposureBuffer) } },
          ],
        });

        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, bg0);
        enc.setBindGroup(1, bg1);
        enc.setBindGroup(2, bg2);
        enc.draw(3);
      });
    });
  }

  destroy(): void {
    this._paramsBuf.destroy();
    this._starBuf.destroy();
  }
}
