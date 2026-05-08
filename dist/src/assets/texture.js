/**
 * Owns a `GPUTexture` and a default `GPUTextureView` of the matching dimension.
 *
 * Callers must invoke `destroy()` to release the underlying GPU memory.
 */
export class Texture {
    gpuTexture;
    view;
    type;
    /**
     * Wraps an existing `GPUTexture` and creates a default view with the matching dimension.
     *
     * @param gpuTexture - The GPU texture to take ownership of.
     * @param type - View dimensionality (2d, 3d, or cube).
     */
    constructor(gpuTexture, type) {
        this.gpuTexture = gpuTexture;
        this.type = type;
        this.view = gpuTexture.createView({
            dimension: type === 'cube' ? 'cube' : type === '3d' ? '3d' : '2d',
        });
    }
    /** Destroys the underlying GPU texture. */
    destroy() { this.gpuTexture.destroy(); }
    /**
     * Creates a 1x1 `rgba8unorm` texture filled with the given color.
     *
     * @param device - The WebGPU device.
     * @param r - Red component, 0-255.
     * @param g - Green component, 0-255.
     * @param b - Blue component, 0-255.
     * @param a - Alpha component, 0-255 (defaults to 255).
     * @returns A new `Texture` owning the 1x1 GPU texture.
     */
    static createSolid(device, r, g, b, a = 255) {
        const tex = device.createTexture({
            size: { width: 1, height: 1 },
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        });
        device.queue.writeTexture({ texture: tex }, new Uint8Array([r, g, b, a]), { bytesPerRow: 4 }, { width: 1, height: 1 });
        return new Texture(tex, '2d');
    }
    /**
     * Uploads an `ImageBitmap` as a 2D texture.
     *
     * @param device - The WebGPU device.
     * @param bitmap - Source image (typically from `createImageBitmap`).
     * @param options - `srgb=true` selects `rgba8unorm-srgb` so the GPU linearises on sample; `usage` adds extra usage flags on top of the standard binding/copy/render set.
     * @returns A new `Texture` owning the uploaded 2D image.
     */
    static fromBitmap(device, bitmap, { srgb = false, usage } = {}) {
        const format = srgb ? 'rgba8unorm-srgb' : 'rgba8unorm';
        usage = usage ? usage | (GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT) : (GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT);
        const tex = device.createTexture({
            size: { width: bitmap.width, height: bitmap.height },
            format,
            usage: usage,
        });
        device.queue.copyExternalImageToTexture({ source: bitmap, flipY: false }, { texture: tex }, { width: bitmap.width, height: bitmap.height });
        return new Texture(tex, '2d');
    }
    /**
     * Fetches an image URL and uploads it as a 2D GPU texture.
     *
     * Use `srgb=true` for albedo/colour maps; keep `false` for normal/ORM maps.
     *
     * @param device - The WebGPU device.
     * @param url - URL to fetch the image from.
     * @param options - `srgb` enables `rgba8unorm-srgb`; `resizeWidth`/`resizeHeight` resize the bitmap before upload; `usage` adds extra usage flags (e.g. `COPY_SRC`).
     * @returns A `Texture` containing the uploaded image.
     */
    static async fromUrl(device, url, options = {}) {
        const blob = await (await fetch(url)).blob();
        const bitmapOptions = { colorSpaceConversion: 'none' };
        if (options.resizeWidth !== undefined && options.resizeHeight !== undefined) {
            bitmapOptions.resizeWidth = options.resizeWidth;
            bitmapOptions.resizeHeight = options.resizeHeight;
            bitmapOptions.resizeQuality = 'high';
        }
        const bitmap = await createImageBitmap(blob, bitmapOptions);
        return Texture.fromBitmap(device, bitmap, options);
    }
}
