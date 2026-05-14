/**
 * Render-graph engine test, exercising every converted pass:
 *   ShadowPass + PointSpotShadowPass → GeometryPass + SkinnedGeometryPass
 *   + ParticlePass(deferred) → SSAOPass + SSGIPass
 *   → CloudShadowPass + CloudPass / AtmospherePass
 *   → DeferredLightingPass → PointSpotLightPass → ParticlePass(forward HDR)
 *   → TAAPass → DofPass → BloomPass → AutoExposurePass → CompositePass → backbuffer
 *
 * Scene: tiled plane, spinning textured cubes, mirror sphere, animated fox,
 * orbiting torch (point) + downward spot light, fire + sparks emitters,
 * weather (rain/snow) toggle, optional volumetric clouds.
 */

import belfastUrl from '../assets/cubemaps/hdr/belfast.hdr?url';
import colorAtlasUrl from '../assets/cube_textures/simple_block_atlas.png?url';
import normalAtlasUrl from '../assets/cube_textures/simple_block_atlas_normal.png?url';
import merAtlasUrl from '../assets/cube_textures/simple_block_atlas_mer.png?url';
import heightAtlasUrl from '../assets/cube_textures/simple_block_atlas_heightmap.png?url';
import foxUrl from '../assets/fox.glb?url';

import { Mat4, Vec3, Quaternion } from '../src/math/index.js';
import {
  GameObject, Scene, Camera, DirectionalLight, MeshRenderer, CameraController,
  AnimatedModel, PointLight, SpotLight,
} from '../src/engine/index.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { Mesh, BlockTexture, GltfLoader, createCloudNoiseTextures } from '../src/assets/index.js';
import type { GltfModel, CloudNoiseTextures } from '../src/assets/index.js';
import { parseHdr, createHdrTexture } from '../src/assets/hdr_loader.js';
import { computeIblGpu } from '../src/assets/ibl.js';
import type { IblTextures } from '../src/assets/ibl.js';
import type { ParticleGraphConfig } from '../src/particles/index.js';

import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph, type ResourceHandle } from '../src/renderer/render_graph/index.js';
import { ShadowPass } from '../src/renderer/render_graph/passes/shadow_pass.js';
import { PointSpotShadowPass } from '../src/renderer/render_graph/passes/point_spot_shadow_pass.js';
import { GeometryPass, type DrawItem } from '../src/renderer/render_graph/passes/geometry_pass.js';
import { SkinnedGeometryPass, type SkinnedDrawItem } from '../src/renderer/render_graph/passes/skinned_geometry_pass.js';
import { ParticlePass } from '../src/renderer/render_graph/passes/particle_pass.js';
import { SSAOPass } from '../src/renderer/render_graph/passes/ssao_pass.js';
import { SSGIPass } from '../src/renderer/render_graph/passes/ssgi_pass.js';
import { CloudShadowPass } from '../src/renderer/render_graph/passes/cloud_shadow_pass.js';
import { CloudPass, type CloudSettings } from '../src/renderer/render_graph/passes/cloud_pass.js';
import { AtmospherePass } from '../src/renderer/render_graph/passes/atmosphere_pass.js';
import { DeferredLightingPass } from '../src/renderer/render_graph/passes/deferred_lighting_pass.js';
import { PointSpotLightPass } from '../src/renderer/render_graph/passes/point_spot_light_pass.js';
import { TAAPass } from '../src/renderer/render_graph/passes/taa_pass.js';
import { DofPass } from '../src/renderer/render_graph/passes/dof_pass.js';
import { BloomPass } from '../src/renderer/render_graph/passes/bloom_pass.js';
import { AutoExposurePass } from '../src/renderer/render_graph/passes/auto_exposure_pass.js';
import { CompositePass } from '../src/renderer/render_graph/passes/composite_pass.js';

// Halton sequence for TAA jitter.
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

