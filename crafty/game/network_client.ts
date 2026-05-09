import {
  PROTOCOL_VERSION,
  type BlockEdit,
  type C2S,
  type PlayerSnapshot,
  type S2C,
  type SavedPosition,
  type WorldSummary,
} from '../../shared/net_protocol.ts';

export interface ConnectResult {
  playerId: number;
  worldId: string;
  seed: number;
  sunAngle: number;
  lastPosition: SavedPosition | null;
  edits: BlockEdit[];
  players: PlayerSnapshot[];
}

export interface NetworkCallbacks {
  onPlayerJoin?: (playerId: number, name: string) => void;
  onPlayerLeave?: (playerId: number) => void;
  onPlayerTransform?: (playerId: number, x: number, y: number, z: number, yaw: number, pitch: number) => void;
  onBlockEdit?: (edit: BlockEdit) => void;
  onWorldList?: (worlds: WorldSummary[]) => void;
}

const TRANSFORM_SEND_HZ = 20;
const TRANSFORM_SEND_INTERVAL_MS = 1000 / TRANSFORM_SEND_HZ;

interface PendingResolver<T> {
  resolve: (value: T) => void;
  reject: (err: Error) => void;
}

/**
 * Two-phase WebSocket client for the Crafty multiplayer server.
 *
 *   1. Lobby phase: `connect()` opens the socket, sends `hello`, and resolves
 *      with the initial world list. `createWorld()` and `joinWorld()` operate
 *      while still in the lobby.
 *   2. In-game phase: starts when `joinWorld()` resolves. Use `sendTransform`,
 *      `sendBlockPlace`, `sendBlockBreak` and the callbacks for live state.
 *
 * Subsequent `world_list` pushes from the server flow through `onWorldList`.
 */
export class NetworkClient
{
  private _ws: WebSocket | null = null;
  private _callbacks: NetworkCallbacks = {};
  private _lastTransformSend = 0;
  private _pendingTransform: { x: number; y: number; z: number; yaw: number; pitch: number } | null = null;
  private _connected = false;
  private _inGame = false;

  // One-shot pending replies (lobby phase). Keyed by message kind.
  private _pendingHello: PendingResolver<WorldSummary[]> | null = null;
  private _pendingCreate: PendingResolver<WorldSummary> | null = null;
  private _pendingJoin: PendingResolver<ConnectResult> | null = null;

  get connected(): boolean
  {
    return this._connected;
  }

  setCallbacks(cb: NetworkCallbacks): void
  {
    this._callbacks = cb;
  }

  /**
   * Open the connection, send `hello`, and resolve with the initial world list.
   * Throws if the socket closes before `world_list` arrives.
   */
  connect(url: string, playerKey: string, name: string): Promise<WorldSummary[]>
  {
    return new Promise<WorldSummary[]>((resolve, reject) => {
      const ws = new WebSocket(url);
      this._ws = ws;
      this._pendingHello = { resolve, reject };

      ws.addEventListener('open', () => {
        this._send({ t: 'hello', playerKey, name, version: PROTOCOL_VERSION });
      });

      ws.addEventListener('message', (ev) => {
        let msg: S2C;
        try {
          msg = JSON.parse(typeof ev.data === 'string' ? ev.data : '') as S2C;
        } catch {
          return;
        }
        this._dispatch(msg);
      });

      ws.addEventListener('error', () => {
        this._failAllPending(new Error('WebSocket error'));
      });

      ws.addEventListener('close', () => {
        this._connected = false;
        this._inGame = false;
        this._failAllPending(new Error('WebSocket closed'));
      });
    });
  }

  /** Create a new world on the server and resolve with its summary. Lobby only. */
  createWorld(name: string, seed: number): Promise<WorldSummary>
  {
    if (!this._connected || this._inGame) {
      return Promise.reject(new Error('createWorld requires lobby phase'));
    }
    return new Promise<WorldSummary>((resolve, reject) => {
      this._pendingCreate = { resolve, reject };
      this._send({ t: 'create_world', name, seed });
    });
  }

