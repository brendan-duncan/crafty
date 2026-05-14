/**
 * Vertical-slice sample for the new render graph. Builds a tiny scene of
 * spinning cubes and renders them through:
 *   SliceGeometryPass (gbuffer write)
 *   → SliceLightingPass (deferred fullscreen lighting)
 *   → SliceTonemapPass  (HDR → backbuffer)
 *
 * Demonstrates the new RenderGraph + Pass + factory pattern end-to-end with
 * real shaders, real bind groups, real cross-pass virtual texture flow, and
 * the descriptor-keyed physical resource pool.
 */

import { Mat4 } from '../src/math/mat4.js';
import { Vec3 } from '../src/math/vec3.js';
import { Mesh } from '../src/assets/mesh.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph } from '../src/renderer/render_graph/index.js';
import { DeferredSliceFactory, type SliceFrameData } from './render_graph_slice/deferred_slice_factory.js';
import type { SliceDrawItem } from './render_graph_slice/slice_geometry_pass.js';

interface CubeInstance {
  position: { x: number; y: number; z: number };
  spinAxis: { x: number; y: number; z: number };
  spinPhase: number;
  color: { r: number; g: number; b: number };
}

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true, depthFormat: null });

  const cache = new PhysicalResourceCache(ctx.device);
  const factory = DeferredSliceFactory.create(ctx);

  const palette = [
    { r: 0.85, g: 0.30, b: 0.30 },
    { r: 0.30, g: 0.80, b: 0.40 },
    { r: 0.25, g: 0.50, b: 0.95 },
    { r: 0.95, g: 0.85, b: 0.30 },
    { r: 0.85, g: 0.40, b: 0.85 },
    { r: 0.30, g: 0.85, b: 0.85 },
  ];

  // One shared cube mesh; per-instance color is supplied via the model uniform.
  const cubeMesh = Mesh.createCube(ctx.device, 1);

  const instances: CubeInstance[] = [];
  for (let i = 0; i < palette.length; i++) {
    const angle = (i / palette.length) * Math.PI * 2;
    instances.push({
      position: { x: Math.cos(angle) * 2.4, y: Math.sin(angle * 2) * 0.6, z: Math.sin(angle) * 2.4 },
      spinAxis: { x: Math.sin(angle * 1.7), y: 1, z: Math.cos(angle * 1.3) },
      spinPhase: i * 0.7,
      color: palette[i],
    });
  }

  const start = performance.now();
  let loggedCull = false;

  function frameLoop(): void {
    ctx.update();
    const t = (performance.now() - start) / 1000;

    // Camera: orbit around origin.
    const eye = new Vec3(Math.cos(t * 0.3) * 6, 3, Math.sin(t * 0.3) * 6);
    const view = Mat4.lookAt(eye, new Vec3(0, 0, 0), new Vec3(0, 1, 0));
    const aspect = ctx.width / Math.max(1, ctx.height);
    const proj = Mat4.perspective(Math.PI / 4, aspect, 0.1, 100);
    const viewProj = proj.multiply(view);

    // Build per-frame draw items.
    const drawItems: SliceDrawItem[] = instances.map((inst) => {
      const axisLen = Math.hypot(inst.spinAxis.x, inst.spinAxis.y, inst.spinAxis.z) || 1;
      const ax = inst.spinAxis.x / axisLen;
      const ay = inst.spinAxis.y / axisLen;
      const az = inst.spinAxis.z / axisLen;
      const a = (t * 0.6 + inst.spinPhase) * 0.5;
      const s = Math.sin(a), c = Math.cos(a);
      const qx = ax * s, qy = ay * s, qz = az * s, qw = c;
      const trs = Mat4.trs(
        new Vec3(inst.position.x, inst.position.y, inst.position.z),
        qx, qy, qz, qw,
        new Vec3(0.8, 0.8, 0.8),
      );
      return {
        mesh: cubeMesh,
        modelMatrix: trs.data,
        color: inst.color,
      };
    });

    // Slowly rotate the light around Y.
    const lAngle = t * 0.4;
    const frame: SliceFrameData = {
      viewProj: viewProj.data,
      drawItems,
      lightDir:  { x: Math.cos(lAngle), y: -0.7, z: Math.sin(lAngle) },
      lightColor: { r: 1.0, g: 0.95, b: 0.85 },
      lightIntensity: 1.2,
      ambient: { r: 0.05, g: 0.06, b: 0.08 },
      exposure: 1.0,
      useAces: true,
    };

    const graph = new RenderGraph(ctx, cache);
    factory.build(graph, frame);
    const compiled = graph.compile();
    if (!loggedCull) {
      const surviving = compiled.passes.map((p) => p.node.name).join(' → ');
      console.log(`[render-graph slice] passes after compile: ${surviving}`);
      loggedCull = true;
    }
    void graph.execute(compiled);

    requestAnimationFrame(frameLoop);
  }

  requestAnimationFrame(frameLoop);
}

main().catch((err) => {
  console.error('[render-graph slice] fatal', err);
});
