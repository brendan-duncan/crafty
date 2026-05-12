/**
 * Bind-group slot reserved for material-owned bindings in the geometry, forward,
 * and skinned-geometry passes. Material WGSL must declare its bindings under
 * `@group(2)`; the surrounding slots (camera, model, lighting/IBL) belong to the
 * pass.
 */
export const MATERIAL_GROUP = 2;
/**
 * Identifies which renderer pass is asking the material for a shader. A single
 * `Material` may support multiple pass types and is expected to return WGSL
 * appropriate for each.
 */
export var MaterialPassType;
(function (MaterialPassType) {
    MaterialPassType["Forward"] = "forward";
    MaterialPassType["Geometry"] = "geometry";
    MaterialPassType["SkinnedGeometry"] = "skinnedGeometry";
})(MaterialPassType || (MaterialPassType = {}));
/**
 * Abstract base for shader+data bundles consumed by the geometry, forward, and
 * skinned-geometry passes.
 *
 * Subclasses provide WGSL plus a {@link MATERIAL_GROUP} bind group containing
 * their uniforms, textures, and samplers. Passes cache pipelines keyed by
 * {@link Material.shaderId}, so all instances sharing a `shaderId` must produce
 * the same shader code, the same bind group layout, and the same vertex
 * expectations as each other.
 */
export class Material {
    /**
     * True for alpha-blended materials. ForwardPass routes these through its
     * transparent sub-pass (after opaque) with depth-write disabled.
     */
    transparent = false;
}
