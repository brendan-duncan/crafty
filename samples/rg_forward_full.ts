import skyHdrUrl from '../assets/cubemaps/hdr/clear_sky.hdr?url';
import { Mat4, Vec3 } from '../src/math/index.js';
import { Mesh } from '../src/assets/mesh.js';
import { parseHdr, createHdrTexture } from '../src/assets/hdr_loader.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { GameObject } from '../src/engine/game_object.js';
import { Camera } from '../src/engine/components/camera.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph } from '../src/renderer/render_graph/index.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { ForwardPass, type ForwardDrawItem } from '../src/renderer/render_graph/passes/forward_pass.js';
import { ShadowPass, type ShadowMeshDraw } from '../src/renderer/render_graph/passes/shadow_pass.js';
import { SkyTexturePass } from '../src/renderer/render_graph/passes/sky_texture_pass.js';
import { TAAPass } from '../src/renderer/render_graph/passes/taa_pass.js';
import { DofPass } from '../src/renderer/render_graph/passes/dof_pass.js';
import { TonemapPass } from '../src/renderer/render_graph/passes/tonemap_pass.js';
import type { DirectionalLight } from '../src/renderer/directional_light.js';
import type { PointLight } from '../src/renderer/point_light.js';
import { SpotLight } from '../src/renderer/spot_light.js';
import type { CascadeData } from '../src/engine/components/directional_light.js';
import { createRenderGraphViz } from '../src/renderer/render_graph/ui/render_graph_viz.js';

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const statsEl = document.getElementById('stats') as HTMLDivElement;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const device = ctx.device;
  const cache = new PhysicalResourceCache(device);

  const skyTexture = await createHdrTexture(device, parseHdr(await (await fetch(skyHdrUrl)).arrayBuffer()));

  const sphereMesh = Mesh.createSphere(device, 1, 24, 24);
  const planeMesh = Mesh.createPlane(device, 30, 30);
  const cubeMesh = Mesh.createCube(device);

  const sphereMat = new PbrMaterial({ albedo: [0.9, 0.2, 0.1, 1], roughness: 0.3, metallic: 0 });
  const planeMat = new PbrMaterial({ albedo: [0.6, 0.6, 0.6, 1], roughness: 0.8, metallic: 0 });
  const metalMat = new PbrMaterial({ albedo: [0.8, 0.8, 0.8, 1], roughness: 0.4, metallic: 0.5 });
  const glassMat = new PbrMaterial({ albedo: [0.2, 0.6, 1.0, 0.5], roughness: 0.1, metallic: 0, transparent: true });
  sphereMat.getBindGroup(device); sphereMat.update(device.queue);
  planeMat.getBindGroup(device); planeMat.update(device.queue);
  metalMat.getBindGroup(device); metalMat.update(device.queue);
  glassMat.getBindGroup(device); glassMat.update(device.queue);

  const sphereModel = Mat4.translation(0, 1.5, 0);
  const planeModel = Mat4.identity();
  const metalModel = Mat4.translation(-3, 1, 0);
  const glassModel = Mat4.translation(3, 1, 0);

  const cameraGO = new GameObject({ name: 'Camera' });
  cameraGO.position.set(0, 3, -6);
  const camera = cameraGO.addComponent(Camera.createPerspective(60, 0.1, 100, ctx.width / ctx.height));

  const cameraController = CameraController.create({
    yaw: Math.PI, pitch: 0.1, speed: 3, sensitivity: 0.002, pointerLock: false,
  });
  cameraController.attach(canvas);

  const shadowPass = ShadowPass.create(ctx);
  const forwardPass = ForwardPass.create(ctx);
  const skyPass = SkyTexturePass.create(ctx, skyTexture);
  const taaPass = TAAPass.create(ctx);
  const dofPass = DofPass.create(ctx);
  const tonemapPass = TonemapPass.create(ctx);
  tonemapPass.updateParams(ctx, 1.0, false, false);

  let dofEnabled = false;

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    cache.trimUnused();
  });
  resizeObserver.observe(canvas);

  const graphViz = createRenderGraphViz(null).attach({ hint: 'G: toggle render-graph viz   |   F: toggle DOF' });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyF' && !e.repeat) {
      dofEnabled = !dofEnabled;
    }
  });


  function frame(): void {
    ctx.update();
    statsEl.textContent = `FPS: ${ctx.fps}`;

    const sunAngle = ctx.elapsedTime * 0.3;

    cameraController.update(cameraGO, ctx.deltaTime);
    camera.updateRender(ctx);
    ctx.activeCamera = camera;

    // TAA must run BEFORE geometry passes so they pick up the jittered VP via
    // camera.jitteredViewProjectionMatrix().
    taaPass.updateCamera(ctx);

    const lightDir = new Vec3(Math.cos(sunAngle), -0.8, Math.sin(sunAngle)).normalize();
    const center = new Vec3(0, 1, 0);
    const farPlane = 100;
    const splitFars = [5, 15, 40, farPlane];

    const shadowMapSize = 2048;
    const cascades: CascadeData[] = splitFars.map((splitFar, i) => {
      const nearSplit = i === 0 ? camera.near : splitFars[i - 1];
      // Get camera frustum corners for this cascade's slice of the view
      const savedNear = camera.near, savedFar = camera.far;
      camera.near = nearSplit;
      camera.far = splitFar;
      const corners = camera.frustumCornersWorld();
      camera.near = savedNear;
      camera.far = savedFar;

      const lv = Mat4.lookAt(center.sub(lightDir.scale(splitFar)), center, Vec3.UP);

      // Sphere-fit radius from frustum corners
      const centerWS = corners.reduce((a, b) => a.add(b), Vec3.ZERO).scale(1 / 8);
      let radius = 0;
      for (const c of corners) {
        radius = Math.max(radius, c.sub(centerWS).length());
      }
      let texelWorldSize = (2 * radius) / shadowMapSize;
      radius = Math.ceil(radius / texelWorldSize) * texelWorldSize;
      radius *= shadowMapSize / (shadowMapSize - 2);
      texelWorldSize = (2 * radius) / shadowMapSize;

      // Z range in light-space from frustum corners, with padding
      let minZ = Infinity, maxZ = -Infinity;
      for (const c of corners) {
        const lc = lv.transformPoint(c);
        minZ = Math.min(minZ, lc.z);
        maxZ = Math.max(maxZ, lc.z);
      }
      const zPadding = Math.min((maxZ - minZ) * 0.25, 64);
      minZ -= zPadding;
      maxZ += zPadding;

      const lp = Mat4.orthographic(-radius, radius, -radius, radius, -maxZ, -minZ);

      return {
        lightViewProj: lp.multiply(lv),
        splitFar,
        depthRange: maxZ - minZ,
        texelWorldSize,
      };
    });

    const directionalLight: DirectionalLight = {
      direction: lightDir,
      intensity: 2.0,
      color: new Vec3(1.0, 0.95, 0.9),
      castShadows: true,
      cascades,
    };

    const pointLights: PointLight[] = [
      {
        position: new Vec3(Math.sin(ctx.elapsedTime) * 3, 2, Math.cos(ctx.elapsedTime) * 3),
        range: 8,
        color: new Vec3(1.0, 0.3, 0.3),
        intensity: 10,
        castShadows: false,
      },
    ];

    const spotLights: SpotLight[] = [
      new SpotLight({
        position: new Vec3(0, 5, 0),
        range: 10,
        direction: new Vec3(0, -1, 0),
        innerAngle: 20,
        color: new Vec3(1.0, 1.0, 0.5),
        outerAngle: 30,
        intensity: 15,
        castShadows: false,
      }),
    ];

    const drawItems: ForwardDrawItem[] = [
      { mesh: sphereMesh, modelMatrix: sphereModel, normalMatrix: sphereModel.normalMatrix(), material: sphereMat },
      { mesh: planeMesh, modelMatrix: planeModel, normalMatrix: planeModel.normalMatrix(), material: planeMat },
      { mesh: cubeMesh, modelMatrix: metalModel, normalMatrix: metalModel.normalMatrix(), material: metalMat },
      { mesh: cubeMesh, modelMatrix: glassModel, normalMatrix: glassModel.normalMatrix(), material: glassMat },
    ];

    const shadowItems: ShadowMeshDraw[] = [
      { mesh: sphereMesh, modelMatrix: sphereModel },
      { mesh: planeMesh, modelMatrix: planeModel },
      { mesh: cubeMesh, modelMatrix: metalModel },
      { mesh: cubeMesh, modelMatrix: glassModel },
    ];

    forwardPass.setDrawItems(drawItems);
    forwardPass.updateCamera(ctx);
    forwardPass.updateLights(ctx, directionalLight, pointLights, spotLights);
    skyPass.updateCamera(ctx);
    dofPass.updateParams(ctx, 8.0, 4.0, 4.0, 0.1, 100.0, 1.0);

    const graph = new RenderGraph(ctx, cache);
    const bb = graph.setBackbuffer('canvas');

    const shadow = shadowPass.addToGraph(graph, { cascades, drawItems: shadowItems });
    // Sky clears the HDR target; forward loads it and draws the scene on top.
    const sky = skyPass.addToGraph(graph);
    const lit = forwardPass.addToGraph(graph, {
      output: sky.hdr,
      loadOp: 'load',
      shadowMapSource: shadow.shadowMap,
    });
    // TAA always writes a transient HDR — tonemap below needs to sample it for
    // gamma (and ACES) and cannot read+write the canvas in the same pass.
    const taaOut = taaPass.addToGraph(graph, { hdr: lit.output, depth: lit.depth });
    let finalHdr = taaOut.resolved;
    if (dofEnabled) {
      const dofOut = dofPass.addToGraph(graph, { hdr: taaOut.resolved, depth: lit.depth });
      finalHdr = dofOut.result;
    }
    tonemapPass.addToGraph(graph, { hdr: finalHdr, backbuffer: bb });

    const compiled = graph.compile();
    graphViz.setGraph(graph, compiled);
    void graph.execute(compiled);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main().catch(err => {
  document.body.innerHTML = `<pre style="color:red;padding:1rem">${err.message ?? err}</pre>`;
  console.error(err);
});
