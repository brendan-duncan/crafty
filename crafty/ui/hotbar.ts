import hotbarUrl from '../../assets/ui/hotbar.png?url';
import { BlockType, blockTextureOffsetData } from '../../src/block/index.js';

const HOTBAR_SLOTS: BlockType[] = [
  BlockType.DIRT,
  BlockType.IRON,
  BlockType.STONE,
  BlockType.SAND,
  BlockType.TRUNK,
  BlockType.SPRUCE_PLANKS,
  BlockType.GLASS,
  BlockType.TORCH,
  BlockType.WATER,
];

export interface Hotbar {
  getSelected: () => BlockType;
  refresh: () => void;
  getSelectedSlot: () => number;
  setSelectedSlot: (i: number) => void;
  setOnSelectionChanged: (cb: () => void) => void;
  slots: BlockType[];
  element: HTMLDivElement;
}

export function createHotbar(atlasUrl: string): Hotbar {
  const N = HOTBAR_SLOTS.length;
  let selected = 0;

  // ── Outer bar using the Litecraft hotbar sprite ──
  const bar = document.createElement('div');
  bar.style.cssText = [
    'position:fixed', 'bottom:12px', 'left:50%', 'transform:translateX(-50%)',
    'display:flex', 'flex-direction:row', 'flex-wrap:nowrap', 'align-items:center', 'gap:0px',
    'background:url(' + hotbarUrl + ') no-repeat',
    // hotbar.png: 207×24 px; bar strip is x=24..205, we shift the sprite so the
    // bar starts at the left edge, and scale to 2× Minecraft's 182×22 bar.
    'background-position:-48px 0px',
    'background-size:414px 48px',
    'width:364px', 'height:44px',
    'padding:1px 2px',
    'image-rendering:pixelated',
    'box-sizing:border-box',
  ].join(';');

  const slots: HTMLDivElement[] = [];
  const canvases: HTMLCanvasElement[] = [];

  for (let i = 0; i < N; i++) {
    const slot = document.createElement('div');
    slot.style.cssText = [
      'width:40px', 'height:40px',
      'display:flex', 'align-items:center', 'justify-content:center',
      'position:relative', 'flex-shrink:0',
    ].join(';');

    const cv = document.createElement('canvas');
    cv.width = cv.height = 32;
    cv.style.cssText = 'width:32px;height:32px;image-rendering:pixelated;';
    slot.appendChild(cv);

    // Key number label
    const lbl = document.createElement('span');
    lbl.textContent = String(i + 1);
    lbl.style.cssText = [
      'position:absolute', 'top:1px', 'left:3px',
      'font-family:ui-monospace,monospace', 'font-size:9px',
      'color:#ccc', 'text-shadow:0 0 2px #000', 'pointer-events:none',
    ].join(';');
    slot.appendChild(lbl);

    bar.appendChild(slot);
    slots.push(slot);
    canvases.push(cv);
  }
  document.body.appendChild(bar);

  // Selected-slot highlight overlay (uses the 24×24 selector from x=0 of hotbar.png)
  const sel = document.createElement('div');
  sel.style.cssText = [
    'position:fixed', 'bottom:12px',
    'width:44px', 'height:48px',
    'background:url(' + hotbarUrl + ') no-repeat',
    'background-position:0px 0px',
    'background-size:414px 48px',
    'pointer-events:none',
    'image-rendering:pixelated',
    'transition:left 60ms linear',
  ].join(';');
  document.body.appendChild(sel);

  let _onSelectionChanged: (() => void) | null = null;

  function updateSelection() {
    const barRect = bar.getBoundingClientRect();
    // Each slot is 40px wide; centre the 44px selector over the active slot
    sel.style.left = (barRect.left - 2 + selected * 40) + 'px';
    _onSelectionChanged?.();
  }

  // ── Draw block icons ──
  const img = new Image();
  img.src = atlasUrl;

  function refresh(): void {
    if (!img.complete) {
      return;
    }
    const TILE = 16;
    for (let i = 0; i < N; i++) {
      const tod = blockTextureOffsetData.find(d => d.blockType === HOTBAR_SLOTS[i]);
      const ctx2 = canvases[i].getContext('2d')!;
      ctx2.clearRect(0, 0, 32, 32);
      if (!tod) {
        continue;
      }
      ctx2.imageSmoothingEnabled = false;
      ctx2.drawImage(img, tod.sideFace.x * TILE, tod.sideFace.y * TILE, TILE, TILE, 0, 0, 32, 32);
    }
  }
  img.onload = refresh;

  // ── Input ──
  window.addEventListener('keydown', (e) => {
    const n = parseInt(e.key);
    if (n >= 1 && n <= N) {
      selected = n - 1;
      updateSelection();
    }
  });

  window.addEventListener('wheel', (e) => {
    selected = (selected + (e.deltaY > 0 ? 1 : N - 1)) % N;
    updateSelection();
  }, { passive: true });

  // Delay first position update until bar is laid out
  requestAnimationFrame(updateSelection);

  return {
    getSelected: () => HOTBAR_SLOTS[selected],
    refresh,
    getSelectedSlot: () => selected,
    setSelectedSlot: (i: number) => { selected = i; updateSelection(); },
    setOnSelectionChanged: (cb: () => void) => { _onSelectionChanged = cb; },
    slots: HOTBAR_SLOTS,
    element: bar,
  };
}
