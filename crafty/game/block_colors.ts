import {
  BlockType,
  blockTextureOffsetData,
  BLOCK_ATLAS_TEX_SIZE,
} from '../../src/block/block_type.js';

const _colors: Map<BlockType, [number, number, number]> = new Map();
const _fallback: [number, number, number] = [0.6, 0.6, 0.6];

/**
 * Loads the color atlas image and computes the average linear-RGB color of
 * each block's top-face tile. Must be awaited once at startup before any call
 * to {@link getBlockColor}; safe to call again to refresh after a hot reload.
 */
export async function loadBlockColors(atlasUrl: string): Promise<void> {
  const img = await loadImage(atlasUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return;
  }
  ctx.drawImage(img, 0, 0);

  const tileSize = BLOCK_ATLAS_TEX_SIZE;

  for (const entry of blockTextureOffsetData) {
    if (!entry || entry.blockType === BlockType.NONE) {
      continue;
    }
    const tile = entry.topFace;
    const tx = tile.x * tileSize;
    const ty = tile.y * tileSize;
    if (tx + tileSize > img.width || ty + tileSize > img.height) {
      continue;
    }
    const data = ctx.getImageData(tx, ty, tileSize, tileSize).data;
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 32) {
        continue;
      }
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      n++;
    }
    if (n === 0) {
      continue;
    }
    _colors.set(entry.blockType, [
      srgbToLinear(r / n / 255),
      srgbToLinear(g / n / 255),
      srgbToLinear(b / n / 255),
    ]);
  }
}

/**
 * Returns the cached average linear-RGB color of `blockType`'s top-face tile.
 * Falls back to a neutral grey if the atlas wasn't loaded or the block has no
 * sampled color (e.g. air, props with all-transparent tiles).
 */
export function getBlockColor(blockType: BlockType): [number, number, number] {
  return _colors.get(blockType) ?? _fallback;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load atlas image: ${url}`));
    img.src = url;
  });
}

// Standard sRGB → linear transfer (matches WebGPU's sRGB texture sampling so
// burst colors integrate correctly with the linear HDR lighting pipeline).
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
