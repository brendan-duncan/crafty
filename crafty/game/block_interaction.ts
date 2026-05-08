import { Vec3 } from '../../src/math/index.js';
import { BlockType, World } from '../../src/block/index.js';
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
  /**
   * Optional sink notified after every successful local block edit. Set by the
   * networking layer to forward edits to the server. Skipped for world changes
   * applied from network messages (those use {@link applyRemoteBlockEdit}).
   */
  onLocalEdit?: (edit: LocalBlockEdit) => void;
}

const BLOCK_INITIAL_DELAY  = 700; // ms before repeat starts
const BLOCK_REPEAT_INTERVAL = 300; // ms between repeats

export function createBlockInteractionState(): BlockInteractionState {
  return {
    targetBlock: null,
    targetHit: null,
    mouseHeld: -1,
    mouseHoldTime: 0,
    lastBlockAction: 0,
  };
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
    if (minedType === BlockType.TORCH) {
      removeTorchLight(tx, ty, tz, scene);
    }
    if (minedType === BlockType.MAGMA) {
      removeMagmaLight(tx, ty, tz, scene);
    }
    if (world.mineBlock(tx, ty, tz)) {
      state.onLocalEdit?.({ kind: 'break', x: tx, y: ty, z: tz });
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
  if (world.addBlock(edit.x, edit.y, edit.z, edit.fx, edit.fy, edit.fz, edit.blockType)) {
    if (edit.blockType === BlockType.TORCH) {
      addTorchLight(newX, newY, newZ, scene);
    }
    if (edit.blockType === BlockType.MAGMA) {
      addMagmaLight(newX, newY, newZ, scene);
    }
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
    doBlockAction(e.button, e.timeStamp, state, world, getSelectedBlock, scene);
  });

  canvas.addEventListener('mouseup', (e: MouseEvent) => {
    if (e.button === state.mouseHeld) {
      state.mouseHeld = -1;
    }
  });
}

export function updateBlockInteraction(
  time: number,
  canvas: HTMLCanvasElement,
  state: BlockInteractionState,
  world: World,
  getSelectedBlock: () => BlockType,
  scene: Scene,
): void {
  if (state.mouseHeld >= 0 && document.pointerLockElement === canvas) {
    if (time - state.mouseHoldTime >= BLOCK_INITIAL_DELAY && time - state.lastBlockAction >= BLOCK_REPEAT_INTERVAL) {
      doBlockAction(state.mouseHeld, time, state, world, getSelectedBlock, scene);
    }
  }
}
