/**
 * Base class for a single stage in the render graph.
 *
 * Subclasses encode GPU commands during {@link execute} and release any owned
 * GPU resources in {@link destroy}.
 */
export class RenderPass {
    /** When false, the render graph skips this pass during execution. */
    enabled = true;
    /**
     * Releases GPU resources owned by the pass. Default implementation is a no-op.
     */
    destroy() { }
}
