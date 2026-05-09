import type { BlockEdit, SavedPosition, WorldSummary } from '../../shared/net_protocol.ts';
import { BLOCK_TYPE_MAX } from '../../shared/net_protocol.ts';

export const SERVER_FORMAT_VERSION = 1;

/** Per-player saved state, keyed by the client-provided `playerKey`. */
export interface SavedPlayer {
  name: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  lastSeen: number;
}

/**
 * On-disk JSON shape for a saved world. Matches `server/data/<id>.json`.
 */
export interface SavedWorldJson {
  version: number;
  id: string;
  name: string;
  seed: number;
  createdAt: number;
  lastModifiedAt: number;
  sunAngle: number;
  edits: BlockEdit[];
  players: Record<string, SavedPlayer>;
}

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
export class WorldState
{
  readonly id: string;
  name: string;
  readonly seed: number;
  readonly createdAt: number;
  lastModifiedAt: number;
  sunAngle: number;
  edits: BlockEdit[];
  players: Map<string, SavedPlayer>;
  version: number;

  constructor(init: {
    id: string;
    name: string;
    seed: number;
    createdAt: number;
    lastModifiedAt: number;
    sunAngle: number;
    edits: BlockEdit[];
    players: Map<string, SavedPlayer>;
    version: number;
  })
  {
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
  static createNew(name: string, seed: number): WorldState
  {
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
  applyEdit(edit: BlockEdit): BlockEdit | null
  {
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
    const canonical: BlockEdit =
      edit.kind === 'place'
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

  setPlayer(playerKey: string, snapshot: SavedPlayer): void
  {
    this.players.set(playerKey, snapshot);
    this.lastModifiedAt = Date.now();
  }

  getPlayerPosition(playerKey: string): SavedPosition | null
  {
    const p = this.players.get(playerKey);
    if (p === undefined) {
      return null;
    }
    return { x: p.x, y: p.y, z: p.z, yaw: p.yaw, pitch: p.pitch };
  }

  toJSON(): SavedWorldJson
  {
    const players: Record<string, SavedPlayer> = {};
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

  static fromJSON(json: SavedWorldJson): WorldState
  {
    const players = new Map<string, SavedPlayer>();
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
  toSummary(playerCount: number): WorldSummary
  {
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

function _placedCoords(edit: BlockEdit): [number, number, number]
{
  if (edit.kind === 'place') {
    return [edit.x + (edit.fx ?? 0), edit.y + (edit.fy ?? 0), edit.z + (edit.fz ?? 0)];
  }
  return [edit.x, edit.y, edit.z];
}

function _supersedesPrior(current: BlockEdit, prior: BlockEdit): boolean
{
  return !(prior.kind === 'break' && current.kind === 'place');
}

function _randomId(): string
{
  // Node 19+ has crypto.randomUUID() at the top level; fall back to a
  // timestamp+random hash for older runtimes.
  const c: { randomUUID?: () => string } = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto ?? {};
  if (typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
