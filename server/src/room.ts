import type { WebSocket } from 'ws';
import type { PlayerSnapshot, S2C } from '../../shared/net_protocol.ts';

export interface PlayerConn {
  playerId: number;
  name: string;
  ws: WebSocket;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  /** Whether the transform has changed since the last broadcast tick. */
  dirty: boolean;
  alive: boolean;
}

/**
 * Tracks connected players and provides broadcast helpers.
 *
 * Transform updates are coalesced: clients may send them at any rate but the
 * server batches the latest per-player transform and emits at a fixed cadence
 * (see `broadcastTransforms`).
 */
export class Room {
  private readonly _players = new Map<number, PlayerConn>();
  private _nextId = 1;

  add(ws: WebSocket, name: string): PlayerConn {
    const playerId = this._nextId++;
    const conn: PlayerConn = {
      playerId,
      name,
      ws,
      x: 64, y: 25, z: 64,
      yaw: 0, pitch: 0,
      dirty: false,
      alive: true,
    };
    this._players.set(playerId, conn);
    return conn;
  }

  remove(playerId: number): void {
    this._players.delete(playerId);
  }

  get(playerId: number): PlayerConn | undefined {
    return this._players.get(playerId);
  }

  /** All players except the given id, as wire snapshots. */
  snapshotsExcept(playerId: number): PlayerSnapshot[] {
    const out: PlayerSnapshot[] = [];
    for (const p of this._players.values()) {
      if (p.playerId === playerId) {
        continue;
      }
      out.push({
        playerId: p.playerId, name: p.name,
        x: p.x, y: p.y, z: p.z, yaw: p.yaw, pitch: p.pitch,
      });
    }
    return out;
  }

  send(playerId: number, msg: S2C): void {
    const conn = this._players.get(playerId);
    if (!conn || conn.ws.readyState !== conn.ws.OPEN) {
      return;
    }
    conn.ws.send(JSON.stringify(msg));
  }

  broadcast(msg: S2C, exceptPlayerId?: number): void {
    const data = JSON.stringify(msg);
    for (const p of this._players.values()) {
      if (p.playerId === exceptPlayerId) {
        continue;
      }
      if (p.ws.readyState === p.ws.OPEN) {
        p.ws.send(data);
      }
    }
  }

  /** Emit a `player_transform` for every player whose transform changed since the last call. */
  broadcastTransforms(): void {
    for (const p of this._players.values()) {
      if (!p.dirty) {
        continue;
      }
      p.dirty = false;
      this.broadcast(
        { t: 'player_transform', playerId: p.playerId, x: p.x, y: p.y, z: p.z, yaw: p.yaw, pitch: p.pitch },
        p.playerId,
      );
    }
  }

  /** Iterate live connections (for heartbeat and shutdown). */
  *connections(): IterableIterator<PlayerConn> {
    yield* this._players.values();
  }
}
