import { Mat4, Vec3 } from '../../math/index.js';
import { Component } from '../component.js';
/**
 * Cone-restricted spot light component.
 *
 * Supplies the deferred lighting pass with a directional cone (range,
 * inner/outer angles, optional projected texture) and, when shadowing is
 * enabled, a single perspective view-projection consumed by the spot-light
 * shadow pass.
 */
export class SpotLight extends Component {
    /** Linear RGB colour multiplier. */
    color = Vec3.one();
    /** Scalar intensity multiplier. */
    intensity = 1.0;
    /** Maximum range in world units. */
    range = 20.0;
    /** Half-angle of the full-bright cone, in degrees. */
    innerAngle = 15;
    /** Half-angle of the fade-to-zero cone, in degrees. */
    outerAngle = 30;
    /** Whether this light renders a shadow map. */
    castShadow = false;
    /** Optional cookie/projector texture sampled with the light's view-proj. */
    projectionTexture = null;
    /**
     * World-space position of the light, taken from the GameObject's transform.
     */
    worldPosition() {
        return this.gameObject.localToWorld().transformPoint(Vec3.zero());
    }
    /**
     * World-space forward direction of the light (GameObject local -Z, normalised).
     */
    worldDirection() {
        return this.gameObject.localToWorld().transformDirection(new Vec3(0, 0, -1)).normalize();
    }
    /**
     * Builds the perspective view-projection used by the spot shadow pass and projection texture sampling.
     *
     * @param near - Near plane for the perspective frustum.
     */
    lightViewProj(near = 0.1) {
        const pos = this.worldPosition();
        const dir = this.worldDirection();
        const up = Math.abs(dir.y) > 0.99 ? new Vec3(1, 0, 0) : new Vec3(0, 1, 0);
        const view = Mat4.lookAt(pos, pos.add(dir), up);
        const proj = Mat4.perspective(this.outerAngle * 2 * Math.PI / 180, 1.0, near, this.range);
        return proj.multiply(view);
    }
}
