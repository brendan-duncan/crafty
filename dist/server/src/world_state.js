import { BLOCK_TYPE_MAX } from '../../shared/net_protocol.js';
export const SERVER_FORMAT_VERSION = 1;
/**
 * Authoritative state for one server world. Holds the seed, the ordered edit
 * log, the per-player saved state, and the sun angle. Serializes to / from a
 * single JSON file via {@link toJSON}/{@link fromJSON}.
 *
 * The edit log is an *ordered list*, not a per-cell map: `break → place` at
 * the same cell must replay in order so the underlying terrain is cleared
 * before the new block is placed (otherwise the place silently fails because
 * the seed-regenerated cell is still occupied). {@link applyEdit} de-duplicates
 * only when the new edit fully supersedes an earlier one — see
 * {@link _supersedesPrior}. Mirrors the client-side fix in `crafty/main.ts`.
 */
export class WorldState {
    id;
    name;
    seed;
    createdAt;
    lastModifiedAt;
    sunAngle;
    edits;
    players;
    version;
    constructor(init) {
        this.id = init.id;
        this.name = init.name;
        this.seed = init.seed;
        this.createdAt = init.createdAt;
        this.lastModifiedAt = init.lastModifiedAt;
        this.sunAngle = init.sunAngle;
        this.edits = init.edits;
        this.players = init.players;
        this.version = init.version;
    }
    /** Build a new empty world. The repository assigns the id and persists it. */
    static createNew(name, seed) {
        const now = Date.now();
        return new WorldState({
            id: _randomId(),
            name,
            seed,
            createdAt: now,
            lastModifiedAt: now,
            sunAngle: Math.PI * 0.3,
            edits: [],
            players: new Map(),
            version: SERVER_FORMAT_VERSION,
        });
    }
    /**
     * Validates and appends an edit. Returns the canonical edit on success or
     * `null` if rejected.
     */
    applyEdit(edit) {
        if (!Number.isInteger(edit.x) || !Number.isInteger(edit.y) || !Number.isInteger(edit.z)) {
            return null;
        }
        if (edit.kind !== 'place' && edit.kind !== 'break') {
            return null;
        }
        if (edit.kind === 'place') {
            if (!Number.isInteger(edit.blockType) || edit.blockType <= 0 || edit.blockType >= BLOCK_TYPE_MAX) {
                return null;
            }
        }
        const canonical = edit.kind === 'place'
            ? {
                kind: 'place',
                x: edit.x,
                y: edit.y,
                z: edit.z,
                blockType: edit.blockType,
                fx: edit.fx ?? 0,
                fy: edit.fy ?? 0,
                fz: edit.fz ?? 0,
            }
            : { kind: 'break', x: edit.x, y: edit.y, z: edit.z, blockType: 0 };
        // Dedup: drop the most recent prior edit at the same resolved cell only
        // when the new one supersedes it. `break → place` keeps both (the break
        // is what clears the original terrain block on replay).
        const [px, py, pz] = _placedCoords(canonical);
        for (let i = this.edits.length - 1; i >= 0; i--) {
            const [ex, ey, ez] = _placedCoords(this.edits[i]);
            if (ex === px && ey === py && ez === pz) {
                if (_supersedesPrior(canonical, this.edits[i])) {
                    this.edits.splice(i, 1);
                }
                break;
            }
        }
        this.edits.push(canonical);
        this.lastModifiedAt = Date.now();
        return canonical;
    }
    setPlayer(playerKey, snapshot) {
        this.players.set(playerKey, snapshot);
        this.lastModifiedAt = Date.now();
    }
    getPlayerPosition(playerKey) {
        const p = this.players.get(playerKey);
        if (p === undefined) {
            return null;
        }
        return { x: p.x, y: p.y, z: p.z, yaw: p.yaw, pitch: p.pitch };
    }
    toJSON() {
        const players = {};
        for (const [k, v] of this.players) {
            players[k] = v;
        }
        return {
            version: this.version,
            id: this.id,
            name: this.name,
            seed: this.seed,
            createdAt: this.createdAt,
            lastModifiedAt: this.lastModifiedAt,
            sunAngle: this.sunAngle,
            edits: this.edits,
            players,
        };
    }
    static fromJSON(json) {
        const players = new Map();
        for (const [k, v] of Object.entries(json.players ?? {})) {
            players.set(k, v);
        }
        return new WorldState({
            id: json.id,
            name: json.name,
            seed: json.seed,
            createdAt: json.createdAt,
            lastModifiedAt: json.lastModifiedAt,
            sunAngle: json.sunAngle ?? Math.PI * 0.3,
            edits: json.edits ?? [],
            players,
            version: json.version ?? SERVER_FORMAT_VERSION,
        });
    }
    /** Lightweight metadata for the lobby world list. */
    toSummary(playerCount) {
        return {
            id: this.id,
            name: this.name,
            seed: this.seed,
            createdAt: this.createdAt,
            lastModifiedAt: this.lastModifiedAt,
            playerCount,
            editCount: this.edits.length,
        };
    }
}
function _placedCoords(edit) {
    if (edit.kind === 'place') {
        return [edit.x + (edit.fx ?? 0), edit.y + (edit.fy ?? 0), edit.z + (edit.fz ?? 0)];
    }
    return [edit.x, edit.y, edit.z];
}
function _supersedesPrior(current, prior) {
    return !(prior.kind === 'break' && current.kind === 'place');
}
function _randomId() {
    // Node 19+ has crypto.randomUUID() at the top level; fall back to a
    // timestamp+random hash for older runtimes.
    const c = globalThis.crypto ?? {};
    if (typeof c.randomUUID === 'function') {
        return c.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
