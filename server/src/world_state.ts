import type { BlockEdit } from '../../shared/net_protocol.ts';
import { BLOCK_TYPE_MAX } from '../../shared/net_protocol.ts';

/**
 * Authoritative block-edit log. The server doesn't store full chunks — it only
 * tracks edits on top of the seeded terrain that every client regenerates
 * locally from the same seed.
 *
 * Edits are keyed by `"x,y,z"` so the latest edit per cell wins. A 'break' that
 * targets a never-edited cell is still recorded — the client applies it against
 * the procedurally generated block at that position.
 */
export class WorldState {
  readonly seed: number;
  private readonly _edits = new Map<string, BlockEdit>();

  constructor(seed: number) {
    this.seed = seed;
  }

  /** All edits in insertion order (suitable for replay to a new client). */
  get edits(): BlockEdit[] {
    return Array.from(this._edits.values());
  }

  /**
   * Validates and records an edit. Returns the canonical edit on success or
   * `null` if rejected.
   */
  applyEdit(edit: BlockEdit): BlockEdit | null {
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
    const key = `${edit.x},${edit.y},${edit.z}`;
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
    this._edits.set(key, canonical);
    return canonical;
  }
}
