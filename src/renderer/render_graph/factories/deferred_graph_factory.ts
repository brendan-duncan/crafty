import type { RenderContext } from '../../render_context.js';
import type { RenderGraph, ResourceHandle, BufferDesc } from '../index.js';
import type { CascadeData } from '../../../engine/components/directional_light.js';
import type { IblTextures } from '../../../assets/ibl.js';
import type { BlockTexture } from '../../../assets/block_texture.js';

import { ShadowPass, type ShadowMeshDraw } from '../passes/shadow_pass.js';
import { BlockShadowPass } from '../passes/block_shadow_pass.js';
import { BlockGeometryPass } from '../passes/block_geometry_pass.js';
import { SSAOPass } from '../passes/ssao_pass.js';
import { AtmospherePass } from '../passes/atmosphere_pass.js';
import { DeferredLightingPass } from '../passes/deferred_lighting_pass.js';
import { CompositePass } from '../passes/composite_pass.js';

const EXPOSURE_BUFFER_KEY = 'lighting:exposure';
const EXPOSURE_BUFFER_DESC: BufferDesc = {
  label: 'ExposureBuffer',
  size: 16,
  extraUsage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
};

/**
 * Per-frame inputs for the deferred graph factory.
 *
 * Most state is mutated on the pass instances directly (via their update*
 * methods); this struct only carries the per-frame scene description that
 * the graph itself needs to wire shadow + camera-cull computations.
 */
export interface DeferredFrameData {
  /** Cascades for the directional light (already computed). */
  cascades: readonly CascadeData[];
  /** Camera world-space position (used for chunk shadow culling). */
  camPos: { x: number; y: number; z: number };
  /** Mesh instances that cast directional shadows (non-block geometry). */
  shadowMeshes?: readonly ShadowMeshDraw[];
  /** Optional IBL textures sampled by the deferred lighting pass. */
  iblTextures?: IblTextures;
}

export interface DeferredGraphFactoryOptions {
  /** Block atlas + per-block tile metadata used by chunk passes. */
  blockTexture: BlockTexture;
  /** Whether to render the procedural sky before the lighting pass. */
  enableAtmosphere?: boolean;
}

/**
 * Wires the converted production passes (shadow, block shadow, block geometry,
 * SSAO, atmosphere, deferred lighting, composite) into a render graph each
 * frame. Owns one persistent instance of every pass.
 *
 * Per-frame call order:
 *   ShadowPass + BlockShadowPass → shadow map
 *   BlockGeometryPass            → gbuffer
 *   SSAOPass                     → ao
 *   AtmospherePass (optional)    → HDR (clear)
 *   DeferredLightingPass         → HDR (load)
 *   CompositePass                → backbuffer
 */
export class DeferredGraphFactory {
  readonly shadow: ShadowPass;
  readonly blockShadow: BlockShadowPass;
  readonly blockGeometry: BlockGeometryPass;
  readonly ssao: SSAOPass;
  readonly atmosphere: AtmospherePass | null;
  readonly lighting: DeferredLightingPass;
  readonly composite: CompositePass;

  private constructor(
    shadow: ShadowPass,
    blockShadow: BlockShadowPass,
    blockGeometry: BlockGeometryPass,
    ssao: SSAOPass,
    atmosphere: AtmospherePass | null,
    lighting: DeferredLightingPass,
    composite: CompositePass,
  ) {
    this.shadow = shadow;
    this.blockShadow = blockShadow;
    this.blockGeometry = blockGeometry;
    this.ssao = ssao;
    this.atmosphere = atmosphere;
    this.lighting = lighting;
    this.composite = composite;
  }

  static create(ctx: RenderContext, options: DeferredGraphFactoryOptions): DeferredGraphFactory {
    return new DeferredGraphFactory(
      ShadowPass.create(ctx),
      BlockShadowPass.create(ctx, options.blockTexture),
      BlockGeometryPass.create(ctx, options.blockTexture),
      SSAOPass.create(ctx),
      options.enableAtmosphere === false ? null : AtmospherePass.create(ctx),
      DeferredLightingPass.create(ctx),
      CompositePass.create(ctx),
    );
  }

  /** Declare a fresh graph for this frame using `frame` data. */
  build(graph: RenderGraph, frame: DeferredFrameData): void {
    const backbuffer = graph.setBackbuffer('canvas');

    // Persistent exposure buffer (replaced by a real AutoExposurePass once converted).
    const exposureBuffer: ResourceHandle = graph.importPersistentBuffer(EXPOSURE_BUFFER_KEY, EXPOSURE_BUFFER_DESC);
    // Initial value: write a constant 1.0 once on first import. After that the
    // pool keeps the same buffer; the value stays.
    // (No-op placeholder until AutoExposurePass is migrated.)

    // 1. Directional shadow map: ShadowPass first, then BlockShadowPass appends.
    const shadow = this.shadow.addToGraph(graph, {
      cascades: frame.cascades,
      drawItems: frame.shadowMeshes ?? [],
    });
    const blockShadow = this.blockShadow.addToGraph(graph, {
      shadowMap: shadow.shadowMap,
      cascades: frame.cascades,
      camPos: { x: frame.camPos.x, z: frame.camPos.z },
    });

    // 2. GBuffer fill (block geometry only for now).
    const gbuffer = this.blockGeometry.addToGraph(graph, { loadOp: 'clear' });

    // 3. SSAO from gbuffer.
    const ssao = this.ssao.addToGraph(graph, {
      normal: gbuffer.normal,
      depth: gbuffer.depth,
    });

    // 4. Atmosphere clears the HDR target (if enabled). Otherwise, the lighting
    //    pass creates+clears its own.
    const atmoHdr = this.atmosphere?.addToGraph(graph).hdr;

    // 5. Deferred lighting (loads atmosphere output if present).
    const lit = this.lighting.addToGraph(graph, {
      gbuffer,
      shadowMap: blockShadow.shadowMap,
      ao: ssao.ao,
      hdr: atmoHdr,
      iblTextures: frame.iblTextures,
    });

    // 6. Composite to backbuffer.
    this.composite.addToGraph(graph, {
      input: lit.hdr,
      ao: ssao.ao,
      depth: gbuffer.depth,
      cameraBuffer: lit.cameraBuffer,
      lightBuffer: lit.lightBuffer,
      exposureBuffer,
      backbuffer,
    });
  }

  destroy(): void {
    this.shadow.destroy();
    this.blockShadow.destroy();
    this.blockGeometry.destroy();
    this.ssao.destroy();
    this.atmosphere?.destroy();
    this.lighting.destroy();
    this.composite.destroy();
  }
}
