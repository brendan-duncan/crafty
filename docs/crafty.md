# Crafty: Building a WebGPU Voxel Game Engine

This book explores real-time graphics programming through the lens of **Crafty**,
an open-source WebGPU voxel game engine written in TypeScript.

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
│   └── samples/           # Self-contained demos
└── server/                # Multiplayer server
```

## Status

This book is a work in progress.  Chapters are added as the engine evolves.

## Table of Contents

## I — Foundations

- [Chapter 1: Introduction](chapter/01-introduction.md)
  - 1.1 What is Crafty?
  - 1.2 A brief history of graphics APIs
  - 1.3 Why WebGPU?
  - 1.4 Literate programming with this book
  - 1.5 Setting up the development environment
  - 1.6 The Crafty codebase at a glance

- [Chapter 2: 3D Mathematics](chapter/02-mathematics.md)
  - 2.1 Coordinate systems and conventions
  - 2.2 Vectors (Vec2, Vec3, Vec4)
  - 2.3 Matrices (Mat4)
  - 2.4 Quaternions
  - 2.5 Transform composition (TRS)
  - 2.6 Coordinate space transformations
  - 2.7 Random numbers and noise

- [Chapter 3: WebGPU Fundamentals](chapter/03-webgpu-fundamentals.md)
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

- [Chapter 4: Rendering Architecture](chapter/04-rendering-architecture.md)
  - 4.1 The render graph
  - 4.2 Render passes
  - 4.3 Multi-pass deferred rendering
  - 4.4 HDR rendering pipeline
  - 4.5 The GBuffer
  - 4.6 Swap chain and presentation

- [Chapter 5: Meshes and Geometry](chapter/05-meshes.md)
  - 5.1 Vertex and index buffers
  - 5.2 Vertex attributes and layouts
  - 5.3 The Mesh asset type
  - 5.4 Procedural geometry — cubes, planes, spheres
  - 5.6 Skinned meshes and skeletons
  - 5.7 Animation — clips, sampling, blending

- [Chapter 6: Textures and Materials](chapter/06-textures-materials.md)
  - 6.1 2D, 3D, and cube textures
  - 6.2 Texture loading (PNG, HDR)
  - 6.3 Block texture atlas
  - 6.4 The PBR material system
  - 6.5 Material passes (opaque, transparent, shadow)
  - 6.6 Shader management and caching

- [Chapter 7: Lighting](chapter/07-lighting.md)
  - 7.1 Physically-based rendering theory
  - 7.2 The directional light (sun)
  - 7.3 Point lights
  - 7.4 Spot lights
  - 7.5 Image-based lighting (IBL)
  - 7.6 The BRDF
  - 7.7 The deferred lighting pass
  - 7.8 The forward lighting path

- [Chapter 8: Shadow Mapping](chapter/08-shadow-mapping.md)
  - 8.1 Shadow map theory
  - 8.2 Cascade shadow maps (CSM)
  - 8.3 Variance shadow maps (VSM)
  - 8.4 Spot light shadows
  - 8.5 Point light (omnidirectional) shadows
  - 8.6 Shadow sampling and filtering
  - 8.7 Shadow acne and Peter Panning

- [Chapter 9: Post-Processing](chapter/09-post-processing.md)
  - 9.1 Tone mapping and HDR display
  - 9.2 Bloom
  - 9.3 Temporal anti-aliasing (TAA)
  - 9.4 Screen-space ambient occlusion (SSAO)
  - 9.5 Depth of field (DOF)
  - 9.6 God rays (crepuscular rays)
  - 9.7 Auto-exposure
  - 9.8 Color grading

- [Chapter 10: Sky and Atmosphere](chapter/10-sky-atmosphere.md)
  - 10.1 HDR environment maps
  - 10.2 Sky texture pass
  - 10.3 Cloud rendering
  - 10.4 Volumetric fog
  - 10.5 Weather effects (rain, snow)

- [Chapter 11: Terrain and Voxel World](chapter/11-terrain.md)
  - 11.1 Voxel data structure
  - 11.2 Chunk management
  - 11.3 Procedural world generation (noise, biomes)
  - 11.4 Greedy meshing
  - 11.5 Level-of-detail (LOD)
  - 11.6 Block interaction (place, break)
  - 11.7 Erosion simulation
  - 11.8 Water rendering

- [Chapter 12: Weather System](chapter/12-weather-system.md)
  - 12.1 Weather types
  - 12.2 Biome weather tables
  - 12.3 Dynamic weather transitions
  - 12.4 Cloud coverage mapping
  - 12.5 Precipitation control
  - 12.6 Integration in the frame loop
  - 12.7 Debug overlay display

## III — Game Engine

- [Chapter 13: Game Engine Design](chapter/13-game-engine.md)
  - 13.1 The component/entity system
  - 13.2 GameObject and Component
  - 13.3 The Scene graph
  - 13.4 The game loop
  - 13.5 Input handling (keyboard, mouse, touch)
  - 13.6 Camera controls
  - 13.7 The player controller
  - 13.8 Touch Controls (Mobile)

- [Chapter 14: Physics and Interaction](chapter/14-physics.md)
  - 14.1 Collision detection (AABB)
  - 14.2 Player movement and gravity
  - 14.3 Block ray casting
  - 14.4 Block interaction (placement, breaking)
  - 14.5 Animal AI (ducks, pigs)

- [Chapter 15: Audio](chapter/15-audio.md)
  - 15.1 Web Audio API fundamentals
  - 15.2 Spatial audio
  - 15.3 Sound effect triggers
  - 15.4 Ambient and music

- [Chapter 16: User Interface](chapter/16-user-interface.md)
  - 16.1 DOM-based UI vs. in-game UI
  - 16.2 The HUD (crosshair, hotbar, stats)
  - 16.3 The start screen (local, network, world management)
  - 16.4 The settings panel
  - 16.5 The block manager

## IV — Multiplayer

- [Chapter 17: Network Architecture](chapter/17-network-architecture.md)
  - 17.1 WebSocket fundamentals
  - 17.2 Message protocol design (C2S / S2C)
  - 17.3 Connection lifecycle (lobby, join, in-game)
  - 17.4 The server architecture
  - 17.5 World state persistence

- [Chapter 18: Multiplayer Gameplay](chapter/18-multiplayer-gameplay.md)
  - 18.1 Player state synchronisation
  - 18.2 Snapshot interpolation
  - 18.3 Remote player rendering
  - 18.4 Name labels
  - 18.5 Block edit replication
  - 18.6 Latency compensation

## V — Advanced Topics

- [Chapter 19: Performance](chapter/19-performance.md)
  - 19.1 GPU timestamps and profiling
  - 19.2 Async shader compilation
  - 19.3 Frustum culling
  - 19.4 Occlusion culling
  - 19.5 Draw call batching
  - 19.6 Memory management

- [Chapter 20: Tools and Workflow](chapter/20-tools.md)
  - 20.1 The sample framework
  - 20.2 Testing strategy (unit, integration, visual)
  - 20.3 Debugging WebGPU
  - 20.4 Asset pipeline
  - 20.5 Continuous integration

- [Chapter 21: The Road Ahead](chapter/21-road-ahead.md)
  - 21.1 Ray tracing with WebGPU
  - 21.2 Compute shader post-processing
  - 21.3 Procedural generation at scale
  - 21.4 WebXR

## Appendices

- [Appendix A: WGSL Quick Reference](appendix/wgsl-ref.md)
- [Appendix B: WebGPU API Reference](appendix/webgpu-ref.md)
- [Appendix C: Mathematics Reference](appendix/math-ref.md)
- [Appendix D: Glossary](appendix/glossary.md)
