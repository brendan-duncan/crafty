import type { RenderContext } from '../src/renderer/index.js';
import type { CascadeData } from '../src/engine/index.js';
import type { IblTextures } from '../src/assets/ibl.js';
import type { CloudNoiseTextures } from '../src/assets/cloud_noise.js';
import type { BlockTexture } from '../src/assets/block_texture.js';
import type { Texture } from '../src/assets/texture.js';
import type { BlockWorld, Chunk, ChunkMesh } from '../src/block/index.js';
import { EnvironmentEffect } from '../src/block/index.js';

import { PhysicalResourceCache, RenderGraph, type ResourceHandle } from '../src/renderer/render_graph/index.js';
import { ShadowPass, type ShadowMeshDraw } from '../src/renderer/render_graph/passes/shadow_pass.js';
import { BlockShadowPass } from '../src/renderer/render_graph/passes/block_shadow_pass.js';
import { BlockGeometryPass } from '../src/renderer/render_graph/passes/block_geometry_pass.js';
import { GeometryPass, type DrawItem } from '../src/renderer/render_graph/passes/geometry_pass.js';
import { SSAOPass } from '../src/renderer/render_graph/passes/ssao_pass.js';
import { SSGIPass } from '../src/renderer/render_graph/passes/ssgi_pass.js';
import { AtmospherePass } from '../src/renderer/render_graph/passes/atmosphere_pass.js';
import { CloudPass } from '../src/renderer/render_graph/passes/cloud_pass.js';
import { CloudShadowPass } from '../src/renderer/render_graph/passes/cloud_shadow_pass.js';
import { DeferredLightingPass } from '../src/renderer/render_graph/passes/deferred_lighting_pass.js';
import { PointSpotShadowPass } from '../src/renderer/render_graph/passes/point_spot_shadow_pass.js';
import { PointSpotLightPass } from '../src/renderer/render_graph/passes/point_spot_light_pass.js';
import { WaterPass } from '../src/renderer/render_graph/passes/water_pass.js';
import { GodrayPass } from '../src/renderer/render_graph/passes/godray_pass.js';
import { ParticlePass } from '../src/renderer/render_graph/passes/particle_pass.js';
import { TAAPass } from '../src/renderer/render_graph/passes/taa_pass.js';
import { DofPass } from '../src/renderer/render_graph/passes/dof_pass.js';
import { BloomPass } from '../src/renderer/render_graph/passes/bloom_pass.js';
import { BlockHighlightPass } from '../src/renderer/render_graph/passes/block_highlight_pass.js';
import { AutoExposurePass } from '../src/renderer/render_graph/passes/auto_exposure_pass.js';
import { CompositePass } from '../src/renderer/render_graph/passes/composite_pass.js';
import type { RenderGraphViz } from '../src/renderer/render_graph/ui/render_graph_viz.js';

import { rainConfig, snowConfig, blockBreakConfig, explosionConfig } from './config/particle_configs.js';

export type { DrawItem, ShadowMeshDraw };

/**
 * Per-frame inputs the renderer needs to wire shadow + lighting passes.
 * Per-pass uniforms are still pushed via the individual pass `update*` calls
 * on the persistent instances; this struct only carries values used by the
 * graph itself (cascades, the shadow scene snapshot, etc.).
 */
export interface FrameDeps {
  iblTextures: IblTextures;
  cascades: CascadeData[];
  shadowItems: ShadowMeshDraw[];
  camPos: { x: number; y: number; z: number };
  /** When false, the BlockShadowPass is skipped (e.g. sun below horizon). */
  blockShadowEnabled: boolean;
}

export interface RenderPasses {
  shadowPass: ShadowPass;
  blockShadowPass: BlockShadowPass;
  blockGeometryPass: BlockGeometryPass;
  geometryPass: GeometryPass;
  ssaoPass: SSAOPass;
  ssgiPass: SSGIPass;
  atmospherePass: AtmospherePass;
  cloudPass: CloudPass | null;
  cloudShadowPass: CloudShadowPass | null;
  lightingPass: DeferredLightingPass;
  pointSpotShadowPass: PointSpotShadowPass;
  pointSpotLightPass: PointSpotLightPass;
  waterPass: WaterPass;
  godrayPass: GodrayPass | null;
  rainPass: ParticlePass | null;
  blockBreakPass: ParticlePass;
  explosionPass: ParticlePass;
  taaPass: TAAPass;
  dofPass: DofPass | null;
  bloomPass: BloomPass | null;
  blockHighlightPass: BlockHighlightPass;
  autoExposurePass: AutoExposurePass;
  compositePass: CompositePass;
  currentWeatherEffect: EnvironmentEffect;

