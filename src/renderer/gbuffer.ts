import type { RenderContext } from './render_context.js';

/**
 * Multi-target render attachments for the deferred geometry pass.
 *
 * Bundles albedo+roughness, world-space normal+metallic and depth textures
 * sized to the current render context, along with their default views.
 */
export class GBuffer {
  // rgba8unorm: albedo (RGB) + roughness (A)
  readonly albedoRoughness: GPUTexture;
  // rgba16float: world-space normal (RGB) + metallic (A)
  readonly normalMetallic: GPUTexture;
  // depth32float
  readonly depth: GPUTexture;

  readonly albedoRoughnessView: GPUTextureView;
  readonly normalMetallicView: GPUTextureView;
  readonly depthView: GPUTextureView;

  readonly width: number;
  readonly height: number;

  private constructor(
    albedoRoughness: GPUTexture,
    normalMetallic: GPUTexture,
    depth: GPUTexture,
    width: number,
    height: number,
  ) {
    this.albedoRoughness = albedoRoughness;
    this.normalMetallic = normalMetallic;
    this.depth = depth;
    this.width = width;
    this.height = height;
    this.albedoRoughnessView = albedoRoughness.createView();
    this.normalMetallicView = normalMetallic.createView();
    this.depthView = depth.createView();
  }

  /**
   * Allocates a new GBuffer sized to the render context's current canvas dimensions.
   *
   * @param ctx - render context whose device and dimensions are used
   * @returns freshly allocated GBuffer
   */
  static create(ctx: RenderContext): GBuffer {
    const { device, width, height } = ctx;

    const albedoRoughness = device.createTexture({
      label: 'GBuffer AlbedoRoughness',
      size: { width, height },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    const normalMetallic = device.createTexture({
      label: 'GBuffer NormalMetallic',
      size: { width, height },
      format: 'rgba16float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    const depth = device.createTexture({
      label: 'GBuffer Depth',
      size: { width, height },
      format: 'depth32float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    return new GBuffer(albedoRoughness, normalMetallic, depth, width, height);
  }

  /**
   * Destroys all underlying GPU textures.
   */
  destroy(): void {
    this.albedoRoughness.destroy();
    this.normalMetallic.destroy();
    this.depth.destroy();
  }
}
