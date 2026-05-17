import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import ssaoWgsl from '../../../shaders/ssao.wgsl?raw';
import ssaoBlurWgsl from '../../../shaders/ssao_blur.wgsl?raw';

export type SsaoBlurQuality = 'performance' | 'quality';

const AO_FORMAT: GPUTextureFormat = 'r8unorm';
const KERNEL_SIZE = 16;
const UNIFORM_SIZE = 464; // 3×mat4(192) + params(16) + kernel(256)

/**
 * Generate the 16-sample hemisphere kernel. Each sample is a point in the
 * upper hemisphere (`z >= 0`) sampled with `cosT = U(0, 1)` for a roughly
 * cosine-weighted distribution, then scaled by `0.1 + 0.9 * (i/N)²` so
 * samples are denser near the origin (where they contribute most to AO).
 * Vectors live in tangent space and are reoriented by a per-pixel TBN in
 * the shader.
 */
function generateKernel(): Float32Array {
  const k = new Float32Array(KERNEL_SIZE * 4);
  for (let i = 0; i < KERNEL_SIZE; i++) {
    const cosT = Math.random();
    const phi = Math.random() * Math.PI * 2;
    const sinT = Math.sqrt(1 - cosT * cosT);
    const scale = 0.1 + 0.9 * (i / KERNEL_SIZE) ** 2;
    k[i * 4 + 0] = sinT * Math.cos(phi) * scale;
    k[i * 4 + 1] = sinT * Math.sin(phi) * scale;
    k[i * 4 + 2] = cosT * scale;
    k[i * 4 + 3] = 0;
  }
  return k;
}

/**
 * Generate the 4×4 rotation-noise texture. Each texel is a random 2D unit
 * vector `(cos θ, sin θ)` encoded into rgba8 (`0.5 + 0.5 * v`); the shader
 * tiles this texture across the screen via `uv % 4` and uses the decoded
 * vector to rotate the kernel per pixel, dithering away the banding that
 * comes from sampling the same 16 directions everywhere.
 */
function generateNoise(): Uint8Array {
  const noise = new Uint8Array(16 * 4);
  for (let i = 0; i < 16; i++) {
    const angle = Math.random() * Math.PI * 2;
    noise[i * 4 + 0] = Math.round((Math.cos(angle) * 0.5 + 0.5) * 255);
    noise[i * 4 + 1] = Math.round((Math.sin(angle) * 0.5 + 0.5) * 255);
    noise[i * 4 + 2] = 128;
    noise[i * 4 + 3] = 255;
  }
  return noise;
}

export interface SSAODeps {
  /** GBuffer normal+metallic (rgba16float). */
  normal: ResourceHandle;
  /** GBuffer depth (depth32float). */
  depth: ResourceHandle;
}

export interface SSAOOutputs {
  /** Half-resolution blurred AO factor (`r8unorm`). */
  ao: ResourceHandle;
}

/**
 * Screen-space ambient occlusion pass (render-graph version).
 *
 * Algorithm: classic Crytek-style view-space hemisphere SSAO. Not HBAO or
 * GTAO — no horizon traversal, no analytical integral, no temporal
 * accumulation. Just the standard four-step pipeline:
 *
 * 1. **Per-frame setup** (built once in `create()`, uploaded as uniforms):
 *    - A 16-sample kernel of cosine-weighted-ish points in the unit
 *      hemisphere (`z >= 0`), scaled by `0.1 + 0.9 * (i/N)²` so samples
 *      cluster near the origin. See {@link generateKernel}.
 *    - A 4×4 tile of random 2D rotation vectors (`(cos θ, sin θ, 0, 1)`)
 *      used to break up the banding from a fixed kernel. See
 *      {@link generateNoise}.
 *
 * 2. **AO pass** at half resolution (`ssao.wgsl`, `fs_ssao`):
 *    - Reconstruct view-space position from GBuffer depth + `inv_proj`;
 *      transform the GBuffer world-space normal into view space.
 *    - Build a TBN frame using Gram-Schmidt from the tiled noise vector
 *      and the surface normal, re-orienting the hemisphere kernel per
 *      pixel.
 *    - For each of the 16 samples: project the kernel sample to screen
 *      UV, read the depth there, reconstruct that point's view-space Z,
 *      and count it as occluded when `ref_z > sample_vs.z + bias`
 *      (the real surface is closer to the camera than the kernel sample —
 *      i.e. the sample is inside geometry). Comparing against the sample's
 *      Z rather than the pixel's Z makes the bias slope-invariant on flat
 *      surfaces.
 *    - Multiply each occlusion vote by `1 - smoothstep(0, radius, |ΔZ|)`
 *      so hits on geometry far from the surface don't haunt the result.
 *    - Write `clamp(1 - (occlusion/N) * strength, 0, 1)` to a half-res
 *      `r8unorm` target.
 *
 * 3. **Blur** (`ssao_blur.wgsl`):
 *    - `'quality'` (default): two-pass separable bilateral Gaussian
 *      (7-tap, weights `0.196, 0.175, 0.122, 0.067`), with a depth-aware
 *      term `exp(-|Δdepth| * 1000)` that zeroes contributions across
 *      depth discontinuities (no AO bleeding across silhouettes).
 *    - `'performance'`: single-pass 4×4 unweighted box average.
 *
 * 4. **Output**: half-res `r8unorm` AO factor, consumed by the deferred
 *    lighting pass (ambient term) and by composite (fog blending).
 *
 * Both intermediate (raw) and final (blurred) AO targets are transient
 * per-frame resources; the persistent uniform buffer and noise texture
 * live on the pass instance.
 */
