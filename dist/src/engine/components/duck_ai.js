import { Vec3 } from '../../math/index.js';
import { Quaternion } from '../../math/quaternion.js';
import { Component } from '../component.js';
import { BlockType } from '../../block/block_type.js';
const _Y_AXIS = new Vec3(0, 1, 0);
/**
 * Simple wandering NPC behaviour for duck GameObjects.
 *
 * Implements a three-state machine (idle → wander → flee) plus gravity,
 * water-surface flotation against the {@link World}, head-bob animation on a
 * 'Duck.Head' child GameObject, and yaw rotation based on movement direction.
 * The owning GameObject's mesh is drawn through a {@link MeshRenderer}; this
 * component only drives the transform, not rendering.
 */
export class DuckAI extends Component {
    /** Player world position, written once per frame by the host so ducks can flee. */
    static playerPos = new Vec3(0, 0, 0);
    _world;
    _state = 'idle';
    _timer = 0;
    _targetX = 0;
    _targetZ = 0;
    _hasTarget = false;
    _velY = 0;
    _yaw = 0;
    // child GameObjects by name so we can animate the head bob
    _headGO = null;
    _headBaseY = 0;
    _bobPhase;
    /**
     * @param world - World used for ground/water sampling.
     */
    constructor(world) {
        super();
        this._world = world;
        this._timer = 1 + Math.random() * 4;
        this._yaw = Math.random() * Math.PI * 2;
        this._bobPhase = Math.random() * Math.PI * 2;
    }
    /**
     * Caches a reference to the 'Duck.Head' child GameObject for head-bob animation.
     */
    onAttach() {
        for (const child of this.gameObject.children) {
            if (child.name === 'Duck.Head') {
                this._headGO = child;
                this._headBaseY = child.position.y;
                break;
            }
        }
    }
    /**
     * Steps the AI: applies gravity/water collision, advances the state machine,
     * updates yaw to face movement, and animates the head bob.
     *
     * @param dt - Frame delta time in seconds.
     */
    update(dt) {
        const go = this.gameObject;
        const gx = go.position.x;
        const gz = go.position.z;
        // ── Player distance ──────────────────────────────────────────────────────
        const player = DuckAI.playerPos;
        const dpx = player.x - gx;
        const dpz = player.z - gz;
        const playerDist2 = dpx * dpx + dpz * dpz;
        // ── Gravity / ground collision ───────────────────────────────────────────
        this._velY -= 9.8 * dt;
        go.position.y += this._velY * dt;
        const groundY = this._world.getTopBlockY(Math.floor(gx), Math.floor(gz), Math.ceil(go.position.y) + 4);
        // Check if duck is at or below ground level
        if (groundY > 0 && go.position.y <= groundY + 0.1) {
            // Check if the block below is water - ducks should float on water surface
            const blockBelow = this._world.getBlockType(Math.floor(gx), Math.floor(groundY - 1), Math.floor(gz));
            if (blockBelow === BlockType.WATER) {
                // Float on water surface (water block Y + 1, minus small offset so duck sits slightly in water)
                go.position.y = groundY; // - 1;
            }
            else {
                // Stand on solid ground
                go.position.y = groundY;
            }
            this._velY = 0;
        }
        // ── State machine ────────────────────────────────────────────────────────
        switch (this._state) {
            case 'idle': {
                this._timer -= dt;
                if (playerDist2 < 36) { // 6 block flee radius
                    this._enterFlee();
                }
                else if (this._timer <= 0) {
                    this._pickWanderTarget();
                }
                break;
            }
            case 'wander': {
                this._timer -= dt;
                if (playerDist2 < 36) {
                    this._enterFlee();
                    break;
                }
                if (!this._hasTarget || this._timer <= 0) {
                    this._enterIdle();
                    break;
                }
                const dx = this._targetX - gx;
                const dz = this._targetZ - gz;
                const dist2 = dx * dx + dz * dz;
                if (dist2 < 0.25) { // close enough (0.5 block)
                    this._enterIdle();
                    break;
                }
                const dist = Math.sqrt(dist2);
                const nx = dx / dist;
                const nz = dz / dist;
                go.position.x += nx * 1.5 * dt;
                go.position.z += nz * 1.5 * dt;
                this._yaw = Math.atan2(-nx, -nz);
                break;
            }
            case 'flee': {
                if (playerDist2 > 196) { // 14 block safe distance
                    this._enterIdle();
                    break;
                }
                const dist = Math.sqrt(playerDist2);
                const nx = dist > 0 ? -dpx / dist : 0;
                const nz = dist > 0 ? -dpz / dist : 0;
                go.position.x += nx * 4.0 * dt;
                go.position.z += nz * 4.0 * dt;
                this._yaw = Math.atan2(-nx, -nz);
                break;
            }
        }
        // ── Apply yaw rotation ───────────────────────────────────────────────────
        go.rotation = Quaternion.fromAxisAngle(_Y_AXIS, this._yaw);
        // ── Head bob (idle/wander only) ──────────────────────────────────────────
        if (this._headGO) {
            this._bobPhase += dt * (this._state === 'wander' ? 6 : 2);
            const bobAmp = this._state === 'wander' ? 0.018 : 0.008;
            this._headGO.position.y = this._headBaseY + Math.sin(this._bobPhase) * bobAmp;
        }
    }
    _enterIdle() {
        this._state = 'idle';
        this._hasTarget = false;
        this._timer = 2 + Math.random() * 5;
    }
    _enterFlee() {
        this._state = 'flee';
        this._hasTarget = false;
    }
    _pickWanderTarget() {
        const go = this.gameObject;
        const angle = Math.random() * Math.PI * 2;
        const dist = 3 + Math.random() * 8;
        this._targetX = go.position.x + Math.cos(angle) * dist;
        this._targetZ = go.position.z + Math.sin(angle) * dist;
        this._hasTarget = true;
        this._state = 'wander';
        this._timer = 6 + Math.random() * 6;
    }
}
