# Crafty: Building a WebGPU Voxel Game Engine

This book explores real-time graphics programming through the lens of **Crafty**,
an open-source WebGPU voxel game engine written in TypeScript.

![Crafty](images/crafty.png)

## Who this is for

You have written a few small graphics demos and want to understand how a
complete, multi-pass deferred renderer works end-to-end. You are comfortable
with TypeScript or a C-family language and have a basic understanding of linear
algebra. You do *not* need prior WebGPU experience — we cover the API from the
ground up.

## What you will learn

| Topic | What we build |
|-------|---------------|
| WebGPU fundamentals | Device, queue, buffers, textures, bind groups |
| Shader authoring | WGSL — vertex, fragment, compute |
| Render graph architecture | Multi-pass deferred rendering |
| PBR lighting | Directional + point + spot, IBL, BRDF |
| Shadow algorithms | Cascade shadow maps, VSM, spot shadows |
| GPU particle systems | Compute-based spawn/update/compact, billboard rendering |
| Post-processing | Bloom, TAA, SSAO, DOF, tone-mapping |
| Terrain rendering | Chunked voxel world, greedy meshing, LOD |
| Game engine design | Component/entity system, scene graph |
| Networking | WebSocket multiplayer, state sync, snapshot interpolation |
| Performance | GPU timestamps, pipeline barriers, async compilation |

## How to read this book

The canonical companion is the Crafty source tree at
<https://github.com/brendan-duncan/crafty>.  Each chapter cross-references the
relevant source files — you are encouraged to open them side-by-side.

Code blocks are either **annotated excerpts** (showing the key logic) or
**complete listings** (the entire file).  Excerpts use `// ── ... ──` markers
to indicate elided boilerplate.

## The Crafty philosophy

> **Write it once, understand it forever.**

No black boxes.  Every system is built from scratch — we import only the
WebGPU API and the standard library.  If we use a third-party tool (e.g. a
texture compressor), we explain why and how it fits.

## Directory layout

```
crafty/
├── docs/                  # This book
├── src/                   # Core engine library
│   ├── math/              # Vec3, Mat4, Quaternion, etc.
│   ├── engine/            # Scene graph, components, materials
│   ├── assets/            # Mesh, Texture, shader loading
│   ├── block/             # Voxel world, chunks, biomes
│   └── renderer/          # WebGPU render graph & passes
├── crafty/                # Game application
│   ├── game/              # Multiplayer, player, interactions
│   ├── ui/                # HUD, hotbar, start screen
├── samples/               # Self-contained demos
└── server/                # Multiplayer server
```

## Status

This book is a work in progress.  Chapters are added as the engine evolves.

## Table of Contents

## I — Foundations

- [Chapter 1: Introduction](chapters/01-introduction.md)
  - 1.1 What is Crafty?
  - 1.2 A Brief History of Graphics APIs
  - 1.3 Why WebGPU?
  - 1.4 Literate Programming with This Book
  - 1.5 Setting Up the Development Environment
  - 1.6 The Crafty Codebase at a Glance

- [Chapter 2: 3D Mathematics](chapters/02-mathematics.md)
  - 2.1 Coordinate Systems and Conventions
  - 2.2 Vectors (Vec2, Vec3, Vec4)
  - 2.3 Matrices (Mat4)
  - 2.4 Quaternions
  - 2.5 Transform Composition (TRS)
  - 2.6 Coordinate Space Transformations
  - 2.7 Random Rumbers and Noise

- [Chapter 3: WebGPU Fundamentals](chapters/03-webgpu-fundamentals.md)
  - 3.1 The Graphics Pipeline
  - 3.2 GPUDevice and GPUAdapter
  - 3.3 GPUBuffer — Uploading Data to the GPU
  - 3.4 GPUTexture — Images and Render Targets
  - 3.5 GPUSampler — Filtering and Addressing
  - 3.6 GPUBindGroup and GPUBindGroupLayout
  - 3.7 GPUShaderModule and WGSL
  - 3.8 GPURenderPipeline and GPUComputePipeline
  - 3.9 GPUCommandEncoder and GPUQueue
  - 3.10 The RenderContext Abstraction