  /** Join an existing world. Resolves with the welcome payload; transitions to in-game. */
  joinWorld(worldId: string): Promise<ConnectResult>
  {
    if (!this._connected || this._inGame) {
      return Promise.reject(new Error('joinWorld requires lobby phase'));
    }
    return new Promise<ConnectResult>((resolve, reject) => {
      this._pendingJoin = { resolve, reject };
      this._send({ t: 'join_world', worldId });
    });
  }

  /** Throttled transform sender. Call every frame; coalesced to ~20 Hz. In-game only. */
  sendTransform(x: number, y: number, z: number, yaw: number, pitch: number): void
  {
    if (!this._inGame) {
      return;
    }
    this._pendingTransform = { x, y, z, yaw, pitch };
    const now = performance.now();
    if (now - this._lastTransformSend < TRANSFORM_SEND_INTERVAL_MS) {
      return;
    }
    this._lastTransformSend = now;
    const t = this._pendingTransform;
    this._pendingTransform = null;
    this._send({ t: 'transform', x: t.x, y: t.y, z: t.z, yaw: t.yaw, pitch: t.pitch });
  }

  sendBlockPlace(x: number, y: number, z: number, fx: number, fy: number, fz: number, blockType: number): void
  {
    if (!this._inGame) {
      return;
    }
    this._send({ t: 'block_place', x, y, z, fx, fy, fz, blockType });
  }

  sendBlockBreak(x: number, y: number, z: number): void
  {
    if (!this._inGame) {
      return;
    }
    this._send({ t: 'block_break', x, y, z });
  }

  private _dispatch(msg: S2C): void
  {
    switch (msg.t) {
      case 'world_list':
        if (this._pendingHello !== null) {
          this._connected = true;
          this._pendingHello.resolve(msg.worlds);
          this._pendingHello = null;
          return;
        }
        this._callbacks.onWorldList?.(msg.worlds);
        return;
      case 'world_created':
        if (this._pendingCreate !== null) {
          this._pendingCreate.resolve(msg.world);
          this._pendingCreate = null;
        }
        return;
      case 'welcome':
        if (this._pendingJoin !== null) {
          this._inGame = true;
          this._pendingJoin.resolve({
            playerId: msg.playerId,
            worldId: msg.worldId,
            seed: msg.seed,
            sunAngle: msg.sunAngle,
            lastPosition: msg.lastPosition,
            edits: msg.edits,
            players: msg.players,
          });
          this._pendingJoin = null;
        }
        return;
      case 'error': {
        const err = new Error(`${msg.code}: ${msg.message}`);
        // Surface the error on whichever request is pending.
        if (this._pendingCreate !== null) { this._pendingCreate.reject(err); this._pendingCreate = null; return; }
        if (this._pendingJoin !== null)   { this._pendingJoin.reject(err);   this._pendingJoin = null;   return; }
        if (this._pendingHello !== null)  { this._pendingHello.reject(err);  this._pendingHello = null;  return; }
        console.warn('[crafty] server error:', err.message);
        return;
      }
      case 'player_join':
        this._callbacks.onPlayerJoin?.(msg.playerId, msg.name);
        return;
      case 'player_leave':
        this._callbacks.onPlayerLeave?.(msg.playerId);
        return;
      case 'player_transform':
        this._callbacks.onPlayerTransform?.(msg.playerId, msg.x, msg.y, msg.z, msg.yaw, msg.pitch);
        return;
      case 'block_edit':
        this._callbacks.onBlockEdit?.(msg.edit);
        return;
    }
  }

  private _failAllPending(err: Error): void
  {
    if (this._pendingHello !== null) { this._pendingHello.reject(err); this._pendingHello = null; }
    if (this._pendingCreate !== null) { this._pendingCreate.reject(err); this._pendingCreate = null; }
    if (this._pendingJoin !== null) { this._pendingJoin.reject(err); this._pendingJoin = null; }
  }

  private _send(msg: C2S): void
  {
    if (this._ws === null || this._ws.readyState !== WebSocket.OPEN) {
      return;
    }
    this._ws.send(JSON.stringify(msg));
  }
}
