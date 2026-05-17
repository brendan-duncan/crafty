import { Vec3 } from '../src/math/index.js';
import { Scene } from '../src/engine/scene.js';
import { GameObject } from '../src/engine/game_object.js';
import { Camera } from '../src/engine/components/camera.js';
import { DirectionalLight } from '../src/engine/components/directional_light.js';
import { MeshRenderer } from '../src/engine/components/mesh_renderer.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph, type ResourceHandle } from '../src/renderer/render_graph/index.js';
import { ShadowPass, type ShadowMeshDraw } from '../src/renderer/render_graph/passes/shadow_pass.js';
import { GeometryPass, type DrawItem } from '../src/renderer/render_graph/passes/geometry_pass.js';
import { AtmospherePass } from '../src/renderer/render_graph/passes/atmosphere_pass.js';
import { CloudPass, type CloudSettings } from '../src/renderer/render_graph/passes/cloud_pass.js';
import { CloudShadowPass } from '../src/renderer/render_graph/passes/cloud_shadow_pass.js';
import { DeferredLightingPass } from '../src/renderer/render_graph/passes/deferred_lighting_pass.js';
import { GodrayPass } from '../src/renderer/render_graph/passes/godray_pass.js';
import { CompositePass } from '../src/renderer/render_graph/passes/composite_pass.js';
import { AutoExposurePass } from '../src/renderer/render_graph/passes/auto_exposure_pass.js';
import { Mesh, createCloudNoiseTextures } from '../src/assets/index.js';
import type { CloudNoiseTextures } from '../src/assets/index.js';
import { createRenderGraphViz } from '../src/renderer/render_graph/ui/render_graph_viz.js';

