import type { Vec3 } from '../../src/math/vec3.js';
import type { SurfaceGroup } from '../../src/engine/audio_surface.js';

// Eager glob — Vite resolves all .wav URLs at build time.
// Paths are relative to this file (crafty/game/ → project root → assets/).
const _stepGlob = import.meta.glob('../../assets/sounds/player/step/*.wav', {
  import: 'default', eager: true,
}) as Record<string, string>;

const _fallGlob = import.meta.glob('../../assets/sounds/player/fall/*.wav', {
  import: 'default', eager: true,
}) as Record<string, string>;

const _digGlob = import.meta.glob('../../assets/sounds/player/dig/*.wav', {
  import: 'default', eager: true,
}) as Record<string, string>;

/**
 * Parses a path like `/assets/sounds/player/step/grass3.wav` into
 * `{ surface: 'grass', variant: 3 }`. Returns null for unmatched paths.
 */
function _parseStepPath(path: string): { surface: string; variant: number } | null {
  const m = path.match(/step\/(\w+?)(\d+)\.wav$/);
  if (!m) {
    return null;
  }
  return { surface: m[1], variant: parseInt(m[2], 10) };
}

function _parseFallPath(path: string): string | null {
  const m = path.match(/fall\/(\w+)\.wav$/);
  return m ? m[1] : null;
}

// ────────────────────────────────────────────────────────────────────────────
// Audio Manager
// ────────────────────────────────────────────────────────────────────────────

/**
 * Manages the Web Audio API context, loads sound buffers, provides one-shot
 * spatial playback, updates the 3D listener each frame, and plays background
 * music with fade support.
 *
 * Create once and call {@link updateListener} every frame from the game loop.
 */
export class AudioManager {
  private _ctx: AudioContext | null = null;
  private _stepBuffers = new Map<string, AudioBuffer[]>();
  private _fallBuffers  = new Map<string, AudioBuffer>();
  private _digBuffers   = new Map<string, AudioBuffer[]>();

  // One-shot pool: reuse short-lived source+panner nodes.
  private _oneShots: OneShot[] = [];

  // Music
  private _musicGain   : GainNode | null = null;
  private _musicSource : AudioBufferSourceNode | null = null;

  /** Global master volume (0–1) applied to all sounds including music. */
  masterVolume = 0.5;

  /** Volume for footstep and effect sounds (0–1). */
  sfxVolume = 0.7;

  /** Volume for background music (0–1). */
  musicVolume = 0.4;

  // ── Initialisation ──────────────────────────────────────────────────────

  /**
   * Creates (or resumes) the AudioContext (must be called from a user gesture
   * on browsers that block autoplay) and loads all sound buffers.
   */
  async init(): Promise<void> {
    if (!this._ctx) {
      this._ctx = new AudioContext();
    }
    if (this._ctx.state === 'suspended') {
      await this._ctx.resume();
    }

    await Promise.all([
      this._loadStepSounds(),
      this._loadFallSounds(),
      this._loadDigSounds(),
    ]);
  }

  /** Returns the underlying AudioContext, creating it if needed (may still be suspended). */
  get context(): AudioContext {
    if (!this._ctx) {
      this._ctx = new AudioContext();
    }
    return this._ctx;
  }

  private async _loadStepSounds(): Promise<void> {
    const bySurface = new Map<string, AudioBuffer[]>();
    for (const [_path, url] of Object.entries(_stepGlob)) {
      const parsed = _parseStepPath(_path);
      if (!parsed) {
        continue;
      }
      const buf = await this._fetchDecode(url);
      if (!buf) {
        continue;
      }
      let list = bySurface.get(parsed.surface);
      if (!list) {
        list = [];
        bySurface.set(parsed.surface, list);
      }
      list.push(buf);
    }
    // Sort each surface's variants by index so selection is deterministic.
    for (const [, list] of bySurface) {
      list.sort(() => Math.random() - 0.5); // shuffle
    }
    this._stepBuffers = bySurface;
  }

  private async _loadFallSounds(): Promise<void> {
    for (const [_path, url] of Object.entries(_fallGlob)) {
      const name = _parseFallPath(_path);
      if (!name) { 
        continue;
      }
      const buf = await this._fetchDecode(url);
      if (buf) {
        this._fallBuffers.set(name, buf);
      }
    }
  }