  /**
   * Build a fresh RenderGraph for this frame, compile and execute it.
   * When `viz` is provided the compiled graph is also snapshotted into it
   * (see {@link RenderGraphViz.setGraph}).
   */
  render(ctx: RenderContext, frame: FrameDeps, viz?: RenderGraphViz): Promise<void>;
  /** Release any pooled resources sized for the previous canvas dimensions. */
  onResize(): void;
}

/**
 * Build (or rebuild) the renderer wiring. The persistent pass instances and
 * chunk callbacks are created once on the first call; subsequent calls reuse
 * them and only refresh optional passes whose existence depends on the
 * effects flags (clouds, godrays, weather, dof, bloom).
 *
 * The returned object exposes every pass for per-frame uniform updates from
 * the game loop, plus `render(ctx, frame)` which builds and executes the
 * graph for one frame.
 */
export async function buildRenderTargets(
  ctx: RenderContext,
  passes: Partial<RenderPasses>,
  effects: Record<string, boolean>,
  blockTexture: BlockTexture,
  skyTexture: Texture,
  dudvTexture: Texture,
  gradientTexture: Texture,
  _iblTextures: IblTextures,
  cloudNoises: CloudNoiseTextures,
  world: BlockWorld,
  chunkMeshCache: Map<Chunk, ChunkMesh>,
): Promise<RenderPasses> {
  const isFirstBuild = passes.blockGeometryPass === undefined;

  // Persistent pass instances — created once, reused across resizes / option
  // toggles. The render graph is rebuilt every frame, but the pass objects
  // own pipelines, BGLs, and chunk GPU data that persist.
  const blockGeometryPass = passes.blockGeometryPass ?? BlockGeometryPass.create(ctx, blockTexture);
  const blockShadowPass = passes.blockShadowPass ?? BlockShadowPass.create(ctx, blockTexture);
  const waterPass = passes.waterPass ?? WaterPass.create(ctx, skyTexture, dudvTexture, gradientTexture);
  const shadowPass = passes.shadowPass ?? ShadowPass.create(ctx);
  const geometryPass = passes.geometryPass ?? GeometryPass.create(ctx);
  const ssaoPass = passes.ssaoPass ?? SSAOPass.create(ctx);
  const ssgiPass = passes.ssgiPass ?? SSGIPass.create(ctx);
  const atmospherePass = passes.atmospherePass ?? AtmospherePass.create(ctx);
  const lightingPass = passes.lightingPass ?? DeferredLightingPass.create(ctx);
  const compositePass = passes.compositePass ?? CompositePass.create(ctx);
  const autoExposurePass = passes.autoExposurePass ?? AutoExposurePass.create(ctx);
  const taaPass = passes.taaPass ?? TAAPass.create(ctx);
  const blockHighlightPass = passes.blockHighlightPass
    ?? BlockHighlightPass.create(ctx, { view: blockTexture.colorAtlas.view });
  const blockBreakPass = passes.blockBreakPass ?? ParticlePass.create(ctx, blockBreakConfig);
  const explosionPass = passes.explosionPass ?? ParticlePass.create(ctx, explosionConfig);

  ctx.pushInitErrorScope();
  const pointSpotShadowPass = passes.pointSpotShadowPass ?? PointSpotShadowPass.create(ctx);
  await ctx.popInitErrorScope('PointSpotShadowPass');
  const pointSpotLightPass = passes.pointSpotLightPass ?? PointSpotLightPass.create(ctx);

  // Toggleable passes — drop when disabled so the graph doesn't wire them up.
  const cloudShadowPass = effects.clouds ? (passes.cloudShadowPass ?? CloudShadowPass.create(ctx, cloudNoises)) : null;
  const cloudPass = effects.clouds ? (passes.cloudPass ?? CloudPass.create(ctx, cloudNoises)) : null;
  const godrayPass = effects.godrays ? (passes.godrayPass ?? GodrayPass.create(ctx, cloudNoises)) : null;
  const dofPass = effects.dof ? (passes.dofPass ?? DofPass.create(ctx)) : null;
  const bloomPass = effects.bloom ? (passes.bloomPass ?? BloomPass.create(ctx)) : null;

  const currentWeatherEffect = passes.currentWeatherEffect ?? EnvironmentEffect.None;
  let rainPass: ParticlePass | null = null;
  if (effects.rain && currentWeatherEffect !== EnvironmentEffect.None) {
    if (passes.rainPass !== null && passes.rainPass !== undefined && passes.currentWeatherEffect === currentWeatherEffect) {
      rainPass = passes.rainPass;
    } else {
      const weatherConfig = currentWeatherEffect === EnvironmentEffect.Snow ? snowConfig : rainConfig;
      rainPass = ParticlePass.create(ctx, weatherConfig);
    }
  }

  autoExposurePass.enabled = effects.auto_exp;
  // Match the legacy AutoExposurePass default — its initial / disabled value
  // was 1.0 (neutral). The new pass defaults to 0.1 for outdoor HDR scenes,
  // which makes crafty render ~10× too dim until the histogram converges.
  autoExposurePass.setFixedExposure(1.0);
  compositePass.depthFogEnabled = effects.fog;

  // Apply effect-derived setters once on the persistent passes.
  blockGeometryPass.setDebugChunks(effects.chunk_dbg ?? false);

  if (isFirstBuild) {
    // Hook chunk lifecycle into the chunk-owning passes. These callbacks
    // mirror what world drives during chunk generation/eviction; we set them
    // once on first build and never replace them so the world stays in sync
    // across rebuilds.
    const onAdded = (chunk: Chunk, mesh: ChunkMesh): void => {
      chunkMeshCache.set(chunk, mesh);
      blockGeometryPass.addChunk(chunk, mesh);
      blockShadowPass.addChunk(chunk, mesh);
      waterPass.addChunk(chunk, mesh);
    };
    const onUpdated = (chunk: Chunk, mesh: ChunkMesh): void => {
      chunkMeshCache.set(chunk, mesh);
      blockGeometryPass.updateChunk(chunk, mesh);
      blockShadowPass.updateChunk(chunk, mesh);
      waterPass.updateChunk(chunk, mesh);
    };
    const onRemoved = (chunk: Chunk): void => {
      chunkMeshCache.delete(chunk);
      blockGeometryPass.removeChunk(chunk);
      blockShadowPass.removeChunk(chunk);
      waterPass.removeChunk(chunk);
    };
    world.onChunkAdded = onAdded;
    world.onChunkUpdated = onUpdated;
    world.onChunkRemoved = onRemoved;

    for (const [chunk, mesh] of chunkMeshCache) {
      waterPass.addChunk(chunk, mesh);
    }
  }

  // Shared resource cache across all per-frame graph builds. Survives the
  // lifetime of the renderer; trimmed on canvas resize.
  const cache = (passes as { _cache?: PhysicalResourceCache })._cache ?? new PhysicalResourceCache(ctx.device);

  const result: RenderPasses = {
    shadowPass,
    blockShadowPass,
    blockGeometryPass,
    geometryPass,
    ssaoPass,
    ssgiPass,
    atmospherePass,
    cloudPass,
    cloudShadowPass,
    lightingPass,
    pointSpotShadowPass,
    pointSpotLightPass,
    waterPass,
    godrayPass,
    rainPass,
    blockBreakPass,
    explosionPass,
    taaPass,
    dofPass,
    bloomPass,
    blockHighlightPass,
    autoExposurePass,
    compositePass,
    currentWeatherEffect,

    async render(ctxArg: RenderContext, frame: FrameDeps, viz?: RenderGraphViz): Promise<void> {
      const graph = new RenderGraph(ctxArg, cache);
      const backbuffer = graph.setBackbuffer('canvas');

      // 1. Directional shadow map (scene meshes first, voxel chunks appended).
      const shadow = shadowPass.addToGraph(graph, {
        cascades: frame.cascades,
        drawItems: frame.shadowItems,
      });
      const shadowMap = frame.blockShadowEnabled
        ? blockShadowPass.addToGraph(graph, {
            shadowMap: shadow.shadowMap,
            cascades: frame.cascades,
            camPos: { x: frame.camPos.x, z: frame.camPos.z },
          }).shadowMap
        : shadow.shadowMap;

      // 2. Cloud shadow transmittance (top-down projection).
      const cloudShadow = cloudShadowPass?.addToGraph(graph).shadow;

      // 3. Point + spot light VSMs (writes 3 persistent textures).
      const pointSpotShadows = pointSpotLightsActive(this)
        ? pointSpotShadowPass.addToGraph(graph)
        : null;

      // 4. GBuffer fill. BlockGeometryPass clears; GeometryPass loads + overdraws.
      const gbufBlock = blockGeometryPass.addToGraph(graph, { loadOp: 'clear' });
      const gbuf = geometryPass.addToGraph(graph, { gbuffer: gbufBlock });

      // 5. SSAO (always; toggled via strength=0 from updateParams).
      const ssao = ssaoPass.addToGraph(graph, { normal: gbuf.normal, depth: gbuf.depth });

      // 6. SSGI uses last frame's TAA history as previous-radiance source.
      // The TAA pass owns the persistent key; we import it here so SSGI reads
      // the v=0 (previous frame's) contents before TAA bumps it later this frame.
      let ssgi: ResourceHandle | undefined;
      if (effects.ssgi) {
        const taaHistory = graph.importPersistentTexture('taa:history', {
          label: 'TAAHistory',
          format: 'rgba16float',
          width: ctxArg.width,
          height: ctxArg.height,
        });
        ssgi = ssgiPass.addToGraph(graph, {
          prevRadiance: taaHistory,
          normal: gbuf.normal,
          depth: gbuf.depth,
        }).result;
      }

      // 7. Atmosphere or clouds clear the HDR target. Cloud uses depth for
      // occlusion; atmosphere is a fullscreen dome.
      const skyHdr = cloudPass
        ? cloudPass.addToGraph(graph, { depth: gbuf.depth }).hdr
        : atmospherePass.addToGraph(graph).hdr;

      // 8. Deferred lighting loads sky and composites direct + indirect on top.
      const lit = lightingPass.addToGraph(graph, {
        gbuffer: gbuf,
        shadowMap,
        ao: ssao.ao,
        hdr: skyHdr,
        cloudShadow,
        ssgi,
        iblTextures: frame.iblTextures,
      });

      let hdr: ResourceHandle = lit.hdr;

      // 9. Point + spot lighting additively blends on top.
      if (pointSpotShadows) {
        hdr = pointSpotLightPass.addToGraph(graph, {
          gbuffer: gbuf,
          pointVsm: pointSpotShadows.pointVsm,
          spotVsm: pointSpotShadows.spotVsm,
          projTex: pointSpotShadows.projTex,
          hdr,
        }).hdr;
      }

      // 10. Water (alpha-blended) and godrays (additive).
      hdr = waterPass.addToGraph(graph, { hdr, depth: gbuf.depth }).hdr;

      if (godrayPass) {
        hdr = godrayPass.addToGraph(graph, {
          hdr,
          depth: gbuf.depth,
          shadowMap,
          cameraBuffer: lit.cameraBuffer,
          lightBuffer: lit.lightBuffer,
        }).hdr;
      }

      // 11. Forward particle passes (all of crafty's particles use renderTarget='hdr').
      if (rainPass) {
        hdr = rainPass.addToGraph(graph, { gbuffer: { depth: gbuf.depth }, hdr }).hdr!;
      }
      hdr = blockBreakPass.addToGraph(graph, { gbuffer: { depth: gbuf.depth }, hdr }).hdr!;
      hdr = explosionPass.addToGraph(graph, { gbuffer: { depth: gbuf.depth }, hdr }).hdr!;

      // 12. Auto-exposure samples the pre-TAA HDR (sample histogram, smooth
      // exposure). The buffer it returns is consumed by composite below.
      const exposure = autoExposurePass.addToGraph(graph, { hdr });

      // 13. TAA → DoF → Bloom → BlockHighlight.
      const taaOut = taaPass.addToGraph(graph, { hdr, depth: gbuf.depth });
      let postHdr: ResourceHandle = taaOut.resolved;
      if (dofPass) {
        postHdr = dofPass.addToGraph(graph, { hdr: postHdr, depth: gbuf.depth }).result;
      }
      if (bloomPass) {
        postHdr = bloomPass.addToGraph(graph, { hdr: postHdr }).result;
      }
      const highlighted = blockHighlightPass.addToGraph(graph, { hdr: postHdr, depth: gbuf.depth });

      // 14. Final composite → backbuffer.
      compositePass.addToGraph(graph, {
        input: highlighted.hdr,
        ao: ssao.ao,
        depth: gbuf.depth,
        cameraBuffer: lit.cameraBuffer,
        lightBuffer: lit.lightBuffer,
        exposureBuffer: exposure.exposureBuffer,
        backbuffer,
      });

      const compiled = graph.compile();
      viz?.setGraph(graph, compiled);
      await graph.execute(compiled);
    },

    onResize(): void {
      cache.trimUnused();
    },
  };

  // Stash the cache on the returned object so the next rebuildRenderTargets()
  // call can reuse it (it's a private channel through the Partial<RenderPasses>).
  (result as { _cache?: PhysicalResourceCache })._cache = cache;

  return result;
}

/**
 * The PointSpotLightPass + PointSpotShadowPass chain reads + writes
 * persistent VSM textures unconditionally. Calling `addToGraph` is cheap
 * even when no shadow-casting lights exist (the inner setExecute loops
 * become no-ops), so we always wire it up.
 */
function pointSpotLightsActive(_passes: RenderPasses): boolean {
  return true;
}
