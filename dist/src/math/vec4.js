/**
 * 4D vector with mutable x/y/z/w components and immutable arithmetic methods.
 */
export class Vec4 {
    x;
    y;
    z;
    w;
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /** Sets x, y, z, w in place and returns this. */
    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    /** Returns a copy of this vector. */
    clone() { return new Vec4(this.x, this.y, this.z, this.w); }
    /** Returns this + v componentwise. */
    add(v) { return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w); }
    /** Returns this - v componentwise. */
    sub(v) { return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w); }
    /** Returns this scaled by s. */
    scale(s) { return new Vec4(this.x * s, this.y * s, this.z * s, this.w * s); }
    /** Returns the 4D dot product of this and v. */
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w; }
    /** Returns the squared length. */
    lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w; }
    /** Returns the Euclidean length. */
    length() { return Math.sqrt(this.lengthSq()); }
    /** Returns [x, y, z, w]. */
    toArray() { return [this.x, this.y, this.z, this.w]; }
    /** Returns (0, 0, 0, 0). */
    static zero() { return new Vec4(0, 0, 0, 0); }
    /** Returns (1, 1, 1, 1). */
    static one() { return new Vec4(1, 1, 1, 1); }
    /** Reads four consecutive components from a numeric array starting at offset. */
    static fromArray(a, offset = 0) {
        return new Vec4(a[offset], a[offset + 1], a[offset + 2], a[offset + 3]);
    }
}
