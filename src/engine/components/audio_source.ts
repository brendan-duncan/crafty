import { Component } from '../component.js';

/**
 * Spatial audio source component. Creates a `PannerNode` that follows its
 * {@link gameObject} world position each frame, providing 3D-positioned sound.
 *
 * Usage:
 * ```ts
 * const source = gameObject.addComponent(new AudioSource());
 * source.buffer = someAudioBuffer;
 * source.play();
 * ```
 */
export class AudioSource extends Component {
  /** The decoded audio buffer to play when {@link play} is called. */
  buffer: AudioBuffer | null = null;

  /** Playback volume (0–1). Applied via the panner's gain. */
  volume = 1;

  /** Whether the source restarts from the beginning when it ends. */
  loop = false;

  private _ctx       : AudioContext;
  private _panner    : PannerNode;
  private _gain      : GainNode;
  private _source    : AudioBufferSourceNode | null = null;
  private _started   = false;

  constructor(ctx: AudioContext) {
    super();
    this._ctx = ctx;

    this._gain = ctx.createGain();
    this._gain.gain.value = 1;

    this._panner = ctx.createPanner();
    this._panner.panningModel = 'HRTF';
    this._panner.distanceModel = 'inverse';
    this._panner.maxDistance = 50;
    this._panner.refDistance = 5;
    this._panner.rolloffFactor = 1;

    this._gain.connect(this._panner);
    this._panner.connect(ctx.destination);
  }

  onDetach(): void {
    this.stop();
    this._gain.disconnect();
    this._panner.disconnect();
  }

  update(_dt: number): void {
    if (!this._started) {
      return;
    }
    const worldPos = this.gameObject.position;
    this._panner.positionX.value = worldPos.x;
    this._panner.positionY.value = worldPos.y;
    this._panner.positionZ.value = worldPos.z;
  }

  play(): void {
    if (!this.buffer) {
      return;
    }
    this.stop();

    this._source = this._ctx.createBufferSource();
    this._source.buffer = this.buffer;
    this._source.loop = this.loop;
    this._source.connect(this._gain);
    this._source.start();
    this._started = true;

    const pos = this.gameObject.position;
    this._panner.positionX.value = pos.x;
    this._panner.positionY.value = pos.y;
    this._panner.positionZ.value = pos.z;
  }

  stop(): void {
    if (this._source) {
      try { this._source.stop(); } catch { /* already stopped */ }
      this._source.disconnect();
      this._source = null;
    }
    this._started = false;
  }

  get isPlaying(): boolean {
    return this._started;
  }
}
