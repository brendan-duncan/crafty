import type { GameObject } from './game_object.js';
import { Quaternion, Vec3 } from '../math/index.js';

const AXIS_Y = new Vec3(0, 1, 0);
const AXIS_X = new Vec3(1, 0, 0);

// First-person camera controller. Call attach() once, then update() every frame.
//
// Convention (matches the engine's fromEuler(pitch, yaw, 0)):
//   yaw=0    → camera faces -Z
//   yaw=π    → camera faces +Z  (initial test camera faces the scene)
//   pitch>0  → tilted downward
//
// Movement is horizontal-only (W/S/A/D), Space=up, Shift=down.
// Click the canvas to acquire pointer lock for mouse look.

export class CameraControls {
  yaw        : number;  // radians, rotation around world Y
  pitch      : number;  // radians, rotation around local X (clamped ±89°)
  speed      : number;  // units per second
  sensitivity: number;  // radians per pixel

  private _keys  = new Set<string>();
  private _canvas: HTMLCanvasElement | null = null;

  private readonly _onMouseMove: (e: MouseEvent) => void;
  private readonly _onKeyDown  : (e: KeyboardEvent) => void;
  private readonly _onKeyUp    : (e: KeyboardEvent) => void;
  private readonly _onClick    : () => void;

  constructor(yaw = 0, pitch = 0, speed = 5, sensitivity = 0.002) {
    this.yaw         = yaw;
    this.pitch       = pitch;
    this.speed       = speed;
    this.sensitivity = sensitivity;

    const HALF_PI = Math.PI / 2 - 0.001;

    this._onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== this._canvas) return;
      this.yaw   -= e.movementX * this.sensitivity;
      this.pitch  = Math.max(-HALF_PI, Math.min(HALF_PI,
        this.pitch + e.movementY * this.sensitivity));
    };
    this._onKeyDown = (e: KeyboardEvent) => this._keys.add(e.code);
    this._onKeyUp   = (e: KeyboardEvent) => this._keys.delete(e.code);
    this._onClick   = () => this._canvas?.requestPointerLock();
  }

  attach(canvas: HTMLCanvasElement): void {
    this._canvas = canvas;
    canvas.addEventListener('click',     this._onClick);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('keydown',   this._onKeyDown);
    document.addEventListener('keyup',     this._onKeyUp);
  }

  detach(): void {
    if (!this._canvas) return;
    this._canvas.removeEventListener('click',     this._onClick);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('keydown',   this._onKeyDown);
    document.removeEventListener('keyup',     this._onKeyUp);
    this._canvas = null;
  }

  update(gameObject: GameObject, dt: number): void {
    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);

    // Horizontal forward = (-sinY, 0, -cosY); right = (cosY, 0, -sinY)
    let dx = 0, dy = 0, dz = 0;

    if (this._keys.has('KeyW') || this._keys.has('ArrowUp'))         { dx -= sinY; dz -= cosY; }
    if (this._keys.has('KeyS') || this._keys.has('ArrowDown'))        { dx += sinY; dz += cosY; }
    if (this._keys.has('KeyA') || this._keys.has('ArrowLeft'))        { dx -= cosY; dz += sinY; }
    if (this._keys.has('KeyD') || this._keys.has('ArrowRight'))       { dx += cosY; dz -= sinY; }
    if (this._keys.has('KeyQ'))                                        dy -= 1;
    if (this._keys.has('KeyE'))                                        dy += 1;

    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (len > 0) {
      const s = this.speed * dt / len;
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
