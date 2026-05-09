import { promises as fs } from 'node:fs';
import path from 'node:path';
import { WorldState, type SavedWorldJson } from './world_state.ts';

/**
 * Disk-backed store for `WorldState` records.
 *
 * Each world is one JSON file at `<dataDir>/<worldId>.json`. Saves are atomic
 * (write to `.tmp` then rename) so a crash mid-write can never leave a
 * half-written file. The repository is stateless beyond the data directory
 * path — `WorldRoom` (in memory) holds the live state.
 */
export class WorldRepository
{
  private readonly _dataDir: string;
  private _initialized = false;

  constructor(dataDir: string)
  {
    this._dataDir = dataDir;
  }

  /** Ensures the data directory exists. Safe to call repeatedly. */
  async init(): Promise<void>
  {
    if (this._initialized) {
      return;
    }
    await fs.mkdir(this._dataDir, { recursive: true });
    this._initialized = true;
  }

  /** Returns every world found on disk, in arbitrary order. */
  async list(): Promise<WorldState[]>
  {
    await this.init();
    const entries = await fs.readdir(this._dataDir);
    const out: WorldState[] = [];
    for (const name of entries) {
      if (!name.endsWith('.json')) {
        continue;
      }
      const id = name.slice(0, -'.json'.length);
      try {
        const w = await this._readFile(id);
        if (w !== null) {
          out.push(w);
        }
      } catch (err) {
        console.warn(`[crafty-server] skip ${name}: ${(err as Error).message}`);
      }
    }
    return out;
  }

  async load(id: string): Promise<WorldState | null>
  {
    await this.init();
    return this._readFile(id);
  }

  async save(state: WorldState): Promise<void>
  {
    await this.init();
    const target = this._pathFor(state.id);
    const tmp = `${target}.tmp`;
    const json = JSON.stringify(state.toJSON());
    await fs.writeFile(tmp, json, 'utf8');
    await fs.rename(tmp, target);
  }

  /** Creates and immediately persists a new empty world. */
  async create(name: string, seed: number): Promise<WorldState>
  {
    await this.init();
    const state = WorldState.createNew(name, seed);
    await this.save(state);
    return state;
  }

  async delete(id: string): Promise<void>
  {
    await this.init();
    try {
      await fs.unlink(this._pathFor(id));
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw err;
      }
    }
  }

  private async _readFile(id: string): Promise<WorldState | null>
  {
    try {
      const raw = await fs.readFile(this._pathFor(id), 'utf8');
      const json = JSON.parse(raw) as SavedWorldJson;
      return WorldState.fromJSON(json);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw err;
    }
  }

  private _pathFor(id: string): string
  {
    // Worlds are addressed by UUID — sanitize defensively in case of legacy
    // ids with separators.
    const safe = id.replace(/[^a-zA-Z0-9_-]/g, '_');
    return path.join(this._dataDir, `${safe}.json`);
  }
}