export class SSAOPass extends Pass<SSAODeps, SSAOOutputs> {
  readonly name = 'SSAOPass';

  private readonly _ssaoPipeline: GPURenderPipeline;
  private readonly _blurHPipeline: GPURenderPipeline;
  private readonly _blurVPipeline: GPURenderPipeline;
  private readonly _boxBlurPipeline: GPURenderPipeline;
  private _blurQuality: SsaoBlurQuality;
  private readonly _uniformBuffer: GPUBuffer;
  private readonly _noiseTex: GPUTexture;
  private readonly _noiseView: GPUTextureView;
  private readonly _ssaoBgl1: GPUBindGroupLayout;
  private readonly _blurBgl: GPUBindGroupLayout;
  private readonly _ssaoBg0: GPUBindGroup;
  private readonly _blurSampler: GPUSampler;

  private readonly _cameraScratch = new Float32Array(48);
  private readonly _paramsScratch = new Float32Array(4);

  private constructor(
    ssaoPipeline: GPURenderPipeline,
    blurHPipeline: GPURenderPipeline,
    blurVPipeline: GPURenderPipeline,
    boxBlurPipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    noiseTex: GPUTexture,
    noiseView: GPUTextureView,
    ssaoBgl1: GPUBindGroupLayout,
    blurBgl: GPUBindGroupLayout,
    ssaoBg0: GPUBindGroup,
    blurSampler: GPUSampler,
    blurQuality: SsaoBlurQuality,
  ) {
    super();
    this._ssaoPipeline = ssaoPipeline;
    this._blurHPipeline = blurHPipeline;
    this._blurVPipeline = blurVPipeline;
    this._boxBlurPipeline = boxBlurPipeline;
    this._blurQuality = blurQuality;
    this._uniformBuffer = uniformBuffer;
    this._noiseTex = noiseTex;
    this._noiseView = noiseView;
    this._ssaoBgl1 = ssaoBgl1;
    this._blurBgl = blurBgl;
    this._ssaoBg0 = ssaoBg0;
    this._blurSampler = blurSampler;
  }

