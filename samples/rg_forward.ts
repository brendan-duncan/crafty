import { Mat4, Vec3 } from '../src/math/index.js';
import { Mesh } from '../src/assets/mesh.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { GameObject } from '../src/engine/game_object.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph } from '../src/renderer/render_graph/index.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { GeometryPass, type DrawItem } from '../src/renderer/render_graph/passes/geometry_pass.js';
import { DeferredLightingPass } from '../src/renderer/render_graph/passes/deferred_lighting_pass.js';
import { TonemapPass } from '../src/renderer/render_graph/passes/tonemap_pass.js';
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
  cameraGO.position.set(0, 3, 6);
  const cameraController = CameraController.create({
    yaw: Math.PI, pitch: 0.1, speed: 3, sensitivity: 0.002, pointerLock: false,
  });
  cameraController.attach(canvas);

  const geometryPass = GeometryPass.create(ctx);
  const lightingPass = DeferredLightingPass.create(ctx);
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

  let smoothFps = 0;

  function frame(): void {
    ctx.update();
    if (ctx.deltaTime > 0) {
      smoothFps += (1 / ctx.deltaTime - smoothFps) * 0.1;
      statsEl.textContent = `${smoothFps.toFixed(0)} fps | Forward PBR`;
    }

    const sunAngle = ctx.elapsedTime * 0.3;
    cameraController.update(cameraGO, ctx.deltaTime);

    const aspect = ctx.width / ctx.height;
    const proj = Mat4.perspective(60 * Math.PI / 180, aspect, 0.1, 100);
    const view = Mat4.lookAt(cameraGO.position, new Vec3(0, 1, 0), new Vec3(0, 1, 0));
    const vp = proj.multiply(view);
    const invVP = vp.invert();
    const camPos = cameraGO.position;

    const lightDir = new Vec3(Math.cos(sunAngle), -0.8, Math.sin(sunAngle)).normalize();

    const drawItems: DrawItem[] = [
      { mesh: sphereMesh, modelMatrix: sphereModel, normalMatrix: sphereModel.normalMatrix(), material: sphereMat },
      { mesh: planeMesh, modelMatrix: planeModel, normalMatrix: planeModel.normalMatrix(), material: planeMat },
    ];

    geometryPass.setDrawItems(drawItems);
    geometryPass.updateCamera(ctx, view, proj, vp, invVP, camPos, 0.1, 100);

    lightingPass.updateCamera(ctx, view, proj, vp, invVP, camPos, 0.1, 100);
    lightingPass.updateLight(ctx, lightDir, { x: 1, y: 1, z: 1 }, 2.0, [], false, false);
    lightingPass.updateCloudShadow(ctx, 0, 0, 60);

    const graph = new RenderGraph(ctx, cache);
    const bb = graph.setBackbuffer('canvas');

    const gbuffer = geometryPass.addToGraph(graph);

    const aoW = Math.max(1, ctx.width >> 1);
    const aoH = Math.max(1, ctx.height >> 1);
    let aoHandle!: ReturnType<typeof graph.importPersistentTexture>;
    graph.addPass('DummyAO', 'render', (b) => {
      aoHandle = b.createTexture({ label: 'dummy.ao', format: 'r8unorm', width: aoW, height: aoH });
      aoHandle = b.write(aoHandle, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
      b.setExecute(() => {});
    });

    const dummyShadow = graph.importPersistentTexture('rg_forward:shadow', {
      label: 'DummyShadow', format: 'depth32float', width: 1, height: 1,
    });
    let dummyShadowOut!: ReturnType<typeof graph.importPersistentTexture>;
    graph.addPass('DummyShadow', 'render', (b) => {
      dummyShadowOut = b.write(dummyShadow, 'depth-attachment', { depthLoadOp: 'clear', depthStoreOp: 'store', depthClearValue: 1.0 });
      b.setExecute(() => {});
    });

    const lit = lightingPass.addToGraph(graph, {
      gbuffer,
      shadowMap: dummyShadowOut,
      ao: aoHandle,
    });

    tonemapPass.addToGraph(graph, { hdr: lit.hdr, backbuffer: bb });

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
