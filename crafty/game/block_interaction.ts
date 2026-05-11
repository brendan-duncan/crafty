import { Vec3 } from '../../src/math/index.js';
import { BlockType, World } from '../../src/block/index.js';
import { isBlockProp, blockHardness } from '../../src/block/block_type.js';
import { addTorchLight, removeTorchLight, addMagmaLight, removeMagmaLight } from './lights.js';
import type { Scene } from '../../src/engine/index.js';

export type LocalBlockEdit =
  | { kind: 'place'; x: number; y: number; z: number; fx: number; fy: number; fz: number; blockType: BlockType }
  | { kind: 'break'; x: number; y: number; z: number };

export interface BlockInteractionState {
  targetBlock: Vec3 | null;
  targetHit: { position: Vec3; face: Vec3 } | null;
  mouseHeld: number;
  mouseHoldTime: number;
  lastBlockAction: number;

  /** Progressive break tracking: current accumulated break progress (ms). */
  breakProgress: number;
  /** Position of the block currently being broken, or null. */
  breakingBlock: Vec3 | null;
  /** Total break time (ms) for the current block. */
  breakTime: number;
  /** Crack overlay stage 0-9, or -1 when not breaking. */
  crackStage: number;

  /**
   * Optional sink notified after every successful local block edit. Set by the
   * networking layer to forward edits to the server. Skipped for world changes
   * applied from network messages (those use {@link applyRemoteBlockEdit}).
   */
  onLocalEdit?: (edit: LocalBlockEdit) => void;
}

const BLOCK_INITIAL_DELAY  = 700; // ms before repeat starts
const BLOCK_REPEAT_INTERVAL = 300; // ms between repeats

/**
 * Returns break duration in ms for a block type.
 * breakTime = hardness * 1500 (e.g. stone: 1.5 * 1500 = 2250ms)
 */
function getBreakTime(blockType: BlockType): number {
  return blockHardness[blockType] * 1500;
}

export function createBlockInteractionState(): BlockInteractionState {
  return {
    targetBlock: null,
    targetHit: null,
    mouseHeld: -1,
    mouseHoldTime: 0,
    lastBlockAction: 0,
    breakProgress: 0,
    breakingBlock: null,
    breakTime: 0,
    crackStage: -1,
  };
}

/**
 * Completes a progressive break: removes the block, handles light/prop cascade.
 */
function completeBreak(state: BlockInteractionState, world: World, scene: Scene): void {
  const tx = state.breakingBlock!.x, ty = state.breakingBlock!.y, tz = state.breakingBlock!.z;
  const minedType = world.getBlockType(tx, ty, tz);
  if (minedType === BlockType.TORCH) {
    removeTorchLight(tx, ty, tz, scene);
  }
  if (minedType === BlockType.MAGMA) {
    removeMagmaLight(tx, ty, tz, scene);
  }
  if (world.mineBlock(tx, ty, tz)) {
    state.onLocalEdit?.({ kind: 'break', x: tx, y: ty, z: tz });
    if (!isBlockProp(minedType)) {
      const aboveType = world.getBlockType(tx, ty + 1, tz);
      if (isBlockProp(aboveType)) {
        if (aboveType === BlockType.TORCH) {
          removeTorchLight(tx, ty + 1, tz, scene);
        }
        if (world.mineBlock(tx, ty + 1, tz)) {
          state.onLocalEdit?.({ kind: 'break', x: tx, y: ty + 1, z: tz });
        }
      }
    }
  }
  state.breakProgress = 0;
  state.breakingBlock = null;
  state.crackStage = -1;
}

export function doBlockAction(
  button: number,
  time: number,
  state: BlockInteractionState,
  world: World,
  getSelectedBlock: () => BlockType,
  scene: Scene,
): void {
  if (button === 0 && state.targetBlock) {
    const tx = state.targetBlock.x, ty = state.targetBlock.y, tz = state.targetBlock.z;
    const minedType = world.getBlockType(tx, ty, tz);

    // If targeting a different block, reset progress
    if (state.breakingBlock && (state.breakingBlock.x !== tx || state.breakingBlock.y !== ty || state.breakingBlock.z !== tz)) {
      state.breakProgress = 0;
      state.crackStage = -1;
      state.breakingBlock = null;
    }

    // Start tracking this block
    state.breakingBlock = new Vec3(tx, ty, tz);
    state.breakTime = getBreakTime(minedType);

    // Hardness 0 blocks break instantly (no crack animation)
    if (state.breakTime === 0) {
      completeBreak(state, world, scene);
    }
    state.lastBlockAction = time;
  }
  else if (button === 2 && state.targetHit) {
    const hit = state.targetHit;
    const placed = getSelectedBlock();
    const newX = hit.position.x + hit.face.x;
    const newY = hit.position.y + hit.face.y;
    const newZ = hit.position.z + hit.face.z;
    if (world.addBlock(hit.position.x, hit.position.y, hit.position.z, hit.face.x, hit.face.y, hit.face.z, placed)) {
      if (placed === BlockType.TORCH) {
        addTorchLight(newX, newY, newZ, scene);
      }
      if (placed === BlockType.MAGMA) {
        addMagmaLight(newX, newY, newZ, scene);
      }
      state.onLocalEdit?.({
        kind: 'place',
        x: hit.position.x, y: hit.position.y, z: hit.position.z,
        fx: hit.face.x, fy: hit.face.y, fz: hit.face.z,
        blockType: placed,
      });
    }
    state.lastBlockAction = time;
  }
}

