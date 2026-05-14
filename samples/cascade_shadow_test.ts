import skyHdrUrl from '../assets/cubemaps/hdr/clear_sky.hdr?url';
import { Vec3 } from '../src/math/vec3.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { RenderGraph } from '../src/renderer/render_graph.js';
import { ShadowPass } from '../src/renderer/passes/shadow_pass.js';
import { DeferredLightingPass } from '../src/renderer/passes/deferred_lighting_pass.js';
import { GeometryPass } from '../src/renderer/passes/geometry_pass.js';
import { SkyTexturePass } from '../src/renderer/passes/sky_texture_pass.js';
import { TonemapPass } from '../src/renderer/passes/tonemap_pass.js';
import { Scene } from '../src/engine/scene.js';
import { GameObject } from '../src/engine/game_object.js';
import { Camera } from '../src/engine/components/camera.js';
import { DirectionalLight } from '../src/engine/components/directional_light.js';
import { MeshRenderer } from '../src/engine/components/mesh_renderer.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { GBuffer } from '../src/renderer/gbuffer.js';
import { parseHdr, createHdrTexture } from '../src/assets/hdr_loader.js';
import { computeIblGpu } from '../src/assets/ibl.js';
import { Mesh } from '../src/assets/mesh.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';

// Create fallback textures

