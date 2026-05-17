/**
 * SSAO test sample.
 *
 * A single 16×16×16 voxel chunk is populated with a random mix of solid blocks
 * and air. The density is tuned to leave plenty of crevices and stair-step
 * surfaces so SSAO has rich geometry to bite into.
 *
 * The render display defaults to CompositePass's debug-AO mode (the AO factor
 * written to the backbuffer as greyscale), with a toggle to switch to the
 * fully-lit scene for comparison. The "Algorithm" dropdown selects which AO
 * method runs each frame:
 *
 *   - SSAO:  classic Crytek-style hemisphere SSAO ({@link SSAOPass})
 *   - GTAO:  Ground Truth AO with projected-normal slice integration
 *            ({@link GTAOPass})
 *   - HBAO+: NVIDIA horizon-based AO with per-pixel jitter
 *            ({@link HBAOPlusPass})
 *   - Off:   no AO is sampled — AO factor is forced to 1 (white)
 *
 * The "Blur" dropdown picks between bilateral Gaussian (quality) and 4×4 box
 * (performance) for whichever algorithm is selected. The radius / bias /
 * strength sliders feed the active pass's `updateParams()` so the tuning knobs
 * can be inspected interactively without a code change. Note that `bias`
 * means slightly different things per algorithm:
 *
 *   - SSAO:  depth bias (units of NDC depth, ~0.005)
 *   - GTAO:  thickness factor (~0.1; samples beyond `radius*(1+bias*10)` are
 *            ignored as background)
 *   - HBAO+: tangent-plane angle bias in radians (~0.1)
 */

import colorAtlasUrl from '../assets/cube_textures/simple_block_atlas.png?url';
import normalAtlasUrl from '../assets/cube_textures/simple_block_atlas_normal.png?url';
import merAtlasUrl from '../assets/cube_textures/simple_block_atlas_mer.png?url';
import heightAtlasUrl from '../assets/cube_textures/simple_block_atlas_heightmap.png?url';

import { Mat4, Vec3, Random } from '../src/math/index.js';
import { Quaternion } from '../src/math/quaternion.js';
import { BlockTexture } from '../src/assets/block_texture.js';
import { Chunk } from '../src/block/chunk.js';
import { BlockType } from '../src/block/block_type.js';
import { GameObject } from '../src/engine/game_object.js';
import { Camera } from '../src/engine/components/camera.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph, type ResourceHandle } from '../src/renderer/render_graph/index.js';
import { BlockGeometryPass } from '../src/renderer/render_graph/passes/block_geometry_pass.js';
import { ShadowPass } from '../src/renderer/render_graph/passes/shadow_pass.js';
import { SSAOPass } from '../src/renderer/render_graph/passes/ssao_pass.js';
import { GTAOPass, type AOBlurQuality } from '../src/renderer/render_graph/passes/gtao_pass.js';
import { HBAOPlusPass } from '../src/renderer/render_graph/passes/hbao_plus_pass.js';
import { DeferredLightingPass } from '../src/renderer/render_graph/passes/deferred_lighting_pass.js';
import { AutoExposurePass } from '../src/renderer/render_graph/passes/auto_exposure_pass.js';
import { CompositePass } from '../src/renderer/render_graph/passes/composite_pass.js';
import type { CascadeData } from '../src/engine/components/directional_light.js';
import { createRenderGraphViz } from '../src/renderer/render_graph/ui/render_graph_viz.js';

type Algorithm = 'ssao' | 'gtao' | 'hbao+' | 'off';

interface SsaoState {
  algorithm: Algorithm;
  blur: AOBlurQuality;
  radius: number;
  bias: number;
  strength: number;
  viewDebugAO: boolean;
}