function createControlPanel(effects: Record<string, boolean>): HTMLDivElement {
  const panel = document.getElementById('panel')!;
  for (const key of Object.keys(effects)) {
    const btn = document.createElement('button');
    btn.className = 'toggle-btn';
    const label = key.toUpperCase().padEnd(5);
    const refresh = (): void => {
      const on = effects[key];
      btn.textContent = `${label} ${on ? 'ON ' : 'OFF'}`;
      btn.className = `toggle-btn ${on ? 'on' : 'off'}`;
    };
    btn.addEventListener('click', () => {
      effects[key] = !effects[key];
      refresh();
    });
    refresh();
    panel.appendChild(btn);
  }
  return panel as unknown as HTMLDivElement;
}

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const fpsElement = document.getElementById('fps')!;
  const sunSlider = document.getElementById('sun-angle') as HTMLInputElement;
  const sunLabel = document.getElementById('sun-label')!;
  const densitySlider = document.getElementById('cloud-density') as HTMLInputElement;
  const densityLabel = document.getElementById('density-label')!;
  const coverageSlider = document.getElementById('cloud-coverage') as HTMLInputElement;
  const coverageLabel = document.getElementById('coverage-label')!;
  const extinctionSlider = document.getElementById('cloud-extinction') as HTMLInputElement;
  const extinctionLabel = document.getElementById('extinction-label')!;
  const minHeightSlider = document.getElementById('cloud-min-height') as HTMLInputElement;
  const minHeightLabel = document.getElementById('min-height-label')!;
  const maxHeightSlider = document.getElementById('cloud-max-height') as HTMLInputElement;
  const maxHeightLabel = document.getElementById('max-height-label')!;
  const debugEl = document.getElementById('debug')!;
  debugEl.textContent = '';

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const { device } = ctx;
  const cache = new PhysicalResourceCache(device);

  // 1×1 white AO texture — this sample disables SSAO and tonemaps without AO
  // contribution, but composite still requires a sampleable AO source.
  const whiteAoTex = device.createTexture({
    label: 'WhiteAo', size: { width: 1, height: 1 },
    format: 'r8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  device.queue.writeTexture({ texture: whiteAoTex }, new Uint8Array([255]), { bytesPerRow: 1 }, { width: 1, height: 1 });

  const scene = new Scene();

  const cameraGO = new GameObject({ name: 'Camera' });
  cameraGO.position.set(0, 10, 50);
  const camera = cameraGO.addComponent(
    Camera.createPerspective(60, 0.1, 500, ctx.width / ctx.height),
  );
  const cameraController = CameraController.create({ yaw: 0, pitch: 0.1, speed: 20, sensitivity: 0.002, pointerLock: false });
  cameraController.attach(canvas);
  cameraController.update(cameraGO, 0);
  scene.add(cameraGO);

  // Stop mouse events on the slider/panel UI from reaching the
  // document-level listeners CameraController installs — otherwise dragging
  // a slider thumb also drags the camera. mousedown/move/up cover the drag.
  for (const id of ['sun-control', 'panel']) {
    const el = document.getElementById(id);
    if (!el) continue;
    for (const ev of ['mousedown', 'mousemove', 'mouseup'] as const) {
      el.addEventListener(ev, (e) => e.stopPropagation());
    }
  }

  const sunGO = new GameObject({ name: 'Sun' });
  const sun = sunGO.addComponent(
    new DirectionalLight(new Vec3(0.3, -0.8, -0.5).normalize(), new Vec3(1.0, 0.95, 0.9), 1.0, 4),
  );
  scene.add(sunGO);

  const planeMesh = Mesh.createPlane(device, 200, 200, 1, 1);
  const groundMat = new PbrMaterial({
    albedo: [0.6, 0.8, 0.6, 1.0],
    roughness: 0.9,
    metallic: 0.0,
  });
  const groundGO = new GameObject({ name: 'Ground' });
  groundGO.addComponent(new MeshRenderer(planeMesh, groundMat));
  scene.add(groundGO);

  const cubeMesh = Mesh.createCube(device, 2);
  const cubeMat = new PbrMaterial({
    albedo: [1.0, 0.9, 0.8, 1.0],
    roughness: 0.3,
    metallic: 0.0,
  });
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const radius = 15 + (i % 3) * 8;
    const go = new GameObject({ name: `Target${i}` });
    go.position.set(Math.cos(angle) * radius, 1, Math.sin(angle) * radius);
    go.addComponent(new MeshRenderer(cubeMesh, cubeMat));
    scene.add(go);
  }

  const cloudNoises: CloudNoiseTextures = createCloudNoiseTextures(device);

  const cloudSettings: CloudSettings = {
    cloudBase   : 30,
    cloudTop    : 55,
    coverage    : 0.8,
    density     : 0.8,
    windOffset  : [0, 0],
    anisotropy  : 0.85,
    extinction  : 0.52,
    ambientColor: [0.4, 0.55, 0.7],
    exposure    : 0.2,
  };

  const shadowPass = ShadowPass.create(ctx);
  const geometryPass = GeometryPass.create(ctx);
  const cloudShadowPass = CloudShadowPass.create(ctx, cloudNoises);
  const lightingPass = DeferredLightingPass.create(ctx);
  const cloudPass = CloudPass.create(ctx, cloudNoises);
  const atmospherePass = AtmospherePass.create(ctx);
  const godrayPass = GodrayPass.create(ctx, cloudNoises);
  const compositePass = CompositePass.create(ctx);
  const autoExposurePass = AutoExposurePass.create(ctx);
  autoExposurePass.enabled = false;
  autoExposurePass.setFixedExposure(1.0);
  const graphViz = createRenderGraphViz(null).attach();

  // Disable depth fog so it doesn't wash out the ground shadows
  compositePass.depthFogEnabled = false;

  const effects: Record<string, boolean> = {
    clouds: true,
    cloudShadow: true,
    godray: true,
  };
  createControlPanel(effects);

  function updateSun(angleDeg: number): void {
    const angleRad = angleDeg * Math.PI / 180;
    const elev = Math.sin(angleRad);
    const dx = 0.3 * Math.cos(angleRad);
    const dz = 1.0 * Math.cos(angleRad);
    sun.direction.set(dx, -elev, dz).normalize();
    const t = Math.max(0, elev);
    sun.intensity = t * 10.0;
    sun.color.set(1.0, 0.8 + 0.2 * t, 0.6 + 0.4 * t);
    sunLabel.textContent = `${angleDeg}°`;
  }
  updateSun(parseFloat(sunSlider.value));
  sunSlider.addEventListener('input', () => updateSun(parseFloat(sunSlider.value)));

  function updateDensity(v: number): void { cloudSettings.density = v; densityLabel.textContent = v.toFixed(2); }
  function updateCoverage(v: number): void { cloudSettings.coverage = v; coverageLabel.textContent = v.toFixed(2); }
  function updateExtinction(v: number): void { cloudSettings.extinction = v; extinctionLabel.textContent = v.toFixed(2); }
  function updateMinHeight(v: number): void {
    cloudSettings.cloudBase = v;
    minHeightLabel.textContent = v.toFixed(0);
    if (cloudSettings.cloudTop < v) {
      cloudSettings.cloudTop = v;
      maxHeightSlider.value = String(v);
      maxHeightLabel.textContent = v.toFixed(0);
    }
  }
  function updateMaxHeight(v: number): void {
    cloudSettings.cloudTop = v;
    maxHeightLabel.textContent = v.toFixed(0);
    if (cloudSettings.cloudBase > v) {
      cloudSettings.cloudBase = v;
      minHeightSlider.value = String(v);
      minHeightLabel.textContent = v.toFixed(0);
    }
  }

  minHeightSlider.value = String(cloudSettings.cloudBase);
  maxHeightSlider.value = String(cloudSettings.cloudTop);
  updateDensity(parseFloat(densitySlider.value));
  updateCoverage(parseFloat(coverageSlider.value));
  updateExtinction(parseFloat(extinctionSlider.value));
  updateMinHeight(parseFloat(minHeightSlider.value));
  updateMaxHeight(parseFloat(maxHeightSlider.value));
  densitySlider.addEventListener('input', () => updateDensity(parseFloat(densitySlider.value)));
  coverageSlider.addEventListener('input', () => updateCoverage(parseFloat(coverageSlider.value)));
  extinctionSlider.addEventListener('input', () => updateExtinction(parseFloat(extinctionSlider.value)));
  minHeightSlider.addEventListener('input', () => updateMinHeight(parseFloat(minHeightSlider.value)));
  maxHeightSlider.addEventListener('input', () => updateMaxHeight(parseFloat(maxHeightSlider.value)));

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    cache.trimUnused();
  });
  resizeObserver.observe(canvas);

  function frame(): void {
    ctx.update();
    fpsElement.textContent = `FPS: ${ctx.fps}`;

    cameraController.update(cameraGO, ctx.deltaTime);
    scene.update(ctx.deltaTime);
    scene.updateRender(ctx);
    ctx.activeCamera = camera;

    const camPos = camera.position();
    const invVP = camera.inverseViewProjectionMatrix();

    const cascades = sun.computeCascadeMatrices(camera, 200);

    const meshRenderers = scene.collectMeshRenderers();
    const drawItems: DrawItem[] = meshRenderers.map((mr) => {
      const w = mr.gameObject.localToWorld();
      return { mesh: mr.mesh, modelMatrix: w, normalMatrix: w.normalMatrix(), material: mr.material };
    });
    const shadowItems: ShadowMeshDraw[] = meshRenderers
      .filter((mr) => mr.castShadow)
      .map((mr) => ({ mesh: mr.mesh, modelMatrix: mr.gameObject.localToWorld() }));

    geometryPass.setDrawItems(drawItems);
    geometryPass.updateCamera(ctx);

    if (effects.clouds) {
      const windSpeed = 0.03;
      const windDir: [number, number] = [1, 0.3];
      cloudSettings.windOffset[0] += windSpeed * windDir[0] * ctx.deltaTime;
      cloudSettings.windOffset[1] += windSpeed * windDir[1] * ctx.deltaTime;

      cloudShadowPass.update(ctx, cloudSettings, [0, 0], 100);
      godrayPass.updateCloudDensity(ctx, cloudSettings);
      cloudPass.updateCamera(ctx);
      cloudPass.updateLight(ctx, sun.direction, sun.color, sun.intensity);
      cloudPass.updateSettings(ctx, cloudSettings);
    } else {
      atmospherePass.update(ctx, invVP, camPos, sun.direction);
    }

    lightingPass.updateCamera(ctx);
    lightingPass.updateLight(ctx, sun.direction, sun.color, sun.intensity, cascades, true, false);
    lightingPass.updateCloudShadow(ctx, 0, 0, effects.cloudShadow ? 100 : 0);

    compositePass.updateParams(ctx, false, 0, true, false, ctx.hdr);
    compositePass.updateStars(ctx, invVP, camPos, { x: -sun.direction.x, y: -sun.direction.y, z: -sun.direction.z });

    const graph = new RenderGraph(ctx, cache);
    const backbuffer = graph.setBackbuffer('canvas');
    const whiteAo = graph.importExternalTexture(whiteAoTex, {
      label: 'WhiteAo', format: 'r8unorm', width: 1, height: 1,
    });

    const shadow = shadowPass.addToGraph(graph, { cascades, drawItems: shadowItems });
    const gbuf = geometryPass.addToGraph(graph, { loadOp: 'clear' });

    // Cloud (or atmosphere) clears HDR; lighting loads it.
    const skyHdr = effects.clouds
      ? cloudPass.addToGraph(graph, { depth: gbuf.depth }).hdr
      : atmospherePass.addToGraph(graph).hdr;

    // Cloud shadow runs every other frame; the lighting pass samples it via deps.
    let cloudShadow: ResourceHandle | undefined;
    if (effects.cloudShadow) {
      cloudShadow = cloudShadowPass.addToGraph(graph).shadow;
    }

    const lit = lightingPass.addToGraph(graph, {
      gbuffer: gbuf,
      shadowMap: shadow.shadowMap,
      hdr: skyHdr,
      cloudShadow,
    });

    let hdr = lit.hdr;
    if (effects.godray) {
      hdr = godrayPass.addToGraph(graph, {
        hdr,
        depth: gbuf.depth,
        shadowMap: shadow.shadowMap,
        cameraBuffer: lit.cameraBuffer,
        lightBuffer: lit.lightBuffer,
      }).hdr;
    }

    const exposure = autoExposurePass.addToGraph(graph, { hdr });
    compositePass.addToGraph(graph, {
      input: hdr,
      ao: whiteAo,
      depth: gbuf.depth,
      cameraBuffer: lit.cameraBuffer,
      lightBuffer: lit.lightBuffer,
      exposureBuffer: exposure.exposureBuffer,
      backbuffer,
    });

    const compiled = graph.compile();
    graphViz.setGraph(graph, compiled);
    void graph.execute(compiled);

    requestAnimationFrame(frame);
  }

  frame();
}

main().catch(err => {
  document.body.innerHTML = `<pre style="color:red;padding:1rem">${err.message ?? err}</pre>`;
  console.error(err);
});
