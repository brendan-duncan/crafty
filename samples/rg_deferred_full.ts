import skyHdrUrl from '../assets/cubemaps/hdr/clear_sky.hdr?url';
import { Mat4, Vec3 } from '../src/math/index.js';
import { Quaternion } from '../src/math/quaternion.js';
import { Mesh } from '../src/assets/mesh.js';
import { parseHdr, createHdrTexture } from '../src/assets/hdr_loader.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { GameObject } from '../src/engine/game_object.js';
import { Camera } from '../src/engine/components/camera.js';
import { PointLight as EnginePointLight } from '../src/engine/components/point_light.js';
import { SpotLight as EngineSpotLight } from '../src/engine/components/spot_light.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph } from '../src/renderer/render_graph/index.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { GeometryPass, type DrawItem } from '../src/renderer/render_graph/passes/geometry_pass.js';
import { DeferredLightingPass } from '../src/renderer/render_graph/passes/deferred_lighting_pass.js';
import { PointSpotShadowPass } from '../src/renderer/render_graph/passes/point_spot_shadow_pass.js';
import { PointSpotLightPass } from '../src/renderer/render_graph/passes/point_spot_light_pass.js';
import { ShadowPass, type ShadowMeshDraw } from '../src/renderer/render_graph/passes/shadow_pass.js';
import { SkyTexturePass } from '../src/renderer/render_graph/passes/sky_texture_pass.js';
import { SSAOPass } from '../src/renderer/render_graph/passes/ssao_pass.js';
import { ForwardPass, type ForwardDrawItem } from '../src/renderer/render_graph/passes/forward_pass.js';
import { TAAPass } from '../src/renderer/render_graph/passes/taa_pass.js';
import { DofPass } from '../src/renderer/render_graph/passes/dof_pass.js';
import { TonemapPass } from '../src/renderer/render_graph/passes/tonemap_pass.js';
import type { DirectionalLight } from '../src/renderer/directional_light.js';
import type { PointLight as ForwardPointLight } from '../src/renderer/point_light.js';
import { SpotLight as ForwardSpotLight } from '../src/renderer/spot_light.js';
import type { CascadeData } from '../src/engine/components/directional_light.js';
import { createRenderGraphViz } from '../src/renderer/render_graph/ui/render_graph_viz.js';
import type { PassNodeData, TextureNodeData, GraphEdge, FullGraphData } from '../src/renderer/render_graph/ui/render_graph_viz.js';

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

  // The opaque sphere/plane/metal go through GeometryPass → DeferredLightingPass.
  // The transparent glass cube is rendered by a hybrid ForwardPass on top of
  // the lit HDR, loading the gbuffer depth so it depth-tests against opaque.
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
  const pointSpotShadowPass = PointSpotShadowPass.create(ctx);
  const skyPass = SkyTexturePass.create(ctx, skyTexture);
  const geometryPass = GeometryPass.create(ctx);
  const ssaoPass = SSAOPass.create(ctx);
  const lightingPass = DeferredLightingPass.create(ctx);
  const pointSpotLightPass = PointSpotLightPass.create(ctx);
  const forwardPass = ForwardPass.create(ctx);
  const taaPass = TAAPass.create(ctx);
  const dofPass = DofPass.create(ctx);
  const tonemapPass = TonemapPass.create(ctx);
  tonemapPass.updateParams(ctx, 1.0, false, false);

  // Engine-component lights — PointSpotShadowPass and PointSpotLightPass take
  // these (they call worldPosition/worldDirection on them).
  const pointGO = new GameObject({ name: 'PointLight' });
  const enginePoint = pointGO.addComponent(new EnginePointLight());
  enginePoint.color.set(1.0, 0.3, 0.3);
  enginePoint.intensity = 10;
  enginePoint.radius = 8;
  enginePoint.castShadow = false;

  const spotGO = new GameObject({ name: 'SpotLight' });
  spotGO.position.set(0, 5, 0);
  // Default forward is -Z; rotate -90° about X so the light points down (-Y).
  spotGO.rotation = Quaternion.fromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
  const engineSpot = spotGO.addComponent(new EngineSpotLight());
  engineSpot.color.set(1.0, 1.0, 0.5);
  engineSpot.intensity = 15;
  engineSpot.range = 10;
  engineSpot.innerAngle = 20;
  engineSpot.outerAngle = 30;
  engineSpot.castShadow = false;

  const enginePointLights = [enginePoint];
  const engineSpotLights = [engineSpot];

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

  let lastGraphData: FullGraphData = { passes: [], textures: [], edges: [] };
  const graphViz = createRenderGraphViz(null);
  const graphHint = document.createElement('div');
  graphHint.textContent = 'G: toggle render-graph viz   |   F: toggle DOF';
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
    } else if (e.code === 'KeyF' && !e.repeat) {
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

    const drawItems: DrawItem[] = [
      { mesh: sphereMesh, modelMatrix: sphereModel, normalMatrix: sphereModel.normalMatrix(), material: sphereMat },
      { mesh: planeMesh, modelMatrix: planeModel, normalMatrix: planeModel.normalMatrix(), material: planeMat },
      { mesh: cubeMesh, modelMatrix: metalModel, normalMatrix: metalModel.normalMatrix(), material: metalMat },
    ];

    // Transparents are drawn by the hybrid ForwardPass after deferred lighting.
    const transparentItems: ForwardDrawItem[] = [
      { mesh: cubeMesh, modelMatrix: glassModel, normalMatrix: glassModel.normalMatrix(), material: glassMat },
    ];

    const shadowItems: ShadowMeshDraw[] = [
      { mesh: sphereMesh, modelMatrix: sphereModel },
      { mesh: planeMesh, modelMatrix: planeModel },
      { mesh: cubeMesh, modelMatrix: metalModel },
      { mesh: cubeMesh, modelMatrix: glassModel },
    ];

    const directionalLight: DirectionalLight = {
      direction: lightDir,
      intensity: 2.0,
      color: new Vec3(1.0, 0.95, 0.9),
      castShadows: true,
      cascades,
    };

    // Animate point light orbit, matching rg_forward_full.
    pointGO.position.set(Math.sin(ctx.elapsedTime) * 3, 2, Math.cos(ctx.elapsedTime) * 3);

    // Renderer-level mirrors of the engine lights, for the transparent forward
    // pass (ForwardPass.updateLights takes the renderer-level types).
    const fwdPointLights: ForwardPointLight[] = [{
      position: pointGO.position,
      range: enginePoint.radius,
      color: enginePoint.color,
      intensity: enginePoint.intensity,
      castShadows: enginePoint.castShadow,
    }];
    const fwdSpotLights: ForwardSpotLight[] = [new ForwardSpotLight({
      position: spotGO.position,
      range: engineSpot.range,
      direction: engineSpot.worldDirection(),
      innerAngle: engineSpot.innerAngle,
      color: engineSpot.color,
      outerAngle: engineSpot.outerAngle,
      intensity: engineSpot.intensity,
      castShadows: engineSpot.castShadow,
    })];

    geometryPass.setDrawItems(drawItems);
    geometryPass.updateCamera(ctx);

    ssaoPass.updateCamera(ctx);
    ssaoPass.updateParams(ctx, 1.0, 0.005, 2.0);

    lightingPass.updateCamera(ctx);
    lightingPass.updateLight(ctx, lightDir, { x: 1.0, y: 0.95, z: 0.9 }, 2.0, cascades, true, false);
    lightingPass.updateCloudShadow(ctx, 0, 0, 60);

    pointSpotShadowPass.update(enginePointLights, engineSpotLights, shadowItems);
    pointSpotLightPass.updateCamera(ctx);
    pointSpotLightPass.updateLights(ctx, enginePointLights, engineSpotLights);

    skyPass.updateCamera(ctx);
    dofPass.updateParams(ctx, 8.0, 4.0, 4.0, 0.1, 100.0, 1.0);

    // Forward pass for transparents — same camera as the deferred path (the
    // jittered VP from TAA is on the camera and forward will use it via
    // jitteredViewProjectionMatrix(), matching the gbuffer depth).
    forwardPass.setDrawItems(transparentItems);
    forwardPass.updateCamera(ctx);
    forwardPass.updateLights(ctx, directionalLight, fwdPointLights, fwdSpotLights);

    const graph = new RenderGraph(ctx, cache);
    const bb = graph.setBackbuffer('canvas');

    const shadow = shadowPass.addToGraph(graph, { cascades, drawItems: shadowItems });
    const pointSpotShadows = pointSpotShadowPass.addToGraph(graph);
    const gbuffer = geometryPass.addToGraph(graph);
    // Sky clears the HDR target; deferred lighting loads it and composites on top.
    const sky = skyPass.addToGraph(graph);
    const ssao = ssaoPass.addToGraph(graph, { normal: gbuffer.normal, depth: gbuffer.depth });

    const lit = lightingPass.addToGraph(graph, {
      gbuffer,
      shadowMap: shadow.shadowMap,
      ao: ssao.ao,
      hdr: sky.hdr,
    });

    // Point + spot lights additively blend on top of the directional lighting.
    const litFull = pointSpotLightPass.addToGraph(graph, {
      gbuffer,
      pointVsm: pointSpotShadows.pointVsm,
      spotVsm: pointSpotShadows.spotVsm,
      projTex: pointSpotShadows.projTex,
      hdr: lit.hdr,
    });

    // Hybrid deferred → forward pass for transparents. Loads the lit HDR and
    // the gbuffer depth (so glass depth-tests against opaque). Transparent
    // pipeline has depthWriteEnabled=false, so gbuffer.depth contents are
    // preserved for TAA reprojection below.
    const composited = forwardPass.addToGraph(graph, {
      output: litFull.hdr,
      depth: gbuffer.depth,
      loadOp: 'load',
      depthLoadOp: 'load',
      shadowMapSource: shadow.shadowMap,
    });

    // TAA always writes a transient HDR — tonemap below needs to sample it for
    // gamma (and ACES) and cannot read+write the canvas in the same pass.
    const taaOut = taaPass.addToGraph(graph, { hdr: composited.output, depth: gbuffer.depth });
    let finalHdr = taaOut.resolved;
    if (dofEnabled) {
      const dofOut = dofPass.addToGraph(graph, { hdr: taaOut.resolved, depth: gbuffer.depth });
      finalHdr = dofOut.result;
    }
    tonemapPass.addToGraph(graph, { hdr: finalHdr, backbuffer: bb });

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
