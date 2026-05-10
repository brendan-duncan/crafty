/**
 * 3D vector with mutable x/y/z components and immutable arithmetic methods.
 */
export class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x; this.y = y; this.z = z;
  }

  /** Sets x, y, z in place and returns this. */
  set(x: number, y: number, z: number): this {
    this.x = x; this.y = y; this.z = z; return this;
  }

  /** Returns a copy of this vector. */
  clone(): Vec3 { return new Vec3(this.x, this.y, this.z); }
  /** Returns the componentwise negation. */
  negate(): Vec3 { return new Vec3(-this.x, -this.y, -this.z); }

  /** Returns this + v componentwise. */
  add(v: Vec3): Vec3 { return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z); }
  /** Returns this - v componentwise. */
  sub(v: Vec3): Vec3 { return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z); }
  /** Returns this scaled by s. */
  scale(s: number): Vec3 { return new Vec3(this.x * s, this.y * s, this.z * s); }
  /** Returns the componentwise (Hadamard) product of this and v. */
  mul(v: Vec3): Vec3 { return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z); }

  /** Returns the dot product of this and v. */
  dot(v: Vec3): number { return this.x * v.x + this.y * v.y + this.z * v.z; }

  /** Returns the right-handed cross product this x v. */
  cross(v: Vec3): Vec3 {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    );
  }

  /** Returns the squared length. */
  lengthSq(): number { return this.x * this.x + this.y * this.y + this.z * this.z; }
  /** Returns the Euclidean length. */
  length(): number { return Math.sqrt(this.lengthSq()); }

  /** Returns a unit-length copy, or the zero vector if length is 0. */
  normalize(): Vec3 {
    const len = this.length();
    return len > 0 ? this.scale(1 / len) : new Vec3();
  }

  /** Returns the linear interpolation from this to v at parameter t. */
  lerp(v: Vec3, t: number): Vec3 {
    return new Vec3(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t,
      this.z + (v.z - this.z) * t,
    );
  }

  /** Returns [x, y, z]. */
  toArray(): [number, number, number] { return [this.x, this.y, this.z]; }

  /** Returns (0, 0, 0). */
  static zero(): Vec3 { return new Vec3(0, 0, 0); }
  static readonly ZERO = new Vec3(0, 0, 0);

  /** Returns (1, 1, 1). */
  static one(): Vec3 { return new Vec3(1, 1, 1); }
  static readonly ONE = new Vec3(1, 1, 1);

  /** Returns the world up direction (0, 1, 0). */
  static up(): Vec3 { return new Vec3(0, 1, 0); }
  static readonly UP = new Vec3(0, 1, 0);

  /** Returns the world down direction (0, -1, 0). */
  static down(): Vec3 { return new Vec3(0, -1, 0); }
  static readonly DOWN = new Vec3(0, -1, 0);

  /** Returns the world forward direction (0, 0, -1) for a right-handed -Z-forward coordinate system. */
  static forward(): Vec3 { return new Vec3(0, 0, -1); }
  static readonly FORWARD = new Vec3(0, 0, -1);

  /** Returns the world backward direction (0, 0, 1) for a right-handed -Z-forward coordinate system. */
  static backward(): Vec3 { return new Vec3(0, 0, 1); }
  static readonly BACKWARD = new Vec3(0, 0, 1);

  /** Returns the world right direction (1, 0, 0). */
  static right(): Vec3 { return new Vec3(1, 0, 0); }
  static readonly RIGHT = new Vec3(1, 0, 0);

  /** Returns the world left direction (-1, 0, 0). */
  static left(): Vec3 { return new Vec3(-1, 0, 0); }
  static readonly LEFT = new Vec3(-1, 0, 0);

  /** Reads three consecutive components from a numeric array starting at offset. */
  static fromArray(a: ArrayLike<number>, offset = 0): Vec3 {
    return new Vec3(a[offset], a[offset + 1], a[offset + 2]);
  }
}
