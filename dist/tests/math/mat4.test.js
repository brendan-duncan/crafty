import { describe, it, expect } from 'vitest';
import { Mat4 } from '../../src/math/mat4.js';
import { Vec3 } from '../../src/math/vec3.js';
describe('Mat4', () => {
    describe('constructor', () => {
        it('should create zero matrix by default', () => {
            const m = new Mat4();
            for (let i = 0; i < 16; i++) {
                expect(m.data[i]).toBe(0);
            }
        });
        it('should create matrix from array', () => {
            const data = [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16,
            ];
            const m = new Mat4(data);
            for (let i = 0; i < 16; i++) {
                expect(m.data[i]).toBe(data[i]);
            }
        });
    });
    describe('identity', () => {
        it('should create identity matrix', () => {
            const m = Mat4.identity();
            expect(m.data[0]).toBe(1);
            expect(m.data[5]).toBe(1);
            expect(m.data[10]).toBe(1);
            expect(m.data[15]).toBe(1);
            expect(m.data[1]).toBe(0);
            expect(m.data[4]).toBe(0);
        });
    });
    describe('clone', () => {
        it('should create a copy of the matrix', () => {
            const m1 = new Mat4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
            const m2 = m1.clone();
            expect(m2.data).toEqual(m1.data);
            expect(m2).not.toBe(m1);
        });
    });
    describe('translation', () => {
        it('should create translation matrix', () => {
            const m = Mat4.translation(1, 2, 3);
            expect(m.data[12]).toBe(1);
            expect(m.data[13]).toBe(2);
            expect(m.data[14]).toBe(3);
        });
        it('should translate a point', () => {
            const m = Mat4.translation(5, 10, 15);
            const point = new Vec3(1, 2, 3);
            const result = m.transformPoint(point);
            expect(result.x).toBeCloseTo(6);
            expect(result.y).toBeCloseTo(12);
            expect(result.z).toBeCloseTo(18);
        });
    });
    describe('scale', () => {
        it('should create scale matrix', () => {
            const m = Mat4.scale(2, 3, 4);
            expect(m.data[0]).toBe(2);
            expect(m.data[5]).toBe(3);
            expect(m.data[10]).toBe(4);
        });
        it('should scale a point', () => {
            const m = Mat4.scale(2, 3, 4);
            const point = new Vec3(1, 2, 3);
            const result = m.transformPoint(point);
            expect(result.x).toBeCloseTo(2);
            expect(result.y).toBeCloseTo(6);
            expect(result.z).toBeCloseTo(12);
        });
    });
    describe('multiply', () => {
        it('should multiply two matrices', () => {
            const t = Mat4.translation(1, 2, 3);
            const s = Mat4.scale(2, 2, 2);
            const result = t.multiply(s);
            // Scale then translate
            const point = new Vec3(1, 1, 1);
            const transformed = result.transformPoint(point);
            expect(transformed.x).toBeCloseTo(3); // 1*2 + 1
            expect(transformed.y).toBeCloseTo(4); // 1*2 + 2
            expect(transformed.z).toBeCloseTo(5); // 1*2 + 3
        });
        it('should maintain identity when multiplying by identity', () => {
            const m = Mat4.translation(1, 2, 3);
            const id = Mat4.identity();
            const result = m.multiply(id);
            expect(result.data).toEqual(m.data);
        });
    });
    describe('perspective', () => {
        it('should create perspective projection matrix', () => {
            const m = Mat4.perspective(Math.PI / 2, 1.0, 0.1, 100);
            expect(m.data[0]).toBeGreaterThan(0); // fov affects this
            expect(m.data[15]).toBe(0); // perspective projection has 0 here
        });
    });
    describe('lookAt', () => {
        it('should create view matrix looking down -Z', () => {
            const eye = new Vec3(0, 0, 5);
            const center = new Vec3(0, 0, 0);
            const up = new Vec3(0, 1, 0);
            const m = Mat4.lookAt(eye, center, up);
            // Transform a point in front of camera
            const point = new Vec3(0, 0, 0);
            const result = m.transformPoint(point);
            expect(result.z).toBeCloseTo(-5); // Should be 5 units in front
        });
    });
    describe('transformPoint', () => {
        it('should transform a point by the matrix', () => {
            const m = Mat4.translation(10, 20, 30);
            const p = new Vec3(1, 2, 3);
            const result = m.transformPoint(p);
            expect(result.x).toBeCloseTo(11);
            expect(result.y).toBeCloseTo(22);
            expect(result.z).toBeCloseTo(33);
        });
    });
    describe('invert', () => {
        it('should invert identity to identity', () => {
            const m = Mat4.identity();
            const inv = m.invert();
            expect(inv.data).toEqual(m.data);
        });
        it('should invert translation', () => {
            const m = Mat4.translation(5, 10, 15);
            const inv = m.invert();
            const point = new Vec3(6, 12, 18);
            const result = inv.transformPoint(point);
            expect(result.x).toBeCloseTo(1);
            expect(result.y).toBeCloseTo(2);
            expect(result.z).toBeCloseTo(3);
        });
    });
});
