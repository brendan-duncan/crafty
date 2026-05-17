/**
 * Renderer barrel module.
 *
 * Re-exports `RenderContext`. The render graph, pass classes, and resource
 * cache live under [render_graph/](render_graph/); materials, lights, and
 * other renderer types are imported directly from their own modules.
 */
export { RenderContext } from './render_context.js';
