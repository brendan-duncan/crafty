/**
 * Renderer barrel module.
 *
 * Re-exports the render-graph framework (RenderContext, RenderGraph,
 * RenderPass, GBuffer) along with all built-in render passes (shadow, sky,
 * geometry, lighting, post-processing, etc.) and their associated settings
 * types. See the individual pass modules for per-symbol documentation.
 */
export { RenderContext } from './render_context.js';
export { RenderPass } from './render_pass.js';
export { RenderGraph } from './render_graph.js';
export { GBuffer } from './gbuffer.js';
export { ShadowPass } from './passes/shadow_pass.js';
export { SkyTexturePass as SkyPass } from './passes/sky_texture_pass.js';
export { AtmospherePass } from './passes/atmosphere_pass.js';
export { BlockHighlightPass } from './passes/block_highlight_pass.js';
export { CloudPass } from './passes/cloud_pass.js';
export { CloudShadowPass } from './passes/cloud_shadow_pass.js';
export { TAAPass } from './passes/taa_pass.js';
export { BloomPass } from './passes/bloom_pass.js';
export { GodrayPass } from './passes/godray_pass.js';
export { CompositePass } from './passes/composite_pass.js';
export { TonemapPass } from './passes/tonemap_pass.js';
export { GeometryPass } from './passes/geometry_pass.js';
export { WorldGeometryPass } from './passes/world_geometry_pass.js';
export { SkinnedGeometryPass } from './passes/skinned_geometry_pass.js';
export { LightingPass } from './passes/lighting_pass.js';
export { DofPass } from './passes/dof_pass.js';
export { SSAOPass } from './passes/ssao_pass.js';
export { SSGIPass } from './passes/ssgi_pass.js';
export { PointSpotShadowPass } from './passes/point_spot_shadow_pass.js';
export { WaterPass } from './passes/water_pass.js';
export { WorldShadowPass } from './passes/world_shadow_pass.js';
export { PointSpotLightPass } from './passes/point_spot_light_pass.js';
export { DebugLightPass } from './passes/debug_light_pass.js';
export { ParticlePass } from './passes/particle_pass.js';
export { AutoExposurePass } from './passes/auto_exposure_pass.js';
