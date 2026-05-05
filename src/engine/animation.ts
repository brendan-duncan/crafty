export type Interpolation = 'LINEAR' | 'STEP' | 'CUBICSPLINE';

export interface AnimationChannel {
  jointIndex   : number;
  property     : 'translation' | 'rotation' | 'scale';
  times        : Float32Array;
  values       : Float32Array;
  interpolation: Interpolation;
}

export interface AnimationClip {
  name     : string;
  duration : number;
  channels : AnimationChannel[];
}

function lerpN(
  a: Float32Array, ai: number,
  b: Float32Array, bi: number,
  t: number, n: number,
  out: Float32Array, oi: number,
): void {
  for (let k = 0; k < n; k++) out[oi + k] = a[ai + k] + (b[bi + k] - a[ai + k]) * t;
}

function slerpQuat(
  a: Float32Array, ai: number,
  b: Float32Array, bi: number,
  t: number,
  out: Float32Array, oi: number,
): void {
  let bx = b[bi], by = b[bi + 1], bz = b[bi + 2], bw = b[bi + 3];
  let dot = a[ai] * bx + a[ai + 1] * by + a[ai + 2] * bz + a[ai + 3] * bw;
  if (dot < 0) { bx = -bx; by = -by; bz = -bz; bw = -bw; dot = -dot; }

  if (dot > 0.9995) {
    out[oi]     = a[ai]     + t * (bx - a[ai]);
    out[oi + 1] = a[ai + 1] + t * (by - a[ai + 1]);
    out[oi + 2] = a[ai + 2] + t * (bz - a[ai + 2]);
    out[oi + 3] = a[ai + 3] + t * (bw - a[ai + 3]);
    const len = Math.sqrt(out[oi] ** 2 + out[oi + 1] ** 2 + out[oi + 2] ** 2 + out[oi + 3] ** 2);
    if (len > 0) { out[oi] /= len; out[oi + 1] /= len; out[oi + 2] /= len; out[oi + 3] /= len; }
    return;
  }

  const theta = Math.acos(dot);
  const sinT  = Math.sin(theta);
  const sa    = Math.sin((1 - t) * theta) / sinT;
  const sb    = Math.sin(t * theta) / sinT;
  out[oi]     = sa * a[ai]     + sb * bx;
  out[oi + 1] = sa * a[ai + 1] + sb * by;
  out[oi + 2] = sa * a[ai + 2] + sb * bz;
  out[oi + 3] = sa * a[ai + 3] + sb * bw;
}

function findKeyframe(times: Float32Array, t: number): number {
  let lo = 0, hi = times.length - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (times[mid] <= t) lo = mid; else hi = mid - 1;
  }
  return lo;
}

// Fills translations (jointCount×3), rotations (jointCount×4), scales (jointCount×3)
// with sampled values from clip at the given time.
// Joints with no channel for a given property are left unchanged — callers should
// initialize the arrays with rest-pose values before calling this.
export function sampleClip(
  clip        : AnimationClip,
  time        : number,
  translations: Float32Array,
  rotations   : Float32Array,
  scales      : Float32Array,
): void {
  for (const ch of clip.channels) {
    const { jointIndex: ji, property: prop, times, values, interpolation } = ch;
    const n      = prop === 'rotation' ? 4 : 3;
    const outArr = prop === 'translation' ? translations : prop === 'rotation' ? rotations : scales;
    const oi     = ji * n;

    if (times.length === 0) {
      continue;
    }

    // Clamp to first keyframe
    if (time <= times[0]) {
      const base = interpolation === 'CUBICSPLINE' ? n : 0;
      for (let k = 0; k < n; k++) outArr[oi + k] = values[base + k];
      continue;
    }
    // Clamp to last keyframe
    if (time >= times[times.length - 1]) {
      const stride = interpolation === 'CUBICSPLINE' ? n * 3 : n;
      const base   = (times.length - 1) * stride + (interpolation === 'CUBICSPLINE' ? n : 0);
      for (let k = 0; k < n; k++) outArr[oi + k] = values[base + k];
      continue;
    }

    const i     = findKeyframe(times, time);
    const t0    = times[i], t1 = times[i + 1];
    const alpha = (time - t0) / (t1 - t0);

    if (interpolation === 'STEP') {
      for (let k = 0; k < n; k++) outArr[oi + k] = values[i * n + k];
    } else if (interpolation === 'CUBICSPLINE') {
      // Layout: [inTangent(n), value(n), outTangent(n)] per keyframe
      const stride = n * 3;
      const p0 = i * stride + n;
      const p1 = (i + 1) * stride + n;
      const m0 = i * stride + n * 2;       // out-tangent of frame i
      const m1 = (i + 1) * stride;         // in-tangent of frame i+1
      const dt = t1 - t0;
      const tt = alpha, tt2 = tt * tt, tt3 = tt2 * tt;
      const h00 = 2 * tt3 - 3 * tt2 + 1;
      const h10 = tt3 - 2 * tt2 + tt;
      const h01 = -2 * tt3 + 3 * tt2;
      const h11 = tt3 - tt2;
      for (let k = 0; k < n; k++) {
        outArr[oi + k] = h00 * values[p0 + k] + h10 * dt * values[m0 + k]
                       + h01 * values[p1 + k] + h11 * dt * values[m1 + k];
      }
      if (prop === 'rotation') {
        const x = outArr[oi], y = outArr[oi + 1], z = outArr[oi + 2], w = outArr[oi + 3];
        const len = Math.sqrt(x * x + y * y + z * z + w * w);
        if (len > 0) { outArr[oi] /= len; outArr[oi + 1] /= len; outArr[oi + 2] /= len; outArr[oi + 3] /= len; }
      }
    } else {
      if (prop === 'rotation') {
        slerpQuat(values, i * n, values, (i + 1) * n, alpha, outArr, oi);
      } else {
        lerpN(values, i * n, values, (i + 1) * n, alpha, n, outArr, oi);
      }
    }
  }
}