/**
 * Applies a block edit received from the network. Mirrors {@link doBlockAction}
 * but does NOT fire the `onLocalEdit` sink, so received edits aren't echoed
 * back to the server.
 */
export function applyRemoteBlockEdit(
  edit: LocalBlockEdit,
  world: World,
  scene: Scene,
): void {
  if (edit.kind === 'break') {
    const minedType = world.getBlockType(edit.x, edit.y, edit.z);
    if (minedType === BlockType.TORCH) {
      removeTorchLight(edit.x, edit.y, edit.z, scene);
    }
    if (minedType === BlockType.MAGMA) {
      removeMagmaLight(edit.x, edit.y, edit.z, scene);
    }
    world.mineBlock(edit.x, edit.y, edit.z);
    return;
  }
  const newX = edit.x + edit.fx;
  const newY = edit.y + edit.fy;
  const newZ = edit.z + edit.fz;
  // Use setBlockType, not addBlock: addBlock requires the *hit* chunk to be
  // loaded so it can validate the click target, and during replay that chunk
  // may not exist yet (cross-chunk-boundary placements lose blocks otherwise).
  // The saved/wire edit log is already authoritative — just put the block
  // there. Break edits earlier in the bucket have already cleared the cell.
  world.setBlockType(newX, newY, newZ, edit.blockType);
  if (edit.blockType === BlockType.TORCH) {
    addTorchLight(newX, newY, newZ, scene);
  }
  if (edit.blockType === BlockType.MAGMA) {
    addMagmaLight(newX, newY, newZ, scene);
  }
}

export function setupBlockInteractionHandlers(
  canvas: HTMLCanvasElement,
  state: BlockInteractionState,
  world: World,
  getSelectedBlock: () => BlockType,
  scene: Scene,
): void {
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    if (document.pointerLockElement !== canvas) {
      return;
    }
    if (e.button !== 0 && e.button !== 2) {
      return;
    }
    state.mouseHeld = e.button;
    state.mouseHoldTime = e.timeStamp;
    // Right-click (place) is immediate; left-click (mine) is handled progressively
    // in the per-frame updateBlockInteraction.
    if (e.button === 2) {
      doBlockAction(e.button, e.timeStamp, state, world, getSelectedBlock, scene);
    }
  });

  canvas.addEventListener('mouseup', (e: MouseEvent) => {
    if (e.button === state.mouseHeld) {
      state.mouseHeld = -1;
      state.breakProgress = 0;
      state.breakingBlock = null;
      state.crackStage = -1;
    }
  });
}

export function updateBlockInteraction(
  dt: number,
  time: number,
  state: BlockInteractionState,
  world: World,
  getSelectedBlock: () => BlockType,
  scene: Scene,
): void {
  if (state.mouseHeld >= 0) {
    if (state.mouseHeld === 0) {
      // Progressive mining
      const target = state.targetBlock;
      if (target && state.breakingBlock) {
        // Check if we're still targeting the same block
        if (target.x === state.breakingBlock.x && target.y === state.breakingBlock.y && target.z === state.breakingBlock.z) {
          state.breakProgress += dt * 1000;
          state.crackStage = Math.min(Math.floor(state.breakProgress / state.breakTime * 10), 9);
          if (state.breakProgress >= state.breakTime) {
            completeBreak(state, world, scene);
          }
        } else {
          state.breakProgress = 0;
          state.breakingBlock = null;
          state.crackStage = -1;
        }
      } else if (target && !state.breakingBlock) {
        // Mouse held on a block — start break tracking
        const minedType = world.getBlockType(target.x, target.y, target.z);
        state.breakingBlock = new Vec3(target.x, target.y, target.z);
        state.breakTime = getBreakTime(minedType);
        state.breakProgress = 0;
        state.crackStage = 0;
        if (state.breakTime === 0) {
          completeBreak(state, world, scene);
        }
      }
    } else if (state.mouseHeld === 2) {
      // Right-click repeat placing
      if (time - state.mouseHoldTime >= BLOCK_INITIAL_DELAY && time - state.lastBlockAction >= BLOCK_REPEAT_INTERVAL) {
        doBlockAction(state.mouseHeld, time, state, world, getSelectedBlock, scene);
      }
    }
  } else {
    // Mouse not held — reset any lingering break state (safety net)
    if (state.breakingBlock) {
      state.breakProgress = 0;
      state.breakingBlock = null;
      state.crackStage = -1;
    }
  }
}
