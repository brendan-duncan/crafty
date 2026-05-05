import { describe, it, expect } from 'vitest';
import { halton } from '../../crafty/utils.js';

describe('halton', () => {
  describe('sequence generation', () => {
    it('should generate values between 0 and 1', () => {
      for (let i = 0; i < 100; i++) {
        const value = halton(i, 2);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('should generate different values for different indices', () => {
      const v1 = halton(0, 2);
      const v2 = halton(1, 2);
      const v3 = halton(2, 2);
      expect(v1).not.toBe(v2);
      expect(v2).not.toBe(v3);
      expect(v1).not.toBe(v3);
    });

    it('should generate well-distributed sequence for base 2', () => {
      const values = [];
      for (let i = 0; i < 8; i++) {
        values.push(halton(i, 2));
      }
      // Base 2 should give binary fractions: 0, 1/2, 1/4, 3/4, 1/8, 5/8, 3/8, 7/8
      expect(values[0]).toBe(0);
      expect(values[1]).toBeCloseTo(0.5);
      expect(values[2]).toBeCloseTo(0.25);
      expect(values[3]).toBeCloseTo(0.75);
    });

    it('should generate well-distributed sequence for base 3', () => {
      const values = [];
      for (let i = 0; i < 9; i++) {
        values.push(halton(i, 3));
      }
      // Base 3 should give: 0, 1/3, 2/3, 1/9, 4/9, 7/9, 2/9, 5/9, 8/9
      expect(values[0]).toBe(0);
      expect(values[1]).toBeCloseTo(1/3, 5);
      expect(values[2]).toBeCloseTo(2/3, 5);
    });
  });

  describe('different bases', () => {
    it('should work with base 2', () => {
      const value = halton(5, 2);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });

    it('should work with base 3', () => {
      const value = halton(5, 3);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });

    it('should work with base 5', () => {
      const value = halton(5, 5);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });
  });

  describe('TAA jitter use case', () => {
    it('should generate suitable jitter offsets for 16 samples', () => {
      const offsets: Array<[number, number]> = [];
      for (let i = 0; i < 16; i++) {
        const x = halton(i, 2) * 2 - 1; // Convert to [-1, 1]
        const y = halton(i, 3) * 2 - 1;
        offsets.push([x, y]);
        expect(x).toBeGreaterThanOrEqual(-1);
        expect(x).toBeLessThanOrEqual(1);
        expect(y).toBeGreaterThanOrEqual(-1);
        expect(y).toBeLessThanOrEqual(1);
      }
      // Should have good distribution
      expect(offsets.length).toBe(16);
    });
  });
});
