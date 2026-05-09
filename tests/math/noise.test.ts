import { describe, it, expect } from 'vitest';
import {
  perlinNoise3,
  perlinNoise3Seed,
  perlinRidgeNoise3,
  perlinFbmNoise3,
  perlinTurbulenceNoise3,
  perlinNoise3WrapNonpow2,
} from '../../src/math/noise.js';

const SLOP = 1e-4;

describe('noise', () => {
  describe('perlinNoise3', () => {
    it('should return 0 at integer lattice points', () => {
      for (let i = 0; i < 5; i++) {
        expect(perlinNoise3(i, 0, 0)).toBeCloseTo(0, SLOP);
        expect(perlinNoise3(0, i, 0)).toBeCloseTo(0, SLOP);
        expect(perlinNoise3(0, 0, i)).toBeCloseTo(0, SLOP);
      }
    });

    it('should return values roughly in [-1, 1]', () => {
      let min = Infinity;
      let max = -Infinity;
      for (let x = 0; x < 100; x += 3) {
        for (let y = 0; y < 100; y += 3) {
          for (let z = 0; z < 5; z++) {
            const v = perlinNoise3(x * 0.1, y * 0.1, z * 0.1);
            if (v < min) min = v;
            if (v > max) max = v;
          }
        }
      }
      expect(min).toBeGreaterThanOrEqual(-1.1);
      expect(max).toBeLessThanOrEqual(1.1);
    });

    it('should be deterministic with seed=0', () => {
      const v1 = perlinNoise3(1.5, 2.7, 3.2);
      const v2 = perlinNoise3(1.5, 2.7, 3.2);
      expect(v1).toBe(v2);
    });
  });

  describe('perlinNoise3Seed', () => {
    it('should produce different outputs for different seeds', () => {
      const a = perlinNoise3Seed(1.5, 2.7, 3.2, 0, 0, 0, 1);
      const b = perlinNoise3Seed(1.5, 2.7, 3.2, 0, 0, 0, 2);
      expect(a).not.toBe(b);
    });

    it('should be deterministic for same seed', () => {
      const a = perlinNoise3Seed(1.5, 2.7, 3.2, 0, 0, 0, 42);
      const b = perlinNoise3Seed(1.5, 2.7, 3.2, 0, 0, 0, 42);
      expect(a).toBe(b);
    });

    it('should wrap seed to 8 bits', () => {
      const a = perlinNoise3Seed(1.5, 2.7, 3.2, 0, 0, 0, 256);
      const b = perlinNoise3Seed(1.5, 2.7, 3.2, 0, 0, 0, 0);
      expect(a).toBe(b);
    });
  });

  describe('perlinRidgeNoise3', () => {
    it('should return non-negative values', () => {
      for (let i = 0; i < 50; i++) {
        const v = perlinRidgeNoise3(i * 0.37, i * 0.23, i * 0.17, 2, 0.5, 1, 4);
        expect(v).toBeGreaterThanOrEqual(0);
      }
    });

    it('should be deterministic', () => {
      const a = perlinRidgeNoise3(1.5, 2.7, 3.2, 2, 0.5, 1, 4);
      const b = perlinRidgeNoise3(1.5, 2.7, 3.2, 2, 0.5, 1, 4);
      expect(a).toBeCloseTo(b, 10);
    });
  });

  describe('perlinFbmNoise3', () => {
    it('should return values in a reasonable range', () => {
      let min = Infinity;
      let max = -Infinity;
      for (let i = 0; i < 200; i++) {
        const v = perlinFbmNoise3(i * 0.07, i * 0.13, i * 0.05, 2, 0.5, 4);
        if (v < min) min = v;
        if (v > max) max = v;
      }
      expect(min).toBeGreaterThanOrEqual(-2);
      expect(max).toBeLessThanOrEqual(2);
    });

    it('should be deterministic', () => {
      const a = perlinFbmNoise3(1.5, 2.7, 3.2, 2, 0.5, 4);
      const b = perlinFbmNoise3(1.5, 2.7, 3.2, 2, 0.5, 4);
      expect(a).toBeCloseTo(b, 10);
    });
  });

  describe('perlinTurbulenceNoise3', () => {
    it('should return non-negative values', () => {
      for (let i = 0; i < 50; i++) {
        const v = perlinTurbulenceNoise3(i * 0.31, i * 0.17, i * 0.23, 2, 0.5, 4);
        expect(v).toBeGreaterThanOrEqual(0);
      }
    });

    it('should be deterministic', () => {
      const a = perlinTurbulenceNoise3(1.5, 2.7, 3.2, 2, 0.5, 4);
      const b = perlinTurbulenceNoise3(1.5, 2.7, 3.2, 2, 0.5, 4);
      expect(a).toBeCloseTo(b, 10);
    });
  });

  describe('perlinNoise3WrapNonpow2', () => {
    it('should produce tileable noise with non-power-of-two wrap', () => {
      const period = 10;
      const a = perlinNoise3WrapNonpow2(0, 0, 0, period, period, period, 0);
      const b = perlinNoise3WrapNonpow2(period, 0, 0, period, period, period, 0);
      expect(a).toBeCloseTo(b, 10);
    });

    it('should be deterministic', () => {
      const a = perlinNoise3WrapNonpow2(1.5, 2.7, 3.2, 8, 8, 8, 42);
      const b = perlinNoise3WrapNonpow2(1.5, 2.7, 3.2, 8, 8, 8, 42);
      expect(a).toBeCloseTo(b, 10);
    });
  });
});
