import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';
import { WebSocketServer, WebSocket } from 'ws';
import { WorldRepository } from './world_repository.ts';
import { WorldRoom, type PlayerConn } from './world_room.ts';
import {
  DEFAULT_PORT,
  PROTOCOL_VERSION,
  type C2S,
  type S2C,
  type WorldSummary,
  BLOCK_TYPE_MAX,
} from '../../shared/net_protocol.ts';

const port = Number(process.env.PORT) || DEFAULT_PORT;
const TRANSFORM_TICK_HZ = 15;
const SAVE_INTERVAL_MS = 5_000;
const HEARTBEAT_MS = 15_000;
const MAX_NAME_LEN = 16;
const MAX_WORLD_NAME_LEN = 32;

const _here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR ?? path.join(_here, '..', 'data');

interface LobbyConn {
  ws: WebSocket;
  /** Set on `hello`. Until then the connection is rejected for any other message. */
  playerKey: string | null;
  name: string;
  /** Once joined, the room handle is set and the conn becomes "in-game". */
  room: WorldRoom | null;
  player: PlayerConn | null;
}

const repo = new WorldRepository(dataDir);
await repo.init();
const startupWorlds = await repo.list();
console.log(`[crafty-server] data dir: ${dataDir}  (${startupWorlds.length} world(s) on disk)`);

/** Live, in-memory rooms keyed by world id. Loaded lazily on first join. */
const rooms = new Map<string, WorldRoom>();
/** Every connection (lobby or in-game) so we can broadcast `world_list` updates. */
const allConns = new Set<LobbyConn>();

const sslCert = process.env.SSL_CERT;
const sslKey = process.env.SSL_KEY;
let wss: WebSocketServer;

if (sslCert && sslKey) {
  const server = https.createServer({
    cert: fs.readFileSync(sslCert),
    key: fs.readFileSync(sslKey),
  });
  wss = new WebSocketServer({ server });
  server.listen(port);
  console.log(`[crafty-server] listening on wss://localhost:${port}  protocol v${PROTOCOL_VERSION}`);
} else {
  wss = new WebSocketServer({ port });
  console.log(`[crafty-server] listening on ws://localhost:${port}  protocol v${PROTOCOL_VERSION}`);
}

