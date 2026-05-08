import { describe, it, expect } from 'vitest';
import { BlockType, blockMaterialData, blockLightData, MaterialType } from '../../src/block/block_type.js';
describe('BlockType', () => {
    describe('enum values', () => {
        it('should have NONE as first block type', () => {
            expect(BlockType.NONE).toBe(0);
        });
        it('should have unique values for all block types', () => {
            const values = Object.values(BlockType).filter(v => typeof v === 'number');
            const uniqueValues = new Set(values);
            expect(uniqueValues.size).toBe(values.length);
        });
    });
    describe('blockMaterialData', () => {
        it('should have some material data', () => {
            expect(blockMaterialData.length).toBeGreaterThan(0);
        });
        it('should have NONE as non-collidable', () => {
            const none = blockMaterialData.find(m => m.blockType === BlockType.NONE);
            expect(none?.collidable).toBe(0);
        });
        it('should have WATER as water material type', () => {
            const water = blockMaterialData.find(m => m.blockType === BlockType.WATER);
            expect(water?.materialType).toBe(MaterialType.WATER);
        });
        it('should have GLOWSTONE and MAGMA as emissive', () => {
            const glowstone = blockMaterialData.find(m => m.blockType === BlockType.GLOWSTONE);
            const magma = blockMaterialData.find(m => m.blockType === BlockType.MAGMA);
            expect(glowstone?.emitsLight).toBe(1);
            expect(magma?.emitsLight).toBe(1);
        });
        it('should have TORCH as emissive', () => {
            const torch = blockMaterialData.find(m => m.blockType === BlockType.TORCH);
            expect(torch?.emitsLight).toBe(1);
        });
    });
    describe('blockLightData', () => {
        it('should have light data for emissive blocks', () => {
            const emissiveBlocks = blockMaterialData.filter(m => m.emitsLight === 1);
            for (const block of emissiveBlocks) {
                const lightData = blockLightData.find(l => l.blockType === block.blockType);
                expect(lightData).toBeDefined();
            }
        });
        it('should have TORCH with warm color', () => {
            const torch = blockLightData.find(l => l.blockType === BlockType.TORCH);
            expect(torch).toBeDefined();
            expect(torch?.color.x).toBeGreaterThan(0.8); // Warm orangish
        });
        it('should have GLOWSTONE with bright light', () => {
            const glowstone = blockLightData.find(l => l.blockType === BlockType.GLOWSTONE);
            if (glowstone) {
                expect(glowstone.ambientIntensity).toBeGreaterThan(0);
            }
        });
    });
    describe('MaterialType', () => {
        it('should have distinct material types', () => {
            expect(MaterialType.OPAQUE).toBe(0);
            expect(MaterialType.SEMI_TRANSPARENT).toBe(1);
            expect(MaterialType.WATER).toBe(2);
            expect(MaterialType.PROP).toBe(3);
        });
    });
});