  static create(ctx: RenderContext, blurQuality: SsaoBlurQuality = 'quality'): SSAOPass {
    const { device } = ctx;

    const noiseTex = device.createTexture({
      label: 'SsaoNoise',
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
      label: 'SsaoUniforms',
      size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(uniformBuffer, 208, generateKernel().buffer as ArrayBuffer);
    device.queue.writeBuffer(uniformBuffer, 192, new Float32Array([1.0, 0.005, 2.0, 0]).buffer as ArrayBuffer);

    const blurSampler = device.createSampler({
      label: 'SsaoBlurSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const ssaoBgl0 = device.createBindGroupLayout({
      label: 'SsaoBGL0',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const ssaoBgl1 = device.createBindGroupLayout({
      label: 'SsaoBGL1',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      ],
    });
    const blurBgl = device.createBindGroupLayout({
      label: 'SsaoBlurBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const ssaoShader = ctx.createShaderModule(ssaoWgsl, 'SsaoShader');
    const blurShader = ctx.createShaderModule(ssaoBlurWgsl, 'SsaoBlurShader');

    const ssaoPipeline = device.createRenderPipeline({
      label: 'SsaoPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [ssaoBgl0, ssaoBgl1] }),
      vertex: { module: ssaoShader, entryPoint: 'vs_main' },
      fragment: { module: ssaoShader, entryPoint: 'fs_ssao', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const blurHPipeline = device.createRenderPipeline({
      label: 'SsaoBlurHPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [blurBgl] }),
      vertex: { module: blurShader, entryPoint: 'vs_main' },
      fragment: { module: blurShader, entryPoint: 'fs_blur_h', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const blurVPipeline = device.createRenderPipeline({
      label: 'SsaoBlurVPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [blurBgl] }),
      vertex: { module: blurShader, entryPoint: 'vs_main' },
      fragment: { module: blurShader, entryPoint: 'fs_blur_v', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const boxBlurPipeline = device.createRenderPipeline({
      label: 'SsaoBoxBlurPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [blurBgl] }),
      vertex: { module: blurShader, entryPoint: 'vs_main' },
      fragment: { module: blurShader, entryPoint: 'fs_blur', targets: [{ format: AO_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const ssaoBg0 = device.createBindGroup({
      label: 'SsaoBG0',
      layout: ssaoBgl0,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    return new SSAOPass(
      ssaoPipeline,
      blurHPipeline,
      blurVPipeline,
      boxBlurPipeline,
      uniformBuffer,
      noiseTex,
      noiseView,
      ssaoBgl1,
      blurBgl,
      ssaoBg0,
      blurSampler,
      blurQuality,
    );
  }

  /** Upload per-frame camera matrices used for view-space reconstruction from `ctx.activeCamera`. */
  updateCamera(ctx: RenderContext): void {
    const camera = ctx.activeCamera;
    if (!camera) {
      throw new Error('SSAOPass.updateCamera: ctx.activeCamera is null');
    }
    const data = this._cameraScratch;
    data.set(camera.viewMatrix().data, 0);
    data.set(camera.projectionMatrix().data, 16);
    data.set(camera.inverseProjectionMatrix().data, 32);
    ctx.device.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
  }

  /** Switch between box blur (performance) and bilateral Gaussian (quality). */
  setBlurQuality(quality: SsaoBlurQuality): void {
    this._blurQuality = quality;
  }

  /** Update the SSAO tuning parameters in the GPU uniform buffer. */
  updateParams(ctx: RenderContext, radius = 1.0, bias = 0.005, strength = 2.0): void {
    this._paramsScratch[0] = radius;
    this._paramsScratch[1] = bias;
    this._paramsScratch[2] = strength;
    this._paramsScratch[3] = 0;
    ctx.device.queue.writeBuffer(this._uniformBuffer, 192, this._paramsScratch.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: SSAODeps): SSAOOutputs {
    const { ctx } = graph;
    const hw = Math.max(1, ctx.width >> 1);
    const hh = Math.max(1, ctx.height >> 1);
    const halfDesc: TextureDesc = { format: AO_FORMAT, width: hw, height: hh };

    let raw!: ResourceHandle;
    let ao!: ResourceHandle;

    // Pass 1: SSAO sampling → raw half-resolution AO.
    graph.addPass('SSAOPass.raw', 'render', (b: PassBuilder) => {
      raw = b.createTexture({ label: 'SsaoRaw', ...halfDesc });
      raw = b.write(raw, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
      b.read(deps.normal, 'sampled');
      b.read(deps.depth, 'sampled');

      b.setExecute((pctx, res) => {
        const bg1 = res.getOrCreateBindGroup({
          label: 'SsaoBG1',
          layout: this._ssaoBgl1,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.normal) },
            { binding: 1, resource: res.getTextureView(deps.depth) },
            { binding: 2, resource: this._noiseView },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._ssaoPipeline);
        enc.setBindGroup(0, this._ssaoBg0);
        enc.setBindGroup(1, bg1);
        enc.draw(3);
      });
    });

    if (this._blurQuality === 'quality') {
      // Pass 2: horizontal bilateral Gaussian blur → intermediate.
      let horiz!: ResourceHandle;
      graph.addPass('SSAOPass.blurH', 'render', (b: PassBuilder) => {
        horiz = b.createTexture({ label: 'SsaoBlurH', ...halfDesc });
        horiz = b.write(horiz, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
        b.read(raw, 'sampled');
        b.read(deps.depth, 'sampled');

        b.setExecute((pctx, res) => {
          const bg = res.getOrCreateBindGroup({
            label: 'SsaoBlurHBG',
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

      // Pass 3: vertical bilateral Gaussian blur → final AO.
      graph.addPass('SSAOPass.blurV', 'render', (b: PassBuilder) => {
        ao = b.createTexture({ label: 'SsaoBlurred', ...halfDesc });
        ao = b.write(ao, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
        b.read(horiz, 'sampled');
        b.read(deps.depth, 'sampled');

        b.setExecute((pctx, res) => {
          const bg = res.getOrCreateBindGroup({
            label: 'SsaoBlurVBG',
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
      // Pass 2: single-pass box blur → final AO (lower quality, faster).
      graph.addPass('SSAOPass.boxBlur', 'render', (b: PassBuilder) => {
        ao = b.createTexture({ label: 'SsaoBoxBlurred', ...halfDesc });
        ao = b.write(ao, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
        b.read(raw, 'sampled');
        b.read(deps.depth, 'sampled');

        b.setExecute((pctx, res) => {
          const bg = res.getOrCreateBindGroup({
            label: 'SsaoBoxBlurBG',
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
