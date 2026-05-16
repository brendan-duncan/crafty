import { Mat4, Vec3, Vec4 } from '../../math/index.js';
import { Component } from '../component.js';

export enum CameraClearFlags {
  /** Clear color, depth, and stencil. */
  All,
  /** Clear depth and stencil, but not color. */
  DepthOnly,
  /** Don't clear anything. */
  None,
}

export enum CameraProjection {
  Perspective,
  Orthographic,
}

/**
 * Camera component. Drives view/projection matrices used by every
 * render pass that needs the main view (geometry, shadows, post).
 *
 * The camera's world transform comes from its owning GameObject; this component
 * only stores intrinsics (FOV, near/far, aspect) and exposes derived matrices.
 */
export class Camera extends Component {
  /** Projection type of the camera. */
  projectionType: CameraProjection = CameraProjection.Perspective;
  /** Vertical field of view in radians. */
  fov: number = 60 * (Math.PI / 180);
  /** Orthographic size (height) for orthographic projection. */
  orthoSize: number = 10;
  /** Near clip plane distance. */
  near: number;
  /** Far clip plane distance. */
  far: number;
  /** Width / height aspect ratio. */
  aspect: number;
  /** Clear flags for the camera. */
  clearFlags: CameraClearFlags = CameraClearFlags.All;
  /** Clear color for the camera. */
  clearColor: Vec4 = new Vec4(0.0, 0.0, 0.0, 1);
  /** Clear depth value for the camera. */
  clearDepth = 1;
  /** Clear stencil value for the camera. */
  clearStencil = 0;
  /** Viewport rectangle in normalized [0-1] coordinates. */
  viewport = { x: 0, y: 0, width: 1, height: 1 };

  /**
   * @param fovDeg - Vertical field of view in degrees (converted to radians internally).
   * @param near - Near clip plane distance.
   * @param far - Far clip plane distance.
   * @param aspect - Width / height aspect ratio.
   */
  constructor(near = 0.1, far = 1000, aspect = 16 / 9) {
    super();
    this.near = near;
    this.far = far;
    this.aspect = aspect;
  }

  static createPerspective(fovDeg = 60, near = 0.1, far = 1000, aspect = 16 / 9): Camera {
    const cam = new Camera(near, far, aspect);
    cam.projectionType = CameraProjection.Perspective;
    cam.fov = fovDeg * (Math.PI / 180);
    return cam;
  }
  
  static createOrthographic(orthoSize = 10, near = 0.1, far = 1000, aspect = 16 / 9): Camera {
    const cam = new Camera(near, far, aspect);
    cam.projectionType = CameraProjection.Orthographic;
    cam.orthoSize = orthoSize;
    return cam;
  }

  /**
   * Builds the projection matrix from the current intrinsics.
   */
  projectionMatrix(): Mat4 {
    if (this.projectionType === CameraProjection.Perspective) {
      return Mat4.perspective(this.fov, this.aspect, this.near, this.far);
    } else {
      const halfSize = this.orthoSize * 0.5;
      return Mat4.orthographic(-halfSize * this.aspect, halfSize * this.aspect, -halfSize, halfSize, this.near, this.far);
    }
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
