import { Mat4, Vec3 } from '../src/math/index.js';
import { Mesh } from '../src/assets/mesh.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { GameObject } from '../src/engine/game_object.js';
import { Camera } from '../src/engine/components/camera.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph } from '../src/renderer/render_graph/index.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { ForwardPass, type ForwardDrawItem } from '../src/renderer/render_graph/passes/forward_pass.js';
import { ShadowPass, type ShadowMeshDraw } from '../src/renderer/render_graph/passes/shadow_pass.js';
import { TonemapPass } from '../src/renderer/render_graph/passes/tonemap_pass.js';
import type { DirectionalLight } from '../src/renderer/directional_light.js';
import type { CascadeData } from '../src/engine/components/directional_light.js';
import { createRenderGraphViz } from '../src/renderer/render_graph/ui/render_graph_viz.js';
import type { PassNodeData, TextureNodeData, GraphEdge, FullGraphData } from '../src/renderer/render_graph/ui/render_graph_viz.js';

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const statsEl = document.getElementById('stats') as HTMLDivElement;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const device = ctx.device;
  const cache = new PhysicalResourceCache(device);

  const sphereMesh = Mesh.createSphere(device, 1, 24, 24);
  const planeMesh = Mesh.createPlane(device, 30, 30);

  const sphereMat = new PbrMaterial({ albedo: [0.9, 0.2, 0.1, 1], roughness: 0.3, metallic: 0 });
  const planeMat = new PbrMaterial({ albedo: [0.6, 0.6, 0.6, 1], roughness: 0.8, metallic: 0 });
  sphereMat.getBindGroup(device);
  sphereMat.update(device.queue);
  planeMat.getBindGroup(device);
  planeMat.update(device.queue);

  const sphereModel = Mat4.translation(0, 1, 0);
  const planeModel = Mat4.identity();

  const cameraGO = new GameObject({ name: 'Camera' });
  cameraGO.position.set(0, 3, -6);
  const camera = cameraGO.addComponent(Camera.createPerspective(60, 0.1, 100, ctx.width / ctx.height));

  const cameraController = CameraController.create({
    yaw: Math.PI, pitch: 0.1, speed: 3, sensitivity: 0.002, pointerLock: false,
  });
  cameraController.attach(canvas);

  const shadowPass = ShadowPass.create(ctx);
  const forwardPass = ForwardPass.create(ctx);
  const tonemapPass = TonemapPass.create(ctx);
  tonemapPass.updateParams(ctx, 1.0, false, false);

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    cache.trimUnused();
  });
  resizeObserver.observe(canvas);

  let lastGraphData: FullGraphData = { passes: [], textures: [], edges: [] };
  const graphViz = createRenderGraphViz(null);
  const graphHint = document.createElement('div');
  graphHint.textContent = 'G: toggle render-graph viz';
  graphHint.style.cssText = [
    'position:fixed', 'bottom:40px', 'left:50%', 'transform:translateX(-50%)',
    'padding:4px 10px', 'border-radius:4px', 'background:rgba(0,0,0,0.45)', 'color:#888',
    'font-family:ui-monospace,monospace', 'font-size:11px', 'pointer-events:none',
  ].join(';');
  document.body.appendChild(graphHint);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyG' && !e.repeat) {
      if (graphViz.isOpen()) {
        graphViz.close();
      } else if (lastGraphData.passes.length > 0) {
        graphViz.setFullGraph(lastGraphData);
        graphViz.open();
      }
    }
  });

  function frame(): void {
    ctx.update();
    statsEl.textContent = `FPS: ${ctx.fps}`;

    const sunAngle = ctx.elapsedTime * 0.3;

    camera.aspect = ctx.width / ctx.height;
    cameraController.update(cameraGO, ctx.deltaTime);

    const view = camera.viewMatrix();
    const proj = camera.projectionMatrix();
    const viewProj = camera.viewProjectionMatrix();
    const invViewProj = viewProj.invert();
    const camPos = camera.position();

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

    const drawItems: ForwardDrawItem[] = [
      { mesh: sphereMesh, modelMatrix: sphereModel, normalMatrix: sphereModel.normalMatrix(), material: sphereMat },
      { mesh: planeMesh, modelMatrix: planeModel, normalMatrix: planeModel.normalMatrix(), material: planeMat },
    ];

    const shadowItems: ShadowMeshDraw[] = [
      { mesh: sphereMesh, modelMatrix: sphereModel },
      { mesh: planeMesh, modelMatrix: planeModel },
    ];

    forwardPass.setDrawItems(drawItems);
    forwardPass.updateCamera(ctx, view, proj, viewProj, invViewProj, camPos, 0.1, 100);
    forwardPass.updateLights(ctx, directionalLight, [], []);

    const graph = new RenderGraph(ctx, cache);
    const bb = graph.setBackbuffer('canvas');

    const shadow = shadowPass.addToGraph(graph, { cascades, drawItems: shadowItems });
    const { output } = forwardPass.addToGraph(graph, { shadowMapSource: shadow.shadowMap });

    tonemapPass.addToGraph(graph, { hdr: output, backbuffer: bb });

    const compiled = graph.compile();
    const compiledNames = new Set(compiled.passes.map(cp => cp.node.name));
    const passes: PassNodeData[] = graph.passList.map((p, i) => ({
      id: i, name: p.name, enabled: compiledNames.has(p.name), type: p.type,
    }));
    const texMap = new Map<number, TextureNodeData>();
    const edges: GraphEdge[] = [];
    graph.passList.forEach((p, i) => {
      for (const r of p.reads) {
        edges.push({ fromType: 'texture', fromId: r.id, toType: 'pass', toId: i });
        if (!texMap.has(r.id)) {
          const info = graph.getResourceInfo(r.id);
          texMap.set(r.id, {
            id: r.id,
            label: info?.label ?? `id:${r.id}`,
            isBackbuffer: info?.isBackbuffer ?? false,
            format: info?.format,
            kind: info?.kind,
            width: info?.kind === 'texture' ? info?.width : undefined,
            height: info?.kind === 'texture' ? info?.height : undefined,
            size: info?.kind === 'buffer' ? info?.size : undefined,
          });
        }
      }
      for (const w of p.writes) {
        edges.push({ fromType: 'pass', fromId: i, toType: 'texture', toId: w.id });
        if (!texMap.has(w.id)) {
          const info = graph.getResourceInfo(w.id);
          texMap.set(w.id, {
            id: w.id,
            label: info?.label ?? `id:${w.id}`,
            isBackbuffer: info?.isBackbuffer ?? false,
            format: info?.format,
            kind: info?.kind,
            width: info?.kind === 'texture' ? info?.width : undefined,
            height: info?.kind === 'texture' ? info?.height : undefined,
            size: info?.kind === 'buffer' ? info?.size : undefined,
          });
        }
      }
    });
    lastGraphData = { passes, textures: [...texMap.values()], edges };
    void graph.execute(compiled);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main().catch(err => {
  document.body.innerHTML = `<pre style="color:red;padding:1rem">${err.message ?? err}</pre>`;
  console.error(err);
});
