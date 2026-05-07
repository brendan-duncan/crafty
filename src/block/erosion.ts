import { perlinNoise3Seed, perlinRidgeNoise3 } from '../math/index.js';

/** Side length in blocks of one cached erosion region tile. */
export const EROSION_REGION_SIZE = 128;

// Mirrors the base-height sampling from chunk.ts generateBlocks (y=0 slice for a stable 2D field).
function _sampleBaseHeight(gx: number, gz: number, seed: number): number {
  const cont = perlinNoise3Seed(gx / 2048.0, 10, gz / 2048.0, 0, 0, 0, seed);
  const heightMult =
    Math.abs(perlinNoise3Seed(gx / 1024.0, 0, gz / 1024.0, 0, 0, 0, seed) * 450) *
    Math.max(0.1, (cont + 1) * 0.5);
  const flatness = perlinRidgeNoise3(gx / 256.0, 15, gz / 256.0, 2.0, 0.6, 1.2, 6) * 12;
  return Math.abs(perlinNoise3Seed(gx / 256.0, 0, gz / 256.0, 0, 0, 0, seed) * heightMult) + flatness;
}

// Bilinearly samples gradient (gx, gz) and interpolated height from the heightmap.
function _sampleGradient(
  heights: Float32Array,
  size: number,
  px: number,
  py: number,
): [gx: number, gy: number, h: number] {
  const x = px | 0;
  const y = py | 0;
  const fx = px - x;
  const fy = py - y;
  const h00 = heights[x       +  y      * size];
  const h10 = heights[(x + 1) +  y      * size];
  const h01 = heights[x       + (y + 1) * size];
  const h11 = heights[(x + 1) + (y + 1) * size];
  return [
    (h10 - h00) * (1 - fy) + (h11 - h01) * fy,
    (h01 - h00) * (1 - fx) + (h11 - h10) * fx,
    h00 * (1 - fx) * (1 - fy) + h10 * fx * (1 - fy) + h01 * (1 - fx) * fy + h11 * fx * fy,
  ];
}

function _lcg(s: number): number {
  return (Math.imul(s, 1664525) + 1013904223) >>> 0;
}