// Per-algorithm bias defaults. Bias means different things across methods
// (depth offset vs thickness factor vs angle in radians), so resetting on
// algorithm switch keeps the visual usable.
const BIAS_DEFAULTS: Record<Algorithm, number> = {
  ssao: 0.005,
  gtao: 0.1,
  'hbao+': 0.1,
  off: 0.005,
};

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const statsEl = document.getElementById('stats') as HTMLDivElement;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const device = ctx.device;
  const cache = new PhysicalResourceCache(device);

  const blockTex = await BlockTexture.load(device, colorAtlasUrl, normalAtlasUrl, merAtlasUrl, heightAtlasUrl);

  // 16×16×16 of random blocks with ~40% solid density. The mix produces the
  // cube-step crevices that exercise AO well: every internal corner is a hit
  // candidate.
  const chunk = buildRandomChunk(/* seed */ 0xC0FFEE, /* solidProbability */ 0.4);

  // ── Persistent passes. All three AO algorithms live in memory; only one
  //    is wired into the graph each frame based on `state.algorithm`. ──
  const blockGeometryPass = BlockGeometryPass.create(ctx, blockTex);
  const shadowPass = ShadowPass.create(ctx);
  const ssaoPass = SSAOPass.create(ctx, 'quality');
  const gtaoPass = GTAOPass.create(ctx, 'quality');
  const hbaoPass = HBAOPlusPass.create(ctx, 'quality');
  const lightingPass = DeferredLightingPass.create(ctx);
  const autoExposurePass = AutoExposurePass.create(ctx);
  autoExposurePass.setFixedExposure(1.0);
  const compositePass = CompositePass.create(ctx);
  compositePass.depthFogEnabled = false;

  blockGeometryPass.addChunk(chunk, chunk.generateVertices());

  const chunkCentre = new Vec3(
    Chunk.CHUNK_WIDTH * 0.5,
    Chunk.CHUNK_HEIGHT * 0.5,
    Chunk.CHUNK_DEPTH * 0.5,
  );
  const cameraGO = new GameObject({ name: 'Camera' });
  const camera = cameraGO.addComponent(Camera.createPerspective(60, 0.1, 200, ctx.width / ctx.height));
  const orbit = createOrbitController(canvas, chunkCentre, /* radius */ 28, /* yaw */ Math.PI / 4, /* pitch */ 0.55);

  const sunDir = new Vec3(0.3, -0.9, 0.4).normalize();

  const state: SsaoState = {
    algorithm: 'ssao',
    blur: 'quality',
    radius: 1.0,
    bias: BIAS_DEFAULTS.ssao,
    strength: 2.0,
    viewDebugAO: true,
  };
  wireControls(state);

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    cache.trimUnused();
  });
  resizeObserver.observe(canvas);

  const graphViz = createRenderGraphViz(null).attach({ hint: 'G: toggle render-graph viz' });

  function frame(): void {
    ctx.update();
    statsEl.textContent =
      `FPS ${ctx.fps.toFixed(0)}\n` +
      `algo ${state.algorithm}\n` +
      `blur ${state.blur}\n` +
      `view ${state.viewDebugAO ? 'debug-AO' : 'lit'}`;

    orbit.applyTo(cameraGO);
    camera.updateRender(ctx);
    ctx.activeCamera = camera;

    blockGeometryPass.updateCamera(ctx);

    // Update the active AO pass's per-frame state. The other two are idle
    // (their `addToGraph` isn't called this frame so the graph culls them).
    // When algorithm = 'off' we still run SSAO with strength=0 so a valid AO
    // target exists for the lighting/composite passes to bind.
    const blur = state.blur;
    switch (state.algorithm) {
      case 'ssao':
        ssaoPass.setBlurQuality(blur);
        ssaoPass.updateCamera(ctx);
        ssaoPass.updateParams(ctx, state.radius, state.bias, state.strength);
        break;
      case 'gtao':
        gtaoPass.setBlurQuality(blur);
        gtaoPass.updateCamera(ctx);
        gtaoPass.updateParams(ctx, state.radius, state.bias, state.strength);
        break;
      case 'hbao+':
        hbaoPass.setBlurQuality(blur);
        hbaoPass.updateCamera(ctx);
        hbaoPass.updateParams(ctx, state.radius, state.bias, state.strength);
        break;
      case 'off':
        ssaoPass.setBlurQuality(blur);
        ssaoPass.updateCamera(ctx);
        ssaoPass.updateParams(ctx, state.radius, state.bias, /* strength */ 0);
        break;
    }

    const cascades = buildSingleCascade(chunkCentre, sunDir);
    lightingPass.updateCamera(ctx);
    lightingPass.updateLight(ctx, sunDir, { x: 1.0, y: 0.95, z: 0.85 }, 3.0, cascades, /* shadows */ false);

    autoExposurePass.update(ctx);
    compositePass.updateParams(
      ctx,
      /* isUnderwater */ false,
      /* uwTime */ 0,
      /* aces */ true,
      /* debugAO */ state.viewDebugAO,
      /* hdrCanvas */ ctx.hdr,
    );

    const graph = new RenderGraph(ctx, cache);
    const backbuffer = graph.setBackbuffer('canvas');

    const shadow = shadowPass.addToGraph(graph, { cascades, drawItems: [] });
    const gbuffer = blockGeometryPass.addToGraph(graph, { loadOp: 'clear' });

    let ao: ResourceHandle;
    switch (state.algorithm) {
      case 'gtao':
        ao = gtaoPass.addToGraph(graph, { normal: gbuffer.normal, depth: gbuffer.depth }).ao;
        break;
      case 'hbao+':
        ao = hbaoPass.addToGraph(graph, { normal: gbuffer.normal, depth: gbuffer.depth }).ao;
        break;
      default:
        ao = ssaoPass.addToGraph(graph, { normal: gbuffer.normal, depth: gbuffer.depth }).ao;
        break;
    }

    const lit = lightingPass.addToGraph(graph, {
      gbuffer,
      shadowMap: shadow.shadowMap,
      ao,
    });

    const exposure = autoExposurePass.addToGraph(graph, { hdr: lit.hdr });

    compositePass.addToGraph(graph, {
      input: lit.hdr,
      ao,
      depth: gbuffer.depth,
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

  requestAnimationFrame(frame);
}

/**
 * Build a chunk filled with random blocks. Solid cells are picked from a
 * small palette of opaque non-prop block types to keep the chunk meshable
 * (no water, glass, leaves, etc.) and to give SSAO uniform-roughness surfaces
 * that won't bias the AO readout with specular/emissive tricks.
 */
function buildRandomChunk(seed: number, solidProbability: number): Chunk {
  const chunk = new Chunk(0, 0, 0);
  const rng = new Random(seed);
  const palette: BlockType[] = [
    BlockType.STONE,
    BlockType.DIRT,
    BlockType.SAND,
    BlockType.SPRUCE_PLANKS,
    BlockType.OBSIDIAN,
  ];

  for (let z = 0; z < Chunk.CHUNK_DEPTH; z++) {
    for (let y = 0; y < Chunk.CHUNK_HEIGHT; y++) {
      for (let x = 0; x < Chunk.CHUNK_WIDTH; x++) {
        const solid = rng.randomFloat() < solidProbability;
        if (!solid) continue;
        const block = palette[rng.randomUint32() % palette.length];
        chunk.setBlock(x, y, z, block);
      }
    }
  }
  return chunk;
}

/**
 * Build a single CascadeData covering the chunk volume. Shadows are disabled
 * via `lightingPass.updateLight(..., shadowsEnabled = false)`, but the lighting
 * pass still wants at least one cascade entry so its shader can index splits
 * safely. The values don't affect the debug-AO view.
 */
function buildSingleCascade(centre: Vec3, dir: Vec3): CascadeData[] {
  const dist = 40;
  const eye = new Vec3(centre.x - dir.x * dist, centre.y - dir.y * dist, centre.z - dir.z * dist);
  const lightView = Mat4.lookAt(eye, centre, new Vec3(0, 1, 0));
  const lightProj = Mat4.orthographic(-16, 16, -16, 16, 1, dist * 2);
  return [{
    lightViewProj: lightProj.multiply(lightView),
    splitFar: 200,
    depthRange: dist * 2 - 1,
    texelWorldSize: 32 / 1024,
  }];
}

interface OrbitController {
  applyTo(go: GameObject): void;
}

/**
 * Minimal orbit camera: drag with the mouse to rotate around `target`, scroll
 * to zoom. Keeps the camera looking at `target` by writing the GameObject's
 * world matrix directly.
 */
function createOrbitController(
  canvas: HTMLCanvasElement,
  target: Vec3,
  initialRadius: number,
  initialYaw: number,
  initialPitch: number,
): OrbitController {
  let radius = initialRadius;
  let yaw = initialYaw;
  let pitch = initialPitch;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener('mousedown', (ev) => {
    dragging = true;
    lastX = ev.clientX;
    lastY = ev.clientY;
  });
  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('mousemove', (ev) => {
    if (!dragging) return;
    const dx = ev.clientX - lastX;
    const dy = ev.clientY - lastY;
    lastX = ev.clientX;
    lastY = ev.clientY;
    yaw -= dx * 0.005;
    pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitch + dy * 0.005));
  });
  canvas.addEventListener('wheel', (ev) => {
    ev.preventDefault();
    radius = Math.max(2, Math.min(120, radius * Math.exp(ev.deltaY * 0.001)));
  }, { passive: false });

  return {
    applyTo(go: GameObject): void {
      const cp = Math.cos(pitch);
      const eye = new Vec3(
        target.x + radius * cp * Math.sin(yaw),
        target.y + radius * Math.sin(pitch),
        target.z + radius * cp * Math.cos(yaw),
      );
      go.position.set(eye.x, eye.y, eye.z);
      const qYaw = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), yaw);
      const qPitch = Quaternion.fromAxisAngle(new Vec3(1, 0, 0), -pitch);
      go.rotation = qYaw.multiply(qPitch);
    },
  };
}

