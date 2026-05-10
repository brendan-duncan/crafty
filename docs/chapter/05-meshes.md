# Chapter 5: Meshes and Geometry

[Contents](../crafty.md) | [04-Rendering Architecture](04-rendering-architecture.md) | [06-Textures / Materials](06-textures-materials.md)

Every visible object in Crafty is represented by a **mesh** — a collection of vertices and indices that define its shape. This chapter covers how meshes are defined, uploaded to the GPU, and rendered.

## 5.1 Vertex and Index Buffers

A mesh in WebGPU lives in two GPU buffers: a **vertex buffer** holding per-vertex data (positions, normals, UVs, tangents) and an **index buffer** specifying which vertices form triangles.

Crafty's `Mesh` class (`src/assets/mesh.ts`) owns these buffers:

```typescript
export class Mesh {
  readonly vertexBuffer: GPUBuffer;
  readonly indexBuffer: GPUBuffer;
  readonly indexCount: number;
}
```

### Vertex Layout

Each vertex is 48 bytes — 12 consecutive 32-bit floats:

| Offset | Size | Attribute | Location |
|--------|------|-----------|----------|
| 0 | 12 bytes (float32x3) | Position | 0 |
| 12 | 12 bytes (float32x3) | Normal | 1 |
| 24 | 8 bytes (float32x2) | UV | 2 |
| 32 | 16 bytes (float32x4) | Tangent (xyz + bitangent sign) | 3 |

This is defined by the exported constants:

```typescript
export const VERTEX_STRIDE = 48;

export const VERTEX_ATTRIBUTES: GPUVertexAttribute[] = [
  { shaderLocation: 0, offset:  0, format: 'float32x3' }, // position
  { shaderLocation: 1, offset: 12, format: 'float32x3' }, // normal
  { shaderLocation: 2, offset: 24, format: 'float32x2' }, // uv
  { shaderLocation: 3, offset: 32, format: 'float32x4' }, // tangent
];
```

The `shaderLocation` values correspond to `@location(N)` in the WGSL vertex shader input:

```wgsl
struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal  : vec3<f32>,
  @location(2) uv      : vec2<f32>,
  @location(3) tangent : vec4<f32>,
}
```

### Buffer Creation

Meshes are created via `Mesh.fromData()`, which uploads CPU-side arrays to the GPU:

```typescript
static fromData(device: GPUDevice, vertices: Float32Array, indices: Uint32Array): Mesh {
  const vb = device.createBuffer({
    label: 'Mesh VertexBuffer',
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vb, 0, vertices.buffer as ArrayBuffer,
    vertices.byteOffset, vertices.byteLength);

  const ib = device.createBuffer({
    label: 'Mesh IndexBuffer',
    size: indices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(ib, 0, indices.buffer as ArrayBuffer,
    indices.byteOffset, indices.byteLength);

  return new Mesh(vb, ib, indices.length);
}
```

Both buffers use `COPY_DST` so they can be populated with `queue.writeBuffer()`. This is a one-time upload — once populated, the vertex and index data lives entirely on the GPU.

## 5.2 Vertex Attributes and Layouts

The vertex buffer layout is specified when creating a render pipeline:

```typescript
vertex: {
  module: shaderModule,
  entryPoint: 'vs_main',
  buffers: [
    {
      arrayStride: VERTEX_STRIDE,     // 48 bytes between vertices
      attributes: VERTEX_ATTRIBUTES,  // position, normal, uv, tangent
    },
  ],
},
```

WebGPU supports multiple vertex buffers (for separate position/normal/UV streams), but Crafty uses **interleaved** vertices — all attributes for a single vertex are packed into one buffer entry. This is simpler and more cache-efficient for the typical rendering pattern of iterating vertices sequentially.

## 5.3 The Mesh Asset Type

Crafty's `Mesh` class is the sole mesh representation. There is no higher-level "model" class — a model is simply a collection of `Mesh` + `Material` pairs enumerated during rendering.

### Procedural Primitives

The `Mesh` class provides static methods for common procedural shapes.

**Cube** (`Mesh.createCube`):

```typescript
static createCube(device: GPUDevice, size = 1): Mesh {
  const h = size / 2;
  // Six faces, each with 4 vertices
  // Each vertex: position(3) + normal(3) + uv(2) + tangent(4) = 12 floats
  const faces = [
    { normal:[0,0,1],  tangent:[1,0,0,1],
      verts: [[-h,-h,h],[h,-h,h],[h,h,h],[-h,h,h]] },    // front
    { normal:[0,0,-1], tangent:[-1,0,0,1],
      verts: [[h,-h,-h],[-h,-h,-h],[-h,h,-h],[h,h,-h]] },// back
    // ... four more faces ...
  ];
  // Builds vertex array and index array, calls fromData()
}
```

Each face has its own normal and tangent, enabling correct per-face lighting. The winding order is counter-clockwise (standard for WebGPU).

**Plane** (`Mesh.createPlane`): A flat quad made of two triangles, used for the ground and other flat surfaces.

**Sphere** (`Mesh.createSphere`): A UV sphere with configurable segment counts, used for debug light markers and procedural objects.

## 5.4 Procedural Geometry

### Plane

The plane mesh is the simplest procedural geometry — two triangles forming a square:

