import { GameObject, Scene, MeshRenderer } from '../../src/engine/index.js';
import { PbrMaterial } from '../../src/engine/materials/pbr_material.js';
import { Mesh } from '../../src/assets/mesh.js';
import { Quaternion, Vec3 } from '../../src/math/index.js';

// 12 floats per vertex: position(3) + normal(3) + uv(2) + tangent(4)
function _addBox(
  verts: number[], indices: number[],
  cx: number, cy: number, cz: number,
  sx: number, sy: number, sz: number,
): void {
  const faces: Array<{
    n: [number, number, number];
    t: [number, number, number, number];
    v: [number, number, number][];
  }> = [
    { n: [0, 0, -1], t: [-1, 0, 0, 1], v: [[-sx, -sy, -sz], [sx, -sy, -sz], [sx, sy, -sz], [-sx, sy, -sz]] },
    { n: [0, 0,  1], t: [ 1, 0, 0, 1], v: [[sx, -sy, sz], [-sx, -sy, sz], [-sx, sy, sz], [sx, sy, sz]] },
    { n: [-1, 0, 0], t: [0, 0, -1, 1], v: [[-sx, -sy, sz], [-sx, -sy, -sz], [-sx, sy, -sz], [-sx, sy, sz]] },
    { n: [ 1, 0, 0], t: [0, 0,  1, 1], v: [[sx, -sy, -sz], [sx, -sy, sz], [sx, sy, sz], [sx, sy, -sz]] },
    { n: [0, 1, 0],  t: [ 1, 0, 0, 1], v: [[-sx, sy, -sz], [sx, sy, -sz], [sx, sy, sz], [-sx, sy, sz]] },
    { n: [0, -1, 0], t: [ 1, 0, 0, 1], v: [[-sx, -sy, sz], [sx, -sy, sz], [sx, -sy, -sz], [-sx, -sy, -sz]] },
  ];
  const uvs: [number, number][] = [[0, 1], [1, 1], [1, 0], [0, 0]];
  for (const f of faces) {
    const base = verts.length / 12;
    for (let i = 0; i < 4; i++) {
      const [vx, vy, vz] = f.v[i];
      verts.push(
        cx + vx, cy + vy, cz + vz,
        f.n[0], f.n[1], f.n[2],
        uvs[i][0], uvs[i][1],
        f.t[0], f.t[1], f.t[2], f.t[3],
      );
    }
    indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
  }
}

export interface RemotePlayerMeshes {
  body: Mesh;
  head: Mesh;
  arm: Mesh;
  leg: Mesh;
}

/**
 * Builds the procedural blocky humanoid mesh set used for remote players.
 *
 * Proportions roughly follow Minecraft's Steve: 0.5×0.75×0.25 torso,
 * 0.5×0.5×0.5 head, 0.25×0.75×0.25 limbs (in block units). Each piece is
 * centered at the origin so the spawning code can position joints freely.
 */
export function createRemotePlayerMeshes(device: GPUDevice): RemotePlayerMeshes
{
  const body = _buildMesh(device, (v, i) => _addBox(v, i, 0, 0, 0, 0.25, 0.375, 0.125));
  const head = _buildMesh(device, (v, i) => _addBox(v, i, 0, 0, 0, 0.25, 0.25, 0.25));
  // Arm/leg: pivot at top so we can rotate them around the shoulder/hip.
  const arm = _buildMesh(device, (v, i) => _addBox(v, i, 0, -0.375, 0, 0.125, 0.375, 0.125));
  const leg = _buildMesh(device, (v, i) => _addBox(v, i, 0, -0.375, 0, 0.125, 0.375, 0.125));
  return { body, head, arm, leg };
}

