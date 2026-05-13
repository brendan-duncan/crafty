import { Mat4, Vec3 } from '../../math/index.js';
import { Component } from '../component.js';

/**
 * Cone-restricted spot light component.
 *
 * Supplies the deferred lighting pass with a directional cone (range,
 * inner/outer angles, optional projected texture) and, when shadowing is
 * enabled, a single perspective view-projection consumed by the spot-light
 * shadow pass.
 */
export class SpotLight extends Component {
  /** Linear RGB color multiplier. */
  color: Vec3 = Vec3.one();
  /** Scalar intensity multiplier. */
  intensity: number = 1.0;
  /** Maximum range in world units. */
  range: number = 20.0;
  /** Half-angle of the full-bright cone, in degrees. */
  innerAngle: number = 15;
  /** Half-angle of the fade-to-zero cone, in degrees. */
  outerAngle: number = 30;
  /** Whether this light renders a shadow map. */
  castShadow: boolean = false;
  /** Optional cookie/projector texture sampled with the light's view-proj. */
  projectionTexture: GPUTexture | null = null;

  /**
   * World-space position of the light, taken from the GameObject's transform.
   */
  worldPosition(): Vec3 {
    return this.gameObject.localToWorld().transformPoint(Vec3.ZERO);
  }

  /**
   * World-space forward direction of the light (GameObject local -Z, normalized).
   */
  worldDirection(): Vec3 {
    return this.gameObject.localToWorld().transformDirection(Vec3.FORWARD).normalize();
  }

  /**
   * Builds the perspective view-projection used by the spot shadow pass and projection texture sampling.
   *
   * @param near - Near plane for the perspective frustum.
   */
  lightViewProj(near = 0.1): Mat4 {
    const pos  = this.worldPosition();
    const dir  = this.worldDirection();
    const up   = Math.abs(dir.y) > 0.99 ? Vec3.RIGHT : Vec3.UP;
    const view = Mat4.lookAt(pos, pos.add(dir), up);
    const proj = Mat4.perspective(this.outerAngle * 2 * Math.PI / 180, 1.0, near, this.range);
    return proj.multiply(view);
  }
}
