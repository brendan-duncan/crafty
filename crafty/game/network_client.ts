import {
  PROTOCOL_VERSION,
  type BlockEdit,
  type C2S,
  type PlayerSnapshot,
  type S2C,
} from '../../shared/net_protocol.ts';

export interface ConnectResult {
  playerId: number;
  seed: number;
  edits: BlockEdit[];
  players: PlayerSnapshot[];
}

export interface NetworkCallbacks {
  onPlayerJoin?: (playerId: number, name: string) => void;
  onPlayerLeave?: (playerId: number) => void;
  onPlayerTransform?: (playerId: number, x: number, y: number, z: number, yaw: number, pitch: number) => void;
  onBlockEdit?: (edit: BlockEdit) => void;
}

const TRANSFORM_SEND_HZ = 20;
const TRANSFORM_SEND_INTERVAL_MS = 1000 / TRANSFORM_SEND_HZ;

/**
 * WebSocket client for the Crafty multiplayer server. Wraps a single connection,
 * exposes typed send helpers, and delivers incoming events through callbacks.
 *
 * `connect()` resolves once the server has sent the `welcome` reply with the
 * world seed and current state. After that, the caller can register handlers
 * via `setCallbacks()` and start sending transforms / block intents.
 */
export class NetworkClient {
  private _ws: WebSocket | null = null;
  private _callbacks: NetworkCallbacks = {};
  private _lastTransformSend = 0;
  private _pendingTransform: { x: number; y: number; z: number; yaw: number; pitch: number } | null = null;
  private _connected = false;

  get connected(): boolean
  {
    return this._connected;
  }

  setCallbacks(cb: NetworkCallbacks): void
  {
    this._callbacks = cb;
  }

  /**
   * Open a connection and wait for `welcome`. Throws if the connection closes
   * before welcome arrives.
   */
  connect(url: string, name: string): Promise<ConnectResult>
  {
    return new Promise((resolve, reject) => {
      let settled = false;
      const ws = new WebSocket(url);
      this._ws = ws;

      ws.addEventListener('open', () => {
        this._send({ t: 'hello', name, version: PROTOCOL_VERSION });
      });

      ws.addEventListener('message', (ev) => {
        let msg: S2C;
        try {
          msg = JSON.parse(typeof ev.data === 'string' ? ev.data : '') as S2C;
        } catch {
          return;
        }
        if (msg.t === 'welcome' && !settled) {
          settled = true;
          this._connected = true;
          resolve({ playerId: msg.playerId, seed: msg.seed, edits: msg.edits, players: msg.players });
          return;
        }
        this._dispatch(msg);
      });

      ws.addEventListener('error', () => {
        if (!settled) {
          settled = true;
          reject(new Error('WebSocket error before welcome'));
        }
      });

      ws.addEventListener('close', () => {
        this._connected = false;
        if (!settled) {
          settled = true;
          reject(new Error('WebSocket closed before welcome'));
        }
      });
    });
  }

  /**
   * Throttled transform sender. Call every frame; the client coalesces to the
   * latest pending value and ships it at most every 1/20s.
   */
  sendTransform(x: number, y: number, z: number, yaw: number, pitch: number): void
  {
    if (!this._connected) {
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
    if (!this._connected) {
      return;
    }
    this._send({ t: 'block_place', x, y, z, fx, fy, fz, blockType });
  }

  sendBlockBreak(x: number, y: number, z: number): void
  {
    if (!this._connected) {
      return;
    }
    this._send({ t: 'block_break', x, y, z });
  }

  private _dispatch(msg: S2C): void
  {
    switch (msg.t) {
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
      case 'welcome':
        return;
    }
  }

  private _send(msg: C2S): void
  {
    if (this._ws === null || this._ws.readyState !== WebSocket.OPEN) {
      return;
    }
    this._ws.send(JSON.stringify(msg));
  }
}
