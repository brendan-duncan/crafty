import { describe, it, expect } from 'vitest';
import { Quaternion } from '../../src/math/quaternion.js';
import { Vec3 } from '../../src/math/vec3.js';
import { Mat4 } from '../../src/math/mat4.js';

describe('Quaternion', () => {
  describe('constructor', () => {
    it('should default to identity (0, 0, 0, 1)', () => {
      const q = new Quaternion();
      expect(q.x).toBe(0);
      expect(q.y).toBe(0);
      expect(q.z).toBe(0);
      expect(q.w).toBe(1);
    });
  });

  describe('identity', () => {
    it('should return identity quaternion', () => {
      const q = Quaternion.identity();
      expect(q.x).toBe(0);
      expect(q.y).toBe(0);
      expect(q.z).toBe(0);
      expect(q.w).toBe(1);
    });
  });

  describe('clone', () => {
    it('should create a separate copy', () => {
      const q1 = new Quaternion(1, 2, 3, 4);
      const q2 = q1.clone();
      expect(q2.x).toBe(1);
      expect(q2.y).toBe(2);
      expect(q2.z).toBe(3);
      expect(q2.w).toBe(4);
      expect(q2).not.toBe(q1);
    });
  });

  describe('fromAxisAngle', () => {
    it('should create identity for 0 rad rotation', () => {
      const q = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), 0);
      expect(q.w).toBeCloseTo(1);
      expect(q.x).toBeCloseTo(0);
      expect(q.y).toBeCloseTo(0);
      expect(q.z).toBeCloseTo(0);
    });

    it('should create 90 degrees around Y axis', () => {
      const q = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);
      const expected = Math.sin(Math.PI / 4);
      expect(q.x).toBeCloseTo(0);
      expect(q.y).toBeCloseTo(expected);
      expect(q.z).toBeCloseTo(0);
      expect(q.w).toBeCloseTo(Math.cos(Math.PI / 4));
    });

    it('should rotate a vector 90 degrees around Y', () => {
      const q = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);
      const v = new Vec3(1, 0, 0);
      const r = q.rotateVec3(v);
      expect(r.x).toBeCloseTo(0, 5);
      expect(r.y).toBeCloseTo(0);
      expect(r.z).toBeCloseTo(-1, 5);
    });
  });

  describe('fromEuler', () => {
    it('should return identity for zero angles', () => {
      const q = Quaternion.fromEuler(0, 0, 0);
      expect(q.w).toBeCloseTo(1);
      expect(q.x).toBeCloseTo(0);
      expect(q.y).toBeCloseTo(0);
      expect(q.z).toBeCloseTo(0);
    });

    it('should handle 90 degree yaw (Y)', () => {
      const q = Quaternion.fromEuler(0, Math.PI / 2, 0);
      const s = Math.sin(Math.PI / 4);
      expect(q.x).toBeCloseTo(0);
      expect(q.y).toBeCloseTo(s);
      expect(q.z).toBeCloseTo(0);
      expect(q.w).toBeCloseTo(s);
    });
  });

  describe('multiply', () => {
    it('should compose rotations', () => {
      const qx = Quaternion.fromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);
      const qy = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);
      const q = qx.multiply(qy);
      expect(q.length()).toBeCloseTo(1);
    });

    it('should multiply by identity to return copy', () => {
      const q = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), 1);
      const r = q.multiply(Quaternion.identity());
      expect(r.x).toBeCloseTo(q.x);
      expect(r.y).toBeCloseTo(q.y);
      expect(r.z).toBeCloseTo(q.z);
      expect(r.w).toBeCloseTo(q.w);
      expect(r).not.toBe(q);
    });
  });

  describe('rotateVec3', () => {
    it('should not change a vector when identity', () => {
      const q = Quaternion.identity();
      const v = new Vec3(1, 2, 3);
      const r = q.rotateVec3(v);
      expect(r.x).toBeCloseTo(1);
      expect(r.y).toBeCloseTo(2);
      expect(r.z).toBeCloseTo(3);
    });

    it('should preserve length', () => {
      const q = Quaternion.fromAxisAngle(new Vec3(1, 2, 3).normalize(), 0.7);
      const v = new Vec3(4, 5, 6);
      const r = q.rotateVec3(v);
      expect(r.length()).toBeCloseTo(v.length(), 5);
    });

    it('should rotate 180 deg around X to flip Y/Z', () => {
      const q = Quaternion.fromAxisAngle(new Vec3(1, 0, 0), Math.PI);
      const v = new Vec3(0, 1, 0);
      const r = q.rotateVec3(v);
      expect(r.x).toBeCloseTo(0);
      expect(r.y).toBeCloseTo(-1, 5);
      expect(r.z).toBeCloseTo(0);
    });
  });

  describe('normalize', () => {
    it('should produce unit length', () => {
      const q = new Quaternion(3, 4, 0, 0);
      const n = q.normalize();
      expect(n.length()).toBeCloseTo(1);
    });

    it('should return identity for zero-length', () => {
      const n = new Quaternion(0, 0, 0, 0).normalize();
      expect(n.x).toBe(0);
      expect(n.y).toBe(0);
      expect(n.z).toBe(0);
      expect(n.w).toBe(1);
    });
  });

  describe('conjugate', () => {
    it('should negate x, y, z', () => {
      const q = new Quaternion(1, 2, 3, 4);
      const c = q.conjugate();
      expect(c.x).toBe(-1);
      expect(c.y).toBe(-2);
      expect(c.z).toBe(-3);
      expect(c.w).toBe(4);
    });

    it('multiply(q, conjugate(q)) should yield identity for unit q', () => {
      const q = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), 0.5);
      const r = q.multiply(q.conjugate());
      expect(r.w).toBeCloseTo(1);
      expect(r.x).toBeCloseTo(0);
      expect(r.y).toBeCloseTo(0);
      expect(r.z).toBeCloseTo(0);
    });
  });

  describe('slerp', () => {
    it('should return start at t=0', () => {
      const a = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), 0);
      const b = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), 2);
      const r = a.slerp(b, 0);
      expect(r.x).toBeCloseTo(a.x);
      expect(r.y).toBeCloseTo(a.y);
      expect(r.z).toBeCloseTo(a.z);
      expect(r.w).toBeCloseTo(a.w);
    });

    it('should return end at t=1', () => {
      const a = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), 0);
      const b = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), 2);
      const r = a.slerp(b, 1);
      expect(r.x).toBeCloseTo(b.x);
      expect(r.y).toBeCloseTo(b.y);
      expect(r.z).toBeCloseTo(b.z);
      expect(r.w).toBeCloseTo(b.w);
    });

    it('should take the shorter arc', () => {
      const a = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), 0);
      const b = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), 5);
      const r = a.slerp(b, 0.5);
      expect(r.length()).toBeCloseTo(1);
    });
  });

  describe('toMat4', () => {
    it('should produce an identity matrix for identity quaternion', () => {
      const m = Quaternion.identity().toMat4();
      const id = Mat4.identity();
      for (let i = 0; i < 16; i++) {
        expect(m.data[i]).toBeCloseTo(id.data[i]);
      }
    });

    it('should rotate a vector via matrix equivalent to rotateVec3', () => {
      const q = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 3);
      const v = new Vec3(2, 0, 0);
      const r1 = q.rotateVec3(v);
      const m = q.toMat4();
      const r2 = m.transformPoint(v);
      expect(r1.x).toBeCloseTo(r2.x);
      expect(r1.y).toBeCloseTo(r2.y);
      expect(r1.z).toBeCloseTo(r2.z);
    });
  });
});
