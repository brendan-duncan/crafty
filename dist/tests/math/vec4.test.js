import { describe, it, expect } from 'vitest';
import { Vec4 } from '../../src/math/vec4.js';
describe('Vec4', () => {
    describe('constructor', () => {
        it('should default to (0, 0, 0, 0)', () => {
            const v = new Vec4();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.z).toBe(0);
            expect(v.w).toBe(0);
        });
        it('should store given values', () => {
            const v = new Vec4(1, 2, 3, 4);
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
            expect(v.w).toBe(4);
        });
    });
    describe('set', () => {
        it('should mutate in place and return this', () => {
            const v = new Vec4();
            const ret = v.set(4, 5, 6, 7);
            expect(v.x).toBe(4);
            expect(v.y).toBe(5);
            expect(v.z).toBe(6);
            expect(v.w).toBe(7);
            expect(ret).toBe(v);
        });
    });
    describe('clone', () => {
        it('should return a separate copy', () => {
            const v1 = new Vec4(1, 2, 3, 4);
            const v2 = v1.clone();
            expect(v2.x).toBe(1);
            expect(v2.y).toBe(2);
            expect(v2.z).toBe(3);
            expect(v2.w).toBe(4);
            expect(v2).not.toBe(v1);
        });
    });
    describe('add', () => {
        it('should add componentwise', () => {
            const r = new Vec4(1, 2, 3, 4).add(new Vec4(5, 6, 7, 8));
            expect(r.x).toBe(6);
            expect(r.y).toBe(8);
            expect(r.z).toBe(10);
            expect(r.w).toBe(12);
        });
        it('should not mutate the original', () => {
            const a = new Vec4(1, 2, 3, 4);
            a.add(new Vec4(5, 6, 7, 8));
            expect(a.x).toBe(1);
        });
    });
    describe('sub', () => {
        it('should subtract componentwise', () => {
            const r = new Vec4(10, 9, 8, 7).sub(new Vec4(1, 2, 3, 4));
            expect(r.x).toBe(9);
            expect(r.y).toBe(7);
            expect(r.z).toBe(5);
            expect(r.w).toBe(3);
        });
    });
    describe('scale', () => {
        it('should multiply all components', () => {
            const r = new Vec4(1, 2, 3, 4).scale(3);
            expect(r.x).toBe(3);
            expect(r.y).toBe(6);
            expect(r.z).toBe(9);
            expect(r.w).toBe(12);
        });
    });
    describe('dot', () => {
        it('should compute dot product', () => {
            const d = new Vec4(1, 2, 3, 4).dot(new Vec4(5, 6, 7, 8));
            expect(d).toBe(70);
        });
        it('should return 0 for orthogonal vectors', () => {
            expect(new Vec4(1, 0, 0, 0).dot(new Vec4(0, 1, 0, 0))).toBe(0);
        });
    });
    describe('length', () => {
        it('should compute Euclidean length', () => {
            expect(new Vec4(1, 2, 2, 0).length()).toBe(3);
        });
        it('should return 0 for zero vector', () => {
            expect(new Vec4().length()).toBe(0);
        });
    });
    describe('lengthSq', () => {
        it('should compute squared length', () => {
            expect(new Vec4(1, 2, 2, 0).lengthSq()).toBe(9);
        });
    });
    describe('toArray', () => {
        it('should return [x, y, z, w]', () => {
            expect(new Vec4(7, 8, 9, 10).toArray()).toEqual([7, 8, 9, 10]);
        });
    });
    describe('static methods', () => {
        it('zero() returns (0, 0, 0, 0)', () => {
            const z = Vec4.zero();
            expect(z.x).toBe(0);
            expect(z.y).toBe(0);
            expect(z.z).toBe(0);
            expect(z.w).toBe(0);
        });
        it('one() returns (1, 1, 1, 1)', () => {
            const o = Vec4.one();
            expect(o.x).toBe(1);
            expect(o.y).toBe(1);
            expect(o.z).toBe(1);
            expect(o.w).toBe(1);
        });
    });
    describe('fromArray', () => {
        it('should read four consecutive components', () => {
            const a = [10, 20, 30, 40, 50];
            const v = Vec4.fromArray(a, 0);
            expect(v.x).toBe(10);
            expect(v.y).toBe(20);
            expect(v.z).toBe(30);
            expect(v.w).toBe(40);
        });
        it('should respect offset', () => {
            const a = [10, 20, 30, 40, 50];
            const v = Vec4.fromArray(a, 1);
            expect(v.x).toBe(20);
            expect(v.y).toBe(30);
            expect(v.z).toBe(40);
            expect(v.w).toBe(50);
        });
        it('should work with ArrayLike (Float32Array)', () => {
            const a = new Float32Array([1, 2, 3, 4]);
            const v = Vec4.fromArray(a);
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
            expect(v.z).toBe(3);
            expect(v.w).toBe(4);
        });
    });
});
