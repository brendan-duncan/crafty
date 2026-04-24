export class Vec2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number): this {
    this.x = x; this.y = y; return this;
  }

  clone(): Vec2 { return new Vec2(this.x, this.y); }

  add(v: Vec2): Vec2 { return new Vec2(this.x + v.x, this.y + v.y); }
  sub(v: Vec2): Vec2 { return new Vec2(this.x - v.x, this.y - v.y); }
  scale(s: number): Vec2 { return new Vec2(this.x * s, this.y * s); }
  dot(v: Vec2): number { return this.x * v.x + this.y * v.y; }
  lengthSq(): number { return this.x * this.x + this.y * this.y; }
  length(): number { return Math.sqrt(this.lengthSq()); }

  normalize(): Vec2 {
    const len = this.length();
    return len > 0 ? this.scale(1 / len) : new Vec2();
  }

  toArray(): [number, number] { return [this.x, this.y]; }

  static zero(): Vec2 { return new Vec2(0, 0); }
  static one(): Vec2 { return new Vec2(1, 1); }
}
