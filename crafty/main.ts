import skyHdrUrl from '../assets/cubemaps/hdr/clear_sky.hdr?url';
import colorAtlasUrl from '../assets/cube_textures/simple_block_atlas.png?url';
import normalAtlasUrl from '../assets/cube_textures/simple_block_atlas_normal.png?url';
import merAtlasUrl from '../assets/cube_textures/simple_block_atlas_mer.png?url';
import heightAtlasUrl from '../assets/cube_textures/simple_block_atlas_heightmap.png?url';
import dudvUrl from '../assets/water/waterDUDV.png?url';
import gradientUrl from '../assets/water/gradient_map.png?url';
import flashlightUrl from '../assets/flashlight.jpg?url';
import { Mat4, Vec3 } from '../src/math/index.js';
import { GameObject, Scene, DirectionalLight } from '../src/engine/index.js';
import type { CascadeData } from '../src/engine/index.js';
import { RenderContext, ShadowPass } from '../src/renderer/index.js';
import { createCloudNoiseTextures } from '../src/assets/cloud_noise.js';
import type { CloudNoiseTextures } from '../src/assets/cloud_noise.js';
import { computeIblGpu } from '../src/assets/ibl.js';
import type { IblTextures } from '../src/assets/ibl.js';
import { Texture } from '../src/assets/texture.js';
import { parseHdr, createHdrTexture } from '../src/assets/hdr_loader.js';
import { BlockTexture } from '../src/assets/block_texture.js';
import { World, BiomeType, EnvironmentEffect, getBiomeEnvironmentEffect, getBiomeCloudCoverage, getBiomeCloudBounds, isBlockWater } from '../src/block/index.js';
import type { Chunk, ChunkMesh } from '../src/block/index.js';
import type { DrawItem } from '../src/renderer/passes/geometry_pass.js';
import { createDuckBodyMesh, createDuckHeadMesh, createDuckBillMesh } from '../src/assets/duck_mesh.js';
import { createPigBodyMesh, createPigHeadMesh, createPigSnoutMesh } from '../src/assets/pig_mesh.js';
import { DuckAI } from '../src/engine/components/duck_ai.js';
import { MeshRenderer } from '../src/engine/index.js';
import { PointLight } from '../src/engine/index.js';
import { SpotLight } from '../src/engine/components/spot_light.js';

// UI imports
import { createHotbar } from './ui/hotbar.js';
import { createBlockManager } from './ui/block_manager.js';
import { createControlPanel } from './ui/control_panel.js';
import { createMenu } from './ui/menu.js';
import { createHud } from './ui/hud.js';

// Game logic imports
import { setupPlayer } from './game/player_setup.js';
import { createBlockInteractionState, setupBlockInteractionHandlers, updateBlockInteraction, applyRemoteBlockEdit } from './game/block_interaction.js';
import { setupTouchControlsLazy, isTouchDevice } from './game/touch_controls.js';
import { updateTorchFlicker, updateMagmaFlicker } from './game/lights.js';
import { setupAnimalSpawning } from './game/animal_spawner.js';
import { HeightmapManager } from './game/heightmap.js';
import { NetworkClient, type ConnectResult } from './game/network_client.js';
import { RemotePlayer, createRemotePlayerMeshes } from './game/remote_player.js';
import { NameLabelLayer } from './game/name_label.js';
import type { BlockEdit } from '../shared/net_protocol.js';
import { CURRENT_FORMAT_VERSION, type WorldStorage, type SavedWorld } from './game/world_storage.js';

// UI imports (continued)
import { showStartScreen } from './ui/start_screen.js';

// Config imports
import { DEFAULT_EFFECTS } from './config/effect_settings.js';

// Renderer imports
import { buildRenderTargets } from './renderer_setup.js';
import type { RenderPasses } from './renderer_setup.js';

