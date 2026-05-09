import { describe, it, expect } from 'vitest';
import { Vec2 } from '../../src/math/vec2.js';

describe('Vec2', () => {
  describe('constructor', () => {
    it('should default to (0, 0)', () => {
      const v = new Vec2();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });

    it('should store given values', () => {
      const v = new Vec2(3, 7);
      expect(v.x).toBe(3);
      expect(v.y).toBe(7);
    });
  });

  describe('set', () => {
    it('should mutate in place and return this', () => {
      const v = new Vec2();
      const ret = v.set(4, 5);
      expect(v.x).toBe(4);
      expect(v.y).toBe(5);
      expect(ret).toBe(v);
    });
  });

  describe('clone', () => {
    it('should return a separate copy', () => {
      const v1 = new Vec2(1, 2);
      const v2 = v1.clone();
      expect(v2.x).toBe(1);
      expect(v2.y).toBe(2);
      expect(v2).not.toBe(v1);
    });
  });

  describe('add', () => {
    it('should add componentwise', () => {
      const r = new Vec2(1, 2).add(new Vec2(3, 4));
      expect(r.x).toBe(4);
      expect(r.y).toBe(6);
    });

    it('should not mutate the original', () => {
      const a = new Vec2(1, 2);
      a.add(new Vec2(3, 4));
      expect(a.x).toBe(1);
    });
  });

  describe('sub', () => {
    it('should subtract componentwise', () => {
      const r = new Vec2(5, 8).sub(new Vec2(1, 3));
      expect(r.x).toBe(4);
      expect(r.y).toBe(5);
    });
  });

  describe('scale', () => {
    it('should multiply both components', () => {
      const r = new Vec2(2, 3).scale(4);
      expect(r.x).toBe(8);
      expect(r.y).toBe(12);
    });
  });

  describe('dot', () => {
    it('should compute dot product', () => {
      const d = new Vec2(1, 2).dot(new Vec2(3, 4));
      expect(d).toBe(11);
    });

    it('should return 0 for perpendicular vectors', () => {
      expect(new Vec2(1, 0).dot(new Vec2(0, 1))).toBe(0);
    });
  });

  describe('length', () => {
    it('should compute Euclidean length', () => {
      expect(new Vec2(3, 4).length()).toBe(5);
    });

    it('should return 0 for zero vector', () => {
      expect(new Vec2().length()).toBe(0);
    });
  });

  describe('lengthSq', () => {
    it('should compute squared length', () => {
      expect(new Vec2(3, 4).lengthSq()).toBe(25);
    });
  });

  describe('normalize', () => {
    it('should return a unit-length vector', () => {
      const r = new Vec2(3, 4).normalize();
      expect(r.length()).toBeCloseTo(1, 6);
    });

    it('should preserve direction', () => {
      const r = new Vec2(4, 0).normalize();
      expect(r.x).toBeCloseTo(1);
      expect(r.y).toBeCloseTo(0);
    });

    it('should return the zero vector when length is 0', () => {
      const r = new Vec2().normalize();
      expect(r.x).toBe(0);
      expect(r.y).toBe(0);
    });
  });

  describe('toArray', () => {
    it('should return [x, y]', () => {
      expect(new Vec2(7, 8).toArray()).toEqual([7, 8]);
    });
  });

  describe('static methods', () => {
    it('zero() returns (0, 0)', () => {
      const z = Vec2.zero();
      expect(z.x).toBe(0);
      expect(z.y).toBe(0);
    });

    it('one() returns (1, 1)', () => {
      const o = Vec2.one();
      expect(o.x).toBe(1);
      expect(o.y).toBe(1);
    });
  });
});
