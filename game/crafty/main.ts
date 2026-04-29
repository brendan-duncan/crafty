import industrialUrl  from '../../assets/cubemaps/hdr/industrial.hdr?url';
import hotbarUrl      from '../../assets/ui/hotbar.png?url';
import colorAtlasUrl  from '../../assets/cube_textures/simple_block_atlas.png?url';
import normalAtlasUrl from '../../assets/cube_textures/simple_block_atlas_normal.png?url';
import merAtlasUrl    from '../../assets/cube_textures/simple_block_atlas_mer.png?url';
import heightAtlasUrl from '../../assets/cube_textures/simple_block_atlas_heightmap.png?url';
import dudvUrl        from '../../assets/water/waterDUDV.png?url';
import gradientUrl    from '../../assets/water/gradient_map.png?url';
import { Mat4, Vec3 } from '../../src/math/index.js';
import {
  GameObject, Scene, Camera, DirectionalLight, PlayerController,
  PointLight, SpotLight,
} from '../../src/engine/index.js';
import type { CascadeData } from '../../src/engine/index.js';
import {
  RenderContext, RenderGraph, GBuffer,
  ShadowPass, AtmospherePass, GeometryPass, LightingPass,
  TAAPass, SSAOPass, SSGIPass, DofPass, BloomPass, TonemapPass,
  AutoExposurePass, PointSpotShadowPass, PointSpotLightPass,
  WorldGeometryPass, WaterPass, WorldShadowPass, UnderwaterPass,
  BlockHighlightPass, ParticlePass,
  CloudPass, CloudShadowPass,
} from '../../src/renderer/index.js';
import { createCloudNoiseTextures } from '../../src/assets/cloud_noise.js';
import type { CloudNoiseTextures } from '../../src/assets/cloud_noise.js';
import type { ParticleGraphConfig } from '../../src/particles/index.js';
import { Texture } from '../../src/assets/texture.js';
import { parseHdr, createHdrTexture } from '../../src/assets/hdr_loader.js';
import { BlockTexture } from '../../src/assets/block_texture.js';
import { World, BlockType, blockTextureOffsetData, EnvironmentEffect, getBiomeEnvironmentEffect } from '../../src/block/index.js';
import type { Chunk, ChunkMesh } from '../../src/block/index.js';
import type { DrawItem } from '../../src/renderer/passes/geometry_pass.js';

// ── Hotbar ────────────────────────────────────────────────────────────────────

const HOTBAR_SLOTS: BlockType[] = [
  BlockType.DIRT,
  BlockType.GRASS,
  BlockType.STONE,
  BlockType.SAND,
  BlockType.TRUNK,
  BlockType.SPRUCE_PLANKS,
  BlockType.GLASS,
  BlockType.GLOWSTONE,
  BlockType.DIAMOND,
];

function createHotbar(atlasUrl: string): { getSelected: () => BlockType } {
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

  function updateSelection() {
    const barRect = bar.getBoundingClientRect();
    // Each slot is 40px wide; centre the 44px selector over the active slot
    sel.style.left = (barRect.left - 2 + selected * 40) + 'px';
  }

  // ── Draw block icons once the atlas is loaded ──
  const img = new Image();
  img.src = atlasUrl;
  img.onload = () => {
    const TILE = 16;
    for (let i = 0; i < N; i++) {
      const tod = blockTextureOffsetData.find(d => d.blockType === HOTBAR_SLOTS[i]);
      if (!tod) continue;
      const tx = tod.sideFace.x * TILE;
      const ty = tod.sideFace.y * TILE;
      const ctx2 = canvases[i].getContext('2d')!;
      ctx2.imageSmoothingEnabled = false;
      ctx2.drawImage(img, tx, ty, TILE, TILE, 0, 0, 32, 32);
    }
  };

  // ── Input ──
  window.addEventListener('keydown', (e) => {
    const n = parseInt(e.key);
    if (n >= 1 && n <= N) { selected = n - 1; updateSelection(); }
  });

  window.addEventListener('wheel', (e) => {
    selected = (selected + (e.deltaY > 0 ? 1 : N - 1)) % N;
    updateSelection();
  }, { passive: true });

  // Delay first position update until bar is laid out
  requestAnimationFrame(updateSelection);

  return { getSelected: () => HOTBAR_SLOTS[selected] };
}

