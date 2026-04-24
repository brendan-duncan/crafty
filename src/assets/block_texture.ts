import { Texture } from './texture.js';

// BlockID is a zero-based index into the horizontal texture atlas.
// BlockID 0 = leftmost 16×16 tile, BlockID 1 = next tile, etc.
export type BlockID = number;

export class BlockTexture {
  readonly colorAtlas : Texture;   // albedo (sRGB)
  readonly normalAtlas: Texture;   // tangent-space normals (linear)
  readonly merAtlas   : Texture;   // R=metallic, G=emissive, B=roughness (linear)
  readonly heightAtlas: Texture;   // greyscale heightmap for parallax (linear)
  readonly blockSize  : number;    // pixels per tile (default 16)
  readonly blockCount : number;    // number of tiles in the atlas

  private readonly _atlasWidth : number;
  private readonly _atlasHeight: number;

  private constructor(
    colorAtlas : Texture,
    normalAtlas: Texture,
    merAtlas   : Texture,
    heightAtlas: Texture,
    blockSize  : number,
    atlasWidth : number,
    atlasHeight: number,
  ) {
    this.colorAtlas  = colorAtlas;
    this.normalAtlas = normalAtlas;
    this.merAtlas    = merAtlas;
    this.heightAtlas = heightAtlas;
    this.blockSize   = blockSize;
    this._atlasWidth  = atlasWidth;
    this._atlasHeight = atlasHeight;
    this.blockCount  = Math.floor(atlasWidth / blockSize);
  }

  static async load(
    device    : GPUDevice,
    colorUrl  : string,
    normalUrl : string,
    merUrl    : string,
    heightUrl : string,
    blockSize = 16,
  ): Promise<BlockTexture> {
    async function loadBitmap(url: string): Promise<ImageBitmap> {
      const blob = await (await fetch(url)).blob();
      return createImageBitmap(blob, { colorSpaceConversion: 'none' });
    }

    const [colorBmp, normalBmp, merBmp, heightBmp] = await Promise.all([
      loadBitmap(colorUrl),
      loadBitmap(normalUrl),
      loadBitmap(merUrl),
      loadBitmap(heightUrl),
    ]);

    const atlasWidth  = colorBmp.width;
    const atlasHeight = colorBmp.height;

    const colorAtlas  = Texture.fromBitmap(device, colorBmp,  { srgb: true  });
    const normalAtlas = Texture.fromBitmap(device, normalBmp, { srgb: false });
    const merAtlas    = Texture.fromBitmap(device, merBmp,    { srgb: false });
    const heightAtlas = Texture.fromBitmap(device, heightBmp, { srgb: false });

    return new BlockTexture(colorAtlas, normalAtlas, merAtlas, heightAtlas, blockSize, atlasWidth, atlasHeight);
  }

  // Returns [uvOffsetX, uvOffsetY, uvScaleX, uvScaleY] for sampling blockId in the atlas.
  // Multiply mesh UVs (0..1) by uvScale then add uvOffset to land exactly on the block tile.
  uvTransform(blockId: BlockID): [number, number, number, number] {
    const scaleX = this.blockSize / this._atlasWidth;
    const scaleY = this.blockSize / this._atlasHeight;
    return [blockId * scaleX, 0, scaleX, scaleY];
  }

  destroy(): void {
    this.colorAtlas.destroy();
    this.normalAtlas.destroy();
    this.merAtlas.destroy();
    this.heightAtlas.destroy();
  }
}
