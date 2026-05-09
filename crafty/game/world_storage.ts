import type { BlockEdit } from '../../shared/net_protocol.js';

/**
 * Bump when SavedWorld layout changes in a way that needs migration.
 * 1 = current. Records loaded with `version < CURRENT_FORMAT_VERSION` (or
 * missing entirely) are upgraded by main.ts on load.
 */
export const CURRENT_FORMAT_VERSION = 1;

/** Persistent record for a single local world. */
export interface SavedWorld
{
  id: string;
  name: string;
  seed: number;
  createdAt: number;
  lastPlayedAt: number;
  edits: BlockEdit[];
  player: { x: number; y: number; z: number; yaw: number; pitch: number };
  sunAngle: number;
  /** JPEG thumbnail (~160×90), updated less frequently than the rest of the record. */
  screenshot?: Blob;
  /** Schema version; missing means pre-versioning (treat as 0). */
  version?: number;
}

const DB_NAME = 'crafty';
const DB_VERSION = 1;
const STORE = 'worlds';

/**
 * IndexedDB-backed store for saved local worlds. Auto-save in main.ts calls
 * `save()` with the full record on a 5s throttle; the launcher uses `list()`
 * and `delete()` for the saved-world UI.
 *
 * Single object store keyed by `id`. v1 reads full records on `list()` (sorted
 * client-side by `lastPlayedAt`); fine for ≤ tens of worlds. Splitting metadata
 * and edits into separate stores would only matter if the list view became
 * slow.
 */
export class WorldStorage
{
  private readonly _db: IDBDatabase;

  private constructor(db: IDBDatabase)
  {
    this._db = db;
  }

  static open(): Promise<WorldStorage>
  {
    return new Promise<WorldStorage>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(new WorldStorage(req.result));
      req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
    });
  }

  list(): Promise<SavedWorld[]>
  {
    return this._withStore('readonly', (store) => {
      return new Promise<SavedWorld[]>((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => {
          const all = (req.result ?? []) as SavedWorld[];
          all.sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);
          resolve(all);
        };
        req.onerror = () => reject(req.error ?? new Error('IndexedDB list failed'));
      });
    });
  }

  load(id: string): Promise<SavedWorld | null>
  {
    return this._withStore('readonly', (store) => {
      return new Promise<SavedWorld | null>((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve((req.result as SavedWorld | undefined) ?? null);
        req.onerror = () => reject(req.error ?? new Error('IndexedDB load failed'));
      });
    });
  }

  save(world: SavedWorld): Promise<void>
  {
    return this._withStore('readwrite', (store) => {
      return new Promise<void>((resolve, reject) => {
        // Pass the live object — IDB's structured clone happens off-thread once
        // the put is enqueued, so this is cheap on the main thread.
        const req = store.put(world);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error ?? new Error('IndexedDB save failed'));
      });
    });
  }

  delete(id: string): Promise<void>
  {
    return this._withStore('readwrite', (store) => {
      return new Promise<void>((resolve, reject) => {
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error ?? new Error('IndexedDB delete failed'));
      });
    });
  }

  private _withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => Promise<T>): Promise<T>
  {
    const tx = this._db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    return fn(store);
  }
}

/** Build a fresh `SavedWorld` ready to be passed to `WorldStorage.save`. */
export function createSavedWorld(name: string, seed: number): SavedWorld
{
  const now = Date.now();
  return {
    id: _randomId(),
    name,
    seed,
    createdAt: now,
    lastPlayedAt: now,
    edits: [],
    player: { x: 64, y: 80, z: 64, yaw: 0, pitch: 0 },
    sunAngle: Math.PI * 0.3,
    version: CURRENT_FORMAT_VERSION,
  };
}

function _randomId(): string
{
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for older runtimes — the browsers we target all ship randomUUID.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
