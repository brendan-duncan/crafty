import { Mat4, Vec3 } from '../../math/index.js';
import { Component } from '../component.js';
import type { Camera } from './camera.js';

/**
 * Per-cascade data produced by {@link DirectionalLight.computeCascadeMatrices}
 * and consumed by the cascade shadow map render passes.
 */
export interface CascadeData {
  /** Combined light projection × view matrix used both to render and sample the cascade. */
  lightViewProj : Mat4;
  /** Far plane (in view space) where this cascade ends. */
  splitFar      : number;
  /** Light-space Z depth (maxZ − minZ after padding). */
  depthRange    : number;
  /** World-space size of one shadow-map texel (2 × radius / mapSize). */
  texelWorldSize: number;
}

/**
 * Directional light component representing the sun.
 *
 * Provides direction/colour/intensity for the deferred lighting pass and
 * computes cascade shadow-map matrices for the cascade shadow render pass.
 * Only one DirectionalLight is typically active per scene (selected via
 * {@link Scene.findDirectionalLight}).
 */
export class DirectionalLight extends Component {
  /** Light direction in world space (normalised on construction). */
  direction: Vec3;
  /** Linear RGB colour multiplier. */
  color: Vec3;
  /** Scalar intensity multiplier applied to colour. */
  intensity: number;
  /** Number of cascade splits used for shadow mapping. */
  numCascades: number;

  /**
   * @param direction - World-space light direction (will be normalised).
   * @param color - Linear RGB colour.
   * @param intensity - Scalar intensity multiplier.
   * @param numCascades - Number of shadow cascades to fit.
   */
  constructor(direction = new Vec3(0.3, -1, 0.5), color = Vec3.one(), intensity = 1, numCascades = 3) {
    super();
    this.direction = direction.normalize();
    this.color = color;
    this.intensity = intensity;
    this.numCascades = numCascades;
  }

  /**
   * Computes per-cascade view-projection matrices for fitting shadow maps to
   * the camera frustum.
   *
   * Uses sphere-fit cascades with texel-snapping to eliminate shadow swimming
   * as the camera moves or rotates.
   *
   * @param camera - Camera whose frustum is being shadowed.
   * @param shadowFar - Optional override for the shadow-receiving distance; defaults to camera.far.
   * @returns One {@link CascadeData} per cascade, in near-to-far order.
   */
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
      // Cover off-frustum casters (mountains, overhangs) with a modest pad.
      // 25% × range (capped at 64 units) keeps the depth range tight so the
      // receiver bias in the shader doesn't get scaled away.
      const zPadding = Math.min((maxZ - minZ) * 0.25, 64);
      minZ -= zPadding;
      maxZ += zPadding;

      let lightProj = Mat4.orthographic(-radius, radius, -radius, radius, -maxZ, -minZ);

      // Texel snap: project the cascade frustum center through the cascade VP,
      // round its shadow-map UV to the nearest texel, then apply the correction
      // as a clip-space translation. This anchors the shadow map to a stable
      // grid near the cascade so it doesn't crawl as the camera moves, and
      // keeps precision even when the scene is far from world origin.
      const tempVP = lightProj.multiply(lightView);
      const p = tempVP.transformPoint(center); // w=1 for ortho
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
