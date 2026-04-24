import { Mat4, Vec3 } from '../../math/index.js';
import { Component } from '../component.js';

export class Camera extends Component {
  fov: number;
  near: number;
  far: number;
  aspect: number;

  constructor(fovDeg = 60, near = 0.1, far = 1000, aspect = 16 / 9) {
    super();
    this.fov = fovDeg * (Math.PI / 180);
    this.near = near;
    this.far = far;
    this.aspect = aspect;
  }

  projectionMatrix(): Mat4 {
    return Mat4.perspective(this.fov, this.aspect, this.near, this.far);
  }

  viewMatrix(): Mat4 {
    return this.gameObject.localToWorld().invert();
  }

  viewProjectionMatrix(): Mat4 {
    return this.projectionMatrix().multiply(this.viewMatrix());
  }

  position(): Vec3 {
    const t = this.gameObject.localToWorld();
    return new Vec3(t.data[12], t.data[13], t.data[14]);
  }

  // Returns the 8 corners of the view frustum in world space
  frustumCornersWorld(): Vec3[] {
    const invVP = this.viewProjectionMatrix().invert();
    const ndcCorners: [number, number, number][] = [
      [-1,-1, 0],[1,-1, 0],[-1, 1, 0],[1, 1, 0],
      [-1,-1, 1],[1,-1, 1],[-1, 1, 1],[1, 1, 1],
    ];
    return ndcCorners.map(([x, y, z]) => invVP.transformPoint(new Vec3(x, y, z)));
  }
}