function createControlPanel(effects: Record<string, boolean>): HTMLDivElement {
  const panel = document.createElement('div');
  panel.style.cssText = [
    'position:fixed', 'top:12px', 'left:12px',
    'display:flex', 'flex-direction:column', 'gap:6px',
    'font-family:ui-monospace,monospace', 'font-size:13px',
    'user-select:none',
  ].join(';');
  const ON_STYLE = 'background:#1a2e1a;color:#5f5;border-color:#5f5';
  const OFF_STYLE = 'background:#2e1a1a;color:#f55;border-color:#f55';
  for (const key of Object.keys(effects)) {
    const btn = document.createElement('button');
    const label = key.toUpperCase().padEnd(8);
    const refresh = () => {
      const on = effects[key];
      btn.textContent = `${label} ${on ? 'ON ' : 'OFF'}`;
      btn.setAttribute('style', [
        'padding:5px 10px', 'border-width:1px', 'border-style:solid',
        'border-radius:4px', 'cursor:pointer', 'letter-spacing:0.04em',
        on ? ON_STYLE : OFF_STYLE,
      ].join(';'));
    };
    btn.addEventListener('click', () => { effects[key] = !effects[key]; refresh(); });
    refresh();
    panel.appendChild(btn);
  }
  document.body.appendChild(panel);
  return panel;
}

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) throw new Error('No canvas element');

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const { device } = ctx;

  // ── Assets ────────────────────────────────────────────────────────────────
  const skyHdr = parseHdr(await (await fetch(belfastUrl)).arrayBuffer());
  const skyTexture = await createHdrTexture(device, skyHdr);
  const iblTextures: IblTextures = await computeIblGpu(device, skyTexture.gpuTexture);
  const cloudNoises: CloudNoiseTextures = createCloudNoiseTextures(device);
  const cloudSettings: CloudSettings = {
    cloudBase: 1, cloudTop: 10, coverage: 0.75, density: 3.0,
    windOffset: [0, 0], anisotropy: 0.85, extinction: 0.25,
    ambientColor: [0.6, 0.7, 0.9], exposure: 0.2,
  };
  const cloudWindSpeed = 0.03;
  const cloudWindDir: [number, number] = [1, 0.3];
  const blockTex = await BlockTexture.load(device, colorAtlasUrl, normalAtlasUrl, merAtlasUrl, heightAtlasUrl);

  // ── Scene ─────────────────────────────────────────────────────────────────
  const scene = new Scene();

  const planeGO = new GameObject({ name: 'Plane' });
  const [pUvOx, pUvOy, pUvSx, pUvSy] = blockTex.uvTransform(2);
  planeGO.addComponent(new MeshRenderer(Mesh.createPlane(device, 100, 100, 4, 4), new PbrMaterial({
    albedo: [1, 1, 1, 1], roughness: 1.0, metallic: 1.0,
    uvOffset: [pUvOx, pUvOy], uvScale: [pUvSx, pUvSy], uvTile: [40, 40],
    albedoMap: blockTex.colorAtlas, normalMap: blockTex.normalAtlas, merMap: blockTex.merAtlas,
  })));
  scene.add(planeGO);

  const cubeMesh = Mesh.createCube(device, 1);
  const cubeConfigs = [
    { pos: [ 0,  0.5,  0], blockId: 4, speed: 0.5 },
    { pos: [-3,  0.5,  2], blockId: 5, speed: 0.8 },
    { pos: [ 3,  0.5,  2], blockId: 6, speed: 0.3 },
    { pos: [-2,  0.5, -2], blockId: 7, speed: 1.1 },
    { pos: [ 2,  0.5, -2], blockId: 8, speed: 0.6 },
  ];
  const cubeGOs = cubeConfigs.map(({ pos, blockId }, i) => {
    const [uvOx, uvOy, uvSx, uvSy] = blockTex.uvTransform(blockId);
    const go = new GameObject({ name: `Cube${i}` });
    go.position.set(pos[0], pos[1], pos[2]);
    go.addComponent(new MeshRenderer(cubeMesh, new PbrMaterial({
      albedo: [1, 1, 1, 1], roughness: 1.0, metallic: 1.0,
      uvOffset: [uvOx, uvOy], uvScale: [uvSx, uvSy],
      albedoMap: blockTex.colorAtlas, normalMap: blockTex.normalAtlas, merMap: blockTex.merAtlas,
    })));
    scene.add(go);
    return go;
  });

  const sphereGO = new GameObject({ name: 'MirrorSphere' });
  sphereGO.position.set(0, 1, 4);
  sphereGO.addComponent(new MeshRenderer(
    Mesh.createSphere(device, 1, 64, 64),
    new PbrMaterial({ albedo: [1, 1, 1, 1], metallic: 1.0, roughness: 0.0 }),
  ));
  scene.add(sphereGO);

  // Skinned fox.
  let foxModel: GltfModel | null = null;
  let foxAnimated: AnimatedModel | null = null;
  GltfLoader.load(device, foxUrl).then(model => {
    foxModel = model;
    if (!model.skin || model.meshes.length === 0) return;
    const foxGO = new GameObject({ name: 'Fox' });
    foxGO.position.set(5, 0, 2);
    foxAnimated = foxGO.addComponent(new AnimatedModel(model));
    const firstClip = model.clips[0]?.name;
    if (firstClip) foxAnimated.play(firstClip, true);
    scene.add(foxGO);
  }).catch(err => console.error('fox.glb load failed:', err));

  const fireEmitterGO = new GameObject({ name: 'FireEmitter' });
  fireEmitterGO.position.set(5, 0, 5);
  const sparksEmitterGO = new GameObject({ name: 'SparksEmitter' });
  sparksEmitterGO.position.set(-3, 0, 2);

  // Sun light.
  const sunGO = new GameObject({ name: 'Sun' });
  const sun = sunGO.addComponent(new DirectionalLight(new Vec3(0.3, -1, 0.5), Vec3.one(), 3, 3));
  scene.add(sunGO);

  // Torch (point light).
  const torchGO = new GameObject({ name: 'Torch' });
  torchGO.position.set(2, 1.5, 1);
  const torchLight = torchGO.addComponent(new PointLight());
  torchLight.color.set(1.0, 0.55, 0.15);
  torchLight.intensity = 8.0;
  torchLight.radius = 6.0;
  torchLight.castShadow = true;
  scene.add(torchGO);

  // Spot light pointing down.
  const spotGO = new GameObject({ name: 'Spot' });
  spotGO.position.set(-4, 6, 0);
  spotGO.rotation = Quaternion.fromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
  const spotLight = spotGO.addComponent(new SpotLight());
  spotLight.color.set(0.9, 0.95, 1.0);
  spotLight.intensity = 45.0;
  spotLight.range = 12.0;
  spotLight.innerAngle = 12;
  spotLight.outerAngle = 22;
  spotLight.castShadow = true;
  scene.add(spotGO);

  const cameraGO = new GameObject({ name: 'Camera' });
  cameraGO.position.set(0, 4, -8);
  const camera = cameraGO.addComponent(new Camera(60, 0.1, 100, ctx.width / ctx.height));
  scene.add(cameraGO);

  const cameraController = CameraController.create({
    yaw: Math.PI, pitch: 0.1, speed: 3, sensitivity: 0.002, pointerLock: false,
  });
  cameraController.attach(canvas);

  // ── Particle configs ─────────────────────────────────────────────────────
  const fireConfig: ParticleGraphConfig = {
    emitter: {
      maxParticles: 2000, spawnRate: 200, lifetime: [1.5, 3.0],
      shape: { kind: 'cone', radius: 0.1, angle: Math.PI / 8 },
      initialSpeed: [1.5, 3.0], initialColor: [1.0, 0.45, 0.05, 1.0],
      initialSize: [0.08, 0.18], roughness: 0.9, metallic: 0.0,
    },
    modifiers: [
      { type: 'gravity', strength: -2.0 },
      { type: 'drag', coefficient: 1.5 },
      { type: 'color_over_lifetime', startColor: [1.0, 0.45, 0.05, 1.0], endColor: [0.3, 0.05, 0.0, 0.0] },
      { type: 'size_over_lifetime', start: 0.15, end: 0.02 },
    ],
    renderer: { type: 'sprites', blendMode: 'additive', billboard: 'camera' },
  };
  const sparksConfig: ParticleGraphConfig = {
    emitter: {
      maxParticles: 5000, spawnRate: 80, lifetime: [2.0, 5.0],
      shape: { kind: 'sphere', radius: 0.05, solidAngle: Math.PI },
      initialSpeed: [2.0, 6.0], initialColor: [0.6, 0.8, 1.0, 1.0],
      initialSize: [0.04, 0.08], roughness: 0.2, metallic: 0.8,
    },
    modifiers: [
      { type: 'gravity', strength: 4.0 },
      { type: 'drag', coefficient: 0.3 },
      { type: 'curl_noise', scale: 0.8, strength: 1.5, timeScale: 0.4 },
      { type: 'color_over_lifetime', startColor: [0.6, 0.8, 1.0, 1.0], endColor: [0.1, 0.15, 0.4, 0.0] },
    ],
    renderer: { type: 'sprites', blendMode: 'additive', billboard: 'camera' },
  };
  const snowConfig: ParticleGraphConfig = {
    emitter: {
      maxParticles: 15000, spawnRate: 500, lifetime: [5.0, 8.0],
      shape: { kind: 'box', halfExtents: [35, 0.1, 35] },
      initialSpeed: [0, 0], initialColor: [0.92, 0.96, 1.0, 0.75],
      initialSize: [0.04, 0.12], roughness: 0.1, metallic: 0.0,
    },
    modifiers: [
      { type: 'gravity', strength: 1.2 },
      { type: 'drag', coefficient: 0.35 },
      { type: 'size_random', min: 0.02, max: 0.18 },
      { type: 'vortex', strength: 0.08 },
      { type: 'curl_noise', scale: 0.15, strength: 1.2, timeScale: 0.06, octaves: 3 },
    ],
    renderer: { type: 'sprites', blendMode: 'alpha', billboard: 'camera', renderTarget: 'hdr' },
  };
  const rainConfig: ParticleGraphConfig = {
    emitter: {
      maxParticles: 30000, spawnRate: 9000, lifetime: [2.0, 3.5],
      shape: { kind: 'box', halfExtents: [35, 0.1, 35] },
      initialSpeed: [0, 0], initialColor: [0.75, 0.88, 1.0, 0.55],
      initialSize: [0.008, 0.015], roughness: 0.1, metallic: 0.0,
    },
    modifiers: [
      { type: 'gravity', strength: 9.0 },
      { type: 'drag', coefficient: 0.05 },
      { type: 'color_over_lifetime', startColor: [0.75, 0.88, 1.0, 0.55], endColor: [0.75, 0.88, 1.0, 0.0] },
    ],
    renderer: { type: 'sprites', blendMode: 'alpha', billboard: 'velocity', renderTarget: 'hdr' },
  };

  // ── Render-graph passes (constructed once; survive across frames) ────────
  const cache = new PhysicalResourceCache(device);
  const shadowPass = ShadowPass.create(ctx);
  const pointSpotShadowPass = PointSpotShadowPass.create(ctx);
  const geometryPass = GeometryPass.create(ctx);
  const skinnedGeometryPass = SkinnedGeometryPass.create(ctx);
  const firePass = ParticlePass.create(ctx, fireConfig);
  const sparksPass = ParticlePass.create(ctx, sparksConfig);
  const ssaoPass = SSAOPass.create(ctx);
  const ssgiPass = SSGIPass.create(ctx);
  const cloudShadowPass = CloudShadowPass.create(ctx, cloudNoises);
  const cloudPass = CloudPass.create(ctx, cloudNoises);
  const atmospherePass = AtmospherePass.create(ctx);
  const lightingPass = DeferredLightingPass.create(ctx);
  const pointSpotLightPass = PointSpotLightPass.create(ctx);
  const rainPass = ParticlePass.create(ctx, rainConfig);
  const snowPass = ParticlePass.create(ctx, snowConfig);
  const taaPass = TAAPass.create(ctx);
  const dofPass = DofPass.create(ctx);
  const bloomPass = BloomPass.create(ctx);
  const autoExposurePass = AutoExposurePass.create(ctx);
  const compositePass = CompositePass.create(ctx);

  // ── UI ────────────────────────────────────────────────────────────────────
  const effects = { ssao: true, ssgi: true, dof: true, bloom: true, taa: true, clouds: false, weather: false, lights: true };
  createControlPanel(effects);

  const hint = document.createElement('div');
  hint.textContent = 'Click to look around · WASD move · Space / Shift up / down';
  hint.style.cssText = [
    'position:fixed', 'bottom:16px', 'left:50%', 'transform:translateX(-50%)',
    'padding:6px 14px', 'border-radius:4px', 'background:rgba(0,0,0,0.55)', 'color:#ccc',
    'font-family:ui-monospace,monospace', 'font-size:12px', 'pointer-events:none',
  ].join(';');
  document.body.appendChild(hint);

  const fpsEl = document.createElement('div');
  fpsEl.style.cssText = [
    'position:fixed', 'top:12px', 'right:12px', 'font-size:13px',
    'color:#ff0', 'background:rgba(0,0,0,0.45)', 'padding:4px 8px', 'border-radius:4px',
    'font-family:ui-monospace,monospace', 'pointer-events:none',
  ].join(';');
  document.body.appendChild(fpsEl);

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    camera.aspect = w / h;
    cache.trimUnused();
  });
  resizeObserver.observe(canvas);

  // ── Frame loop ────────────────────────────────────────────────────────────
  let lastTime = 0;
  let smoothFps = 0;
  let angle = 0;
  let frameIndex = 0;
  let prevViewProj: Mat4 | null = null;
  let loggedPasses = false;

  function frame(time: number): void {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    ctx.update();
    if (dt > 0) {
      smoothFps += (1 / dt - smoothFps) * 0.1;
      fpsEl.textContent = `${smoothFps.toFixed(0)} fps`;
    }
    angle += dt;

    fireEmitterGO.position.set(5 + Math.cos(angle) * 2, 0, 5 + Math.sin(angle) * 2);
    sparksEmitterGO.position.set(-3 + Math.cos(angle * 1.5) * 1.5, 0, 2 + Math.sin(angle * 1.5) * 1.5);
    cubeGOs.forEach((go, i) => {
      go.rotation = Quaternion.fromAxisAngle(Vec3.up(), angle * cubeConfigs[i].speed);
    });
    cameraController.update(cameraGO, dt);

    const sunAngle = angle * 0.4;
    sun.direction.set(Math.cos(sunAngle), -0.8, Math.sin(sunAngle));
    scene.update(dt);

    // Camera matrices (with Halton jitter for TAA).
    const hi = (frameIndex % 16) + 1;
    const jx = effects.taa ? (halton(hi, 2) - 0.5) * (2 / ctx.width) : 0;
    const jy = effects.taa ? (halton(hi, 3) - 0.5) * (2 / ctx.height) : 0;

    const vp = camera.viewProjectionMatrix();
    const jitVP = applyJitter(vp, jx, jy);
    const view = camera.viewMatrix();
    const proj = camera.projectionMatrix();
    const invVP = vp.invert();
    const invProj = proj.invert();
    const camPos = camera.position();
    const cascades = sun.computeCascadeMatrices(camera);

    // Collect mesh draws.
    const meshRenderers = scene.collectMeshRenderers();
    const drawItems: DrawItem[] = meshRenderers.map(mr => {
      const world = mr.gameObject.localToWorld();
      return { mesh: mr.mesh, modelMatrix: world, normalMatrix: world.normalMatrix(), material: mr.material };
    });
    const shadowItems = meshRenderers
      .filter(mr => mr.castShadow)
      .map(mr => ({ mesh: mr.mesh, modelMatrix: mr.gameObject.localToWorld() }));

    let skinnedItems: SkinnedDrawItem[] = [];
    if (foxModel) {
      skinnedItems = scene.getComponents(AnimatedModel).map(am => {
        const world = am.gameObject.localToWorld();
        return am.model.meshes.map(md => ({
          mesh: md.skinnedMesh,
          modelMatrix: world,
          normalMatrix: world.normalMatrix(),
          material: md.material,
          jointMatrices: am.jointMatrices,
        }));
      }).flat();
    }

    const pointLights = scene.getComponents(PointLight);
    const spotLights = scene.getComponents(SpotLight);

    // ── Per-frame uniform updates ────────────────────────────────────────
    geometryPass.setDrawItems(drawItems);
    geometryPass.updateCamera(ctx, view, proj, jitVP, invVP, camPos, camera.near, camera.far);
    skinnedGeometryPass.setDrawItems(skinnedItems);
    skinnedGeometryPass.updateCamera(ctx, view, proj, jitVP, invVP, camPos, camera.near, camera.far);

    pointSpotShadowPass.update(pointLights, spotLights, shadowItems);
    pointSpotLightPass.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    pointSpotLightPass.updateLights(ctx, pointLights, spotLights);

    if (effects.clouds) {
      cloudSettings.windOffset[0] += cloudWindSpeed * cloudWindDir[0] * dt;
      cloudSettings.windOffset[1] += cloudWindSpeed * cloudWindDir[1] * dt;
      cloudShadowPass.update(ctx, cloudSettings, [0, 0], 60);
      cloudPass.updateCamera(ctx, invVP, camPos, camera.near, camera.far);
      cloudPass.updateLight(ctx, sun.direction, sun.color, sun.intensity);
      cloudPass.updateSettings(ctx, cloudSettings);
    } else {
      atmospherePass.update(ctx, invVP, camPos, sun.direction);
    }

    lightingPass.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    lightingPass.updateLight(ctx, sun.direction, sun.color, sun.intensity, cascades, true, false);
    lightingPass.updateCloudShadow(ctx, 0, 0, 60);

    ssaoPass.updateCamera(ctx, view, proj, invProj);
    ssaoPass.updateParams(ctx, 1.0, 0.005, effects.ssao ? 2.0 : 0.0);
    ssgiPass.updateSettings({ strength: effects.ssgi ? 1.0 : 0.0 });
    ssgiPass.updateCamera(ctx, view, proj, invProj, invVP, prevViewProj ?? vp, camPos);

    firePass.update(ctx, dt, view, proj, vp, invVP, camPos, camera.near, camera.far, fireEmitterGO.localToWorld());
    sparksPass.update(ctx, dt, view, proj, vp, invVP, camPos, camera.near, camera.far, sparksEmitterGO.localToWorld());
    const rainMat = new Mat4([1,0,0,0, 0,1,0,0, 0,0,1,0, camPos.x, camPos.y + 8, camPos.z, 1]);
    rainPass.update(ctx, dt, view, proj, vp, invVP, camPos, camera.near, camera.far, rainMat);
    const snowMat = new Mat4([1,0,0,0, 0,1,0,0, 0,0,1,0, camPos.x, camPos.y + 8, camPos.z, 1]);
    snowPass.update(ctx, dt, view, proj, vp, invVP, camPos, camera.near, camera.far, snowMat);

    taaPass.updateCamera(ctx, invVP, prevViewProj ?? vp);
    autoExposurePass.update(ctx, dt);
    compositePass.updateParams(ctx, false, 0, true, false, ctx.hdr);
    compositePass.updateStars(ctx, invVP, camPos, new Vec3(0, 1, 0));

    // ── Build the render graph ────────────────────────────────────────────
    const graph = new RenderGraph(ctx, cache);
    const backbuffer = graph.setBackbuffer('canvas');

    // 1. Shadows
    const shadow = shadowPass.addToGraph(graph, { cascades, drawItems: shadowItems });
    const ps = effects.lights ? pointSpotShadowPass.addToGraph(graph) : null;

    // 2. GBuffer fill
    let gbuffer = geometryPass.addToGraph(graph);
    if (skinnedItems.length > 0) {
      gbuffer = skinnedGeometryPass.addToGraph(graph, { gbuffer });
    }
    const fireOut = firePass.addToGraph(graph, { gbuffer });
    if (fireOut.albedo && fireOut.normal && fireOut.depth) {
      gbuffer = { albedo: fireOut.albedo, normal: fireOut.normal, depth: fireOut.depth };
    }
    const sparksOut = sparksPass.addToGraph(graph, { gbuffer });
    if (sparksOut.albedo && sparksOut.normal && sparksOut.depth) {
      gbuffer = { albedo: sparksOut.albedo, normal: sparksOut.normal, depth: sparksOut.depth };
    }

    // 3. SSAO + SSGI. SSGI bounces last frame's TAA history as previous-frame
    //    radiance — import the persistent TAA history texture by its stable key.
    const ssao = ssaoPass.addToGraph(graph, { normal: gbuffer.normal, depth: gbuffer.depth });
    const taaHistoryHandle = graph.importPersistentTexture('taa:history', {
      label: 'TAAHistory', format: 'rgba16float', width: ctx.width, height: ctx.height,
    });
    const ssgi = ssgiPass.addToGraph(graph, {
      prevRadiance: taaHistoryHandle,
      normal: gbuffer.normal,
      depth: gbuffer.depth,
    });

    // 4. Cloud shadow + sky/atmosphere clears HDR
    let hdrSky: ResourceHandle;
    let cloudShadowHandle: ResourceHandle | undefined;
    if (effects.clouds) {
      cloudShadowHandle = cloudShadowPass.addToGraph(graph).shadow;
      hdrSky = cloudPass.addToGraph(graph, { depth: gbuffer.depth }).hdr;
    } else {
      hdrSky = atmospherePass.addToGraph(graph).hdr;
    }

    // 5. Deferred directional lighting (loads sky)
    const lit = lightingPass.addToGraph(graph, {
      gbuffer,
      shadowMap: shadow.shadowMap,
      ao: ssao.ao,
      ssgi: ssgi.result,
      cloudShadow: cloudShadowHandle,
      hdr: hdrSky,
      iblTextures,
    });

    // 6. Point + spot lights additively blend on top
    let hdrLit = lit.hdr;
    if (effects.lights && ps) {
      hdrLit = pointSpotLightPass.addToGraph(graph, {
        gbuffer,
        pointVsm: ps.pointVsm,
        spotVsm: ps.spotVsm,
        projTex: ps.projTex,
        hdr: hdrLit,
      }).hdr;
    }

    // 7. Forward HDR particles (rain/snow) — only when weather is on
    if (effects.weather) {
      hdrLit = rainPass.addToGraph(graph, { gbuffer, hdr: hdrLit }).hdr ?? hdrLit;
      hdrLit = snowPass.addToGraph(graph, { gbuffer, hdr: hdrLit }).hdr ?? hdrLit;
    }

    // 8. TAA → DoF → Bloom
    let postInput = hdrLit;
    if (effects.taa) {
      postInput = taaPass.addToGraph(graph, { hdr: hdrLit, depth: gbuffer.depth }).resolved;
    }
    if (effects.dof) {
      postInput = dofPass.addToGraph(graph, { hdr: postInput, depth: gbuffer.depth }).result;
    }
    if (effects.bloom) {
      postInput = bloomPass.addToGraph(graph, { hdr: postInput }).result;
    }

    // 9. Auto exposure (reads HDR scene radiance pre-tonemap)
    const exposure = autoExposurePass.addToGraph(graph, { hdr: hdrLit });

    // 10. Composite to backbuffer
    compositePass.addToGraph(graph, {
      input: postInput,
      ao: ssao.ao,
      depth: gbuffer.depth,
      cameraBuffer: lit.cameraBuffer,
      lightBuffer: lit.lightBuffer,
      exposureBuffer: exposure.exposureBuffer,
      backbuffer,
    });

    const compiled = graph.compile();
    if (!loggedPasses) {
      const passes = compiled.passes.map(p => p.node.name).join(' → ');
      console.log(`[engine_test_rg] passes after compile: ${passes}`);
      loggedPasses = true;
    }
    void graph.execute(compiled);

    prevViewProj = vp;
    frameIndex++;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main().catch(err => {
  document.body.innerHTML = `<pre style="color:red;padding:1rem">${err}</pre>`;
  console.error(err);
});
