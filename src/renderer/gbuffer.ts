import type { RenderContext } from './render_context.js';

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

  destroy(): void {
    this.albedoRoughness.destroy();
    this.normalMetallic.destroy();
    this.depth.destroy();
  }
}
