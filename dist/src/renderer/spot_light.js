import { Mat4 } from '../math/mat4.js';
import { Vec3 } from '../math/vec3.js';
/**
 * Spot light parameters uploaded as one element of the spot-light storage buffer.
 *
 * `innerAngle`/`outerAngle` describe the cosine-falloff cone; the
 * view-projection matrix (`lightViewProj`) and a slice of the shared 2D shadow
 * array are consumed when `castShadows` is true.
 *
 * The view-projection matrix is lazily computed from `position`, `direction`,
 * `outerAngle`, and `range` via {@link computeLightViewProj}.  A dirty flag
 * avoids redundant recomputation: after mutating those fields in-place, call
 * {@link markDirty} before the next access.
 */
export class SpotLight {
    _dirty = true;
    _cachedLvp = new Mat4();
    position;
    range;
    direction;
    innerAngle;
    color;
    outerAngle;
    intensity;
    castShadows;
    shadowMap;
    /**
     * The perspective view-projection derived from the light's position,
     * direction, outerAngle, and range.  Lazily recomputed on first access
     * after construction or after {@link markDirty} is called.
     */
    get lightViewProj() {
        if (this._dirty) {
            this._compute();
        }
        return this._cachedLvp;
    }
    constructor(init) {
        this.position = init.position;
        this.range = init.range;
        this.direction = init.direction;
        this.innerAngle = init.innerAngle;
        this.color = init.color;
        this.outerAngle = init.outerAngle;
        this.intensity = init.intensity;
        this.castShadows = init.castShadows;
        this.shadowMap = init.shadowMap;
    }
    /**
     * Marks the cached view-projection as stale.  Call after mutating
     * `position`, `direction`, `outerAngle`, or `range` in-place.
     */
    markDirty() {
        this._dirty = true;
    }
    /**
     * Returns the cached view-projection matrix, recomputing it lazily only
     * when marked dirty.  Safe to call every frame — the matrix is recalculated
     * at most once between {@link markDirty} calls.
     *
     * @param near - Near plane for the perspective frustum (default 0.1).
     */
    computeLightViewProj(near = 0.1) {
        if (this._dirty) {
            this._compute(near);
        }
        return this._cachedLvp;
    }
    _compute(near = 0.1) {
        const up = Math.abs(this.direction.y) > 0.99
            ? new Vec3(1, 0, 0)
            : new Vec3(0, 1, 0);
        const view = Mat4.lookAt(this.position, this.position.add(this.direction), up);
        const proj = Mat4.perspective(this.outerAngle * 2 * Math.PI / 180, 1.0, near, this.range);
        this._cachedLvp = proj.multiply(view);
        this._dirty = false;
    }
}
