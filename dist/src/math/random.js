/**
 * Seeded pseudo-random number generator using the Xorwow variant of Marsaglia's xorshift family.
 *
 * Backed by a Uint32Array of 6 state words (4 xorshift lanes + a Weyl counter + last output),
 * so the instance is itself the state buffer.
 *
 * @see https://en.wikipedia.org/wiki/Xorshift#xorwow
 */
export class Random extends Uint32Array {
    _seed;
    constructor(seed) {
        super(6);
        this._seed = 0;
        this.seed = seed ?? Date.now();
    }
    /** Process-wide shared instance, seeded from `Date.now()` at module load. */
    static global = new Random();
    /** Returns the current head state word (does not return the originally-supplied seed). */
    get seed() { return this[0]; }
    /** Re-seeds the generator and resets all internal state from `seed`. */
    set seed(seed) {
        this._seed = seed;
        this[0] = seed;
        this[1] = (this[0] * 1812433253 + 1) >>> 0;
        this[2] = (this[1] * 1812433253 + 1) >>> 0;
        this[3] = (this[2] * 1812433253 + 1) >>> 0;
        this[4] = 0;
        this[5] = 0;
    }
    /** Restores the generator to the state right after construction (replays the same sequence). */
    reset() { this.seed = this._seed; }
    /** Returns a uniform random integer in [0, 0xFFFFFFFF]. */
    randomUint32() {
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
    /**
     * Returns a single-precision float in [0, 1], or in [min, max] when `min` is provided.
     *
     * @param min - lower bound (inclusive)
     * @param max - upper bound (inclusive); defaults to 1 when `min` is provided
     */
    randomFloat(min, max) {
        const value = (this.randomUint32() & 0x007FFFFF) * (1.0 / 8388607.0);
        if (min === undefined) {
            return value;
        }
        return value * ((max ?? 1) - min) + min;
    }
    /**
     * Returns a double in [0, 1) with full 53-bit mantissa resolution, or in [min, max] when
     * `min` is provided.
     *
     * @param min - lower bound (inclusive)
     * @param max - upper bound (inclusive); defaults to 1 when `min` is provided
     */
    randomDouble(min, max) {
        const a = this.randomUint32() >>> 5;
        const b = this.randomUint32() >>> 6;
        const value = (a * 67108864 + b) * (1.0 / 9007199254740992.0);
        if (min === undefined) {
            return value;
        }
        return value * ((max ?? 1) - min) + min;
    }
}