// Utils
import { halton, applyJitter } from './utils.js';

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('No canvas element');
  }

  // Launcher: pick a local seed or connect to a server before any GPU work.
  const startChoice = await showStartScreen();
  const playerName = startChoice.playerName;
  const network: NetworkClient | null = startChoice.mode === 'network' ? startChoice.network : null;
  const welcome: ConnectResult | null = startChoice.mode === 'network' ? startChoice.welcome : null;
  const savedWorld: SavedWorld | null = startChoice.mode === 'local' ? startChoice.world : null;
  const worldStorage: WorldStorage | null = startChoice.mode === 'local' ? startChoice.storage : null;
  if (welcome !== null) {
    console.log(`[crafty] connected as player ${welcome.playerId} "${playerName}" (${welcome.players.length} other(s) online, ${welcome.edits.length} replay edits)`);
  } else if (savedWorld !== null) {
    // Migrate older saved worlds. Pre-v1 'place' edits stored x/y/z as the
    // *placed* cell (hit + face) but kept the face vector — replay would
    // then double-add the face. Subtract face once to recover the hit
    // position, which is what the current applyRemoteBlockEdit expects.
    const v = savedWorld.version ?? 0;
    if (v < 1) {
      let migrated = 0;
      for (const e of savedWorld.edits) {
        if (e.kind === 'place') {
          e.x -= e.fx ?? 0;
          e.y -= e.fy ?? 0;
          e.z -= e.fz ?? 0;
          migrated++;
        }
      }
      savedWorld.version = CURRENT_FORMAT_VERSION;
      console.log(`[crafty] migrated saved world to v${CURRENT_FORMAT_VERSION} (${migrated} place edits rewritten)`);
    }
    console.log(`[crafty] starting local world "${savedWorld.name}" (seed=${savedWorld.seed}, ${savedWorld.edits.length} edits to replay)`);
  }

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: false });
  const { device } = ctx;

  // Load assets
  const skyTexture = await createHdrTexture(device, parseHdr(await (await fetch(skyHdrUrl)).arrayBuffer()));
  const iblTextures: IblTextures = await computeIblGpu(device, skyTexture.gpuTexture);
  const cloudNoises: CloudNoiseTextures = createCloudNoiseTextures(device);
  const blockTexture = await BlockTexture.load(device, colorAtlasUrl, normalAtlasUrl, merAtlasUrl, heightAtlasUrl);
  const dudvTexture = await Texture.fromUrl(device, dudvUrl);
  const gradientTexture = await Texture.fromUrl(device, gradientUrl);
  const flashlightTexture = await Texture.fromUrl(device, flashlightUrl, {
    resizeWidth: 256,
    resizeHeight: 256,
    usage: 0x07,
  });

  // Create UI
  const hotbar = createHotbar(colorAtlasUrl);
  const hud = createHud();
  const menu = createMenu(canvas, hud.reticle);

  // Create world and scene
  const worldSeed = welcome?.seed ?? savedWorld?.seed ?? 13;
  const world = new World(worldSeed);
  if (isTouchDevice()) {
    world.renderDistanceH = 4;
    world.renderDistanceV = 3;
  }
  const chunkMeshCache = new Map<Chunk, ChunkMesh>();
  const scene = new Scene();

  // Setup sun
  const sunGO = new GameObject('Sun');
  const sun = sunGO.addComponent(new DirectionalLight(new Vec3(0.3, -1, 0.5), Vec3.one(), 6, 3));
  scene.add(sunGO);

  // Setup player and camera
  const playerSetup = setupPlayer(canvas, scene, world, ctx.width, ctx.height, flashlightTexture.gpuTexture, hud.reticle, hotbar.element);
  const { cameraGO, camera, player, freeCamera, flashlight } = playerSetup;

  // Block interaction
  const blockInteraction = createBlockInteractionState();
  setupBlockInteractionHandlers(canvas, blockInteraction, world, () => hotbar.getSelected(), scene);

  // Mobile / touch controls — initialised on the first real `touchstart` event,
  // which is more reliable than capability detection on some browsers / webviews.
  setupTouchControlsLazy(canvas, {
    player,
    camera: freeCamera,
    getActive: () => playerSetup.isPlayerMode() ? 'player' : 'camera',
    world,
    scene,
    blockInteraction,
    getSelectedBlock: () => hotbar.getSelected(),
    onLookDoubleTap: () => playerSetup.toggleController(),
    onMenu: () => menu.open(),
  }, () => {
    // Once we know it's a touch device, don't fight it with pointer-lock.
    player.usePointerLock = false;
    freeCamera.usePointerLock = false;
  });

  // Effects
  const effects = { ...DEFAULT_EFFECTS };

  // Renderer setup
  const shadowPass = ShadowPass.create(ctx, 3);
  let passes: Partial<RenderPasses> = { shadowPass, currentWeatherEffect: EnvironmentEffect.None };

  async function rebuildRenderTargets(): Promise<void> {
    const newPasses = await buildRenderTargets(
      ctx, passes, effects, blockTexture, skyTexture, dudvTexture,
      gradientTexture, iblTextures, cloudNoises, world, chunkMeshCache,
    );
    passes = newPasses;
    camera.aspect = ctx.width / ctx.height;
  }

  await rebuildRenderTargets();

  // Register animal spawning on chunk load — must happen before world.update
  // so the initial bulk-load also populates animals near the spawn point.
  setupAnimalSpawning(world, scene, {
    duckBody:    createDuckBodyMesh(device),
    duckHead:    createDuckHeadMesh(device),
    duckBill:    createDuckBillMesh(device),
    ducklingBody: createDuckBodyMesh(device, 0.5),
    ducklingHead: createDuckHeadMesh(device, 0.5),
    ducklingBill: createDuckBillMesh(device, 0.5),
    pigBody:     createPigBodyMesh(device, 1.0),
    pigHead:     createPigHeadMesh(device, 1.0),
    pigSnout:    createPigSnoutMesh(device, 1.0),
    babyPigBody:  createPigBodyMesh(device, 0.55),
    babyPigHead:  createPigHeadMesh(device, 0.55),
    babyPigSnout: createPigSnoutMesh(device, 0.55),
  });

  // ── Multiplayer wiring ────────────────────────────────────────────────────
  // Server-authoritative block edits arrive as a list at welcome time + a
  // stream of `block_edit` events. They're applied via `applyRemoteBlockEdit`
  // which skips the local-edit callback so we don't echo them back.
  // Edits are also bucketed per chunk so they re-apply when a chunk is loaded
  // (or reloaded after eviction); the seeded chunk generation otherwise wipes
  // them out on chunk re-entry.
  const CW = 16, CH = 16, CD = 16;
  const _chunkKey = (x: number, y: number, z: number): string =>
    `${Math.floor(x / CW)},${Math.floor(y / CH)},${Math.floor(z / CD)}`;
  const pendingEditsByChunk = new Map<string, BlockEdit[]>();
  // For 'place', BlockEdit.x/y/z is the *hit* position (block placed against)
  // and (fx,fy,fz) is the face normal — matches the network protocol. The
  // actual block lands at (x+fx, y+fy, z+fz). Stash + dedup by that resolved
  // cell so reload re-applies the right block to the right chunk.
  function _placedCoords(edit: BlockEdit): [number, number, number] {
    if (edit.kind === 'place') {
      return [edit.x + (edit.fx ?? 0), edit.y + (edit.fy ?? 0), edit.z + (edit.fz ?? 0)];
    }
    return [edit.x, edit.y, edit.z];
  }
  /**
   * True when `current` makes `prior` (at the same cell) redundant — i.e. we
   * can drop `prior` from the log. The one case that does NOT supersede is
   * `break → place`: the break is what clears the original terrain block, and
   * without it, the replayed place fails because the cell is still occupied
   * after seed-generated chunk regen.
   */
  function _supersedesPrior(current: BlockEdit, prior: BlockEdit): boolean {
    return !(prior.kind === 'break' && current.kind === 'place');
  }
  function _stashEdit(edit: BlockEdit): void {
    const [px, py, pz] = _placedCoords(edit);
    const key = _chunkKey(px, py, pz);
    let bucket = pendingEditsByChunk.get(key);
    if (bucket === undefined) {
      bucket = [];
      pendingEditsByChunk.set(key, bucket);
    }
    // Drop the most recent prior edit at this cell only when the new edit
    // makes it redundant; otherwise both stay so replay order is preserved.
    for (let i = bucket.length - 1; i >= 0; i--) {
      const [ex, ey, ez] = _placedCoords(bucket[i]);
      if (ex === px && ey === py && ez === pz) {
        if (_supersedesPrior(edit, bucket[i])) {
          bucket.splice(i, 1);
        }
        break;
      }
    }
    bucket.push(edit);
  }
  if (welcome !== null) {
    for (const e of welcome.edits) {
      _stashEdit(e);
    }
  }
  if (savedWorld !== null) {
    for (const e of savedWorld.edits) {
      _stashEdit(e);
    }
  }
  const prevOnChunkAdded = world.onChunkAdded;
  world.onChunkAdded = (chunk, mesh) => {
    prevOnChunkAdded?.(chunk, mesh);
    const key = `${Math.floor(chunk.globalPosition.x / CW)},${Math.floor(chunk.globalPosition.y / CH)},${Math.floor(chunk.globalPosition.z / CD)}`;
    const bucket = pendingEditsByChunk.get(key);
    if (bucket !== undefined) {
      for (const e of bucket) {
        applyRemoteBlockEdit(
          e.kind === 'place'
            ? { kind: 'place', x: e.x, y: e.y, z: e.z, fx: e.fx ?? 0, fy: e.fy ?? 0, fz: e.fz ?? 0, blockType: e.blockType }
            : { kind: 'break', x: e.x, y: e.y, z: e.z },
          world, scene,
        );
      }
    }
  };

  // Remote players + name labels.
  const remotePlayers = new Map<number, RemotePlayer>();
  const remoteMeshes = createRemotePlayerMeshes(device);
  const labelLayer = new NameLabelLayer(canvas.parentElement ?? document.body);
  const _labelAnchors = new Map<number, Vec3>();
  function _spawnRemote(playerId: number, name: string): void {
    if (remotePlayers.has(playerId)) {
      return;
    }
    const rp = new RemotePlayer(playerId, name, scene, remoteMeshes);
    remotePlayers.set(playerId, rp);
    labelLayer.add(playerId, name);
    _labelAnchors.set(playerId, new Vec3());
  }
  function _despawnRemote(playerId: number): void {
    const rp = remotePlayers.get(playerId);
    if (rp !== undefined) {
      rp.dispose();
      remotePlayers.delete(playerId);
    }
    labelLayer.remove(playerId);
    _labelAnchors.delete(playerId);
  }

  if (welcome !== null) {
    for (const p of welcome.players) {
      _spawnRemote(p.playerId, p.name);
      remotePlayers.get(p.playerId)!.setTargetTransform(p.x, p.y, p.z, p.yaw, p.pitch);
    }
  }

  if (network !== null) {
    network.setCallbacks({
      onPlayerJoin: (playerId, name) => {
        console.log(`[crafty] +${name} (#${playerId})`);
        _spawnRemote(playerId, name);
      },
      onPlayerLeave: (playerId) => {
        console.log(`[crafty] -#${playerId}`);
        _despawnRemote(playerId);
      },
      onPlayerTransform: (playerId, x, y, z, yaw, pitch) => {
        const rp = remotePlayers.get(playerId);
        if (rp === undefined) {
          return;
        }
        rp.setTargetTransform(x, y, z, yaw, pitch);
      },
      onBlockEdit: (edit) => {
        _stashEdit(edit);
        applyRemoteBlockEdit(
          edit.kind === 'place'
            ? { kind: 'place', x: edit.x, y: edit.y, z: edit.z, fx: edit.fx ?? 0, fy: edit.fy ?? 0, fz: edit.fz ?? 0, blockType: edit.blockType }
            : { kind: 'break', x: edit.x, y: edit.y, z: edit.z },
          world, scene,
        );
      },
    });

    // Forward local block edits to the server. BlockEdit.x/y/z is the *hit*
    // position (matches the network protocol so applyRemoteBlockEdit can call
    // world.addBlock(hit, face, ...) directly).
    blockInteraction.onLocalEdit = (edit) => {
      if (edit.kind === 'place') {
        _stashEdit({ kind: 'place', x: edit.x, y: edit.y, z: edit.z, blockType: edit.blockType, fx: edit.fx, fy: edit.fy, fz: edit.fz });
        network.sendBlockPlace(edit.x, edit.y, edit.z, edit.fx, edit.fy, edit.fz, edit.blockType);
      } else {
        _stashEdit({ kind: 'break', x: edit.x, y: edit.y, z: edit.z, blockType: 0 });
        network.sendBlockBreak(edit.x, edit.y, edit.z);
      }
    };
  } else if (savedWorld !== null) {
    // Local mode: append every edit to the saved world's edit log so it
    // survives a save tick, and mark the world dirty.
    blockInteraction.onLocalEdit = (edit) => {
      const wireEdit: BlockEdit = edit.kind === 'place'
        ? { kind: 'place', x: edit.x, y: edit.y, z: edit.z, blockType: edit.blockType, fx: edit.fx, fy: edit.fy, fz: edit.fz }
        : { kind: 'break', x: edit.x, y: edit.y, z: edit.z, blockType: 0 };
      // Drop the most recent prior edit at the same resolved cell only when
      // the new edit supersedes it; a 'place' that follows a 'break' must
      // keep the break so replay clears the original terrain first.
      const [px, py, pz] = _placedCoords(wireEdit);
      for (let i = savedWorld.edits.length - 1; i >= 0; i--) {
        const [ex, ey, ez] = _placedCoords(savedWorld.edits[i]);
        if (ex === px && ey === py && ez === pz) {
          if (_supersedesPrior(wireEdit, savedWorld.edits[i])) {
            savedWorld.edits.splice(i, 1);
          }
          break;
        }
      }
      savedWorld.edits.push(wireEdit);
      _stashEdit(wireEdit);
      saveDirty = true;
    };
  }

  // Local-mode dirty flag — set by the local block-edit handler above and by
  // the per-frame movement/sun checks. The auto-save scaffolding (interval
  // constants, flush helper, screenshot capture) lives further down with the
  // other frame-loop state because it needs `sunAngle`.
  let saveDirty = false;

  // Spawn player. For a previously-played saved world, restore the player's
  // last position and orientation; otherwise drop them on the terrain surface.
  const isReturningPlayer = savedWorld !== null && savedWorld.lastPlayedAt > savedWorld.createdAt;
  if (isReturningPlayer) {
    const p = savedWorld!.player;
    cameraGO.position.set(p.x, p.y, p.z);
    player.yaw = p.yaw;
    player.pitch = p.pitch;
    player.velY = 0;
    // Pre-warm chunks around the saved position so the player doesn't fall
    // through air on the first frame.
    const savedRate = world.chunksPerFrame;
    world.chunksPerFrame = 200;
    world.update(new Vec3(p.x, p.y, p.z), 0);
    world.chunksPerFrame = savedRate;
  } else {
    const spawnX = cameraGO.position.x;
    const spawnZ = cameraGO.position.z;
    const savedRate = world.chunksPerFrame;
    world.chunksPerFrame = 200;
    world.update(new Vec3(spawnX, 50, spawnZ), 0);
    world.chunksPerFrame = savedRate;
    const topY = world.getTopBlockY(spawnX, spawnZ, 200);
    if (topY > 0) {
      cameraGO.position.y = topY + 1.62;
      player.velY = 0;
    }
  }

  // Setup menu content
  const sep = document.createElement('div');
  sep.style.cssText = 'width:100%;height:1px;background:rgba(255,255,255,0.42)';
  menu.card.appendChild(sep);

  const blockManager = createBlockManager(menu.card, colorAtlasUrl, hotbar.slots, () => hotbar.refresh(), hotbar.getSelectedSlot, hotbar.setSelectedSlot);

  const invSep = document.createElement('div');
  invSep.style.cssText = 'width:100%;height:1px;background:rgba(255,255,255,0.12)';
  menu.card.appendChild(invSep);

  const effectsLabel = document.createElement('div');
  effectsLabel.textContent = 'EFFECTS';
  effectsLabel.style.cssText = 'color:rgba(255,255,255,0.35);font-size:11px;letter-spacing:0.18em;align-self:flex-start';
  menu.card.appendChild(effectsLabel);

  createControlPanel(effects, async (key) => {
    if (key === 'ssao') {
      return;
    }
    if (key === 'ssgi') {
      return;
    }
    if (key === 'shadows') {
      return;
    }
    if (key === 'aces') {
      return;
    }
    if (key === 'ao_dbg') {
      return;
    }
    if (key === 'shd_dbg') {
      return;
    }
    if (key === 'chunk_dbg') {
      passes.worldGeometryPass!.setDebugChunks(effects.chunk_dbg);
      return;
    }
    if (key === 'hdr') {
      return;
    }
    if (key === 'auto_exp') {
      passes.autoExposurePass!.enabled = effects.auto_exp;
      return;
    }
    if (key === 'fog') {
      passes.compositePass!.depthFogEnabled = effects.fog;
      return;
    }
    if (key === 'rain') {
      await rebuildRenderTargets();
      return;
    }
    if (key === 'clouds') {
      await rebuildRenderTargets();
      return;
    }
    await rebuildRenderTargets();
  }, menu.card);

  hotbar.setOnSelectionChanged(blockManager.refreshSlotHighlight);

  const escHint = document.createElement('div');
  escHint.textContent = 'ESC  ·  resume';
  escHint.style.cssText = 'color:rgba(255,255,255,0.25);font-size:11px;letter-spacing:0.1em';
  menu.card.appendChild(escHint);

  // Exit to launcher. Reload is the cleanest way to fully tear down WebGPU,
  // the world, the WebSocket, etc. — main() re-runs and re-shows the launcher.
  const exitBtn = document.createElement('button');
  exitBtn.textContent = 'Save and Quit to Title';
  exitBtn.style.cssText = [
    'padding:8px 28px',
    'font-size:13px',
    'font-family:ui-monospace,monospace',
    'background: #3a1a1a',
    'color:#f88',
    'border:1px solid #f88', 'border-radius:6px',
    'cursor:pointer', 'letter-spacing:0.06em',
    'transition:background 0.15s',
  ].join(';');
  exitBtn.addEventListener('mouseenter', () => { exitBtn.style.background = '#4a2424'; });
  exitBtn.addEventListener('mouseleave', () => { exitBtn.style.background = '#3a1a1a'; });
  const onExit = (): void => {
    if (document.pointerLockElement === canvas) {
      document.exitPointerLock();
    }
    location.reload();
  };
  exitBtn.addEventListener('click', onExit);
  exitBtn.addEventListener('touchend', (e) => { e.preventDefault(); onExit(); }, { passive: false });
  // Place directly under the Play button (createMenu sets up the card as
  // [title, Play, separator, …]; insert at index 2 to land between Play and
  // the separator).
  menu.card.insertBefore(exitBtn, menu.card.children[2]);

  // Resize observer
  const resizeObserver = new ResizeObserver(async () => {
    const w = Math.max(1, Math.round(canvas.clientWidth  * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) {
      return;
    }
    canvas.width  = w;
    canvas.height = h;
    await rebuildRenderTargets();
  });
  resizeObserver.observe(canvas);

  // Frame loop state
  let lastTime = 0;
  let smoothFps = 0;
  let lastHudUpdate = -Infinity;
  let sunAngle = savedWorld?.sunAngle ?? Math.PI * 0.3;
  let waterTime = 0;
  let frameIndex = 0;
  let cloudWindX = 0;
  let cloudWindZ = 0;
  let cloudCoverage = getBiomeCloudCoverage(world.getBiomeAt(cameraGO.position.x, cameraGO.position.y, cameraGO.position.z));
  const _initBounds = getBiomeCloudBounds(world.getBiomeAt(cameraGO.position.x, cameraGO.position.y, cameraGO.position.z));
  let cloudBase = _initBounds.cloudBase;
  let cloudTop  = _initBounds.cloudTop;

  const heightmap = new HeightmapManager();
  const _forward = new Vec3(0, 0, -1);
  const _rainMat = new Mat4([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);

  // ── Auto-save scaffolding (local mode) ────────────────────────────────────
  const SAVE_INTERVAL_MS = 5000;
  const SCREENSHOT_INTERVAL_MS = 30000;
  const SAVE_POS_THRESHOLD = 0.5;     // blocks
  const SAVE_SUN_THRESHOLD = 0.005;   // radians (~0.3°)
  let lastSavedAt = performance.now();
  let lastScreenshotAt = -Infinity;   // force a screenshot on the first save
  let lastSavedPosX = cameraGO.position.x;
  let lastSavedPosY = cameraGO.position.y;
  let lastSavedPosZ = cameraGO.position.z;
  let lastSavedSun = sunAngle;
  let saveInFlight = false;

  async function _captureThumbnail(): Promise<Blob | null>
  {
    try {
      const bmp = await createImageBitmap(canvas, {
        resizeWidth: 160, resizeHeight: 90, resizeQuality: 'medium',
      });
      const off = new OffscreenCanvas(160, 90);
      const c2d = off.getContext('2d');
      if (c2d === null) {
        return null;
      }
      c2d.drawImage(bmp, 0, 0);
      return await off.convertToBlob({ type: 'image/jpeg', quality: 0.7 });
    } catch (err) {
      console.warn('[crafty] screenshot capture failed', err);
      return null;
    }
  }

  function _flushSave(captureScreenshot: boolean): void
  {
    if (savedWorld === null || worldStorage === null || saveInFlight) {
      return;
    }
    savedWorld.player.x = cameraGO.position.x;
    savedWorld.player.y = cameraGO.position.y;
    savedWorld.player.z = cameraGO.position.z;
    savedWorld.player.yaw = player.yaw;
    savedWorld.player.pitch = player.pitch;
    savedWorld.sunAngle = sunAngle;
    savedWorld.lastPlayedAt = Date.now();
    savedWorld.version = CURRENT_FORMAT_VERSION;
    lastSavedPosX = cameraGO.position.x;
    lastSavedPosY = cameraGO.position.y;
    lastSavedPosZ = cameraGO.position.z;
    lastSavedSun = sunAngle;
    saveDirty = false;
    saveInFlight = true;

    const doSave = (): void => {
      worldStorage.save(savedWorld).catch((err) => {
        console.error('[crafty] save failed', err);
      }).finally(() => {
        saveInFlight = false;
      });
    };

    if (captureScreenshot) {
      void _captureThumbnail().then((blob) => {
        if (blob !== null) {
          savedWorld.screenshot = blob;
        }
        lastScreenshotAt = performance.now();
        doSave();
      });
    } else {
      doSave();
    }
  }

  // Force a save when the tab is hidden or unloading. IDB put() is fire-and-
  // forget; the browser typically completes it during the unload pause.
  if (savedWorld !== null && worldStorage !== null) {
    const flushOnExit = (): void => {
      if (saveDirty) {
        _flushSave(false);
      }
    };
    window.addEventListener('beforeunload', flushOnExit);
    window.addEventListener('pagehide', flushOnExit);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flushOnExit();
      }
    });
  }

  async function frame(time: number): Promise<void> {
    ctx.pushPassErrorScope('frame');
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    const updateHud = time - lastHudUpdate >= 1000;
    if (updateHud) {
      lastHudUpdate = time;
    }
    if (dt > 0) {
      smoothFps += (1 / dt - smoothFps) * 0.1;
    }

    sunAngle  += dt * 0.01;
    waterTime += dt;
    cloudWindX += dt * 1.5;
    cloudWindZ += dt * 0.5;

    const sinA = Math.sin(sunAngle);
    const rawDirX = 0.25;
    const rawDirY = -sinA;
    const rawDirZ = Math.cos(sunAngle);
    const dLen = Math.sqrt(rawDirX * rawDirX + rawDirY * rawDirY + rawDirZ * rawDirZ);
    sun.direction.set(rawDirX / dLen, rawDirY / dLen, rawDirZ / dLen);

    const elev = sinA;
    sun.intensity = Math.max(0, elev) * 6.0;
    const t = Math.max(0, elev);
    sun.color.set(1.0, 0.8 + 0.2 * t, 0.6 + 0.4 * t);

    if (playerSetup.isPlayerMode()) {
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

    if (network !== null && network.connected) {
      network.sendTransform(camPos.x, camPos.y, camPos.z, player.yaw, player.pitch);
    }
    for (const rp of remotePlayers.values()) {
      rp.update(dt);
    }

    scene.update(dt);
    world.update(camPos, dt);

    const biome = world.getBiomeAt(camPos.x, camPos.y, camPos.z);
    const weatherEffect = getBiomeEnvironmentEffect(biome);
    if (weatherEffect !== passes.currentWeatherEffect) {
      passes.currentWeatherEffect = weatherEffect;
      await rebuildRenderTargets();
    }

    const targetCloudCoverage = getBiomeCloudCoverage(biome);
    cloudCoverage += (targetCloudCoverage - cloudCoverage) * Math.min(1, 0.3 * dt);
    const targetBounds = getBiomeCloudBounds(biome);
    cloudBase += (targetBounds.cloudBase - cloudBase) * Math.min(1, 0.3 * dt);
    cloudTop  += (targetBounds.cloudTop  - cloudTop)  * Math.min(1, 0.3 * dt);

    if (updateHud) {
      hud.fps.textContent = `${smoothFps.toFixed(0)} fps`;
      const kTris = (passes.worldGeometryPass!.triangles / 1000).toFixed(1);
      hud.stats.textContent = `${passes.worldGeometryPass!.drawCalls} draws  ${kTris}k tris\n${world.chunkCount} chunks  ${world.pendingChunks} pending`;
      hud.biome.textContent = `${BiomeType[biome]}  coverage:${cloudCoverage.toFixed(2)}`;
      hud.pos.textContent = `X: ${camPos.x.toFixed(1)}  Y: ${camPos.y.toFixed(1)}  Z: ${camPos.z.toFixed(1)}`;
    }

    const hi  = (frameIndex % 16) + 1;
    const jx  = (halton(hi, 2) - 0.5) * (2 / ctx.width);
    const jy  = (halton(hi, 3) - 0.5) * (2 / ctx.height);
    const vp  = camera.viewProjectionMatrix();
    const jitVP = applyJitter(vp, jx, jy);
    const view = camera.viewMatrix();
    const proj = camera.projectionMatrix();
    const invVP = vp.invert();
    const invProj = proj.invert();
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
    passes.worldShadowPass!.enabled = sun.intensity > 0;
    passes.worldShadowPass!.update(ctx, cascades, camPos.x, camPos.z);

    const dayT = Math.max(0, elev);
    const cloudAmbient: [number, number, number] = [0.02 + 0.38 * dayT, 0.03 + 0.52 * dayT, 0.05 + 0.65 * dayT];
    const cloudSettings = {
      cloudBase, cloudTop, coverage: cloudCoverage, density: 4.0,
      windOffset: [cloudWindX, cloudWindZ] as [number, number],
      anisotropy: 0.85, extinction: 0.25, ambientColor: cloudAmbient, exposure: 1.0
    };
    if (passes.cloudShadowPass) {
      passes.cloudShadowPass.update(ctx, cloudSettings, [camPos.x, camPos.z], 128);
    }
    if (passes.cloudPass) {
      passes.cloudPass.updateCamera(ctx, invVP, camPos, camera.near, camera.far);
      passes.cloudPass.updateLight(ctx, sun.direction, sun.color, sun.intensity);
      passes.cloudPass.updateSettings(ctx, cloudSettings);
    }

    const pointLights = scene.getComponents(PointLight);
    const spotLights = scene.getComponents(SpotLight);
    passes.pointSpotShadowPass!.update(pointLights, spotLights, shadowItems);
    passes.pointSpotLightPass!.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    passes.pointSpotLightPass!.updateLights(ctx, pointLights, spotLights);

    passes.atmospherePass!.update(ctx, invVP, camPos, sun.direction);
    passes.geometryPass!.setDrawItems(drawItems);
    passes.geometryPass!.updateCamera(ctx, view, proj, jitVP, invVP, camPos, camera.near, camera.far);
    passes.worldGeometryPass!.updateCamera(ctx, view, proj, jitVP, invVP, camPos, camera.near, camera.far);
    passes.waterPass!.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    passes.waterPass!.updateTime(ctx, waterTime, Math.max(0.01, dayT));
    passes.lightingPass!.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    passes.lightingPass!.updateLight(ctx, sun.direction, sun.color, sun.intensity, cascades, effects.shadows, effects.shd_dbg);
    passes.lightingPass!.updateCloudShadow(ctx, passes.cloudShadowPass ? camPos.x : 0, passes.cloudShadowPass ? camPos.z : 0, 128);
    passes.ssaoPass!.updateCamera(ctx, view, proj, invProj);
    passes.ssaoPass!.updateParams(ctx, 1.0, 0.005, effects.ssao ? 2.0 : 0.0);
    passes.ssgiPass!.enabled = effects.ssgi;
    passes.ssgiPass!.updateSettings({ strength: effects.ssgi ? 1.0 : 0.0 });
    if (effects.ssgi) {
      passes.ssgiPass!.updateCamera(ctx, view, proj, invProj, invVP, passes.prevViewProj ?? vp, camPos);
    }

    const cosPitch = Math.cos(player.pitch);
    _forward.x = -Math.sin(player.yaw) * cosPitch;
    _forward.y = -Math.sin(player.pitch);
    _forward.z = -Math.cos(player.yaw) * cosPitch;
    const hit = world.getBlockByRay(camPos, _forward, 16);
    const MAX_REACH = 6;
    const inReach = !!(hit && hit.position.sub(camPos).length() <= MAX_REACH);
    blockInteraction.targetBlock = inReach ? hit!.position : null;
    blockInteraction.targetHit = inReach ? hit : null;

    const highlightBlock = blockInteraction.targetBlock && !isBlockWater(world.getBlockType(blockInteraction.targetBlock.x, blockInteraction.targetBlock.y, blockInteraction.targetBlock.z)) ? blockInteraction.targetBlock : null;
    passes.blockHighlightPass!.update(ctx, vp, highlightBlock);

    updateBlockInteraction(time, canvas, blockInteraction, world, () => hotbar.getSelected(), scene);

    if (passes.rainPass) {
      heightmap.update(camPos.x, camPos.z, world);
      passes.rainPass.updateHeightmap(ctx, heightmap.data, camPos.x, camPos.z, heightmap.extent);
      const spawnOffset = passes.currentWeatherEffect === EnvironmentEffect.Snow ? 20 : 8;
      _rainMat.data[12] = camPos.x; _rainMat.data[13] = camPos.y + spawnOffset; _rainMat.data[14] = camPos.z;
      passes.rainPass.update(ctx, dt, view, proj, vp, invVP, camPos, camera.near, camera.far, _rainMat);
    }

    passes.dofPass?.updateParams(ctx, 8.0, 75.0, 3.0, camera.near, camera.far);
    passes.godrayPass?.updateParams(ctx);
    const isUnderwater = isBlockWater(world.getBlockType(Math.floor(camPos.x), Math.floor(camPos.y), Math.floor(camPos.z)));
    const sunDir = { x: -sun.direction.x, y: -sun.direction.y, z: -sun.direction.z };
    passes.compositePass!.updateParams(ctx, isUnderwater, waterTime, effects.aces, effects.ao_dbg, effects.hdr);
    passes.compositePass!.updateStars(ctx, invVP, camPos, sunDir);
    passes.autoExposurePass!.update(ctx, dt);
    passes.taaPass!.updateCamera(ctx, invVP, passes.prevViewProj ?? vp);

    if (remotePlayers.size > 0) {
      for (const [pid, rp] of remotePlayers) {
        const anchor = _labelAnchors.get(pid);
        if (anchor !== undefined) {
          rp.headWorldPosition(anchor);
        }
      }
      labelLayer.update(vp, camPos, canvas.clientWidth, canvas.clientHeight, _labelAnchors);
    }

    passes.prevViewProj = vp;
    frameIndex++;

    await passes.graph!.execute(ctx);
    await ctx.popPassErrorScope('frame');

    // Auto-save tick (local mode only). Mark dirty if the player moved enough,
    // the sun rotated enough, or a block was edited (set elsewhere). Throttled
    // by SAVE_INTERVAL_MS; screenshots ride a longer SCREENSHOT_INTERVAL_MS.
    if (savedWorld !== null && worldStorage !== null) {
      const dx = cameraGO.position.x - lastSavedPosX;
      const dy = cameraGO.position.y - lastSavedPosY;
      const dz = cameraGO.position.z - lastSavedPosZ;
      if (dx * dx + dy * dy + dz * dz > SAVE_POS_THRESHOLD * SAVE_POS_THRESHOLD) {
        saveDirty = true;
      }
      if (Math.abs(sunAngle - lastSavedSun) > SAVE_SUN_THRESHOLD) {
        saveDirty = true;
      }
      const now = performance.now();
      if (saveDirty && now - lastSavedAt >= SAVE_INTERVAL_MS) {
        lastSavedAt = now;
        const wantShot = now - lastScreenshotAt >= SCREENSHOT_INTERVAL_MS;
        _flushSave(wantShot);
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main().catch(err => {
  document.body.innerHTML = `<pre style="color:red;padding:1rem">${err}</pre>`;
  console.error(err);
});
