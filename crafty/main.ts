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
import { createBlockInteractionState, setupBlockInteractionHandlers, updateBlockInteraction } from './game/block_interaction.js';
import { setupTouchControlsLazy, isTouchDevice } from './game/touch_controls.js';
import { updateTorchFlicker, updateMagmaFlicker } from './game/lights.js';
import { spawnDucksAroundPoint } from './game/duck_spawning.js';
import { HeightmapManager } from './game/heightmap.js';

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
  const world = new World(13);
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

  // Spawn player at terrain surface
  const spawnX = cameraGO.position.x;
  const spawnZ = cameraGO.position.z;
  {
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

  // Spawn ducks
  const duckBodyMesh = createDuckBodyMesh(device);
  const duckHeadMesh = createDuckHeadMesh(device);
  const duckBillMesh = createDuckBillMesh(device);
  spawnDucksAroundPoint(spawnX, spawnZ, 30, world, scene, duckBodyMesh, duckHeadMesh, duckBillMesh);

  // Setup menu content
  const sep = document.createElement('div');
  sep.style.cssText = 'width:100%;height:1px;background:rgba(255,255,255,0.12)';
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
  let sunAngle = Math.PI * 0.3;
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

    passes.prevViewProj = vp;
    frameIndex++;

    await passes.graph!.execute(ctx);
    await ctx.popPassErrorScope('frame');
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main().catch(err => {
  document.body.innerHTML = `<pre style="color:red;padding:1rem">${err}</pre>`;
  console.error(err);
});
