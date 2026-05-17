import type { Mat4 } from '../math/mat4.js';
import type { Vec3 } from '../math/vec3.js';
import type { CascadeData } from '../engine/components/directional_light.js';

/**
 * The single directional ("sun") light evaluated in the forward shader.
 *
 * When `castShadows` is true the pass samples a cascaded shadow map.  Provide
 * per-cascade data via `cascades` (max 4 entries); when `cascades` is omitted
 * the pass falls back to `lightViewProj` as a single cascade.
 */
export interface DirectionalLight {
  direction: Vec3;
  intensity: number;
  color: Vec3;
  castShadows: boolean;
  lightViewProj?: Mat4;
  shadowMap?: GPUTextureView;
  /** Per-cascade shadow data (max 4).  When set overrides `lightViewProj`. */
  cascades?: readonly CascadeData[];
}
