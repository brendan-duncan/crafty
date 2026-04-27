import clearSkyUrl    from '../../assets/cubemaps/hdr/clear_sky.hdr?url';
import belfastUrl     from '../../assets/cubemaps/hdr/belfast.hdr?url';
import industrialUrl  from '../../assets/cubemaps/hdr/industrial.hdr?url';
import nightSkyUrl    from '../../assets/cubemaps/hdr/night_sky.hdr?url';
import skyUrl         from '../../assets/cubemaps/hdr/sky.hdr?url';
import studioUrl      from '../../assets/cubemaps/hdr/studio.hdr?url';
import sunflowersUrl  from '../../assets/cubemaps/hdr/sunflowers.hdr?url';
import colorAtlasUrl  from '../../assets/cube_textures/simple_block_atlas.png?url';
import normalAtlasUrl from '../../assets/cube_textures/simple_block_atlas_normal.png?url';
import merAtlasUrl    from '../../assets/cube_textures/simple_block_atlas_mer.png?url';
import heightAtlasUrl from '../../assets/cube_textures/simple_block_atlas_heightmap.png?url';
import dudvUrl        from '../../assets/water/waterDUDV.png?url';
import gradientUrl    from '../../assets/water/gradient_map.png?url';
import { Mat4, Vec3 } from '../../src/math/index.js';
import {
  GameObject, Scene, Camera, DirectionalLight, CameraControls,
  PointLight, SpotLight,
} from '../../src/engine/index.js';
import type { CascadeData } from '../../src/engine/index.js';
import {
  RenderContext, RenderGraph, GBuffer,
  ShadowPass, SkyPass, GeometryPass, LightingPass,
  TAAPass, SSAOPass, SSGIPass, DofPass, BloomPass, TonemapPass,
  AutoExposurePass, PointSpotShadowPass, PointSpotLightPass,
  WorldGeometryPass, WaterPass, WorldShadowPass, UnderwaterPass,
} from '../../src/renderer/index.js';
import { Texture } from '../../src/assets/texture.js';
import { parseHdr, createHdrTexture } from '../../src/assets/hdr_loader.js';
import { computeIblGpu } from '../../src/assets/ibl.js';
import { BlockTexture } from '../../src/assets/block_texture.js';
import { World } from '../../src/block/index.js';
import type { Chunk, ChunkMesh } from '../../src/block/index.js';
import type { DrawItem } from '../../src/renderer/passes/geometry_pass.js';

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
): HTMLDivElement {
  const panel = document.createElement('div');
  panel.style.cssText = [
    'position:fixed', 'top:12px', 'left:12px',
    'display:flex', 'flex-direction:column', 'gap:6px',
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

  document.body.appendChild(panel);
  return panel;
}

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) throw new Error('No canvas element');

  const ctx = await RenderContext.create(canvas);
  const { device } = ctx;

  const skyOptions = [
    { label: 'INDSTRL', url: industrialUrl  },
    { label: 'CLEAR',   url: clearSkyUrl   },
    { label: 'BELFAST', url: belfastUrl     },
    { label: 'NIGHT',   url: nightSkyUrl    },
    { label: 'SKY',     url: skyUrl         },
    { label: 'STUDIO',  url: studioUrl      },
    { label: 'SUNFLWR', url: sunflowersUrl  },
  ];
  let skyIndex = 0;

  let skyTexture = await createHdrTexture(device, parseHdr(await (await fetch(industrialUrl)).arrayBuffer()));
  let ibl        = await computeIblGpu(device, skyTexture.gpuTexture, 0.2);

  const blockTexture   = await BlockTexture.load(device, colorAtlasUrl, normalAtlasUrl, merAtlasUrl, heightAtlasUrl);
  const dudvTexture    = await Texture.fromUrl(device, dudvUrl);
  const gradientTexture = await Texture.fromUrl(device, gradientUrl);

  // --- World ---

  const world = new World(42);
  const chunkMeshCache = new Map<Chunk, ChunkMesh>();

  // --- Scene ---

  const scene = new Scene();

  const sunGO = new GameObject('Sun');
  const sun   = sunGO.addComponent(new DirectionalLight(new Vec3(0.3, -1, 0.5), Vec3.one(), 3, 3));
  scene.add(sunGO);

  const cameraGO = new GameObject('Camera');
  cameraGO.position.set(64, 40, 64);
  const camera = cameraGO.addComponent(new Camera(70, 0.1, 1000, ctx.width / ctx.height));
  scene.add(cameraGO);

  const cameraControls = new CameraControls(Math.PI, 0.1);
  cameraControls.attach(canvas);

  // --- Effect toggles ---
  const effects = { ssao: true, ssgi: true, shadows: true, dof: true, bloom: true, aces: true, ao_dbg: false, shd_dbg: false, hdr: true };

  // --- Renderer ---

  const shadowPass = ShadowPass.create(ctx, 3);

  let gbuffer!            : GBuffer;
  let geometryPass!       : GeometryPass;
  let worldGeometryPass!  : WorldGeometryPass;
  let worldShadowPass!    : WorldShadowPass;
  let waterPass!          : WaterPass;
  let ssaoPass!           : SSAOPass;
  let ssgiPass!           : SSGIPass;
  let lightingPass!       : LightingPass;
  let skyPass!            : SkyPass;
  let pointSpotShadowPass!: PointSpotShadowPass;
  let pointSpotLightPass! : PointSpotLightPass;
  let taaPass!            : TAAPass;
  let dofPass             : DofPass        | null = null;
  let bloomPass           : BloomPass      | null = null;
  let underwaterPass!     : UnderwaterPass;
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
    skyPass?.destroy();
    pointSpotShadowPass?.destroy();
    pointSpotLightPass?.destroy();
    taaPass?.destroy();
    dofPass?.destroy();        dofPass        = null;
    bloomPass?.destroy();      bloomPass      = null;
    underwaterPass?.destroy();
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
      worldShadowPass   = WorldShadowPass.create(ctx, shadowPass.shadowMapArrayViews, 3);

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
    lightingPass        = LightingPass.create(ctx, gbuffer, shadowPass, ibl, ssaoPass.aoView);
    skyPass             = SkyPass.create(ctx, lightingPass.hdrView, skyTexture);
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

    underwaterPass = UnderwaterPass.create(ctx, bloomOut);

    autoExposurePass = AutoExposurePass.create(ctx, lightingPass.hdrTexture);
    tonemapPass      = TonemapPass.create(ctx, underwaterPass.resultView, ssaoPass.aoView, autoExposurePass.exposureBuffer);

    camera.aspect = ctx.width / ctx.height;
    prevViewProj  = null;

    graph = new RenderGraph();
    graph.addPass(shadowPass);
    graph.addPass(worldShadowPass);
    graph.addPass(pointSpotShadowPass);
    graph.addPass(geometryPass);
    graph.addPass(worldGeometryPass);
    graph.addPass(ssaoPass);
    graph.addPass(ssgiPass);
    graph.addPass(skyPass);
    graph.addPass(lightingPass);
    graph.addPass(pointSpotLightPass);
    graph.addPass(waterPass);
    graph.addPass(taaPass);
    if (dofPass)   graph.addPass(dofPass);
    if (bloomPass) graph.addPass(bloomPass);
    graph.addPass(underwaterPass);
    graph.addPass(autoExposurePass);
    graph.addPass(tonemapPass);
  }

  buildRenderTargets();

  world.generate(8, 2, 8);

  // --- UI ---

  const hint = document.createElement('div');
  hint.textContent = 'Click to look around  ·  WASD move  ·  Space / Shift up / down';
  hint.style.cssText = [
    'position:fixed', 'bottom:16px', 'left:50%', 'transform:translateX(-50%)',
    'padding:6px 14px', 'border-radius:4px',
    'background:rgba(0,0,0,0.55)', 'color:#ccc',
    'font-family:ui-monospace,monospace', 'font-size:12px',
    'pointer-events:none', 'transition:opacity 0.3s',
  ].join(';');
  document.body.appendChild(hint);
  document.addEventListener('pointerlockchange', () => {
    hint.style.opacity = document.pointerLockElement ? '0' : '1';
  });

  const fpsEl = document.createElement('div');
  fpsEl.style.cssText = [
    'position:fixed', 'top:12px', 'right:12px',
    'font-family:ui-monospace,monospace', 'font-size:13px',
    'color:#ff0', 'background:rgba(0,0,0,0.45)',
    'padding:4px 8px', 'border-radius:4px', 'pointer-events:none',
  ].join(';');
  document.body.appendChild(fpsEl);

  // Sky texture cycling button (inserted above the effects panel)
  let skyLoading = false;
  const skyBtn = document.createElement('button');
  const refreshSkyBtn = () => {
    skyBtn.textContent = skyLoading ? 'LOADING...' : `SKY: ${skyOptions[skyIndex].label}`;
    skyBtn.setAttribute('style', [
      'padding:5px 10px', 'border-width:1px', 'border-style:solid', 'border-radius:4px',
      'cursor:pointer', 'letter-spacing:0.04em',
      'font-family:ui-monospace,monospace', 'font-size:13px',
      'background:#1a1a2e', 'color:#88f', 'border-color:#88f',
    ].join(';'));
  };
  skyBtn.addEventListener('click', async () => {
    if (skyLoading) return;
    skyLoading = true;
    refreshSkyBtn();
    const next = (skyIndex + 1) % skyOptions.length;
    const hdr = parseHdr(await (await fetch(skyOptions[next].url)).arrayBuffer());
    const newTex = await createHdrTexture(device, hdr);
    const newIbl = await computeIblGpu(device, newTex.gpuTexture, 0.2);
    const oldTex = skyTexture;
    const oldIbl = ibl;
    skyTexture = newTex;
    ibl = newIbl;
    skyIndex = next;
    buildRenderTargets();
    // Wait for any in-flight GPU work referencing the old texture to complete before destroying it.
    await device.queue.onSubmittedWorkDone();
    oldTex.destroy();
    oldIbl.destroy();
    skyLoading = false;
    refreshSkyBtn();
  });
  refreshSkyBtn();

  const effectsPanel = createControlPanel(effects, (key) => {
    if (key === 'ssao')    return;
    if (key === 'ssgi')    return;
    if (key === 'shadows') return;
    if (key === 'aces')    return;
    if (key === 'ao_dbg')  return;
    if (key === 'shd_dbg') return;
    if (key === 'hdr')     return;
    buildRenderTargets();
  });
  effectsPanel.insertBefore(skyBtn, effectsPanel.firstChild);

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth  * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width  = w;
    canvas.height = h;
    buildRenderTargets();
  });
  resizeObserver.observe(canvas);

  let lastTime  = 0;
  let smoothFps = 0;
  let sunAngle  = 0;
  let waterTime = 0;
  let frameIndex = 0;

  function frame(time: number): void {
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    if (dt > 0) {
      smoothFps += (1 / dt - smoothFps) * 0.1;
      fpsEl.textContent = `${smoothFps.toFixed(0)} fps`;
    }

    sunAngle  += dt * 0.05;
    waterTime += dt;
    sun.direction.set(Math.cos(sunAngle), -0.8, Math.sin(sunAngle));

    cameraControls.update(cameraGO, dt);
    scene.update(dt);

    const camPos = camera.position();
    world.update(camPos, dt);

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

    const pointLights = scene.getComponents(PointLight);
    const spotLights  = scene.getComponents(SpotLight);
    pointSpotShadowPass.update(pointLights, spotLights, shadowItems);
    pointSpotLightPass.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    pointSpotLightPass.updateLights(ctx, pointLights, spotLights);

    skyPass.updateCamera(ctx, invVP, camPos);

    geometryPass.setDrawItems(drawItems);
    geometryPass.updateCamera(ctx, view, proj, jitVP, invVP, camPos, camera.near, camera.far);

    worldGeometryPass.updateCamera(ctx, view, proj, jitVP, invVP, camPos, camera.near, camera.far);

    waterPass.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    waterPass.updateTime(ctx, waterTime);

    lightingPass.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    lightingPass.updateLight(ctx, sun.direction, sun.color, sun.intensity, cascades, effects.shadows, effects.shd_dbg);
    lightingPass.updateCloudShadow(ctx, 0, 0, 60);

    ssaoPass.updateCamera(ctx, view, proj, invProj);
    ssaoPass.updateParams(ctx, 1.0, 0.005, effects.ssao ? 2.0 : 0.0);

    ssgiPass.updateSettings({ strength: effects.ssgi ? 1.0 : 0.0 });
    ssgiPass.updateCamera(ctx, view, proj, invProj, invVP, prevViewProj ?? vp, camPos);

    dofPass?.updateParams(ctx, 8.0, 25.0, 6.0, camera.near, camera.far);
    underwaterPass.updateParams(ctx, camPos.y < 15.0, waterTime);
    tonemapPass.updateParams(ctx, effects.aces, effects.ao_dbg, effects.hdr);
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
