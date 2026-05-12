import { describe, it, expect } from 'vitest';
import { Camera } from '../../../src/engine/components/camera.js';
import { GameObject } from '../../../src/engine/game_object.js';
import { Vec3 } from '../../../src/math/vec3.js';
describe('Camera', () => {
    describe('constructor', () => {
        it('should convert degrees to radians', () => {
            const c = new Camera(60);
            expect(c.fov).toBeCloseTo(Math.PI / 3);
        });
        it('should set defaults', () => {
            const c = new Camera();
            expect(c.near).toBe(0.1);
            expect(c.far).toBe(1000);
            expect(c.aspect).toBeCloseTo(16 / 9);
        });
    });
    describe('projectionMatrix', () => {
        it('should produce a valid perspective matrix', () => {
            const c = new Camera(90, 0.1, 100, 1);
            const m = c.projectionMatrix();
            expect(m.data[0]).toBeGreaterThan(0);
            expect(m.data[5]).toBeGreaterThan(0);
            expect(m.data[15]).toBe(0);
        });
    });
    describe('viewMatrix', () => {
        it('should look along -Z when GameObject is at origin', () => {
            const go = new GameObject();
            const c = go.addComponent(new Camera());
            const v = c.viewMatrix();
            const origin = v.transformPoint(new Vec3(0, 0, 0));
            expect(origin.z).toBeCloseTo(0);
        });
        it('should invert world translation', () => {
            const go = new GameObject();
            go.position.set(10, 20, 30);
            const c = go.addComponent(new Camera());
            const v = c.viewMatrix();
            const origin = v.transformPoint(new Vec3(0, 0, 0));
            expect(origin.x).toBeCloseTo(-10);
            expect(origin.y).toBeCloseTo(-20);
            expect(origin.z).toBeCloseTo(-30);
        });
    });
    describe('viewProjectionMatrix', () => {
        it('should combine projection and view', () => {
            const go = new GameObject();
            const c = go.addComponent(new Camera(90, 0.1, 100, 1));
            const vp = c.viewProjectionMatrix();
            const p = c.projectionMatrix();
            const v = c.viewMatrix();
            const expected = p.multiply(v);
            for (let i = 0; i < 16; i++) {
                expect(vp.data[i]).toBeCloseTo(expected.data[i]);
            }
        });
    });
    describe('position', () => {
        it('should return world position from GameObject transform', () => {
            const go = new GameObject();
            go.position.set(5, 10, 15);
            const c = go.addComponent(new Camera());
            const p = c.position();
            expect(p.x).toBeCloseTo(5);
            expect(p.y).toBeCloseTo(10);
            expect(p.z).toBeCloseTo(15);
        });
        it('should compose parent transforms', () => {
            const parent = new GameObject();
            parent.position.set(100, 0, 0);
            const child = new GameObject();
            child.position.set(0, 50, 0);
            parent.addChild(child);
            const c = child.addComponent(new Camera());
            const p = c.position();
            expect(p.x).toBeCloseTo(100);
            expect(p.y).toBeCloseTo(50);
        });
    });
    describe('frustumCornersWorld', () => {
        it('should return 8 world-space corners', () => {
            const go = new GameObject();
            const c = go.addComponent(new Camera(90, 0.1, 100, 1));
            const corners = c.frustumCornersWorld();
            expect(corners).toHaveLength(8);
        });
        it('should have near corners closer than far corners', () => {
            const go = new GameObject();
            const c = go.addComponent(new Camera(90, 0.1, 100, 1));
            const corners = c.frustumCornersWorld();
            // Near plane corners (indices 0-3) should be closer to origin than far (4-7)
            const nearDist = corners.slice(0, 4).reduce((sum, v) => sum + v.length(), 0) / 4;
            const farDist = corners.slice(4).reduce((sum, v) => sum + v.length(), 0) / 4;
            expect(nearDist).toBeLessThan(farDist);
        });
    });
});
