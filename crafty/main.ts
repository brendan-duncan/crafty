import industrialUrl from '../assets/cubemaps/hdr/clear_sky.hdr?url';
import hotbarUrl from '../assets/ui/hotbar.png?url';
import inventoryUrl from '../assets/ui/new_inventory.png?url';
import colorAtlasUrl from '../assets/cube_textures/simple_block_atlas.png?url';
import normalAtlasUrl from '../assets/cube_textures/simple_block_atlas_normal.png?url';
import merAtlasUrl from '../assets/cube_textures/simple_block_atlas_mer.png?url';
import heightAtlasUrl from '../assets/cube_textures/simple_block_atlas_heightmap.png?url';
import dudvUrl from '../assets/water/waterDUDV.png?url';
import gradientUrl from '../assets/water/gradient_map.png?url';
import { Mat4, Vec3 } from '../src/math/index.js';
import {
  GameObject, Scene, Camera, DirectionalLight, PlayerController, CameraControls,
  PointLight, SpotLight,
} from '../src/engine/index.js';
import type { CascadeData } from '../src/engine/index.js';
import { MeshRenderer } from '../src/engine/index.js';
import {
  RenderContext, RenderGraph, GBuffer,
  ShadowPass, AtmospherePass, GeometryPass, LightingPass,
  TAAPass, SSAOPass, SSGIPass, DofPass, BloomPass, CompositePass,
  AutoExposurePass, PointSpotShadowPass, PointSpotLightPass,
  WorldGeometryPass, WaterPass, WorldShadowPass,
  BlockHighlightPass, ParticlePass,
  CloudPass, CloudShadowPass, GodrayPass,
} from '../src/renderer/index.js';
import { createCloudNoiseTextures } from '../src/assets/cloud_noise.js';
import type { CloudNoiseTextures } from '../src/assets/cloud_noise.js';
import { computeIblGpu } from '../src/assets/ibl.js';
import type { IblTextures } from '../src/assets/ibl.js';
import type { ParticleGraphConfig } from '../src/particles/index.js';
import { Texture } from '../src/assets/texture.js';
import { parseHdr, createHdrTexture } from '../src/assets/hdr_loader.js';
import { BlockTexture } from '../src/assets/block_texture.js';
import { World, BlockType, blockTextureOffsetData, blockTypeName, BiomeType, EnvironmentEffect, getBiomeEnvironmentEffect, getBiomeCloudCoverage, getBiomeCloudBounds } from '../src/block/index.js';
import type { Chunk, ChunkMesh } from '../src/block/index.js';
import type { DrawItem } from '../src/renderer/passes/geometry_pass.js';
import { createDuckBodyMesh, createDuckHeadMesh, createDuckBillMesh } from '../src/assets/duck_mesh.js';
import { DuckAI } from '../src/engine/components/duck_ai.js';

// ── Hotbar ────────────────────────────────────────────────────────────────────

const HOTBAR_SLOTS: BlockType[] = [
  BlockType.DIRT,
  BlockType.IRON,
  BlockType.STONE,
  BlockType.SAND,
  BlockType.TRUNK,
  BlockType.SPRUCE_PLANKS,
  BlockType.GLASS,
  BlockType.TORCH,
  BlockType.DIAMOND,
];

function createHotbar(atlasUrl: string): { getSelected: () => BlockType; refresh: () => void; getSelectedSlot: () => number; setSelectedSlot: (i: number) => void; setOnSelectionChanged: (cb: () => void) => void } {
  const N = HOTBAR_SLOTS.length;
  let selected = 0;

  // ── Outer bar using the Litecraft hotbar sprite ──
  const bar = document.createElement('div');
  bar.style.cssText = [
    'position:fixed', 'bottom:12px', 'left:50%', 'transform:translateX(-50%)',
    'display:flex', 'align-items:center', 'gap:0px',
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
  };
}

function halton(index: number, base: number): number {
  let result = 0, f = 1;
  while (index > 0) { 
    f /= base; 
    result += f * (index % base); 
    index = Math.floor(index / base); 
  }
  return result;
}

function applyJitter(vp: Mat4, jx: number, jy: number): Mat4 {
  const m = vp.clone();
  for (let c = 0; c < 4; c++) {
    m.data[c * 4 + 0] += jx * m.data[c * 4 + 3];
    m.data[c * 4 + 1] += jy * m.data[c * 4 + 3];
  }
  return m;
}

function createControlPanel(
  effects: Record<string, boolean>,
  onChange: (key: string) => void,
  container: HTMLElement,
): HTMLDivElement {
  const panel = document.createElement('div');
  panel.style.cssText = [
    'display:flex', 'flex-wrap:wrap', 'gap:8px', 'justify-content:center',
    'font-family:ui-monospace,monospace', 'font-size:13px',
    'user-select:none',
  ].join(';');

  const ON_STYLE  = 'background:#1a2e1a;color:#5f5;border-color:#5f5';
  const OFF_STYLE = 'background:#2e1a1a;color:#f55;border-color:#f55';

  for (const key of Object.keys(effects)) {
    const btn = document.createElement('button');
    const label = key.toUpperCase().padEnd(5);
    const refresh = () => {
      const on = effects[key];
      btn.textContent = `${label} ${on ? 'ON ' : 'OFF'}`;
      btn.setAttribute('style', [
        'padding:5px 10px', 'border-width:1px', 'border-style:solid',
        'border-radius:4px', 'cursor:pointer', 'letter-spacing:0.04em',
        on ? ON_STYLE : OFF_STYLE,
      ].join(';'));
    };
    btn.addEventListener('click', () => {
      effects[key] = !effects[key];
      refresh();
      onChange(key);
    });
    refresh();
    panel.appendChild(btn);
  }

  container.appendChild(panel);
  return panel;
}

// ── Block Manager (inventory panel shown inside the menu) ─────────────────────
// Image: 400×150 native, displayed at S=2× (800×300).
// Slot step = 18px native = 36px display. Icon canvas = 16px native = 32px display.
// Inventory: 21 cols × 6 rows, offset (22, 14) display.
// Hotbar:     9 cols × 1 row,  offset (238, 248) display (centred).

