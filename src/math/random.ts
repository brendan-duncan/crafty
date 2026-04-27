// Pseudo-random number generator using the Xorwow algorithm
// (https://en.wikipedia.org/wiki/Xorshift#xorwow)
export class Random extends Uint32Array {
  private _seed: number;

  constructor(seed?: number) {
    super(6);
    this._seed = 0;
    this.seed = seed ?? Date.now();
  }

  static global = new Random();

  get seed(): number { return this[0]; }

  set seed(seed: number) {
    this._seed = seed;
    this[0] = seed;
    this[1] = (this[0] * 1812433253 + 1) >>> 0;
    this[2] = (this[1] * 1812433253 + 1) >>> 0;
    this[3] = (this[2] * 1812433253 + 1) >>> 0;
    this[4] = 0;
    this[5] = 0;
  }

  reset(): void { this.seed = this._seed; }

  // Returns a random integer in [0, 0xFFFFFFFF].
  randomUint32(): number {
    let t = this[3];
    const s = this[0];
    this[3] = this[2];
    this[2] = this[1];
    this[1] = s;
    t ^= t >>> 2;
    t ^= t << 1;
    t ^= s ^ (s << 4);
    this[0] = t;
    this[4] = (this[4] + 362437) >>> 0;
    this[5] = (t + this[4]) >>> 0;
    return this[5];
  }

  // Returns a random float in [0, 1], or [min, max] if provided.
  randomFloat(min?: number, max?: number): number {
    const value = (this.randomUint32() & 0x007FFFFF) * (1.0 / 8388607.0);
    if (min === undefined) return value;
    return value * ((max ?? 1) - min) + min;
  }

  // Returns a random double in [0, 1) with 53-bit resolution, or [min, max] if provided.
  randomDouble(min?: number, max?: number): number {
    const a = this.randomUint32() >>> 5;
    const b = this.randomUint32() >>> 6;
    const value = (a * 67108864 + b) * (1.0 / 9007199254740992.0);
    if (min === undefined) return value;
    return value * ((max ?? 1) - min) + min;
  }
}
