import { describe, it, expect } from 'vitest';
import { sampleClip } from '../../src/engine/animation.js';
function makeChannel(jointIndex, property, times, values, interpolation = 'LINEAR') {
    return { jointIndex, property, times: new Float32Array(times), values: new Float32Array(values), interpolation };
}
describe('sampleClip', () => {
    it('should output first keyframe before first time', () => {
        const clip = {
            name: 'test',
            duration: 1,
            channels: [makeChannel(0, 'translation', [0.5, 1], [10, 20, 30, 40, 50, 60])],
        };
        const t = new Float32Array(3);
        const r = new Float32Array(4);
        const s = new Float32Array(3);
        sampleClip(clip, 0, t, r, s);
        expect(t[0]).toBe(10);
        expect(t[1]).toBe(20);
        expect(t[2]).toBe(30);
    });
    it('should output last keyframe after last time', () => {
        const clip = {
            name: 'test',
            duration: 1,
            channels: [makeChannel(0, 'translation', [0, 0.5], [10, 20, 30, 40, 50, 60])],
        };
        const t = new Float32Array(3);
        const r = new Float32Array(4);
        const s = new Float32Array(3);
        sampleClip(clip, 2, t, r, s);
        expect(t[0]).toBe(40);
        expect(t[1]).toBe(50);
        expect(t[2]).toBe(60);
    });
    it('should linearly interpolate translation between keyframes', () => {
        const clip = {
            name: 'test',
            duration: 1,
            channels: [makeChannel(0, 'translation', [0, 1], [0, 0, 0, 10, 20, 30])],
        };
        const t = new Float32Array(3);
        const r = new Float32Array(4);
        const s = new Float32Array(3);
        sampleClip(clip, 0.5, t, r, s);
        expect(t[0]).toBeCloseTo(5);
        expect(t[1]).toBeCloseTo(10);
        expect(t[2]).toBeCloseTo(15);
    });
    it('should hold value for STEP interpolation', () => {
        const clip = {
            name: 'test',
            duration: 1,
            channels: [makeChannel(0, 'translation', [0, 1], [100, 200, 300, 400, 500, 600], 'STEP')],
        };
        const t = new Float32Array(3);
        const r = new Float32Array(4);
        const s = new Float32Array(3);
        sampleClip(clip, 0.5, t, r, s);
        expect(t[0]).toBe(100);
        expect(t[1]).toBe(200);
        expect(t[2]).toBe(300);
    });
    it('should linearly interpolate scale between keyframes', () => {
        const clip = {
            name: 'test',
            duration: 1,
            channels: [makeChannel(0, 'scale', [0, 1], [1, 1, 1, 2, 2, 2])],
        };
        const t = new Float32Array(3);
        const r = new Float32Array(4);
        const s = new Float32Array(3);
        sampleClip(clip, 0.5, t, r, s);
        expect(s[0]).toBeCloseTo(1.5);
        expect(s[1]).toBeCloseTo(1.5);
        expect(s[2]).toBeCloseTo(1.5);
    });
    it('should interpolate rotation using slerp', () => {
        // Identity -> 180 deg around Y
        const clip = {
            name: 'test',
            duration: 1,
            channels: [makeChannel(0, 'rotation', [0, 1], [0, 0, 0, 1, 0, 1, 0, 0])],
        };
        const t = new Float32Array(3);
        const r = new Float32Array(4);
        const s = new Float32Array(3);
        sampleClip(clip, 0.5, t, r, s);
        // At t=0.5 the quaternion should be a 90 deg rotation around Y
        expect(Math.abs(r[0])).toBeCloseTo(0);
        expect(Math.abs(r[1])).toBeCloseTo(Math.sin(Math.PI / 4), 4);
        expect(Math.abs(r[2])).toBeCloseTo(0);
        expect(Math.abs(r[3])).toBeCloseTo(Math.cos(Math.PI / 4), 4);
    });
    it('should have unit length for rotation output', () => {
        // Use unit-length quaternion keyframes
        const s2 = Math.SQRT1_2; // 1/sqrt(2)
        const clip = {
            name: 'test',
            duration: 1,
            channels: [makeChannel(0, 'rotation', [0, 1], [0, 0, 0, 1, 0, s2, 0, s2])],
        };
        const t = new Float32Array(3);
        const r = new Float32Array(4);
        const s = new Float32Array(3);
        for (let time = 0; time <= 1; time += 0.1) {
            sampleClip(clip, time, t, r, s);
            const len = Math.sqrt(r[0] ** 2 + r[1] ** 2 + r[2] ** 2 + r[3] ** 2);
            expect(len).toBeCloseTo(1, 4);
        }
    });
    it('should handle multiple channels', () => {
        const clip = {
            name: 'test',
            duration: 1,
            channels: [
                makeChannel(0, 'translation', [0, 1], [0, 0, 0, 10, 0, 0]),
                makeChannel(1, 'translation', [0, 1], [0, 0, 0, 0, 20, 0]),
            ],
        };
        const t = new Float32Array(6); // 2 joints * 3
        const r = new Float32Array(8);
        const s = new Float32Array(6);
        sampleClip(clip, 0.5, t, r, s);
        expect(t[0]).toBeCloseTo(5); // joint 0 x
        expect(t[3]).toBeCloseTo(0); // joint 1 x
        expect(t[4]).toBeCloseTo(10); // joint 1 y
    });
    it('should handle empty times array', () => {
        const clip = {
            name: 'test',
            duration: 0,
            channels: [makeChannel(0, 'translation', [], [])],
        };
        const t = new Float32Array(3);
        const r = new Float32Array(4);
        const s = new Float32Array(3);
        // Should not throw, leave output unchanged
        t.fill(99);
        sampleClip(clip, 0, t, r, s);
        expect(t[0]).toBe(99);
    });
    it('should handle CUBICSPLINE interpolation', () => {
        // CUBICSPLINE layout: [inTangent(n), value(n), outTangent(n)] per keyframe
        // 1 keyframe: in(3), value(3), out(3) = 9 floats
        // 2 keyframes: 18 floats
        // times: [0, 1]; values: 18 floats
        // in0, value0, out0, in1, value1, out1
        const values = [
            // frame 0: in, value, out
            0, 0, 0, 0, 0, 0, 1, 0, 0,
            // frame 1: in, value, out
            1, 0, 0, 10, 0, 0, 1, 0, 0,
        ];
        const clip = {
            name: 'test',
            duration: 1,
            channels: [{ jointIndex: 0, property: 'translation', times: new Float32Array([0, 1]), values: new Float32Array(values), interpolation: 'CUBICSPLINE' }],
        };
        const t = new Float32Array(3);
        const r = new Float32Array(4);
        const s = new Float32Array(3);
        sampleClip(clip, 0, t, r, s);
        expect(t[0]).toBeCloseTo(0);
        sampleClip(clip, 1, t, r, s);
        expect(t[0]).toBeCloseTo(10);
        sampleClip(clip, 0.5, t, r, s);
        expect(t[0]).toBeGreaterThan(1);
        expect(t[0]).toBeLessThan(9);
    });
});
