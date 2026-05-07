// Ported from stb_perlin.h v0.5 by Sean Barrett (public domain / MIT)
// https://github.com/nothings/stb

// Not the same permutation table as Perlin's reference (to avoid copyright).
const _randtab = new Uint8Array([
   23, 125, 161,  52, 103, 117,  70,  37, 247, 101, 203, 169, 124, 126,  44, 123,
  152, 238, 145,  45, 171, 114, 253,  10, 192, 136,   4, 157, 249,  30,  35,  72,
  175,  63,  77,  90, 181,  16,  96, 111, 133, 104,  75, 162,  93,  56,  66, 240,
    8,  50,  84, 229,  49, 210, 173, 239, 141,   1,  87,  18,   2, 198, 143,  57,
  225, 160,  58, 217, 168, 206, 245, 204, 199,   6,  73,  60,  20, 230, 211, 233,
   94, 200,  88,   9,  74, 155,  33,  15, 219, 130, 226, 202,  83, 236,  42, 172,
  165, 218,  55, 222,  46, 107,  98, 154, 109,  67, 196, 178, 127, 158,  13, 243,
   65,  79, 166, 248,  25, 224, 115,  80,  68,  51, 184, 128, 232, 208, 151, 122,
   26, 212, 105,  43, 179, 213, 235, 148, 146,  89,  14, 195,  28,  78, 112,  76,
  250,  47,  24, 251, 140, 108, 186, 190, 228, 170, 183, 139,  39, 188, 244, 246,
  132,  48, 119, 144, 180, 138, 134, 193,  82, 182, 120, 121,  86, 220, 209,   3,
   91, 241, 149,  85, 205, 150, 113, 216,  31, 100,  41, 164, 177, 214, 153, 231,
   38,  71, 185, 174,  97, 201,  29,  95,   7,  92,  54, 254, 191, 118,  34, 221,
  131,  11, 163,  99, 234,  81, 227, 147, 156, 176,  17, 142,  69,  12, 110,  62,
   27, 255,   0, 194,  59, 116, 242, 252,  19,  21, 187,  53, 207, 129,  64, 135,
   61,  40, 167, 237, 102, 223, 106, 159, 197, 189, 215, 137,  36,  32,  22,   5,
  // second copy — avoids needing an extra mask
   23, 125, 161,  52, 103, 117,  70,  37, 247, 101, 203, 169, 124, 126,  44, 123,
  152, 238, 145,  45, 171, 114, 253,  10, 192, 136,   4, 157, 249,  30,  35,  72,
  175,  63,  77,  90, 181,  16,  96, 111, 133, 104,  75, 162,  93,  56,  66, 240,
    8,  50,  84, 229,  49, 210, 173, 239, 141,   1,  87,  18,   2, 198, 143,  57,
  225, 160,  58, 217, 168, 206, 245, 204, 199,   6,  73,  60,  20, 230, 211, 233,
   94, 200,  88,   9,  74, 155,  33,  15, 219, 130, 226, 202,  83, 236,  42, 172,
  165, 218,  55, 222,  46, 107,  98, 154, 109,  67, 196, 178, 127, 158,  13, 243,
   65,  79, 166, 248,  25, 224, 115,  80,  68,  51, 184, 128, 232, 208, 151, 122,
   26, 212, 105,  43, 179, 213, 235, 148, 146,  89,  14, 195,  28,  78, 112,  76,
  250,  47,  24, 251, 140, 108, 186, 190, 228, 170, 183, 139,  39, 188, 244, 246,
  132,  48, 119, 144, 180, 138, 134, 193,  82, 182, 120, 121,  86, 220, 209,   3,
   91, 241, 149,  85, 205, 150, 113, 216,  31, 100,  41, 164, 177, 214, 153, 231,
   38,  71, 185, 174,  97, 201,  29,  95,   7,  92,  54, 254, 191, 118,  34, 221,
  131,  11, 163,  99, 234,  81, 227, 147, 156, 176,  17, 142,  69,  12, 110,  62,
   27, 255,   0, 194,  59, 116, 242, 252,  19,  21, 187,  53, 207, 129,  64, 135,
   61,  40, 167, 237, 102, 223, 106, 159, 197, 189, 215, 137,  36,  32,  22,   5,
]);

