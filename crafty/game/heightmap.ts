import type { BlockWorld } from '../../src/block/index.js';

const HM_RES = 128;
const HM_EXTENT = 40.0;  // half-size in blocks

/**
 * Manages terrain heightmap values centered around the camera, updated as the camera moves.
 *
 * The heightmap is a square region of size HM_EXTENT*2, sampled at HM_RES*HM_RES points.
 * Each pixel stores the world height of the top block at that point.
 * The heightmap is updated whenever the camera moves more than 2 blocks from the center of the current heightmap.
 * The heightmap is used by the particle system for terrain collisions, and for effects like water waves that need
 * to interact with the terrain height.
 */
export class HeightmapManager {
  readonly data = new Float32Array(HM_RES * HM_RES);
  readonly resolution = HM_RES;
  readonly extent = HM_EXTENT;

  private _camX = NaN;
  private _camZ = NaN;

  update(cx: number, cz: number, world: BlockWorld): void {
    if (Math.abs(cx - this._camX) < 2 && Math.abs(cz - this._camZ) < 2) {
      return;
    }
    this._camX = cx;
    this._camZ = cz;
    const step   = (HM_EXTENT * 2) / HM_RES;
    const startX = cx - HM_EXTENT;
    const startZ = cz - HM_EXTENT;
    const maxY   = Math.ceil(cz) + 80;
    for (let z = 0; z < HM_RES; z++) {
      for (let x = 0; x < HM_RES; x++) {
        this.data[z * HM_RES + x] = world.getTopBlockY(
          Math.floor(startX + x * step), Math.floor(startZ + z * step), maxY,
        );
      }
    }
  }
}