function wireControls(state: SsaoState): void {
  const algoEl = document.getElementById('algo') as HTMLSelectElement;
  const blurEl = document.getElementById('blur') as HTMLSelectElement;
  const radiusEl = document.getElementById('radius') as HTMLInputElement;
  const radiusVal = document.getElementById('radiusVal') as HTMLSpanElement;
  const biasEl = document.getElementById('bias') as HTMLInputElement;
  const biasVal = document.getElementById('biasVal') as HTMLSpanElement;
  const strengthEl = document.getElementById('strength') as HTMLInputElement;
  const strengthVal = document.getElementById('strengthVal') as HTMLSpanElement;
  const viewEl = document.getElementById('view') as HTMLSelectElement;

  algoEl.addEventListener('change', () => {
    state.algorithm = algoEl.value as Algorithm;
    // Reset bias to a sensible default for the new algorithm (params have
    // different semantics across methods).
    state.bias = BIAS_DEFAULTS[state.algorithm];
    biasEl.value = state.bias.toString();
    biasVal.textContent = state.bias.toFixed(3);
  });
  blurEl.addEventListener('change', () => { state.blur = blurEl.value as AOBlurQuality; });
  radiusEl.addEventListener('input', () => {
    state.radius = parseFloat(radiusEl.value);
    radiusVal.textContent = state.radius.toFixed(2);
  });
  biasEl.addEventListener('input', () => {
    state.bias = parseFloat(biasEl.value);
    biasVal.textContent = state.bias.toFixed(3);
  });
  strengthEl.addEventListener('input', () => {
    state.strength = parseFloat(strengthEl.value);
    strengthVal.textContent = state.strength.toFixed(1);
  });
  viewEl.addEventListener('change', () => { state.viewDebugAO = viewEl.value === 'ao'; });
}

main().catch(err => {
  document.body.innerHTML = `<pre style="color:#f55;padding:1rem;font-family:ui-monospace,monospace">${(err as Error)?.message ?? err}</pre>`;
  console.error(err);
});
