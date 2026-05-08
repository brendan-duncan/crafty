/**
 * 3D vector with mutable x/y/z components and immutable arithmetic methods.
 */
export class Vec3 {
    x;
    y;
    z;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /** Sets x, y, z in place and returns this. */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    /** Returns a copy of this vector. */
    clone() { return new Vec3(this.x, this.y, this.z); }
    /** Returns the componentwise negation. */
    negate() { return new Vec3(-this.x, -this.y, -this.z); }
    /** Returns this + v componentwise. */
    add(v) { return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z); }
    /** Returns this - v componentwise. */
    sub(v) { return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z); }
    /** Returns this scaled by s. */
    scale(s) { return new Vec3(this.x * s, this.y * s, this.z * s); }
    /** Returns the componentwise (Hadamard) product of this and v. */
    mul(v) { return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z); }
    /** Returns the dot product of this and v. */
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
    /** Returns the right-handed cross product this x v. */
    cross(v) {
        return new Vec3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    /** Returns the squared length. */
    lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }
    /** Returns the Euclidean length. */
    length() { return Math.sqrt(this.lengthSq()); }
    /** Returns a unit-length copy, or the zero vector if length is 0. */
    normalize() {
        const len = this.length();
        return len > 0 ? this.scale(1 / len) : new Vec3();
    }
    /** Returns the linear interpolation from this to v at parameter t. */
    lerp(v, t) {
        return new Vec3(this.x + (v.x - this.x) * t, this.y + (v.y - this.y) * t, this.z + (v.z - this.z) * t);
    }
    /** Returns [x, y, z]. */
    toArray() { return [this.x, this.y, this.z]; }
    /** Returns (0, 0, 0). */
    static zero() { return new Vec3(0, 0, 0); }
    /** Returns (1, 1, 1). */
    static one() { return new Vec3(1, 1, 1); }
    /** Returns the world up direction (0, 1, 0). */
    static up() { return new Vec3(0, 1, 0); }
    /** Returns the world forward direction (0, 0, -1) for a right-handed -Z-forward coordinate system. */
    static forward() { return new Vec3(0, 0, -1); }
    /** Returns the world right direction (1, 0, 0). */
    static right() { return new Vec3(1, 0, 0); }
    /** Reads three consecutive components from a numeric array starting at offset. */
    static fromArray(a, offset = 0) {
        return new Vec3(a[offset], a[offset + 1], a[offset + 2]);
    }
}
