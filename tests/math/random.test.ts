import { describe, it, expect } from 'vitest';
import { Random } from '../../src/math/random.js';

describe('Random', () => {
  describe('seed', () => {
    it('should produce deterministic sequence for same seed', () => {
      const a = new Random(42);
      const b = new Random(42);
      for (let i = 0; i < 100; i++) {
        expect(a.randomUint32()).toBe(b.randomUint32());
      }
    });

    it('should produce different sequences for different seeds', () => {
      const a = new Random(42);
      const b = new Random(99);
      const va = a.randomUint32();
      const vb = b.randomUint32();
      expect(va).not.toBe(vb);
    });
  });

  describe('reset', () => {
    it('should replay the same sequence from the start', () => {
      const rng = new Random(7);
      const first = rng.randomUint32();
      rng.randomUint32();
      rng.randomUint32();
      rng.reset();
      expect(rng.randomUint32()).toBe(first);
    });
  });

  describe('randomUint32', () => {
    it('should return values in [0, 0xFFFFFFFF]', () => {
      const rng = new Random(1);
      for (let i = 0; i < 1000; i++) {
        const v = rng.randomUint32();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(0xFFFFFFFF);
      }
    });

    it('should cover a reasonable range', () => {
      const rng = new Random(1);
      let min = 0xFFFFFFFF;
      let max = 0;
      for (let i = 0; i < 10000; i++) {
        const v = rng.randomUint32();
        if (v < min) min = v;
        if (v > max) max = v;
      }
      expect(min).toBeLessThan(0x10000000);
      expect(max).toBeGreaterThan(0xEFFFFFFF);
    });
  });

  describe('randomFloat', () => {
    it('should return values in [0, 1] by default', () => {
      const rng = new Random(42);
      for (let i = 0; i < 1000; i++) {
        const v = rng.randomFloat();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    });

    it('should return values in [min, max] when both provided', () => {
      const rng = new Random(42);
      for (let i = 0; i < 1000; i++) {
        const v = rng.randomFloat(-5, 10);
        expect(v).toBeGreaterThanOrEqual(-5);
        expect(v).toBeLessThanOrEqual(10);
      }
    });

    it('should be deterministic', () => {
      const values: number[] = [];
      const rng = new Random(99);
      for (let i = 0; i < 10; i++) {
        values.push(rng.randomFloat());
      }
      const rng2 = new Random(99);
      for (let i = 0; i < 10; i++) {
        expect(rng2.randomFloat()).toBe(values[i]);
      }
    });
  });

  describe('randomDouble', () => {
    it('should return values in [0, 1) by default', () => {
      const rng = new Random(42);
      for (let i = 0; i < 1000; i++) {
        const v = rng.randomDouble();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      }
    });

    it('should return values in [min, max] when both provided', () => {
      const rng = new Random(42);
      for (let i = 0; i < 1000; i++) {
        const v = rng.randomDouble(2, 5);
        expect(v).toBeGreaterThanOrEqual(2);
        expect(v).toBeLessThanOrEqual(5);
      }
    });

    it('should be deterministic', () => {
      const values: number[] = [];
      const rng = new Random(77);
      for (let i = 0; i < 10; i++) {
        values.push(rng.randomDouble());
      }
      const rng2 = new Random(77);
      for (let i = 0; i < 10; i++) {
        expect(rng2.randomDouble()).toBe(values[i]);
      }
    });
  });
});
