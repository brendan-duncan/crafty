import { Mat4, Vec3 } from '../src/math/index.js';
import { Mesh } from '../src/assets/mesh.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { GameObject } from '../src/engine/game_object.js';
import { Camera } from '../src/engine/components/camera.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph } from '../src/renderer/render_graph/index.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { ForwardPass, type ForwardDrawItem } from '../src/renderer/render_graph/passes/forward_pass.js';
import { TonemapPass } from '../src/renderer/render_graph/passes/tonemap_pass.js';
import type { DirectionalLight } from '../src/renderer/directional_light.js';
import { SpotLight } from '../src/renderer/spot_light.js';
import type { PointLight } from '../src/renderer/point_light.js';
import { createRenderGraphViz } from '../src/renderer/render_graph/ui/render_graph_viz.js';

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const statsEl = document.getElementById('stats') as HTMLDivElement;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const device = ctx.device;
  const cache = new PhysicalResourceCache(device);

  const sphereMesh = Mesh.createSphere(device, 1, 24, 24);
  const planeMesh = Mesh.createPlane(device, 30, 30);
  const cubeMesh = Mesh.createCube(device);

  const sphereMat = new PbrMaterial({ albedo: [0.9, 0.2, 0.1, 1], roughness: 0.3, metallic: 0 });
  const planeMat = new PbrMaterial({ albedo: [0.6, 0.6, 0.6, 1], roughness: 0.8, metallic: 0 });
  const metalMat = new PbrMaterial({ albedo: [0.8, 0.8, 0.8, 1], roughness: 0.4, metallic: 0.5 });
  const glassMat = new PbrMaterial({ albedo: [0.2, 0.6, 1.0, 0.5], roughness: 0.1, metallic: 0, transparent: true });
  sphereMat.getBindGroup(device);
  sphereMat.update(device.queue);
  planeMat.getBindGroup(device);
  planeMat.update(device.queue);
  metalMat.getBindGroup(device);
  metalMat.update(device.queue);
  glassMat.getBindGroup(device);
  glassMat.update(device.queue);

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

  const forwardPass = ForwardPass.create(ctx);
  const tonemapPass = TonemapPass.create(ctx);
  tonemapPass.updateParams(ctx, 1.0, false, false);

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) {
      return;
    }
    canvas.width = w;
    canvas.height = h;
    cache.trimUnused();
  });
  resizeObserver.observe(canvas);

  const graphViz = createRenderGraphViz(null).attach();

  function frame(): void {
    ctx.update();
    statsEl.textContent = `FPS: ${ctx.fps}`;

    const sunAngle = ctx.elapsedTime * 0.3;

    cameraController.update(cameraGO, ctx.deltaTime);
    camera.updateRender(ctx);
    ctx.activeCamera = camera;

    const lightDir = new Vec3(Math.cos(sunAngle), -0.8, Math.sin(sunAngle)).normalize();

    const sceneCenter = new Vec3(0, 1, 0);
    const shadowDistance = 20;
    const shadowCamPos = sceneCenter.sub(lightDir.scale(shadowDistance));
    const lightView = Mat4.lookAt(shadowCamPos, sceneCenter, new Vec3(0, 1, 0));
    const lightProj = Mat4.orthographic(-10, 10, -10, 10, 1, 40);
    const lightViewProj = lightProj.multiply(lightView);

    const directionalLight: DirectionalLight = {
      direction: lightDir,
      intensity: 1.0,
      color: new Vec3(1.0, 0.95, 0.9),
      castShadows: false,
      lightViewProj,
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

    forwardPass.setDrawItems(drawItems);
    forwardPass.updateCamera(ctx);
    forwardPass.updateLights(ctx, directionalLight, pointLights, spotLights);

    const graph = new RenderGraph(ctx, cache);
    const bb = graph.setBackbuffer('canvas');

    // ForwardPass renders to a transient HDR target, then TonemapPass applies
    // exposure + gamma (and optional ACES) and blits to the swapchain.
    // `output: 'auto'` would route forward directly at the canvas, but tonemap
    // needs to sample the forward output and cannot read+write the canvas in
    // the same pass, so we keep an HDR intermediate.
    const lit = forwardPass.addToGraph(graph);
    tonemapPass.addToGraph(graph, { hdr: lit.output, backbuffer: bb });

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
