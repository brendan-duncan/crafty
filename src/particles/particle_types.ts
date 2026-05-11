/**
 * Geometric region used by an emitter to choose initial particle position and velocity direction.
 */
export type SpawnShape =
  | { kind: 'sphere'; radius: number; solidAngle: number }   // solidAngle in [0,PI]: 0=forward ray, PI=full sphere
  | { kind: 'cone';   radius: number; angle: number }         // angle = half-cone angle in radians
  | { kind: 'box';    halfExtents: [number, number, number] };

/**
 * Describes how a particle system spawns new particles each frame.
 */
export interface EmitterNode {
  /** Maximum particles alive at once; sizes the GPU particle buffer. */
  maxParticles: number;
  /** Continuous emission rate in particles per second. */
  spawnRate: number;
  /** Per-particle lifetime range, sampled uniformly per spawn. */
  lifetime: [min: number, max: number];
  /** Region used to seed initial position and direction. */
  shape: SpawnShape;
  /** Initial speed range along the spawn direction, sampled uniformly per spawn. */
  initialSpeed: [min: number, max: number];
  /** Starting RGBA color (linear, premultiplied alpha not assumed). */
  initialColor: [r: number, g: number, b: number, a: number];
  /** Starting size range in world units, sampled uniformly per spawn. */
  initialSize: [min: number, max: number];
  /** PBR roughness used by the lit particle renderer. */
  roughness: number;
  /** PBR metallic used by the lit particle renderer. */
  metallic: number;
}

/**
 * Per-frame behavior applied to live particles in the update compute pass.
 */
export type ModifierNode =
  | { type: 'gravity';             strength: number }
  | { type: 'drag';                coefficient: number }
  | { type: 'force';               direction: [number, number, number]; strength: number }
  | { type: 'swirl_force';         speed: number; strength: number }
  | { type: 'vortex';              strength: number }
  | { type: 'curl_noise';          scale: number; strength: number; timeScale: number; octaves?: number }
  | { type: 'size_random';         min: number; max: number }
  | { type: 'size_over_lifetime';  start: number; end: number }
  | { type: 'color_over_lifetime'; startColor: [number, number, number, number];
                                   endColor:   [number, number, number, number] }
  | { type: 'block_collision' };

/**
 * How particles are rasterized to the framebuffer.
 */
export type RenderNode =
  | { type: 'sprites'; blendMode: 'additive' | 'alpha'; billboard: 'camera' | 'velocity'; shape?: 'soft' | 'pixel'; renderTarget?: 'gbuffer' | 'hdr' }
  | { type: 'points' };

/**
 * One-shot actions triggered at a specific point in a particle's life.
 */
export interface EventNode {
  /** When to fire the actions: at spawn time, or just before the particle is recycled. */
  trigger: 'on_spawn' | 'on_death';
  /** Modifier snippets executed once at the trigger point. */
  actions: ModifierNode[];
}

/**
 * Full description of a particle system, consumed by the particle pass and shader builders.
 */
export interface ParticleGraphConfig {
  emitter: EmitterNode;
  modifiers: ModifierNode[];
  renderer: RenderNode;
  events?: EventNode[];
}
