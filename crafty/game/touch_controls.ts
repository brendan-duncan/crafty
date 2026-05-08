import type { PlayerController, CameraControls } from '../../src/engine/index.js';
import type { World, BlockType } from '../../src/block/index.js';
import type { Scene } from '../../src/engine/index.js';
import type { BlockInteractionState } from './block_interaction.js';
import { doBlockAction } from './block_interaction.js';

const JOY_RADIUS    = 60;   // px — virtual joystick outer radius
const JOY_DEAD_ZONE = 0.10; // fraction of radius treated as zero
const STICK_RADIUS  = 28;   // px — inner draggable knob radius
const BUTTON_SIZE   = 64;   // px — action-button diameter
const LOOK_SENSITIVITY = 0.005; // radians per pixel for touch drag (~2.5× mouse)

/**
 * Constructs a {@link TouchControls} the FIRST time a real `touchstart` event
 * fires anywhere on the page. This is the most robust detection: instead of
 * guessing capabilities (which `navigator.maxTouchPoints` /
 * `'ontouchstart' in window` get wrong in some browsers / webview / desktop
 * mode situations), we let the device tell us it has touch by actually using
 * touch.
 *
 * The first tap is "consumed" to bootstrap the overlay; subsequent touches go
 * through the overlay's own handlers. On desktop, no `touchstart` ever fires,
 * so the overlay never appears — zero overhead.
 *
 * @returns A `cancel` function that aborts the lazy init if called before any
 *   touch happened. After init, the returned `controls` reference will be
 *   set; you can also reach it via the resolved promise.
 */
export function setupTouchControlsLazy(
  canvas: HTMLCanvasElement,
  opts: TouchControlsOptions,
  onInit?: (controls: TouchControls) => void,
): { cancel(): void; controls: TouchControls | null } {
  const handle: { cancel(): void; controls: TouchControls | null } = { controls: null, cancel() {} };

  // Eager path: if detection succeeds, build immediately.
  if (isTouchDevice()) {
    handle.controls = new TouchControls(canvas, opts);
    onInit?.(handle.controls);
    return handle;
  }

  // Lazy path: build on first real touchstart, anywhere.
  const listener = (): void => {
    if (handle.controls) {
      return;
    }
    handle.controls = new TouchControls(canvas, opts);
    onInit?.(handle.controls);
  };
  window.addEventListener('touchstart', listener, { once: true, passive: true, capture: true });
  handle.cancel = () => window.removeEventListener('touchstart', listener, true);
  return handle;
}

/**
 * True if the current device exposes touch input.
 *
 * Tries every reasonable detection path: `navigator.maxTouchPoints` (modern,
 * reflects real hardware), `'ontouchstart' in window` (legacy), the
 * `(any-pointer: coarse)` media query (CSS-level touchscreen detection), and
 * an explicit `?touch=1` URL override for testing on desktop.
 *
 * NOTE: detection is unreliable in some browsers / webview wrappers — prefer
 * {@link setupTouchControlsLazy} which falls back to a real `touchstart` event.
 */
export function isTouchDevice(): boolean {
  // URL override — useful for testing the overlay on desktop or for users on
  // hybrid devices where auto-detection guesses wrong. e.g. `?touch=1`.
  if (typeof location !== 'undefined' && /[?&]touch(=1|=true|=on|$|&)/.test(location.search)) {
    return true;
  }
  if (typeof navigator !== 'undefined') {
    const np = navigator as Navigator & { msMaxTouchPoints?: number };
    if ((np.maxTouchPoints ?? 0) > 0) {
      return true;
    }
    if ((np.msMaxTouchPoints ?? 0) > 0) {
      return true;
    }
  }
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return true;
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    try {
      if (window.matchMedia('(any-pointer: coarse)').matches) {
        return true;
      }
      if (window.matchMedia('(pointer: coarse)').matches) {
        return true;
      }
    } catch {
      // matchMedia not supported — fall through.
    }
  }
  return false;
}

/**
 * Per-frame state needed to drive the player from touch input. Pass either
 * `player` (in player mode) or `camera` (in free-cam mode); the active one
 * receives all movement / look input each frame.
 */
