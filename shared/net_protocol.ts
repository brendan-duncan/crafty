/**
 * Wire protocol shared between the Crafty client and the multiplayer server.
 * Bumped when message shapes change in a way that breaks older peers.
 */
export const PROTOCOL_VERSION = 1;

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

// ---------------------------------------------------------------------------
// Client -> Server messages
// ---------------------------------------------------------------------------

export type C2S =
  | { t: 'hello'; name: string; version: number }
  | { t: 'transform'; x: number; y: number; z: number; yaw: number; pitch: number }
  | { t: 'block_place'; x: number; y: number; z: number; fx: number; fy: number; fz: number; blockType: number }
  | { t: 'block_break'; x: number; y: number; z: number };

// ---------------------------------------------------------------------------
// Server -> Client messages
// ---------------------------------------------------------------------------

export type S2C =
  | { t: 'welcome'; playerId: number; seed: number; players: PlayerSnapshot[]; edits: BlockEdit[] }
  | { t: 'player_join'; playerId: number; name: string }
  | { t: 'player_leave'; playerId: number }
  | { t: 'player_transform'; playerId: number; x: number; y: number; z: number; yaw: number; pitch: number }
  | { t: 'block_edit'; edit: BlockEdit };