  private async _loadDigSounds(): Promise<void> {
    const bySurface = new Map<string, AudioBuffer[]>();
    for (const [_path, url] of Object.entries(_digGlob)) {
      const parsed = _parseStepPath(_path); // dig/ uses the same naming pattern
      if (!parsed) {
        continue;
      }
      const buf = await this._fetchDecode(url);
      if (!buf) {
        continue;
      }
      let list = bySurface.get(parsed.surface);
      if (!list) {
        list = [];
        bySurface.set(parsed.surface, list);
      }
      list.push(buf);
    }
    for (const [, list] of bySurface) {
      list.sort(() => Math.random() - 0.5);
    }
    this._digBuffers = bySurface;
  }

  private async _fetchDecode(url: string): Promise<AudioBuffer | null> {
    try {
      const resp = await fetch(url);
      const ab = await resp.arrayBuffer();
      return await this.context.decodeAudioData(ab);
    } catch (err) {
      console.warn('[audio] failed to load', url, err);
      return null;
    }
  }

  /**
   * Returns true once the AudioContext is ready and all sound buffers are loaded.
   */
  get ready(): boolean {
    return this._ctx !== null && this._ctx.state !== 'suspended';
  }

  // ── Frame update ────────────────────────────────────────────────────────

  /**
   * Must be called every frame to keep the 3D listener position in sync with
   * the camera. Also garbage-collects finished one-shot nodes.
   */
  updateListener(position: Vec3, forward: Vec3, up: Vec3): void {
    const ctx = this._ctx;
    if (!ctx || ctx.state !== 'running') {
      return;
    }

    const l = ctx.listener;
    if (l.positionX !== undefined) {
      l.positionX.value = position.x;
      l.positionY.value = position.y;
      l.positionZ.value = position.z;
      l.forwardX.value = forward.x;
      l.forwardY.value = forward.y;
      l.forwardZ.value = forward.z;
      l.upX.value = up.x;
      l.upY.value = up.y;
      l.upZ.value = up.z;
    } else {
      // Firefox fallback — use the deprecated setPosition / setOrientation
      (l as unknown as { setPosition: (x: number, y: number, z: number) => void }).setPosition(position.x, position.y, position.z);
      (l as unknown as { setOrientation: (fx: number, fy: number, fz: number, ux: number, uy: number, uz: number) => void }).setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
    }

    // Prune finished one-shots.
    for (let i = this._oneShots.length - 1; i >= 0; i--) {
      if (this._oneShots[i].done) {
        this._oneShots[i].dispose();
        this._oneShots.splice(i, 1);
      }
    }
  }

  // ── Playback ────────────────────────────────────────────────────────────

  /**
   * Plays a one-shot spatial sound at the given world position.
   *
   * @param buffer  Decoded audio buffer to play.
   * @param pos     World-space position of the sound.
   * @param volume  Gain multiplier (0–1).
   * @param pitch   Playback rate (1 = normal).
   */
  playBufferAt(buffer: AudioBuffer, pos: Vec3, volume = 1, pitch = 1): void {
    const ctx = this._ctx;
    if (!ctx || ctx.state !== 'running') {
      return;
    }

    const vol = volume * this.sfxVolume * this.masterVolume;
    if (vol <= 0) {
      return;
    }

    const oneShot = new OneShot(ctx, buffer, pos, vol, pitch);
    this._oneShots.push(oneShot);
  }

  /**
   * Plays a random footstep sound for the given surface at the given position.
   */
  playStep(surface: SurfaceGroup, pos: Vec3, volume = 1, pitch = 1): void {
    const list = this._stepBuffers.get(surface);
    if (!list || list.length === 0) {
      return;
    }
    const buf = list[Math.floor(Math.random() * list.length)];
    this.playBufferAt(buf, pos, volume, pitch);
  }

  /**
   * Plays a landing sound. `fallSpeed` is the downward velocity magnitude
   * just before landing — uses `fallbig` for hard landings.
   */
  playLand(_surface: SurfaceGroup, pos: Vec3, fallSpeed: number): void {
    const name = fallSpeed > 15 ? 'fallbig' : 'fallsmall';
    const buf = this._fallBuffers.get(name);
    if (!buf) {
      return;
    }
    // Landings are always at the player's feet position; distance attenuation
    // is minimal since it's the player who lands.
    this.playBufferAt(buf, pos, 0.6 + Math.min(fallSpeed / 30, 0.4));
  }

  /**
   * Plays a random dig sound for the given surface.
   */
  playDig(surface: SurfaceGroup, pos: Vec3): void {
    const list = this._digBuffers.get(surface);
    if (!list || list.length === 0) {
      return;
    }
    const buf = list[Math.floor(Math.random() * list.length)];
    this.playBufferAt(buf, pos, 0.8);
  }