## II — Rendering

- [Chapter 4: Rendering Architecture](chapters/04-rendering-architecture.md)
  - 4.1 The Render Graph
  - 4.2 Render Passes
    - Pass Construction Pattern
    - Per-Frame Update Pattern
  - 4.3 Multi-Pass Deferred Rendering
    - Why Deferred?
    - The Deferred Pipeline
    - Forward Rendering
  - 4.4 HDR Rendering Pipeline
    - The HDR Target
    - Tone Mapping
  - 4.5 The GBuffer
    - GBuffer Fill Strategy
  - 4.6 Swap Chain and Presentation
    - Canvas Resize

- [Chapter 5: Meshes and Geometry](chapters/05-meshes.md)
  - 5.1 Vertex and Index Buffers
    - Vertex Layout
    - Buffer Creation
  - 5.2 Vertex Attributes and Layouts
  - 5.3 The Mesh Asset Type
  - 5.4 Procedural Geometry
    - Plane
    - Cube
    - UV Sphere
    - Cone
  - 5.5 Skinned Meshes and Skeletons
    - Dual-Quaternion Skinning
  - 5.6 Animation
  - 5.7 GLTF 2.0 Binary Loader
    - GLB Container Format
    - Accessor Decoding
    - Tangent Generation
    - Vertex Packing
    - Material and Texture Resolution
    - Skeleton and Animation Import

- [Chapter 6: Textures and Materials](chapters/06-textures-materials.md)
  - 6.1 2D, 3D, and Cube Textures
  - 6.2 Texture Loading
    - Runtime Loading
    - HDR / RGBE Environment Maps
    - Block Texture Atlas
  - 6.3 Textures in the GBuffer
  - 6.4 The PBR Material System
    - Material Pass Types
    - Shared Bind Group Slot
    - Pipeline Caching
    - Material Update Pattern
  - 6.5 Material Passes
  - 6.6 Shader Management and Caching
    - Common Shader Module

- [Chapter 7: Lighting](chapters/07-lighting.md)
  - 7.1 Physically-Based Rendering Theory
  - 7.2 The Directional Light (Sun)
    - Directional Light in the Lighting Pass
  - 7.3 Point Lights
    - Shadow Mapping Point Lights
  - 7.4 Spot Lights
    - Spot Light Attenuation
  - 7.5 Image-Based Lighting (IBL)
  - 7.6 The BRDF
  - 7.7 The Deferred Lighting Pass
  - 7.8 The Forward Lighting Path
    - Forward+ (Tiled Shading)
  - 7.9 GPU-Based IBL Pre-Computation
    - BRDF LUT (CPU)
    - Irradiance Map (GPU Compute)
    - GGX Prefiltered Environment Map (GPU Compute)

- [Chapter 8: Shadow Mapping](chapters/08-shadow-mapping.md)
  - 8.1 Shadow Map Theory
    - Shadow Bias
  - 8.2 Cascade Shadow Maps (CSM)
    - Cascade Setup
    - Cascade Partioning
    - Rendering Cascades
    - Cascade Selection in the Lighting Pass
  - 8.3 Variance Shadow Maps (VSM)
  - 8.4 Spot Light Shadows
  - 8.5 Point Light (Omnidirectional) Shadows
  - 8.6 Shadow Sampling and Filtering
    - Percentage-Closer Filtering (PCF)
    - VSM Blurring
  - 8.7 Shadow Acne and Peter Panning
  - 8.8 Percentage-Closer Soft Shadows (PCSS)

