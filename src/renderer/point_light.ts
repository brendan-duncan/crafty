import type { Vec3 } from '../math/vec3.js';

/**
 * Point light parameters uploaded as one element of the point-light storage buffer.
 *
 * `range` is the light's effective influence radius; `castShadows` enables a
 * cube-shadow lookup for this light using its slot in the shared cube array.
 */
export interface PointLight {
  position: Vec3;
  range: number;
  color: Vec3;
  intensity: number;
  castShadows?: boolean;
}
