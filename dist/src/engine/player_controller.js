import { Quaternion, Vec3 } from '../math/index.js';
import { BlockType, isBlockWater, isBlockProp } from '../block/block_type.js';
import { blockTypeToSurface } from './audio_surface.js';
const AXIS_Y = new Vec3(0, 1, 0);
const AXIS_X = new Vec3(1, 0, 0);
const GRAVITY = -28.0; // blocks/s²
const WATER_GRAVITY = -4.0; // blocks/s² while submerged
const SNEAK_SPEED = 1.3; // blocks/s (ShiftLeft)
const WALK_SPEED = 4.3; // blocks/s
const SPRINT_SPEED = 7.0; // blocks/s (ControlLeft)
const JUMP_VEL = 11.5; // blocks/s  (peak ≈ 2.36 blocks, clears 1-block walls)
const AUTO_JUMP_VEL = 8.0; // blocks/s  (peak ≈ 1.14 blocks, just clears 1-block steps)
const SWIM_VEL = 3.5; // blocks/s upward when Space pressed in water
const HALF_W = 0.3; // player AABB half-width/depth
const HEIGHT = 1.8; // player AABB height
const EYE_HEIGHT = 1.62; // camera above feet
/**
 * First-person Minecraft-style player controller.
 *
 * Handles WASD movement, mouse-look (with pointer lock), jumping with coyote
 * time, sprint/sneak speed modifiers, and AABB-vs-blocks collision against
 * the {@link World}. Includes water detection so the player swims (Space rises,
 * reduced gravity) when chest-deep in a water block. Call {@link PlayerController.attach}
 * once with a canvas, then {@link PlayerController.update} with the eye GameObject
 * each frame.
 */
