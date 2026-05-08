import { WebSocketServer, WebSocket } from 'ws';
import { Room, type PlayerConn } from './room.ts';
import { WorldState } from './world_state.ts';
import {
  DEFAULT_PORT,
  PROTOCOL_VERSION,
  type C2S,
} from '../../shared/net_protocol.ts';

const port = Number(process.env.PORT) || DEFAULT_PORT;
const seed = Number(process.env.SEED) || 13;
const TRANSFORM_TICK_HZ = 15;
const HEARTBEAT_MS = 15_000;

const world = new WorldState(seed);
const room = new Room();
const wss = new WebSocketServer({ port });

console.log(`[crafty-server] listening on ws://localhost:${port}  seed=${seed}`);

wss.on('connection', (ws) => {
  let conn: PlayerConn | null = null;
  let lastPing = Date.now();

  ws.on('message', (data) => {
    let msg: C2S;
    try {
      msg = JSON.parse(data.toString()) as C2S;
    } catch {
      return;
    }

    // First message must be 'hello'.
    if (conn === null) {
      if (msg.t !== 'hello') {
        ws.close(1002, 'expected hello');
        return;
      }
      if (msg.version !== PROTOCOL_VERSION) {
        ws.close(1002, `version mismatch (server ${PROTOCOL_VERSION}, client ${msg.version})`);
        return;
      }
      const name = sanitizeName(msg.name);
      conn = room.add(ws, name);
      console.log(`[crafty-server] +player ${conn.playerId} "${conn.name}" (${room.snapshotsExcept(-1).length + 1} online)`);
      room.send(conn.playerId, {
        t: 'welcome',
        playerId: conn.playerId,
        seed: world.seed,
        players: room.snapshotsExcept(conn.playerId),
        edits: world.edits,
      });
      room.broadcast({ t: 'player_join', playerId: conn.playerId, name: conn.name }, conn.playerId);
      return;
    }

    handleMessage(conn, msg);
  });

  ws.on('pong', () => { lastPing = Date.now(); });

  ws.on('close', () => {
    if (conn !== null) {
      console.log(`[crafty-server] -player ${conn.playerId} "${conn.name}"`);
      room.remove(conn.playerId);
      room.broadcast({ t: 'player_leave', playerId: conn.playerId });
      conn.alive = false;
    }
  });

  // Per-connection heartbeat.
  const heartbeat = setInterval(() => {
    if (Date.now() - lastPing > HEARTBEAT_MS * 2) {
      ws.terminate();
      clearInterval(heartbeat);
      return;
    }
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, HEARTBEAT_MS);

  ws.on('close', () => clearInterval(heartbeat));
});

function handleMessage(conn: PlayerConn, msg: C2S): void {
  switch (msg.t) {
    case 'hello':
      // Already hello'd — ignore duplicates.
      return;
    case 'transform': {
      if (!Number.isFinite(msg.x) || !Number.isFinite(msg.y) || !Number.isFinite(msg.z)) {
        return;
      }
      conn.x = msg.x; conn.y = msg.y; conn.z = msg.z;
      conn.yaw = msg.yaw; conn.pitch = msg.pitch;
      conn.dirty = true;
      return;
    }
    case 'block_place': {
      const edit = world.applyEdit({
        kind: 'place',
        x: msg.x, y: msg.y, z: msg.z,
        blockType: msg.blockType,
        fx: msg.fx, fy: msg.fy, fz: msg.fz,
      });
      if (edit !== null) {
        room.broadcast({ t: 'block_edit', edit });
      }
      return;
    }
    case 'block_break': {
      const edit = world.applyEdit({
        kind: 'break',
        x: msg.x, y: msg.y, z: msg.z,
        blockType: 0,
      });
      if (edit !== null) {
        room.broadcast({ t: 'block_edit', edit });
      }
      return;
    }
  }
}

function sanitizeName(raw: string): string {
  const trimmed = (raw ?? '').trim().slice(0, 16);
  return trimmed.length > 0 ? trimmed : `player`;
}

// Periodic transform broadcast.
setInterval(() => {
  room.broadcastTransforms();
}, Math.floor(1000 / TRANSFORM_TICK_HZ));