export interface TouchControlsOptions {
  /** Player controller (driven when player mode is active). */
  player?: PlayerController;
  /** Free-fly camera controls (driven when free mode is active). */
  camera?: CameraControls;
  /** Returns the active controller — called every frame so mode toggles work transparently. */
  getActive?: () => 'player' | 'camera';
  /** World, scene, hotbar callback for mine/place. Required for action buttons to work. */
  world?: World;
  scene?: Scene;
  blockInteraction?: BlockInteractionState;
  getSelectedBlock?: () => BlockType;
  /** Optional: callback when the player double-taps the camera-look area (toggle controller). */
  onLookDoubleTap?: () => void;
  /** Override the touch look sensitivity (radians per pixel). */
  lookSensitivity?: number;
}

/**
 * Mobile/touch input layer: virtual joystick (left), camera-look drag (right),
 * and action buttons (jump / mine / place / sneak). Auto-attaches DOM overlay
 * elements; call {@link TouchControls.destroy} to remove them.
 */
export class TouchControls {
  private _root      : HTMLDivElement;
  private _joystick  : HTMLDivElement;
  private _stick     : HTMLDivElement;
  private _btnJump   : HTMLDivElement;
  private _btnSneak  : HTMLDivElement;
  private _btnMine   : HTMLDivElement;
  private _btnPlace  : HTMLDivElement;

  private _joyTouchId : number | null = null;
  private _joyOriginX = 0;
  private _joyOriginY = 0;

  private _lookTouchId: number | null = null;
  private _lookLastX  = 0;
  private _lookLastY  = 0;
  private _lookLastTapAt = -Infinity;

  private readonly _lookSensitivity: number;

  constructor(private _canvas: HTMLCanvasElement, private _opts: TouchControlsOptions) {
    this._lookSensitivity = _opts.lookSensitivity ?? LOOK_SENSITIVITY;

    this._root = document.createElement('div');
    this._root.style.cssText = [
      'position:fixed', 'inset:0',
      'pointer-events:none', // children opt back in
      'user-select:none', '-webkit-user-select:none',
      'touch-action:none', 'z-index:9999',
    ].join(';');

    // Virtual joystick (bottom-left)
    this._joystick = document.createElement('div');
    this._joystick.style.cssText = [
      'position:absolute',
      `left:${24}px`, `bottom:${24}px`,
      `width:${JOY_RADIUS * 2}px`, `height:${JOY_RADIUS * 2}px`,
      'border-radius:50%',
      'background:rgba(255,255,255,0.10)',
      'border:2px solid rgba(255,255,255,0.30)',
      'pointer-events:auto',
    ].join(';');
    this._stick = document.createElement('div');
    this._stick.style.cssText = [
      'position:absolute',
      `left:${JOY_RADIUS - STICK_RADIUS}px`, `top:${JOY_RADIUS - STICK_RADIUS}px`,
      `width:${STICK_RADIUS * 2}px`, `height:${STICK_RADIUS * 2}px`,
      'border-radius:50%',
      'background:rgba(255,255,255,0.30)',
      'border:2px solid rgba(255,255,255,0.50)',
      'pointer-events:none',
      'transition:transform 80ms ease-out',
    ].join(';');
    this._joystick.appendChild(this._stick);
    this._root.appendChild(this._joystick);

    // Action buttons (bottom-right cluster)
    this._btnMine  = this._makeButton('⛏', `right:${24 + BUTTON_SIZE + 12}px`, `bottom:${24 + BUTTON_SIZE + 12}px`, 'rgba(220,80,80,0.45)');
    this._btnPlace = this._makeButton('▣',  `right:${24}px`,                    `bottom:${24 + BUTTON_SIZE + 12}px`, 'rgba(80,180,90,0.45)');
    this._btnJump  = this._makeButton('⤒', `right:${24}px`,                    `bottom:${24}px`,                    'rgba(255,255,255,0.18)');
    this._btnSneak = this._makeButton('⤓', `right:${24 + BUTTON_SIZE + 12}px`, `bottom:${24}px`,                    'rgba(255,255,255,0.10)');

    document.body.appendChild(this._root);

    this._attachEvents();
  }

  /** Removes the overlay and detaches event listeners. */
  destroy(): void {
    this._detachEvents();
    this._root.remove();
  }

  private _makeButton(label: string, posCss1: string, posCss2: string, bg: string): HTMLDivElement {
    const btn = document.createElement('div');
    btn.textContent = label;
    btn.style.cssText = [
      'position:absolute', posCss1, posCss2,
      `width:${BUTTON_SIZE}px`, `height:${BUTTON_SIZE}px`,
      'border-radius:50%',
      `background:${bg}`,
      'border:2px solid rgba(255,255,255,0.45)',
      'color:#fff', 'font-size:32px', 'font-family:sans-serif',
      'display:flex', 'align-items:center', 'justify-content:center',
      'pointer-events:auto', 'user-select:none',
    ].join(';');
    this._root.appendChild(btn);
    return btn;
  }

