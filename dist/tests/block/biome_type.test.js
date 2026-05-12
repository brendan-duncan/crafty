import { describe, it, expect } from 'vitest';
import { BiomeType, EnvironmentEffect, getBiomeEnvironmentEffect, getBiomeCloudBounds, getBiomeBlend, getBiomeCloudCoverage, } from '../../src/block/biome_type.js';
describe('biome_type', () => {
    describe('getBiomeEnvironmentEffect', () => {
        it('should return Snow for snowy biomes', () => {
            expect(getBiomeEnvironmentEffect(BiomeType.SnowyMountains)).toBe(EnvironmentEffect.Snow);
            expect(getBiomeEnvironmentEffect(BiomeType.SnowyPlains)).toBe(EnvironmentEffect.Snow);
        });
        it('should return None for non-snowy biomes', () => {
            expect(getBiomeEnvironmentEffect(BiomeType.GrassyPlains)).toBe(EnvironmentEffect.None);
            expect(getBiomeEnvironmentEffect(BiomeType.Desert)).toBe(EnvironmentEffect.None);
            expect(getBiomeEnvironmentEffect(BiomeType.RockyMountains)).toBe(EnvironmentEffect.None);
            expect(getBiomeEnvironmentEffect(BiomeType.None)).toBe(EnvironmentEffect.None);
        });
    });
    describe('getBiomeCloudBounds', () => {
        it('should return higher cloud base for SnowyMountains', () => {
            const b = getBiomeCloudBounds(BiomeType.SnowyMountains);
            expect(b.cloudBase).toBe(90);
            expect(b.cloudTop).toBe(200);
        });
        it('should return 75/160 for RockyMountains', () => {
            const b = getBiomeCloudBounds(BiomeType.RockyMountains);
            expect(b.cloudBase).toBe(75);
            expect(b.cloudTop).toBe(160);
        });
        it('should return default bounds for other biomes', () => {
            const b = getBiomeCloudBounds(BiomeType.GrassyPlains);
            expect(b.cloudBase).toBe(75);
            expect(b.cloudTop).toBe(105);
        });
    });
    describe('getBiomeBlend', () => {
        it('should return pure Desert for temperature > 0.40', () => {
            const r = getBiomeBlend(0.5);
            expect(r.biome1).toBe(BiomeType.Desert);
            expect(r.biome2).toBe(BiomeType.Desert);
            expect(r.blend).toBe(0);
        });
        it('should return pure GrassyPlains for temperature in (-0.10, 0.30)', () => {
            const r = getBiomeBlend(0);
            expect(r.biome1).toBe(BiomeType.GrassyPlains);
            expect(r.biome2).toBe(BiomeType.GrassyPlains);
            expect(r.blend).toBe(0);
        });
        it('should return pure SnowyMountains for temperature in (-0.40, -0.35)', () => {
            const r = getBiomeBlend(-0.36);
            expect(r.biome1).toBe(BiomeType.SnowyMountains);
            expect(r.biome2).toBe(BiomeType.SnowyMountains);
            expect(r.blend).toBe(0);
        });
        it('should return pure RockyMountains for temperature < -0.55', () => {
            const r = getBiomeBlend(-0.6);
            expect(r.biome1).toBe(BiomeType.RockyMountains);
            expect(r.biome2).toBe(BiomeType.RockyMountains);
            expect(r.blend).toBe(0);
        });
        it('should blend Desert <-> GrassyPlains at threshold 0.35', () => {
            const r = getBiomeBlend(0.35);
            expect(r.biome1).toBe(BiomeType.GrassyPlains);
            expect(r.biome2).toBe(BiomeType.Desert);
            expect(r.blend).toBeCloseTo(0.5);
        });
        it('should be fully cool side at left edge of blend zone', () => {
            const r = getBiomeBlend(0.35 - 0.05);
            expect(r.biome1).toBe(BiomeType.GrassyPlains);
            expect(r.biome2).toBe(BiomeType.Desert);
            expect(r.blend).toBeCloseTo(0);
        });
        it('should be fully warm side at right edge of blend zone', () => {
            const r = getBiomeBlend(0.35 + 0.05);
            expect(r.biome1).toBe(BiomeType.GrassyPlains);
            expect(r.biome2).toBe(BiomeType.Desert);
            expect(r.blend).toBeCloseTo(1);
        });
        it('should blend GrassyPlains <-> SnowyPlains at threshold -0.15', () => {
            const r = getBiomeBlend(-0.15);
            expect(r.biome1).toBe(BiomeType.SnowyPlains);
            expect(r.biome2).toBe(BiomeType.GrassyPlains);
            expect(r.blend).toBeCloseTo(0.5);
        });
        it('should blend SnowyPlains <-> SnowyMountains at threshold -0.3', () => {
            const r = getBiomeBlend(-0.3);
            expect(r.biome1).toBe(BiomeType.SnowyMountains);
            expect(r.biome2).toBe(BiomeType.SnowyPlains);
            expect(r.blend).toBeCloseTo(0.5);
        });
        it('should blend SnowyMountains <-> RockyMountains at threshold -0.5', () => {
            const r = getBiomeBlend(-0.5);
            expect(r.biome1).toBe(BiomeType.RockyMountains);
            expect(r.biome2).toBe(BiomeType.SnowyMountains);
            expect(r.blend).toBeCloseTo(0.5);
        });
    });
    describe('getBiomeCloudCoverage', () => {
        it('should be highest for SnowyMountains', () => {
            expect(getBiomeCloudCoverage(BiomeType.SnowyMountains)).toBe(1.2);
        });
        it('should be lowest for Desert', () => {
            expect(getBiomeCloudCoverage(BiomeType.Desert)).toBe(0.15);
        });
        it('should return 0.55 for unknown biomes', () => {
            expect(getBiomeCloudCoverage(BiomeType.None)).toBe(0.55);
        });
    });
});
