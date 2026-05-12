import { describe, it, expect } from 'vitest';
import { WorldState } from '../../server/src/world_state.js';
function makeState(edits = []) {
    return new WorldState({
        id: 'test-id',
        name: 'test',
        seed: 42,
        createdAt: 1000,
        lastModifiedAt: 1000,
        sunAngle: 1,
        edits,
        players: new Map(),
        version: 1,
    });
}
describe('WorldState', () => {
    describe('applyEdit', () => {
        it('should accept a valid place edit', () => {
            const ws = makeState();
            const result = ws.applyEdit({ kind: 'place', x: 10, y: 20, z: 30, blockType: 3 });
            expect(result).not.toBeNull();
            expect(result.kind).toBe('place');
            expect(ws.edits).toHaveLength(1);
        });
        it('should accept a valid break edit', () => {
            const ws = makeState();
            const result = ws.applyEdit({ kind: 'break', x: 10, y: 20, z: 30, blockType: 0 });
            expect(result).not.toBeNull();
            expect(ws.edits).toHaveLength(1);
        });
        it('should reject edits with non-integer coordinates', () => {
            const ws = makeState();
            expect(ws.applyEdit({ kind: 'place', x: 1.5, y: 0, z: 0, blockType: 3 })).toBeNull();
            expect(ws.applyEdit({ kind: 'place', x: 0, y: 1.5, z: 0, blockType: 3 })).toBeNull();
            expect(ws.applyEdit({ kind: 'place', x: 0, y: 0, z: 1.5, blockType: 3 })).toBeNull();
            expect(ws.edits).toHaveLength(0);
        });
        it('should reject invalid kind', () => {
            const ws = makeState();
            expect(ws.applyEdit({ kind: 'invalid', x: 0, y: 0, z: 0, blockType: 0 })).toBeNull();
            expect(ws.edits).toHaveLength(0);
        });
        it('should reject place with blockType 0', () => {
            const ws = makeState();
            expect(ws.applyEdit({ kind: 'place', x: 0, y: 0, z: 0, blockType: 0 })).toBeNull();
            expect(ws.edits).toHaveLength(0);
        });
        it('should reject place with blockType >= BLOCK_TYPE_MAX', () => {
            const ws = makeState();
            expect(ws.applyEdit({ kind: 'place', x: 0, y: 0, z: 0, blockType: 25 })).toBeNull();
            expect(ws.edits).toHaveLength(0);
        });
        it('should fill default fx/fy/fz on place', () => {
            const ws = makeState();
            const result = ws.applyEdit({ kind: 'place', x: 5, y: 5, z: 5, blockType: 1 });
            expect(result.fx).toBe(0);
            expect(result.fy).toBe(0);
            expect(result.fz).toBe(0);
        });
        it('should keep fx/fy/fz when provided', () => {
            const ws = makeState();
            const result = ws.applyEdit({ kind: 'place', x: 5, y: 5, z: 5, blockType: 1, fx: 0, fy: 1, fz: 0 });
            expect(result.fx).toBe(0);
            expect(result.fy).toBe(1);
            expect(result.fz).toBe(0);
        });
    });
    describe('dedup', () => {
        it('should dedup place superseding prior place at same cell', () => {
            const ws = makeState();
            ws.applyEdit({ kind: 'place', x: 0, y: 0, z: 0, blockType: 1 });
            ws.applyEdit({ kind: 'place', x: 0, y: 0, z: 0, blockType: 2 });
            expect(ws.edits).toHaveLength(1);
            expect(ws.edits[0].blockType).toBe(2);
        });
        it('should dedup break superseding prior break at same cell', () => {
            const ws = makeState();
            ws.applyEdit({ kind: 'break', x: 0, y: 0, z: 0, blockType: 0 });
            ws.applyEdit({ kind: 'break', x: 0, y: 0, z: 0, blockType: 0 });
            expect(ws.edits).toHaveLength(1);
        });
        it('should keep both break then place at same cell', () => {
            const ws = makeState();
            ws.applyEdit({ kind: 'break', x: 0, y: 0, z: 0, blockType: 0 });
            ws.applyEdit({ kind: 'place', x: 0, y: 0, z: 0, blockType: 3 });
            expect(ws.edits).toHaveLength(2);
            expect(ws.edits[0].kind).toBe('break');
            expect(ws.edits[1].kind).toBe('place');
        });
        it('should dedup place then break at same cell (break supersedes)', () => {
            const ws = makeState();
            ws.applyEdit({ kind: 'place', x: 0, y: 0, z: 0, blockType: 1 });
            ws.applyEdit({ kind: 'break', x: 0, y: 0, z: 0, blockType: 0 });
            expect(ws.edits).toHaveLength(1);
            expect(ws.edits[0].kind).toBe('break');
        });
        it('should dedup at same resolved cell using fx/fy/fz', () => {
            const ws = makeState();
            ws.applyEdit({ kind: 'place', x: 5, y: 5, z: 5, blockType: 1, fx: 0, fy: 1, fz: 0 });
            ws.applyEdit({ kind: 'place', x: 5, y: 6, z: 5, blockType: 2 });
            expect(ws.edits).toHaveLength(1);
            expect(ws.edits[0].blockType).toBe(2);
        });
    });
    describe('setPlayer / getPlayerPosition', () => {
        it('should store and retrieve player position', () => {
            const ws = makeState();
            ws.setPlayer('player1', { name: 'Alice', x: 10, y: 20, z: 30, yaw: 45, pitch: 0, lastSeen: 500 });
            const pos = ws.getPlayerPosition('player1');
            expect(pos).not.toBeNull();
            expect(pos.x).toBe(10);
            expect(pos.y).toBe(20);
            expect(pos.z).toBe(30);
        });
        it('should return null for unknown player', () => {
            const ws = makeState();
            expect(ws.getPlayerPosition('unknown')).toBeNull();
        });
    });
    describe('toJSON / fromJSON', () => {
        it('should round-trip an empty world', () => {
            const ws = makeState();
            const json = ws.toJSON();
            const restored = WorldState.fromJSON(json);
            expect(restored.id).toBe(ws.id);
            expect(restored.name).toBe(ws.name);
            expect(restored.seed).toBe(ws.seed);
            expect(restored.edits).toEqual(ws.edits);
            expect(restored.players.size).toBe(0);
        });
        it('should round-trip edits and players', () => {
            const ws = makeState();
            ws.applyEdit({ kind: 'place', x: 1, y: 2, z: 3, blockType: 5 });
            ws.applyEdit({ kind: 'break', x: 4, y: 5, z: 6, blockType: 0 });
            ws.setPlayer('p1', { name: 'Bob', x: 1, y: 2, z: 3, yaw: 0, pitch: 0, lastSeen: 100 });
            const json = ws.toJSON();
            const restored = WorldState.fromJSON(json);
            expect(restored.edits).toHaveLength(2);
            expect(restored.players.size).toBe(1);
            expect(restored.players.get('p1').name).toBe('Bob');
        });
        it('should handle missing optional fields in JSON', () => {
            const restored = WorldState.fromJSON({});
            expect(restored.edits).toEqual([]);
            expect(restored.players.size).toBe(0);
            expect(restored.version).toBe(1);
        });
    });
    describe('toSummary', () => {
        it('should produce correct summary', () => {
            const ws = makeState();
            ws.applyEdit({ kind: 'place', x: 0, y: 0, z: 0, blockType: 1 });
            const summary = ws.toSummary(3);
            expect(summary.id).toBe('test-id');
            expect(summary.name).toBe('test');
            expect(summary.seed).toBe(42);
            expect(summary.playerCount).toBe(3);
            expect(summary.editCount).toBe(1);
        });
    });
});