- [Chapter 9: GPU Particle System](chapters/09-particle-system.md)
  - 9.1 Architecture Overview
  - 9.2 Particle Graph Config
    - EmitterNode
    - ModifierNode
    - RenderNode
  - 9.3 The Particle Struct
  - 9.4 GPU Buffers
  - 9.5 The Spawn Stage
    - Spawn Shapes
  - 9.6 The Update Stage
    - Curl Noise Turbulence
    - Block Collision
  - 9.7 The Compact Stage
  - 9.8 The Render Stage
    - Forward HDR (Transparent)
    - Deferred GBuffer (Opaque)
  - 9.9 Per-Frame CPU Upload
  - 9.10 Runtime Spawn Rate Adjustment
  - 9.11 Rain and Snow Configurations
    - Rain
    - Snow

- [Chapter 10: Sky and Atmosphere](chapters/10-sky-atmosphere.md)
  - 10.1 HDR Environment Maps
    - RGBE decoding
  - 10.2 Atmospheric Sky
    - Single Scattering Approximation
  - 10.3 Cloud rendering
    - Silver's Multi-Scattering Approximation
    - Cloud Noise Texture Generation
  - 10.4 Volumetric Fog
  - 10.5 Cloud Shadows
  - 10.6 Oren-Nayer Diffuse Ground
  - 10.7 Ozone Absorption (Chappuis Band)

- [Chapter 11: Terrain and Voxel World](chapters/11-terrain.md)
  - 11.1 Voxel Data Structure
  - 11.2 Chunk Management
    - Frustum Culling
  - 11.3 Procedural World Generation
    - Noise-Based Terrain
    - Biomes
    - Ores and Caves
  - 11.4 Greedy meshing
    - Algorithm
    - Separate Opaque and Transparent Meshes
  - 11.5 Level-of-Detail (LOD)
  - 11.6 Block Interaction
    - Ray Casting
    - Block Placement and Breaking
  - 11.7 Erosion Simulation
  - 11.8 Water Propogation
    - Flow Rules
    - Performance Optimizations
  - 11.9 Water Rendering
    - Screen-Space Refraction
    - Depth-Based Attenuation
    - Screen-Space reflection + Sky Fallback
  - 11.10 Screen-Space Reflections (SSR)
    - Algorithm
    - Confidence Blending
    - Fresnel Blend
  - 11.11 Village Generation
    - Site Selection
    - House Placement
    - House Template

- [Chapter 12: Post-Processing](chapters/12-post-processing.md)
  - 12.1 Tone Mapping and HDR Display
    - ACES Filmic Tone Mapping
    - HDR Passthrough
    - Gamma Correction
  - 12.2 Bloom
  - 12.3 Temporal Anti-Aliasing (TAA)
    - Jitter
    - Reprojection
    - Neighborhood Clamping
  - 12.4 Screen-Space Ambient Occlusion (SSAO)
    - Algorithm
    - Bilateral Blur
  - 12.5 Depth of Field (DOF)
    - Circle of Confusion
    - Seperable Blur
  - 12.6 God Rays (Crepuscular Rays)
    - Radial Blur from Light Source
  - 12.7 Auto-Exposure
    - Histogram Computation
    - Average Luminance
  - 12.8 Color Grading
  - 12.9 Underwater Screen-Space Effects
    - UV Distortion
    - Color Tint and Vignette

## III — Game Engine

- [Chapter 13: Game Engine Design](chapters/13-game-engine.md)
  - 13.1 The Component/Entity System
  - 13.2 GameObject and Component
  - 13.3 The Scene Graph
  - 13.4 The game Loop
  - 13.5 Input Handling
  - 13.6 Camera Controls
  - 13.7 The Player Controller
  - 13.8 Touch Controls (Mobile)
    - Lazy Initialization
    - Virtual Joystick
    - Camera Look
    - Action Buttons
    - Layout and Hotbar Clearance

- [Chapter 14: Physics and Interaction](chapters/14-physics.md)
  - 14.1 Collision Detection (AABB)
  - 14.2 Player Movement and Gravity
    - Coyote Time and Variable Jump Height
  - 14.3 Block Ray Casting
  - 14.4 Block Interaction

