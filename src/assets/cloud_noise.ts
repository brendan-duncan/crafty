export interface CloudNoiseTextures {
  baseNoise   : GPUTexture;         // 64×64×64 rgba8unorm 3D
  baseView    : GPUTextureView;
  detailNoise : GPUTexture;         // 32×32×32 rgba8unorm 3D
  detailView  : GPUTextureView;
  destroy(): void;
}

// 32-bit integer hash → float [0, 1)
function hash3(x: number, y: number, z: number): number {
  let h = ((Math.imul(x, 1664525) ^ Math.imul(y, 1013904223) ^ Math.imul(z, 22695477)) >>> 0);
  h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b)) >>> 0;
  h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b)) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 0xffffffff;
}

// Seeded variant — different seeds produce independent noise channels
function hashS(x: number, y: number, z: number, seed: number): number {
  return hash3(x ^ seed, y ^ (seed * 7 + 3), z ^ (seed * 13 + 5));
}

function smoothstep5(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function trilerp(
  v000: number, v100: number, v010: number, v110: number,
  v001: number, v101: number, v011: number, v111: number,
  fx: number, fy: number, fz: number,
): number {
  const x00 = v000 + (v100 - v000) * fx;
  const x10 = v010 + (v110 - v010) * fx;
  const x01 = v001 + (v101 - v001) * fx;
  const x11 = v011 + (v111 - v011) * fx;
  const y0  = x00  + (x10  - x00)  * fy;
  const y1  = x01  + (x11  - x01)  * fy;
  return y0 + (y1 - y0) * fz;
}

// Trilinear-interpolated lattice (Perlin value noise)
function perlinValue(px: number, py: number, pz: number, seed: number): number {
  const x0 = Math.floor(px), y0 = Math.floor(py), z0 = Math.floor(pz);
  const x1 = x0 + 1, y1 = y0 + 1, z1 = z0 + 1;
  const fx = smoothstep5(px - x0);
  const fy = smoothstep5(py - y0);
  const fz = smoothstep5(pz - z0);
  return trilerp(
    hashS(x0, y0, z0, seed), hashS(x1, y0, z0, seed),
    hashS(x0, y1, z0, seed), hashS(x1, y1, z0, seed),
    hashS(x0, y0, z1, seed), hashS(x1, y0, z1, seed),
    hashS(x0, y1, z1, seed), hashS(x1, y1, z1, seed),
    fx, fy, fz,
  );
}

// 4-octave fractal Brownian motion of Perlin value noise
function perlinFbm(px: number, py: number, pz: number, octaves: number, seed: number): number {
  let value = 0, amplitude = 0.5, freq = 1, total = 0;
  for (let i = 0; i < octaves; i++) {
    value += perlinValue(px * freq, py * freq, pz * freq, seed + i * 17) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    freq     *= 2;
  }
  return value / total;
}

// Worley (cellular) noise — returns inverted min-distance so cell centres are bright
function worley(px: number, py: number, pz: number, freq: number, seed: number): number {
  const fx = px * freq, fy = py * freq, fz = pz * freq;
  const ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz);
  let minD2 = Infinity;
  for (let dz = -1; dz <= 1; dz++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = ix + dx, cy = iy + dy, cz = iz + dz;
        // Each cell gets one random feature point
        const fpx = cx + hashS(cx, cy, cz, seed);
        const fpy = cy + hashS(cx, cy, cz, seed + 1);
        const fpz = cz + hashS(cx, cy, cz, seed + 2);
        const ddx = fx - fpx, ddy = fy - fpy, ddz = fz - fpz;
        const d2 = ddx * ddx + ddy * ddy + ddz * ddz;
        if (d2 < minD2) minD2 = d2;
      }
    }
  }
  return 1.0 - Math.min(Math.sqrt(minD2), 1.0);
}

function make3dTexture(device: GPUDevice, label: string, size: number, data: Uint8Array): GPUTexture {
  const tex = device.createTexture({
    label, dimension: '3d',
    size: { width: size, height: size, depthOrArrayLayers: size },
    format: 'rgba8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  device.queue.writeTexture(
    { texture: tex },
    data,
    { bytesPerRow: size * 4, rowsPerImage: size },
    { width: size, height: size, depthOrArrayLayers: size },
  );
  return tex;
}

export function createCloudNoiseTextures(device: GPUDevice): CloudNoiseTextures {
  // ---- Base noise: 64×64×64 ----
  // R = 4-octave Perlin FBM (cloud bulk shape)
  // G/B/A = inverted Worley at 3 increasing frequencies (erosion layers)
  const BASE = 64;
  const baseData = new Uint8Array(BASE * BASE * BASE * 4);
  for (let z = 0; z < BASE; z++) {
    for (let y = 0; y < BASE; y++) {
      for (let x = 0; x < BASE; x++) {
        const idx = (z * BASE * BASE + y * BASE + x) * 4;
        const px = x / BASE, py = y / BASE, pz = z / BASE;
        const r = perlinFbm(px * 4, py * 4, pz * 4, 4, 0);
        const g = worley(px, py, pz, 2,  100);
        const b = worley(px, py, pz, 4,  200);
        const a = worley(px, py, pz, 8,  300);
        baseData[idx]     = Math.round(r * 255);
        baseData[idx + 1] = Math.round(g * 255);
        baseData[idx + 2] = Math.round(b * 255);
        baseData[idx + 3] = Math.round(a * 255);
      }
    }
  }

  // ---- Detail noise: 32×32×32 ----
  // R/G/B = inverted Worley at 3 higher frequencies (fine edge erosion)
  const DETAIL = 32;
  const detailData = new Uint8Array(DETAIL * DETAIL * DETAIL * 4);
  for (let z = 0; z < DETAIL; z++) {
    for (let y = 0; y < DETAIL; y++) {
      for (let x = 0; x < DETAIL; x++) {
        const idx = (z * DETAIL * DETAIL + y * DETAIL + x) * 4;
        const px = x / DETAIL, py = y / DETAIL, pz = z / DETAIL;
        const r = worley(px, py, pz, 4,  400);
        const g = worley(px, py, pz, 8,  500);
        const b = worley(px, py, pz, 16, 600);
        detailData[idx]     = Math.round(r * 255);
        detailData[idx + 1] = Math.round(g * 255);
        detailData[idx + 2] = Math.round(b * 255);
        detailData[idx + 3] = 255;
      }
    }
  }

  const baseNoise   = make3dTexture(device, 'CloudBaseNoise',   BASE,   baseData);
  const detailNoise = make3dTexture(device, 'CloudDetailNoise', DETAIL, detailData);

  return {
    baseNoise,   baseView:   baseNoise.createView({ dimension: '3d' }),
    detailNoise, detailView: detailNoise.createView({ dimension: '3d' }),
    destroy() { baseNoise.destroy(); detailNoise.destroy(); },
  };
}
