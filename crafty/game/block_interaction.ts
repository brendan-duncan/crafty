import { Vec3 } from '../../src/math/index.js';
import { BlockType, World } from '../../src/block/index.js';
import { addTorchLight, removeTorchLight, addMagmaLight, removeMagmaLight } from './lights.js';
import type { Scene } from '../../src/engine/index.js';

export interface BlockInteractionState {
  targetBlock: Vec3 | null;
  targetHit: { position: Vec3; face: Vec3 } | null;
  mouseHeld: number;
  mouseHoldTime: number;
  lastBlockAction: number;
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
    const minedType = world.getBlockType(state.targetBlock.x, state.targetBlock.y, state.targetBlock.z);
    if (minedType === BlockType.TORCH) {
      removeTorchLight(state.targetBlock.x, state.targetBlock.y, state.targetBlock.z, scene);
    }
    if (minedType === BlockType.MAGMA) {
      removeMagmaLight(state.targetBlock.x, state.targetBlock.y, state.targetBlock.z, scene);
    }
    world.mineBlock(state.targetBlock.x, state.targetBlock.y, state.targetBlock.z);
    state.lastBlockAction = time;
  } else if (button === 2 && state.targetHit) {
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
    }
    state.lastBlockAction = time;
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
