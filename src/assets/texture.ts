export type TextureType = '2d' | '3d' | 'cube';

export class Texture {
  readonly gpuTexture: GPUTexture;
  readonly view: GPUTextureView;
  readonly type: TextureType;

  constructor(gpuTexture: GPUTexture, type: TextureType) {
    this.gpuTexture = gpuTexture;
    this.type = type;
    this.view = gpuTexture.createView({
      dimension: type === 'cube' ? 'cube' : type === '3d' ? '3d' : '2d',
    });
  }

  destroy(): void { this.gpuTexture.destroy(); }

  static createSolid(device: GPUDevice, r: number, g: number, b: number, a = 255): Texture {
    const tex = device.createTexture({
      size: { width: 1, height: 1 },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    device.queue.writeTexture(
      { texture: tex },
      new Uint8Array([r, g, b, a]),
      { bytesPerRow: 4 },
      { width: 1, height: 1 },
    );
    return new Texture(tex, '2d');
  }

  // Create from an ImageBitmap (e.g. from createImageBitmap).
  // srgb=true uses rgba8unorm-srgb so the GPU automatically linearises on sample.
  static fromBitmap(device: GPUDevice, bitmap: ImageBitmap, { srgb = false } = {}): Texture {
    const format: GPUTextureFormat = srgb ? 'rgba8unorm-srgb' : 'rgba8unorm';
    const tex = device.createTexture({
      size: { width: bitmap.width, height: bitmap.height },
      format,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });
    device.queue.copyExternalImageToTexture(
      { source: bitmap, flipY: false },
      { texture: tex },
      { width: bitmap.width, height: bitmap.height },
    );
    return new Texture(tex, '2d');
  }

  // Fetch an image URL and upload it as a GPU texture.
  // Use srgb=true for albedo/colour maps; keep false for normal/ORM maps.
  static async fromUrl(device: GPUDevice, url: string, options: { srgb?: boolean } = {}): Promise<Texture> {
    const blob = await (await fetch(url)).blob();
    const bitmap = await createImageBitmap(blob, { colorSpaceConversion: 'none' });
    return Texture.fromBitmap(device, bitmap, options);
  }
}
