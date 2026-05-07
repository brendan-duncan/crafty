import type { RenderContext } from './render_context.js';

/**
 * Base class for a single stage in the render graph.
 *
 * Subclasses encode GPU commands during {@link execute} and release any owned
 * GPU resources in {@link destroy}.
 */
export abstract class RenderPass {
  /** Human-readable identifier used for debugging and error scopes. */
  abstract readonly name: string;

  /** When false, the render graph skips this pass during execution. */
  enabled = true;

  /**
   * Records the pass's GPU work onto the supplied command encoder.
   *
   * @param encoder - command encoder shared across the frame
   * @param ctx - active render context providing the device and queue
   */
  abstract execute(encoder: GPUCommandEncoder, ctx: RenderContext): void;

  /**
   * Releases GPU resources owned by the pass. Default implementation is a no-op.
   */
  destroy(): void {}
}
