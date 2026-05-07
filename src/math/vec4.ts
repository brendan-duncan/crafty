/**
 * 4D vector with mutable x/y/z/w components and immutable arithmetic methods.
 */
export class Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x; this.y = y; this.z = z; this.w = w;
  }

  /** Sets x, y, z, w in place and returns this. */
  set(x: number, y: number, z: number, w: number): this {
    this.x = x; this.y = y; this.z = z; this.w = w; return this;
  }

  /** Returns a copy of this vector. */
  clone(): Vec4 { return new Vec4(this.x, this.y, this.z, this.w); }

  /** Returns this + v componentwise. */
  add(v: Vec4): Vec4 { return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w); }
  /** Returns this - v componentwise. */
  sub(v: Vec4): Vec4 { return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w); }
  /** Returns this scaled by s. */
  scale(s: number): Vec4 { return new Vec4(this.x * s, this.y * s, this.z * s, this.w * s); }
  /** Returns the 4D dot product of this and v. */
  dot(v: Vec4): number { return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w; }
  /** Returns the squared length. */
  lengthSq(): number { return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w; }
  /** Returns the Euclidean length. */
  length(): number { return Math.sqrt(this.lengthSq()); }

  /** Returns [x, y, z, w]. */
  toArray(): [number, number, number, number] { return [this.x, this.y, this.z, this.w]; }

  /** Returns (0, 0, 0, 0). */
  static zero(): Vec4 { return new Vec4(0, 0, 0, 0); }
  /** Returns (1, 1, 1, 1). */
  static one(): Vec4 { return new Vec4(1, 1, 1, 1); }

  /** Reads four consecutive components from a numeric array starting at offset. */
  static fromArray(a: ArrayLike<number>, offset = 0): Vec4 {
    return new Vec4(a[offset], a[offset + 1], a[offset + 2], a[offset + 3]);
  }
}
