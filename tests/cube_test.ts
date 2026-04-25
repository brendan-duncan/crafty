import belfastUrl    from '../assets/cubemaps/hdr/belfast.hdr?url';
import clearSkyUrl   from '../assets/cubemaps/hdr/clear_sky.hdr?url';
import industrialUrl from '../assets/cubemaps/hdr/industrial.hdr?url';
import nightSkyUrl   from '../assets/cubemaps/hdr/night_sky.hdr?url';
import skyUrl        from '../assets/cubemaps/hdr/sky.hdr?url';
import studioUrl     from '../assets/cubemaps/hdr/studio.hdr?url';
import sunflowersUrl from '../assets/cubemaps/hdr/sunflowers.hdr?url';
import colorAtlasUrl  from '../assets/cube_textures/simple_block_atlas.png?url';
import normalAtlasUrl from '../assets/cube_textures/simple_block_atlas_normal.png?url';
import merAtlasUrl    from '../assets/cube_textures/simple_block_atlas_mer.png?url';
import heightAtlasUrl from '../assets/cube_textures/simple_block_atlas_heightmap.png?url';
import foxUrl         from '../assets/fox.glb?url';
import { Mat4, Vec3, Quaternion } from '../src/math/index.js';
import { GameObject, Scene, Camera, DirectionalLight, MeshRenderer, CameraControls, AnimatedModel } from '../src/engine/index.js';
import { RenderContext, RenderGraph, GBuffer, ShadowPass, SkyPass, GeometryPass, SkinnedGeometryPass, LightingPass, TAAPass, SSAOPass, DofPass, BloomPass, TonemapPass, DebugLightPass, ParticlePass, CloudPass, CloudShadowPass } from '../src/renderer/index.js';
import type { CloudSettings } from '../src/renderer/index.js';
import type { ParticleGraphConfig } from '../src/particles/index.js';
import { Mesh, BlockTexture, GltfLoader, createCloudNoiseTextures } from '../src/assets/index.js';
import type { GltfModel, CloudNoiseTextures } from '../src/assets/index.js';
import { parseHdr, createHdrTexture } from '../src/assets/hdr_loader.js';
import { computeIblGpu } from '../src/assets/ibl.js';
import type { DrawItem } from '../src/renderer/passes/geometry_pass.js';

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

