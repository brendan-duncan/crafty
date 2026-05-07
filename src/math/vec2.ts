/**
 * 2D vector with mutable x/y components and immutable arithmetic methods.
 */
export class Vec2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /** Sets x and y in place and returns this. */
  set(x: number, y: number): this {
    this.x = x; this.y = y; return this;
  }

  /** Returns a copy of this vector. */
  clone(): Vec2 { return new Vec2(this.x, this.y); }

  /** Returns this + v componentwise. */
  add(v: Vec2): Vec2 { return new Vec2(this.x + v.x, this.y + v.y); }
  /** Returns this - v componentwise. */
  sub(v: Vec2): Vec2 { return new Vec2(this.x - v.x, this.y - v.y); }
  /** Returns this scaled by s. */
  scale(s: number): Vec2 { return new Vec2(this.x * s, this.y * s); }
  /** Returns the dot product of this and v. */
  dot(v: Vec2): number { return this.x * v.x + this.y * v.y; }
  /** Returns the squared length. */
  lengthSq(): number { return this.x * this.x + this.y * this.y; }
  /** Returns the Euclidean length. */
  length(): number { return Math.sqrt(this.lengthSq()); }

  /** Returns a unit-length copy, or the zero vector if length is 0. */
  normalize(): Vec2 {
    const len = this.length();
    return len > 0 ? this.scale(1 / len) : new Vec2();
  }

  /** Returns [x, y]. */
  toArray(): [number, number] { return [this.x, this.y]; }

  /** Returns (0, 0). */
  static zero(): Vec2 { return new Vec2(0, 0); }
  /** Returns (1, 1). */
  static one(): Vec2 { return new Vec2(1, 1); }
}