function halton(index: number, base: number): number {
  let result = 0, f = 1;
  while (index > 0) { f /= base; result += f * (index % base); index = Math.floor(index / base); }
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

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) throw new Error('No canvas element');

  const ctx = await RenderContext.create(canvas);
  const { device } = ctx;

  const skyTexture    = await createHdrTexture(device, parseHdr(await (await fetch(industrialUrl)).arrayBuffer()));
  const cloudNoises: CloudNoiseTextures = createCloudNoiseTextures(device);

  const blockTexture   = await BlockTexture.load(device, colorAtlasUrl, normalAtlasUrl, merAtlasUrl, heightAtlasUrl);
  const dudvTexture    = await Texture.fromUrl(device, dudvUrl);
  const gradientTexture = await Texture.fromUrl(device, gradientUrl);

  // --- Hotbar ---

  const hotbar = createHotbar(colorAtlasUrl);

  // --- World ---

  //const world = new World(42);
  const world = new World(454321);
  const chunkMeshCache = new Map<Chunk, ChunkMesh>();

  // --- Scene ---

  const scene = new Scene();

  const sunGO = new GameObject('Sun');
  const sun   = sunGO.addComponent(new DirectionalLight(new Vec3(0.3, -1, 0.5), Vec3.one(), 3, 3));
  scene.add(sunGO);

  const cameraGO = new GameObject('Camera');
  cameraGO.position.set(64, 25, 64);  // eye position; player falls to ground on start
  const camera = cameraGO.addComponent(new Camera(70, 0.1, 1000, ctx.width / ctx.height));
  scene.add(cameraGO);

  const player = new PlayerController(world, Math.PI, 0.1);
  player.attach(canvas);

  let targetBlock: Vec3 | null = null;
  let targetHit: { position: Vec3; face: Vec3 } | null = null;

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    if (document.pointerLockElement !== canvas) return;
    const isPlace = e.button === 2 || (e.button === 0 && e.ctrlKey);
    if (!isPlace && e.button === 0 && targetBlock) {
      world.mineBlock(targetBlock.x, targetBlock.y, targetBlock.z);
    } else if (isPlace && targetHit) {
      const hit = targetHit;
      world.addBlock(hit.position.x, hit.position.y, hit.position.z, hit.face.x, hit.face.y, hit.face.z, hotbar.getSelected());
    }
  });

  // --- Particle configs ---
  const rainConfig: ParticleGraphConfig = {
    emitter: {
      maxParticles: 30000,
      spawnRate: 9000,
      lifetime: [2.0, 3.5],
      shape: { kind: 'box', halfExtents: [35, 0.1, 35] },
      initialSpeed: [0, 0],
      initialColor: [0.75, 0.88, 1.0, 0.55],
      initialSize: [0.012, 0.02],
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
      maxParticles: 5000,
      spawnRate: 150,
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
      { type: 'block_collision' },
    ],
    renderer: { type: 'sprites', blendMode: 'alpha', billboard: 'camera', renderTarget: 'hdr' },
  };

  // --- Effect toggles ---
  const effects = { ssao: true, ssgi: false, shadows: true, dof: true, bloom: true, aces: true, ao_dbg: false, shd_dbg: false, hdr: true, auto_exp: false, rain: true, clouds: true };

  // --- Renderer ---

  const shadowPass = ShadowPass.create(ctx, 3);

  let currentWeatherEffect: EnvironmentEffect = EnvironmentEffect.None;

  let gbuffer!            : GBuffer;
  let geometryPass!       : GeometryPass;
  let worldGeometryPass!  : WorldGeometryPass;
  let worldShadowPass!    : WorldShadowPass;
  let waterPass!          : WaterPass;
  let ssaoPass!           : SSAOPass;
  let ssgiPass!           : SSGIPass;
  let lightingPass!       : LightingPass;
  let atmospherePass!     : AtmospherePass;
  let pointSpotShadowPass!: PointSpotShadowPass;
  let pointSpotLightPass! : PointSpotLightPass;
  let taaPass!            : TAAPass;
  let dofPass             : DofPass        | null = null;
  let bloomPass           : BloomPass      | null = null;
  let rainPass            : ParticlePass   | null = null;
  let cloudPass           : CloudPass      | null = null;
  let cloudShadowPass     : CloudShadowPass | null = null;
  let underwaterPass!     : UnderwaterPass;
  let blockHighlightPass! : BlockHighlightPass;
  let autoExposurePass!   : AutoExposurePass;
  let tonemapPass!        : TonemapPass;
  let graph!              : RenderGraph;
  let prevViewProj        : Mat4 | null = null;

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
    dofPass?.destroy();          dofPass          = null;
    bloomPass?.destroy();        bloomPass        = null;
    rainPass?.destroy();         rainPass         = null;
    cloudPass?.destroy();        cloudPass        = null;
    cloudShadowPass?.destroy();  cloudShadowPass  = null;
    underwaterPass?.destroy();
    blockHighlightPass?.destroy();
    autoExposurePass?.destroy();
    tonemapPass?.destroy();

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
      worldShadowPass   = WorldShadowPass.create(ctx, shadowPass.shadowMapArrayViews, 3, blockTexture);

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
      world.onChunkAdded   = onAdded;
      world.onChunkUpdated = onUpdated;
      world.onChunkRemoved = onRemoved;
    }

    ssaoPass            = SSAOPass.create(ctx, gbuffer);
    if (effects.clouds) cloudShadowPass = CloudShadowPass.create(ctx, cloudNoises);
    lightingPass        = LightingPass.create(ctx, gbuffer, shadowPass, ssaoPass.aoView, cloudShadowPass?.shadowView);
    atmospherePass      = AtmospherePass.create(ctx, lightingPass.hdrView);
    if (effects.clouds) cloudPass = CloudPass.create(ctx, lightingPass.hdrView, gbuffer.depthView, cloudNoises);
    pointSpotShadowPass = PointSpotShadowPass.create(ctx);
    pointSpotLightPass  = PointSpotLightPass.create(ctx, gbuffer, pointSpotShadowPass, lightingPass.hdrView);
    taaPass             = TAAPass.create(ctx, lightingPass, gbuffer);
    ssgiPass            = SSGIPass.create(ctx, gbuffer, taaPass.historyView);
    lightingPass.updateSSGI(ssgiPass.resultView);

    // WaterPass: persistent but needs new render targets on resize.
    if (!waterPass) {
      waterPass = WaterPass.create(ctx, lightingPass.hdrTexture, lightingPass.hdrView, gbuffer.depthView, skyTexture, dudvTexture, gradientTexture);
      for (const [chunk, mesh] of chunkMeshCache) waterPass.addChunk(chunk, mesh);
    } else {
      waterPass.updateRenderTargets(lightingPass.hdrTexture, lightingPass.hdrView, gbuffer.depthView, skyTexture);
    }

    const postInput = effects.dof
      ? (dofPass = DofPass.create(ctx, taaPass.resolvedView, gbuffer.depthView), dofPass.resultView)
      : taaPass.resolvedView;

    const bloomOut = effects.bloom
      ? (bloomPass = BloomPass.create(ctx, postInput), bloomPass.resultView)
      : postInput;

    underwaterPass     = UnderwaterPass.create(ctx, bloomOut);
    blockHighlightPass = BlockHighlightPass.create(ctx, underwaterPass.resultView, gbuffer.depthView);

    autoExposurePass = AutoExposurePass.create(ctx, lightingPass.hdrTexture);
    autoExposurePass.enabled = effects.auto_exp;
    tonemapPass      = TonemapPass.create(ctx, underwaterPass.resultView, ssaoPass.aoView, autoExposurePass.exposureBuffer, gbuffer.depthView);

    camera.aspect = ctx.width / ctx.height;
    prevViewProj  = null;

    graph = new RenderGraph();
    graph.addPass(shadowPass);
    if (cloudShadowPass) graph.addPass(cloudShadowPass);
    graph.addPass(worldShadowPass);
    graph.addPass(pointSpotShadowPass);
    graph.addPass(geometryPass);
    graph.addPass(worldGeometryPass);
    graph.addPass(ssaoPass);
    graph.addPass(ssgiPass);
    if (cloudPass) graph.addPass(cloudPass); else graph.addPass(atmospherePass);
    graph.addPass(lightingPass);
    graph.addPass(pointSpotLightPass);
    graph.addPass(waterPass);
    if (effects.rain && currentWeatherEffect !== EnvironmentEffect.None) {
      const weatherConfig = currentWeatherEffect === EnvironmentEffect.Snow ? snowConfig : rainConfig;
      rainPass = ParticlePass.create(ctx, weatherConfig, gbuffer, lightingPass.hdrView);
      graph.addPass(rainPass);
    }
    graph.addPass(taaPass);
    if (dofPass)   graph.addPass(dofPass);
    if (bloomPass) graph.addPass(bloomPass);
    graph.addPass(underwaterPass);
    graph.addPass(blockHighlightPass);
    graph.addPass(autoExposurePass);
    graph.addPass(tonemapPass);
  }

  buildRenderTargets();

  // --- UI ---

  const reticle = document.createElement('div');
  reticle.style.cssText = [
    'position:fixed', 'top:50%', 'left:50%',
    'width:16px', 'height:16px',
    'transform:translate(-50%,-50%)',
    'pointer-events:none',
  ].join(';');
  reticle.innerHTML = [
    `<div style="position:absolute;top:50%;left:0;width:100%;height:1px;background:#fff;opacity:0.8;transform:translateY(-50%)"></div>`,
    `<div style="position:absolute;left:50%;top:0;width:1px;height:100%;background:#fff;opacity:0.8;transform:translateX(-50%)"></div>`,
    `<div style="position:absolute;top:50%;left:50%;width:3px;height:3px;background:#fff;opacity:0.9;transform:translate(-50%,-50%);border-radius:50%"></div>`,
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
    'max-width:520px', 'width:90%',
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
  resumeBtn.textContent = 'Resume';
  resumeBtn.style.cssText = [
    'padding:10px 40px', 'font-size:15px', 'font-family:ui-monospace,monospace',
    'background:#1a3a1a', 'color:#5f5',
    'border:1px solid #5f5', 'border-radius:6px',
    'cursor:pointer', 'letter-spacing:0.06em',
    'transition:background 0.15s',
  ].join(';');
  resumeBtn.addEventListener('mouseenter', () => { resumeBtn.style.background = '#243e24'; });
  resumeBtn.addEventListener('mouseleave', () => { resumeBtn.style.background = '#1a3a1a'; });
  resumeBtn.addEventListener('click', () => canvas.requestPointerLock());
  menuCard.appendChild(resumeBtn);

  const sep = document.createElement('div');
  sep.style.cssText = 'width:100%;height:1px;background:rgba(255,255,255,0.12)';
  menuCard.appendChild(sep);

  const effectsLabel = document.createElement('div');
  effectsLabel.textContent = 'EFFECTS';
  effectsLabel.style.cssText = [
    'color:rgba(255,255,255,0.35)', 'font-size:11px',
    'letter-spacing:0.18em', 'align-self:flex-start',
  ].join(';');
  menuCard.appendChild(effectsLabel);

  createControlPanel(effects, (key) => {
    if (key === 'ssao')    return;
    if (key === 'ssgi')    return;
    if (key === 'shadows') return;
    if (key === 'aces')     return;
    if (key === 'ao_dbg')   return;
    if (key === 'shd_dbg')  return;
    if (key === 'hdr')      return;
    if (key === 'auto_exp') { autoExposurePass.enabled = effects.auto_exp; return; }
    if (key === 'rain')     { buildRenderTargets(); return; }
    if (key === 'clouds')   { buildRenderTargets(); return; }
    buildRenderTargets();
  }, menuCard);

  const escHint = document.createElement('div');
  escHint.textContent = 'ESC  ·  resume';
  escHint.style.cssText = [
    'color:rgba(255,255,255,0.25)', 'font-size:11px', 'letter-spacing:0.1em',
  ].join(';');
  menuCard.appendChild(escHint);

  let menuOpenedAt = 0;

  function openMenu(): void {
    menuOpenedAt = performance.now();
    menuOverlay.style.display = 'flex';
    reticle.style.display = 'none';
  }

  function closeMenu(): void {
    menuOverlay.style.display = 'none';
    reticle.style.display = '';
  }

  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) closeMenu();
    else openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && menuOverlay.style.display !== 'none') {
      // When ESC exits pointer lock, pointerlockchange and keydown can fire in either
      // order. If pointerlockchange fires first the menu is already open when keydown
      // arrives — the 200ms guard prevents that same ESC from immediately closing it.
      if (performance.now() - menuOpenedAt < 200) return;
      closeMenu();
      canvas.requestPointerLock();
    }
  });

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth  * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width  = w;
    canvas.height = h;
    buildRenderTargets();
  });
  resizeObserver.observe(canvas);

  // Build a 128×128 heightmap (top solid-block Y) centred on the camera.
  const HM_RES    = 128;
  const HM_EXTENT = 40.0;  // half-size in blocks — covers the rain emitter (halfExtents 35)
  const hmData    = new Float32Array(HM_RES * HM_RES);
  let   hmCamX    = NaN;
  let   hmCamZ    = NaN;

  function updateHeightmap(cx: number, cz: number): void {
    if (Math.abs(cx - hmCamX) < 2 && Math.abs(cz - hmCamZ) < 2) return;
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

  let lastTime   = 0;
  let smoothFps  = 0;
  let sunAngle   = Math.PI * 0.3;  // start in morning
  let waterTime  = 0;
  let frameIndex = 0;
  let cloudWindX = 0;
  let cloudWindZ = 0;

  function frame(time: number): void {
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    if (dt > 0) {
      smoothFps += (1 / dt - smoothFps) * 0.1;
      fpsEl.textContent = `${smoothFps.toFixed(0)} fps`;
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

    player.update(cameraGO, dt);
    scene.update(dt);

    const camPos = camera.position();
    world.update(camPos, dt);

    const weatherEffect = getBiomeEnvironmentEffect(world.getBiomeAt(camPos.x, camPos.z));
    if (weatherEffect !== currentWeatherEffect) {
      currentWeatherEffect = weatherEffect;
      buildRenderTargets();
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
    const cascades: CascadeData[] = sun.computeCascadeMatrices(camera);

    const meshRenderers = scene.collectMeshRenderers();
    const drawItems: DrawItem[] = meshRenderers.map(mr => {
      const w = mr.gameObject.localToWorld();
      return { mesh: mr.mesh, modelMatrix: w, normalMatrix: w.normalMatrix(), material: mr.material };
    });
    const shadowItems = meshRenderers
      .filter(mr => mr.castShadow)
      .map(mr => ({ mesh: mr.mesh, modelMatrix: mr.gameObject.localToWorld() }));

    shadowPass.setSceneSnapshot(shadowItems);
    shadowPass.updateScene(scene, camera, sun);
    worldShadowPass.update(ctx, cascades);

    const dayT = Math.max(0, elev);
    const cloudAmbient: [number, number, number] = [
      0.02 + 0.38 * dayT,   // night: dim blue-grey, noon: 0.4
      0.03 + 0.52 * dayT,   // night: 0.03, noon: 0.55
      0.05 + 0.65 * dayT,   // night: 0.05, noon: 0.7
    ];
    const cloudSettings = { cloudBase: 35, cloudTop: 55, coverage: 0.88, density: 4.0,
      windOffset: [cloudWindX, cloudWindZ] as [number, number],
      anisotropy: 0.85, extinction: 0.25, ambientColor: cloudAmbient, exposure: 1.0 };
    if (cloudShadowPass) cloudShadowPass.update(ctx, cloudSettings, [camPos.x, camPos.z], 128);
    if (cloudPass) {
      cloudPass.updateCamera(ctx, invVP, camPos, camera.near, camera.far);
      cloudPass.updateLight(ctx, sun.direction, sun.color, sun.intensity);
      cloudPass.updateSettings(ctx, cloudSettings);
    }

    const pointLights = scene.getComponents(PointLight);
    const spotLights  = scene.getComponents(SpotLight);
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

    ssgiPass.updateSettings({ strength: effects.ssgi ? 1.0 : 0.0 });
    ssgiPass.updateCamera(ctx, view, proj, invProj, invVP, prevViewProj ?? vp, camPos);

    const cosPitch = Math.cos(player.pitch);
    const forward  = new Vec3(
      -Math.sin(player.yaw) * cosPitch,
      -Math.sin(player.pitch),
      -Math.cos(player.yaw) * cosPitch,
    );
    const hit = world.getBlockByRay(camPos, forward, 16);
    const MAX_REACH = 6;
    const inReach = !!(hit && hit.position.sub(camPos).length() <= MAX_REACH);
    targetBlock = inReach ? hit!.position : null;
    targetHit   = inReach ? hit : null;
    blockHighlightPass.update(ctx, vp, targetBlock);

    if (rainPass) {
      updateHeightmap(camPos.x, camPos.z);
      rainPass.updateHeightmap(ctx, hmData, camPos.x, camPos.z, HM_EXTENT);
      const spawnOffset = currentWeatherEffect === EnvironmentEffect.Snow ? 20 : 8;
      const rainMat = new Mat4([1,0,0,0, 0,1,0,0, 0,0,1,0, camPos.x, camPos.y + spawnOffset, camPos.z, 1]);
      rainPass.update(ctx, dt, view, proj, vp, invVP, camPos, camera.near, camera.far, rainMat);
    }

    dofPass?.updateParams(ctx, 8.0, 25.0, 6.0, camera.near, camera.far);
    underwaterPass.updateParams(ctx, camPos.y < 15.0, waterTime);
    tonemapPass.updateParams(ctx, effects.aces, effects.ao_dbg, effects.hdr);
    // sun_dir toward the sun = negate light.direction (which points from sun to scene)
    const sunDir = { x: -sun.direction.x, y: -sun.direction.y, z: -sun.direction.z };
    tonemapPass.updateStars(ctx, invVP, camPos, sunDir);
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
