import { Mat4, Vec3, Vec4 } from '../../math/index.js';
import { Component } from '../component.js';
import type { RenderContext } from '../../renderer/render_context.js';

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

  // Per-frame matrix cache — populated by `updateRender`. The getters return
  // these directly; callers must call `updateRender` (typically via the owning
  // GameObject or Scene) before reading matrices each frame.
  private _view: Mat4 | null = null;
  private _proj: Mat4 | null = null;
  private _viewProj: Mat4 | null = null;
  private _invViewProj: Mat4 | null = null;
  private _invProj: Mat4 | null = null;
  private _position: Vec3 | null = null;
  /** Sub-pixel jittered viewProj for TAA. Cleared by `updateRender`; written by
   *  `applyJitter` (usually called from TAAPass.updateCamera). When null,
   *  `jitteredViewProjectionMatrix()` falls back to the un-jittered VP. */
  private _jitteredViewProj: Mat4 | null = null;
  /** Previous frame's un-jittered viewProj. Snapshotted from `_viewProj` at the
   *  start of each `updateRender`. Null on the very first frame; consumers
   *  (TAA, SSGI) fall back to the current VP in that case. */
  private _prevViewProj: Mat4 | null = null;

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
   * Refreshes the cached view / projection / viewProj / invViewProj / position
   * from the current intrinsics and the owning GameObject's world transform,
   * and synchronizes {@link aspect} to the canvas size on `ctx`. Called once
   * per frame by the GameObject / Scene render traversal *after* simulation
   * and input have finalized the transform.
   *
   * The {@link viewMatrix} / {@link projectionMatrix} / {@link viewProjectionMatrix} /
   * {@link inverseViewProjectionMatrix} / {@link position} getters return the
   * values cached here; they assume `updateRender` has run this frame.
   */
  updateRender(ctx: RenderContext): void {
    this.aspect = ctx.width / ctx.height;
    // Snapshot last frame's un-jittered VP for temporal consumers (TAA, SSGI)
    // before we overwrite `_viewProj`. Null on the first frame.
    this._prevViewProj = this._viewProj;
    const world = this.gameObject.localToWorld();
    this._position = new Vec3(world.data[12], world.data[13], world.data[14]);
    this._view = world.invert();
    this._proj = this._computeProjection();
    this._invProj = this._proj.invert();
    this._viewProj = this._proj.multiply(this._view);
    this._invViewProj = this._viewProj.invert();
    // Jitter is per-frame; clear it so passes that don't run TAA see the
    // un-jittered VP via jitteredViewProjectionMatrix() as well.
    this._jitteredViewProj = null;
  }

  /**
   * Records a sub-pixel jittered view-projection for this frame. Typically
   * called from TAAPass.update(); geometry-fill passes then read the result
   * via {@link jitteredViewProjectionMatrix}.
   *
   * @param jx - NDC x offset (typically ±1/width).
   * @param jy - NDC y offset (typically ±1/height).
   */
  applyJitter(jx: number, jy: number): void {
    const vp = this._viewProj ?? this._computeProjection().multiply(this.viewMatrix());
    const m = vp.clone();
    for (let c = 0; c < 4; c++) {
      m.data[c * 4 + 0] += jx * m.data[c * 4 + 3];
      m.data[c * 4 + 1] += jy * m.data[c * 4 + 3];
    }
    this._jitteredViewProj = m;
  }

  private _computeProjection(): Mat4 {
    if (this.projectionType === CameraProjection.Perspective) {
      return Mat4.perspective(this.fov, this.aspect, this.near, this.far);
    }
    const halfSize = this.orthoSize * 0.5;
    return Mat4.orthographic(-halfSize * this.aspect, halfSize * this.aspect, -halfSize, halfSize, this.near, this.far);
  }

  /**
   * Cached projection matrix, populated by {@link updateRender}.
   * Falls back to fresh computation when called before any `updateRender`
   * (e.g. from unit tests with no render context). Render-pass-heavy callers
   * should always call `updateRender` first to avoid the cold-path work.
   */
  projectionMatrix(): Mat4 {
    return this._proj ?? this._computeProjection();
  }

  /** Cached world-to-view matrix (see {@link projectionMatrix} re: cold path). */
  viewMatrix(): Mat4 {
    return this._view ?? this.gameObject.localToWorld().invert();
  }

  /** Cached projection × view matrix (see {@link projectionMatrix} re: cold path). */
  viewProjectionMatrix(): Mat4 {
    return this._viewProj ?? this._computeProjection().multiply(this.viewMatrix());
  }

  /** Cached inverse of {@link viewProjectionMatrix} (see {@link projectionMatrix} re: cold path). */
  inverseViewProjectionMatrix(): Mat4 {
    return this._invViewProj ?? this.viewProjectionMatrix().invert();
  }

  /** Cached inverse projection matrix (camera-space ↔ NDC). */
  inverseProjectionMatrix(): Mat4 {
    return this._invProj ?? this._computeProjection().invert();
  }

  /**
   * Returns the TAA-jittered viewProj if {@link applyJitter} ran this frame,
   * otherwise falls back to the un-jittered {@link viewProjectionMatrix}.
   * Geometry-fill passes use this for vertex transforms so TAA has sub-pixel
   * motion to converge.
   */
  jitteredViewProjectionMatrix(): Mat4 {
    return this._jitteredViewProj ?? this.viewProjectionMatrix();
  }

  /**
   * Previous frame's un-jittered view-projection, as snapshotted by the most
   * recent {@link updateRender}. Used by TAA / SSGI to reproject the prior
   * frame into the current one. Falls back to {@link viewProjectionMatrix} on
   * the very first frame so reprojection sees no apparent motion (no ghosting).
   */
  previousViewProjectionMatrix(): Mat4 {
    return this._prevViewProj ?? this.viewProjectionMatrix();
  }

  /** Cached world-space camera origin (see {@link projectionMatrix} re: cold path). */
  position(): Vec3 {
    if (this._position) return this._position;
    const t = this.gameObject.localToWorld();
    return new Vec3(t.data[12], t.data[13], t.data[14]);
  }

  /**
   * Returns the 8 corners of the view frustum in world space.
   *
   * Computed fresh each call (does not read the cached viewProj) because cascade
   * fitting temporarily mutates `near`/`far` and expects the result to reflect
   * those mutations, not the per-frame cached values.
   */
  frustumCornersWorld(): Vec3[] {
    const view = this.gameObject.localToWorld().invert();
    const invVP = this._computeProjection().multiply(view).invert();
    const ndcCorners: [number, number, number][] = [
      [-1,-1, 0],[1,-1, 0],[-1, 1, 0],[1, 1, 0],
      [-1,-1, 1],[1,-1, 1],[-1, 1, 1],[1, 1, 1],
    ];
    return ndcCorners.map(([x, y, z]) => invVP.transformPoint(new Vec3(x, y, z)));
  }
}
