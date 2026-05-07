import { Vec3 } from './vec3.js';
import { Vec4 } from './vec4.js';

/**
 * Column-major 4x4 matrix compatible with WebGPU/WGSL.
 *
 * Internal storage is a Float32Array of 16 elements where the element at column `c`,
 * row `r` lives at `data[c * 4 + r]`. All instance methods are non-mutating (they
 * return a new Mat4); the underlying `data` buffer is exposed as readonly.
 */
export class Mat4 {
  readonly data: Float32Array;

  constructor(data?: ArrayLike<number>) {
    this.data = new Float32Array(16);
    if (data) {
      this.data.set(data);
    }
  }

  /** Returns a deep copy of this matrix. */
  clone(): Mat4 { return new Mat4(this.data); }

  /** Returns the element at the given column and row. */
  get(col: number, row: number): number { return this.data[col * 4 + row]; }
  /** Writes a value at the given column and row. */
  set(col: number, row: number, v: number): void { this.data[col * 4 + row] = v; }

  /** Returns the matrix product this * b (column-major composition: b applied first). */
  multiply(b: Mat4): Mat4 {
    const a = this.data, bd = b.data;
    const out = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        out[c * 4 + r] =
          a[0 * 4 + r] * bd[c * 4 + 0] +
          a[1 * 4 + r] * bd[c * 4 + 1] +
          a[2 * 4 + r] * bd[c * 4 + 2] +
          a[3 * 4 + r] * bd[c * 4 + 3];
      }
    }
    return new Mat4(out);
  }

  /** Transforms a 3D point (w = 1), applying the full affine transform and performing perspective divide. */
  transformPoint(v: Vec3): Vec3 {
    const d = this.data;
    const x = d[0]*v.x + d[4]*v.y + d[8]*v.z + d[12];
    const y = d[1]*v.x + d[5]*v.y + d[9]*v.z + d[13];
    const z = d[2]*v.x + d[6]*v.y + d[10]*v.z + d[14];
    const w = d[3]*v.x + d[7]*v.y + d[11]*v.z + d[15];
    return new Vec3(x / w, y / w, z / w);
  }

  /** Transforms a 3D direction (w = 0), ignoring the translation column. */
  transformDirection(v: Vec3): Vec3 {
    const d = this.data;
    return new Vec3(
      d[0]*v.x + d[4]*v.y + d[8]*v.z,
      d[1]*v.x + d[5]*v.y + d[9]*v.z,
      d[2]*v.x + d[6]*v.y + d[10]*v.z,
    );
  }

  /** Transforms a homogeneous 4D vector. */
  transformVec4(v: Vec4): Vec4 {
    const d = this.data;
    return new Vec4(
      d[0]*v.x + d[4]*v.y + d[8]*v.z  + d[12]*v.w,
      d[1]*v.x + d[5]*v.y + d[9]*v.z  + d[13]*v.w,
      d[2]*v.x + d[6]*v.y + d[10]*v.z + d[14]*v.w,
      d[3]*v.x + d[7]*v.y + d[11]*v.z + d[15]*v.w,
    );
  }

  /** Returns the transpose. */
  transpose(): Mat4 {
    const d = this.data;
    return new Mat4([
      d[0], d[4], d[8],  d[12],
      d[1], d[5], d[9],  d[13],
      d[2], d[6], d[10], d[14],
      d[3], d[7], d[11], d[15],
    ]);
  }

  /** Returns the inverse, or the identity matrix if this matrix is singular. */
  invert(): Mat4 {
    const m = this.data;
    const out = new Float32Array(16);

    const a00=m[0], a01=m[1], a02=m[2], a03=m[3];
    const a10=m[4], a11=m[5], a12=m[6], a13=m[7];
    const a20=m[8], a21=m[9], a22=m[10],a23=m[11];
    const a30=m[12],a31=m[13],a32=m[14],a33=m[15];

    const b00=a00*a11-a01*a10, b01=a00*a12-a02*a10;
    const b02=a00*a13-a03*a10, b03=a01*a12-a02*a11;
    const b04=a01*a13-a03*a11, b05=a02*a13-a03*a12;
    const b06=a20*a31-a21*a30, b07=a20*a32-a22*a30;
    const b08=a20*a33-a23*a30, b09=a21*a32-a22*a31;
    const b10=a21*a33-a23*a31, b11=a22*a33-a23*a32;

    let det = b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06;
    if (det === 0) {
      return Mat4.identity();
    }
    det = 1 / det;

    out[0]  = (a11*b11-a12*b10+a13*b09)*det;
    out[1]  = (a02*b10-a01*b11-a03*b09)*det;
    out[2]  = (a31*b05-a32*b04+a33*b03)*det;
    out[3]  = (a22*b04-a21*b05-a23*b03)*det;
    out[4]  = (a12*b08-a10*b11-a13*b07)*det;
    out[5]  = (a00*b11-a02*b08+a03*b07)*det;
    out[6]  = (a32*b02-a30*b05-a33*b01)*det;
    out[7]  = (a20*b05-a22*b02+a23*b01)*det;
    out[8]  = (a10*b10-a11*b08+a13*b06)*det;
    out[9]  = (a01*b08-a00*b10-a03*b06)*det;
    out[10] = (a30*b04-a31*b02+a33*b00)*det;
    out[11] = (a21*b02-a20*b04-a23*b00)*det;
    out[12] = (a11*b07-a10*b09-a12*b06)*det;
    out[13] = (a00*b09-a01*b07+a02*b06)*det;
    out[14] = (a31*b01-a30*b03-a32*b00)*det;
    out[15] = (a20*b03-a21*b01+a22*b00)*det;

    return new Mat4(out);
  }

  /**
   * Returns the inverse-transpose of the upper-left 3x3, embedded in a 4x4 matrix.
   *
   * Use this to transform normals when the model matrix contains non-uniform scale.
   */
  normalMatrix(): Mat4 {
    const m = this.data;
    const a00=m[0], a01=m[1], a02=m[2];
    const a10=m[4], a11=m[5], a12=m[6];
    const a20=m[8], a21=m[9], a22=m[10];

    const b01= a22*a11-a12*a21;
    const b11=-a22*a10+a12*a20;
    const b21= a21*a10-a11*a20;

    let det = a00*b01 + a01*b11 + a02*b21;
    if (det === 0) {
      return Mat4.identity();
    }
    det = 1 / det;

    const out = new Float32Array(16);
    // Store M^{-T} (inverse-transpose), not M^{-1}: off-diagonal indices are transposed
    out[0]  = b01*det;  out[4]  = (-a22*a01+a02*a21)*det; out[8]  = (a12*a01-a02*a11)*det;
    out[1]  = b11*det;  out[5]  = (a22*a00-a02*a20)*det;  out[9]  = (-a12*a00+a02*a10)*det;
    out[2]  = b21*det;  out[6]  = (-a21*a00+a01*a20)*det; out[10] = (a11*a00-a01*a10)*det;
    out[15] = 1;
    return new Mat4(out);
  }

  /** Returns the 4x4 identity matrix. */
  static identity(): Mat4 {
    return new Mat4([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  }

  /** Returns a translation matrix by (x, y, z). */
  static translation(x: number, y: number, z: number): Mat4 {
    return new Mat4([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]);
  }

  /** Returns a non-uniform scale matrix with the given per-axis factors. */
  static scale(x: number, y: number, z: number): Mat4 {
    return new Mat4([x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1]);
  }

  /** Returns a rotation matrix of `rad` radians around the X axis. */
  static rotationX(rad: number): Mat4 {
    const c = Math.cos(rad), s = Math.sin(rad);
    return new Mat4([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]);
  }

  /** Returns a rotation matrix of `rad` radians around the Y axis. */
  static rotationY(rad: number): Mat4 {
    const c = Math.cos(rad), s = Math.sin(rad);
    return new Mat4([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]);
  }

  /** Returns a rotation matrix of `rad` radians around the Z axis. */
  static rotationZ(rad: number): Mat4 {
    const c = Math.cos(rad), s = Math.sin(rad);
    return new Mat4([c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]);
  }

  /** Builds a rotation matrix from quaternion components (qx, qy, qz, qw). */
  static fromQuaternion(qx: number, qy: number, qz: number, qw: number): Mat4 {
    const x2=qx+qx, y2=qy+qy, z2=qz+qz;
    const xx=qx*x2, yx=qy*x2, yy=qy*y2;
    const zx=qz*x2, zy=qz*y2, zz=qz*z2;
    const wx=qw*x2, wy=qw*y2, wz=qw*z2;
    return new Mat4([
      1-yy-zz, yx+wz,   zx-wy,   0,
      yx-wz,   1-xx-zz, zy+wx,   0,
      zx+wy,   zy-wx,   1-xx-yy, 0,
      0,       0,       0,       1,
    ]);
  }

  /**
   * Builds a right-handed perspective projection with the WebGPU clip-space depth range [0, 1].
   *
   * @param fovY - vertical field of view in radians
   * @param aspect - viewport width / height
   * @param near - near plane distance (positive)
   * @param far - far plane distance (positive)
   */
  static perspective(fovY: number, aspect: number, near: number, far: number): Mat4 {
    const f = 1 / Math.tan(fovY / 2);
    const nf = 1 / (near - far);
    return new Mat4([
      f/aspect, 0, 0,             0,
      0,        f, 0,             0,
      0,        0, far*nf,       -1,
      0,        0, far*near*nf,   0,
    ]);
  }

  /**
   * Builds an orthographic projection with the WebGPU clip-space depth range [0, 1].
   */
  static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    return new Mat4([
      -2*lr,        0,            0,          0,
       0,          -2*bt,         0,          0,
       0,           0,            nf,         0,
      (left+right)*lr, (top+bottom)*bt, near*nf, 1,
    ]);
  }

  /**
   * Builds a right-handed view matrix that places the camera at `eye` looking at `target`,
   * with `up` defining the camera's roll. View space uses -Z as forward.
   */
  static lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
    const f = target.sub(eye).normalize();
    const r = f.cross(up).normalize();
    const u = r.cross(f);
    return new Mat4([
       r.x,  u.x,  -f.x, 0,
       r.y,  u.y,  -f.y, 0,
       r.z,  u.z,  -f.z, 0,
      -r.dot(eye), -u.dot(eye), f.dot(eye), 1,
    ]);
  }

  /**
   * Builds a Translate * Rotate * Scale matrix.
   *
   * @param t - translation
   * @param qx - quaternion x component
   * @param qy - quaternion y component
   * @param qz - quaternion z component
   * @param qw - quaternion w (scalar) component
   * @param s - per-axis scale factors
   */
  static trs(t: Vec3, qx: number, qy: number, qz: number, qw: number, s: Vec3): Mat4 {
    const r = Mat4.fromQuaternion(qx, qy, qz, qw);
    const d = r.data;
    return new Mat4([
      s.x*d[0], s.x*d[1], s.x*d[2], 0,
      s.y*d[4], s.y*d[5], s.y*d[6], 0,
      s.z*d[8], s.z*d[9], s.z*d[10],0,
      t.x,      t.y,      t.z,       1,
    ]);
  }
}
