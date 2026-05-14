import type { RenderContext, RenderGraph } from '../src/renderer/index.js';
import { GBuffer } from '../src/renderer/index.js';
import {
  ShadowPass, GeometryPass, DeferredLightingPass, SSAOPass, SSGIPass,
  TAAPass, DofPass, BloomPass, AtmospherePass, CompositePass,
  AutoExposurePass, PointSpotShadowPass, PointSpotLightPass,
  BlockGeometryPass, WaterPass, BlockShadowPass, BlockHighlightPass,
  ParticlePass, CloudPass, CloudShadowPass, GodrayPass,
} from '../src/renderer/index.js';
import type { IblTextures } from '../src/assets/ibl.js';
import type { CloudNoiseTextures } from '../src/assets/cloud_noise.js';
import type { BlockTexture } from '../src/assets/block_texture.js';
import type { Texture } from '../src/assets/texture.js';
import type { World, Chunk, ChunkMesh } from '../src/block/index.js';
import { EnvironmentEffect } from '../src/block/index.js';
import type { Mat4 } from '../src/math/index.js';
import { rainConfig, snowConfig, blockBreakConfig, explosionConfig } from './config/particle_configs.js';

export interface RenderPasses {
  shadowPass: ShadowPass;
  gbuffer: GBuffer;
  geometryPass: GeometryPass;
  blockGeometryPass: BlockGeometryPass;
  blockShadowPass: BlockShadowPass;
  waterPass: WaterPass;
  ssaoPass: SSAOPass;
  ssgiPass: SSGIPass;
  lightingPass: DeferredLightingPass;
  atmospherePass: AtmospherePass;
  pointSpotShadowPass: PointSpotShadowPass;
  pointSpotLightPass: PointSpotLightPass;
  taaPass: TAAPass;
  dofPass: DofPass | null;
  bloomPass: BloomPass | null;
  rainPass: ParticlePass | null;
  blockBreakPass: ParticlePass;
  explosionPass: ParticlePass;
  godrayPass: GodrayPass | null;
  cloudPass: CloudPass | null;
  cloudShadowPass: CloudShadowPass | null;
  blockHighlightPass: BlockHighlightPass;
  autoExposurePass: AutoExposurePass;
  compositePass: CompositePass;
  graph: RenderGraph;
  prevViewProj: Mat4 | null;
  currentWeatherEffect: EnvironmentEffect;
}

