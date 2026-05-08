import { Texture } from './texture.js';
/**
 * A set of four aligned block atlases (color, normal, MER, height) for voxel-style rendering.
 *
 * All four atlases share a common tile size and layout. Each atlas is stored
 * horizontally as a strip of `blockSize`-pixel square tiles. Owns the
 * underlying GPU textures; call `destroy()` to release them.
 */
export class BlockTexture {
    colorAtlas; // albedo (sRGB)
    normalAtlas; // tangent-space normals (linear)
    merAtlas; // R=metallic, G=emissive, B=roughness (linear)
    heightAtlas; // greyscale heightmap for parallax (linear)
    blockSize; // pixels per tile (default 16)
    blockCount; // number of tiles in the atlas
    _atlasWidth;
    _atlasHeight;
    constructor(colorAtlas, normalAtlas, merAtlas, heightAtlas, blockSize, atlasWidth, atlasHeight) {
        this.colorAtlas = colorAtlas;
        this.normalAtlas = normalAtlas;
        this.merAtlas = merAtlas;
        this.heightAtlas = heightAtlas;
        this.blockSize = blockSize;
        this._atlasWidth = atlasWidth;
        this._atlasHeight = atlasHeight;
        this.blockCount = Math.floor(atlasWidth / blockSize);
    }
    /**
     * Fetches and uploads the four atlas images, creating sRGB color and linear data textures.
     *
     * @param device - The WebGPU device.
     * @param colorUrl - URL of the albedo atlas (uploaded as sRGB).
     * @param normalUrl - URL of the tangent-space normal atlas (linear).
     * @param merUrl - URL of the MER atlas (R=metallic, G=emissive, B=roughness, linear).
     * @param heightUrl - URL of the greyscale heightmap atlas (linear).
     * @param blockSize - Pixels per tile (default 16).
     * @returns A `BlockTexture` owning the four uploaded GPU textures.
     */
    static async load(device, colorUrl, normalUrl, merUrl, heightUrl, blockSize = 16) {
        async function loadBitmap(url) {
            const blob = await (await fetch(url)).blob();
            return createImageBitmap(blob, { colorSpaceConversion: 'none' });
        }
        const [colorBmp, normalBmp, merBmp, heightBmp] = await Promise.all([
            loadBitmap(colorUrl),
            loadBitmap(normalUrl),
            loadBitmap(merUrl),
            loadBitmap(heightUrl),
        ]);
        const atlasWidth = colorBmp.width;
        const atlasHeight = colorBmp.height;
        const colorAtlas = Texture.fromBitmap(device, colorBmp, { srgb: true });
        const normalAtlas = Texture.fromBitmap(device, normalBmp, { srgb: false });
        const merAtlas = Texture.fromBitmap(device, merBmp, { srgb: false });
        const heightAtlas = Texture.fromBitmap(device, heightBmp, { srgb: false });
        return new BlockTexture(colorAtlas, normalAtlas, merAtlas, heightAtlas, blockSize, atlasWidth, atlasHeight);
    }
    /**
     * Computes the atlas UV transform for sampling a specific tile.
     *
     * Mesh UVs in `[0,1]` should be multiplied by `(uvScaleX, uvScaleY)` then
     * offset by `(uvOffsetX, uvOffsetY)` to land on the requested tile.
     *
     * @param blockId - Tile index into the atlas.
     * @returns Tuple `[uvOffsetX, uvOffsetY, uvScaleX, uvScaleY]`.
     */
    uvTransform(blockId) {
        const scaleX = this.blockSize / this._atlasWidth;
        const scaleY = this.blockSize / this._atlasHeight;
        return [blockId * scaleX, 0, scaleX, scaleY];
    }
    destroy() {
        this.colorAtlas.destroy();
        this.normalAtlas.destroy();
        this.merAtlas.destroy();
        this.heightAtlas.destroy();
    }
}
