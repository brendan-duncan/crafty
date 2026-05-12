import { describe, it, expect } from 'vitest';
import { buildErosionRegion, EROSION_REGION_SIZE } from '../../src/block/erosion.js';
describe('erosion', () => {
    describe('buildErosionRegion', () => {
        it('should return a Float32Array of correct size', () => {
            const result = buildErosionRegion(0, 0, 42);
            expect(result).toBeInstanceOf(Float32Array);
            expect(result.length).toBe(EROSION_REGION_SIZE * EROSION_REGION_SIZE);
        });
        it('should be deterministic for the same region and seed', () => {
            const a = buildErosionRegion(1, 2, 42);
            const b = buildErosionRegion(1, 2, 42);
            for (let i = 0; i < a.length; i++) {
                expect(a[i]).toBe(b[i]);
            }
        });
        it('should produce different results for different seeds', () => {
            const a = buildErosionRegion(0, 0, 42);
            const b = buildErosionRegion(0, 0, 99);
            let sameCount = 0;
            for (let i = 0; i < a.length; i++) {
                if (a[i] === b[i])
                    sameCount++;
            }
            // At most 5% of values should be identical (floating point)
            expect(sameCount).toBeLessThan(a.length * 0.05);
        });
        it('should produce different results for different regions', () => {
            const a = buildErosionRegion(0, 0, 42);
            const b = buildErosionRegion(1, 0, 42);
            let sameCount = 0;
            for (let i = 0; i < a.length; i++) {
                if (a[i] === b[i])
                    sameCount++;
            }
            expect(sameCount).toBeLessThan(a.length * 0.05);
        });
        it('should have finite values throughout', () => {
            const result = buildErosionRegion(0, 0, 42);
            for (let i = 0; i < result.length; i++) {
                expect(Number.isFinite(result[i])).toBe(true);
            }
        });
        it('should fade displacement to zero at region borders', () => {
            const R = EROSION_REGION_SIZE;
            const result = buildErosionRegion(0, 0, 42);
            // Check the 4 corners — should be exactly 0 due to fade
            expect(result[0]).toBeCloseTo(0);
            expect(result[R - 1]).toBeCloseTo(0);
            expect(result[(R - 1) * R]).toBeCloseTo(0);
            expect(result[R * R - 1]).toBeCloseTo(0);
        });
        it('should have larger displacement near center than edges', () => {
            const R = EROSION_REGION_SIZE;
            const result = buildErosionRegion(0, 0, 42);
            const center = result[R * Math.floor(R / 2) + Math.floor(R / 2)];
            const corner = result[0];
            // The center value (with no fade) should not be exactly 0
            // while the corner (with full fade) should be 0
            expect(Math.abs(center)).toBeGreaterThan(0);
            expect(corner).toBeCloseTo(0);
        });
    });
});