// Gradient index table — reduces bias vs. a naive mod-12 on randtab
const _gradIdx = new Uint8Array([
    7,  9,  5,  0, 11,  1,  6,  9,  3,  9, 11,  1,  8, 10,  4,  7,
    8,  6,  1,  5,  3, 10,  9, 10,  0,  8,  4,  1,  5,  2,  7,  8,
    7, 11,  9, 10,  1,  0,  4,  7,  5,  0, 11,  6,  1,  4,  2,  8,
    8, 10,  4,  9,  9,  2,  5,  7,  9,  1,  7,  2,  2,  6, 11,  5,
    5,  4,  6,  9,  0,  1,  1,  0,  7,  6,  9,  8,  4, 10,  3,  1,
    2,  8,  8,  9, 10, 11,  5, 11, 11,  2,  6, 10,  3,  4,  2,  4,
    9, 10,  3,  2,  6,  3,  6, 10,  5,  3,  4, 10, 11,  2,  9, 11,
    1, 11, 10,  4,  9,  4, 11,  0,  4, 11,  4,  0,  0,  0,  7,  6,
   10,  4,  1,  3, 11,  5,  3,  4,  2,  9,  1,  3,  0,  1,  8,  0,
    6,  7,  8,  7,  0,  4,  6, 10,  8,  2,  3, 11, 11,  8,  0,  2,
    4,  8,  3,  0,  0, 10,  6,  1,  2,  2,  4,  5,  6,  0,  1,  3,
   11,  9,  5,  5,  9,  6,  9,  8,  3,  8,  1,  8,  9,  6,  9, 11,
   10,  7,  5,  6,  5,  9,  1,  3,  7,  0,  2, 10, 11,  2,  6,  1,
    3, 11,  7,  7,  2,  1,  7,  3,  0,  8,  1,  1,  5,  0,  6, 10,
   11, 11,  0,  2,  7,  0, 10,  8,  3,  5,  7,  1, 11,  1,  0,  7,
    9,  0, 11,  5, 10,  3,  2,  3,  5,  9,  7,  9,  8,  4,  6,  5,
  // second copy
    7,  9,  5,  0, 11,  1,  6,  9,  3,  9, 11,  1,  8, 10,  4,  7,
    8,  6,  1,  5,  3, 10,  9, 10,  0,  8,  4,  1,  5,  2,  7,  8,
    7, 11,  9, 10,  1,  0,  4,  7,  5,  0, 11,  6,  1,  4,  2,  8,
    8, 10,  4,  9,  9,  2,  5,  7,  9,  1,  7,  2,  2,  6, 11,  5,
    5,  4,  6,  9,  0,  1,  1,  0,  7,  6,  9,  8,  4, 10,  3,  1,
    2,  8,  8,  9, 10, 11,  5, 11, 11,  2,  6, 10,  3,  4,  2,  4,
    9, 10,  3,  2,  6,  3,  6, 10,  5,  3,  4, 10, 11,  2,  9, 11,
    1, 11, 10,  4,  9,  4, 11,  0,  4, 11,  4,  0,  0,  0,  7,  6,
   10,  4,  1,  3, 11,  5,  3,  4,  2,  9,  1,  3,  0,  1,  8,  0,
    6,  7,  8,  7,  0,  4,  6, 10,  8,  2,  3, 11, 11,  8,  0,  2,
    4,  8,  3,  0,  0, 10,  6,  1,  2,  2,  4,  5,  6,  0,  1,  3,
   11,  9,  5,  5,  9,  6,  9,  8,  3,  8,  1,  8,  9,  6,  9, 11,
   10,  7,  5,  6,  5,  9,  1,  3,  7,  0,  2, 10, 11,  2,  6,  1,
    3, 11,  7,  7,  2,  1,  7,  3,  0,  8,  1,  1,  5,  0,  6, 10,
   11, 11,  0,  2,  7,  0, 10,  8,  3,  5,  7,  1, 11,  1,  0,  7,
    9,  0, 11,  5, 10,  3,  2,  3,  5,  9,  7,  9,  8,  4,  6,  5,
]);

// 12 gradient vectors, flattened (x, y, z per row)
const _basis = new Float32Array([
   1,  1,  0,
  -1,  1,  0,
   1, -1,  0,
  -1, -1,  0,
   1,  0,  1,
  -1,  0,  1,
   1,  0, -1,
  -1,  0, -1,
   0,  1,  1,
   0, -1,  1,
   0,  1, -1,
   0, -1, -1,
]);

function _fastfloor(a: number): number {
  const ai = a | 0;
  return a < ai ? ai - 1 : ai;
}

function _grad(gi: number, x: number, y: number, z: number): number {
  const i = gi * 3;
  return _basis[i] * x + _basis[i + 1] * y + _basis[i + 2] * z;
}

function _ease(a: number): number {
  return ((a * 6 - 15) * a + 10) * a * a * a;
}

