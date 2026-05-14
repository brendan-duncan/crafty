import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { GBuffer } from '../gbuffer.js';
import type { Mat4 } from '../../math/mat4.js';
import ssaoWgsl from '../../shaders/ssao.wgsl?raw';
import ssaoBlurWgsl from '../../shaders/ssao_blur.wgsl?raw';

const AO_FORMAT: GPUTextureFormat = 'r8unorm';
const KERNEL_SIZE = 16;
const UNIFORM_SIZE = 464; // 3×mat4(192) + params(16) + kernel(256)

function generateKernel(): Float32Array {
  const k = new Float32Array(KERNEL_SIZE * 4);
  for (let i = 0; i < KERNEL_SIZE; i++) {
    // Uniform hemisphere in tangent space (z >= 0 = N direction)
    const cosT = Math.random();
    const phi   = Math.random() * Math.PI * 2;
    const sinT  = Math.sqrt(1 - cosT * cosT);
    // Accelerating distribution: bias samples toward origin
    const scale = 0.1 + 0.9 * (i / KERNEL_SIZE) ** 2;
    k[i * 4 + 0] = sinT * Math.cos(phi) * scale;
    k[i * 4 + 1] = sinT * Math.sin(phi) * scale;
    k[i * 4 + 2] = cosT * scale;
    k[i * 4 + 3] = 0;
  }
  return k;
}

