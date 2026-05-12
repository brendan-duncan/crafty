import { Mat4, Vec3 } from '../../math/index.js';
import { Component } from '../component.js';
// Cube-face directions and ups (order: +X,-X,+Y,-Y,+Z,-Z). Module-level to avoid per-call allocation.
const FACE_DIRS = [
    new Vec3(1, 0, 0), new Vec3(-1, 0, 0),
    new Vec3(0, 1, 0), new Vec3(0, -1, 0),
    new Vec3(0, 0, 1), new Vec3(0, 0, -1),
];
const FACE_UPS = [
    new Vec3(0, -1, 0), new Vec3(0, -1, 0),
    new Vec3(0, 0, 1), new Vec3(0, 0, -1),
    new Vec3(0, -1, 0), new Vec3(0, -1, 0),
];
/**
 * Omnidirectional point light component.
 *
 * Supplies position/color/intensity/radius to the deferred lighting pass,
 * and (when {@link PointLight.castShadow} is enabled) cube-face view-projection
 * matrices to the point-light shadow pass that renders into a cube shadow map.
 */
export class PointLight extends Component {
    /** Linear RGB color multiplier. */
    color = Vec3.one();
    /** Scalar intensity multiplier. */
    intensity = 1.0;
    /** Attenuation radius in world units; light contributes nothing past this distance. */
    radius = 10.0;
    /** Whether this light renders shadow maps. */
    castShadow = false;
    /**
     * World-space position of the light, taken from the GameObject's transform.
     */
    worldPosition() {
        return this.gameObject.localToWorld().transformPoint(Vec3.ZERO);
    }
    /**
     * Builds the six view-projection matrices used to render this light's cube shadow map.
     *
     * @param near - Near plane for each cube-face perspective frustum.
     * @returns 6 matrices in face order: +X, -X, +Y, -Y, +Z, -Z.
     */
    cubeFaceViewProjs(near = 0.05) {
        const pos = this.worldPosition();
        const proj = Mat4.perspective(Math.PI / 2, 1.0, near, this.radius);
        const result = new Array(6);
        for (let i = 0; i < 6; i++) {
            result[i] = proj.multiply(Mat4.lookAt(pos, pos.add(FACE_DIRS[i]), FACE_UPS[i]));
        }
        return result;
    }
}
