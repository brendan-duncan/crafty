const IDENTITY_MAT4 = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);

export class Skeleton {
  readonly jointCount    : number;
  readonly parentIndices : Int16Array;
  readonly invBindMats   : Float32Array;  // jointCount × 16, column-major
  readonly rootTransform : Float32Array;  // 16 floats, column-major — accumulated ancestor transform above root joint

  // Rest-pose per joint (from node defaults)
  readonly restTranslations: Float32Array;  // jointCount × 3
  readonly restRotations   : Float32Array;  // jointCount × 4 (xyzw)
  readonly restScales      : Float32Array;  // jointCount × 3

  // Pre-allocated scratch buffers for computeJointMatrices — avoids per-frame GC.
  private readonly _globalMats: Float32Array;
  private readonly _localMat   = new Float32Array(16);

  constructor(
    parentIndices    : Int16Array,
    invBindMats      : Float32Array,
    restTranslations : Float32Array,
    restRotations    : Float32Array,
    restScales       : Float32Array,
    rootTransform?   : Float32Array,
  ) {
    this.jointCount       = parentIndices.length;
    this.parentIndices    = parentIndices;
    this.invBindMats      = invBindMats;
    this.rootTransform    = rootTransform ?? IDENTITY_MAT4.slice();
    this.restTranslations = restTranslations;
    this.restRotations    = restRotations;
    this.restScales       = restScales;
    this._globalMats      = new Float32Array(this.jointCount * 16);
  }

  // Computes final joint matrices from per-joint TRS arrays.
  // Parents must appear before children in the joint list (guaranteed by GLTF).
  // out: Float32Array of length jointCount × 16, column-major.
  computeJointMatrices(
    translations: Float32Array,
    rotations   : Float32Array,
    scales      : Float32Array,
    out         : Float32Array,
  ): void {
    const n      = this.jointCount;
    const global = this._globalMats;
    const local  = this._localMat;

    for (let j = 0; j < n; j++) {
      const tx = translations[j * 3],     ty = translations[j * 3 + 1], tz = translations[j * 3 + 2];
      const qx = rotations[j * 4],        qy = rotations[j * 4 + 1],   qz = rotations[j * 4 + 2], qw = rotations[j * 4 + 3];
      const sx = scales[j * 3],           sy = scales[j * 3 + 1],      sz = scales[j * 3 + 2];

      // Rotation part from quaternion (row-major formula, written into column-major layout)
      const x2 = qx + qx, y2 = qy + qy, z2 = qz + qz;
      const xx = qx * x2, xy = qx * y2, xz = qx * z2;
      const yy = qy * y2, yz = qy * z2, zz = qz * z2;
      const wx = qw * x2, wy = qw * y2, wz = qw * z2;

      // Column-major TRS matrix:
      // col0 = right*sx, col1 = up*sy, col2 = fwd*sz, col3 = translation
      local[0]  = (1 - (yy + zz)) * sx; local[1]  = (xy + wz) * sx;       local[2]  = (xz - wy) * sx; local[3]  = 0;
      local[4]  = (xy - wz) * sy;       local[5]  = (1 - (xx + zz)) * sy; local[6]  = (yz + wx) * sy; local[7]  = 0;
      local[8]  = (xz + wy) * sz;       local[9]  = (yz - wx) * sz;       local[10] = (1 - (xx + yy)) * sz; local[11] = 0;
      local[12] = tx;                   local[13] = ty;                   local[14] = tz;            local[15] = 1;

      const pi = this.parentIndices[j];
      const gj = global.subarray(j * 16, j * 16 + 16);
      if (pi < 0) {
        mat4Mul(this.rootTransform, local, gj);
      } else {
        mat4Mul(global.subarray(pi * 16, pi * 16 + 16), local, gj);
      }

      // final = global × invBind
      mat4Mul(gj, this.invBindMats.subarray(j * 16, j * 16 + 16), out.subarray(j * 16, j * 16 + 16));
    }
  }
}

// Column-major matrix multiply: out = a × b
function mat4Mul(a: Float32Array, b: Float32Array, out: Float32Array): void {
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[k * 4 + row] * b[col * 4 + k];
      }
      out[col * 4 + row] = sum;
    }
  }
}