function createBlockManager(
  container: HTMLElement,
  atlasUrl: string,
  onHotbarChanged: () => void,
  getSelectedSlot: () => number,
  setSelectedSlot: (i: number) => void,
): { syncHotbar: () => void; refreshSlotHighlight: () => void } {
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
        HOTBAR_SLOTS[getSelectedSlot()] = bt;
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
      dragBlock = HOTBAR_SLOTS[i]; dragHotbarIdx = i;
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
        [HOTBAR_SLOTS[i], HOTBAR_SLOTS[dragHotbarIdx]] = [HOTBAR_SLOTS[dragHotbarIdx], HOTBAR_SLOTS[i]];
      } else if (dragHotbarIdx === null) {
        HOTBAR_SLOTS[i] = dragBlock;
      }
      syncHotbar();
      onHotbarChanged();
      dragBlock = null; dragHotbarIdx = null;
    });
  }

  // Re-draws the hotbar row in the inventory panel from current HOTBAR_SLOTS
  function syncHotbar(): void {
    for (let i = 0; i < HOT_COLS; i++) {
      drawIcon(hotbarCanvases[i], HOTBAR_SLOTS[i]);
    }
  }

  atlas.addEventListener('load', syncHotbar);
  if (atlas.complete) {
    syncHotbar();
  }

  container.appendChild(wrap);
  return { syncHotbar, refreshSlotHighlight };
}

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('No canvas element');
  }

  const ctx = await RenderContext.create(canvas);
  const { device } = ctx;

  const skyTexture = await createHdrTexture(device, parseHdr(await (await fetch(industrialUrl)).arrayBuffer()));
  const iblTextures: IblTextures = await computeIblGpu(device, skyTexture.gpuTexture);
  const cloudNoises: CloudNoiseTextures = createCloudNoiseTextures(device);

  const blockTexture = await BlockTexture.load(device, colorAtlasUrl, normalAtlasUrl, merAtlasUrl, heightAtlasUrl);
  const dudvTexture = await Texture.fromUrl(device, dudvUrl);
  const gradientTexture = await Texture.fromUrl(device, gradientUrl);

  // --- Hotbar ---

  const hotbar = createHotbar(colorAtlasUrl);

  // --- World ---

  const world = new World(345);
  //const world = new World(454321);
  //const world = new World(0);
  const chunkMeshCache = new Map<Chunk, ChunkMesh>();

  // --- Scene ---

  const scene = new Scene();

  const sunGO = new GameObject('Sun');
  const sun = sunGO.addComponent(new DirectionalLight(new Vec3(0.3, -1, 0.5), Vec3.one(), 3, 3));
  scene.add(sunGO);

  const cameraGO = new GameObject('Camera');
  cameraGO.position.set(64, 25, 64);
  const camera = cameraGO.addComponent(new Camera(70, 0.1, 1000, ctx.width / ctx.height));
  scene.add(cameraGO);

  const player = new PlayerController(world, Math.PI, 0.1);
  player.attach(canvas);

  const freeCamera = new CameraControls(Math.PI, 0.1, 15);
  let usePlayerController = true;

  const modeEl = document.createElement('div');
  modeEl.textContent = 'PLAYER';
  modeEl.style.cssText = [
    'position:fixed', 'top:12px', 'left:12px',
    'font-family:ui-monospace,monospace', 'font-size:13px', 'font-weight:bold',
    'color:#4f4', 'background:rgba(0,0,0,0.45)',
    'padding:4px 8px', 'border-radius:4px', 'pointer-events:none',
    'letter-spacing:0.05em',
  ].join(';');
  document.body.appendChild(modeEl);

  function toggleController(): void {
    usePlayerController = !usePlayerController;
    if (usePlayerController) {
      player.yaw = freeCamera.yaw;
      player.pitch = freeCamera.pitch;
      freeCamera.detach();
      player.attach(canvas);
    } else {
      freeCamera.yaw = player.yaw;
      freeCamera.pitch = player.pitch;
      player.detach();
      freeCamera.attach(canvas);
    }
    modeEl.textContent = usePlayerController ? 'PLAYER' : 'FREE';
    modeEl.style.color = usePlayerController ? '#4f4' : '#4cf';
  }

  // Double-tap Space: measure the gap between first keyup and second keydown.
  // Holding Space never triggers this because keyup only fires on release.
  let _lastSpaceUp = -Infinity;
  document.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      _lastSpaceUp = performance.now();
    }
  });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'KeyC' && !e.repeat) {
      toggleController();
      return;
    }
    if (e.code !== 'Space' || e.repeat) {
      return;
    }
    if (performance.now() - _lastSpaceUp < 400 && document.pointerLockElement === canvas) {
      const wasPlayer = usePlayerController;
      toggleController();
      _lastSpaceUp = -Infinity;
      // The second Space press is still physically held — inject it into the free
      // camera so holding Space immediately ascends without a re-press.
      if (wasPlayer) {
        freeCamera.pressKey('Space');
      }
    }
  });

  let targetBlock: Vec3 | null = null;
  let targetHit: { position: Vec3; face: Vec3 } | null = null;

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  interface TorchEntry { go: GameObject; pl: PointLight; phase: number; }
  const torchLights = new Map<string, TorchEntry>();
  const torchLightKey = (x: number, y: number, z: number) => `${x},${y},${z}`;

  function addTorchLight(bx: number, by: number, bz: number): void {
    const key = torchLightKey(bx, by, bz);
    if (torchLights.has(key)) {
      return;
    }
    const go = new GameObject('TorchLight');
    go.position.set(bx + 0.5, by + 0.9, bz + 0.5);
    const pl = go.addComponent(new PointLight());
    pl.color = new Vec3(1.0, 0.52, 0.18);
    pl.intensity = 4.0;
    pl.radius = 6.0;
    pl.castShadow = false;
    scene.add(go);
    // Each torch gets a unique phase so they flicker independently.
    const phase = (bx * 127.1 + by * 311.7 + bz * 74.3) % (Math.PI * 2);
    torchLights.set(key, { go, pl, phase });
  }

  function removeTorchLight(bx: number, by: number, bz: number): void {
    const key = torchLightKey(bx, by, bz);
    const entry = torchLights.get(key);
    if (!entry) {
      return;
    }
    scene.remove(entry.go);
    torchLights.delete(key);
  }

  function updateTorchFlicker(t: number): void {
    for (const { pl, phase } of torchLights.values()) {
      // Layered sines at different frequencies — feels organic without needing noise.
      const flicker = 1.0
        + 0.08 * Math.sin(t * 11.7 + phase)
        + 0.05 * Math.sin(t *  7.3 + phase * 1.7)
        + 0.03 * Math.sin(t * 23.1 + phase * 0.5);
      pl.intensity = 4.0 * flicker;
    }
  }

  const magmaLights = new Map<string, TorchEntry>();

  function addMagmaLight(bx: number, by: number, bz: number): void {
    const key = torchLightKey(bx, by, bz);
    if (magmaLights.has(key)) {
      return;
    }
    const go = new GameObject('MagmaLight');
    go.position.set(bx + 0.5, by + 0.5, bz + 0.5);
    const pl = go.addComponent(new PointLight());
    pl.color = new Vec3(1.0, 0.28, 0.0);
    pl.intensity = 6.0;
    pl.radius = 10.0;
    pl.castShadow = false;
    scene.add(go);
    const phase = (bx * 127.1 + by * 311.7 + bz * 74.3) % (Math.PI * 2);
    magmaLights.set(key, { go, pl, phase });
  }

  function removeMagmaLight(bx: number, by: number, bz: number): void {
    const key = torchLightKey(bx, by, bz);
    const entry = magmaLights.get(key);
    if (!entry) {
      return;
    }
    scene.remove(entry.go);
    magmaLights.delete(key);
  }

  function updateMagmaFlicker(t: number): void {
    for (const { pl, phase } of magmaLights.values()) {
      // Slow, heavy pulsing — lava swells and bubbles rather than flickering.
      const flicker = 1.0
        + 0.18 * Math.sin(t * 1.1 + phase)
        + 0.10 * Math.sin(t * 2.9 + phase * 0.7)
        + 0.06 * Math.sin(t * 0.5 + phase * 1.4);
      pl.intensity = 6.0 * flicker;
    }
  }

  let mouseHeld       = -1;
  let mouseHoldTime   = 0;
  let lastBlockAction = 0;
  const BLOCK_INITIAL_DELAY  = 700; // ms before repeat starts
  const BLOCK_REPEAT_INTERVAL = 300; // ms between repeats

  function doBlockAction(button: number, time: number): void {
    if (button === 0 && targetBlock) {
      const minedType = world.getBlockType(targetBlock.x, targetBlock.y, targetBlock.z);
      if (minedType === BlockType.TORCH) {
        removeTorchLight(targetBlock.x, targetBlock.y, targetBlock.z);
      }
      if (minedType === BlockType.MAGMA) {
        removeMagmaLight(targetBlock.x, targetBlock.y, targetBlock.z);
      }
      world.mineBlock(targetBlock.x, targetBlock.y, targetBlock.z);
      lastBlockAction = time;
    } else if (button === 2 && targetHit) {
      const hit = targetHit;
      const placed = hotbar.getSelected();
      const newX = hit.position.x + hit.face.x;
      const newY = hit.position.y + hit.face.y;
      const newZ = hit.position.z + hit.face.z;
      if (world.addBlock(hit.position.x, hit.position.y, hit.position.z, hit.face.x, hit.face.y, hit.face.z, placed)) {
        if (placed === BlockType.TORCH) {
          addTorchLight(newX, newY, newZ);
        }
        if (placed === BlockType.MAGMA) {
          addMagmaLight(newX, newY, newZ);
        }
      }
      lastBlockAction = time;
    }
  }

  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    if (document.pointerLockElement !== canvas) {
      return;
    }
    if (e.button !== 0 && e.button !== 2) {
      return;
    }
    mouseHeld = e.button;
    mouseHoldTime = e.timeStamp;
    doBlockAction(e.button, e.timeStamp);
  });

  canvas.addEventListener('mouseup', (e: MouseEvent) => {
    if (e.button === mouseHeld) {
      mouseHeld = -1;
    }
  });

  // --- Particle configs ---
  const rainConfig: ParticleGraphConfig = {
    emitter: {
      maxParticles: 80000,
      spawnRate: 24000,
      lifetime: [2.0, 3.5],
      shape: { kind: 'box', halfExtents: [35, 0.1, 35] },
      initialSpeed: [0, 0],
      initialColor: [0.75, 0.88, 1.0, 0.55],
      initialSize: [0.005, 0.009],
      roughness: 0.1,
      metallic: 0.0,
    },
    modifiers: [
      { type: 'gravity', strength: 9.0 },
      { type: 'drag', coefficient: 0.05 },
      { type: 'color_over_lifetime', startColor: [0.75, 0.88, 1.0, 0.55], endColor: [0.75, 0.88, 1.0, 0.0] },
      { type: 'block_collision' },
    ],
    renderer: { type: 'sprites', blendMode: 'alpha', billboard: 'velocity', renderTarget: 'hdr' },
  };

  const snowConfig: ParticleGraphConfig = {
    emitter: {
      maxParticles: 50000,
      spawnRate: 1500,
      lifetime: [30.0, 45.0],
      shape: { kind: 'box', halfExtents: [35, 0.1, 35] },
      initialSpeed: [0, 0],
      initialColor: [0.92, 0.96, 1.0, 0.85],
      initialSize: [0.025, 0.055],
      roughness: 0.1,
      metallic: 0.0,
    },
    modifiers: [
      { type: 'gravity', strength: 1.5 },
      { type: 'drag', coefficient: 0.8 },
      { type: 'curl_noise', scale: 1.0, strength: 1.0, timeScale: 1.0, octaves: 1 },
      //{ type: 'swirl_force', speed: 1.0, strength: 10.0 },
      //{ type: 'vortex', strength: 1.0 },
      { type: 'block_collision' },
    ],
    renderer: { type: 'sprites', blendMode: 'alpha', billboard: 'camera', renderTarget: 'hdr' },
  };

  // --- Effect toggles ---
  const effects = { ssao: true, ssgi: false, shadows: true, dof: true, bloom: true, godrays: true, fog: false, aces: true, ao_dbg: false, shd_dbg: false, hdr: true, auto_exp: false, rain: true, clouds: true };

  // --- Renderer ---

  const shadowPass = ShadowPass.create(ctx, 3);

  let currentWeatherEffect: EnvironmentEffect = EnvironmentEffect.None;

  let gbuffer!: GBuffer;
  let geometryPass!: GeometryPass;
  let worldGeometryPass!: WorldGeometryPass;
  let worldShadowPass!: WorldShadowPass;
  let waterPass!: WaterPass;
  let ssaoPass!: SSAOPass;
  let ssgiPass!: SSGIPass;
  let lightingPass!: LightingPass;
  let atmospherePass!: AtmospherePass;
  let pointSpotShadowPass!: PointSpotShadowPass;
  let pointSpotLightPass!: PointSpotLightPass;
  let taaPass!: TAAPass;
  let dofPass: DofPass | null = null;
  let bloomPass: BloomPass | null = null;
  let rainPass: ParticlePass | null = null;
  let godrayPass: GodrayPass | null = null;
  let cloudPass: CloudPass | null = null;
  let cloudShadowPass: CloudShadowPass | null = null;
  let blockHighlightPass!: BlockHighlightPass;
  let autoExposurePass!: AutoExposurePass;
  let compositePass!: CompositePass;
  let graph!: RenderGraph;
  let prevViewProj: Mat4 | null = null;

  function buildRenderTargets(): void {
    gbuffer?.destroy();
    geometryPass?.destroy();
    ssaoPass?.destroy();
    ssgiPass?.destroy();
    lightingPass?.destroy();
    atmospherePass?.destroy();
    pointSpotShadowPass?.destroy();
    pointSpotLightPass?.destroy();
    taaPass?.destroy();
    dofPass?.destroy(); dofPass = null;
    bloomPass?.destroy(); bloomPass = null;
    godrayPass?.destroy(); godrayPass = null;
    rainPass?.destroy(); rainPass = null;
    cloudPass?.destroy(); cloudPass = null;
    cloudShadowPass?.destroy(); cloudShadowPass = null;
    blockHighlightPass?.destroy();
    autoExposurePass?.destroy();
    compositePass?.destroy();

    // WorldGeometryPass / WaterPass / WorldShadowPass: persistent across resizes to preserve chunk GPU data.
    if (worldGeometryPass) {
      const newGbuf = GBuffer.create(ctx);
      worldGeometryPass.updateGBuffer(newGbuf);
      gbuffer = newGbuf;
    } else {
      gbuffer = GBuffer.create(ctx);
    }

    geometryPass = GeometryPass.create(ctx, gbuffer);

    if (!worldGeometryPass) {
      worldGeometryPass = WorldGeometryPass.create(ctx, gbuffer, blockTexture);
      worldShadowPass = WorldShadowPass.create(ctx, shadowPass.shadowMapArrayViews, 3, blockTexture);

      const onAdded = (chunk: Chunk, mesh: ChunkMesh) => {
        chunkMeshCache.set(chunk, mesh);
        worldGeometryPass.addChunk(chunk, mesh);
        worldShadowPass.addChunk(chunk, mesh);
        waterPass.addChunk(chunk, mesh);
      };
      const onUpdated = (chunk: Chunk, mesh: ChunkMesh) => {
        chunkMeshCache.set(chunk, mesh);
        worldGeometryPass.updateChunk(chunk, mesh);
        worldShadowPass.updateChunk(chunk, mesh);
        waterPass.updateChunk(chunk, mesh);
      };
      const onRemoved = (chunk: Chunk) => {
        chunkMeshCache.delete(chunk);
        worldGeometryPass.removeChunk(chunk);
        worldShadowPass.removeChunk(chunk);
        waterPass.removeChunk(chunk);
      };
      world.onChunkAdded = onAdded;
      world.onChunkUpdated = onUpdated;
      world.onChunkRemoved = onRemoved;
    }

    ssaoPass = SSAOPass.create(ctx, gbuffer);
    if (effects.clouds) {
      cloudShadowPass = CloudShadowPass.create(ctx, cloudNoises);
    }
    lightingPass = LightingPass.create(ctx, gbuffer, shadowPass, ssaoPass.aoView, cloudShadowPass?.shadowView, iblTextures);
    if (effects.godrays) {
      godrayPass = GodrayPass.create(ctx, gbuffer, shadowPass, lightingPass.hdrView, lightingPass.cameraBuffer, lightingPass.lightBuffer);
    }
    atmospherePass = AtmospherePass.create(ctx, lightingPass.hdrView);
    if (effects.clouds) {
      cloudPass = CloudPass.create(ctx, lightingPass.hdrView, gbuffer.depthView, cloudNoises);
    }
    pointSpotShadowPass = PointSpotShadowPass.create(ctx);
    pointSpotLightPass = PointSpotLightPass.create(ctx, gbuffer, pointSpotShadowPass, lightingPass.hdrView);
    taaPass = TAAPass.create(ctx, lightingPass, gbuffer);
    ssgiPass = SSGIPass.create(ctx, gbuffer, taaPass.historyView);
    lightingPass.updateSSGI(ssgiPass.resultView);

    // WaterPass: persistent but needs new render targets on resize.
    if (!waterPass) {
      waterPass = WaterPass.create(ctx, lightingPass.hdrTexture, lightingPass.hdrView, gbuffer.depthView,
        skyTexture, dudvTexture, gradientTexture);
      for (const [chunk, mesh] of chunkMeshCache) {
        waterPass.addChunk(chunk, mesh);
      }
    } else {
      waterPass.updateRenderTargets(lightingPass.hdrTexture, lightingPass.hdrView, gbuffer.depthView, skyTexture);
    }

    const postInput = effects.dof
      ? (dofPass = DofPass.create(ctx, taaPass.resolvedView, gbuffer.depthView), dofPass.resultView)
      : taaPass.resolvedView;

    const bloomOut = effects.bloom
      ? (bloomPass = BloomPass.create(ctx, postInput), bloomPass.resultView)
      : postInput;

    blockHighlightPass = BlockHighlightPass.create(ctx, bloomOut, gbuffer.depthView);

    autoExposurePass = AutoExposurePass.create(ctx, lightingPass.hdrTexture);
    autoExposurePass.enabled = effects.auto_exp;
    compositePass = CompositePass.create(ctx, bloomOut, ssaoPass.aoView, gbuffer.depthView, lightingPass.cameraBuffer, lightingPass.lightBuffer, autoExposurePass.exposureBuffer);
    compositePass.depthFogEnabled = effects.fog;

    camera.aspect = ctx.width / ctx.height;
    prevViewProj = null;

    graph = new RenderGraph();
    graph.addPass(shadowPass);
    if (cloudShadowPass) {
      graph.addPass(cloudShadowPass);
    }
    graph.addPass(worldShadowPass);
    graph.addPass(pointSpotShadowPass);
    graph.addPass(geometryPass);
    graph.addPass(worldGeometryPass);
    graph.addPass(ssaoPass);
    graph.addPass(ssgiPass);
    if (cloudPass) {
      graph.addPass(cloudPass); 
    } else {
      graph.addPass(atmospherePass);
    }
    graph.addPass(lightingPass);
    graph.addPass(pointSpotLightPass);
    graph.addPass(waterPass);
    if (godrayPass) {
      graph.addPass(godrayPass);
    }
    if (effects.rain && currentWeatherEffect !== EnvironmentEffect.None) {
      const weatherConfig = currentWeatherEffect === EnvironmentEffect.Snow ? snowConfig : rainConfig;
      rainPass = ParticlePass.create(ctx, weatherConfig, gbuffer, lightingPass.hdrView);
      graph.addPass(rainPass);
    }
    graph.addPass(taaPass);
    if (dofPass) {
      graph.addPass(dofPass);
    }
    if (bloomPass) {
      graph.addPass(bloomPass);
    }
    graph.addPass(blockHighlightPass);
    graph.addPass(autoExposurePass);
    graph.addPass(compositePass);
  }

  buildRenderTargets();

  // Spawn player standing on the terrain surface at the starting X/Z.
  // Force-generate the vertical column before the frame loop begins, centred at y=50
  // so render-distance covers chunks cy=-1..7 (world y 0-112, all realistic terrain).
  const spawnX = cameraGO.position.x;
  const spawnZ = cameraGO.position.z;
  {
    const savedRate = world.chunksPerFrame;
    world.chunksPerFrame = 200;
    world.update(new Vec3(spawnX, 50, spawnZ), 0);
    world.chunksPerFrame = savedRate;
    const topY = world.getTopBlockY(spawnX, spawnZ, 200);
    if (topY > 0) {
      cameraGO.position.y = topY + 1.62; // eye height above feet
      player.velY = 0; // suppress first-frame gravity drop
    }
  }

  // ── Duck spawning ─────────────────────────────────────────────────────────
  const duckBodyMesh = createDuckBodyMesh(device);
  const duckHeadMesh = createDuckHeadMesh(device);
  const duckBillMesh = createDuckBillMesh(device);

  function spawnDuck(wx: number, wz: number): void {
    const topY = world.getTopBlockY(wx, wz, 200);
    if (topY <= 0) return;
    const biome = world.getBiomeAt(wx, topY, wz);
    if (biome !== BiomeType.GrassyPlains) return;

    const duckRoot = new GameObject('Duck');
    duckRoot.position.set(wx + 0.5, topY, wz + 0.5);

    const bodyGO = new GameObject('Duck.Body');
    bodyGO.position.set(0, 0.15, 0);
    bodyGO.addComponent(new MeshRenderer(duckBodyMesh, { albedo: [0.93, 0.93, 0.93, 1], roughness: 0.9 }));
    duckRoot.addChild(bodyGO);

    const headGO = new GameObject('Duck.Head');
    headGO.position.set(0, 0.32, -0.12);
    headGO.addComponent(new MeshRenderer(duckHeadMesh, { albedo: [0.08, 0.32, 0.10, 1], roughness: 0.9 }));
    duckRoot.addChild(headGO);

    const billGO = new GameObject('Duck.Bill');
    billGO.position.set(0, 0.27, -0.205);
    billGO.addComponent(new MeshRenderer(duckBillMesh, { albedo: [1.0, 0.55, 0.05, 1], roughness: 0.8 }));
    duckRoot.addChild(billGO);

    duckRoot.addComponent(new DuckAI(world));
    scene.add(duckRoot);
  }

  // Scatter 10 ducks in GrassyPlains around the spawn point.
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
    const dist  = 8 + Math.random() * 20;
    spawnDuck(Math.floor(spawnX + Math.cos(angle) * dist), Math.floor(spawnZ + Math.sin(angle) * dist));
  }

  // --- UI ---

  const reticle = document.createElement('div');
  reticle.style.cssText = [
    'position:fixed', 'top:50%', 'left:50%',
    'width:16px', 'height:16px',
    'transform:translate(-50%,-50%)',
    'pointer-events:none',
  ].join(';');
  reticle.innerHTML = [
    `<div style="position:absolute;top:50%;left:0;width:100%;height:3px;background:#fff;opacity:0.8;transform:translateY(-50%)"></div>`,
    `<div style="position:absolute;left:50%;top:0;width:3px;height:100%;background:#fff;opacity:0.8;transform:translateX(-50%)"></div>`,
    `<div style="position:absolute;top:50%;left:50%;width:7px;height:3px;background:#fff;opacity:0.9;transform:translate(-50%,-50%);border-radius:50%"></div>`,
  ].join('');
  document.body.appendChild(reticle);

  const fpsEl = document.createElement('div');
  fpsEl.style.cssText = [
    'position:fixed', 'top:12px', 'right:12px',
    'font-family:ui-monospace,monospace', 'font-size:13px',
    'color:#ff0', 'background:rgba(0,0,0,0.45)',
    'padding:4px 8px', 'border-radius:4px', 'pointer-events:none',
  ].join(';');
  document.body.appendChild(fpsEl);

  const statsEl = document.createElement('div');
  statsEl.style.cssText = [
    'position:fixed', 'top:44px', 'right:12px',
    'font-family:ui-monospace,monospace', 'font-size:11px',
    'color:#aaf', 'background:rgba(0,0,0,0.45)',
    'padding:4px 8px', 'border-radius:4px', 'pointer-events:none',
    'white-space:pre',
  ].join(';');
  document.body.appendChild(statsEl);

  const biomeEl = document.createElement('div');
  biomeEl.style.cssText = [
    'position:fixed', 'bottom:12px', 'right:12px',
    'font-family:ui-monospace,monospace', 'font-size:13px',
    'color:#ff0', 'background:rgba(0,0,0,0.45)',
    'padding:4px 8px', 'border-radius:4px', 'pointer-events:none',
  ].join(';');
  document.body.appendChild(biomeEl);

  // --- Menu overlay ---

  const menuOverlay = document.createElement('div');
  menuOverlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:100',
    'background:rgba(0,0,0,0.78)',
    'display:none', 'align-items:center', 'justify-content:center',
    'font-family:ui-monospace,monospace',
  ].join(';');
  document.body.appendChild(menuOverlay);

  const menuCard = document.createElement('div');
  menuCard.style.cssText = [
    'display:flex', 'flex-direction:column', 'align-items:center', 'gap:24px',
    'padding:48px 56px',
    'background:rgba(255,255,255,0.04)',
    'border:1px solid rgba(255,255,255,0.12)',
    'border-radius:12px',
    'max-width:860px', 'width:90%',
  ].join(';');
  menuOverlay.appendChild(menuCard);

  const menuTitle = document.createElement('h1');
  menuTitle.textContent = 'CRAFTY';
  menuTitle.style.cssText = [
    'margin:0', 'font-size:52px', 'font-weight:900',
    'color:#fff', 'letter-spacing:0.12em',
    'text-shadow:0 0 48px rgba(100,200,255,0.45)',
    'font-family:ui-monospace,monospace',
  ].join(';');
  menuCard.appendChild(menuTitle);

  const resumeBtn = document.createElement('button');
  resumeBtn.textContent = 'Play';
  resumeBtn.style.cssText = [
    'padding:10px 40px', 'font-size:15px', 'font-family:ui-monospace,monospace',
    'background:#1a3a1a', 'color:#5f5',
    'border:1px solid #5f5', 'border-radius:6px',
    'cursor:pointer', 'letter-spacing:0.06em',
    'transition:background 0.15s',
  ].join(';');
  resumeBtn.addEventListener('mouseenter', () => { resumeBtn.style.background = '#243e24'; });
  resumeBtn.addEventListener('mouseleave', () => { resumeBtn.style.background = '#1a3a1a'; });
  resumeBtn.addEventListener('click', async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {});
    }
    canvas.requestPointerLock();
  });
  menuCard.appendChild(resumeBtn);

  const sep = document.createElement('div');
  sep.style.cssText = 'width:100%;height:1px;background:rgba(255,255,255,0.12)';
  menuCard.appendChild(sep);

  const { syncHotbar, refreshSlotHighlight } = createBlockManager(menuCard, colorAtlasUrl, () => hotbar.refresh(), hotbar.getSelectedSlot, hotbar.setSelectedSlot);

  const invSep = document.createElement('div');
  invSep.style.cssText = 'width:100%;height:1px;background:rgba(255,255,255,0.12)';
  menuCard.appendChild(invSep);

  const effectsLabel = document.createElement('div');
  effectsLabel.textContent = 'EFFECTS';
  effectsLabel.style.cssText = [
    'color:rgba(255,255,255,0.35)', 'font-size:11px',
    'letter-spacing:0.18em', 'align-self:flex-start',
  ].join(';');
  menuCard.appendChild(effectsLabel);

  createControlPanel(effects, (key) => {
    if (key === 'ssao') return;
    if (key === 'ssgi') return;
    if (key === 'shadows') return;
    if (key === 'aces') return;
    if (key === 'ao_dbg') return;
    if (key === 'shd_dbg') return;
    if (key === 'hdr') return;
    if (key === 'auto_exp') { autoExposurePass.enabled = effects.auto_exp; return; }
    if (key === 'fog') { compositePass.depthFogEnabled = effects.fog; return; }
    if (key === 'rain') { buildRenderTargets(); return; }
    if (key === 'clouds') { buildRenderTargets(); return; }
    buildRenderTargets();
  }, menuCard);

  // DoF mode selector — switches between the two composite algorithms
  const dofModeRow = document.createElement('div');
  dofModeRow.style.cssText = 'display:flex;align-items:center;gap:8px;font-family:ui-monospace,monospace;font-size:13px;user-select:none';
  const dofModeLabel = document.createElement('span');
  dofModeLabel.textContent = 'DOF';
  dofModeLabel.style.cssText = 'color:rgba(255,255,255,0.5);letter-spacing:0.05em';
  dofModeRow.appendChild(dofModeLabel);

  const DOF_MODES = ['CRAFTY', 'LITECRAFT'] as const;
  const SEL_STYLE  = 'background:#1a2e1a;color:#5f5;border-color:#5f5';
  const UNSEL_STYLE = 'background:#222;color:#888;border-color:#555';
  const dofModeBtns = DOF_MODES.map((label, i) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = `padding:4px 10px;border-width:1px;border-style:solid;border-radius:4px;cursor:pointer;letter-spacing:0.04em;${i === 0 ? SEL_STYLE : UNSEL_STYLE}`;
    btn.addEventListener('click', () => {
      if (dofPass) {
        dofPass.mode = i;
      }
      dofModeBtns.forEach((b, j) => b.setAttribute('style', `padding:4px 10px;border-width:1px;border-style:solid;border-radius:4px;cursor:pointer;letter-spacing:0.04em;${j === i ? SEL_STYLE : UNSEL_STYLE}`));
    });
    dofModeRow.appendChild(btn);
    return btn;
  });
  menuCard.appendChild(dofModeRow);

  hotbar.setOnSelectionChanged(refreshSlotHighlight);

  const escHint = document.createElement('div');
  escHint.textContent = 'ESC  ·  resume';
  escHint.style.cssText = [
    'color:rgba(255,255,255,0.25)', 'font-size:11px', 'letter-spacing:0.1em',
  ].join(';');
  menuCard.appendChild(escHint);

  let menuOpenedAt = 0;

  function openMenu(): void {
    menuOpenedAt = performance.now();
    syncHotbar();
    refreshSlotHighlight();
    menuOverlay.style.display = 'flex';
    reticle.style.display = 'none';
  }

  function closeMenu(): void {
    menuOverlay.style.display = 'none';
    reticle.style.display = '';
  }

  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && menuOverlay.style.display !== 'none') {
      // When ESC exits pointer lock, pointerlockchange and keydown can fire in either
      // order. If pointerlockchange fires first the menu is already open when keydown
      // arrives — the 200ms guard prevents that same ESC from immediately closing it.
      if (performance.now() - menuOpenedAt < 200) {
        return;
      }
      closeMenu();
      canvas.requestPointerLock();
    }
  });

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth  * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) {
      return;
    }
    canvas.width  = w;
    canvas.height = h;
    buildRenderTargets();
  });
  resizeObserver.observe(canvas);

  // Build a 128×128 heightmap (top solid-block Y) centred on the camera.
  const HM_RES = 128;
  const HM_EXTENT = 40.0;  // half-size in blocks — covers the rain emitter (halfExtents 35)
  const hmData = new Float32Array(HM_RES * HM_RES);
  let hmCamX = NaN;
  let hmCamZ = NaN;

  function updateHeightmap(cx: number, cz: number): void {
    if (Math.abs(cx - hmCamX) < 2 && Math.abs(cz - hmCamZ) < 2) {
      return;
    }
    hmCamX = cx; hmCamZ = cz;
    const step   = (HM_EXTENT * 2) / HM_RES;
    const startX = cx - HM_EXTENT;
    const startZ = cz - HM_EXTENT;
    const maxY   = Math.ceil(cz) + 80;  // generous ceiling above terrain
    for (let z = 0; z < HM_RES; z++) {
      for (let x = 0; x < HM_RES; x++) {
        hmData[z * HM_RES + x] = world.getTopBlockY(
          Math.floor(startX + x * step), Math.floor(startZ + z * step), maxY,
        );
      }
    }
  }

  let lastTime = 0;
  let smoothFps = 0;
  let lastHudUpdate = -Infinity;
  let sunAngle = Math.PI * 0.3;  // start in morning
  let waterTime = 0;
  let frameIndex = 0;
  let cloudWindX = 0;
  let cloudWindZ = 0;
  let cloudCoverage = getBiomeCloudCoverage(world.getBiomeAt(cameraGO.position.x, cameraGO.position.z));
  const _initBounds = getBiomeCloudBounds(world.getBiomeAt(cameraGO.position.x, cameraGO.position.z));
  let cloudBase = _initBounds.cloudBase;
  let cloudTop  = _initBounds.cloudTop;

  // Pre-allocated scratch objects reused every frame to avoid GC pressure.
  const _forward = new Vec3(0, 0, -1);
  // Identity matrix with mutable translation (col 3 = [tx, ty, tz, 1]).
  const _rainMat = new Mat4([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);

  function frame(time: number): void {
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    const updateHud = time - lastHudUpdate >= 1000;
    if (updateHud) lastHudUpdate = time;
    if (dt > 0) {
      smoothFps += (1 / dt - smoothFps) * 0.1;
    }

    sunAngle  += dt * 0.021;  // full day/night cycle ~5 minutes
    waterTime += dt;
    cloudWindX += dt * 1.5;
    cloudWindZ += dt * 0.5;

    // Great-circle sun path: 0=rising east, π/2=zenith, π=setting west, 3π/2=midnight
    const sinA = Math.sin(sunAngle);
    const rawDirX = 0.25;  // slight axial tilt so path isn't straight overhead
    const rawDirY = -sinA;
    const rawDirZ = Math.cos(sunAngle);
    const dLen = Math.sqrt(rawDirX * rawDirX + rawDirY * rawDirY + rawDirZ * rawDirZ);
    sun.direction.set(rawDirX / dLen, rawDirY / dLen, rawDirZ / dLen);

    // Intensity: bright at zenith, zero below horizon
    const elev = sinA;
    sun.intensity = Math.max(0, elev) * 3.0;
    // Warm orange near horizon, white at zenith
    const t = Math.max(0, elev);
    sun.color.set(1.0, 0.8 + 0.2 * t, 0.6 + 0.4 * t);

    if (usePlayerController) {
      player.update(cameraGO, dt);
    } else {
      freeCamera.update(cameraGO, dt);
    }
    updateTorchFlicker(time / 1000);
    updateMagmaFlicker(time / 1000);

    const camPos = camera.position();
    DuckAI.playerPos.x = camPos.x;
    DuckAI.playerPos.y = camPos.y;
    DuckAI.playerPos.z = camPos.z;

    scene.update(dt);
    world.update(camPos, dt);

    const biome = world.getBiomeAt(camPos.x, camPos.y, camPos.z);

    const weatherEffect = getBiomeEnvironmentEffect(biome);
    if (weatherEffect !== currentWeatherEffect) {
      currentWeatherEffect = weatherEffect;
      buildRenderTargets();
    }

    const targetCloudCoverage = getBiomeCloudCoverage(biome);
    cloudCoverage += (targetCloudCoverage - cloudCoverage) * Math.min(1, 0.3 * dt);
    const targetBounds = getBiomeCloudBounds(biome);
    cloudBase += (targetBounds.cloudBase - cloudBase) * Math.min(1, 0.3 * dt);
    cloudTop  += (targetBounds.cloudTop  - cloudTop)  * Math.min(1, 0.3 * dt);
    if (updateHud) {
      fpsEl.textContent = `${smoothFps.toFixed(0)} fps`;
      const kTris = (worldGeometryPass.triangles / 1000).toFixed(1);
      statsEl.textContent = `${worldGeometryPass.drawCalls} draws  ${kTris}k tris\n${world.chunkCount} chunks  ${world.pendingChunks} pending`;
      biomeEl.textContent = `${BiomeType[biome]}  coverage:${cloudCoverage.toFixed(2)}`;
    }

    const hi    = (frameIndex % 16) + 1;
    const jx    = (halton(hi, 2) - 0.5) * (2 / ctx.width);
    const jy    = (halton(hi, 3) - 0.5) * (2 / ctx.height);

    const vp      = camera.viewProjectionMatrix();
    const jitVP   = applyJitter(vp, jx, jy);
    const view    = camera.viewMatrix();
    const proj    = camera.projectionMatrix();
    const invVP   = vp.invert();
    const invProj = proj.invert();
    // Shadow far matches render distance (8 chunks × 16 = 128 blocks).
    // Using camera.far (1000) would make the last cascade's bounding sphere ~1500 units
    // wide, giving ~1.5 block/texel precision. At 128 the last cascade is ~0.2 block/texel.
    const cascades: CascadeData[] = sun.computeCascadeMatrices(camera, 128);

    const meshRenderers = scene.collectMeshRenderers();
    const drawItems: DrawItem[] = meshRenderers.map((mr: MeshRenderer) => {
      const w = mr.gameObject.localToWorld();
      return { mesh: mr.mesh, modelMatrix: w, normalMatrix: w.normalMatrix(), material: mr.material };
    });
    const shadowItems = meshRenderers
      .filter((mr: MeshRenderer) => mr.castShadow)
      .map((mr: MeshRenderer) => ({ mesh: mr.mesh, modelMatrix: mr.gameObject.localToWorld() }));

    shadowPass.setSceneSnapshot(shadowItems);
    shadowPass.updateScene(scene, camera, sun, 128);
    worldShadowPass.enabled = sun.intensity > 0;
    worldShadowPass.update(ctx, cascades, camPos.x, camPos.z);

    const dayT = Math.max(0, elev);
    const cloudAmbient: [number, number, number] = [
      0.02 + 0.38 * dayT,   // night: dim blue-grey, noon: 0.4
      0.03 + 0.52 * dayT,   // night: 0.03, noon: 0.55
      0.05 + 0.65 * dayT,   // night: 0.05, noon: 0.7
    ];
    const cloudSettings = { cloudBase, cloudTop, coverage: cloudCoverage, density: 4.0,
      windOffset: [cloudWindX, cloudWindZ] as [number, number],
      anisotropy: 0.85, extinction: 0.25, ambientColor: cloudAmbient, exposure: 1.0 };
    if (cloudShadowPass) {
      cloudShadowPass.update(ctx, cloudSettings, [camPos.x, camPos.z], 128);
    }
    if (cloudPass) {
      cloudPass.updateCamera(ctx, invVP, camPos, camera.near, camera.far);
      cloudPass.updateLight(ctx, sun.direction, sun.color, sun.intensity);
      cloudPass.updateSettings(ctx, cloudSettings);
    }

    const pointLights = scene.getComponents(PointLight);
    const spotLights = scene.getComponents(SpotLight);
    pointSpotShadowPass.update(pointLights, spotLights, shadowItems);
    pointSpotLightPass.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    pointSpotLightPass.updateLights(ctx, pointLights, spotLights);

    atmospherePass.update(ctx, invVP, camPos, sun.direction);

    geometryPass.setDrawItems(drawItems);
    geometryPass.updateCamera(ctx, view, proj, jitVP, invVP, camPos, camera.near, camera.far);

    worldGeometryPass.updateCamera(ctx, view, proj, jitVP, invVP, camPos, camera.near, camera.far);

    waterPass.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    waterPass.updateTime(ctx, waterTime, Math.max(0.01, dayT));

    lightingPass.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    lightingPass.updateLight(ctx, sun.direction, sun.color, sun.intensity, cascades, effects.shadows, effects.shd_dbg);
    lightingPass.updateCloudShadow(ctx, cloudShadowPass ? camPos.x : 0, cloudShadowPass ? camPos.z : 0, 128);

    ssaoPass.updateCamera(ctx, view, proj, invProj);
    ssaoPass.updateParams(ctx, 1.0, 0.005, effects.ssao ? 2.0 : 0.0);

    ssgiPass.enabled = effects.ssgi;
    ssgiPass.updateSettings({ strength: effects.ssgi ? 1.0 : 0.0 });
    if (effects.ssgi) {
      ssgiPass.updateCamera(ctx, view, proj, invProj, invVP, prevViewProj ?? vp, camPos);
    }

    const cosPitch = Math.cos(player.pitch);
    _forward.x = -Math.sin(player.yaw) * cosPitch;
    _forward.y = -Math.sin(player.pitch);
    _forward.z = -Math.cos(player.yaw) * cosPitch;
    const hit = world.getBlockByRay(camPos, _forward, 16);
    const MAX_REACH = 6;
    const inReach = !!(hit && hit.position.sub(camPos).length() <= MAX_REACH);
    targetBlock = inReach ? hit!.position : null;
    targetHit = inReach ? hit : null;
    blockHighlightPass.update(ctx, vp, targetBlock);

    if (mouseHeld >= 0 && document.pointerLockElement === canvas) {
      if (time - mouseHoldTime >= BLOCK_INITIAL_DELAY && time - lastBlockAction >= BLOCK_REPEAT_INTERVAL) {
        doBlockAction(mouseHeld, time);
      }
    }

    if (rainPass) {
      updateHeightmap(camPos.x, camPos.z);
      rainPass.updateHeightmap(ctx, hmData, camPos.x, camPos.z, HM_EXTENT);
      const spawnOffset = currentWeatherEffect === EnvironmentEffect.Snow ? 20 : 8;
      _rainMat.data[12] = camPos.x; _rainMat.data[13] = camPos.y + spawnOffset; _rainMat.data[14] = camPos.z;
      rainPass.update(ctx, dt, view, proj, vp, invVP, camPos, camera.near, camera.far, _rainMat);
    }

    dofPass?.updateParams(ctx, 8.0, 25.0, 6.0, camera.near, camera.far);
    godrayPass?.updateParams(ctx);
    const isUnderwater = camPos.y < 15.0;
    // sun_dir toward the sun = negate light.direction (which points from sun to scene)
    const sunDir = { x: -sun.direction.x, y: -sun.direction.y, z: -sun.direction.z };
    compositePass.updateParams(ctx, isUnderwater, waterTime, effects.aces, effects.ao_dbg, effects.hdr);
    compositePass.updateStars(ctx, invVP, camPos, sunDir);
    autoExposurePass.update(ctx, dt);
    taaPass.updateCamera(ctx, invVP, prevViewProj ?? vp);

    prevViewProj = vp;
    frameIndex++;

    graph.execute(ctx);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main().catch(err => {
  document.body.innerHTML = `<pre style="color:red;padding:1rem">${err}</pre>`;
  console.error(err);
});
