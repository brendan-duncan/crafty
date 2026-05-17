/**
 * SSAO test sample.
 *
 * A single 16×16×16 voxel chunk is populated with a random mix of solid blocks
 * and air. The density is tuned to leave plenty of crevices and stair-step
 * surfaces so SSAO has rich geometry to bite into.
 *
 * The render display defaults to CompositePass's debug-AO mode (the AO factor
 * written to the backbuffer as greyscale), with a toggle to switch to the
 * fully-lit scene for comparison. A dropdown selects between SSAO blur modes:
 *
 *   - Quality:     separable bilateral Gaussian (default)
 *   - Performance: single-pass 4×4 box blur
 *   - Off:         strength set to 0 (the pass still runs so its output stays
 *                  defined, but the resulting AO is uniformly white)
 *
 * The radius / bias / strength sliders feed SSAOPass.updateParams() so the
 * tuning knobs can be inspected interactively without a code change.
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
import { PhysicalResourceCache, RenderGraph } from '../src/renderer/render_graph/index.js';
import { BlockGeometryPass } from '../src/renderer/render_graph/passes/block_geometry_pass.js';
import { ShadowPass } from '../src/renderer/render_graph/passes/shadow_pass.js';
import { SSAOPass, type SsaoBlurQuality } from '../src/renderer/render_graph/passes/ssao_pass.js';
import { DeferredLightingPass } from '../src/renderer/render_graph/passes/deferred_lighting_pass.js';
import { AutoExposurePass } from '../src/renderer/render_graph/passes/auto_exposure_pass.js';
import { CompositePass } from '../src/renderer/render_graph/passes/composite_pass.js';
import type { CascadeData } from '../src/engine/components/directional_light.js';

type SsaoMode = SsaoBlurQuality | 'off';

interface SsaoState {
  mode: SsaoMode;
  radius: number;
  bias: number;
  strength: number;
  viewDebugAO: boolean;
}

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const statsEl = document.getElementById('stats') as HTMLDivElement;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const device = ctx.device;
  const cache = new PhysicalResourceCache(device);

  // ── Block texture atlas ──────────────────────────────────────────────────
  const blockTex = await BlockTexture.load(device, colorAtlasUrl, normalAtlasUrl, merAtlasUrl, heightAtlasUrl);

  // ── Build the test chunk ─────────────────────────────────────────────────
  // 16×16×16 of random blocks with ~40% solid density. The mix of solid /
  // air cells produces the cube-step crevices that exercise SSAO well: every
  // internal corner is a hit candidate for the AO kernel.
  const chunk = buildRandomChunk(/* seed */ 0xC0FFEE, /* solidProbability */ 0.4);

  // ── Persistent passes ────────────────────────────────────────────────────
  const blockGeometryPass = BlockGeometryPass.create(ctx, blockTex);
  const shadowPass = ShadowPass.create(ctx);
  const ssaoPass = SSAOPass.create(ctx, 'quality');
  const lightingPass = DeferredLightingPass.create(ctx);
  const autoExposurePass = AutoExposurePass.create(ctx);
  autoExposurePass.setFixedExposure(1.0);
  const compositePass = CompositePass.create(ctx);
  compositePass.depthFogEnabled = false;

  // Register the chunk's GPU mesh with the block geometry pass.
  blockGeometryPass.addChunk(chunk, chunk.generateVertices());

  // ── Camera (orbit around chunk centre) ───────────────────────────────────
  const chunkCentre = new Vec3(
    Chunk.CHUNK_WIDTH * 0.5,
    Chunk.CHUNK_HEIGHT * 0.5,
    Chunk.CHUNK_DEPTH * 0.5,
  );
  const cameraGO = new GameObject({ name: 'Camera' });
  const camera = cameraGO.addComponent(Camera.createPerspective(60, 0.1, 200, ctx.width / ctx.height));
  const orbit = createOrbitController(canvas, chunkCentre, /* radius */ 28, /* yaw */ Math.PI / 4, /* pitch */ 0.55);

  // ── Sun (only needed because the lighting pass demands cascades and a sun
  //    direction; the debug-AO view short-circuits before reading either). ──
  const sunDir = new Vec3(0.3, -0.9, 0.4).normalize();

  // ── UI state + DOM wiring ────────────────────────────────────────────────
  const state: SsaoState = { mode: 'quality', radius: 1.0, bias: 0.005, strength: 2.0, viewDebugAO: true };
  wireControls(state);

  // ── Resize observer ──────────────────────────────────────────────────────
  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    cache.trimUnused();
  });
  resizeObserver.observe(canvas);

  // ── Frame loop ───────────────────────────────────────────────────────────
  function frame(): void {
    ctx.update();
    statsEl.textContent =
      `FPS ${ctx.fps.toFixed(0)}\n` +
      `mode ${state.mode}\n` +
      `view ${state.viewDebugAO ? 'debug-AO' : 'lit'}`;

    orbit.applyTo(cameraGO);
    camera.updateRender(ctx);
    ctx.activeCamera = camera;

    // ── Per-frame uniforms ──────────────────────────────────────────────
    blockGeometryPass.updateCamera(ctx);

    ssaoPass.setBlurQuality(state.mode === 'off' ? 'quality' : state.mode);
    ssaoPass.updateCamera(ctx);
    // When the mode is 'off', force strength to 0 so SSAO outputs white and
    // the lit comparison stays faithful. The pass still runs (its output is a
    // bound resource for the composite shader) but the AO contribution is 0.
    const effectiveStrength = state.mode === 'off' ? 0 : state.strength;
    ssaoPass.updateParams(ctx, state.radius, state.bias, effectiveStrength);

    // One cascade is the bare minimum for DeferredLightingPass to be happy.
    // We don't actually render shadows for the chunk — drawItems is empty —
    // so the shadow map is just a cleared depth texture.
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

    // ── Build the graph for this frame ──────────────────────────────────
    const graph = new RenderGraph(ctx, cache);
    const backbuffer = graph.setBackbuffer('canvas');

    // Shadow map (empty cascades + empty draw items still produces a cleared
    // persistent depth texture that the lighting pass binds).
    const shadow = shadowPass.addToGraph(graph, { cascades, drawItems: [] });

    // GBuffer (clears its three attachments and draws the chunk into them).
    const gbuffer = blockGeometryPass.addToGraph(graph, { loadOp: 'clear' });

    // SSAO from the gbuffer.
    const ssao = ssaoPass.addToGraph(graph, { normal: gbuffer.normal, depth: gbuffer.depth });

    // Deferred lighting — needed even in debug-AO mode because the composite
    // pass binds the camera + light uniform buffers, which this pass owns.
    const lit = lightingPass.addToGraph(graph, {
      gbuffer,
      shadowMap: shadow.shadowMap,
      ao: ssao.ao,
    });

    // Auto-exposure — same story: the composite pass binds its exposure buffer.
    const exposure = autoExposurePass.addToGraph(graph, { hdr: lit.hdr });

    // Composite to backbuffer. The debug-AO flag in updateParams above
    // determines whether composite renders the AO greyscale or the lit scene.
    compositePass.addToGraph(graph, {
      input: lit.hdr,
      ao: ssao.ao,
      depth: gbuffer.depth,
      cameraBuffer: lit.cameraBuffer,
      lightBuffer: lit.lightBuffer,
      exposureBuffer: exposure.exposureBuffer,
      backbuffer,
    });

    void graph.execute(graph.compile());
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
      // Camera default forward is -Z. Yaw around world Y rotates -Z toward
      // (-sin yaw, 0, -cos yaw) — that's the direction from eye to target at
      // pitch = 0. Pitch around the (yaw-rotated) local X axis tilts the
      // forward vector vertically; the negative sign matches our convention
      // that positive pitch lifts the eye above the target.
      const qYaw = Quaternion.fromAxisAngle(new Vec3(0, 1, 0), yaw);
      const qPitch = Quaternion.fromAxisAngle(new Vec3(1, 0, 0), -pitch);
      go.rotation = qYaw.multiply(qPitch);
    },
  };
}

function wireControls(state: SsaoState): void {
  const modeEl = document.getElementById('mode') as HTMLSelectElement;
  const radiusEl = document.getElementById('radius') as HTMLInputElement;
  const radiusVal = document.getElementById('radiusVal') as HTMLSpanElement;
  const biasEl = document.getElementById('bias') as HTMLInputElement;
  const biasVal = document.getElementById('biasVal') as HTMLSpanElement;
  const strengthEl = document.getElementById('strength') as HTMLInputElement;
  const strengthVal = document.getElementById('strengthVal') as HTMLSpanElement;
  const viewEl = document.getElementById('view') as HTMLSelectElement;

  modeEl.addEventListener('change', () => { state.mode = modeEl.value as SsaoMode; });
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
