import type { GameObject } from './game_object.js';
import { Quaternion, Vec3 } from '../math/index.js';

const AXIS_Y = new Vec3(0, 1, 0);
const AXIS_X = new Vec3(1, 0, 0);

const FLY_FAST_MULT = 3.0; // ControlLeft speed multiplier

/**
 * Free-fly debug/editor camera controller with FPS-style mouse look.
 *
 * Bindings: WASD (or arrows) for horizontal movement, Space to ascend,
 * ShiftLeft to descend, ControlLeft (or AltLeft) for a 3× speed boost.
 * When {@link usePointerLock} is true (default), clicking the canvas
 * acquires pointer lock and mouse motion drives yaw/pitch.  When false,
 * click-and-drag with the left mouse button controls the camera instead.
 * Call {@link CameraControls.attach} once, then {@link CameraControls.update}
 * every frame against the camera's GameObject.
 */
export class CameraControls {
  /** Yaw in radians, rotation around world Y. */
  yaw        : number;
  /** Pitch in radians, rotation around local X (clamped to ±89°). */
  pitch      : number;
  /** Movement speed in world units per second. */
  speed      : number;
  /** Mouse sensitivity in radians per pixel of movement. */
  sensitivity: number;

  /** Analog forward input in [-1, 1] (touch joystick / programmatic). */
  inputForward = 0;
  /** Analog strafe input in [-1, 1] (positive = right). */
  inputStrafe  = 0;
  /** Held-up flag (OR-ed with Space). */
  inputUp      = false;
  /** Held-down flag (OR-ed with ShiftLeft). */
  inputDown    = false;
  /** Held-fast flag (OR-ed with ControlLeft / AltLeft). */
  inputFast    = false;

  private _keys     = new Set<string>();
  private _canvas   : HTMLCanvasElement | null = null;
  private _mouseBtn = false;
  private _lastMX   = 0;
  private _lastMY   = 0;

  private readonly _onMouseDown : (e: MouseEvent) => void;
  private readonly _onMouseUp   : (e: MouseEvent) => void;
  private readonly _onMouseMove : (e: MouseEvent) => void;
  private readonly _onKeyDown   : (e: KeyboardEvent) => void;
  private readonly _onKeyUp     : (e: KeyboardEvent) => void;
  private readonly _onClick     : () => void;
  private readonly _onBlur      : () => void;