  private _attachEvents(): void {
    this._joystick.addEventListener('touchstart', this._onJoyStart, { passive: false });
    this._joystick.addEventListener('touchmove',  this._onJoyMove,  { passive: false });
    this._joystick.addEventListener('touchend',   this._onJoyEnd,   { passive: false });
    this._joystick.addEventListener('touchcancel',this._onJoyEnd,   { passive: false });

    this._canvas.addEventListener('touchstart', this._onLookStart, { passive: false });
    this._canvas.addEventListener('touchmove',  this._onLookMove,  { passive: false });
    this._canvas.addEventListener('touchend',   this._onLookEnd,   { passive: false });
    this._canvas.addEventListener('touchcancel',this._onLookEnd,   { passive: false });

    this._bindHoldButton(this._btnJump,  () => this._setJump(true),  () => this._setJump(false));
    this._bindHoldButton(this._btnSneak, () => this._setSneak(true), () => this._setSneak(false));
    this._bindHoldButton(this._btnMine,  () => this._actionDown(0),  () => this._actionUp(0));
    this._bindHoldButton(this._btnPlace, () => this._actionDown(2),  () => this._actionUp(2));
  }

  private _detachEvents(): void {
    this._joystick.removeEventListener('touchstart', this._onJoyStart);
    this._joystick.removeEventListener('touchmove',  this._onJoyMove);
    this._joystick.removeEventListener('touchend',   this._onJoyEnd);
    this._joystick.removeEventListener('touchcancel',this._onJoyEnd);
    this._canvas.removeEventListener('touchstart', this._onLookStart);
    this._canvas.removeEventListener('touchmove',  this._onLookMove);
    this._canvas.removeEventListener('touchend',   this._onLookEnd);
    this._canvas.removeEventListener('touchcancel',this._onLookEnd);
  }

  private _bindHoldButton(el: HTMLDivElement, onDown: () => void, onUp: () => void): void {
    const down = (e: TouchEvent) => { e.preventDefault(); el.style.filter = 'brightness(1.5)'; onDown(); };
    const up   = (e: TouchEvent) => { e.preventDefault(); el.style.filter = ''; onUp(); };
    el.addEventListener('touchstart',  down, { passive: false });
    el.addEventListener('touchend',    up,   { passive: false });
    el.addEventListener('touchcancel', up,   { passive: false });
  }

  // ── Joystick ─────────────────────────────────────────────────────────────

  private _onJoyStart = (e: TouchEvent): void => {
    if (this._joyTouchId !== null) {
      return;
    }
    e.preventDefault();
    const t = e.changedTouches[0];
    this._joyTouchId = t.identifier;
    const r = this._joystick.getBoundingClientRect();
    this._joyOriginX = r.left + r.width  * 0.5;
    this._joyOriginY = r.top  + r.height * 0.5;
    this._updateJoystick(t.clientX, t.clientY);
  };