  /**
   * Plays a non-spatial UI sound (e.g. menu click) through the master gain.
   */
  playUI(buffer: AudioBuffer, volume = 1): void {
    const ctx = this._ctx;
    if (!ctx || ctx.state !== 'running') {
      return;
    }
    const vol = volume * this.sfxVolume * this.masterVolume;
    if (vol <= 0) { 
      return;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = vol;
    src.connect(gain).connect(ctx.destination);
    src.start();
    src.onended = () => {
      src.disconnect();
      gain.disconnect();
    };
  }

  // ── Music ───────────────────────────────────────────────────────────────

  /**
   * Load a music track and start looping playback. Only one track plays at a
   * time; calling again replaces the current track.
   */
  async playMusic(url: string, volume?: number): Promise<void> {
    const ctx = this._ctx;
    if (!ctx) {
      return;
    }

    this.stopMusic();

    const buf = await this._fetchDecode(url);
    if (!buf) {
      return;
    }
    if (!this._musicGain) {
      this._musicGain = ctx.createGain();
      this._musicGain.connect(ctx.destination);
    }
    this._musicGain.gain.value = (volume ?? this.musicVolume) * this.masterVolume;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(this._musicGain);
    src.start();
    this._musicSource = src;
  }

  setMusicVolume(vol: number): void {
    this.musicVolume = vol;
    if (this._musicGain) {
      this._musicGain.gain.value = vol * this.masterVolume;
    }
  }

  stopMusic(): void {
    if (this._musicSource) {
      try { this._musicSource.stop(); } catch { /* already stopped */ }
      this._musicSource.disconnect();
      this._musicSource = null;
    }
  }

  fadeOutMusic(duration = 2): Promise<void> {
    return new Promise((resolve) => {
      if (!this._musicGain || !this._musicSource) {
        resolve();
        return;
      }
      const current = this._musicGain.gain.value;
      this._musicGain.gain.cancelScheduledValues(this.context.currentTime);
      this._musicGain.gain.setValueAtTime(current, this.context.currentTime);
      this._musicGain.gain.linearRampToValueAtTime(0, this.context.currentTime + duration);
      setTimeout(() => {
        this.stopMusic();
        resolve();
      }, duration * 1000);
    });
  }

  // ── Cleanup ─────────────────────────────────────────────────────────────

  dispose(): void {
    this.stopMusic();
    for (const os of this._oneShots) {
      os.dispose();
    }
    this._oneShots.length = 0;
    this._stepBuffers.clear();
    this._fallBuffers.clear();
    this._digBuffers.clear();
    if (this._ctx) {
      this._ctx.close().catch(() => {});
      this._ctx = null;
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// OneShot — a short-lived source + panner that auto-disposes when done.
// ────────────────────────────────────────────────────────────────────────────

class OneShot {
  private _src  : AudioBufferSourceNode;
  private _gain : GainNode;
  private _panner: PannerNode;
  //private _ctx  : AudioContext;
  private _finished = false;

  constructor(ctx: AudioContext, buffer: AudioBuffer, pos: Vec3, volume: number, pitch: number) {
    //this._ctx = ctx;

    this._gain = ctx.createGain();
    this._gain.gain.value = volume;

    this._panner = ctx.createPanner();
    this._panner.panningModel = 'HRTF';
    this._panner.distanceModel = 'inverse';
    this._panner.maxDistance = 50;
    this._panner.refDistance = 5;
    this._panner.rolloffFactor = 1;
    if (this._panner.positionX !== undefined) {
      this._panner.positionX.value = pos.x;
      this._panner.positionY.value = pos.y;
      this._panner.positionZ.value = pos.z;
    } else {
      (this._panner as unknown as { setPosition: (x: number, y: number, z: number) => void }).setPosition(pos.x, pos.y, pos.z);
    }

    this._src = ctx.createBufferSource();
    this._src.buffer = buffer;
    this._src.playbackRate.value = pitch;
    this._src.connect(this._gain);
    this._gain.connect(this._panner);
    this._panner.connect(ctx.destination);
    this._src.start();
    this._src.onended = () => { this._finished = true; };
  }

  get done(): boolean {
    return this._finished;
  }

  dispose(): void {
    try { this._src.stop(); } catch { /* already stopped */ }
    this._src.disconnect();
    this._gain.disconnect();
    this._panner.disconnect();
  }
}