function _noise3Internal(
  x: number, y: number, z: number,
  xWrap: number, yWrap: number, zWrap: number,
  seed: number,
): number {
  const xMask = (xWrap - 1) & 0xFF;
  const yMask = (yWrap - 1) & 0xFF;
  const zMask = (zWrap - 1) & 0xFF;

  const px = _fastfloor(x);
  const py = _fastfloor(y);
  const pz = _fastfloor(z);

  const x0 = px & xMask;
  const x1 = (px + 1) & xMask;
  const y0 = py & yMask;
  const y1 = (py + 1) & yMask;
  const z0 = pz & zMask;
  const z1 = (pz + 1) & zMask;

  const fx = x - px;
  const u = _ease(fx);
  const fy = y - py;
  const v = _ease(fy);
  const fz = z - pz;
  const w = _ease(fz);

  const r0  = _randtab[x0 + seed];
  const r1  = _randtab[x1 + seed];
  const r00 = _randtab[r0 + y0];
  const r01 = _randtab[r0 + y1];
  const r10 = _randtab[r1 + y0];
  const r11 = _randtab[r1 + y1];

  const n000 = _grad(_gradIdx[r00 + z0], fx,     fy,     fz    );
  const n001 = _grad(_gradIdx[r00 + z1], fx,     fy,     fz - 1);
  const n010 = _grad(_gradIdx[r01 + z0], fx,     fy - 1, fz    );
  const n011 = _grad(_gradIdx[r01 + z1], fx,     fy - 1, fz - 1);
  const n100 = _grad(_gradIdx[r10 + z0], fx - 1, fy,     fz    );
  const n101 = _grad(_gradIdx[r10 + z1], fx - 1, fy,     fz - 1);
  const n110 = _grad(_gradIdx[r11 + z0], fx - 1, fy - 1, fz    );
  const n111 = _grad(_gradIdx[r11 + z1], fx - 1, fy - 1, fz - 1);

  const n00 = n000 + (n001 - n000) * w;
  const n01 = n010 + (n011 - n010) * w;
  const n10 = n100 + (n101 - n100) * w;
  const n11 = n110 + (n111 - n110) * w;
  const n0  = n00  + (n01  - n00 ) * v;
  const n1  = n10  + (n11  - n10 ) * v;
  return n0 + (n1 - n0) * u;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Samples 3D classic Perlin gradient noise (stb_perlin port).
 *
 * @param x - x coordinate in noise space
 * @param y - y coordinate in noise space
 * @param z - z coordinate in noise space
 * @param xWrap - power-of-two tiling period along x (0 = no wrapping)
 * @param yWrap - power-of-two tiling period along y (0 = no wrapping)
 * @param zWrap - power-of-two tiling period along z (0 = no wrapping)
 * @returns noise value, roughly in [-1, 1]
 */
export function perlinNoise3(
  x: number, y: number, z: number,
  xWrap = 0, yWrap = 0, zWrap = 0,
): number {
  return _noise3Internal(x, y, z, xWrap, yWrap, zWrap, 0);
}

/**
 * Same as {@link perlinNoise3} but with an explicit seed (low 8 bits used) to decorrelate octaves
 * or produce independent noise fields.
 */
export function perlinNoise3Seed(
  x: number, y: number, z: number,
  xWrap: number, yWrap: number, zWrap: number,
  seed: number,
): number {
  return _noise3Internal(x, y, z, xWrap, yWrap, zWrap, seed & 0xFF);
}

/**
 * Ridged multifractal noise: `(offset - |perlin|)^2` summed over octaves with multiplicative
 * carry-over from the previous octave. Useful for sharp mountain ridges.
 *
 * @param lacunarity - frequency multiplier between octaves (typically ~2)
 * @param gain - amplitude multiplier between octaves (typically ~0.5)
 * @param offset - ridge offset, controls the height of the ridges (typically ~1)
 * @param octaves - number of octaves to sum
 */
export function perlinRidgeNoise3(
  x: number, y: number, z: number,
  lacunarity: number, gain: number, offset: number,
  octaves: number,
): number {
  let frequency = 1.0;
  let prev = 1.0;
  let amplitude = 0.5;
  let sum = 0.0;
  for (let i = 0; i < octaves; i++) {
    let r = _noise3Internal(x * frequency, y * frequency, z * frequency, 0, 0, 0, i & 0xFF);
    r = offset - Math.abs(r);
    r = r * r;
    sum += r * amplitude * prev;
    prev = r;
    frequency *= lacunarity;
    amplitude *= gain;
  }
  return sum;
}

/**
 * Fractional Brownian motion: sums signed Perlin noise across multiple octaves.
 *
 * @param lacunarity - frequency multiplier between octaves (typically ~2)
 * @param gain - amplitude multiplier between octaves (typically ~0.5)
 * @param octaves - number of octaves to sum
 */
export function perlinFbmNoise3(
  x: number, y: number, z: number,
  lacunarity: number, gain: number,
  octaves: number,
): number {
  let frequency = 1.0;
  let amplitude = 1.0;
  let sum = 0.0;
  for (let i = 0; i < octaves; i++) {
    sum += _noise3Internal(x * frequency, y * frequency, z * frequency, 0, 0, 0, i & 0xFF) * amplitude;
    frequency *= lacunarity;
    amplitude *= gain;
  }
  return sum;
}

/**
 * Turbulence noise: like fBM but sums the absolute value of each octave, producing the
 * classic billowy "clouds" look.
 *
 * @param lacunarity - frequency multiplier between octaves (typically ~2)
 * @param gain - amplitude multiplier between octaves (typically ~0.5)
 * @param octaves - number of octaves to sum
 */
export function perlinTurbulenceNoise3(
  x: number, y: number, z: number,
  lacunarity: number, gain: number,
  octaves: number,
): number {
  let frequency = 1.0;
  let amplitude = 1.0;
  let sum = 0.0;
  for (let i = 0; i < octaves; i++) {
    sum += Math.abs(_noise3Internal(x * frequency, y * frequency, z * frequency, 0, 0, 0, i & 0xFF) * amplitude);
    frequency *= lacunarity;
    amplitude *= gain;
  }
  return sum;
}

/**
 * Perlin noise variant that supports arbitrary (non-power-of-two) tiling periods up to 256.
 *
 * Slightly slower than {@link perlinNoise3Seed} because it uses true modulo instead of bit
 * masking. Pass 0 for any axis to default that period to 256.
 *
 * @param xWrap - tiling period along x in [0, 256]
 * @param yWrap - tiling period along y in [0, 256]
 * @param zWrap - tiling period along z in [0, 256]
 * @param seed - seed (low 8 bits used)
 */
export function perlinNoise3WrapNonpow2(
  x: number, y: number, z: number,
  xWrap: number, yWrap: number, zWrap: number,
  seed: number,
): number {
  const xWrap2 = xWrap || 256;
  const yWrap2 = yWrap || 256;
  const zWrap2 = zWrap || 256;

  const px = _fastfloor(x);
  const py = _fastfloor(y);
  const pz = _fastfloor(z);

  let x0 = px % xWrap2;
  if (x0 < 0) {
    x0 += xWrap2;
  }
  let y0 = py % yWrap2;
  if (y0 < 0) {
    y0 += yWrap2;
  }
  let z0 = pz % zWrap2;
  if (z0 < 0) {
    z0 += zWrap2;
  }
  const x1 = (x0 + 1) % xWrap2;
  const y1 = (y0 + 1) % yWrap2;
  const z1 = (z0 + 1) % zWrap2;

  const fx = x - px;
  const u = _ease(fx);
  const fy = y - py;
  const v = _ease(fy);
  const fz = z - pz;
  const w = _ease(fz);

  const s = seed & 0xFF;
  const r0  = _randtab[_randtab[x0] + s];
  const r1  = _randtab[_randtab[x1] + s];
  const r00 = _randtab[r0 + y0];
  const r01 = _randtab[r0 + y1];
  const r10 = _randtab[r1 + y0];
  const r11 = _randtab[r1 + y1];

  const n000 = _grad(_gradIdx[r00 + z0], fx,     fy,     fz    );
  const n001 = _grad(_gradIdx[r00 + z1], fx,     fy,     fz - 1);
  const n010 = _grad(_gradIdx[r01 + z0], fx,     fy - 1, fz    );
  const n011 = _grad(_gradIdx[r01 + z1], fx,     fy - 1, fz - 1);
  const n100 = _grad(_gradIdx[r10 + z0], fx - 1, fy,     fz    );
  const n101 = _grad(_gradIdx[r10 + z1], fx - 1, fy,     fz - 1);
  const n110 = _grad(_gradIdx[r11 + z0], fx - 1, fy - 1, fz    );
  const n111 = _grad(_gradIdx[r11 + z1], fx - 1, fy - 1, fz - 1);

  const n00 = n000 + (n001 - n000) * w;
  const n01 = n010 + (n011 - n010) * w;
  const n10 = n100 + (n101 - n100) * w;
  const n11 = n110 + (n111 - n110) * w;
  const n0  = n00  + (n01  - n00 ) * v;
  const n1  = n10  + (n11  - n10 ) * v;
  return n0 + (n1 - n0) * u;
}
