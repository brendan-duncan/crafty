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
export enum MaterialPassType {
  Forward = 'forward',
  Geometry = 'geometry',
  SkinnedGeometry = 'skinnedGeometry',
}

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
export abstract class Material {
  /**
   * Stable per-subclass identifier. All instances with the same `shaderId`
   * MUST produce identical {@link getShaderCode} output and identical
   * {@link getBindGroupLayout} layouts on a given device — the pass uses this
   * as the pipeline cache key.
   */
  abstract readonly shaderId: string;

  /**
   * True for alpha-blended materials. ForwardPass routes these through its
   * transparent sub-pass (after opaque) with depth-write disabled.
   */
  transparent: boolean = false;

  /**
   * Returns the WGSL source for a given pass type.
   *
   * @param passType - Which pass is asking.
   * @returns WGSL source.
   * @throws If the material does not support `passType`.
   */
  abstract getShaderCode(passType: MaterialPassType): string;

  /**
   * Returns the bind group layout for slot {@link MATERIAL_GROUP}. Implementations
   * MUST cache the layout per device — typically with a static `WeakMap<GPUDevice, GPUBindGroupLayout>`.
   */
  abstract getBindGroupLayout(device: GPUDevice): GPUBindGroupLayout;

  /**
   * Returns the bind group instance for slot {@link MATERIAL_GROUP}. Implementations
   * may cache the bind group internally and recreate it lazily when textures or
   * other resource references change.
   */
  abstract getBindGroup(device: GPUDevice): GPUBindGroup;

  /**
   * Optional: called by the pass once per draw before binding, so the material
   * can flush any dirty CPU-side parameter changes into its uniform buffers.
   */
  update?(queue: GPUQueue): void;

  /**
   * Optional: release any GPU resources owned by this material instance
   * (uniform buffers, owned textures). Bind group layouts shared across
   * instances should NOT be destroyed here.
   */
  destroy?(): void;
}