  private _onJoyMove = (e: TouchEvent): void => {
    if (this._joyTouchId === null) {
      return;
    }
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== this._joyTouchId) {
        continue;
      }
      e.preventDefault();
      this._updateJoystick(t.clientX, t.clientY);
      return;
    }
  };

  private _onJoyEnd = (e: TouchEvent): void => {
    if (this._joyTouchId === null) {
      return;
    }
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier !== this._joyTouchId) {
        continue;
      }
      e.preventDefault();
      this._joyTouchId = null;
      this._setMovement(0, 0);
      this._stick.style.transform = 'translate(0px, 0px)';
      return;
    }
  };

  private _updateJoystick(clientX: number, clientY: number): void {
    let dx = clientX - this._joyOriginX;
    let dy = clientY - this._joyOriginY;
    const len = Math.hypot(dx, dy);
    if (len > JOY_RADIUS) {
      const s = JOY_RADIUS / len;
      dx *= s; dy *= s;
    }
    this._stick.style.transition = 'none';
    this._stick.style.transform = `translate(${dx}px, ${dy}px)`;
    // Restore transition for the release-snap. Setting it on next frame is enough.
    requestAnimationFrame(() => { this._stick.style.transition = 'transform 80ms ease-out'; });

    const fx = dx / JOY_RADIUS;
    const fz = dy / JOY_RADIUS;
    const mag = Math.hypot(fx, fz);
    if (mag < JOY_DEAD_ZONE) {
      this._setMovement(0, 0);
      return;
    }
    // forward = -dy (push up = forward), strafe = +dx (push right = strafe right)
    this._setMovement(fx, -fz);
  }

  // ── Camera look (right-half drag) ────────────────────────────────────────

  private _onLookStart = (e: TouchEvent): void => {
    if (this._lookTouchId !== null) {
      return;
    }
    // Only pick up touches that started on the right half of the canvas.
    const t = e.changedTouches[0];
    const halfX = window.innerWidth * 0.5;
    if (t.clientX < halfX) {
      return;
    }
    e.preventDefault();
    this._lookTouchId = t.identifier;
    this._lookLastX = t.clientX;
    this._lookLastY = t.clientY;

    // Double-tap detection (toggles controller, like double-tap Space).
    const now = performance.now();
    if (now - this._lookLastTapAt < 350 && this._opts.onLookDoubleTap) {
      this._opts.onLookDoubleTap();
      this._lookLastTapAt = -Infinity;
    } else {
      this._lookLastTapAt = now;
    }
  };

  private _onLookMove = (e: TouchEvent): void => {
    if (this._lookTouchId === null) {
      return;
    }
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== this._lookTouchId) {
        continue;
      }
      e.preventDefault();
      const dx = t.clientX - this._lookLastX;
      const dy = t.clientY - this._lookLastY;
      this._lookLastX = t.clientX;
      this._lookLastY = t.clientY;
      this._applyLook(dx, dy);
      return;
    }
  };

  private _onLookEnd = (e: TouchEvent): void => {
    if (this._lookTouchId === null) {
      return;
    }
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier !== this._lookTouchId) {
        continue;
      }
      e.preventDefault();
      this._lookTouchId = null;
      return;
    }
  };

  // ── Bridges to PlayerController / CameraControls ─────────────────────────

  private _activeIsCamera(): boolean {
    return (this._opts.getActive ? this._opts.getActive() : 'player') === 'camera';
  }

  private _setMovement(strafe: number, forward: number): void {
    const cam = this._activeIsCamera();
    if (cam && this._opts.camera) {
      this._opts.camera.inputForward = forward;
      this._opts.camera.inputStrafe  = strafe;
    } else if (this._opts.player) {
      this._opts.player.inputForward = forward;
      this._opts.player.inputStrafe  = strafe;
    }
    // Make sure the inactive controller doesn't keep stale input.
    if (cam && this._opts.player) {
      this._opts.player.inputForward = 0;
      this._opts.player.inputStrafe  = 0;
    } else if (!cam && this._opts.camera) {
      this._opts.camera.inputForward = 0;
      this._opts.camera.inputStrafe  = 0;
    }
  }

  private _setJump(held: boolean): void {
    if (this._activeIsCamera() && this._opts.camera) {
      this._opts.camera.inputUp = held;
    } else if (this._opts.player) {
      this._opts.player.inputJump = held;
    }
  }

  private _setSneak(held: boolean): void {
    if (this._activeIsCamera() && this._opts.camera) {
      this._opts.camera.inputDown = held;
    } else if (this._opts.player) {
      this._opts.player.inputSneak = held;
    }
  }

  private _applyLook(dx: number, dy: number): void {
    // Use the controllers' own sensitivity if it matches; otherwise scale.
    // Touch sensitivity is intentionally a bit higher than mouse.
    const scaled_dx = dx * (this._lookSensitivity / 0.002); // controllers default to 0.002 rad/px
    const scaled_dy = dy * (this._lookSensitivity / 0.002);
    if (this._activeIsCamera() && this._opts.camera) {
      this._opts.camera.applyLookDelta(scaled_dx, scaled_dy);
    } else if (this._opts.player) {
      this._opts.player.applyLookDelta(scaled_dx, scaled_dy);
    }
  }

  // ── Action buttons (mine / place) ────────────────────────────────────────

  private _actionDown(button: number): void {
    const { world, scene, blockInteraction, getSelectedBlock } = this._opts;
    if (!world || !scene || !blockInteraction || !getSelectedBlock) {
      return;
    }
    const time = performance.now();
    blockInteraction.mouseHeld     = button;
    blockInteraction.mouseHoldTime = time;
    doBlockAction(button, time, blockInteraction, world, getSelectedBlock, scene);
  }

  private _actionUp(button: number): void {
    const state = this._opts.blockInteraction;
    if (state && state.mouseHeld === button) {
      state.mouseHeld = -1;
    }
  }
}
