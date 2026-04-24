import type { HdrData } from './hdr_loader.js';

const PI = Math.PI;

export interface IblTextures {
  readonly irradiance    : GPUTexture;   // rgba16float 64×32 — pre-integrated diffuse
  readonly prefiltered   : GPUTexture;   // rgba16float 64×32 × IBL_LEVELS layers — GGX pre-filtered
  readonly brdfLut       : GPUTexture;   // rgba16float 64×64 — split-sum A/B in rg
  readonly irradianceView : GPUTextureView;
  readonly prefilteredView: GPUTextureView; // dimension: '2d-array'
  readonly brdfLutView    : GPUTextureView;
  readonly levels         : number;
  destroy(): void;
}

// Number of roughness levels in the pre-filtered env array (must match shader IBL_LEVELS)
export const IBL_LEVELS = 5;
const ROUGHNESSES = [0, 0.25, 0.5, 0.75, 1.0];

// === Math helpers ====================================================

function dot3(a: [number, number, number], b: [number, number, number]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross3(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
}

function normalize3(v: [number, number, number]): [number, number, number] {
  const l = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  return l > 0 ? [v[0]/l, v[1]/l, v[2]/l] : [0, 1, 0];
}

// Decode RGBE bytes → linear RGB
function decodeRGBE(r: number, g: number, b: number, e: number): [number, number, number] {
  if (e === 0) return [0, 0, 0];
  const scale = Math.pow(2, e - 136); // 2^(E_byte - 128 - 8)
  return [r * scale, g * scale, b * scale];
}

// Bilinear equirectangular sample from RGBE data
function sampleEquirect(
  data: Uint8Array, w: number, h: number,
  dx: number, dy: number, dz: number,
): [number, number, number] {
  const u = (Math.atan2(-dz, dx) / (2 * PI) + 0.5) * w;
  const v = (Math.acos(Math.max(-1, Math.min(1, dy))) / PI) * h;
  const x0 = Math.floor(u) % w;
  const y0 = Math.max(0, Math.min(h - 1, Math.floor(v)));
  const x1 = (x0 + 1) % w;
  const y1 = Math.min(y0 + 1, h - 1);
  const fu = u - Math.floor(u);
  const fv = v - Math.floor(v);

  function px(xi: number, yi: number): [number, number, number] {
    const idx = (yi * w + xi) * 4;
    return decodeRGBE(data[idx], data[idx+1], data[idx+2], data[idx+3]);
  }

  const c00 = px(x0, y0), c10 = px(x1, y0), c01 = px(x0, y1), c11 = px(x1, y1);
  return [
    (c00[0]*(1-fu) + c10[0]*fu)*(1-fv) + (c01[0]*(1-fu) + c11[0]*fu)*fv,
    (c00[1]*(1-fu) + c10[1]*fu)*(1-fv) + (c01[1]*(1-fu) + c11[1]*fu)*fv,
    (c00[2]*(1-fu) + c10[2]*fu)*(1-fv) + (c01[2]*(1-fu) + c11[2]*fu)*fv,
  ];
}

// Build orthonormal tangent frame around N
function tangentFrame(N: [number, number, number]): [[number, number, number], [number, number, number]] {
  const up: [number, number, number] = Math.abs(N[1]) < 0.999 ? [0, 1, 0] : [1, 0, 0];
  const T = normalize3(cross3(up, N));
  const B = cross3(N, T);
  return [T, B];
}

// Van der Corput radical inverse (base 2)
function radicalInverse(n: number): number {
  let bits = n >>> 0;
  bits = ((bits << 16) | (bits >>> 16)) >>> 0;
  bits = (((bits & 0x55555555) << 1) | ((bits >>> 1) & 0x55555555)) >>> 0;
  bits = (((bits & 0x33333333) << 2) | ((bits >>> 2) & 0x33333333)) >>> 0;
  bits = (((bits & 0x0f0f0f0f) << 4) | ((bits >>> 4) & 0x0f0f0f0f)) >>> 0;
  bits = (((bits & 0x00ff00ff) << 8) | ((bits >>> 8) & 0x00ff00ff)) >>> 0;
  return bits * 2.3283064365386963e-10;
}

// === Irradiance (diffuse IBL) ========================================
//
// Computes E(N) / π = ∫ L(ω) cosθ dω / π using cosine-weighted sampling.
// With cosine-weighted PDF = cosθ/π, the estimator is simply:
//   irradiance_stored = (1/N) Σ L(ωi)
// In the shader: diffuse = kD * albedo * irradiance_stored  (no extra π needed)
function computeIrradianceData(hdr: HdrData, outW: number, outH: number, samples: number, exposure: number): Float32Array {
  const out = new Float32Array(outW * outH * 4);

  for (let py = 0; py < outH; py++) {
    for (let px = 0; px < outW; px++) {
      const phi   = ((px + 0.5) / outW) * 2 * PI;
      const theta = ((py + 0.5) / outH) * PI;
      const N: [number, number, number] = [
        Math.sin(theta) * Math.cos(phi),
        Math.cos(theta),
        Math.sin(theta) * Math.sin(phi),
      ];
      const [T, B] = tangentFrame(N);

      let r = 0, g = 0, b = 0;
      for (let i = 0; i < samples; i++) {
        // Stratified (1D) + Halton(2) cosine-weighted hemisphere sample
        const xi1 = (i + 0.5) / samples;
        const xi2 = radicalInverse(i);
        const sinT = Math.sqrt(xi1);
        const cosT = Math.sqrt(1 - xi1);
        const phiS = 2 * PI * xi2;
        const lx = sinT * Math.cos(phiS);
        const ly = sinT * Math.sin(phiS);
        const lz = cosT;
        const wx = lx * T[0] + ly * B[0] + lz * N[0];
        const wy = lx * T[1] + ly * B[1] + lz * N[1];
        const wz = lx * T[2] + ly * B[2] + lz * N[2];
        const [sr, sg, sb] = sampleEquirect(hdr.data, hdr.width, hdr.height, wx, wy, wz);
        r += sr; g += sg; b += sb;
      }

      const base = (py * outW + px) * 4;
      out[base+0] = r / samples * exposure;
      out[base+1] = g / samples * exposure;
      out[base+2] = b / samples * exposure;
      out[base+3] = 1;
    }
  }
  return out;
}

// === Pre-filtered environment (specular IBL) ==========================
//
// For reflection direction R (= N = V by the split-sum assumption), integrates
// L(ω) weighted by the GGX NDF at the given roughness.
function computePrefilteredData(hdr: HdrData, outW: number, outH: number, roughness: number, samples: number, exposure: number): Float32Array {
  const out = new Float32Array(outW * outH * 4);
  const a  = roughness * roughness;
  const a2 = a * a;

  for (let py = 0; py < outH; py++) {
    for (let px = 0; px < outW; px++) {
      const phi   = ((px + 0.5) / outW) * 2 * PI;
      const theta = ((py + 0.5) / outH) * PI;
      const N: [number, number, number] = [
        Math.sin(theta) * Math.cos(phi),
        Math.cos(theta),
        Math.sin(theta) * Math.sin(phi),
      ];
      const [T, B] = tangentFrame(N);

      let sumR = 0, sumG = 0, sumB = 0, weight = 0;
      for (let i = 0; i < samples; i++) {
        const xi1 = (i + 0.5) / samples;
        const xi2 = radicalInverse(i);

        // GGX importance sample half-vector H in tangent space
        const cosT2 = (1 - xi2) / (1 + (a2 - 1) * xi2);
        const cosT  = Math.sqrt(cosT2);
        const sinT  = Math.sqrt(1 - cosT2);
        const phiH  = 2 * PI * xi1;
        const hx = sinT * Math.cos(phiH);
        const hy = sinT * Math.sin(phiH);
        const hz = cosT;

        // H in world space
        const Hx = hx*T[0] + hy*B[0] + hz*N[0];
        const Hy = hx*T[1] + hy*B[1] + hz*N[1];
        const Hz = hx*T[2] + hy*B[2] + hz*N[2];

        // Reflect N around H to get L (V = N in the split-sum approximation)
        const VdotH = cosT; // dot(N, H) = cosT
        const Lx = 2 * VdotH * Hx - N[0];
        const Ly = 2 * VdotH * Hy - N[1];
        const Lz = 2 * VdotH * Hz - N[2];

        const NdotL = Math.max(0, dot3(N, [Lx, Ly, Lz]));
        if (NdotL <= 0) continue;

        const [sr, sg, sb] = sampleEquirect(hdr.data, hdr.width, hdr.height, Lx, Ly, Lz);
        sumR += sr * NdotL;
        sumG += sg * NdotL;
        sumB += sb * NdotL;
        weight += NdotL;
      }

      const w = weight > 0 ? weight : 1;
      const base = (py * outW + px) * 4;
      out[base+0] = sumR / w * exposure;
      out[base+1] = sumG / w * exposure;
      out[base+2] = sumB / w * exposure;
      out[base+3] = 1;
    }
  }
  return out;
}

// === BRDF LUT ========================================================
//
// Precomputes the split-sum BRDF terms A and B for (NdotV, roughness).
// In the shader: specular_ibl = prefiltered * (F0 * A + B)
// Uses IBL k = roughness²/2 for the geometry term (as per UE4 recommendation).
function computeBrdfLutData(outW: number, outH: number, samples: number): Float32Array {
  const out = new Float32Array(outW * outH * 4);

  for (let py = 0; py < outH; py++) {
    for (let px = 0; px < outW; px++) {
      const NdotV    = (px + 0.5) / outW;
      const roughness = (py + 0.5) / outH;
      const a  = roughness * roughness;
      const a2 = a * a;

      // V in tangent space with N = (0,0,1): V = (sqrt(1-NdotV²), 0, NdotV)
      const Vx = Math.sqrt(1 - NdotV * NdotV);
      const Vz = NdotV;

      let A = 0, B = 0;
      for (let i = 0; i < samples; i++) {
        const xi1 = (i + 0.5) / samples;
        const xi2 = radicalInverse(i);

        const cosT2 = (1 - xi2) / (1 + (a2 - 1) * xi2);
        const cosT  = Math.sqrt(cosT2);
        const sinT  = Math.sqrt(Math.max(0, 1 - cosT2));
        const phiH  = 2 * PI * xi1;

        const Hx  = sinT * Math.cos(phiH);
        const Hz  = cosT;
        const VdotH = Vx * Hx + Vz * Hz;
        if (VdotH <= 0) continue;

        const Lx = 2 * VdotH * Hx - Vx;
        const Lz = 2 * VdotH * Hz - Vz;
        const NdotL = Math.max(0, Lz); // N.z = 1
        const NdotH = Math.max(0, cosT);
        if (NdotL <= 0) continue;

        // Smith geometry with IBL k = a²/2
        const k     = a2 / 2;
        const G_v   = NdotV / (NdotV * (1 - k) + k);
        const G_l   = NdotL / (NdotL * (1 - k) + k);
        const G_vis = G_v * G_l * VdotH / (NdotH * NdotV);

        const Fc = Math.pow(1 - VdotH, 5);
        A += G_vis * (1 - Fc);
        B += G_vis * Fc;
      }

      const base = (py * outW + px) * 4;
      out[base+0] = A / samples;
      out[base+1] = B / samples;
      out[base+2] = 0;
      out[base+3] = 1;
    }
  }
  return out;
}

// === Float32 → Float16 (IEEE 754) ====================================

function encodeF16(v: number): number {
  const f32 = new Float32Array([v]);
  const u32 = new Uint32Array(f32.buffer)[0];
  const sign     = (u32 >> 31) & 1;
  const exponent = (u32 >> 23) & 0xff;
  const mantissa = u32 & 0x7fffff;
  if (exponent === 0xff) return (sign << 15) | 0x7c00 | (mantissa ? 1 : 0);
  if (exponent === 0)    return (sign << 15);
  const e16 = exponent - 127 + 15;
  if (e16 >= 0x1f) return (sign << 15) | 0x7c00;
  if (e16 <= 0)    return (sign << 15);
  return (sign << 15) | (e16 << 10) | (mantissa >> 13);
}

function toF16(src: Float32Array): Uint16Array {
  const dst = new Uint16Array(src.length);
  for (let i = 0; i < src.length; i++) dst[i] = encodeF16(src[i]);
  return dst;
}

function upload2d(device: GPUDevice, data: Float32Array, w: number, h: number, label: string): GPUTexture {
  const tex = device.createTexture({
    label, size: { width: w, height: h },
    format: 'rgba16float',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  device.queue.writeTexture({ texture: tex }, toF16(data), { bytesPerRow: w * 8 }, { width: w, height: h });
  return tex;
}

// === Public API ======================================================

export function computeIbl(device: GPUDevice, hdr: HdrData, exposure = 0.2): IblTextures {
  const IRR_W = 64,  IRR_H = 32,  IRR_SAMPLES = 256;
  const PF_W  = 64,  PF_H  = 32,  PF_SAMPLES  = 256;
  const LUT_W = 64,  LUT_H = 64,  LUT_SAMPLES = 512;

  const irradiance = upload2d(device,
    computeIrradianceData(hdr, IRR_W, IRR_H, IRR_SAMPLES, exposure),
    IRR_W, IRR_H, 'IBL Irradiance',
  );

  const prefiltered = device.createTexture({
    label: 'IBL Prefiltered',
    size: { width: PF_W, height: PF_H, depthOrArrayLayers: IBL_LEVELS },
    format: 'rgba16float',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  for (let l = 0; l < IBL_LEVELS; l++) {
    const f16 = toF16(computePrefilteredData(hdr, PF_W, PF_H, ROUGHNESSES[l], PF_SAMPLES, exposure));
    device.queue.writeTexture(
      { texture: prefiltered, origin: { x: 0, y: 0, z: l } },
      f16, { bytesPerRow: PF_W * 8 }, { width: PF_W, height: PF_H },
    );
  }

  const brdfLut = upload2d(device,
    computeBrdfLutData(LUT_W, LUT_H, LUT_SAMPLES),
    LUT_W, LUT_H, 'IBL BRDF LUT',
  );

  const irradianceView  = irradiance.createView();
  const prefilteredView = prefiltered.createView({ dimension: '2d-array' });
  const brdfLutView     = brdfLut.createView();

  return {
    irradiance, prefiltered, brdfLut,
    irradianceView, prefilteredView, brdfLutView,
    levels: IBL_LEVELS,
    destroy() {
      irradiance.destroy();
      prefiltered.destroy();
      brdfLut.destroy();
    },
  };
}
