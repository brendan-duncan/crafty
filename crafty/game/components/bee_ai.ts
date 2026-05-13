import { Vec3 } from '../../../src/math/index.js';
import { Quaternion } from '../../../src/math/quaternion.js';
import { Component } from '../../../src/engine/component.js';
import { Bee } from '../entities/bee_entity.js';
import type { World } from '../../../src/block/world.js';
import type { GameObject } from '../../../src/engine/game_object.js';

type BeeState = 'idle' | 'wander' | 'hover';

const _Y_AXIS = new Vec3(0, 1, 0);
const FLOWER_DETECT_RADIUS_SQ = 36;  // 6²

/**
 * Flying NPC behavior for bee GameObjects.
 *
 * Three-state machine (idle → wander → hover). Bees fly at a fixed altitude
 * above terrain and periodically seek out FLOWER blocks. After hovering over
 * a flower, the bee wanders away (clearing the flower target) so it doesn't
 * get stuck at the same flower. Wing-flap animation runs on 'Bee.WingL' and
 * 'Bee.WingR' child GameObjects.
 */
export class BeeAI extends Component {

  private _world: World;
  private _state: BeeState = 'idle';
  private _timer = 0;
  private _targetX = 0;
  private _targetZ = 0;
  private _hasTarget = false;
  private _yaw = 0;

  private _flightAltitude: number;
  private _verticalPhase: number;

  private _flowerTarget: { x: number; y: number; z: number } | null = null;
  private _hoverElapsed = 0;
  private _hoverDuration = 0;

  private _wingL: GameObject | null = null;
  private _wingR: GameObject | null = null;
  private _wingPhase: number;

  constructor(world: World) {
    super();
    this._world = world;
    this._flightAltitude = 2.5 + Math.random() * 1.5;
    this._timer = 1 + Math.random() * 4;
    this._yaw = Math.random() * Math.PI * 2;
    this._verticalPhase = Math.random() * Math.PI * 2;
    this._wingPhase = Math.random() * Math.PI * 2;
  }

  onAttach(): void {
    for (const child of this.gameObject.children) {
      if (child.name === 'Bee.WingL') this._wingL = child;
      if (child.name === 'Bee.WingR') this._wingR = child;
    }
  }

  update(dt: number): void {
    const go = this.gameObject;
    const gx = go.position.x;
    const gz = go.position.z;

    // ── Vertical oscillation (runs in all states) ──────────────────────────
    this._verticalPhase += dt * 2.5;

    // ── Terrain tracking / flight altitude ─────────────────────────────────
    // Hover controls Y directly; idle/wander lerp toward target height.
    if (this._state !== 'hover') {
      const groundY = this._world.getTopBlockY(Math.floor(gx), Math.floor(gz), 200);
      if (groundY > 0) {
        const hoverOffset = Math.sin(this._verticalPhase) * 0.15;
        const targetBase = this._flowerTarget
          ? this._flowerTarget.y - 0.1
          : groundY + this._flightAltitude;
        go.position.y += (targetBase + hoverOffset - go.position.y) * Math.min(1, 3.0 * dt);
      }
    }

    // ── State machine ──────────────────────────────────────────────────────
    switch (this._state) {
      case 'idle': {
        this._timer -= dt;
        if (this._timer <= 0) {
          if (this._findNearestFlower()) {
            this._enterApproachFlower();
          } else {
            this._pickWanderTarget();
          }
        }
        break;
      }

      case 'wander': {
        this._timer -= dt;
        if (!this._hasTarget || this._timer <= 0) {
          this._enterIdle();
          break;
        }
        const dx = this._targetX - gx;
        const dz = this._targetZ - gz;
        const dist2 = dx * dx + dz * dz;
        if (dist2 < 1.0) {
          if (this._flowerTarget) {
            this._enterHover();
          } else {
            this._enterIdle();
          }
          break;
        }
        const dist = Math.sqrt(dist2);
        go.position.x += (dx / dist) * 2.5 * dt;
        go.position.z += (dz / dist) * 2.5 * dt;
        this._yaw = Math.atan2(-(dx / dist), -(dz / dist));
        break;
      }

      case 'hover': {
        this._hoverElapsed += dt;
        if (this._hoverElapsed >= this._hoverDuration || !this._flowerTarget) {
          // Fly away after hovering — clears flowerTarget so we don't re-lock
          this._pickWanderTarget();
          break;
        }
        const targetY = this._flowerTarget.y - 0.1 + Math.sin(this._verticalPhase * 3) * 0.15;
        const dx = this._flowerTarget.x - gx;
        const dz = this._flowerTarget.z - gz;
        const dy = targetY - go.position.y;
        const dist = Math.sqrt(dx * dx + dz * dz + dy * dy);
        if (dist > 0.01) {
          go.position.x += (dx / dist) * 0.8 * dt;
          go.position.z += (dz / dist) * 0.8 * dt;
          go.position.y += (dy / dist) * 0.8 * dt;
        }
        this._yaw = Math.atan2(-dx, -dz);
        break;
      }
    }

    // ── Apply yaw rotation ─────────────────────────────────────────────────
    go.rotation = Quaternion.fromAxisAngle(_Y_AXIS, this._yaw);

    // ── Wing flap (continuous) ─────────────────────────────────────────────
    if (this._wingL && this._wingR) {
      this._wingPhase += dt * 18;
      const wingAngle = Math.sin(this._wingPhase) * 0.4;
      const q = Quaternion.fromAxisAngle(new Vec3(1, 0, 0), wingAngle);
      this._wingL.rotation = q;
      this._wingR.rotation = q;
    }
  }

  private _enterIdle(): void {
    this._state = 'idle';
    this._hasTarget = false;
    this._timer = 3 + Math.random() * 3;
  }

  private _enterApproachFlower(): void {
    if (!this._flowerTarget) return;
    this._targetX = this._flowerTarget.x;
    this._targetZ = this._flowerTarget.z;
    this._hasTarget = true;
    this._state = 'wander';
    this._timer = 6;
  }

  private _enterHover(): void {
    this._state = 'hover';
    this._hasTarget = false;
    this._hoverElapsed = 0;
    this._hoverDuration = 4 + Math.random() * 4;
  }

  private _pickWanderTarget(): void {
    const go = this.gameObject;
    const angle = Math.random() * Math.PI * 2;
    const dist  = 8 + Math.random() * 8;
    this._targetX = go.position.x + Math.cos(angle) * dist;
    this._targetZ = go.position.z + Math.sin(angle) * dist;
    this._hasTarget = true;
    this._state = 'wander';
    this._timer = 8 + Math.random() * 4;
    this._flowerTarget = null;
  }

  private _findNearestFlower(): boolean {
    const go = this.gameObject;
    let nearestX = 0, nearestY = 0, nearestZ = 0;
    let nearestDist2 = FLOWER_DETECT_RADIUS_SQ;
    let found = false;

    for (const key of Bee.flowerPositions) {
      const parts = key.split(':');
      const fx = Number(parts[0]);
      const fy = Number(parts[1]);
      const fz = Number(parts[2]);
      const dx = fx + 0.5 - go.position.x;
      const dy = fy + 0.5 - go.position.y;
      const dz = fz + 0.5 - go.position.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < nearestDist2) {
        nearestDist2 = d2;
        nearestX = fx + 0.5;
        nearestY = fy + 0.5;
        nearestZ = fz + 0.5;
        found = true;
      }
    }

    if (found) {
      this._flowerTarget = { x: nearestX, y: nearestY, z: nearestZ };
    } else {
      this._flowerTarget = null;
    }
    return found;
  }
}
