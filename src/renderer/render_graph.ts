import type { RenderContext } from './render_context.js';
import type { RenderPass } from './render_pass.js';

/**
 * Ordered sequence of {@link RenderPass} instances executed each frame.
 *
 * Passes run in the order they were added. Disabled passes are skipped, and a
 * single command encoder is shared across all passes within a frame.
 */
export class RenderGraph {
  private _passes: RenderPass[] = [];

  /**
   * Appends a pass to the end of the execution order.
   *
   * @param pass - pass to enqueue
   */
  addPass(pass: RenderPass): void {
    this._passes.push(pass);
  }

  /**
   * Executes every enabled pass for one frame and submits the resulting command buffer.
   *
   * Wraps the frame in a validation error scope when error handling is enabled
   * on the context.
   *
   * @param ctx - active render context
   */
  async execute(ctx: RenderContext): Promise<void> {
    ctx.pushFrameErrorScope();

    const encoder = ctx.device.createCommandEncoder();
    for (const pass of this._passes) {
      if (pass.enabled) {
        pass.execute(encoder, ctx);
      }
    }
    ctx.queue.submit([encoder.finish()]);

    await ctx.popFrameErrorScope();
  }

  /**
   * Destroys every contained pass and clears the graph.
   */
  destroy(): void {
    for (const pass of this._passes) {
      pass.destroy();
    }
    this._passes = [];
  }
}