export async function buildRenderTargets(
  ctx: RenderContext,
  passes: Partial<RenderPasses>,
  effects: Record<string, boolean>,
  blockTexture: BlockTexture,
  skyTexture: Texture,
  dudvTexture: Texture,
  gradientTexture: Texture,
  iblTextures: IblTextures,
  cloudNoises: CloudNoiseTextures,
  world: World,
  chunkMeshCache: Map<Chunk, ChunkMesh>,
): Promise<RenderPasses> {
  // Note: We don't explicitly destroy old passes here because:
  // 1. The GPU might still be processing commands that reference their buffers
  // 2. Destroying them causes "used in submit while destroyed" errors
  // 3. They'll be garbage collected automatically when references are replaced

  // BlockGeometryPass / WaterPass / BlockShadowPass: persistent across resizes
  let gbuffer: GBuffer;
  let blockGeometryPass: BlockGeometryPass;
  let blockShadowPass: BlockShadowPass;
  let waterPass: WaterPass;

  if (passes.blockGeometryPass) {
    const newGbuf = GBuffer.create(ctx);
    passes.blockGeometryPass.updateGBuffer(newGbuf);
    gbuffer = newGbuf;
    blockGeometryPass = passes.blockGeometryPass;
    blockShadowPass = passes.blockShadowPass!;
    waterPass = passes.waterPass!;
  } else {
    gbuffer = GBuffer.create(ctx);
    blockGeometryPass = BlockGeometryPass.create(ctx, gbuffer, blockTexture);
    blockShadowPass = BlockShadowPass.create(ctx, passes.shadowPass!.shadowMapArrayViews, 3, blockTexture);

    // Create dummy textures to initialize waterPass (will be updated later with real targets)
    const dummyHdrTex = ctx.device.createTexture({
      label: 'WaterDummyHDR',
      size: { width: ctx.width, height: ctx.height },
      format: 'rgba16float',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
    });
    const dummyDepthTex = ctx.device.createTexture({
      label: 'WaterDummyDepth',
      size: { width: ctx.width, height: ctx.height },
      format: 'depth32float',
      usage: GPUTextureUsage.TEXTURE_BINDING,
    });
    const dummyHdrView = dummyHdrTex.createView();
    const dummyDepthView = dummyDepthTex.createView();
    waterPass = WaterPass.create(ctx, dummyHdrTex, dummyHdrView, dummyDepthView, skyTexture, dudvTexture, gradientTexture);

    const onAdded = (chunk: Chunk, mesh: ChunkMesh) => {
      chunkMeshCache.set(chunk, mesh);
      blockGeometryPass.addChunk(chunk, mesh);
      blockShadowPass.addChunk(chunk, mesh);
      waterPass.addChunk(chunk, mesh);
    };
    const onUpdated = (chunk: Chunk, mesh: ChunkMesh) => {
      chunkMeshCache.set(chunk, mesh);
      blockGeometryPass.updateChunk(chunk, mesh);
      blockShadowPass.updateChunk(chunk, mesh);
      waterPass.updateChunk(chunk, mesh);
    };
    const onRemoved = (chunk: Chunk) => {
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

    // Note: We don't destroy the dummy textures here because the WaterPass bind groups
    // reference them. They'll be replaced by updateRenderTargets() below and then GC'd.
  }

  const geometryPass = GeometryPass.create(ctx, gbuffer);
  const ssaoPass = SSAOPass.create(ctx, gbuffer);

  const cloudShadowPass = effects.clouds ? CloudShadowPass.create(ctx, cloudNoises) : null;
  const lightingPass = DeferredLightingPass.create(ctx, gbuffer, passes.shadowPass!, ssaoPass.aoView, cloudShadowPass?.shadowView, iblTextures);
  const godrayPass = effects.godrays ? GodrayPass.create(ctx, gbuffer, passes.shadowPass!, lightingPass.hdrView, lightingPass.cameraBuffer, lightingPass.lightBuffer, cloudNoises) : null;
  const atmospherePass = AtmospherePass.create(ctx, { output: lightingPass.hdrView });
  const cloudPass = effects.clouds ? CloudPass.create(ctx, lightingPass.hdrView, gbuffer.depthView, cloudNoises) : null;

  ctx.pushInitErrorScope();
  const pointSpotShadowPass = PointSpotShadowPass.create(ctx);
  await ctx.popInitErrorScope('PointSpotShadowPass');

  const pointSpotLightPass = PointSpotLightPass.create(ctx, gbuffer, pointSpotShadowPass, lightingPass.hdrView);
  const taaPass = TAAPass.create(ctx, lightingPass, gbuffer);
  const ssgiPass = SSGIPass.create(ctx, gbuffer, taaPass.historyView);
  lightingPass.updateSSGI(ssgiPass.resultView);

  if (passes.waterPass) {
    waterPass.updateRenderTargets(lightingPass.hdrTexture, lightingPass.hdrView, gbuffer.depthView, skyTexture);
  } else {
    waterPass.updateRenderTargets(lightingPass.hdrTexture, lightingPass.hdrView, gbuffer.depthView, skyTexture);
  }

  let dofPass: DofPass | null = null;
  const postInput = effects.dof
    ? (dofPass = DofPass.create(ctx, taaPass.resolvedView, gbuffer.depthView), dofPass.resultView)
    : taaPass.resolvedView;

  let bloomPass: BloomPass | null = null;
  const bloomOut = effects.bloom
    ? (bloomPass = BloomPass.create(ctx, postInput), bloomPass.resultView)
    : postInput;

  const blockHighlightPass = BlockHighlightPass.create(ctx, bloomOut, gbuffer.depthView, blockTexture.colorAtlas);
  const autoExposurePass = AutoExposurePass.create(ctx, lightingPass.hdrTexture);
  autoExposurePass.enabled = effects.auto_exp;
  const compositePass = CompositePass.create(ctx, {
      inputView: bloomOut,
      aoView: ssaoPass.aoView,
      depthView: gbuffer.depthView,
      cameraBuffer: lightingPass.cameraBuffer,
      lightBuffer: lightingPass.lightBuffer,
      exposureBuffer: autoExposurePass.exposureBuffer,
  });
  compositePass.depthFogEnabled = effects.fog;

  const currentWeatherEffect = passes.currentWeatherEffect ?? EnvironmentEffect.None;
  let rainPass: ParticlePass | null = null;
  if (effects.rain && currentWeatherEffect !== EnvironmentEffect.None) {
    const weatherConfig = currentWeatherEffect === EnvironmentEffect.Snow ? snowConfig : rainConfig;
    rainPass = ParticlePass.create(ctx, weatherConfig, gbuffer, lightingPass.hdrView);
  }

  // Always-on burst-only particle pass for block-break debris.
  const blockBreakPass = ParticlePass.create(ctx, blockBreakConfig, gbuffer, lightingPass.hdrView);

  // Always-on burst-only particle pass for creeper explosions.
  const explosionPass = ParticlePass.create(ctx, explosionConfig, gbuffer, lightingPass.hdrView);

  // Build graph
  const { RenderGraph } = await import('../src/renderer/index.js');
  const graph = new RenderGraph();
  graph.addPass(passes.shadowPass!);
  if (cloudShadowPass) {
    graph.addPass(cloudShadowPass);
  }
  graph.addPass(blockShadowPass);
  graph.addPass(pointSpotShadowPass);
  graph.addPass(geometryPass);
  graph.addPass(blockGeometryPass);
  graph.addPass(ssaoPass);
  graph.addPass(ssgiPass);
  if (cloudPass) {
    graph.addPass(cloudPass);
  } else {
    graph.addPass(atmospherePass);
  }
  graph.addPass(lightingPass);
  graph.addPass(pointSpotLightPass);
  graph.addPass(waterPass);
  if (godrayPass) {
    graph.addPass(godrayPass);
  }
  if (rainPass) {
    graph.addPass(rainPass);
  }
  graph.addPass(blockBreakPass);
  graph.addPass(explosionPass);
  graph.addPass(taaPass);
  if (dofPass) {
    graph.addPass(dofPass);
  }
  if (bloomPass) {
    graph.addPass(bloomPass);
  }
  graph.addPass(blockHighlightPass);
  graph.addPass(autoExposurePass);
  graph.addPass(compositePass);

  return {
    shadowPass: passes.shadowPass!,
    gbuffer,
    geometryPass,
    blockGeometryPass,
    blockShadowPass,
    waterPass,
    ssaoPass,
    ssgiPass,
    lightingPass,
    atmospherePass,
    pointSpotShadowPass,
    pointSpotLightPass,
    taaPass,
    dofPass,
    bloomPass,
    rainPass,
    blockBreakPass,
    explosionPass,
    godrayPass,
    cloudPass,
    cloudShadowPass,
    blockHighlightPass,
    autoExposurePass,
    compositePass,
    graph,
    prevViewProj: null,
    currentWeatherEffect,
  };
}
