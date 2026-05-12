// Public re-exports for the GameObject/Component-based engine layer.
export { Component } from './component.js';
export { GameObject } from './game_object.js';
export { Scene } from './scene.js';
export { Camera } from './components/camera.js';
export { DirectionalLight } from './components/directional_light.js';
export { PointLight } from './components/point_light.js';
export { SpotLight  } from './components/spot_light.js';
export { MeshRenderer } from './components/mesh_renderer.js';
export { AnimatedModel } from './components/animated_model.js';
export { Skeleton } from './skeleton.js';
export { CameraControls } from './camera_controls.js';
export { PlayerController } from './player_controller.js';
export { AudioSource } from './components/audio_source.js';
export type { SurfaceGroup } from './audio_surface.js';
export { blockTypeToSurface } from './audio_surface.js';
export type { Material } from './components/mesh_renderer.js';
export type { CascadeData } from './components/directional_light.js';
export type { AnimationClip, AnimationChannel, Interpolation } from './animation.js';