- [Chapter 15: NPC AI](chapters/15-npc-ai.md)
  - 15.1 NPC Architecture
  - 15.2 The AI State Machine
    - Idle
    - Wander
    - Flee
    - Follow
    - Chase
    - Detonate
  - 15.3 Duck AI
  - 15.4 Duckling AI
  - 15.5 Pig AI
  - 15.6 Creeper AI
    - Four-State Machine
    - Idle
    - Chase
    - Detonate
    - Explosion
    - Flash Visual
    - Spawning
  - 15.7 Gravity and Ground Collision
  - 15.8 Head Bob Animation
  - 15.9 Animated Models and Skeletal Animation
  - 15.10 Mob Spawning Mechanics
    - Column-Level Deduplication
    - Spawn Conditions
    - Spawn Resolution
    - Helper Functions for Debugging
    - Summary of Spawn Flow
  - 15.11 Extending the NPC System

- [Chapter 16: Weather System](chapters/16-weather-system.md)
  - 16.1 Weather Types
  - 16.2 Biome Weather Tables
  - 16.3 Dynamic Weather Transitions
  - 16.4 Cloud Coverage Mapping
  - 16.5 Precipitation Control
  - 16.6 Integration in the Frame Loop
  - 16.7 Debug Overlay Display

- [Chapter 17: Audio](chapters/17-audio.md)
  - 17.1 Web Audio API Fundamentals
  - 17.2 Spatial Audio
  - 17.3 Sound Effect Triggers
  - 17.4 Ambient and Music

- [Chapter 18: User Interface](chapters/18-user-interface.md)
  - 18.1 DOM-based UI vs. In-Game UI
  - 18.2 The HUD
  - 18.3 The Start Screen
  - 18.4 The Settings Panel
  - 18.5 The Block Manager

## IV — Multiplayer

- [Chapter 19: Network Architecture](chapters/19-network-architecture.md)
  - 19.1 WebSocket Fundamentals
  - 19.2 Message Protocol Design
  - 19.3 Connection Lifecycle
  - 19.4 The Server Architecture
    - Server-Side Authorisation
  - 19.5 World State Persistence

- [Chapter 20: Multiplayer Gameplay](chapters/20-multiplayer-gameplay.md)
  - 20.1 Player State Synchronisation
  - 20.2 Snapshot Interpolation
  - 20.3 Remote Player Rendering
  - 20.4 Name Labels
  - 20.5 Block Edit Replication
  - 20.6 Latency Compensation

## V — Advanced Topics

- [Chapter 21: Performance](chapters/21-performance.md)
  - 21.1 GPU Timestamps and Profiling
  - 21.2 Async Shader Compilation
  - 21.3 Frustum Culling
  - 21.4 Occlusion Culling
  - 21.5 Draw Call Batching
  - 21.6 Memory Management
    - Pre-Allocated Staging Arrays
    - Buffer Pooling
    - Texture Management

- [Chapter 22: Tools and Workflow](chapters/22-tools.md)
  - 22.1 The Sample Framework
  - 22.2 Testing Strategy
  - 22.3 Debugging WebGPU
    - Validation Errors
    - Shader Debugging
    - WebGPU Inspector (Chrome Extension)
  - 22.4 Asset Pipeline
    - Texture Atlas Buidling
    - HDR Map Preprocessing
  - 22.5 Continuous Integration

- [Chapter 23: The Road Ahead](chapters/23-road-ahead.md)
  - 23.1 Ray Tracing with WebGPU
  - 23.2 Compute Shader Post-Processing
  - 23.3 Procedural Generation at Scale
  - 23.4 WebXR
  - 23.5 Closing Thoughts

## Appendices

- [Appendix A: WGSL Quick Reference](appendix/wgsl-ref.md)
- [Appendix B: WebGPU API Reference](appendix/webgpu-ref.md)
- [Appendix C: Mathematics Reference](appendix/math-ref.md)
- [Appendix D: Glossary](appendix/glossary.md)