wss.on('connection', (ws) => {
  const conn: LobbyConn = { ws, playerKey: null, name: 'player', room: null, player: null };
  allConns.add(conn);
  let lastPing = Date.now();

  ws.on('message', (data) => {
    let msg: C2S;
    try {
      msg = JSON.parse(data.toString()) as C2S;
    } catch {
      return;
    }
    void handleMessage(conn, msg);
  });

  ws.on('pong', () => { lastPing = Date.now(); });

  ws.on('close', () => {
    if (conn.room !== null && conn.player !== null) {
      const sessionId = conn.player.sessionId;
      const roomLeft = conn.room;
      roomLeft.remove(sessionId);
      roomLeft.broadcast({ t: 'player_leave', playerId: sessionId });
      console.log(`[crafty-server] -player ${conn.name} left "${roomLeft.state.name}" (${roomLeft.playerCount} remaining)`);
    }
    allConns.delete(conn);
  });

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

// ─────────────────────────────────────────────────────────────────────────────
// Message handling
// ─────────────────────────────────────────────────────────────────────────────

async function handleMessage(conn: LobbyConn, msg: C2S): Promise<void>
{
  // First message must be 'hello'.
  if (conn.playerKey === null) {
    if (msg.t !== 'hello') {
      sendError(conn, 'expected_hello', 'first message must be hello');
      conn.ws.close(1002, 'expected hello');
      return;
    }
    if (msg.version !== PROTOCOL_VERSION) {
      sendError(conn, 'version_mismatch', `server v${PROTOCOL_VERSION}, client v${msg.version}`);
      conn.ws.close(1002, 'version mismatch');
      return;
    }
    if (typeof msg.playerKey !== 'string' || msg.playerKey.length === 0 || msg.playerKey.length > 64) {
      sendError(conn, 'bad_player_key', 'playerKey must be a non-empty string');
      conn.ws.close(1002, 'bad player key');
      return;
    }
    conn.playerKey = msg.playerKey;
    conn.name = sanitizeName(msg.name, MAX_NAME_LEN, 'player');
    await sendWorldList(conn);
    return;
  }

  // After hello: route by phase.
  if (conn.room === null) {
    await handleLobbyMessage(conn, msg);
    return;
  }
  handleGameMessage(conn, msg);
}

async function handleLobbyMessage(conn: LobbyConn, msg: C2S): Promise<void>
{
  switch (msg.t) {
    case 'list_worlds':
      await sendWorldList(conn);
      return;
    case 'create_world': {
      const name = sanitizeName(msg.name, MAX_WORLD_NAME_LEN, 'World');
      const seed = Number.isFinite(msg.seed) ? Math.floor(msg.seed) : 0;
      try {
        const state = await repo.create(name, seed);
        const room = new WorldRoom(state);
        rooms.set(state.id, room);
        sendTo(conn, { t: 'world_created', world: state.toSummary(0) });
        await broadcastWorldListToLobby();
        console.log(`[crafty-server] +world "${name}" (${state.id}, seed=${seed})`);
      } catch (err) {
        sendError(conn, 'create_failed', (err as Error).message);
      }
      return;
    }
    case 'join_world': {
      const room = await loadOrGetRoom(msg.worldId);
      if (room === null) {
        sendError(conn, 'world_not_found', `no world with id ${msg.worldId}`);
        return;
      }
      const player = room.add(conn.ws, conn.playerKey!, conn.name);
      conn.room = room;
      conn.player = player;
      const lastPosition = room.state.getPlayerPosition(conn.playerKey!);
      sendTo(conn, {
        t: 'welcome',
        playerId: player.sessionId,
        worldId: room.state.id,
        seed: room.state.seed,
        sunAngle: room.state.sunAngle,
        lastPosition,
        players: room.snapshotsExcept(player.sessionId),
        edits: room.state.edits,
      });
      room.broadcast({ t: 'player_join', playerId: player.sessionId, name: conn.name }, player.sessionId);
      await broadcastWorldListToLobby();
      console.log(`[crafty-server] +player ${conn.name} joined "${room.state.name}" (${room.playerCount} online)`);
      return;
    }
    case 'hello':
      // Already greeted — ignore re-hellos.
      return;
    default:
      sendError(conn, 'not_in_world', 'must join a world before sending game messages');
  }
}

function handleGameMessage(conn: LobbyConn, msg: C2S): void
{
  const room = conn.room!;
  const player = conn.player!;
  switch (msg.t) {
    case 'transform': {
      if (!Number.isFinite(msg.x) || !Number.isFinite(msg.y) || !Number.isFinite(msg.z)) {
        return;
      }
      player.x = msg.x; player.y = msg.y; player.z = msg.z;
      player.yaw = msg.yaw; player.pitch = msg.pitch;
      player.dirty = true;
      // Don't mark the room dirty just for movement — the per-tick save would
      // thrash. We snapshot positions when the player disconnects or right
      // before a save tick (see flushPlayerSnapshots below).
      return;
    }
    case 'block_place': {
      const edit = room.state.applyEdit({
        kind: 'place',
        x: msg.x, y: msg.y, z: msg.z,
        blockType: msg.blockType,
        fx: msg.fx, fy: msg.fy, fz: msg.fz,
      });
      if (edit !== null) {
        room.dirty = true;
        room.broadcast({ t: 'block_edit', edit });
      }
      return;
    }
    case 'block_break': {
      const edit = room.state.applyEdit({
        kind: 'break',
        x: msg.x, y: msg.y, z: msg.z,
        blockType: 0,
      });
      if (edit !== null) {
        room.dirty = true;
        room.broadcast({ t: 'block_edit', edit });
      }
      return;
    }
    case 'hello':
    case 'list_worlds':
    case 'create_world':
    case 'join_world':
      // Lobby-only messages are silently dropped after join.
      return;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function loadOrGetRoom(worldId: string): Promise<WorldRoom | null>
{
  const cached = rooms.get(worldId);
  if (cached !== undefined) {
    return cached;
  }
  const state = await repo.load(worldId);
  if (state === null) {
    return null;
  }
  const room = new WorldRoom(state);
  rooms.set(worldId, room);
  return room;
}

async function buildWorldList(): Promise<WorldSummary[]>
{
  // Combine on-disk worlds with whatever's already loaded into rooms (the
  // loaded copy has the live edit count + connected player count). Disk-only
  // worlds use a player count of 0.
  const states = await repo.list();
  return states.map((state) => {
    const room = rooms.get(state.id);
    if (room !== undefined) {
      return room.state.toSummary(room.playerCount);
    }
    return state.toSummary(0);
  });
}

async function sendWorldList(conn: LobbyConn): Promise<void>
{
  const worlds = await buildWorldList();
  sendTo(conn, { t: 'world_list', worlds });
}

async function broadcastWorldListToLobby(): Promise<void>
{
  const worlds = await buildWorldList();
  const msg: S2C = { t: 'world_list', worlds };
  const data = JSON.stringify(msg);
  for (const c of allConns) {
    if (c.room !== null || c.playerKey === null) {
      continue;          // skip in-game and pre-hello connections
    }
    if (c.ws.readyState === WebSocket.OPEN) {
      c.ws.send(data);
    }
  }
}

function sendTo(conn: LobbyConn, msg: S2C): void
{
  if (conn.ws.readyState !== WebSocket.OPEN) {
    return;
  }
  conn.ws.send(JSON.stringify(msg));
}

function sendError(conn: LobbyConn, code: string, message: string): void
{
  sendTo(conn, { t: 'error', code, message });
}

function sanitizeName(raw: unknown, maxLen: number, fallback: string): string
{
  if (typeof raw !== 'string') {
    return fallback;
  }
  const trimmed = raw.trim().slice(0, maxLen);
  return trimmed.length > 0 ? trimmed : fallback;
}

void BLOCK_TYPE_MAX;   // re-export reference (kept for protocol completeness)

// ─────────────────────────────────────────────────────────────────────────────
// Periodic ticks
// ─────────────────────────────────────────────────────────────────────────────

setInterval(() => {
  for (const room of rooms.values()) {
    room.broadcastTransforms();
  }
}, Math.floor(1000 / TRANSFORM_TICK_HZ));

setInterval(() => {
  for (const room of rooms.values()) {
    if (!room.dirty) {
      continue;
    }
    // Snapshot live player positions before flushing so the saved file reflects
    // current state (not just the last disconnect).
    room.flushPlayerSnapshots();
    room.dirty = false;
    repo.save(room.state).catch((err) => {
      console.error(`[crafty-server] save failed for "${room.state.name}":`, err);
      room.dirty = true;
    });
  }
}, SAVE_INTERVAL_MS);

// ─────────────────────────────────────────────────────────────────────────────
// Graceful shutdown
// ─────────────────────────────────────────────────────────────────────────────

let shuttingDown = false;
async function shutdown(signal: string): Promise<void>
{
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log(`[crafty-server] ${signal} — flushing ${rooms.size} world(s) and exiting`);
  for (const room of rooms.values()) {
    room.flushPlayerSnapshots();
    try {
      await repo.save(room.state);
    } catch (err) {
      console.error(`[crafty-server] save failed for "${room.state.name}":`, err);
    }
  }
  wss.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1500).unref();
}

process.on('SIGINT',  () => { void shutdown('SIGINT'); });
process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
