import { Mat4, Vec3 } from '../../math/index.js';
import { Component } from '../component.js';
import type { Camera } from './camera.js';

export interface CascadeData {
  lightViewProj : Mat4;
  splitFar      : number;
  depthRange    : number;  // light-space Z depth (maxZ - minZ after padding)
  texelWorldSize: number;  // world-space size of one shadow-map texel (2*radius/mapSize)
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

  computeCascadeMatrices(camera: Camera, shadowFar?: number): CascadeData[] {
    const far = shadowFar ?? camera.far;
    const splits = this._computeSplitDepths(camera.near, far, this.numCascades);
    const cascades: CascadeData[] = [];

    for (let i = 0; i < this.numCascades; i++) {
      const nearSplit = i === 0 ? camera.near : splits[i - 1];
      const farSplit = splits[i];

      const corners = this._frustumCornersForSplit(camera, nearSplit, farSplit);
      const center = corners.reduce((a, b) => a.add(b), Vec3.zero()).scale(1 / 8);

      const lightDir = this.direction.normalize();
      const lightView = Mat4.lookAt(center.sub(lightDir), center, new Vec3(0, 1, 0));

      // Sphere-fit: the bounding sphere radius is constant regardless of camera
      // rotation, so the cascade frustum size never changes → no shadow swimming.
      const shadowMapSize = 2048;
      let radius = 0;
      for (const c of corners) {
        radius = Math.max(radius, c.sub(center).length());
      }
      // Round radius up to a texel boundary to eliminate sub-texel drift on resize.
      let texelWorldSize = (2 * radius) / shadowMapSize;
      radius = Math.ceil(radius / texelWorldSize) * texelWorldSize;
      // Expand by 2 texels so sampling at the cascade edge never wraps to the other side.
      radius *= shadowMapSize / (shadowMapSize - 2);
      texelWorldSize = (2 * radius) / shadowMapSize;

      // Z range still comes from the actual corners, plus padding for off-frustum casters.
      let minZ = Infinity, maxZ = -Infinity;
      for (const c of corners) {
        const lc = lightView.transformPoint(c);
        minZ = Math.min(minZ, lc.z); maxZ = Math.max(maxZ, lc.z);
      }
      // 2× covers off-frustum casters (mountains, overhangs).
      // A horizontal sun can push the frustum corners far in light Z, so
      // we also cap padding at 256 to avoid inflating the depth range for nothing.
      const zPadding = Math.min((maxZ - minZ) * 2.0, 256);
      minZ -= zPadding;
      maxZ += zPadding;

      let lightProj = Mat4.orthographic(-radius, radius, -radius, radius, -maxZ, -minZ);

      // Texel snap: project a fixed world-space reference point (origin) through
      // the cascade VP, round its shadow-map UV to the nearest texel, then apply
      // the correction as a clip-space translation. This anchors the shadow map
      // to the world grid so it doesn't crawl as the camera moves.
      const tempVP = lightProj.multiply(lightView);
      const p = tempVP.transformPoint(Vec3.zero()); // w=1 for ortho
      // Match cascade_coords WGSL: shadowUV.y = 0.5 - ndcY*0.5
      const su = p.x * 0.5 + 0.5;
      const sv = 0.5 - p.y * 0.5;
      const snapSu = Math.round(su * shadowMapSize) / shadowMapSize;
      const snapSv = Math.round(sv * shadowMapSize) / shadowMapSize;
      // Convert UV delta back to NDC delta (note Y sign reversal from the flip)
      const dndcX =  (snapSu - su) * 2;
      const dndcY = -(snapSv - sv) * 2;
      lightProj.set(3, 0, lightProj.get(3, 0) + dndcX);
      lightProj.set(3, 1, lightProj.get(3, 1) + dndcY);

      cascades.push({ lightViewProj: lightProj.multiply(lightView), splitFar: farSplit, depthRange: maxZ - minZ, texelWorldSize });
    }

    return cascades;
  }

  private _computeSplitDepths(near: number, far: number, count: number): number[] {
    const lambda = 0.75;
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
