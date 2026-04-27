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

export class SSAOPass extends RenderPass {
  readonly name = 'SSAOPass';

  // Blurred AO texture — bound by LightingPass as group 3.
  readonly aoView: GPUTextureView;

  private _raw    : GPUTexture;
  private _blurred: GPUTexture;
  private _rawView: GPUTextureView;

  private _ssaoPipeline: GPURenderPipeline;
  private _blurPipeline: GPURenderPipeline;

  private _uniformBuffer: GPUBuffer;
  private _noiseTex     : GPUTexture;

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

  static create(ctx: RenderContext, gbuffer: GBuffer): SSAOPass {
    const { device, width, height } = ctx;

    const raw     = device.createTexture({ label: 'SsaoRaw',     size: { width, height }, format: AO_FORMAT, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });
    const blurred = device.createTexture({ label: 'SsaoBlurred', size: { width, height }, format: AO_FORMAT, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });
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

    const ssaoShader = device.createShaderModule({ label: 'SsaoShader', code: ssaoWgsl });
    const blurShader = device.createShaderModule({ label: 'SsaoBlurShader', code: ssaoBlurWgsl });

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

  // Call each frame before execute(). view and proj are the camera matrices; invProj is proj.invert().
  updateCamera(ctx: RenderContext, view: Mat4, proj: Mat4, invProj: Mat4): void {
    const data = new Float32Array(48); // 3 × mat4 = 48 floats
    data.set(view.data,     0);
    data.set(proj.data,    16);
    data.set(invProj.data, 32);
    ctx.device.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
  }

  // radius   : hemisphere sample radius in view space (default 1.0)
  // bias     : depth bias to avoid self-occlusion (default 0.005)
  // strength : AO intensity multiplier (default 2.0)
  updateParams(ctx: RenderContext, radius = 1.0, bias = 0.005, strength = 2.0): void {
    ctx.device.queue.writeBuffer(this._uniformBuffer, 192,
      new Float32Array([radius, bias, strength, 0]).buffer as ArrayBuffer);
  }

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

    // 2. Blur: raw → blurred (the aoView that LightingPass reads)
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

  destroy(): void {
    this._raw.destroy();
    this._blurred.destroy();
    this._uniformBuffer.destroy();
    this._noiseTex.destroy();
  }
}