```typescript
static createPlane(device: GPUDevice, size = 1): Mesh {
  const h = size / 2;
  // Four corners, two triangles
  const vertices = new Float32Array([
    // position      normal         uv       tangent
    -h, 0, -h,      0, 1, 0,      0, 0,    1, 0, 0, 1,
    h, 0, -h,       0, 1, 0,      1, 0,    1, 0, 0, 1,
    h, 0, h,        0, 1, 0,      1, 1,    1, 0, 0, 1,
    -h, 0, h,       0, 1, 0,      0, 1,    1, 0, 0, 1,
  ]);
  const indices = new Uint32Array([0, 1, 2, 0, 2, 3]);
  return Mesh.fromData(device, vertices, indices);
}
```

### Cube with Correct Normals

A common mistake with cube meshes is sharing vertices across faces (so a vertex has a single normal that is an average of the adjacent face normals). Crafty's cube creates **unique vertices per face**, so each face has its own explicit normal:

```
Face   Normal   Tangent        Vertices
─────  ───────  ────────────   ──────────────────────
front  (0,0,1)  (1,0,0,1)     (-h,-h,h)-(h,-h,h)-(h,h,h)-(-h,h,h)
back   (0,0,-1) (-1,0,0,1)    (h,-h,-h)-(-h,-h,-h)-(-h,h,-h)-(h,h,-h)
right  (1,0,0)  (0,0,-1,1)    (h,-h,h)-(h,-h,-h)-(h,h,-h)-(h,h,h)
left   (-1,0,0) (0,0,1,1)     (-h,-h,-h)-(-h,-h,h)-(-h,h,h)-(-h,h,-h)
top    (0,1,0)  (1,0,0,1)     (-h,h,h)-(h,h,h)-(h,h,-h)-(-h,h,-h)
bottom (0,-1,0) (1,0,0,-1)    (-h,-h,-h)-(h,-h,-h)-(h,-h,h)-(-h,-h,h)
```

This is important for correct lighting — without explicit per-face normals, a cube with hard edges would appear softly shaded at the corners.

## 5.5 Skinned Meshes and Skeletons

Skinned meshes extend the basic mesh with **joint influences** — each vertex is bound to up to four bones with corresponding weights:

```typescript
// Additional vertex attributes for skinned geometry
// location 4: joint indices (uint32x4 packed)
// location 5: joint weights (float32x4)
```

The skinning is computed on the GPU in the vertex shader, using a storage buffer of joint matrices:

```wgsl
// ── from src/shaders/skinned_geometry.wgsl ──

@group(3) @binding(0) var<storage, read> jointMatrices: array<mat4x4<f32>>;

fn skin_position(position: vec3f, joints: vec4u, weights: vec4f) -> vec3f {
  var pos = vec3f(0);
  for (var i = 0u; i < 4u; i++) {
    pos += (jointMatrices[joints[i]] * vec4f(position, 1.0)).xyz * weights[i];
  }
  return pos;
}
```

The `SkinnedGeometryPass` renders these meshes into the G-buffer, applying the joint transform before the standard vertex transform chain.

## 5.6 Animation

Animation in Crafty is stored as **clips** — sequences of joint transforms sampled at a fixed rate. Animation playback interpolates between keyframes:

```typescript
// Animation clip playback
class AnimationClip {
  // Samples per joint: translation, rotation (quaternion), scale
  sample(time: number, jointIndex: number): { translation: Vec3; rotation: Quaternion; scale: Vec3 };
}
```

Joint transforms are computed on the CPU each frame and uploaded to a GPU storage buffer:

```typescript
// Per frame: compute joint matrices, upload to GPU
const jointCount = skeleton.jointCount;
const jointBuffer = device.createBuffer({
  size: jointCount * 64,  // mat4x4 = 64 bytes per joint
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
});
queue.writeBuffer(jointBuffer, 0, jointMatrices.buffer);
```

The storage buffer is bound at group 3 of the skinned geometry pipeline, separate from the group-2 material bindings, so the same material system works for both static and skinned meshes.

### Summary

The mesh system is self-contained and minimal:

- `Mesh` owns vertex/index GPU buffers with a fixed interleaved layout (48 bytes/vertex).
- Procedural creation methods (`createCube`, `createPlane`, `createSphere`) provide common geometry.
- Skinned meshes add joint-weight vertex attributes and a storage buffer for GPU skinning.
- Animation clips sample joint transforms and upload them per-frame.

Meshes are drawn by render passes that iterate `DrawItem` lists — each item pairing a `Mesh` with a `Material` and a transform matrix.

**Further reading:**
- `src/assets/mesh.ts` — Mesh class and all procedural generators
- `src/shaders/geometry.wgsl` — Vertex/fragment shader for static geometry
- `src/shaders/skinned_geometry.wgsl` — Vertex/fragment shader for skinned geometry
- `src/renderer/passes/geometry_pass.ts` — Draws static meshes into the G-buffer
- `src/renderer/passes/skinned_geometry_pass.ts` — Draws skinned meshes into the G-buffer

----
[Contents](../crafty.md) | [04-Rendering Architecture](04-rendering-architecture.md) | [06-Textures / Materials](06-textures-materials.md)
