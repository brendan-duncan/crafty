import type { WebSocket } from 'ws';
import type { PlayerSnapshot, S2C } from '../../shared/net_protocol.ts';
import { WorldState } from './world_state.ts';

/** A connected player's in-game state. */
export interface PlayerConn {
  /** Server-assigned per-session id used by all in-game messages. */
  sessionId: number;
  /** Stable client-provided key for per-player persistence. */
  playerKey: string;
  name: string;
  ws: WebSocket;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  /** Whether the transform has changed since the last broadcast tick. */
  dirty: boolean;
}

/**
 * Per-world session state: tracks connected sockets, broadcasts in-game
 * messages, and maintains a `dirty` flag so the server's save tick knows when
 * to flush this world's `WorldState` to disk.
 *
 * Transform updates are coalesced — clients may send them at any rate but the
 * server batches the latest per-player transform and emits at a fixed cadence
 * (see `broadcastTransforms`).
 */
export class WorldRoom
{
  readonly state: WorldState;
  /** True when in-memory state has changed since the last successful save. */
  dirty = false;

  private readonly _conns = new Map<number, PlayerConn>();
  private _nextSessionId = 1;

  constructor(state: WorldState)
  {
    this.state = state;
  }

  get playerCount(): number
  {
    return this._conns.size;
  }

  add(ws: WebSocket, playerKey: string, name: string): PlayerConn
  {
    const sessionId = this._nextSessionId++;
    const saved = this.state.players.get(playerKey);
    const conn: PlayerConn = {
      sessionId,
      playerKey,
      name,
      ws,
      x: saved?.x ?? 64,
      y: saved?.y ?? 80,
      z: saved?.z ?? 64,
      yaw: saved?.yaw ?? 0,
      pitch: saved?.pitch ?? 0,
      dirty: false,
    };
    this._conns.set(sessionId, conn);
    return conn;
  }

  remove(sessionId: number): PlayerConn | undefined
  {
    const conn = this._conns.get(sessionId);
    if (conn !== undefined) {
      // Stamp last-known position into the persistent player table so a
      // reconnect resumes here.
      this.state.setPlayer(conn.playerKey, {
        name: conn.name,
        x: conn.x, y: conn.y, z: conn.z,
        yaw: conn.yaw, pitch: conn.pitch,
        lastSeen: Date.now(),
      });
      this.dirty = true;
      this._conns.delete(sessionId);
    }
    return conn;
  }

  get(sessionId: number): PlayerConn | undefined
  {
    return this._conns.get(sessionId);
  }

  /** All players except the given session, as wire snapshots. */
  snapshotsExcept(sessionId: number): PlayerSnapshot[]
  {
    const out: PlayerSnapshot[] = [];
    for (const p of this._conns.values()) {
      if (p.sessionId === sessionId) {
        continue;
      }
      out.push({
        playerId: p.sessionId, name: p.name,
        x: p.x, y: p.y, z: p.z, yaw: p.yaw, pitch: p.pitch,
      });
    }
    return out;
  }

  send(sessionId: number, msg: S2C): void
  {
    const conn = this._conns.get(sessionId);
    if (conn === undefined || conn.ws.readyState !== conn.ws.OPEN) {
      return;
    }
    conn.ws.send(JSON.stringify(msg));
  }

  broadcast(msg: S2C, exceptSessionId?: number): void
  {
    const data = JSON.stringify(msg);
    for (const p of this._conns.values()) {
      if (p.sessionId === exceptSessionId) {
        continue;
      }
      if (p.ws.readyState === p.ws.OPEN) {
        p.ws.send(data);
      }
    }
  }

  /** Emit `player_transform` for every player whose transform changed since the last call. */
  broadcastTransforms(): void
  {
    for (const p of this._conns.values()) {
      if (!p.dirty) {
        continue;
      }
      p.dirty = false;
      this.broadcast(
        { t: 'player_transform', playerId: p.sessionId, x: p.x, y: p.y, z: p.z, yaw: p.yaw, pitch: p.pitch },
        p.sessionId,
      );
    }
  }

  /** Persist all currently-connected players' last positions into the WorldState. */
  flushPlayerSnapshots(): void
  {
    const now = Date.now();
    for (const p of this._conns.values()) {
      this.state.setPlayer(p.playerKey, {
        name: p.name,
        x: p.x, y: p.y, z: p.z,
        yaw: p.yaw, pitch: p.pitch,
        lastSeen: now,
      });
    }
  }

  *connections(): IterableIterator<PlayerConn>
  {
    yield* this._conns.values();
  }
}
