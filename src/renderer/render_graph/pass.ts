import type { RenderGraph } from './render_graph.js';

/**
 * Abstract base class for a render graph pass.
 *
 * A pass is a container for long-lived GPU state — pipelines, bind group
 * layouts, samplers, persistent uniform buffers — that on each frame is
 * inserted into a {@link RenderGraph} via {@link addToGraph}. The graph
 * itself does not store pass instances; it stores the read/write declarations
 * and execute callback that `addToGraph` registers via the supplied
 * {@link import('./pass_builder.js').PassBuilder}.
 *
 * Subclasses parameterize the dependency and output types so the factory can
 * wire passes together with type-checked handles:
 *
 * ```ts
 * class GeometryPass extends Pass<{ camera: ResourceHandle }, { albedo, normal, depth }> {
 *   readonly name = 'GeometryPass';
 *   addToGraph(graph, deps) { ... }
 * }
 * ```
 *
 * The convention is that the constructor builds long-lived state (pipelines
 * etc.), `addToGraph` declares per-frame resource flow, and `destroy`
 * releases anything the pass owns.
 */
export abstract class Pass<TDeps = undefined, TOutputs = void> {
  /** Human-readable identifier used in graph node labels and error messages. */
  abstract readonly name: string;

  /**
   * Insert the pass into `graph` for one frame. Implementations call
   * `graph.addPass(name, type, b => { ... })` exactly once and use the
   * supplied {@link PassBuilder} to declare reads, writes, transient
   * resources, and the execute callback.
   *
   * @param graph Graph being built this frame.
   * @param deps Pass-specific dependency record (handles, scene data, etc.).
   * @returns Pass-specific output record (typically a set of handles
   *   downstream passes will consume).
   */
  abstract addToGraph(graph: RenderGraph, deps: TDeps): TOutputs;

  /**
   * Release every long-lived GPU resource owned by the pass (pipelines,
   * persistent uniform buffers, samplers, BGLs). Called by the factory or
   * application during teardown. Default implementation is a no-op.
   */
  destroy(): void {}
}
