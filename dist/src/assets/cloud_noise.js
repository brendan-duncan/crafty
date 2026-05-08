function hash3(x, y, z) {
    let h = ((Math.imul(x, 1664525) ^ Math.imul(y, 1013904223) ^ Math.imul(z, 22695477)) >>> 0);
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b)) >>> 0;
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b)) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 0xffffffff;
}
function hashS(x, y, z, seed) {
    return hash3(x ^ seed, y ^ (seed * 7 + 3), z ^ (seed * 13 + 5));
}
function smoothstep5(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}
function trilerp(v000, v100, v010, v110, v001, v101, v011, v111, fx, fy, fz) {
    const x00 = v000 + (v100 - v000) * fx;
    const x10 = v010 + (v110 - v010) * fx;
    const x01 = v001 + (v101 - v001) * fx;
    const x11 = v011 + (v111 - v011) * fx;
    const y0 = x00 + (x10 - x00) * fy;
    const y1 = x01 + (x11 - x01) * fy;
    return y0 + (y1 - y0) * fz;
}
// Classic Perlin 12 edge-midpoint gradient vectors — avoids axis alignment.
// Stored as parallel Int8Arrays so per-call lookup is a single typed-array
// index (no array-of-arrays destructuring allocations on the hot path).
const GRAD3_X = new Int8Array([1, -1, 1, -1, 1, -1, 1, -1, 0, 0, 0, 0]);
const GRAD3_Y = new Int8Array([1, 1, -1, -1, 0, 0, 0, 0, 1, -1, 1, -1]);
const GRAD3_Z = new Int8Array([0, 0, 0, 0, 1, 1, -1, -1, 1, 1, -1, -1]);
// Dot product of a lattice-derived gradient with the offset vector.
// Lattice coordinates are wrapped at `period` so the noise tiles. The modulo
// is inlined (no closure per call — was a major GC source at 8 calls/voxel).
function gradDot(lx, ly, lz, period, seed, dx, dy, dz) {
    const wx = ((lx % period) + period) % period;
    const wy = ((ly % period) + period) % period;
    const wz = ((lz % period) + period) % period;
    const gi = Math.floor(hashS(wx, wy, wz, seed) * 12) % 12;
    return GRAD3_X[gi] * dx + GRAD3_Y[gi] * dy + GRAD3_Z[gi] * dz;
}
// Tileable gradient Perlin noise. Output is in roughly [-0.7, 0.7].
function perlinGradTile(px, py, pz, period, seed) {
    const x0 = Math.floor(px), y0 = Math.floor(py), z0 = Math.floor(pz);
    const dx = px - x0, dy = py - y0, dz = pz - z0;
    const ux = smoothstep5(dx), uy = smoothstep5(dy), uz = smoothstep5(dz);
    return trilerp(gradDot(x0, y0, z0, period, seed, dx, dy, dz), gradDot(x0 + 1, y0, z0, period, seed, dx - 1, dy, dz), gradDot(x0, y0 + 1, z0, period, seed, dx, dy - 1, dz), gradDot(x0 + 1, y0 + 1, z0, period, seed, dx - 1, dy - 1, dz), gradDot(x0, y0, z0 + 1, period, seed, dx, dy, dz - 1), gradDot(x0 + 1, y0, z0 + 1, period, seed, dx - 1, dy, dz - 1), gradDot(x0, y0 + 1, z0 + 1, period, seed, dx, dy - 1, dz - 1), gradDot(x0 + 1, y0 + 1, z0 + 1, period, seed, dx - 1, dy - 1, dz - 1), ux, uy, uz);
}
// Tileable gradient Perlin FBM remapped to [0, 1].
function perlinGradFbmTile(px, py, pz, octaves, baseFreq, seed) {
    let v = 0, a = 0.5, f = 1, tot = 0;
    for (let i = 0; i < octaves; i++) {
        v += perlinGradTile(px * f, py * f, pz * f, baseFreq * f, seed + i * 17) * a;
        tot += a;
        a *= 0.5;
        f *= 2;
    }
    // Gradient noise sums to roughly ±0.7 * tot; scale and bias into [0,1].
    return Math.max(0, Math.min(1, v / tot * 0.85 + 0.5));
}
// Tileable Worley — cell grid wraps at `freq` cells on each axis.
// The wrap and the per-cell hash are inlined and cached: the previous
// implementation allocated a closure per call AND hashed the same wrapped
// cell three times to fetch fpx/fpy/fpz, both major GC sources.
function worleyTile(px, py, pz, freq, seed) {
    const fx = px * freq, fy = py * freq, fz = pz * freq;
    const ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz);
    let minD2 = Infinity;
    for (let dz = -1; dz <= 1; dz++) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const cx = ix + dx, cy = iy + dy, cz = iz + dz;
                // Wrap the cell coords for the hash (so the noise tiles), but keep the
                // unwrapped cell base for the distance so it's correct across the seam.
                const wcx = ((cx % freq) + freq) % freq;
                const wcy = ((cy % freq) + freq) % freq;
                const wcz = ((cz % freq) + freq) % freq;
                const fpx = cx + hashS(wcx, wcy, wcz, seed);
                const fpy = cy + hashS(wcx, wcy, wcz, seed + 1);
                const fpz = cz + hashS(wcx, wcy, wcz, seed + 2);
                const ddx = fx - fpx, ddy = fy - fpy, ddz = fz - fpz;
                const d2 = ddx * ddx + ddy * ddy + ddz * ddz;
                if (d2 < minD2) {
                    minD2 = d2;
                }
            }
        }
    }
    return 1.0 - Math.min(Math.sqrt(minD2), 1.0);
}
function make3dTexture(device, label, size, data) {
    const tex = device.createTexture({
        label, dimension: '3d',
        size: { width: size, height: size, depthOrArrayLayers: size },
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    device.queue.writeTexture({ texture: tex }, data.buffer, { bytesPerRow: size * 4, rowsPerImage: size }, { width: size, height: size, depthOrArrayLayers: size });
    return tex;
}
/**
 * Generates and uploads the cloud base and detail 3D noise textures.
 *
 * The base texture packs a tileable Perlin FBM in R (cloud bulk shape) and
 * three increasing-frequency Worley layers in GBA (erosion). The detail
 * texture packs three higher-frequency Worley layers in RGB for fine edge
 * erosion.
 *
 * @param device - WebGPU device used to create the textures.
 * @returns Both 3D textures with views; caller owns them and must `destroy()`.
 */
export function createCloudNoiseTextures(device) {
    // ---- Base noise: 64×64×64 ----
    // R = 4-octave tileable Perlin FBM (cloud bulk shape), 4 tiles across the texture
    // G/B/A = inverted tileable Worley at 3 increasing frequencies (erosion layers)
    const BASE = 64;
    const baseData = new Uint8Array(BASE * BASE * BASE * 4);
    for (let z = 0; z < BASE; z++) {
        for (let y = 0; y < BASE; y++) {
            for (let x = 0; x < BASE; x++) {
                const idx = (z * BASE * BASE + y * BASE + x) * 4;
                const px = x / BASE, py = y / BASE, pz = z / BASE;
                const r = perlinGradFbmTile(px, py, pz, 4, 4, 0);
                const g = worleyTile(px, py, pz, 2, 100);
                const b = worleyTile(px, py, pz, 4, 200);
                const a = worleyTile(px, py, pz, 8, 300);
                baseData[idx] = Math.round(r * 255);
                baseData[idx + 1] = Math.round(g * 255);
                baseData[idx + 2] = Math.round(b * 255);
                baseData[idx + 3] = Math.round(a * 255);
            }
        }
    }
    // ---- Detail noise: 32×32×32 ----
    // R/G/B = inverted tileable Worley at 3 higher frequencies (fine edge erosion)
    const DETAIL = 32;
    const detailData = new Uint8Array(DETAIL * DETAIL * DETAIL * 4);
    for (let z = 0; z < DETAIL; z++) {
        for (let y = 0; y < DETAIL; y++) {
            for (let x = 0; x < DETAIL; x++) {
                const idx = (z * DETAIL * DETAIL + y * DETAIL + x) * 4;
                const px = x / DETAIL, py = y / DETAIL, pz = z / DETAIL;
                const r = worleyTile(px, py, pz, 4, 400);
                const g = worleyTile(px, py, pz, 8, 500);
                const b = worleyTile(px, py, pz, 16, 600);
                detailData[idx] = Math.round(r * 255);
                detailData[idx + 1] = Math.round(g * 255);
                detailData[idx + 2] = Math.round(b * 255);
                detailData[idx + 3] = 255;
            }
        }
    }
    const baseNoise = make3dTexture(device, 'CloudBaseNoise', BASE, baseData);
    const detailNoise = make3dTexture(device, 'CloudDetailNoise', DETAIL, detailData);
    return {
        baseNoise, baseView: baseNoise.createView({ dimension: '3d' }),
        detailNoise, detailView: detailNoise.createView({ dimension: '3d' }),
        destroy() { baseNoise.destroy(); detailNoise.destroy(); },
    };
}