function createAOTexture(device: GPUDevice, width: number, height: number): GPUTextureView {
  const texture = device.createTexture({
    size: { width, height },
    format: 'r8unorm',
    usage: 0x04 | 0x02, // TEXTURE_BINDING | COPY_DST
  });
  const data = new Uint8Array(width * height).fill(255);
  device.queue.writeTexture(
    { texture },
    data,
    { bytesPerRow: width },
    { width, height }
  );
  return texture.createView();
}

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const fpsElement = document.getElementById('fps')!;

  // Set canvas size explicitly
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const device = ctx.device;

  // Load HDR sky texture and compute IBL
  const skyTexture = await createHdrTexture(device, parseHdr(await (await fetch(skyHdrUrl)).arrayBuffer()));
  const iblTextures = await computeIblGpu(device, skyTexture.gpuTexture);

  // Create scene
  const scene = new Scene();

  // Create camera - position to look at the ground plane and cubes
  const cameraGO = new GameObject('Camera');
  cameraGO.position.set(5, 8, 6); // Offset to the side and up
  const camera = cameraGO.addComponent(
    new Camera(60, 0.1, 100, ctx.width / ctx.height)
  );
  // Point camera toward origin (ground plane center)
  const cameraController = CameraController.create({ yaw: 0.2, pitch: 0.5, speed: 5, sensitivity: 0.002, pointerLock: false });
  cameraController.attach(ctx.canvas);
  // Initialize camera rotation to match controls
  cameraController.update(cameraGO, 0);
  scene.add(cameraGO);

  // Create directional light (sun)
  const sunGO = new GameObject('Sun');
  const sun = sunGO.addComponent(
    new DirectionalLight(new Vec3(0.3, -0.8, -0.5).normalize(), new Vec3(1.0, 0.95, 0.9), 1.0, 4)
  );
  scene.add(sunGO);

  // Create meshes
  const cubeMesh = Mesh.createCube(device, 1);
  const planeMesh = Mesh.createPlane(device, 100, 100, 1, 1);

  // Materials
  const groundMaterial = new PbrMaterial({
    albedo: [0.5, 0.7, 0.5, 1.0],
    roughness: 0.9,
    metallic: 0.0,
  });

  const cubeMaterial = new PbrMaterial({
    albedo: [1.0, 0.2, 0.2, 1.0],
    roughness: 0.5,
    metallic: 0.0,
  });

  // Create ground plane
  const groundGO = new GameObject('Ground');
  const groundRenderer = groundGO.addComponent(new MeshRenderer(planeMesh, groundMaterial));
  groundRenderer.castShadow = false;
  scene.add(groundGO);

  // Create cubes at various distances to show cascade transitions
  const cubePositions = [
    new Vec3(0, 0.5, 0),      // Near
    new Vec3(3, 0.5, -5),     // Near
    new Vec3(-5, 0.5, -8),    // Medium
    new Vec3(8, 0.5, -12),    // Medium
    new Vec3(-10, 0.5, -15),  // Far
    new Vec3(0, 0.5, -20),    // Far
    new Vec3(15, 0.5, -25),   // Very far
  ];

  for (let i = 0; i < cubePositions.length; i++) {
    const cubeGO = new GameObject(`Cube${i}`);
    const pos = cubePositions[i];
    cubeGO.position.set(pos.x, pos.y, pos.z);
    const cubeRenderer = cubeGO.addComponent(new MeshRenderer(cubeMesh, cubeMaterial));
    cubeRenderer.castShadow = true;
    scene.add(cubeGO);
  }

  // IBL textures loaded earlier from sky.hdr

  // Create GBuffer
  const gbuffer = GBuffer.create(ctx);

  // Create AO texture
  const aoView = createAOTexture(device, ctx.width, ctx.height);

  // Create render passes
  const shadowPass = ShadowPass.create(ctx, 4); // 4 cascades
  const geometryPass = GeometryPass.create(ctx, gbuffer);
  const lightingPass = DeferredLightingPass.create(ctx, {
    gbuffer,
    shadowPass,
    aoView,
    iblTextures
  });
  const tonemapPass = TonemapPass.create(ctx, lightingPass.outputView);

  // Create sky texture pass for HDR sky rendering
  const skyTexturePass = SkyTexturePass.create(ctx, lightingPass.outputView, skyTexture);

  // Create render graph
  const renderGraph = new RenderGraph();
  renderGraph.addPass(shadowPass);
  renderGraph.addPass(geometryPass);
  renderGraph.addPass(skyTexturePass);
  renderGraph.addPass(lightingPass);
  renderGraph.addPass(tonemapPass);

  // Frame state
  let lastTime = performance.now();
  let frameCount = 0;
  let fpsTime = 0;
  let debugCascades = false;
  let sunAngle = Math.PI * 0.3; // Start at ~30 degrees above horizon

  // Hotkey: 'c' to toggle cascade debug visualization
  window.addEventListener('keydown', (e) => {
    if (e.key === 'c' || e.key === 'C') {
      debugCascades = !debugCascades;
      console.log(`Cascade debug: ${debugCascades ? 'ON' : 'OFF'}`);
    }
  });

  async function render() {
    const now = performance.now();
    const dt = (now - lastTime) * 0.001;
    lastTime = now;

    ctx.update();

    // FPS counter
    frameCount++;
    fpsTime += dt;
    if (fpsTime >= 0.5) {
      const fps = Math.round(frameCount / fpsTime);
      fpsElement.textContent = `FPS: ${fps}`;
      frameCount = 0;
      fpsTime = 0;
    }

    // Animate sun
    sunAngle += dt * 0.05; // Faster than main demo for testing

    // Skew so day lasts ~⅔ of the cycle, night ~⅓.
    const _dayFraction = 0.65;
    const _norm = ((sunAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const _dayPortion = _dayFraction * 2 * Math.PI;
    const _skewed = _norm < _dayPortion
      ? (_norm / _dayPortion) * Math.PI
      : Math.PI + ((_norm - _dayPortion) / (2 * Math.PI - _dayPortion)) * Math.PI;

    const sinA = Math.sin(_skewed);
    const rawDirX = 0.3;
    const rawDirY = -sinA;
    const rawDirZ = Math.cos(_skewed) * 0.5;
    const dLen = Math.sqrt(rawDirX * rawDirX + rawDirY * rawDirY + rawDirZ * rawDirZ);
    sun.direction.set(rawDirX / dLen, rawDirY / dLen, rawDirZ / dLen);

    // Adjust intensity based on sun elevation
    const elev = sinA;
    sun.intensity = Math.max(0, elev) * 6.0;

    // Adjust color from warm (sunrise/sunset) to white (noon)
    const t = Math.max(0, elev);
    sun.color.set(1.0, 0.8 + 0.2 * t, 0.6 + 0.4 * t);

    // Update camera controls
    cameraController.update(cameraGO, dt);

    // Update scene
    scene.update(dt);

    // Update camera matrices
    const camPos = camera.position();
    const view = camera.viewMatrix();
    const proj = camera.projectionMatrix();
    const vp = camera.viewProjectionMatrix();
    const invVP = vp.invert();

    // Compute cascade matrices
    const cascades = sun.computeCascadeMatrices(camera, 100);

    // Collect mesh renderers
    const meshRenderers = scene.collectMeshRenderers();
    const drawItems = meshRenderers.map((mr) => {
      const w = mr.gameObject.localToWorld();
      return {
        mesh: mr.mesh,
        modelMatrix: w,
        normalMatrix: w.normalMatrix(),
        material: mr.material,
      };
    });
    const shadowItems = meshRenderers
      .filter((mr) => mr.castShadow)
      .map((mr) => ({
        mesh: mr.mesh,
        modelMatrix: mr.gameObject.localToWorld(),
      }));

    // Update passes
    shadowPass.setSceneSnapshot(shadowItems);
    shadowPass.updateScene(scene, camera, sun, 100);

    geometryPass.setDrawItems(drawItems);
    geometryPass.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);

    skyTexturePass.updateCamera(ctx, invVP, camPos, 0.2);

    lightingPass.updateCamera(ctx, view, proj, vp, invVP, camPos, camera.near, camera.far);
    lightingPass.updateLight(ctx, sun.direction, sun.color, sun.intensity, cascades, true, debugCascades);
    lightingPass.updateCloudShadow(ctx, 0, 0, 0);

    tonemapPass.updateParams(ctx, 1.0, true, false);

    // Execute render graph
    await renderGraph.execute(ctx);

    requestAnimationFrame(render);
  }

  render();
}

main();