export class PlayerController {
    /** Yaw in radians, rotation around world Y. */
    yaw;
    /** Pitch in radians, rotation around local X (clamped to ±89°). */
    pitch;
    /** Mouse sensitivity in radians per pixel. */
    sensitivity = 0.002;
    /** Analog forward input in [-1, 1] (touch joystick / programmatic). Added to keyboard input. */
    inputForward = 0;
    /** Analog strafe input in [-1, 1] (positive = right). Added to keyboard input. */
    inputStrafe = 0;
    /** Held-jump flag from touch / programmatic input (OR-ed with Space). */
    inputJump = false;
    /** Held-sneak flag (OR-ed with ShiftLeft). */
    inputSneak = false;
    /** Held-sprint flag (OR-ed with ControlLeft / AltLeft). */
    inputSprint = false;
    /**
     * When true, the controller automatically jumps when walking into a
     * 1-block-high obstacle that has air above it (mobile auto-step).
     */
    autoJump = true;
    /**
     * Called when the player takes a footstep while on the ground.
     * `surface` is the block type underfoot mapped to an audio surface group.
     */
    onStep;
    /**
     * Called when the player lands after falling (transition from airborne to
     * grounded). `fallSpeed` is the downward velocity magnitude before landing.
     */
    onLand;
    _velY = 0;
    _stepDistance = 0;
    /** Sets vertical velocity (used to inject jumps/launches from external code). */
    set velY(v) { this._velY = v; }
    _onGround = false;
    _prevInWater = false;
    _coyoteFrames = 0;
    _keys = new Set();
    _canvas = null;
    _world;
    _onMouseMove;
    _onKeyDown;
    _onKeyUp;
    _onClick;
    _onBlur;
    /**
     * @param world - World used for collision and water sampling.
     * @param yaw - Initial yaw in radians.
     * @param pitch - Initial pitch in radians.
     */
    constructor(world, yaw = Math.PI, pitch = 0.1) {
        this._world = world;
        this.yaw = yaw;
        this.pitch = pitch;
        const HALF_PI = Math.PI / 2 - 0.001;
        this._onMouseMove = (e) => {
            if (document.pointerLockElement !== this._canvas) {
                return;
            }
            this.yaw -= e.movementX * this.sensitivity;
            this.pitch = Math.max(-HALF_PI, Math.min(HALF_PI, this.pitch + e.movementY * this.sensitivity));
        };
        this._onKeyDown = (e) => this._keys.add(e.code);
        this._onKeyUp = (e) => this._keys.delete(e.code);
        this._onClick = () => {
            // Pointer lock is meaningless on touch devices and conflicts with the
            // touch event loop, so skip it there.
            if (this.usePointerLock) {
                this._canvas?.requestPointerLock();
            }
        };
        this._onBlur = () => this._keys.clear();
    }
    /** Set false to suppress pointer-lock acquisition on canvas click (touch devices). */
    usePointerLock = true;
    /**
     * Registers DOM event listeners on the supplied canvas and document.
     *
     * @param canvas - Canvas element that receives click-to-lock and feeds pointer lock.
     */
    attach(canvas) {
        this._canvas = canvas;
        canvas.addEventListener('click', this._onClick);
        document.addEventListener('mousemove', this._onMouseMove);
        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup', this._onKeyUp);
        window.addEventListener('blur', this._onBlur);
    }
    /**
     * Adds the given delta to yaw and pitch (with the same sensitivity scaling
     * as mouse movement). Used by touch-drag look handlers and similar
     * programmatic camera input.
     *
     * @param dx - Horizontal movement in pixels (positive = right).
     * @param dy - Vertical movement in pixels (positive = down).
     */
    applyLookDelta(dx, dy) {
        const HALF_PI = Math.PI / 2 - 0.001;
        this.yaw -= dx * this.sensitivity;
        this.pitch = Math.max(-HALF_PI, Math.min(HALF_PI, this.pitch + dy * this.sensitivity));
    }
    /**
     * Removes all DOM event listeners and clears the canvas reference.
     */
    detach() {
        if (!this._canvas) {
            return;
        }
        this._canvas.removeEventListener('click', this._onClick);
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('keyup', this._onKeyUp);
        window.removeEventListener('blur', this._onBlur);
        this._canvas = null;
    }
    /**
     * Steps the controller: applies input, gravity/swim, and per-axis collision.
     *
     * eyeGO.position is treated as the camera/eye world position; feet are at
     * eye − (0, EYE_HEIGHT, 0). dt is clamped to 50 ms to keep the integrator stable.
     *
     * @param eyeGO - GameObject whose transform represents the player's eye.
     * @param dt - Frame delta time in seconds.
     */
    update(eyeGO, dt) {
        dt = Math.min(dt, 0.05);
        // Orientation: yaw around world-Y, pitch around local-X.
        eyeGO.rotation = Quaternion.fromAxisAngle(AXIS_Y, this.yaw)
            .multiply(Quaternion.fromAxisAngle(AXIS_X, -this.pitch));
        // Horizontal movement direction from WASD + analog (touch joystick) input.
        const sinY = Math.sin(this.yaw);
        const cosY = Math.cos(this.yaw);
        const sprinting = this._keys.has('ControlLeft') || this._keys.has('AltLeft') || this.inputSprint;
        const sneaking = this._keys.has('ShiftLeft') || this.inputSneak;
        const speed = sprinting ? SPRINT_SPEED : sneaking ? SNEAK_SPEED : WALK_SPEED;
        let mx = 0, mz = 0;
        if (this._keys.has('KeyW') || this._keys.has('ArrowUp')) {
            mx -= sinY;
            mz -= cosY;
        }
        if (this._keys.has('KeyS') || this._keys.has('ArrowDown')) {
            mx += sinY;
            mz += cosY;
        }
        if (this._keys.has('KeyA') || this._keys.has('ArrowLeft')) {
            mx -= cosY;
            mz += sinY;
        }
        if (this._keys.has('KeyD') || this._keys.has('ArrowRight')) {
            mx += cosY;
            mz -= sinY;
        }
        // Analog: forward (+inputForward = forward, -inputForward = back), strafe right (+inputStrafe).
        if (this.inputForward !== 0) {
            mx -= sinY * this.inputForward;
            mz -= cosY * this.inputForward;
        }
        if (this.inputStrafe !== 0) {
            mx += cosY * this.inputStrafe;
            mz -= sinY * this.inputStrafe;
        }
        const hLen = Math.sqrt(mx * mx + mz * mz);
        if (hLen > 0) {
            // Cap analog magnitude to 1 (joystick should normalise) but allow keys to fall back to
            // unit length naturally — use 1/max(hLen, 1) so unit-length keyboard input stays full speed.
            const norm = 1 / Math.max(hLen, 1);
            mx = mx * norm * speed;
            mz = mz * norm * speed;
        }
        // Feet position derived from eye (needed for water check before physics).
        let fx = eyeGO.position.x;
        let fy = eyeGO.position.y - EYE_HEIGHT;
        let fz = eyeGO.position.z;
        // Water: check the block at chest height (below eye, above feet).
        const inWater = isBlockWater(this._world.getBlockType(Math.floor(fx), Math.floor(fy + HEIGHT * 0.5), Math.floor(fz)));
        const jumpHeld = this._keys.has('Space') || this.inputJump;
        if (inWater) {
            // Space swims upward; no jump off the ground required.
            if (jumpHeld) {
                this._velY = SWIM_VEL;
            }
            this._velY = Math.max(this._velY + WATER_GRAVITY * dt, -2);
        }
        else {
            // Kill residual upward swim velocity on the first frame out of water.
            if (this._prevInWater && this._velY > 0) {
                this._velY = 0;
            }
            // Jump: on ground OR within coyote window (preserves jump ability briefly
            // after leaving ground, including when swimming up off the pool floor).
            if (jumpHeld && (this._onGround || this._coyoteFrames > 0)) {
                this._velY = JUMP_VEL;
                this._coyoteFrames = 0;
            }
            this._velY = Math.max(this._velY + GRAVITY * dt, -50);
        }
        // Step distance accumulator (only when on ground and moving).
        const wasOnGround = this._onGround;
        const hSpeed = Math.sqrt(mx * mx + mz * mz);
        // Auto-jump for mobile: when walking into a 1-block-high obstacle that
        // has air above it, step onto it automatically.
        if (this.autoJump && this._onGround && hSpeed > 0.5) {
            const norm = 1 / Math.max(hSpeed, 1);
            const dx = mx * norm, dz = mz * norm;
            const footY = Math.floor(fy);
            const aheadX = Math.floor(fx + dx * (HALF_W + 0.3));
            const aheadZ = Math.floor(fz + dz * (HALF_W + 0.3));
            if (this._isSolid(aheadX, footY, aheadZ) && !this._isSolid(aheadX, footY + 1, aheadZ)) {
                this._velY = AUTO_JUMP_VEL;
            }
        }
        // Per-axis move + collide.
        fx = this._slideX(fx + mx * dt, fy, fz, mx);
        fz = this._slideZ(fx, fy, fz + mz * dt, mz);
        const [newFY, landed, headBump] = this._slideY(fx, fy + this._velY * dt, fz);
        const prevVelY = this._velY;
        if (landed || headBump) {
            this._velY = 0;
        }
        fy = newFY;
        this._onGround = landed;
        this._prevInWater = inWater;
        // Footstep sound.
        const footFx = Math.floor(fx);
        const footFy = Math.floor(fy - 0.01);
        const footFz = Math.floor(fz);
        const surface = blockTypeToSurface(this._world.getBlockType(footFx, footFy, footFz));
        if (landed && !wasOnGround) {
            this.onLand?.(surface, Math.abs(prevVelY));
        }
        if (landed && hSpeed > 0.5) {
            this._stepDistance += hSpeed * dt;
            const stepInterval = hSpeed > 5.5 ? 0.55 : hSpeed > 2.0 ? 0.45 : 0.3;
            if (this._stepDistance >= stepInterval) {
                this._stepDistance -= stepInterval;
                this.onStep?.(surface);
            }
        }
        else {
            this._stepDistance = 0;
        }
        // Coyote timer: refreshed on landing, counts down only while airborne and
        // not in water (so pool-floor contact persists through the swim to the exit).
        if (landed) {
            this._coyoteFrames = 6;
        }
        else if (!inWater) {
            this._coyoteFrames = Math.max(0, this._coyoteFrames - 1);
        }
        eyeGO.position.x = fx;
        eyeGO.position.y = fy + EYE_HEIGHT;
        eyeGO.position.z = fz;
    }
    _isSolid(bx, by, bz) {
        const bt = this._world.getBlockType(bx, by, bz);
        return bt !== BlockType.NONE && !isBlockWater(bt) && !isBlockProp(bt);
    }
    // Slide along X: only checks the leading face against blocks on the Y/Z span.
    _slideX(newFX, fy, fz, dx) {
        if (Math.abs(dx) < 1e-6) {
            return newFX;
        }
        const xEdge = dx > 0 ? newFX + HALF_W : newFX - HALF_W;
        const bx = Math.floor(xEdge);
        const yLo = Math.floor(fy + 0.01);
        const yHi = Math.floor(fy + HEIGHT - 0.01);
        const zLo = Math.floor(fz - HALF_W + 0.01);
        const zHi = Math.floor(fz + HALF_W - 0.01);
        for (let by = yLo; by <= yHi; by++) {
            for (let bz = zLo; bz <= zHi; bz++) {
                if (this._isSolid(bx, by, bz))
                    return dx > 0 ? bx - HALF_W - 0.001 : bx + 1 + HALF_W + 0.001;
            }
        }
        return newFX;
    }
    // Slide along Z: only checks the leading face against blocks on the X/Y span.
    _slideZ(fx, fy, newFZ, dz) {
        if (Math.abs(dz) < 1e-6) {
            return newFZ;
        }
        const zEdge = dz > 0 ? newFZ + HALF_W : newFZ - HALF_W;
        const bz = Math.floor(zEdge);
        const yLo = Math.floor(fy + 0.01);
        const yHi = Math.floor(fy + HEIGHT - 0.01);
        const xLo = Math.floor(fx - HALF_W + 0.01);
        const xHi = Math.floor(fx + HALF_W - 0.01);
        for (let by = yLo; by <= yHi; by++) {
            for (let bx = xLo; bx <= xHi; bx++) {
                if (this._isSolid(bx, by, bz))
                    return dz > 0 ? bz - HALF_W - 0.001 : bz + 1 + HALF_W + 0.001;
            }
        }
        return newFZ;
    }
    // Slide along Y. Returns [newFY, landed, headBump].
    _slideY(fx, newFY, fz) {
        const xLo = Math.floor(fx - HALF_W + 0.01);
        const xHi = Math.floor(fx + HALF_W - 0.01);
        const zLo = Math.floor(fz - HALF_W + 0.01);
        const zHi = Math.floor(fz + HALF_W - 0.01);
        if (this._velY <= 0) {
            // Falling / standing: check the block just below feet.
            const by = Math.floor(newFY - 0.001);
            for (let bx = xLo; bx <= xHi; bx++) {
                for (let bz = zLo; bz <= zHi; bz++) {
                    if (this._isSolid(bx, by, bz))
                        return [by + 1, true, false];
                }
            }
            return [newFY, false, false];
        }
        else {
            // Rising: check the block at the top of the player's head.
            const by = Math.floor(newFY + HEIGHT);
            for (let bx = xLo; bx <= xHi; bx++) {
                for (let bz = zLo; bz <= zHi; bz++) {
                    if (this._isSolid(bx, by, bz))
                        return [by - HEIGHT - 0.001, false, true];
                }
            }
            return [newFY, false, false];
        }
    }
}
