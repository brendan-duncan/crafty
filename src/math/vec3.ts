export class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x; this.y = y; this.z = z;
  }

  set(x: number, y: number, z: number): this {
    this.x = x; this.y = y; this.z = z; return this;
  }

  clone(): Vec3 { return new Vec3(this.x, this.y, this.z); }
  negate(): Vec3 { return new Vec3(-this.x, -this.y, -this.z); }

  add(v: Vec3): Vec3 { return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z); }
  sub(v: Vec3): Vec3 { return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z); }
  scale(s: number): Vec3 { return new Vec3(this.x * s, this.y * s, this.z * s); }
  mul(v: Vec3): Vec3 { return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z); }

  dot(v: Vec3): number { return this.x * v.x + this.y * v.y + this.z * v.z; }

  cross(v: Vec3): Vec3 {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    );
  }

  lengthSq(): number { return this.x * this.x + this.y * this.y + this.z * this.z; }
  length(): number { return Math.sqrt(this.lengthSq()); }

  normalize(): Vec3 {
    const len = this.length();
    return len > 0 ? this.scale(1 / len) : new Vec3();
  }

  lerp(v: Vec3, t: number): Vec3 {
    return new Vec3(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t,
      this.z + (v.z - this.z) * t,
    );
  }

  toArray(): [number, number, number] { return [this.x, this.y, this.z]; }

  static zero(): Vec3 { return new Vec3(0, 0, 0); }
  static one(): Vec3 { return new Vec3(1, 1, 1); }
  static up(): Vec3 { return new Vec3(0, 1, 0); }
  static forward(): Vec3 { return new Vec3(0, 0, -1); }
  static right(): Vec3 { return new Vec3(1, 0, 0); }

  static fromArray(a: ArrayLike<number>, offset = 0): Vec3 {
    return new Vec3(a[offset], a[offset + 1], a[offset + 2]);
  }
}
