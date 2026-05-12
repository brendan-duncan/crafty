/**
 * Wire protocol shared between the Crafty client and the multiplayer server.
 * Bumped when message shapes change in a way that breaks older peers.
 */
export const PROTOCOL_VERSION = 2;
/** Max valid block type id (exclusive). Mirrors `BlockType.MAX` from the engine. */
export const BLOCK_TYPE_MAX = 25;
/** Default WebSocket port the server listens on. */
export const DEFAULT_PORT = 8787;
