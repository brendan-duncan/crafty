import type { World } from '../../src/block/index.js';

const HM_RES = 128;
const HM_EXTENT = 40.0;  // half-size in blocks

export class HeightmapManager {
  readonly data = new Float32Array(HM_RES * HM_RES);
  readonly resolution = HM_RES;
  readonly extent = HM_EXTENT;

  private _camX = NaN;
  private _camZ = NaN;

  update(cx: number, cz: number, world: World): void {
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