function generateNoise(): Uint8Array {
  const noise = new Uint8Array(16 * 4); // 4×4 pixels, rgba8unorm
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
 * Screen-space ambient occlusion pass. Samples a hemispherical kernel around
 * each pixel using the G-buffer view-space normal and depth, then runs a
 * separable bilateral-style blur to produce the AO term consumed by lighting.
 *
 * Inputs sampled: G-buffer normal/metallic, G-buffer depth, tiled noise.
 * Output: single-channel AO texture exposed as `aoView` (half resolution).
 */
export class SSAOPass extends RenderPass {
  readonly name = 'SSAOPass';

  /** Blurred AO texture view, intended to be bound by DeferredLightingPass. */
  // Blurred AO texture — bound by DeferredLightingPass as group 3.
  readonly aoView: GPUTextureView;

  private _raw    : GPUTexture;
  private _blurred: GPUTexture;
  private _rawView: GPUTextureView;

  private _ssaoPipeline: GPURenderPipeline;
  private _blurPipeline: GPURenderPipeline;

  private _uniformBuffer: GPUBuffer;
  private _noiseTex     : GPUTexture;
  private readonly _cameraScratch = new Float32Array(48);
  private readonly _paramsScratch = new Float32Array(4);

  private _ssaoBG0: GPUBindGroup;
  private _ssaoBG1: GPUBindGroup;
  private _blurBG : GPUBindGroup;

  private constructor(
    raw: GPUTexture, rawView: GPUTextureView,
    blurred: GPUTexture, aoView: GPUTextureView,
    ssaoPipeline: GPURenderPipeline,
    blurPipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    noiseTex: GPUTexture,
    ssaoBG0: GPUBindGroup,
    ssaoBG1: GPUBindGroup,
    blurBG: GPUBindGroup,
  ) {
    super();
    this._raw    = raw;
    this._rawView = rawView;
    this._blurred = blurred;
    this.aoView  = aoView;
    this._ssaoPipeline = ssaoPipeline;
    this._blurPipeline = blurPipeline;
    this._uniformBuffer = uniformBuffer;
    this._noiseTex = noiseTex;
    this._ssaoBG0 = ssaoBG0;
    this._ssaoBG1 = ssaoBG1;
    this._blurBG  = blurBG;
  }

  /**
   * Constructs the pass and allocates the half-resolution AO textures, kernel,
   * noise texture, pipelines, and bind groups.
   *
   * @param ctx Render context providing device and screen size.
   * @param gbuffer G-buffer providing the normal/metallic and depth views.
   * @returns Configured SSAOPass instance.
   */
  static create(ctx: RenderContext, gbuffer: GBuffer): SSAOPass {
    const { device, width, height } = ctx;

    const hw = Math.max(1, width  >> 1);
    const hh = Math.max(1, height >> 1);
    const raw     = device.createTexture({ label: 'SsaoRaw',     size: { width: hw, height: hh }, format: AO_FORMAT, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });
    const blurred = device.createTexture({ label: 'SsaoBlurred', size: { width: hw, height: hh }, format: AO_FORMAT, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });
    const rawView    = raw.createView();
    const aoView     = blurred.createView();

    // Static noise texture (4×4, tiled across screen for kernel rotation)
    const noiseTex = device.createTexture({
      label: 'SsaoNoise', size: { width: 4, height: 4 },
      format: 'rgba8unorm', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    device.queue.writeTexture(
      { texture: noiseTex },
      generateNoise().buffer as ArrayBuffer,
      { bytesPerRow: 4 * 4, rowsPerImage: 4 },
      { width: 4, height: 4 },
    );
    const noiseView = noiseTex.createView();

    const uniformBuffer = device.createBuffer({
      label: 'SsaoUniforms', size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Write static kernel at offset 208 (matrices + params occupy 0–207)
    device.queue.writeBuffer(uniformBuffer, 208,
      generateKernel().buffer as ArrayBuffer);

    // Write default params (radius=1.0, bias=0.005, strength=2.0)
    device.queue.writeBuffer(uniformBuffer, 192,
      new Float32Array([1.0, 0.005, 2.0, 0]).buffer as ArrayBuffer);

    const sampler = device.createSampler({
      label: 'SsaoBlurSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    // Group 0: uniform buffer
    const bgl0 = device.createBindGroupLayout({
      label: 'SsaoBGL0',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    // Group 1: gbuffer textures + noise (no sampler — all textureLoad)
    const bgl1 = device.createBindGroupLayout({
      label: 'SsaoBGL1',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      ],
    });

    // Group 0 for blur: ao_tex + sampler
    const bgl0Blur = device.createBindGroupLayout({
      label: 'SsaoBlurBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const ssaoShader = ctx.createShaderModule(ssaoWgsl, 'SsaoShader');
    const blurShader = ctx.createShaderModule(ssaoBlurWgsl, 'SsaoBlurShader');

    const ssaoPipeline = device.createRenderPipeline({
      label: 'SsaoPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [bgl0, bgl1] }),
      vertex:   { module: ssaoShader, entryPoint: 'vs_main' },
      fragment: { module: ssaoShader, entryPoint: 'fs_ssao', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const blurPipeline = device.createRenderPipeline({
      label: 'SsaoBlurPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [bgl0Blur] }),
      vertex:   { module: blurShader, entryPoint: 'vs_main' },
      fragment: { module: blurShader, entryPoint: 'fs_blur', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const ssaoBG0 = device.createBindGroup({
      label: 'SsaoBG0', layout: bgl0,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const ssaoBG1 = device.createBindGroup({
      label: 'SsaoBG1', layout: bgl1,
      entries: [
        { binding: 0, resource: gbuffer.normalMetallicView },
        { binding: 1, resource: gbuffer.depthView },
        { binding: 2, resource: noiseView },
      ],
    });

    const blurBG = device.createBindGroup({
      label: 'SsaoBlurBG', layout: bgl0Blur,
      entries: [
        { binding: 0, resource: rawView },
        { binding: 1, resource: sampler },
      ],
    });

    return new SSAOPass(
      raw, rawView, blurred, aoView,
      ssaoPipeline, blurPipeline,
      uniformBuffer, noiseTex,
      ssaoBG0, ssaoBG1, blurBG,
    );
  }

  /**
   * Uploads the per-frame camera matrices used for view-space reconstruction.
   * Call once per frame before {@link execute}.
   *
   * @param ctx Render context whose queue receives the buffer write.
   * @param view World-to-view matrix.
   * @param proj View-to-clip matrix.
   * @param invProj Inverse of `proj`, used to reconstruct view-space positions.
   */
  // Call each frame before execute(). view and proj are the camera matrices; invProj is proj.invert().
  updateCamera(ctx: RenderContext, view: Mat4, proj: Mat4, invProj: Mat4): void {
    const data = this._cameraScratch;
    data.set(view.data,     0);
    data.set(proj.data,    16);
    data.set(invProj.data, 32);
    ctx.device.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
  }

  /**
   * Updates the SSAO tuning parameters in the GPU uniform buffer.
   *
   * @param ctx Render context whose queue receives the buffer write.
   * @param radius Hemisphere sample radius in view-space units.
   * @param bias Depth bias to suppress self-occlusion.
   * @param strength Final AO intensity multiplier.
   */
  // radius   : hemisphere sample radius in view space (default 1.0)
  // bias     : depth bias to avoid self-occlusion (default 0.005)
  // strength : AO intensity multiplier (default 2.0)
  updateParams(ctx: RenderContext, radius = 1.0, bias = 0.005, strength = 2.0): void {
    this._paramsScratch[0] = radius;
    this._paramsScratch[1] = bias;
    this._paramsScratch[2] = strength;
    this._paramsScratch[3] = 0;
    ctx.device.queue.writeBuffer(this._uniformBuffer, 192, this._paramsScratch.buffer as ArrayBuffer);
  }

  /**
   * Records the raw SSAO render and the subsequent blur into the AO target.
   *
   * @param encoder Command encoder to record into.
   * @param _ctx Render context (unused).
   */
  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    // 1. SSAO: gbuffer → raw AO
    {
      const pass = encoder.beginRenderPass({
        label: 'SSAOPass',
        colorAttachments: [{ view: this._rawView, clearValue: [1, 0, 0, 1], loadOp: 'clear', storeOp: 'store' }],
      });
      pass.setPipeline(this._ssaoPipeline);
      pass.setBindGroup(0, this._ssaoBG0);
      pass.setBindGroup(1, this._ssaoBG1);
      pass.draw(3);
      pass.end();
    }

    // 2. Blur: raw → blurred (the aoView that DeferredLightingPass reads)
    {
      const pass = encoder.beginRenderPass({
        label: 'SSAOBlur',
        colorAttachments: [{ view: this.aoView, clearValue: [1, 0, 0, 1], loadOp: 'clear', storeOp: 'store' }],
      });
      pass.setPipeline(this._blurPipeline);
      pass.setBindGroup(0, this._blurBG);
      pass.draw(3);
      pass.end();
    }
  }

  /** Releases the raw and blurred AO textures, the uniform buffer, and the noise texture. */
  destroy(): void {
    this._raw.destroy();
    this._blurred.destroy();
    this._uniformBuffer.destroy();
    this._noiseTex.destroy();
  }
}
