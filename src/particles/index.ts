// Public re-export barrel for the particle system: graph node types consumed
// by `ParticlePass` (under `src/renderer/render_graph/passes/`).

export type {
  SpawnShape,
  EmitterNode,
  ModifierNode,
  RenderNode,
  EventNode,
  ParticleGraphConfig,
} from './particle_types.js';
