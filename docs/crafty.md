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
  - 1.2 A brief history of graphics APIs
  - 1.3 Why WebGPU?
  - 1.4 Literate programming with this book
  - 1.5 Setting up the development environment
  - 1.6 The Crafty codebase at a glance

- [Chapter 2: 3D Mathematics](chapters/02-mathematics.md)
  - 2.1 Coordinate systems and conventions
  - 2.2 Vectors (Vec2, Vec3, Vec4)
  - 2.3 Matrices (Mat4)
  - 2.4 Quaternions
  - 2.5 Transform composition (TRS)
  - 2.6 Coordinate space transformations
  - 2.7 Random numbers and noise

- [Chapter 3: WebGPU Fundamentals](chapters/03-webgpu-fundamentals.md)
  - 3.1 The graphics pipeline
  - 3.2 GPUDevice and GPUAdapter
  - 3.3 GPUBuffer — uploading data to the GPU
  - 3.4 GPUTexture — images and render targets
  - 3.5 GPUSampler — filtering and addressing
  - 3.6 GPUBindGroup and GPUBindGroupLayout
  - 3.7 GPUShaderModule and WGSL
  - 3.8 GPURenderPipeline and GPUComputePipeline
  - 3.9 GPUCommandEncoder and GPUQueue
  - 3.10 The RenderContext abstraction

## II — Rendering

- [Chapter 4: Rendering Architecture](chapters/04-rendering-architecture.md)
  - 4.1 The render graph
  - 4.2 Render passes
  - 4.3 Multi-pass deferred rendering
  - 4.4 HDR rendering pipeline
  - 4.5 The GBuffer
  - 4.6 Swap chain and presentation

- [Chapter 5: Meshes and Geometry](chapters/05-meshes.md)
  - 5.1 Vertex and index buffers
  - 5.2 Vertex attributes and layouts
  - 5.3 The Mesh asset type
  - 5.4 Procedural geometry — cubes, planes, spheres
  - 5.6 Skinned meshes and skeletons
  - 5.7 Animation — clips, sampling, blending

- [Chapter 6: Textures and Materials](chapters/06-textures-materials.md)
  - 6.1 2D, 3D, and cube textures
  - 6.2 Texture loading (PNG, HDR)
  - 6.3 Block texture atlas
  - 6.4 The PBR material system
  - 6.5 Material passes (opaque, transparent, shadow)
  - 6.6 Shader management and caching

- [Chapter 7: Lighting](chapters/07-lighting.md)
  - 7.1 Physically-based rendering theory
  - 7.2 The directional light (sun)
  - 7.3 Point lights
  - 7.4 Spot lights
  - 7.5 Image-based lighting (IBL)
  - 7.6 The BRDF
  - 7.7 The deferred lighting pass
  - 7.8 The forward lighting path

- [Chapter 8: Shadow Mapping](chapters/08-shadow-mapping.md)
  - 8.1 Shadow map theory
  - 8.2 Cascade shadow maps (CSM)
  - 8.3 Variance shadow maps (VSM)
  - 8.4 Spot light shadows
  - 8.5 Point light (omnidirectional) shadows
  - 8.6 Shadow sampling and filtering
  - 8.7 Shadow acne and Peter Panning

- [Chapter 9: GPU Particle System](chapters/09-particle-system.md)
  - 9.1 Architecture Overview
  - 9.2 Particle Graph Config
  - 9.3 The Particle Struct
  - 9.4 GPU Buffers
  - 9.5 The Spawn Stage
  - 9.6 The Update Stage
  - 9.7 The Compact Stage
  - 9.8 The Render Stage
  - 9.9 Per-Frame CPU Upload
  - 9.10 Runtime Spawn Rate Adjustment
  - 9.11 Rain and Snow Configurations

- [Chapter 10: Sky and Atmosphere](chapters/10-sky-atmosphere.md)
  - 10.1 HDR environment maps
  - 10.2 Sky texture pass
  - 10.3 Cloud rendering
  - 10.4 Volumetric fog
  - 10.5 Cloud shadows

- [Chapter 11: Terrain and Voxel World](chapters/11-terrain.md)
  - 11.1 Voxel data structure
  - 11.2 Chunk management
    - Frustum culling
  - 11.3 Procedural world generation
    - Noise based terrain
    - Biomes
    - Ores and caves
  - 11.4 Greedy meshing
  - 11.5 Level-of-detail (LOD)
  - 11.6 Block interaction
    - Ray casting
    - Block placement and breaking
  - 11.7 Erosion simulation
  - 11.8 Water propogation
    - Flow rules
    - Performance optimizations
  - 11.9 Water rendering
    - Screen space refraction
    - Depth based attenuation
  - 11.10 Screen space reflection
    - Confidence blending
    - Fresnel blend
  - 11.11 Village generation
    - Site selection
    - House placement
    - House template

