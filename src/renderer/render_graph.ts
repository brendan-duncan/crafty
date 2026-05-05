import type { RenderContext } from './render_context.js';
import type { RenderPass } from './render_pass.js';

export class RenderGraph {
  private _passes: RenderPass[] = [];

  addPass(pass: RenderPass): void {
    this._passes.push(pass);
  }

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

  destroy(): void {
    for (const pass of this._passes) {
      pass.destroy();
    }
    this._passes = [];
  }
}
