export type SpawnShape =
  | { kind: 'sphere'; radius: number; solidAngle: number }   // solidAngle in [0,PI]: 0=forward ray, PI=full sphere
  | { kind: 'cone';   radius: number; angle: number }         // angle = half-cone angle in radians
  | { kind: 'box';    halfExtents: [number, number, number] };

export interface EmitterNode {
  maxParticles : number;
  spawnRate    : number;                            // particles/second
  lifetime     : [min: number, max: number];
  shape        : SpawnShape;
  initialSpeed : [min: number, max: number];
  initialColor : [r: number, g: number, b: number, a: number];
  initialSize  : [min: number, max: number];
  roughness    : number;
  metallic     : number;
}

export type ModifierNode =
  | { type: 'gravity';             strength: number }
  | { type: 'drag';                coefficient: number }
  | { type: 'force';               direction: [number, number, number]; strength: number }
  | { type: 'curl_noise';          scale: number; strength: number; timeScale: number }
  | { type: 'size_over_lifetime';  start: number; end: number }
  | { type: 'color_over_lifetime'; startColor: [number, number, number, number];
                                   endColor:   [number, number, number, number] };

export type RenderNode =
  | { type: 'sprites'; blendMode: 'additive' | 'alpha'; billboard: 'camera' | 'velocity' }
  | { type: 'points' };

export interface EventNode {
  trigger : 'on_spawn' | 'on_death';
  actions : ModifierNode[];
}

export interface ParticleGraphConfig {
  emitter   : EmitterNode;
  modifiers : ModifierNode[];
  renderer  : RenderNode;
  events?   : EventNode[];
}
