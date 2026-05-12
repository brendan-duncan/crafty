import { describe, it, expect } from 'vitest';
import { Vec3 } from '../../src/math/vec3.js';
import { World } from '../../src/block/world.js';
import { BlockType } from '../../src/block/block_type.js';
describe('World', () => {
    describe('normalizeChunkPosition', () => {
        it('should return (0,0,0) for origin', () => {
            expect(World.normalizeChunkPosition(0, 0, 0)).toEqual([0, 0, 0]);
        });
        it('should return (1,0,0) for x=16', () => {
            expect(World.normalizeChunkPosition(16, 0, 0)).toEqual([1, 0, 0]);
        });
        it('should return (-1,0,0) for x=-1', () => {
            expect(World.normalizeChunkPosition(-1, 0, 0)).toEqual([-1, 0, 0]);
        });
        it('should return (0,1,0) for y=16', () => {
            expect(World.normalizeChunkPosition(0, 16, 0)).toEqual([0, 1, 0]);
        });
        it('should truncate negative values correctly', () => {
            expect(World.normalizeChunkPosition(-16, 0, 0)).toEqual([-1, 0, 0]);
            expect(World.normalizeChunkPosition(-17, 0, 0)).toEqual([-2, 0, 0]);
            expect(World.normalizeChunkPosition(-15, 0, 0)).toEqual([-1, 0, 0]);
        });
    });
    describe('getBlockByRay', () => {
        // Use direction vectors with no zero components to avoid NaN in the
        // voxel traversal (1.0/0.0 = Infinity causes broken comparisons).
        const dirX = new Vec3(1, 0.01, 0.01).normalize();
        const dirY = new Vec3(0.01, -1, 0.01).normalize();
        it('should hit a block placed directly in front', () => {
            const world = new World(0);
            world.setBlockType(5, 5, 5, BlockType.STONE);
            const result = world.getBlockByRay(new Vec3(1, 5, 5), dirX, 20);
            expect(result).not.toBeNull();
            expect(result.blockType).toBe(BlockType.STONE);
            expect(result.position.x).toBe(5);
            expect(result.position.y).toBe(5);
            expect(result.position.z).toBe(5);
        });
        it('should pass through water and hit solid behind it', () => {
            const world = new World(0);
            world.setBlockType(5, 5, 5, BlockType.WATER);
            world.setBlockType(7, 5, 5, BlockType.STONE);
            const result = world.getBlockByRay(new Vec3(1, 5, 5), dirX, 20);
            expect(result).not.toBeNull();
            expect(result.blockType).toBe(BlockType.STONE);
            expect(result.position.x).toBe(7);
        });
        it('should return null when no block is hit', () => {
            const world = new World(0);
            const result = world.getBlockByRay(new Vec3(0, 0, 0), dirX, 10);
            expect(result).toBeNull();
        });
        it('should return correct face normal for +X entry', () => {
            const world = new World(0);
            world.setBlockType(5, 5, 5, BlockType.STONE);
            const result = world.getBlockByRay(new Vec3(1, 5, 5), dirX, 20);
            expect(result).not.toBeNull();
            // Coming from -X: hits the -X face, normal points -X
            expect(result.face.x).toBe(-1);
            expect(result.face.y).toBeCloseTo(0);
            expect(result.face.z).toBeCloseTo(0);
        });
        it('should hit from above with correct face normal', () => {
            const world = new World(0);
            world.setBlockType(5, 5, 5, BlockType.STONE);
            const result = world.getBlockByRay(new Vec3(5, 10, 5), dirY, 20);
            expect(result).not.toBeNull();
            // Coming from +Y: hits the +Y (top) face, normal points +Y
            expect(result.face.y).toBe(1);
        });
        it('should keep the chunk reference on hit', () => {
            const world = new World(0);
            world.setBlockType(5, 5, 5, BlockType.STONE);
            const result = world.getBlockByRay(new Vec3(1, 5, 5), dirX, 20);
            expect(result.chunk).toBeDefined();
            expect(result.chunk.globalPosition.x).toBe(0);
        });
        it('should set relativePosition within chunk', () => {
            const world = new World(0);
            world.setBlockType(5, 5, 5, BlockType.STONE);
            const result = world.getBlockByRay(new Vec3(1, 5, 5), dirX, 20);
            expect(result.relativePosition.x).toBe(5);
            expect(result.relativePosition.y).toBe(5);
            expect(result.relativePosition.z).toBe(5);
        });
        it('should return null when ray goes through air below world', () => {
            const world = new World(0);
            const result = world.getBlockByRay(new Vec3(0, -10, 0), new Vec3(0.01, -1, 0.01), 10);
            expect(result).toBeNull();
        });
    });
    describe('getTopBlockY', () => {
        it('should return 0 for empty world', () => {
            const world = new World(0);
            expect(world.getTopBlockY(0, 0, 100)).toBe(0);
        });
        it('should find block in default chunk', () => {
            const world = new World(0);
            world.setBlockType(5, 5, 5, BlockType.STONE);
            expect(world.getTopBlockY(5, 5, 100)).toBe(6);
        });
    });
    describe('getChunk / chunkExists', () => {
        it('should return undefined for unloaded world', () => {
            const world = new World(0);
            expect(world.getChunk(0, 0, 0)).toBeUndefined();
            expect(world.chunkExists(0, 0, 0)).toBe(false);
        });
        it('should find chunk after setting a block', () => {
            const world = new World(0);
            world.setBlockType(0, 0, 0, BlockType.STONE);
            expect(world.chunkExists(0, 0, 0)).toBe(true);
        });
    });
    describe('setBlockType', () => {
        it('should set and retrieve a block', () => {
            const world = new World(0);
            world.setBlockType(3, 4, 5, BlockType.DIRT);
            expect(world.getBlockType(3, 4, 5)).toBe(BlockType.DIRT);
        });
        it('should return NONE for unset positions', () => {
            const world = new World(0);
            expect(world.getBlockType(100, 100, 100)).toBe(BlockType.NONE);
        });
    });
    describe('addBlock', () => {
        it('should place a block adjacent to an existing block', () => {
            const world = new World(0);
            world.setBlockType(5, 5, 5, BlockType.STONE);
            const result = world.addBlock(5, 5, 5, 1, 0, 0, BlockType.DIRT);
            expect(result).toBe(true);
            expect(world.getBlockType(6, 5, 5)).toBe(BlockType.DIRT);
        });
        it('should not place a block in occupied space', () => {
            const world = new World(0);
            world.setBlockType(5, 5, 5, BlockType.STONE);
            world.setBlockType(6, 5, 5, BlockType.STONE);
            const result = world.addBlock(5, 5, 5, 1, 0, 0, BlockType.DIRT);
            expect(result).toBe(false);
            expect(world.getBlockType(6, 5, 5)).toBe(BlockType.STONE);
        });
        it('should refuse NONE block type', () => {
            const world = new World(0);
            world.setBlockType(5, 5, 5, BlockType.STONE);
            const result = world.addBlock(5, 5, 5, 1, 0, 0, BlockType.NONE);
            expect(result).toBe(false);
        });
    });
    describe('mineBlock', () => {
        it('should set block to air', () => {
            const world = new World(0);
            world.setBlockType(5, 5, 5, BlockType.STONE);
            world.mineBlock(5, 5, 5);
            expect(world.getBlockType(5, 5, 5)).toBe(BlockType.NONE);
        });
    });
});
