/**
 * Wire protocol shared between the Crafty client and the multiplayer server.
 * Bumped when message shapes change in a way that breaks older peers.
 */
export const PROTOCOL_VERSION = 2;

/** Max valid block type id (exclusive). Mirrors `BlockType.MAX` from the engine. */
export const BLOCK_TYPE_MAX = 25;

/** Default WebSocket port the server listens on. */
export const DEFAULT_PORT = 8787;

// ---------------------------------------------------------------------------
// Shared payload shapes
// ---------------------------------------------------------------------------

export interface PlayerSnapshot {
  playerId: number;
  name: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
}

export interface BlockEdit {
  kind: 'place' | 'break';
  x: number;
  y: number;
  z: number;
  /** For 'place' the block type to set; for 'break' this is 0. */
  blockType: number;
  /** Face normal of the block being placed against (only for 'place'). */
  fx?: number;
  fy?: number;
  fz?: number;
}

/** Lightweight world descriptor returned by the server's lobby. */
export interface WorldSummary {
  id: string;
  name: string;
  seed: number;
  createdAt: number;
  lastModifiedAt: number;
  /** Players currently connected to this world. */
  playerCount: number;
  /** Number of recorded edits — useful as a "size" indicator in the UI. */
  editCount: number;
}

/** Player position payload sent in `welcome` for returning players. */
export interface SavedPosition {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
}

// ---------------------------------------------------------------------------
// Client -> Server messages
// ---------------------------------------------------------------------------

export type C2S =
  // Lobby phase
  | { t: 'hello'; playerKey: string; name: string; version: number }
  | { t: 'list_worlds' }
  | { t: 'create_world'; name: string; seed: number }
  | { t: 'join_world'; worldId: string }
  // In-game phase
  | { t: 'transform'; x: number; y: number; z: number; yaw: number; pitch: number }
  | { t: 'block_place'; x: number; y: number; z: number; fx: number; fy: number; fz: number; blockType: number }
  | { t: 'block_break'; x: number; y: number; z: number };

// ---------------------------------------------------------------------------
// Server -> Client messages
// ---------------------------------------------------------------------------

export type S2C =
  // Lobby
  | { t: 'world_list'; worlds: WorldSummary[] }
  | { t: 'world_created'; world: WorldSummary }
  | { t: 'error'; code: string; message: string }
  // Transition (reply to join_world)
  | {
      t: 'welcome';
      playerId: number;
      worldId: string;
      seed: number;
      sunAngle: number;
      lastPosition: SavedPosition | null;
      players: PlayerSnapshot[];
      edits: BlockEdit[];
    }
  // In-game
  | { t: 'player_join'; playerId: number; name: string }
  | { t: 'player_leave'; playerId: number }
  | { t: 'player_transform'; playerId: number; x: number; y: number; z: number; yaw: number; pitch: number }
  | { t: 'block_edit'; edit: BlockEdit };
