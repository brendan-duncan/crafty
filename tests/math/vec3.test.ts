import { describe, it, expect } from 'vitest';
import { Vec3 } from '../../src/math/vec3.js';

describe('Vec3', () => {
  describe('constructor', () => {
    it('should create a vector with default values (0, 0, 0)', () => {
      const v = new Vec3();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it('should create a vector with specified values', () => {
      const v = new Vec3(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });
  });

  describe('set', () => {
    it('should update all components', () => {
      const v = new Vec3();
      v.set(5, 6, 7);
      expect(v.x).toBe(5);
      expect(v.y).toBe(6);
      expect(v.z).toBe(7);
    });
  });

  describe('clone', () => {
    it('should create a new vector with same values', () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = v1.clone();
      expect(v2.x).toBe(1);
      expect(v2.y).toBe(2);
      expect(v2.z).toBe(3);
      expect(v2).not.toBe(v1); // Different objects
    });
  });

  describe('add', () => {
    it('should add two vectors', () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(4, 5, 6);
      const result = v1.add(v2);
      expect(result.x).toBe(5);
      expect(result.y).toBe(7);
      expect(result.z).toBe(9);
    });

    it('should not modify the original vector', () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(4, 5, 6);
      v1.add(v2);
      expect(v1.x).toBe(1);
      expect(v1.y).toBe(2);
      expect(v1.z).toBe(3);
    });
  });

  describe('sub', () => {
    it('should subtract two vectors', () => {
      const v1 = new Vec3(5, 7, 9);
      const v2 = new Vec3(1, 2, 3);
      const result = v1.sub(v2);
      expect(result.x).toBe(4);
      expect(result.y).toBe(5);
      expect(result.z).toBe(6);
    });
  });

  describe('scale', () => {
    it('should scale a vector by a scalar', () => {
      const v = new Vec3(1, 2, 3);
      const result = v.scale(2);
      expect(result.x).toBe(2);
      expect(result.y).toBe(4);
      expect(result.z).toBe(6);
    });
  });

  describe('dot', () => {
    it('should compute dot product', () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(4, 5, 6);
      const result = v1.dot(v2);
      expect(result).toBe(32); // 1*4 + 2*5 + 3*6 = 32
    });

    it('should return 0 for perpendicular vectors', () => {
      const v1 = new Vec3(1, 0, 0);
      const v2 = new Vec3(0, 1, 0);
      expect(v1.dot(v2)).toBe(0);
    });
  });

  describe('cross', () => {
    it('should compute cross product', () => {
      const v1 = new Vec3(1, 0, 0);
      const v2 = new Vec3(0, 1, 0);
      const result = v1.cross(v2);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(1);
    });

    it('should be anti-commutative', () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(4, 5, 6);
      const c1 = v1.cross(v2);
      const c2 = v2.cross(v1);
      expect(c1.x).toBe(-c2.x);
      expect(c1.y).toBe(-c2.y);
      expect(c1.z).toBe(-c2.z);
    });
  });

  describe('length', () => {
    it('should compute vector length', () => {
      const v = new Vec3(3, 4, 0);
      expect(v.length()).toBe(5);
    });

    it('should return 0 for zero vector', () => {
      const v = new Vec3(0, 0, 0);
      expect(v.length()).toBe(0);
    });
  });

  describe('normalize', () => {
    it('should create a unit vector', () => {
      const v = new Vec3(3, 4, 0);
      const result = v.normalize();
      expect(result.length()).toBeCloseTo(1, 5);
    });

    it('should maintain direction', () => {
      const v = new Vec3(2, 2, 2);
      const result = v.normalize();
      const expected = 1 / Math.sqrt(3);
      expect(result.x).toBeCloseTo(expected, 5);
      expect(result.y).toBeCloseTo(expected, 5);
      expect(result.z).toBeCloseTo(expected, 5);
    });
  });

  describe('distance', () => {
    it('should compute distance between two vectors', () => {
      const v1 = new Vec3(0, 0, 0);
      const v2 = new Vec3(3, 4, 0);
      const distance = v1.sub(v2).length();
      expect(distance).toBe(5);
    });
  });

  describe('static methods', () => {
    it('should create zero vector', () => {
      const v = Vec3.zero();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it('should create one vector', () => {
      const v = Vec3.one();
      expect(v.x).toBe(1);
      expect(v.y).toBe(1);
      expect(v.z).toBe(1);
    });
  });
});
