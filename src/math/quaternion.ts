import { Vec3 } from './vec3.js';
import { Mat4 } from './mat4.js';

export class Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x; this.y = y; this.z = z; this.w = w;
  }

  clone(): Quaternion { return new Quaternion(this.x, this.y, this.z, this.w); }

  lengthSq(): number { return this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w; }
  length(): number { return Math.sqrt(this.lengthSq()); }

  normalize(): Quaternion {
    const len = this.length();
    return len > 0
      ? new Quaternion(this.x/len, this.y/len, this.z/len, this.w/len)
      : Quaternion.identity();
  }

  conjugate(): Quaternion { return new Quaternion(-this.x, -this.y, -this.z, this.w); }

  multiply(b: Quaternion): Quaternion {
    const ax=this.x, ay=this.y, az=this.z, aw=this.w;
    const bx=b.x,   by=b.y,   bz=b.z,   bw=b.w;
    return new Quaternion(
      aw*bx + ax*bw + ay*bz - az*by,
      aw*by - ax*bz + ay*bw + az*bx,
      aw*bz + ax*by - ay*bx + az*bw,
      aw*bw - ax*bx - ay*by - az*bz,
    );
  }

  rotateVec3(v: Vec3): Vec3 {
    const qx=this.x, qy=this.y, qz=this.z, qw=this.w;
    const ix= qw*v.x + qy*v.z - qz*v.y;
    const iy= qw*v.y + qz*v.x - qx*v.z;
    const iz= qw*v.z + qx*v.y - qy*v.x;
    const iw=-qx*v.x - qy*v.y - qz*v.z;
    return new Vec3(
      ix*qw + iw*-qx + iy*-qz - iz*-qy,
      iy*qw + iw*-qy + iz*-qx - ix*-qz,
      iz*qw + iw*-qz + ix*-qy - iy*-qx,
    );
  }

  toMat4(): Mat4 {
    return Mat4.fromQuaternion(this.x, this.y, this.z, this.w);
  }

  slerp(b: Quaternion, t: number): Quaternion {
    let cosHalfTheta = this.x*b.x + this.y*b.y + this.z*b.z + this.w*b.w;
    let bx=b.x, by=b.y, bz=b.z, bw=b.w;
    if (cosHalfTheta < 0) {
      cosHalfTheta = -cosHalfTheta;
      bx=-bx; by=-by; bz=-bz; bw=-bw;
    }
    if (cosHalfTheta >= 1) return this.clone();
    const halfTheta = Math.acos(cosHalfTheta);
    const sinHalfTheta = Math.sqrt(1 - cosHalfTheta*cosHalfTheta);
    if (Math.abs(sinHalfTheta) < 0.001) {
      return new Quaternion(
        this.x*0.5+bx*0.5, this.y*0.5+by*0.5,
        this.z*0.5+bz*0.5, this.w*0.5+bw*0.5,
      );
    }
    const ra = Math.sin((1-t)*halfTheta)/sinHalfTheta;
    const rb = Math.sin(t*halfTheta)/sinHalfTheta;
    return new Quaternion(
      this.x*ra+bx*rb, this.y*ra+by*rb,
      this.z*ra+bz*rb, this.w*ra+bw*rb,
    );
  }

  static identity(): Quaternion { return new Quaternion(0, 0, 0, 1); }

  static fromAxisAngle(axis: Vec3, rad: number): Quaternion {
    const s = Math.sin(rad / 2);
    const n = axis.normalize();
    return new Quaternion(n.x*s, n.y*s, n.z*s, Math.cos(rad/2));
  }

  static fromEuler(x: number, y: number, z: number): Quaternion {
    const cx=Math.cos(x/2), sx=Math.sin(x/2);
    const cy=Math.cos(y/2), sy=Math.sin(y/2);
    const cz=Math.cos(z/2), sz=Math.sin(z/2);
    return new Quaternion(
      sx*cy*cz + cx*sy*sz,
      cx*sy*cz - sx*cy*sz,
      cx*cy*sz + sx*sy*cz,
      cx*cy*cz - sx*sy*sz,
    );
  }
}
