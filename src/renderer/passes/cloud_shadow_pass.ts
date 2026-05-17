import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { CloudNoiseTextures } from '../../assets/cloud_noise.js';
import type { CloudSettings } from './cloud_pass.js';
import cloudShadowWgsl from '../../shaders/cloud_shadow.wgsl?raw';

const SHADOW_SIZE = 1024;
const SHADOW_FORMAT: GPUTextureFormat = 'r8unorm';

// 12 floats × 4 bytes = 48 bytes
// Layout mirrors CloudShadowUniforms in cloud_shadow.wgsl
const UNIFORM_SIZE = 48;

/**
 * Renders a top-down cloud shadow map by ray-marching the sampled cloud
 * volume against two 3D noise textures.
 *
 * Inputs: base/detail 3D noise textures (CloudNoiseTextures) plus per-frame
 * uniforms describing the cloud layer.
 * Output: an r8unorm 1024x1024 shadow texture (`shadowView`) sampled by the
 * lighting pass to attenuate sun light. Updates every other frame because
 * clouds animate slowly.
 *
 * Shader: `cloud_shadow.wgsl`.
 */
export class CloudShadowPass extends RenderPass {
  /** Identifier used in render-graph diagnostics. */
  readonly name = 'CloudShadowPass';

  /** The r8unorm texture holding the latest cloud shadow map. */
  readonly shadowTexture: GPUTexture;
  /** Default view of {@link shadowTexture} for sampling by downstream passes. */
  readonly shadowView: GPUTextureView;

  private _pipeline: GPURenderPipeline;
  private _uniformBuffer: GPUBuffer;
  private _uniformBG: GPUBindGroup;
  private _noiseBG: GPUBindGroup;
  private _frameCount = 0;

  private constructor(
    shadowTexture: GPUTexture,
    shadowView: GPUTextureView,
    pipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    uniformBG: GPUBindGroup,
    noiseBG: GPUBindGroup,
  ) {
    super();
    this.shadowTexture = shadowTexture;
    this.shadowView = shadowView;
    this._pipeline = pipeline;
    this._uniformBuffer = uniformBuffer;
    this._uniformBG = uniformBG;
    this._noiseBG = noiseBG;
  }

  /**
   * Allocates the shadow texture, uniform buffer, bind groups and pipeline
   * for the cloud shadow pass.
   *
   * @param ctx - Active render context providing the GPU device.
   * @param noises - Pre-baked base and detail 3D noise textures sampled by the shader.
   * @returns A ready-to-use cloud shadow pass instance.
   */
  static create(ctx: RenderContext, noises: CloudNoiseTextures): CloudShadowPass {
    const { device } = ctx;

    const shadowTexture = device.createTexture({
      label: 'CloudShadowTexture',
      size: { width: SHADOW_SIZE, height: SHADOW_SIZE },
      format: SHADOW_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
    });
    const shadowView = shadowTexture.createView();

    const uniformBuffer = device.createBuffer({
      label: 'CloudShadowUniform',
      size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uniformBGL = device.createBindGroupLayout({
      label: 'CloudShadowUniformBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    const noiseSampler = device.createSampler({
      label: 'CloudNoiseSampler',
      magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
      addressModeU: 'mirror-repeat', addressModeV: 'mirror-repeat', addressModeW: 'mirror-repeat',
    });

    const noiseBGL = device.createBindGroupLayout({
      label: 'CloudShadowNoiseBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '3d' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '3d' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const uniformBG = device.createBindGroup({
      label: 'CloudShadowUniformBG', layout: uniformBGL,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const noiseBG = device.createBindGroup({
      label: 'CloudShadowNoiseBG', layout: noiseBGL,
      entries: [
        { binding: 0, resource: noises.baseView },
        { binding: 1, resource: noises.detailView },
        { binding: 2, resource: noiseSampler },
      ],
    });

    const shader = ctx.createShaderModule(cloudShadowWgsl, 'CloudShadowShader');
    const pipeline = device.createRenderPipeline({
      label: 'CloudShadowPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBGL, noiseBGL] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: {
        module: shader, entryPoint: 'fs_main',
        targets: [{ format: SHADOW_FORMAT }],
      },
      primitive: { topology: 'triangle-list' },
    });

    return new CloudShadowPass(shadowTexture, shadowView, pipeline, uniformBuffer, uniformBG, noiseBG);
  }

  // Avoid reallocating a Float32Array every frame by reusing the same for all frames
  private _data = new Float32Array(UNIFORM_SIZE / 4);
  /**
   * Uploads the per-frame cloud parameters and shadow projection extents to
   * the GPU uniform buffer.
   *
   * @param ctx - Active render context providing the GPU queue.
   * @param settings - Cloud layer description and animation state (uses cloudBase, cloudTop, coverage, density, windOffset, extinction; other fields are ignored).
   * @param worldOrigin - World-space XZ origin that the shadow map is centered on.
   * @param worldExtent - Half-extent (in world units) covered by the shadow map.
   */
  update(
    ctx: RenderContext,
    settings: CloudSettings,
    worldOrigin: [number, number],
    worldExtent: number,
  ): void {
    this._data[0] = settings.cloudBase;
    this._data[1] = settings.cloudTop;
    this._data[2] = settings.coverage;
    this._data[3] = settings.density;
    this._data[4] = settings.windOffset[0];
    this._data[5] = settings.windOffset[1];
    this._data[6] = worldOrigin[0];
    this._data[7] = worldOrigin[1];
    this._data[8] = worldExtent;
    this._data[9] = settings.extinction;
    // data[10] and data[11] = 0 (padding)
    ctx.queue.writeBuffer(this._uniformBuffer, 0, this._data.buffer as ArrayBuffer);
  }

  /**
   * Encodes the cloud shadow render pass. Skips drawing on every other frame
   * since clouds animate slowly enough to reuse the previous result.
   *
   * @param encoder - GPU command encoder to record into.
   * @param _ctx - Active render context (unused).
   */
  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    // Update shadow map every other frame — clouds animate slowly so the
    // previous frame's map is visually indistinguishable on the skipped frame.
    if (this._frameCount++ % 2 !== 0) {
      return;
    }
    const pass = encoder.beginRenderPass({
      label: 'CloudShadowPass',
      colorAttachments: [{
        view: this.shadowView,
        clearValue: [1, 0, 0, 1],
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._uniformBG);
    pass.setBindGroup(1, this._noiseBG);
    pass.draw(3);
    pass.end();
  }

  /** Releases the shadow texture and uniform buffer owned by this pass. */
  destroy(): void {
    this.shadowTexture.destroy();
    this._uniformBuffer.destroy();
  }
}
