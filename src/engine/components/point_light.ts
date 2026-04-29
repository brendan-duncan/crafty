import { Mat4, Vec3 } from '../../math/index.js';
import { Component } from '../component.js';

// Cube-face directions and ups (order: +X,-X,+Y,-Y,+Z,-Z). Module-level to avoid per-call allocation.
const FACE_DIRS: readonly Vec3[] = [
  new Vec3( 1,  0,  0), new Vec3(-1,  0,  0),
  new Vec3( 0,  1,  0), new Vec3( 0, -1,  0),
  new Vec3( 0,  0,  1), new Vec3( 0,  0, -1),
];
const FACE_UPS: readonly Vec3[] = [
  new Vec3(0, -1,  0), new Vec3(0, -1,  0),
  new Vec3(0,  0,  1), new Vec3(0,  0, -1),
  new Vec3(0, -1,  0), new Vec3(0, -1,  0),
];

export class PointLight extends Component {
  color     : Vec3    = Vec3.one();
  intensity : number  = 1.0;
  radius    : number  = 10.0;
  castShadow: boolean = false;

  worldPosition(): Vec3 {
    return this.gameObject.localToWorld().transformPoint(Vec3.zero());
  }

  // Perspective matrices for each cube face (order: +X,-X,+Y,-Y,+Z,-Z)
  cubeFaceViewProjs(near = 0.05): Mat4[] {
    const pos  = this.worldPosition();
    const proj = Mat4.perspective(Math.PI / 2, 1.0, near, this.radius);
    const result: Mat4[] = new Array(6);
    for (let i = 0; i < 6; i++) {
      result[i] = proj.multiply(Mat4.lookAt(pos, pos.add(FACE_DIRS[i]), FACE_UPS[i]));
    }
    return result;
  }
}
