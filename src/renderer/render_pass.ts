import type { RenderContext } from './render_context.js';

export abstract class RenderPass {
  abstract readonly name: string;

  abstract execute(encoder: GPUCommandEncoder, ctx: RenderContext): void;

  destroy(): void {}
}
