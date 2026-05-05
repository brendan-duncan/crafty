import { Component } from '../component.js';
import { Skeleton } from '../skeleton.js';
import type { GltfModel } from '../../assets/gltf_loader.js';
import type { AnimationClip } from '../animation.js';
import { sampleClip } from '../animation.js';

export class AnimatedModel extends Component {
  readonly model   : GltfModel;
  readonly skeleton: Skeleton;

  currentClip: string | null = null;
  speed      : number = 1.0;
  loop       : boolean = true;

  private _time        : number = 0;
  private _paused      : boolean = false;
  private _clip        : AnimationClip | null = null;

  // Per-joint working arrays, reused each frame
  private readonly _translations: Float32Array;
  private readonly _rotations   : Float32Array;
  private readonly _scales      : Float32Array;

  // Final joint matrices written by computeJointMatrices, read by the render pass
  readonly jointMatrices: Float32Array;

  constructor(model: GltfModel) {
    super();
    this.model    = model;
    this.skeleton = model.skin!;

    const jc               = this.skeleton.jointCount;
    this._translations     = new Float32Array(jc * 3);
    this._rotations        = new Float32Array(jc * 4);
    this._scales           = new Float32Array(jc * 3);
    this.jointMatrices     = new Float32Array(jc * 16);

    // Initialize to bind pose
    this._resetToPose();
    this.skeleton.computeJointMatrices(this._translations, this._rotations, this._scales, this.jointMatrices);
  }

  play(clipName: string, loop = true): void {
    const clip = this.model.clips.find(c => c.name === clipName) ?? null;
    this._clip       = clip;
    this.currentClip = clip?.name ?? null;
    this.loop        = loop;
    this._time       = 0;
    this._paused     = false;
  }

  pause(): void { this._paused = true; }
  resume(): void { this._paused = false; }

  stop(): void {
    this._paused = true;
    this._time   = 0;
    this._clip   = null;
    this.currentClip = null;
    this._resetToPose();
    this.skeleton.computeJointMatrices(this._translations, this._rotations, this._scales, this.jointMatrices);
  }

  override update(dt: number): void {
    if (!this._clip || this._paused) {
      return;
    }

    this._time += dt * this.speed;

    if (this.loop && this._clip.duration > 0) {
      this._time = ((this._time % this._clip.duration) + this._clip.duration) % this._clip.duration;
    } else {
      this._time = Math.min(this._time, this._clip.duration);
    }

    this._resetToPose();
    sampleClip(this._clip, this._time, this._translations, this._rotations, this._scales);
    this.skeleton.computeJointMatrices(this._translations, this._rotations, this._scales, this.jointMatrices);
  }

  private _resetToPose(): void {
    this._translations.set(this.skeleton.restTranslations);
    this._rotations.set(this.skeleton.restRotations);
    this._scales.set(this.skeleton.restScales);
  }
}
