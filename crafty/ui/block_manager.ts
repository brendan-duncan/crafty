import inventoryUrl from '../../assets/ui/new_inventory.png?url';
import { BlockType, blockTextureOffsetData } from '../../src/block/index.js';

export interface BlockManager {
  syncHotbar: () => void;
  refreshSlotHighlight: () => void;
}

export function createBlockManager(
  container: HTMLElement,
  atlasUrl: string,
  hotbarSlots: BlockType[],
  onHotbarChanged: () => void,
  getSelectedSlot: () => number,
  setSelectedSlot: (i: number) => void,
): BlockManager {
  const S    = 2;          // display scale (px per native px)
  const STEP = 18 * S;     // slot stride
  const ICON = 16 * S;     // canvas draw size
  const INV_COLS = 21, INV_ROWS = 6;
  const INV_X = 12 * S, INV_Y = 12 * S;
  const HOT_COLS = 9;
  const HOT_X = 120 * S;   // 240
  const HOT_Y = 124 * S;   // 248

  // All placeable blocks (skip NONE=0 and WATER)
  const allBlocks: BlockType[] = [];
  for (let i = 1; i < BlockType.MAX; i++) {
    if (i !== BlockType.WATER) {
      allBlocks.push(i as BlockType);
    }
  }

  // Wrapper with inventory image as visual background
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;display:inline-block;align-self:center;';

  const bgImg = document.createElement('img');
  bgImg.src = inventoryUrl;
  bgImg.draggable = false;
  bgImg.style.cssText = [
    `width:${400 * S}px`, `height:${150 * S}px`,
    'display:block', 'image-rendering:pixelated', 'user-select:none',
  ].join(';');
  wrap.appendChild(bgImg);

  // Atlas image shared by all slot canvases
  const atlas = new Image();
  atlas.src = atlasUrl;

  function drawIcon(cv: HTMLCanvasElement, bt: BlockType | null): void {
    const ctx2 = cv.getContext('2d')!;
    ctx2.clearRect(0, 0, cv.width, cv.height);
    if (!bt) {
      return;
    }
    const tod = blockTextureOffsetData.find(d => d.blockType === bt);
    if (!tod) {
      return;
    }
    ctx2.imageSmoothingEnabled = false;
    ctx2.drawImage(atlas, tod.sideFace.x * 16, tod.sideFace.y * 16, 16, 16, 0, 0, cv.width, cv.height);
  }

  // ── Drag state ────────────────────────────────────────────────────────────────
  let dragBlock: BlockType | null = null;
  let dragHotbarIdx: number | null = null;

  const hotbarDivs: HTMLDivElement[] = [];
  function refreshSlotHighlight(): void {
    hotbarDivs.forEach((d, i) => {
      d.style.outline = i === getSelectedSlot() ? '2px solid #ff0' : '';
    });
  }

  function makeSlot(x: number, y: number, draggable: boolean): [HTMLDivElement, HTMLCanvasElement] {
    const div = document.createElement('div');
    div.style.cssText = [
      'position:absolute', `left:${x}px`, `top:${y}px`,
      `width:${ICON}px`, `height:${ICON}px`,
      'box-sizing:border-box', draggable ? 'cursor:grab' : '',
    ].join(';');
    div.draggable = draggable;

    const cv = document.createElement('canvas');
    cv.width = cv.height = ICON;
    cv.style.cssText = `width:${ICON}px;height:${ICON}px;image-rendering:pixelated;pointer-events:none;display:block;`;
    div.appendChild(cv);
    wrap.appendChild(div);
    return [div, cv];
  }

  // ── Inventory grid (source) ───────────────────────────────────────────────────
  for (let row = 0; row < INV_ROWS; row++) {
    for (let col = 0; col < INV_COLS; col++) {
      const bt = allBlocks[row * INV_COLS + col] ?? null;
      if (!bt) {
        continue;
      }
      const [div, cv] = makeSlot(INV_X + col * STEP, INV_Y + row * STEP, true);
      div.title = String(blockTypeName[bt]);
      if (atlas.complete) {
        drawIcon(cv, bt);
      } else {
        atlas.addEventListener('load', () => drawIcon(cv, bt), { once: false });
      }
      div.addEventListener('click', () => {
        hotbarSlots[getSelectedSlot()] = bt;
        syncHotbar();
        onHotbarChanged();
      });
      div.addEventListener('dragstart', (e) => {
        dragBlock = bt; dragHotbarIdx = null;
        e.dataTransfer!.effectAllowed = 'copy';
        div.style.opacity = '0.4';
      });
      div.addEventListener('dragend', () => { div.style.opacity = '1'; });
    }
  }

  // ── Hotbar row (source + target) ──────────────────────────────────────────────
  const hotbarCanvases: HTMLCanvasElement[] = [];

  for (let i = 0; i < HOT_COLS; i++) {
    const [div, cv] = makeSlot(HOT_X + i * STEP, HOT_Y, true);
    hotbarCanvases.push(cv);
    hotbarDivs.push(div);
    div.title = `Slot ${i + 1}`;

    div.addEventListener('click', () => { setSelectedSlot(i); refreshSlotHighlight(); });
    div.addEventListener('dragstart', (e) => {
      dragBlock = hotbarSlots[i]; dragHotbarIdx = i;
      e.dataTransfer!.effectAllowed = 'move';
      div.style.opacity = '0.4';
    });
    div.addEventListener('dragend', () => { div.style.opacity = '1'; });

    div.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = dragHotbarIdx !== null ? 'move' : 'copy';
      div.style.boxShadow = 'inset 0 0 0 2px #7ff';
    });
    div.addEventListener('dragleave', () => { div.style.boxShadow = ''; });
    div.addEventListener('drop', (e) => {
      e.preventDefault();
      div.style.boxShadow = '';
      if (!dragBlock) {
        return;
      }
      if (dragHotbarIdx !== null && dragHotbarIdx !== i) {
        // swap two hotbar slots
        [hotbarSlots[i], hotbarSlots[dragHotbarIdx]] = [hotbarSlots[dragHotbarIdx], hotbarSlots[i]];
      } else if (dragHotbarIdx === null) {
        hotbarSlots[i] = dragBlock;
      }
      syncHotbar();
      onHotbarChanged();
      dragBlock = null; dragHotbarIdx = null;
    });
  }

  // Re-draws the hotbar row in the inventory panel from current hotbarSlots
  function syncHotbar(): void {
    for (let i = 0; i < HOT_COLS; i++) {
      drawIcon(hotbarCanvases[i], hotbarSlots[i]);
    }
  }

  atlas.addEventListener('load', syncHotbar);
  if (atlas.complete) {
    syncHotbar();
  }

  container.appendChild(wrap);
  return { syncHotbar, refreshSlotHighlight };
}

// Import blockTypeName for the tooltip
import { blockTypeName } from '../../src/block/block_type.js';
