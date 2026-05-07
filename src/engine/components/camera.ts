import { Mat4, Vec3 } from '../../math/index.js';
import { Component } from '../component.js';

/**
 * Perspective camera component. Drives view/projection matrices used by every
 * render pass that needs the main view (geometry, shadows, post).
 *
 * The camera's world transform comes from its owning GameObject; this component
 * only stores intrinsics (FOV, near/far, aspect) and exposes derived matrices.
 */
export class Camera extends Component {
  /** Vertical field of view in radians. */
  fov: number;
  /** Near clip plane distance. */
  near: number;
  /** Far clip plane distance. */
  far: number;
  /** Width / height aspect ratio. */
  aspect: number;

  /**
   * @param fovDeg - Vertical field of view in degrees (converted to radians internally).
   * @param near - Near clip plane distance.
   * @param far - Far clip plane distance.
   * @param aspect - Width / height aspect ratio.
   */
  constructor(fovDeg = 60, near = 0.1, far = 1000, aspect = 16 / 9) {
    super();
    this.fov = fovDeg * (Math.PI / 180);
    this.near = near;
    this.far = far;
    this.aspect = aspect;
  }

  /**
   * Builds the perspective projection matrix from the current intrinsics.
   */
  projectionMatrix(): Mat4 {
    return Mat4.perspective(this.fov, this.aspect, this.near, this.far);
  }

  /**
   * Returns the world-to-view matrix (inverse of the GameObject's world transform).
   */
  viewMatrix(): Mat4 {
    return this.gameObject.localToWorld().invert();
  }

  /**
   * Returns the combined projection × view matrix.
   */
  viewProjectionMatrix(): Mat4 {
    return this.projectionMatrix().multiply(this.viewMatrix());
  }

  /**
   * World-space position of the camera origin, extracted from its transform.
   */
  position(): Vec3 {
    const t = this.gameObject.localToWorld();
    return new Vec3(t.data[12], t.data[13], t.data[14]);
  }

  /**
   * Returns the 8 corners of the view frustum in world space.
   *
   * Used by directional-light cascade fitting to compute per-cascade bounds.
   */
  frustumCornersWorld(): Vec3[] {
    const invVP = this.viewProjectionMatrix().invert();
    const ndcCorners: [number, number, number][] = [
      [-1,-1, 0],[1,-1, 0],[-1, 1, 0],[1, 1, 0],
      [-1,-1, 1],[1,-1, 1],[-1, 1, 1],[1, 1, 1],
    ];
    return ndcCorners.map(([x, y, z]) => invVP.transformPoint(new Vec3(x, y, z)));
  }
}