function _buildMesh(device: GPUDevice, fill: (verts: number[], indices: number[]) => void): Mesh
{
  const verts: number[] = [];
  const indices: number[] = [];
  fill(verts, indices);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

const SKIN: [number, number, number, number] = [0.95, 0.78, 0.62, 1];
const SHIRT: [number, number, number, number] = [0.30, 0.55, 0.85, 1];
const PANTS: [number, number, number, number] = [0.25, 0.30, 0.45, 1];

/**
 * Networked avatar for another player. Owns a small skeleton of GameObjects:
 *
 *   root  ─ position + yaw
 *     └ head  ─ pitch
 *     └ body
 *     └ armL / armR
 *     └ legL / legR
 *
 * Transform updates from the server are stored as a target; `update()`
 * smoothly interpolates the current pose toward it to hide network jitter.
 * Walk-cycle limb swing is procedural off the 2D ground velocity.
 */
export class RemotePlayer
{
  readonly playerId: number;
  readonly name: string;
  readonly root: GameObject;

  private readonly _scene: Scene;
  private readonly _head: GameObject;
  private readonly _armL: GameObject;
  private readonly _armR: GameObject;
  private readonly _legL: GameObject;
  private readonly _legR: GameObject;

  private _curX = 0; private _curY = 0; private _curZ = 0;
  private _curYaw = 0; private _curPitch = 0;
  private _tgtX = 0; private _tgtY = 0; private _tgtZ = 0;
  private _tgtYaw = 0; private _tgtPitch = 0;
  private _hasTarget = false;
  private _walkPhase = 0;

  constructor(playerId: number, name: string, scene: Scene, meshes: RemotePlayerMeshes)
  {
    this.playerId = playerId;
    this.name = name;
    this._scene = scene;

    const root = new GameObject(`RemotePlayer.${playerId}`);
    this.root = root;

    // Body — center sits 1.125 above the feet.
    const body = new GameObject('RP.Body');
    body.position.set(0, 1.125, 0);
    body.addComponent(new MeshRenderer(meshes.body, new PbrMaterial({ albedo: SHIRT, roughness: 0.85 })));
    root.addChild(body);

    // Head — eye level ~1.625.
    const head = new GameObject('RP.Head');
    head.position.set(0, 1.75, 0);
    head.addComponent(new MeshRenderer(meshes.head, new PbrMaterial({ albedo: SKIN, roughness: 0.80 })));
    root.addChild(head);
    this._head = head;

    // Arms — pivot at shoulder (top of arm box, hence pivot at 1.5).
    const armL = new GameObject('RP.ArmL');
    armL.position.set(-0.375, 1.5, 0);
    armL.addComponent(new MeshRenderer(meshes.arm, new PbrMaterial({ albedo: SHIRT, roughness: 0.85 })));
    root.addChild(armL);
    this._armL = armL;

    const armR = new GameObject('RP.ArmR');
    armR.position.set(0.375, 1.5, 0);
    armR.addComponent(new MeshRenderer(meshes.arm, new PbrMaterial({ albedo: SHIRT, roughness: 0.85 })));
    root.addChild(armR);
    this._armR = armR;

    // Legs — pivot at hip (top of leg box, hence pivot at 0.75).
    const legL = new GameObject('RP.LegL');
    legL.position.set(-0.125, 0.75, 0);
    legL.addComponent(new MeshRenderer(meshes.leg, new PbrMaterial({ albedo: PANTS, roughness: 0.85 })));
    root.addChild(legL);
    this._legL = legL;

    const legR = new GameObject('RP.LegR');
    legR.position.set(0.125, 0.75, 0);
    legR.addComponent(new MeshRenderer(meshes.leg, new PbrMaterial({ albedo: PANTS, roughness: 0.85 })));
    root.addChild(legR);
    this._legR = legR;

    scene.add(root);
  }

  setTargetTransform(x: number, y: number, z: number, yaw: number, pitch: number): void
  {
    if (!this._hasTarget) {
      // First update — snap.
      this._curX = x; this._curY = y; this._curZ = z;
      this._curYaw = yaw; this._curPitch = pitch;
    }
    this._tgtX = x; this._tgtY = y; this._tgtZ = z;
    this._tgtYaw = yaw; this._tgtPitch = pitch;
    this._hasTarget = true;
  }

  update(dt: number): void
  {
    if (!this._hasTarget) {
      return;
    }

    // Exponential smoothing toward the target. 12/s gives ~80 ms half-life.
    const a = 1 - Math.exp(-12 * dt);
    const dx = this._tgtX - this._curX;
    const dy = this._tgtY - this._curY;
    const dz = this._tgtZ - this._curZ;
    this._curX += dx * a;
    this._curY += dy * a;
    this._curZ += dz * a;
    this._curYaw = _lerpAngle(this._curYaw, this._tgtYaw, a);
    this._curPitch += (this._tgtPitch - this._curPitch) * a;

    // Position is the avatar's feet — local player position is at eye height.
    const eyeHeight = 1.625;
    this.root.position.set(this._curX, this._curY - eyeHeight, this._curZ);
    this.root.rotation = Quaternion.fromAxisAngle(_UP, this._curYaw);
    this._head.rotation = Quaternion.fromAxisAngle(_RIGHT, this._curPitch);

    // Walk cycle off horizontal speed (uses the *target* delta, not the smoothed
    // one, so the cycle keeps swinging while the avatar catches up).
    const speed = Math.hypot(dx, dz) / Math.max(dt, 0.001);
    const walking = speed > 0.3;
    const phaseRate = walking ? Math.min(speed * 1.2, 8) : 4;
    this._walkPhase += dt * phaseRate;
    const swing = walking ? Math.sin(this._walkPhase) * 0.55 : 0;
    this._armL.rotation = Quaternion.fromAxisAngle(_RIGHT,  swing);
    this._armR.rotation = Quaternion.fromAxisAngle(_RIGHT, -swing);
    this._legL.rotation = Quaternion.fromAxisAngle(_RIGHT, -swing);
    this._legR.rotation = Quaternion.fromAxisAngle(_RIGHT,  swing);
  }

  /** World-space head position, used to anchor the name label. */
  headWorldPosition(out: Vec3): Vec3
  {
    out.x = this.root.position.x;
    out.y = this.root.position.y + 2.1;
    out.z = this.root.position.z;
    return out;
  }

  dispose(): void
  {
    this._scene.remove(this.root);
  }
}

const _UP = new Vec3(0, 1, 0);
const _RIGHT = new Vec3(1, 0, 0);

function _lerpAngle(a: number, b: number, t: number): number
{
  let d = b - a;
  while (d >  Math.PI) { d -= 2 * Math.PI; }
  while (d < -Math.PI) { d += 2 * Math.PI; }
  return a + d * t;
}
