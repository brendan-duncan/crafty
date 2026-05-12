import { describe, it, expect } from 'vitest';
import { Mat4 } from '../../src/math/mat4.js';
import { Vec3 } from '../../src/math/vec3.js';
import { Vec4 } from '../../src/math/vec4.js';
import { Quaternion } from '../../src/math/quaternion.js';
describe('Mat4 extra', () => {
    describe('rotationX', () => {
        it('should be identity for 0 rad', () => {
            const m = Mat4.rotationX(0);
            const id = Mat4.identity();
            for (let i = 0; i < 16; i++) {
                expect(m.data[i]).toBeCloseTo(id.data[i]);
            }
        });
        it('should rotate 90 degrees around X', () => {
            const m = Mat4.rotationX(Math.PI / 2);
            const v = m.transformDirection(new Vec3(0, 1, 0));
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(0);
            expect(v.z).toBeCloseTo(1, 5);
        });
    });
    describe('rotationY', () => {
        it('should be identity for 0 rad', () => {
            const m = Mat4.rotationY(0);
            const id = Mat4.identity();
            for (let i = 0; i < 16; i++) {
                expect(m.data[i]).toBeCloseTo(id.data[i]);
            }
        });
        it('should rotate 90 degrees around Y', () => {
            const m = Mat4.rotationY(Math.PI / 2);
            const v = m.transformDirection(new Vec3(1, 0, 0));
            expect(v.x).toBeCloseTo(0);
            expect(v.y).toBeCloseTo(0);
            expect(v.z).toBeCloseTo(-1, 5);
        });
    });
    describe('rotationZ', () => {
        it('should be identity for 0 rad', () => {
            const m = Mat4.rotationZ(0);
            const id = Mat4.identity();
            for (let i = 0; i < 16; i++) {
                expect(m.data[i]).toBeCloseTo(id.data[i]);
            }
        });
        it('should rotate 90 degrees around Z', () => {
            const m = Mat4.rotationZ(Math.PI / 2);
            const v = m.transformDirection(new Vec3(0, 1, 0));
            expect(v.x).toBeCloseTo(-1, 5);
            expect(v.y).toBeCloseTo(0);
            expect(v.z).toBeCloseTo(0);
        });
    });
    describe('fromQuaternion', () => {
        it('should produce identity for identity quaternion', () => {
            const m = Mat4.fromQuaternion(0, 0, 0, 1);
            const id = Mat4.identity();
            for (let i = 0; i < 16; i++) {
                expect(m.data[i]).toBeCloseTo(id.data[i]);
            }
        });
        it('should rotate a vector equivalently to Quaternion.rotateVec3', () => {
            const q = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 3);
            const m = Mat4.fromQuaternion(q.x, q.y, q.z, q.w);
            const v = new Vec3(2, 0, 0);
            const r1 = q.rotateVec3(v);
            const r2 = m.transformDirection(v);
            expect(r1.x).toBeCloseTo(r2.x);
            expect(r1.y).toBeCloseTo(r2.y);
            expect(r1.z).toBeCloseTo(r2.z);
        });
    });
    describe('orthographic', () => {
        it('should map left-right to -1..1 in x', () => {
            const m = Mat4.orthographic(0, 100, 0, 100, -1, 1);
            const left = m.transformPoint(new Vec3(0, 50, 0));
            const right = m.transformPoint(new Vec3(100, 50, 0));
            expect(left.x).toBeCloseTo(-1);
            expect(right.x).toBeCloseTo(1);
        });
        it('should map bottom-top to -1..1 in y', () => {
            const m = Mat4.orthographic(0, 100, 0, 100, -1, 1);
            const bottom = m.transformPoint(new Vec3(50, 0, 0));
            const top = m.transformPoint(new Vec3(50, 100, 0));
            expect(bottom.y).toBeCloseTo(-1);
            expect(top.y).toBeCloseTo(1);
        });
    });
    describe('transformDirection', () => {
        it('should ignore translation', () => {
            const m = Mat4.translation(100, 200, 300);
            const v = m.transformDirection(new Vec3(1, 0, 0));
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(0);
            expect(v.z).toBeCloseTo(0);
        });
    });
    describe('transformVec4', () => {
        it('should transform homogeneous 4D vector', () => {
            const m = Mat4.translation(10, 20, 30);
            const v = m.transformVec4(new Vec4(1, 2, 3, 1));
            expect(v.x).toBeCloseTo(11);
            expect(v.y).toBeCloseTo(22);
            expect(v.z).toBeCloseTo(33);
            expect(v.w).toBeCloseTo(1);
        });
    });
    describe('transpose', () => {
        it('should swap rows and columns', () => {
            const m = new Mat4([
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16,
            ]);
            const t = m.transpose();
            expect(t.data[0]).toBe(1);
            expect(t.data[1]).toBe(5);
            expect(t.data[4]).toBe(2);
            expect(t.data[5]).toBe(6);
        });
        it('transpose of transpose is original', () => {
            const m = Mat4.translation(5, 10, 15);
            const t = m.transpose().transpose();
            for (let i = 0; i < 16; i++) {
                expect(t.data[i]).toBeCloseTo(m.data[i]);
            }
        });
    });
    describe('normalMatrix', () => {
        it('should be identity for identity matrix', () => {
            const m = Mat4.identity().normalMatrix();
            const id = Mat4.identity();
            for (let i = 0; i < 16; i++) {
                expect(m.data[i]).toBeCloseTo(id.data[i]);
            }
        });
        it('should handle non-uniform scale', () => {
            const m = Mat4.scale(2, 3, 4);
            const n = m.normalMatrix();
            const v = n.transformDirection(new Vec3(1, 0, 0));
            expect(v.x).toBeCloseTo(0.5);
            expect(v.y).toBeCloseTo(0);
            expect(v.z).toBeCloseTo(0);
        });
        it('should return identity for singular matrix', () => {
            const m = new Mat4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            const n = m.normalMatrix();
            expect(n.data[0]).toBe(1);
            expect(n.data[5]).toBe(1);
            expect(n.data[10]).toBe(1);
            expect(n.data[15]).toBe(1);
        });
    });
    describe('trs', () => {
        it('should produce identity-equivalent for default transform', () => {
            const m = Mat4.trs(new Vec3(0, 0, 0), 0, 0, 0, 1, new Vec3(1, 1, 1));
            const id = Mat4.identity();
            for (let i = 0; i < 16; i++) {
                expect(m.data[i]).toBeCloseTo(id.data[i]);
            }
        });
        it('should compose translation and scale', () => {
            const m = Mat4.trs(new Vec3(5, 10, 15), 0, 0, 0, 1, new Vec3(2, 3, 4));
            const v = m.transformPoint(new Vec3(1, 1, 1));
            expect(v.x).toBeCloseTo(7); // 1*2 + 5
            expect(v.y).toBeCloseTo(13); // 1*3 + 10
            expect(v.z).toBeCloseTo(19); // 1*4 + 15
        });
        it('should apply rotation around Y', () => {
            const q = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);
            const m = Mat4.trs(new Vec3(0, 0, 0), q.x, q.y, q.z, q.w, new Vec3(1, 1, 1));
            const v = m.transformDirection(new Vec3(1, 0, 0));
            expect(v.x).toBeCloseTo(0);
            expect(v.z).toBeCloseTo(-1, 5);
        });
    });
    describe('invert edge cases', () => {
        it('should return identity for singular matrix', () => {
            const m = new Mat4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            const inv = m.invert();
            expect(inv.data[0]).toBe(1);
            expect(inv.data[5]).toBe(1);
            expect(inv.data[10]).toBe(1);
            expect(inv.data[15]).toBe(1);
        });
        it('should invert rotation matrix', () => {
            const m = Mat4.rotationY(0.7);
            const inv = m.invert();
            const prod = m.multiply(inv);
            const id = Mat4.identity();
            for (let i = 0; i < 16; i++) {
                expect(prod.data[i]).toBeCloseTo(id.data[i], 5);
            }
        });
        it('should invert scale matrix', () => {
            const m = Mat4.scale(2, 3, 4);
            const inv = m.invert();
            const v = inv.transformPoint(new Vec3(2, 6, 12));
            expect(v.x).toBeCloseTo(1);
            expect(v.y).toBeCloseTo(2);
            expect(v.z).toBeCloseTo(3);
        });
    });
    describe('lookAt edge cases', () => {
        it('should produce view matrix looking at origin from +Z', () => {
            const m = Mat4.lookAt(new Vec3(0, 0, 10), new Vec3(0, 0, 0), new Vec3(0, 1, 0));
            const origin = m.transformPoint(new Vec3(0, 0, 0));
            expect(origin.z).toBeCloseTo(-10);
        });
        it('should produce view matrix with up vector', () => {
            const m = Mat4.lookAt(new Vec3(0, 0, 10), new Vec3(0, 0, 0), new Vec3(0, 1, 0));
            const up = m.transformDirection(new Vec3(0, 1, 0));
            expect(up.x).toBeCloseTo(0);
            expect(up.y).toBeCloseTo(1);
            expect(up.z).toBeCloseTo(0);
        });
    });
});
