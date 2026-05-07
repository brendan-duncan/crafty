import { Quaternion, Vec3 } from '../math/index.js';
import type { GameObject } from './game_object.js';
import type { World } from '../block/world.js';
import { BlockType, isBlockWater, isBlockProp } from '../block/block_type.js';

const AXIS_Y = new Vec3(0, 1, 0);
const AXIS_X = new Vec3(1, 0, 0);

const GRAVITY        = -28.0;   // blocks/s²
const WATER_GRAVITY  =  -4.0;   // blocks/s² while submerged
const SNEAK_SPEED    =   1.3;   // blocks/s (ShiftLeft)
const WALK_SPEED     =   4.3;   // blocks/s
const SPRINT_SPEED   =   7.0;   // blocks/s (ControlLeft)
const JUMP_VEL       =  11.5;   // blocks/s  (peak ≈ 2.36 blocks, clears 1-block walls)
const SWIM_VEL       =   3.5;   // blocks/s upward when Space pressed in water
const HALF_W         =   0.3;   // player AABB half-width/depth
const HEIGHT         =   1.8;   // player AABB height
const EYE_HEIGHT     =   1.62;  // camera above feet

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
  yaw        : number;
  /** Pitch in radians, rotation around local X (clamped to ±89°). */
  pitch      : number;
  /** Mouse sensitivity in radians per pixel. */
  sensitivity: number = 0.002;

  private _velY         = 0;
  /** Sets vertical velocity (used to inject jumps/launches from external code). */
  set velY(v: number) { this._velY = v; }
  private _onGround     = false;
  private _prevInWater  = false;
  private _coyoteFrames = 0;
  private _keys         = new Set<string>();
  private _canvas   : HTMLCanvasElement | null = null;
  private _world    : World;

  private readonly _onMouseMove: (e: MouseEvent) => void;
  private readonly _onKeyDown  : (e: KeyboardEvent) => void;
  private readonly _onKeyUp    : (e: KeyboardEvent) => void;
  private readonly _onClick    : () => void;

  /**
   * @param world - World used for collision and water sampling.
   * @param yaw - Initial yaw in radians.
   * @param pitch - Initial pitch in radians.
   */
  constructor(world: World, yaw = Math.PI, pitch = 0.1) {
    this._world = world;
    this.yaw    = yaw;
    this.pitch  = pitch;

    const HALF_PI = Math.PI / 2 - 0.001;
    this._onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== this._canvas) {
        return;
      }
      this.yaw   -= e.movementX * this.sensitivity;
      this.pitch  = Math.max(-HALF_PI, Math.min(HALF_PI,
        this.pitch + e.movementY * this.sensitivity));
    };
    this._onKeyDown = (e: KeyboardEvent) => this._keys.add(e.code);
    this._onKeyUp   = (e: KeyboardEvent) => this._keys.delete(e.code);
    this._onClick   = () => this._canvas?.requestPointerLock();
  }

  /**
   * Registers DOM event listeners on the supplied canvas and document.
   *
   * @param canvas - Canvas element that receives click-to-lock and feeds pointer lock.
   */
  attach(canvas: HTMLCanvasElement): void {
    this._canvas = canvas;
    canvas.addEventListener('click',       this._onClick);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('keydown',   this._onKeyDown);
    document.addEventListener('keyup',     this._onKeyUp);
  }

  /**
   * Removes all DOM event listeners and clears the canvas reference.
   */
  detach(): void {
    if (!this._canvas) {
      return;
    }
    this._canvas.removeEventListener('click',       this._onClick);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('keydown',   this._onKeyDown);
    document.removeEventListener('keyup',     this._onKeyUp);
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
  update(eyeGO: GameObject, dt: number): void {
    dt = Math.min(dt, 0.05);

    // Orientation: yaw around world-Y, pitch around local-X.
    eyeGO.rotation = Quaternion.fromAxisAngle(AXIS_Y, this.yaw)
      .multiply(Quaternion.fromAxisAngle(AXIS_X, -this.pitch));

    // Horizontal movement direction from WASD.
    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);
    const sprinting = this._keys.has('ControlLeft') || this._keys.has('AltLeft');
    const sneaking  = this._keys.has('ShiftLeft');
    const speed = sprinting ? SPRINT_SPEED : sneaking ? SNEAK_SPEED : WALK_SPEED;

    let mx = 0, mz = 0;
    if (this._keys.has('KeyW') || this._keys.has('ArrowUp'))    { mx -= sinY; mz -= cosY; }
    if (this._keys.has('KeyS') || this._keys.has('ArrowDown'))  { mx += sinY; mz += cosY; }
    if (this._keys.has('KeyA') || this._keys.has('ArrowLeft'))  { mx -= cosY; mz += sinY; }
    if (this._keys.has('KeyD') || this._keys.has('ArrowRight')) { mx += cosY; mz -= sinY; }
    const hLen = Math.sqrt(mx * mx + mz * mz);
    if (hLen > 0) { mx = mx / hLen * speed; mz = mz / hLen * speed; }

    // Feet position derived from eye (needed for water check before physics).
    let fx = eyeGO.position.x;
    let fy = eyeGO.position.y - EYE_HEIGHT;
    let fz = eyeGO.position.z;

    // Water: check the block at chest height (below eye, above feet).
    const inWater = isBlockWater(
      this._world.getBlockType(Math.floor(fx), Math.floor(fy + HEIGHT * 0.5), Math.floor(fz))
    );

    if (inWater) {
      // Space swims upward; no jump off the ground required.
      if (this._keys.has('Space')) {
        this._velY = SWIM_VEL;
      }
      this._velY = Math.max(this._velY + WATER_GRAVITY * dt, -2);
    } else {
      // Kill residual upward swim velocity on the first frame out of water.
      if (this._prevInWater && this._velY > 0) {
        this._velY = 0;
      }

      // Jump: on ground OR within coyote window (preserves jump ability briefly
      // after leaving ground, including when swimming up off the pool floor).
      if (this._keys.has('Space') && (this._onGround || this._coyoteFrames > 0)) {
        this._velY        = JUMP_VEL;
        this._coyoteFrames = 0;
      }
      this._velY = Math.max(this._velY + GRAVITY * dt, -50);
    }

    // Per-axis move + collide.
    fx = this._slideX(fx + mx * dt, fy, fz, mx);
    fz = this._slideZ(fx, fy, fz + mz * dt, mz);
    const [newFY, landed, headBump] = this._slideY(fx, fy + this._velY * dt, fz);
    if (landed || headBump) {
      this._velY = 0;
    }
    fy = newFY;
    this._onGround   = landed;
    this._prevInWater = inWater;

    // Coyote timer: refreshed on landing, counts down only while airborne and
    // not in water (so pool-floor contact persists through the swim to the exit).
    if (landed) {
      this._coyoteFrames = 6;
    } else if (!inWater) {
      this._coyoteFrames = Math.max(0, this._coyoteFrames - 1);
    }

    eyeGO.position.x = fx;
    eyeGO.position.y = fy + EYE_HEIGHT;
    eyeGO.position.z = fz;
  }

  private _isSolid(bx: number, by: number, bz: number): boolean {
    const bt = this._world.getBlockType(bx, by, bz);
    return bt !== BlockType.NONE && !isBlockWater(bt) && !isBlockProp(bt);
  }

  // Slide along X: only checks the leading face against blocks on the Y/Z span.
  private _slideX(newFX: number, fy: number, fz: number, dx: number): number {
    if (Math.abs(dx) < 1e-6) {
      return newFX;
    }
    const xEdge = dx > 0 ? newFX + HALF_W : newFX - HALF_W;
    const bx    = Math.floor(xEdge);
    const yLo   = Math.floor(fy + 0.01);
    const yHi   = Math.floor(fy + HEIGHT - 0.01);
    const zLo   = Math.floor(fz - HALF_W + 0.01);
    const zHi   = Math.floor(fz + HALF_W - 0.01);
    for (let by = yLo; by <= yHi; by++) {
      for (let bz = zLo; bz <= zHi; bz++) {
        if (this._isSolid(bx, by, bz))
          return dx > 0 ? bx - HALF_W - 0.001 : bx + 1 + HALF_W + 0.001;
      }
    }
    return newFX;
  }

  // Slide along Z: only checks the leading face against blocks on the X/Y span.
  private _slideZ(fx: number, fy: number, newFZ: number, dz: number): number {
    if (Math.abs(dz) < 1e-6) {
      return newFZ;
    }
    const zEdge = dz > 0 ? newFZ + HALF_W : newFZ - HALF_W;
    const bz    = Math.floor(zEdge);
    const yLo   = Math.floor(fy + 0.01);
    const yHi   = Math.floor(fy + HEIGHT - 0.01);
    const xLo   = Math.floor(fx - HALF_W + 0.01);
    const xHi   = Math.floor(fx + HALF_W - 0.01);
    for (let by = yLo; by <= yHi; by++) {
      for (let bx = xLo; bx <= xHi; bx++) {
        if (this._isSolid(bx, by, bz))
          return dz > 0 ? bz - HALF_W - 0.001 : bz + 1 + HALF_W + 0.001;
      }
    }
    return newFZ;
  }

  // Slide along Y. Returns [newFY, landed, headBump].
  private _slideY(fx: number, newFY: number, fz: number): [number, boolean, boolean] {
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
    } else {
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
