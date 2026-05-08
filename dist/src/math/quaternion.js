import { Vec3 } from './vec3.js';
import { Mat4 } from './mat4.js';
/**
 * Unit quaternion representing a 3D rotation, stored as (x, y, z, w) with w as the scalar part.
 */
export class Quaternion {
    x;
    y;
    z;
    w;
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /** Returns a copy of this quaternion. */
    clone() { return new Quaternion(this.x, this.y, this.z, this.w); }
    /** Returns the squared length. */
    lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w; }
    /** Returns the Euclidean length. */
    length() { return Math.sqrt(this.lengthSq()); }
    /** Returns a unit-length copy, or the identity quaternion if length is 0. */
    normalize() {
        const len = this.length();
        return len > 0
            ? new Quaternion(this.x / len, this.y / len, this.z / len, this.w / len)
            : Quaternion.identity();
    }
    /** Returns the conjugate (-x, -y, -z, w), which is the inverse for unit quaternions. */
    conjugate() { return new Quaternion(-this.x, -this.y, -this.z, this.w); }
    /** Returns the Hamilton product this * b, which composes rotations (this applied after b). */
    multiply(b) {
        const ax = this.x, ay = this.y, az = this.z, aw = this.w;
        const bx = b.x, by = b.y, bz = b.z, bw = b.w;
        return new Quaternion(aw * bx + ax * bw + ay * bz - az * by, aw * by - ax * bz + ay * bw + az * bx, aw * bz + ax * by - ay * bx + az * bw, aw * bw - ax * bx - ay * by - az * bz);
    }
    /** Rotates vector v by this quaternion and returns the result. */
    rotateVec3(v) {
        const qx = this.x, qy = this.y, qz = this.z, qw = this.w;
        const ix = qw * v.x + qy * v.z - qz * v.y;
        const iy = qw * v.y + qz * v.x - qx * v.z;
        const iz = qw * v.z + qx * v.y - qy * v.x;
        const iw = -qx * v.x - qy * v.y - qz * v.z;
        return new Vec3(ix * qw + iw * -qx + iy * -qz - iz * -qy, iy * qw + iw * -qy + iz * -qx - ix * -qz, iz * qw + iw * -qz + ix * -qy - iy * -qx);
    }
    /** Converts this quaternion to its equivalent column-major 4x4 rotation matrix. */
    toMat4() {
        return Mat4.fromQuaternion(this.x, this.y, this.z, this.w);
    }
    /**
     * Spherical linear interpolation from this to b at parameter t in [0, 1].
     *
     * Picks the shorter arc (negates b if the dot product is negative) and falls back to
     * normalized linear interpolation when the angle between the quaternions is tiny.
     */
    slerp(b, t) {
        let cosHalfTheta = this.x * b.x + this.y * b.y + this.z * b.z + this.w * b.w;
        let bx = b.x, by = b.y, bz = b.z, bw = b.w;
        if (cosHalfTheta < 0) {
            cosHalfTheta = -cosHalfTheta;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }
        if (cosHalfTheta >= 1) {
            return this.clone();
        }
        const halfTheta = Math.acos(cosHalfTheta);
        const sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
        if (Math.abs(sinHalfTheta) < 0.001) {
            return new Quaternion(this.x * 0.5 + bx * 0.5, this.y * 0.5 + by * 0.5, this.z * 0.5 + bz * 0.5, this.w * 0.5 + bw * 0.5);
        }
        const ra = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
        const rb = Math.sin(t * halfTheta) / sinHalfTheta;
        return new Quaternion(this.x * ra + bx * rb, this.y * ra + by * rb, this.z * ra + bz * rb, this.w * ra + bw * rb);
    }
    /** Returns the identity quaternion (0, 0, 0, 1). */
    static identity() { return new Quaternion(0, 0, 0, 1); }
    /** Builds a quaternion representing a rotation of `rad` radians around `axis` (axis is normalized internally). */
    static fromAxisAngle(axis, rad) {
        const s = Math.sin(rad / 2);
        const n = axis.normalize();
        return new Quaternion(n.x * s, n.y * s, n.z * s, Math.cos(rad / 2));
    }
    /**
     * Builds a quaternion from intrinsic Euler angles (radians) applied in XYZ order.
     *
     * @param x - rotation around the X axis (pitch)
     * @param y - rotation around the Y axis (yaw)
     * @param z - rotation around the Z axis (roll)
     */
    static fromEuler(x, y, z) {
        const cx = Math.cos(x / 2), sx = Math.sin(x / 2);
        const cy = Math.cos(y / 2), sy = Math.sin(y / 2);
        const cz = Math.cos(z / 2), sz = Math.sin(z / 2);
        return new Quaternion(sx * cy * cz + cx * sy * sz, cx * sy * cz - sx * cy * sz, cx * cy * sz + sx * sy * cz, cx * cy * cz - sx * sy * sz);
    }
}