- [Chapter 12: Weather System](chapters/12-weather-system.md)
  - 12.1 Weather types
  - 12.2 Biome weather tables
  - 12.3 Dynamic weather transitions
  - 12.4 Cloud coverage mapping
  - 12.5 Precipitation control
  - 12.6 Integration in the frame loop
  - 12.7 Debug overlay display

- [Chapter 13: Post-Processing](chapters/13-post-processing.md)
  - 13.1 Tone mapping and HDR display
  - 13.2 Bloom
  - 13.3 Temporal anti-aliasing (TAA)
  - 13.4 Screen-space ambient occlusion (SSAO)
  - 13.5 Depth of field (DOF)
  - 13.6 God rays (crepuscular rays)
  - 13.7 Auto-exposure
  - 13.8 Color grading

## III — Game Engine

- [Chapter 14: Game Engine Design](chapters/14-game-engine.md)
  - 14.1 The component/entity system
  - 14.2 GameObject and Component
  - 14.3 The Scene graph
  - 14.4 The game loop
  - 14.5 Input handling (keyboard, mouse, touch)
  - 14.6 Camera controls
  - 14.7 The player controller
  - 14.8 Touch Controls (Mobile)

- [Chapter 15: Physics and Interaction](chapters/15-physics.md)
  - 15.1 Collision detection (AABB)
  - 15.2 Player movement and gravity
  - 15.3 Block ray casting
  - 15.4 Block interaction (placement, breaking)

- [Chapter 16: NPC AI](chapters/16-npc-ai.md)
  - 16.1 NPC Architecture
  - 16.2 The AI State Machine
  - 16.3 Duck AI — Three-State Behaviour
  - 16.4 Duckling AI — Follow Behaviour
  - 16.5 Pig AI — Two-State Wandering
  - 16.6 Gravity and Ground Collision
  - 16.7 Head Bob Animation
  - 16.8 Animated Models and Skeletal Animation
  - 16.9 Extending the NPC System

- [Chapter 17: Audio](chapters/17-audio.md)
  - 17.1 Web Audio API fundamentals
  - 17.2 Spatial audio
  - 17.3 Sound effect triggers
  - 17.4 Ambient and music

- [Chapter 18: User Interface](chapters/18-user-interface.md)
  - 18.1 DOM-based UI vs. in-game UI
  - 18.2 The HUD (crosshair, hotbar, stats)
  - 18.3 The start screen (local, network, world management)
  - 18.4 The settings panel
  - 18.5 The block manager

## IV — Multiplayer

- [Chapter 19: Network Architecture](chapters/19-network-architecture.md)
  - 19.1 WebSocket fundamentals
  - 19.2 Message protocol design (C2S / S2C)
  - 19.3 Connection lifecycle (lobby, join, in-game)
  - 19.4 The server architecture
  - 19.5 World state persistence

- [Chapter 20: Multiplayer Gameplay](chapters/20-multiplayer-gameplay.md)
  - 20.1 Player state synchronisation
  - 20.2 Snapshot interpolation
  - 20.3 Remote player rendering
  - 20.4 Name labels
  - 20.5 Block edit replication
  - 20.6 Latency compensation

## V — Advanced Topics

- [Chapter 21: Performance](chapters/21-performance.md)
  - 21.1 GPU timestamps and profiling
  - 21.2 Async shader compilation
  - 21.3 Frustum culling
  - 21.4 Occlusion culling
  - 21.5 Draw call batching
  - 21.6 Memory management

- [Chapter 22: Tools and Workflow](chapters/22-tools.md)
  - 22.1 The sample framework
  - 22.2 Testing strategy (unit, integration, visual)
  - 22.3 Debugging WebGPU
  - 22.4 Asset pipeline
  - 22.5 Continuous integration

- [Chapter 23: The Road Ahead](chapters/23-road-ahead.md)
  - 23.1 Ray tracing with WebGPU
  - 23.2 Compute shader post-processing
  - 23.3 Procedural generation at scale
  - 23.4 WebXR

## Appendices

- [Appendix A: WGSL Quick Reference](appendix/wgsl-ref.md)
- [Appendix B: WebGPU API Reference](appendix/webgpu-ref.md)
- [Appendix C: Mathematics Reference](appendix/math-ref.md)
- [Appendix D: Glossary](appendix/glossary.md)