// Injects a fixed overlay panel with labelled toggle buttons.
// onChange is called with the key after the value has already been flipped.
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

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) throw new Error('No canvas element');

  const ctx = await RenderContext.create(canvas);
  const { device } = ctx;

  const skyOptions = [
    { label: 'BELFAST',  url: belfastUrl    },
    { label: 'CLEAR',    url: clearSkyUrl   },
    { label: 'INDSTRL',  url: industrialUrl },
    { label: 'NIGHT',    url: nightSkyUrl   },
    { label: 'SKY',      url: skyUrl        },
    { label: 'STUDIO',   url: studioUrl     },
    { label: 'SUNFLWR',  url: sunflowersUrl },
  ];
  let skyIndex = 0;

  const skyHdr    = parseHdr(await (await fetch(belfastUrl)).arrayBuffer());
  let skyTexture = await createHdrTexture(device, skyHdr);
  let ibl        = await computeIblGpu(device, skyTexture.gpuTexture, 0.2);

  const cloudNoises: CloudNoiseTextures = createCloudNoiseTextures(device);
  const cloudSettings: CloudSettings = {
    cloudBase   : 1,
    cloudTop    : 10,
    coverage    : 0.75,
    density     : 3.0,
    windOffset  : [0, 0],
    anisotropy  : 0.85,
    extinction  : 0.25,
    ambientColor: [0.6, 0.7, 0.9],
    exposure    : 0.2,
  };
  const cloudWindSpeed = 0.03;
  const cloudWindDir: [number, number] = [1, 0.3];

  const blockTex = await BlockTexture.load(device, colorAtlasUrl, normalAtlasUrl, merAtlasUrl, heightAtlasUrl);
  const coneMesh = Mesh.createCone(device, 0.25, 0.6, 16);

  // --- Scene setup ---
  const scene = new Scene();

  const planeGO = new GameObject('Plane');
  planeGO.position.set(0, 0, 0);
  const planeMesh = Mesh.createPlane(device, 20, 20, 4, 4);
  const [planeUvOx, planeUvOy, planeUvSx, planeUvSy] = blockTex.uvTransform(2);
  planeGO.addComponent(new MeshRenderer(planeMesh, {
    albedo: [1, 1, 1, 1],
    roughness: 1.0,
    metallic: 1.0,
    uvOffset: [planeUvOx, planeUvOy],
    uvScale:  [planeUvSx, planeUvSy],
    uvTile:   [20, 20],  // 1 tile per world unit across the 20×20 plane
    albedoMap: blockTex.colorAtlas,
    normalMap: blockTex.normalAtlas,
    merMap:    blockTex.merAtlas,
  }));
  scene.add(planeGO);

  const cubeMesh = Mesh.createCube(device, 1);
  const cubeConfigs = [
    { pos: [ 0,   0.5,  0  ], blockId: 4, speed: 0.5 },
    { pos: [-3,   0.5,  2  ], blockId: 5, speed: 0.8 },
    { pos: [ 3,   0.5,  2  ], blockId: 6, speed: 0.3 },
    { pos: [-2,   0.5, -2  ], blockId: 7, speed: 1.1 },
    { pos: [ 2,   0.5, -2  ], blockId: 8, speed: 0.6 },
  ];
  const cubeGOs = cubeConfigs.map(({ pos, blockId }, i) => {
    const [uvOffsetX, uvOffsetY, uvScaleX, uvScaleY] = blockTex.uvTransform(blockId);
    const go = new GameObject(`Cube${i}`);
    go.position.set(pos[0], pos[1], pos[2]);
    go.addComponent(new MeshRenderer(cubeMesh, {
      albedo: [1, 1, 1, 1],
      roughness: 1.0,
      metallic: 1.0,
      uvOffset: [uvOffsetX, uvOffsetY],
      uvScale:  [uvScaleX,  uvScaleY],
      albedoMap: blockTex.colorAtlas,
      normalMap: blockTex.normalAtlas,
      merMap:    blockTex.merAtlas,
    }));
    scene.add(go);
    return go;
  });

  const sphereGO = new GameObject('MirrorSphere');
  sphereGO.position.set(0, 1, 4);
  const sphereMesh = Mesh.createSphere(device, 1, 64, 64);
  sphereGO.addComponent(new MeshRenderer(sphereMesh, {
    albedo:   [1, 1, 1, 1],
    metallic: 1.0,
    roughness: 0.02,
  }));
  scene.add(sphereGO);

  // Load fox GLB asynchronously; added to scene once ready
  let foxModel: GltfModel | null = null;
  let foxAnimated: AnimatedModel | null = null;
  GltfLoader.load(device, foxUrl).then(model => {
    foxModel = model;
    console.log(foxModel);
    if (!model.skin || model.meshes.length === 0) return;
    const foxGO = new GameObject('Fox');
    foxGO.position.set(0, 0, 2);
    foxGO.scale.set(1, 1, 1);
    foxAnimated = foxGO.addComponent(new AnimatedModel(model));
    const firstClip = model.clips[0]?.name;
    if (firstClip) foxAnimated.play(firstClip, true);
    scene.add(foxGO);
  }).catch(err => console.error('fox.glb load failed:', err));

  const fireEmitterGO = new GameObject('FireEmitter');
  fireEmitterGO.position.set(3, 0, 2);

  const sparksEmitterGO = new GameObject('SparksEmitter');
  sparksEmitterGO.position.set(-3, 0, 2);

  const sunGO = new GameObject('Sun');
  const sun = sunGO.addComponent(new DirectionalLight(new Vec3(0.3, -1, 0.5), Vec3.one(), 3, 3));
  scene.add(sunGO);

  const cameraGO = new GameObject('Camera');
  cameraGO.position.set(0, 4, -8);
  const camera = cameraGO.addComponent(new Camera(60, 0.1, 100, ctx.width / ctx.height));
  scene.add(cameraGO);

  const cameraControls = new CameraControls(Math.PI, 0.1);  // 5.7° down: upper ~50% is sky
  cameraControls.attach(canvas);

  // --- Effect toggles ---
  const effects = { ssao: true, shadows: true, dof: true, bloom: true, aces: true, ao_dbg: false, shd_dbg: false, hdr: true, clouds: true };

  // --- Renderer ---
  const shadowPass = ShadowPass.create(ctx, 3);

  let gbuffer!: GBuffer;
  let geometryPass!: GeometryPass;
  let ssaoPass!: SSAOPass;
  let skyPass         : SkyPass         | null = null;
  let cloudShadowPass : CloudShadowPass | null = null;
  let cloudPass       : CloudPass       | null = null;
  let lightingPass!: LightingPass;
  let taaPass!: TAAPass;
  let dofPass             : DofPass             | null = null;
  let bloomPass           : BloomPass           | null = null;
  let debugLightPass!     : DebugLightPass;
  let tonemapPass!        : TonemapPass;
  let firePass            : ParticlePass        | null = null;
  let sparksPass          : ParticlePass        | null = null;
  let rainPass            : ParticlePass        | null = null;
  let snowPass            : ParticlePass        | null = null;
  let skinnedGeometryPass : SkinnedGeometryPass | null = null;
  let graph!: RenderGraph;
  let prevViewProj: Mat4 | null = null;

  const fireConfig: ParticleGraphConfig = {
    emitter: {
      maxParticles: 2000,
      spawnRate: 200,
      lifetime: [1.5, 3.0],
      shape: { kind: 'cone', radius: 0.1, angle: Math.PI / 8 },
      initialSpeed: [1.5, 3.0],
      initialColor: [1.0, 0.45, 0.05, 1.0],
      initialSize: [0.08, 0.18],
      roughness: 0.9,
      metallic: 0.0,
    },
    modifiers: [
      { type: 'gravity',            strength: -2.0 },
      { type: 'drag',               coefficient: 1.5 },
      { type: 'color_over_lifetime', startColor: [1.0, 0.45, 0.05, 1.0], endColor: [0.3, 0.05, 0.0, 0.0] },
      { type: 'size_over_lifetime',  start: 0.15, end: 0.02 },
    ],
    renderer: { type: 'sprites', blendMode: 'additive', billboard: 'camera' },
  };

  const sparksConfig: ParticleGraphConfig = {
    emitter: {
      maxParticles: 5000,
      spawnRate: 80,
      lifetime: [2.0, 5.0],
      shape: { kind: 'sphere', radius: 0.05, solidAngle: Math.PI },
      initialSpeed: [2.0, 6.0],
      initialColor: [0.6, 0.8, 1.0, 1.0],
      initialSize: [0.04, 0.08],
      roughness: 0.2,
      metallic: 0.8,
    },
    modifiers: [
      { type: 'gravity',   strength: 4.0 },
      { type: 'drag',      coefficient: 0.3 },
      { type: 'curl_noise', scale: 0.8, strength: 1.5, timeScale: 0.4 },
      { type: 'color_over_lifetime', startColor: [0.6, 0.8, 1.0, 1.0], endColor: [0.1, 0.15, 0.4, 0.0] },
    ],
    renderer: { type: 'sprites', blendMode: 'additive', billboard: 'camera' },
  };

  const snowConfig: ParticleGraphConfig = {
    emitter: {
      maxParticles: 15000,
      spawnRate: 2500,
      lifetime: [5.0, 8.0],
      shape: { kind: 'box', halfExtents: [35, 0.1, 35] },
      initialSpeed: [0, 0],
      initialColor: [0.92, 0.96, 1.0, 0.75],
      initialSize: [0.04, 0.12],
      roughness: 0.1,
      metallic: 0.0,
    },
    modifiers: [
      { type: 'gravity',    strength: 1.5 },
      { type: 'drag',       coefficient: 0.3 },
      { type: 'curl_noise', scale: 0.25, strength: 0.35, timeScale: 0.06 },
      // No alpha fade — flakes stay opaque until the depth test hides them at ground level.
    ],
    renderer: { type: 'sprites', blendMode: 'alpha', billboard: 'camera', renderTarget: 'hdr' },
  };

  const rainConfig: ParticleGraphConfig = {
    emitter: {
      maxParticles: 30000,
      spawnRate: 9000,
      lifetime: [2.0, 3.5],
      shape: { kind: 'box', halfExtents: [35, 0.1, 35] },
      initialSpeed: [0, 0],
      initialColor: [0.75, 0.88, 1.0, 0.55],
      initialSize: [0.008, 0.015],
      roughness: 0.1,
      metallic: 0.0,
    },
    modifiers: [
      { type: 'gravity', strength: 9.0 },
      { type: 'drag', coefficient: 0.05 },
      { type: 'color_over_lifetime', startColor: [0.75, 0.88, 1.0, 0.55], endColor: [0.75, 0.88, 1.0, 0.0] },
    ],
    renderer: { type: 'sprites', blendMode: 'alpha', billboard: 'velocity', renderTarget: 'hdr' },
  };

  function buildRenderTargets(): void {
    gbuffer?.destroy();
    geometryPass?.destroy();
    ssaoPass?.destroy();
    skyPass?.destroy();         skyPass         = null;
    cloudShadowPass?.destroy(); cloudShadowPass = null;
    cloudPass?.destroy();       cloudPass       = null;
    lightingPass?.destroy();
    debugLightPass?.destroy();
    taaPass?.destroy();
    dofPass?.destroy();             dofPass             = null;
    bloomPass?.destroy();           bloomPass           = null;
    firePass?.destroy();            firePass            = null;
    sparksPass?.destroy();          sparksPass          = null;
    rainPass?.destroy();            rainPass            = null;
    snowPass?.destroy();            snowPass            = null;
    skinnedGeometryPass?.destroy(); skinnedGeometryPass = null;

    gbuffer             = GBuffer.create(ctx);
    geometryPass        = GeometryPass.create(ctx, gbuffer);
    skinnedGeometryPass = SkinnedGeometryPass.create(ctx, gbuffer);
    firePass            = ParticlePass.create(ctx, fireConfig,   gbuffer);
    sparksPass          = ParticlePass.create(ctx, sparksConfig, gbuffer);
    // rain is created after lightingPass so we can pass its hdrView; defer below
    ssaoPass = SSAOPass.create(ctx, gbuffer);
    if (effects.clouds) {
      cloudShadowPass = CloudShadowPass.create(ctx, cloudNoises);
      lightingPass    = LightingPass.create(ctx, gbuffer, shadowPass, ibl, ssaoPass.aoView, cloudShadowPass.shadowView);
      cloudPass       = CloudPass.create(ctx, lightingPass.hdrView, gbuffer.depthView, skyTexture, cloudNoises);
    } else {
      lightingPass = LightingPass.create(ctx, gbuffer, shadowPass, ibl, ssaoPass.aoView);
      skyPass      = SkyPass.create(ctx, lightingPass.hdrView, skyTexture);
    }
    rainPass       = ParticlePass.create(ctx, rainConfig, gbuffer, lightingPass.hdrView);
    snowPass       = ParticlePass.create(ctx, snowConfig, gbuffer, lightingPass.hdrView);
    debugLightPass = DebugLightPass.create(ctx, lightingPass.hdrView, gbuffer.depthView);
    debugLightPass.setMesh(coneMesh);
    taaPass          = TAAPass.create(ctx, lightingPass, gbuffer);

    // Wire post-process chain according to current toggle state
    const postInput = effects.dof
      ? (dofPass = DofPass.create(ctx, taaPass.resolvedView, gbuffer.depthView), dofPass.resultView)
      : taaPass.resolvedView;

    const tonemapInput = effects.bloom
      ? (bloomPass = BloomPass.create(ctx, postInput), bloomPass.resultView)
      : postInput;

    tonemapPass = TonemapPass.create(ctx, tonemapInput, ssaoPass.aoView);

    graph = new RenderGraph();
    graph.addPass(shadowPass);
    graph.addPass(geometryPass);
    graph.addPass(skinnedGeometryPass!);
    graph.addPass(firePass);
    graph.addPass(sparksPass);
    graph.addPass(ssaoPass);
    if (cloudShadowPass) graph.addPass(cloudShadowPass);
    if (cloudPass)       graph.addPass(cloudPass);
    if (skyPass)         graph.addPass(skyPass);
    graph.addPass(lightingPass);
    graph.addPass(rainPass);
    graph.addPass(snowPass);
    graph.addPass(debugLightPass);
    graph.addPass(taaPass);
    if (dofPass)   graph.addPass(dofPass);
    if (bloomPass) graph.addPass(bloomPass);
    graph.addPass(tonemapPass);

    camera.aspect = ctx.width / ctx.height;
    prevViewProj = null;
  }

  buildRenderTargets();

  // Pointer-lock hint — fades out when the mouse is captured
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

  // Sky texture cycling
  let skyLoading = false;
  const skyBtn = document.createElement('button');
  const refreshSkyBtn = () => {
    const label = `SKY: ${skyOptions[skyIndex].label}`;
    skyBtn.textContent = skyLoading ? 'LOADING...' : label;
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
    skyTexture.destroy();
    ibl.destroy();
    skyTexture = newTex;
    ibl = newIbl;
    skyIndex = next;
    buildRenderTargets();
    skyLoading = false;
    refreshSkyBtn();
  });
  refreshSkyBtn();

  // SSAO is toggled without a rebuild — strength=0 makes it fully transparent
  const effectsPanel = createControlPanel(effects, (key) => {
    if (key === 'ssao')    return; // handled per-frame via updateParams
    if (key === 'shadows') return; // handled per-frame via updateLight
    if (key === 'aces')    return; // handled per-frame via updateParams
    if (key === 'ao_dbg')  return; // handled per-frame via updateParams
    if (key === 'shd_dbg') return; // handled per-frame via updateLight
    if (key === 'hdr')     return; // handled per-frame via updateParams
    buildRenderTargets();
  });
  effectsPanel.insertBefore(skyBtn, effectsPanel.firstChild);

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    buildRenderTargets();
  });
  resizeObserver.observe(canvas);

  let lastTime = 0;
  let angle = 0;
  let frameIndex = 0;

  function frame(time: number) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    angle += dt;

    cubeGOs.forEach((go, i) => {
      go.rotation = Quaternion.fromAxisAngle(Vec3.up(), angle * cubeConfigs[i].speed);
    });

    cameraControls.update(cameraGO, dt);

    const sunAngle = angle * 0.4;
    sun.direction.set(Math.cos(sunAngle), -0.8, Math.sin(sunAngle));
    scene.update(dt);

    const hi = (frameIndex % 16) + 1;
    const jx = (halton(hi, 2) - 0.5) * (2 / ctx.width);
    const jy = (halton(hi, 3) - 0.5) * (2 / ctx.height);

    const vp      = camera.viewProjectionMatrix();
    const jitVP   = applyJitter(vp, jx, jy);
    const view    = camera.viewMatrix();
    const proj    = camera.projectionMatrix();
    const invVP   = vp.invert();
    const invProj = proj.invert();
    const camPos  = camera.position();
    const cascades = sun.computeCascadeMatrices(camera);

    const drawItems: DrawItem[] = scene.collectMeshRenderers().map(mr => {
      const world = mr.gameObject.localToWorld();
      return {
        mesh: mr.mesh,
        modelMatrix: world,
        normalMatrix: world.normalMatrix(),
        material: mr.material,
      };
    });

    shadowPass.setSceneSnapshot(drawItems.map(d => ({ mesh: d.mesh, modelMatrix: d.modelMatrix })));
    shadowPass.updateScene(scene, camera, sun);

    if (effects.clouds) {
      cloudSettings.windOffset[0] += cloudWindSpeed * cloudWindDir[0] * dt;
      cloudSettings.windOffset[1] += cloudWindSpeed * cloudWindDir[1] * dt;
      cloudShadowPass?.update(ctx, cloudSettings, [0, 0], 60);
      cloudPass?.updateCamera(ctx, invVP, camPos, camera.near, camera.far);
      cloudPass?.updateLight(ctx, sun.direction, sun.color, sun.intensity);
      cloudPass?.updateSettings(ctx, cloudSettings);
    } else {
      skyPass?.updateCamera(ctx, invVP, camPos);
    }

    geometryPass.setDrawItems(drawItems);
    geometryPass.updateCamera(ctx, view, proj, jitVP, invVP, camPos, camera.near, camera.far);

    if (skinnedGeometryPass && foxModel) {
      const skinnedItems = scene.getComponents(AnimatedModel).map(am => {
        const world = am.gameObject.localToWorld();
        return am.model.meshes.map(md => ({
          mesh: md.skinnedMesh,
          modelMatrix: world,
          normalMatrix: world.normalMatrix(),
          material: md.material,
          jointMatrices: am.jointMatrices,
        }));
      }).flat();
      skinnedGeometryPass.setDrawItems(skinnedItems);
      skinnedGeometryPass.updateCamera(ctx, view, proj, jitVP, invVP, camPos, camera.near, camera.far);
    }

    firePass?.update(ctx, dt, view, proj, vp, invVP, camPos, camera.near, camera.far, fireEmitterGO.localToWorld());
    sparksPass?.update(ctx, dt, view, proj, vp, invVP, camPos, camera.near, camera.far, sparksEmitterGO.localToWorld());

    // Rain emitter follows camera, 8 units above, spawning over a 40×40 area
    const rainMat = new Mat4([1,0,0,0, 0,1,0,0, 0,0,1,0, camPos.x, camPos.y + 8, camPos.z, 1]);
    rainPass?.update(ctx, dt, view, proj, vp, invVP, camPos, camera.near, camera.far, rainMat);
    const snowMat = new Mat4([1,0,0,0, 0,1,0,0, 0,0,1,0, camPos.x, camPos.y + 8, camPos.z, 1]);
    snowPass?.update(ctx, dt, view, proj, vp, invVP, camPos, camera.near, camera.far, snowMat);

    lightingPass.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    lightingPass.updateLight(ctx, sun.direction, sun.color, sun.intensity, cascades, effects.shadows, effects.shd_dbg);
    lightingPass.updateCloudShadow(ctx, 0, 0, 60);

    ssaoPass.updateCamera(ctx, view, proj, invProj);
    // Strength 0 = no occlusion (effectively bypasses SSAO without a rebuild)
    ssaoPass.updateParams(ctx, 1.0, 0.005, effects.ssao ? 2.0 : 0.0);
    tonemapPass.updateParams(ctx, effects.aces, effects.ao_dbg, effects.hdr);

    // Cone at 7 units "behind" the sun, oriented so local +Y points in sun.direction.
    {
      const d = new Vec3(sun.direction.x, sun.direction.y, sun.direction.z).normalize();
      const pos = d.scale(-20);
      // Apex is at local +Y; point it away from the scene so the base faces sun.direction.
      const up = d.negate();
      const ref = Math.abs(up.y) < 0.9 ? Vec3.right() : Vec3.forward().negate();
      const newX = up.cross(ref).normalize();
      const newZ = up.cross(newX).normalize();
      const s = 1.0;
      const coneModel = new Mat4([
        newX.x*s, newX.y*s, newX.z*s, 0,
        up.x*s,   up.y*s,   up.z*s,   0,
        newZ.x*s, newZ.y*s, newZ.z*s, 0,
        pos.x,    pos.y,    pos.z,    1,
      ]);
      debugLightPass.update(ctx, vp, coneModel, [1.0, 0.9, 0.3, 1.0]);
    }

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
