import { Mat4, Vec3 } from '../../math/index.js';
import { Component } from '../component.js';

export class SpotLight extends Component {
  color            : Vec3    = Vec3.one();
  intensity        : number  = 1.0;
  range            : number  = 20.0;
  innerAngle       : number  = 15;   // degrees, half-angle of full-bright cone
  outerAngle       : number  = 30;   // degrees, half-angle of fade-to-zero cone
  castShadow       : boolean = false;
  projectionTexture: GPUTexture | null = null;

  worldPosition(): Vec3 {
    return this.gameObject.localToWorld().transformPoint(Vec3.zero());
  }

  worldDirection(): Vec3 {
    return this.gameObject.localToWorld().transformDirection(new Vec3(0, 0, -1)).normalize();
  }

  lightViewProj(near = 0.1): Mat4 {
    const pos  = this.worldPosition();
    const dir  = this.worldDirection();
    const up   = Math.abs(dir.y) > 0.99 ? new Vec3(1, 0, 0) : new Vec3(0, 1, 0);
    const view = Mat4.lookAt(pos, pos.add(dir), up);
    const proj = Mat4.perspective(this.outerAngle * 2 * Math.PI / 180, 1.0, near, this.range);
    return proj.multiply(view);
  }
}
