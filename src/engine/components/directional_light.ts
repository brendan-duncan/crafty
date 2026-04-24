import { Mat4, Vec3 } from '../../math/index.js';
import { Component } from '../component.js';
import type { Camera } from './camera.js';

export interface CascadeData {
  lightViewProj: Mat4;
  splitFar: number;
}

export class DirectionalLight extends Component {
  direction: Vec3;
  color: Vec3;
  intensity: number;
  numCascades: number;

  constructor(direction = new Vec3(0.3, -1, 0.5), color = Vec3.one(), intensity = 1, numCascades = 3) {
    super();
    this.direction = direction.normalize();
    this.color = color;
    this.intensity = intensity;
    this.numCascades = numCascades;
  }

  computeCascadeMatrices(camera: Camera): CascadeData[] {
    const splits = this._computeSplitDepths(camera.near, camera.far, this.numCascades);
    const cascades: CascadeData[] = [];

    for (let i = 0; i < this.numCascades; i++) {
      const nearSplit = i === 0 ? camera.near : splits[i - 1];
      const farSplit = splits[i];

      const corners = this._frustumCornersForSplit(camera, nearSplit, farSplit);
      const center = corners.reduce((a, b) => a.add(b), Vec3.zero()).scale(1 / 8);

      const lightDir = this.direction.normalize();
      const lightView = Mat4.lookAt(center.sub(lightDir), center, new Vec3(0, 1, 0));

      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;

      for (const c of corners) {
        const lc = lightView.transformPoint(c);
        minX = Math.min(minX, lc.x); maxX = Math.max(maxX, lc.x);
        minY = Math.min(minY, lc.y); maxY = Math.max(maxY, lc.y);
        minZ = Math.min(minZ, lc.z); maxZ = Math.max(maxZ, lc.z);
      }

      // Extend z range symmetrically to capture shadow casters outside the frustum.
      // minZ is the far end (most negative), maxZ is the near end (least negative).
      // We extend both: push minZ further negative (cover distant casters) and
      // push maxZ toward positive (cover casters behind the light camera, e.g. sky objects).
      const zPadding = (maxZ - minZ) * 4.0;
      minZ -= zPadding;
      maxZ += zPadding;

      const lightProj = Mat4.orthographic(minX, maxX, minY, maxY, -maxZ, -minZ);
      cascades.push({ lightViewProj: lightProj.multiply(lightView), splitFar: farSplit });
    }

    return cascades;
  }

  private _computeSplitDepths(near: number, far: number, count: number): number[] {
    const lambda = 0.95;
    const splits: number[] = [];
    for (let i = 1; i <= count; i++) {
      const uniform = near + (far - near) * (i / count);
      const log = near * Math.pow(far / near, i / count);
      splits.push(lambda * log + (1 - lambda) * uniform);
    }
    return splits;
  }

  private _frustumCornersForSplit(camera: Camera, near: number, far: number): Vec3[] {
    const savedNear = camera.near;
    const savedFar = camera.far;
    camera.near = near;
    camera.far = far;
    const corners = camera.frustumCornersWorld();
    camera.near = savedNear;
    camera.far = savedFar;
    return corners;
  }
}
