import { describe, it, expect } from 'vitest';
import { CameraControls } from '../../src/engine/camera_controls.js';
import { GameObject } from '../../src/engine/game_object.js';
describe('CameraControls', () => {
    describe('constructor', () => {
        it('should set defaults', () => {
            const cc = new CameraControls();
            expect(cc.yaw).toBe(0);
            expect(cc.pitch).toBe(0);
            expect(cc.speed).toBe(5);
            expect(cc.sensitivity).toBe(0.002);
        });
        it('should accept custom values', () => {
            const cc = new CameraControls(1, 0.5, 10, 0.001);
            expect(cc.yaw).toBe(1);
            expect(cc.pitch).toBe(0.5);
            expect(cc.speed).toBe(10);
        });
    });
    describe('pressKey / update movement', () => {
        it('should move forward (KeyW) along -Z at yaw=0', () => {
            const cc = new CameraControls(0, 0, 1);
            const go = new GameObject();
            cc.pressKey('KeyW');
            cc.update(go, 1);
            expect(go.position.z).toBeLessThan(0);
            expect(go.position.x).toBeCloseTo(0);
        });
        it('should move backward (KeyS) along +Z at yaw=0', () => {
            const cc = new CameraControls(0, 0, 1);
            const go = new GameObject();
            cc.pressKey('KeyS');
            cc.update(go, 1);
            expect(go.position.z).toBeGreaterThan(0);
        });
        it('should move left (KeyA) along -X at yaw=0', () => {
            const cc = new CameraControls(0, 0, 1);
            const go = new GameObject();
            cc.pressKey('KeyA');
            cc.update(go, 1);
            expect(go.position.x).toBeLessThan(0);
        });
        it('should move right (KeyD) along +X at yaw=0', () => {
            const cc = new CameraControls(0, 0, 1);
            const go = new GameObject();
            cc.pressKey('KeyD');
            cc.update(go, 1);
            expect(go.position.x).toBeGreaterThan(0);
        });
        it('should move up (Space)', () => {
            const cc = new CameraControls(0, 0, 1);
            const go = new GameObject();
            cc.pressKey('Space');
            cc.update(go, 1);
            expect(go.position.y).toBeGreaterThan(0);
        });
        it('should move down (ShiftLeft)', () => {
            const cc = new CameraControls(0, 0, 1);
            const go = new GameObject();
            cc.pressKey('ShiftLeft');
            cc.update(go, 1);
            expect(go.position.y).toBeLessThan(0);
        });
        it('should respect dt scaling', () => {
            const cc = new CameraControls(0, 0, 10);
            const go = new GameObject();
            cc.pressKey('KeyW');
            cc.update(go, 0.5);
            const pos = go.position.z;
            go.position.set(0, 0, 0);
            cc.update(go, 1);
            // dt=0.5 should move half as much per call, but the total after two calls
            // with dt=0.5 should equal one call with dt=1
            expect(go.position.z).toBeCloseTo(pos * 2);
        });
        it('should not move when no key is pressed', () => {
            const cc = new CameraControls(0, 0, 10);
            const go = new GameObject();
            cc.update(go, 1);
            expect(go.position.x).toBeCloseTo(0);
            expect(go.position.y).toBeCloseTo(0);
            expect(go.position.z).toBeCloseTo(0);
        });
        it('should use fast multiplier with ControlLeft', () => {
            const cc = new CameraControls(0, 0, 1);
            const go = new GameObject();
            cc.pressKey('KeyW');
            cc.pressKey('ControlLeft');
            cc.update(go, 1);
            const fastPos = go.position.z;
            const base = 1 * 3; // speed * FLY_FAST_MULT = 1 * 3
            expect(fastPos).toBeCloseTo(-base, 4);
        });
        it('should move at 45 deg with W+A', () => {
            const cc = new CameraControls(0, 0, 1);
            const go = new GameObject();
            cc.pressKey('KeyW');
            cc.pressKey('KeyA');
            cc.update(go, 1);
            // Should be moving in diagonal direction: dx = -sin(0) + -cos(0) = -1, dz = -cos(0) + sin(0) = -1
            // After normalization: dx = dz ≈ -0.707
            expect(go.position.x).toBeLessThan(0);
            expect(go.position.z).toBeLessThan(0);
            expect(Math.abs(go.position.x)).toBeCloseTo(Math.abs(go.position.z), 4);
        });
        it('should rotate at yaw != 0', () => {
            const cc = new CameraControls(Math.PI / 2, 0, 1);
            const go = new GameObject();
            cc.pressKey('KeyW');
            cc.update(go, 1);
            // At yaw = PI/2: forward should be -sin(PI/2)=-1, -cos(PI/2)=0 → moving along -X
            expect(go.position.x).toBeLessThan(0);
            expect(go.position.z).toBeCloseTo(0, 5);
        });
    });
    describe('update rotation', () => {
        it('should set rotation from yaw and pitch', () => {
            const cc = new CameraControls(0.5, 0.3);
            const go = new GameObject();
            cc.update(go, 1);
            expect(go.rotation.w).not.toBe(1); // rotated away from identity
            expect(go.rotation.length()).toBeCloseTo(1);
        });
    });
    describe('applyLookDelta', () => {
        it('should modify yaw and pitch', () => {
            const cc = new CameraControls(0, 0, 1, 0.002);
            cc.applyLookDelta(100, 0);
            expect(cc.yaw).toBeCloseTo(-0.2); // -dx * sensitivity = -100 * 0.002
        });
        it('should increment pitch downward', () => {
            const cc = new CameraControls(0, 0, 1, 0.002);
            cc.applyLookDelta(0, 50);
            expect(cc.pitch).toBeCloseTo(0.1); // dy * sensitivity = 50 * 0.002
        });
        it('should clamp pitch to ±89°', () => {
            const cc = new CameraControls(0, 0, 1, 0.002);
            cc.applyLookDelta(0, 999999);
            expect(cc.pitch).toBeLessThan(Math.PI / 2);
            expect(cc.pitch).toBeGreaterThan(0);
            cc.applyLookDelta(0, -999999);
            expect(cc.pitch).toBeGreaterThan(-Math.PI / 2);
            expect(cc.pitch).toBeLessThan(0);
        });
    });
    describe('inputForward/inputStrafe analog', () => {
        it('should move forward with inputForward', () => {
            const cc = new CameraControls(0, 0, 1);
            cc.inputForward = 1;
            const go = new GameObject();
            cc.update(go, 1);
            expect(go.position.z).toBeLessThan(0);
        });
        it('should move right with inputStrafe', () => {
            const cc = new CameraControls(0, 0, 1);
            cc.inputStrafe = 1;
            const go = new GameObject();
            cc.update(go, 1);
            expect(go.position.x).toBeGreaterThan(0);
        });
        it('should combine analog with keyboard', () => {
            const cc = new CameraControls(0, 0, 1);
            cc.inputForward = 0.5;
            cc.inputUp = true;
            cc.inputFast = true;
            const go = new GameObject();
            cc.update(go, 1);
            // Should have both horizontal movement and vertical movement
            expect(go.position.z).toBeLessThan(0);
            expect(go.position.y).toBeGreaterThan(0);
        });
    });
});