// Droplet-based hydraulic erosion (Sebastian Lague algorithm). Mutates heights in-place.
function _erode(heights: Float32Array, size: number, seed: number): void {
  const numDroplets = (size * size) >> 2;
  const inertia      = 0.05;
  const sedCapacity  = 4.0;
  const minSedCap    = 0.01;
  const erodeSpeed   = 0.4;
  const depositSpeed = 0.3;
  const evapSpeed    = 0.01;
  const gravity      = 4.0;
  const maxLife      = 20;
  const brushR       = 2;

  const brushD = brushR * 2 + 1;
  const brushW = new Float32Array(brushD * brushD);
  let brushTotal = 0;
  for (let by = -brushR; by <= brushR; by++) {
    for (let bx = -brushR; bx <= brushR; bx++) {
      const dist = Math.sqrt(bx * bx + by * by);
      if (dist < brushR) {
        const w = 1 - dist / brushR;
        brushW[(bx + brushR) + (by + brushR) * brushD] = w;
        brushTotal += w;
      }
    }
  }
  for (let i = 0; i < brushW.length; i++) {
    brushW[i] /= brushTotal;
  }

  const maxSafe = size - 2;
  let rng = (seed ^ 0xDEAD_BEEF) >>> 0;

  for (let d = 0; d < numDroplets; d++) {
    rng = _lcg(rng);
    let px = (rng / 0xFFFF_FFFF) * maxSafe;
    rng = _lcg(rng);
    let py = (rng / 0xFFFF_FFFF) * maxSafe;
    let dirX = 0, dirY = 0;
    let speed = 1.0;
    let water = 1.0;
    let sediment = 0.0;

    for (let life = 0; life < maxLife; life++) {
      const nx = px | 0;
      const ny = py | 0;
      if (nx < 0 || nx >= maxSafe || ny < 0 || ny >= maxSafe) {
        break;
      }

      const cellX = px - nx;
      const cellY = py - ny;

      const [gx, gy, h] = _sampleGradient(heights, size, px, py);

      dirX = dirX * inertia - gx * (1 - inertia);
      dirY = dirY * inertia - gy * (1 - inertia);
      const len = Math.sqrt(dirX * dirX + dirY * dirY);
      if (len < 1e-6) {
        break;
      }
      dirX /= len;
      dirY /= len;

      const npx = px + dirX;
      const npy = py + dirY;
      if (npx < 0 || npx >= maxSafe || npy < 0 || npy >= maxSafe) {
        break;
      }

      const [, , nh] = _sampleGradient(heights, size, npx, npy);
      const dh = nh - h;

      const cap = Math.max(-dh * speed * water * sedCapacity, minSedCap);
      if (sediment > cap || dh > 0) {
        const dep = dh > 0
          ? Math.min(dh, sediment)
          : (sediment - cap) * depositSpeed;
        sediment -= dep;
        heights[nx       +  ny      * size] += dep * (1 - cellX) * (1 - cellY);
        heights[(nx + 1) +  ny      * size] += dep * cellX       * (1 - cellY);
        heights[nx       + (ny + 1) * size] += dep * (1 - cellX) * cellY;
        heights[(nx + 1) + (ny + 1) * size] += dep * cellX       * cellY;
      } else {
        const erode = Math.min((cap - sediment) * erodeSpeed, -dh);
        for (let by = -brushR; by <= brushR; by++) {
          for (let bx = -brushR; bx <= brushR; bx++) {
            const ex = nx + bx;
            const ey = ny + by;
            if (ex < 0 || ex >= size || ey < 0 || ey >= size) {
              continue;
            }
            heights[ex + ey * size] -= brushW[(bx + brushR) + (by + brushR) * brushD] * erode;
          }
        }
        sediment += erode;
      }

      speed = Math.sqrt(Math.max(speed * speed + dh * gravity, 0));
      water *= (1 - evapSpeed);
      px = npx;
      py = npy;
    }
  }
}

/**
 * Builds a 128x128 hydraulic erosion displacement map for one region.
 *
 * Runs Sebastian Lague's droplet-based hydraulic erosion simulation on a sampled
 * base-height field, then returns the per-cell delta from the original heights.
 * Positive values are sediment deposition (higher terrain); negative values are
 * erosion (carved valleys). A 12-block edge fade forces displacement to zero at
 * region borders, eliminating seams between adjacent regions.
 *
 * @param regionX - region X index (region world origin = `regionX * EROSION_REGION_SIZE`)
 * @param regionZ - region Z index
 * @param seed - world seed
 * @returns flat array indexed `[lx + lz * EROSION_REGION_SIZE]`
 */
export function buildErosionRegion(regionX: number, regionZ: number, seed: number): Float32Array {
  const R  = EROSION_REGION_SIZE;
  const ox = regionX * R;
  const oz = regionZ * R;

  const original = new Float32Array(R * R);
  for (let lz = 0; lz < R; lz++) {
    for (let lx = 0; lx < R; lx++) {
      original[lx + lz * R] = _sampleBaseHeight(ox + lx, oz + lz, seed);
    }
  }

  const eroded = new Float32Array(original);
  const regionSeed = (seed ^ (Math.imul(regionX, 73_856_093) ^ Math.imul(regionZ, 19_349_663))) >>> 0;
  _erode(eroded, R, regionSeed);

  const FADE_WIDTH = 12;
  const displacement = new Float32Array(R * R);
  for (let lz = 0; lz < R; lz++) {
    for (let lx = 0; lx < R; lx++) {
      const i = lx + lz * R;
      const inner = Math.min(lx, R - 1 - lx, lz, R - 1 - lz);
      const fade = Math.min(inner / FADE_WIDTH, 1.0);
      displacement[i] = (eroded[i] - original[i]) * fade;
    }
  }
  return displacement;
}
