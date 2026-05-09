import type { Mat4 } from '../math/mat4.js';
import type { Vec3 } from '../math/vec3.js';

/**
 * The single directional ("sun") light evaluated in the forward shader.
 *
 * `lightViewProj` and a populated cascade-zero shadow-map slice are required
 * when `castShadows` is true; otherwise shadow sampling is skipped.
 */
export interface DirectionalLight {
  direction: Vec3;
  intensity: number;
  color: Vec3;
  castShadows: boolean;
  lightViewProj?: Mat4;
  shadowMap?: GPUTextureView;
}
