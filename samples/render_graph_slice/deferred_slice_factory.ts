import type { RenderContext } from '../../src/renderer/render_context.js';
import type { RenderGraph } from '../../src/renderer/render_graph/index.js';
import { SliceGeometryPass, type SliceDrawItem } from './slice_geometry_pass.js';
import { SliceLightingPass } from './slice_lighting_pass.js';
import { SliceTonemapPass } from './slice_tonemap_pass.js';

/** Per-frame inputs the factory pulls from the application. */
export interface SliceFrameData {
  /** column-major mat4 (16 floats). */
  viewProj: Float32Array;
  drawItems: readonly SliceDrawItem[];
  lightDir: { x: number; y: number; z: number };
  lightColor: { r: number; g: number; b: number };
  lightIntensity: number;
  ambient: { r: number; g: number; b: number };
  exposure: number;
  useAces?: boolean;
}

/**
 * A minimal deferred-style render graph factory used by the render-graph
 * vertical-slice sample. Demonstrates the end-to-end flow:
 * Geometry → Lighting → Tonemap → Backbuffer.
 *
 * Owns one instance of each pass; each call to {@link build} declares a fresh
 * graph but reuses the persistent pass state (pipelines, samplers, uniform
 * buffers).
 */
export class DeferredSliceFactory {
  readonly geometry: SliceGeometryPass;
  readonly lighting: SliceLightingPass;
  readonly tonemap: SliceTonemapPass;

  private constructor(geometry: SliceGeometryPass, lighting: SliceLightingPass, tonemap: SliceTonemapPass) {
    this.geometry = geometry;
    this.lighting = lighting;
    this.tonemap = tonemap;
  }

  static create(ctx: RenderContext): DeferredSliceFactory {
    return new DeferredSliceFactory(
      SliceGeometryPass.create(ctx),
      SliceLightingPass.create(ctx),
      SliceTonemapPass.create(ctx),
    );
  }

  /** Declare a fresh graph for this frame using the supplied data. */
  build(graph: RenderGraph, frame: SliceFrameData): void {
    const backbuffer = graph.setBackbuffer('canvas');

    const gbuffer = this.geometry.addToGraph(graph, {
      viewProj: frame.viewProj,
      drawItems: frame.drawItems,
    });

    const { hdr } = this.lighting.addToGraph(graph, {
      albedo: gbuffer.albedo,
      normal: gbuffer.normal,
      lightDir: frame.lightDir,
      lightColor: frame.lightColor,
      lightIntensity: frame.lightIntensity,
      ambient: frame.ambient,
    });

    this.tonemap.addToGraph(graph, {
      hdr,
      backbuffer,
      exposure: frame.exposure,
      useAces: frame.useAces ?? true,
      hdrCanvas: graph.ctx.hdr,
    });
  }

  destroy(): void {
    this.geometry.destroy();
    this.lighting.destroy();
    this.tonemap.destroy();
  }
}
