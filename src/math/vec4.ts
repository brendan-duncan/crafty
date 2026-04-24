export class Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x; this.y = y; this.z = z; this.w = w;
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x; this.y = y; this.z = z; this.w = w; return this;
  }

  clone(): Vec4 { return new Vec4(this.x, this.y, this.z, this.w); }

  add(v: Vec4): Vec4 { return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w); }
  sub(v: Vec4): Vec4 { return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w); }
  scale(s: number): Vec4 { return new Vec4(this.x * s, this.y * s, this.z * s, this.w * s); }
  dot(v: Vec4): number { return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w; }
  lengthSq(): number { return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w; }
  length(): number { return Math.sqrt(this.lengthSq()); }

  toArray(): [number, number, number, number] { return [this.x, this.y, this.z, this.w]; }

  static zero(): Vec4 { return new Vec4(0, 0, 0, 0); }
  static one(): Vec4 { return new Vec4(1, 1, 1, 1); }

  static fromArray(a: ArrayLike<number>, offset = 0): Vec4 {
    return new Vec4(a[offset], a[offset + 1], a[offset + 2], a[offset + 3]);
  }
}