  /**
   * @param yaw - Initial yaw in radians.
   * @param pitch - Initial pitch in radians.
   * @param speed - Base movement speed in units/sec.
   * @param sensitivity - Mouse sensitivity in radians per pixel.
   */
  constructor(yaw = 0, pitch = 0, speed = 5, sensitivity = 0.002) {
    this.yaw         = yaw;
    this.pitch       = pitch;
    this.speed       = speed;
    this.sensitivity = sensitivity;

    const HALF_PI = Math.PI / 2 - 0.001;

    this._onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        this._mouseBtn = true;
        this._lastMX = e.clientX;
        this._lastMY = e.clientY;
      }
    };
    this._onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        this._mouseBtn = false;
      }
    };
    this._onMouseMove = (e: MouseEvent) => {
      if (this.usePointerLock) {
        if (document.pointerLockElement !== this._canvas) {
          return;
        }
        this.yaw   -= e.movementX * this.sensitivity;
        this.pitch  = Math.max(-HALF_PI, Math.min(HALF_PI,
          this.pitch + e.movementY * this.sensitivity));
      } else {
        if (!this._mouseBtn) {
          this._lastMX = e.clientX;
          this._lastMY = e.clientY;
          return;
        }
        const dx = e.clientX - this._lastMX;
        const dy = e.clientY - this._lastMY;
        this._lastMX = e.clientX;
        this._lastMY = e.clientY;
        this.yaw   -= dx * this.sensitivity;
        this.pitch  = Math.max(-HALF_PI, Math.min(HALF_PI,
          this.pitch + dy * this.sensitivity));
      }
    };
    this._onKeyDown = (e: KeyboardEvent) => this._keys.add(e.code);
    this._onKeyUp   = (e: KeyboardEvent) => this._keys.delete(e.code);
    this._onClick   = () => {
      if (this.usePointerLock) {
        this._canvas?.requestPointerLock();
      }
    };
    this._onBlur    = () => {
      this._keys.clear();
      this._mouseBtn = false;
    };
  }

  /** Set false to suppress pointer-lock acquisition on canvas click (touch devices). */
  usePointerLock = true;

  /**
   * Registers DOM event listeners on the supplied canvas and document.
   *
   * @param canvas - Canvas element that will receive click-to-lock and feed pointer lock.
   */
  attach(canvas: HTMLCanvasElement): void {
    this._canvas = canvas;
    canvas.addEventListener('click',       this._onClick);
    document.addEventListener('mousedown',   this._onMouseDown);
    document.addEventListener('mouseup',     this._onMouseUp);
    document.addEventListener('mousemove',   this._onMouseMove);
    document.addEventListener('keydown',     this._onKeyDown);
    document.addEventListener('keyup',       this._onKeyUp);
    window.addEventListener('blur',          this._onBlur);
  }

  /**
   * Injects a key as if it were currently held.
   *
   * Use when the controller is attached after the physical keydown event
   * already fired (e.g. double-tap toggle).
   *
   * @param code - KeyboardEvent.code value, e.g. 'KeyW'.
   */
  pressKey(code: string): void { this._keys.add(code); }

  /**
   * Adds the given delta to yaw and pitch (with the same sensitivity scaling
   * as mouse movement). Used by touch-drag look handlers and similar
   * programmatic camera input.
   *
   * @param dx - Horizontal movement in pixels (positive = right).
   * @param dy - Vertical movement in pixels (positive = down).
   */
  applyLookDelta(dx: number, dy: number): void {
    const HALF_PI = Math.PI / 2 - 0.001;
    this.yaw   -= dx * this.sensitivity;
    this.pitch  = Math.max(-HALF_PI, Math.min(HALF_PI,
      this.pitch + dy * this.sensitivity));
  }

  /**
   * Removes all DOM event listeners and clears the canvas reference.
   */
  detach(): void {
    if (!this._canvas) {
      return;
    }
    this._canvas.removeEventListener('click',       this._onClick);
    document.removeEventListener('mousedown', this._onMouseDown);
    document.removeEventListener('mouseup',     this._onMouseUp);
    document.removeEventListener('mousemove',   this._onMouseMove);
    document.removeEventListener('keydown',     this._onKeyDown);
    document.removeEventListener('keyup',       this._onKeyUp);
    window.removeEventListener('blur',          this._onBlur);
    this._canvas = null;
  }

  /**
   * Advances the controller, applying input to the GameObject's position and rotation.
   *
   * Yaw and pitch are composed as independent quaternions so the camera never
   * accumulates roll.
   *
   * @param gameObject - GameObject whose transform represents the camera.
   * @param dt - Frame delta time in seconds.
   */
  update(gameObject: GameObject, dt: number): void {
    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);

    // Horizontal forward = (-sinY, 0, -cosY); right = (cosY, 0, -sinY)
    let dx = 0, dy = 0, dz = 0;

    if (this._keys.has('KeyW') || this._keys.has('ArrowUp')) {
      dx -= sinY;
      dz -= cosY;
    }
    if (this._keys.has('KeyS') || this._keys.has('ArrowDown')) {
      dx += sinY;
      dz += cosY;
    }
    if (this._keys.has('KeyA') || this._keys.has('ArrowLeft')) {
      dx -= cosY;
      dz += sinY;
    }
    if (this._keys.has('KeyD') || this._keys.has('ArrowRight')) {
      dx += cosY;
      dz -= sinY;
    }
    // Analog input (touch joystick / programmatic).
    if (this.inputForward !== 0) { dx -= sinY * this.inputForward; dz -= cosY * this.inputForward; }
    if (this.inputStrafe  !== 0) { dx += cosY * this.inputStrafe;  dz -= sinY * this.inputStrafe;  }
    if (this._keys.has('Space') || this.inputUp) {
      dy += 1;
    }
    if (this._keys.has('ShiftLeft') || this.inputDown) {
      dy -= 1;
    }

    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (len > 0) {
      const fast = this._keys.has('ControlLeft') || this._keys.has('AltLeft') || this.inputFast;
      const s = this.speed * (fast ? FLY_FAST_MULT : 1.0) * dt / len;
      gameObject.position.x += dx * s;
      gameObject.position.y += dy * s;
      gameObject.position.z += dz * s;
    }

    // Compose yaw (world Y) then pitch (local X) as independent quaternions so
    // they never interact — the camera can never accumulate roll this way.
    gameObject.rotation = Quaternion.fromAxisAngle(AXIS_Y, this.yaw)
      .multiply(Quaternion.fromAxisAngle(AXIS_X, -this.pitch));
  }
}
