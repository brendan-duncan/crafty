# Chapter 2: 3D Mathematics

[Contents](../README.md) | [01-Introduction](01-introduction.md) | [03-WebGPU Fundamentals](03-webgpu-fundamentals.md)

Before we can render anything, we need a solid foundation in 3D mathematics. This chapter presents the vector, matrix, and quaternion types that every system in Crafty depends on.

## 2.1 Coordinate Systems and Conventions

Crafty uses a **right-handed, Y-up, -Z-forward** coordinate system. This is the same convention used by OpenGL, Maya, and many game engines. WebGPU's native coordinate system is also right-handed with a [0, 1] depth range (unlike OpenGL's [-1, 1]).

| Convention | Crafty choice |
|------------|--------------|
| Handedness | Right-handed |
| Up | +Y `(0, 1, 0)` |
| Forward | -Z `(0, 0, -1)` |
| Matrix storage | Column-major in `Float32Array` |
| Depth range | [0, 1] (WebGPU) |
| Winding order | Counter-clockwise (front faces) |

The `Vec3` class encodes these conventions through static factory methods:

```typescript
// ── from src/math/vec3.ts ──

static up(): Vec3 {
  return new Vec3(0, 1, 0);
}

static forward(): Vec3 {
  // Right-handed -Z forward convention
  return new Vec3(0, 0, -1);
}

static right(): Vec3 {
  return new Vec3(1, 0, 0);
}

// The cross product confirms right-handedness:
//   up × forward = right
//   (0,1,0) × (0,0,-1) = (1,0,0)
cross(v: Vec3): Vec3 {
  return new Vec3(
    this.y * v.z - this.z * v.y,
    this.z * v.x - this.x * v.z,
    this.x * v.y - this.y * v.x,
  );
}
```

The cross product formula above is the standard right-handed cross product. You can verify: `Vec3.up().cross(Vec3.forward()) = Vec3.right()`.

## 2.2 Vectors

### Vec2, Vec3, Vec4

Crafty defines three vector classes in `src/math/`: `Vec2` (`vec2.ts`), `Vec3` (`vec3.ts`), and `Vec4` (`vec4.ts`). All three follow the same design pattern:

- **Mutable** `x`, `y`, `z`, `w` fields (you can read and write them directly).
- **Immutable arithmetic** — every operation returns a **new** vector. The original is never modified (except by `set()`).
- Method chaining via `set()`, which mutates in place and returns `this`.

The `Vec3` class is the workhorse of the engine. It represents positions, directions, colors, and normals. Here is its interface:

```typescript
// ── from src/math/vec3.ts ──

export class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0);

  // Mutation
  set(x: number, y: number, z: number): this;

  // Arithmetic (all return new Vec3)
  clone(): Vec3;
  negate(): Vec3;
  add(v: Vec3): Vec3;
  sub(v: Vec3): Vec3;
  scale(s: number): Vec3;
  mul(v: Vec3): Vec3;        // Hadamard (componentwise) product
  cross(v: Vec3): Vec3;      // Right-handed cross product
  normalize(): Vec3;
  lerp(v: Vec3, t: number): Vec3;

  // Queries
  dot(v: Vec3): number;
  lengthSq(): number;
  length(): number;
  toArray(): [number, number, number];

  // Static factories
  static zero(): Vec3;
  static one(): Vec3;
  static up(): Vec3;
  static forward(): Vec3;
  static right(): Vec3;
  static fromArray(arr: ArrayLike<number>, offset?: number): Vec3;
}
```

The immutable-by-default design eliminates an entire class of bugs. When you write:

```typescript
const reflected = lightDir.sub(normal.scale(2 * dot));
```

the `sub` and `scale` calls both return new vectors. The original `lightDir` and `normal` are untouched. This makes reasoning about code much simpler, at the cost of some allocation pressure. In practice, the garbage collector handles short-lived vectors efficiently, and hot paths that need zero-allocation can always reuse a scratch vector.

### How Vec3 is Used Throughout the Engine

Vectors are everywhere in Crafty — not just for positions and directions, but also for colors and so on. Here are the common usage patterns:

**Positions and translations.** A game object's position is a `Vec3`:

```typescript
// from the engine component system
class GameObject {
  position: Vec3 = Vec3.zero();
  // ...
}
```

**Directions and normals.** Normal vectors are stored in the G-buffer as `Vec3` values encoded into `float16` textures:

```typescript
// G-buffer normal packing: world-space normal in RGB
// from src/renderer/gbuffer.ts
// normalMetallic: rg16float — RGB = world-space normal
```

**Colors.** RGB colors are also `Vec3` values, which makes arithmetic like `color.scale(intensity)` natural:

```typescript
// from src/renderer/directional_light.ts
export interface DirectionalLight {
  direction: Vec3;
  intensity: number;
  color: Vec3;
  // ...
}
```

The `Vec2` class (`vec2.ts`) is used for texture coordinates (UVs) and 2D screen positions. The `Vec4` class (`vec4.ts`) is used for homogeneous coordinates, bounding volumes, and packed data.

## 2.3 Matrices

The `Mat4` class (`src/math/mat4.ts`) is the most mathematically important type in the engine. It represents 4×4 transformation matrices in **column-major** order, stored as a `Float32Array` of 16 elements.

### Column-Major Storage

Column-major means that element at column `c`, row `r` is at index `c * 4 + r` in the flat array:

```
Column 0:  data[0]  data[1]  data[2]  data[3]    (first column)
Column 1:  data[4]  data[5]  data[6]  data[7]    (second column)
Column 2:  data[8]  data[9]  data[10] data[11]   (third column)
Column 3:  data[12] data[13] data[14] data[15]   (fourth column)
```

This matches WebGPU's WGSL layout: `matrix<mat4x4<f32>>` arrays elements column-by-column in the default `@column_major` storage. The identity matrix is constructed as:

```typescript
// from src/math/mat4.ts
static identity(): Mat4 {
  return new Mat4([
    1, 0, 0, 0,   // column 0
    0, 1, 0, 0,   // column 1
    0, 0, 1, 0,   // column 2
    0, 0, 0, 1,   // column 3
  ]);
}
```

### Matrix-Matrix Multiplication

Matrix multiplication follows the column-major convention: `a.multiply(b)` computes `a * b`, meaning `b` is applied first when transforming vectors. This matches how we compose transforms in the scene graph:

```typescript
// Composition: parent * local (parent is applied after local)
// from engine scene graph
localToWorld(): Mat4 {
  if (this._parent) {
    return this._parent.localToWorld().multiply(this.localTransform());
  }
  return this.localTransform();
}
```

### View and Projection Matrices

The `lookAt` view matrix constructs a right-handed view transformation:

```typescript
// from src/math/mat4.ts
static lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
  const f = target.sub(eye).normalize();   // forward
  const r = f.cross(up).normalize();       // right
  const u = r.cross(f);                    // true up (orthogonalized)

  return new Mat4([
    r.x, u.x, -f.x, 0,
    r.y, u.y, -f.y, 0,
    r.z, u.z, -f.z, 0,
    -r.dot(eye), -u.dot(eye), f.dot(eye), 1,
  ]);
}
```

The `perspective` projection builds a right-handed frustum with WebGPU's [0, 1] depth range:

```typescript
// from src/math/mat4.ts
static perspective(fovY: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovY / 2);
  const nf = 1 / (near - far);

  return new Mat4([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, far * nf, -1,
    0, 0, near * far * nf, 0,
  ]);
}
```

The `-1` at `data[11]` (column 2, row 3) is the key difference from OpenGL's projection. In OpenGL (`[-1, 1]` depth), this value is `1`. In WebGPU (`[0, 1]` depth), it is `-1`. This flips the sign of the z-divide so that depth values map to `[0, 1]` after the perspective divide.

### The TRS Transform

The static `trs` method composes translation, rotation, and scale into a single matrix:

```typescript
static trs(
  t: Vec3,
  qx: number, qy: number, qz: number, qw: number,
  s: Vec3,
): Mat4 {
  // Scale -> Rotate -> Translate
  // The matrix is identity * translation * rotation * scale
  // which, in column-major order, applies scale first, then
  // rotation, then translation.
  const rx = qx, ry = qy, rz = qz, rw = qw;
  const xx = rx * rx, yy = ry * ry, zz = rz * rz;
  const xy = rx * ry, xz = rx * rz, xw = rx * rw;
  const yz = ry * rz, yw = ry * rw, zw = rz * rw;

  return new Mat4([
    (1 - 2 * (yy + zz)) * s.x,        // column 0
    2 * (xy + zw) * s.x,
    2 * (xz - yw) * s.x,
    0,
    2 * (xy - zw) * s.y,               // column 1
    (1 - 2 * (xx + zz)) * s.y,
    2 * (yz + xw) * s.y,
    0,
    2 * (xz + yw) * s.z,               // column 2
    2 * (yz - xw) * s.z,
    (1 - 2 * (xx + yy)) * s.z,
    0,
    t.x, t.y, t.z, 1,                   // column 3
  ]);
}
```

### The Normal Matrix

When transforming surface normals, we cannot use the same matrix as for positions. If the transform contains non-uniform scale, the normals must be transformed by the **inverse transpose** of the upper-left 3×3 submatrix:

```typescript
normalMatrix(): Mat4 {
  // Extract upper-left 3x3, invert, transpose
  const m = this.invert();
  // ...
  // Result is the inverse-transpose of the 3x3, embedded
  // in a 4x4 with the rest as identity
}
```

This is used in the G-buffer fill shaders when transforming normals from local space to world space.

## 2.4 Quaternions

Quaternions (`src/math/quaternion.ts`) represent 3D rotations without the gimbal lock and interpolation problems of Euler angles. A quaternion has four components: a scalar `w` and a vector `(x, y, z)`, representing `w + xi + yj + zk`.

### Construction and Defaults

The default quaternion is the identity `(0, 0, 0, 1)` — representing no rotation:

```typescript
export class Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {}
}
```

### From Euler Angles

The `fromEuler` static method converts intrinsic XYZ Euler angles (radians) to a quaternion. This is the primary way user input (yaw/pitch) becomes a rotation:

```typescript
static fromEuler(x: number, y: number, z: number): Quaternion {
  // x = pitch, y = yaw, z = roll
  // Intrinsic XYZ order: yaw (Y) * pitch (X) * roll (Z)
  const cx = Math.cos(x / 2), sx = Math.sin(x / 2);
  const cy = Math.cos(y / 2), sy = Math.sin(y / 2);
  const cz = Math.cos(z / 2), sz = Math.sin(z / 2);

  return new Quaternion(
    sx * cy * cz + cx * sy * sz,   // x
    cx * sy * cz - sx * cy * sz,   // y
    cx * cy * sz + sx * sy * cz,   // z
    cx * cy * cz - sx * sy * sz,   // w
  );
}
```

### Composition and Rotation

Quaternion multiplication uses the Hamilton product. `a.multiply(b)` means `this` is applied **after** `b`:

```typescript
multiply(b: Quaternion): Quaternion {
  const ax = this.x, ay = this.y, az = this.z, aw = this.w;
  const bx = b.x, by = b.y, bz = b.z, bw = b.w;

  return new Quaternion(
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  );
}
```

To rotate a vector by a quaternion:

```typescript
rotateVec3(v: Vec3): Vec3 {
  // q * v * q^-1, implemented as:
  // v' = v + 2 * cross(q.xyz, cross(q.xyz, v) + q.w * v)
  const qx = this.x, qy = this.y, qz = this.z, qw = this.w;
  const t1 = qy * v.z - qz * v.y + qw * v.x;
  const t2 = qz * v.x - qx * v.z + qw * v.y;
  const t3 = qx * v.y - qy * v.x + qw * v.z;
  return new Vec3(
    v.x + 2 * (qy * t3 - qz * t2),
    v.y + 2 * (qz * t1 - qx * t3),
    v.z + 2 * (qx * t2 - qy * t1),
  );
}
```

This avoids constructing and multiplying a full 4×4 rotation matrix when only a single vector rotation is needed.

### Spherical Linear Interpolation (SLERP)

SLERP interpolates between two quaternions with constant angular velocity, making it ideal for smooth camera and animation blending:

```typescript
slerp(b: Quaternion, t: number): Quaternion {
  // Compute cosine of the angle between quaternions
  let cosTheta = this.x * b.x + this.y * b.y
               + this.z * b.z + this.w * b.w;

  // Take the shorter arc
  let sign = 1;
  if (cosTheta < 0) {
    cosTheta = -cosTheta;
    sign = -1;
  }

  // Fall back to nlerp for tiny angles (performance)
  const epsilon = 1e-6;
  if (cosTheta >= 1 - epsilon) {
    return this.lerp(b, t);
  }

  const theta = Math.acos(cosTheta);
  const sinTheta = Math.sin(theta);
  const a = Math.sin((1 - t) * theta) / sinTheta;
  const d = Math.sin(t * theta) / sinTheta * sign;

  return new Quaternion(
    this.x * a + b.x * d,
    this.y * a + b.y * d,
    this.z * a + b.z * d,
    this.w * a + b.w * d,
  );
}
```

## 2.5 Transform Composition (TRS)

Every `GameObject` in the scene graph has a **local transform** built from its position (translation), rotation (quaternion), and scale:

```typescript
// Composition order: T * R * S
// In column-major convention, S is applied first (local scale),
// then R (rotation around the scaled axes), then T (translation
// to world position).
localTransform(): Mat4 {
  return Mat4.trs(
    this.position,
    this.rotation.x, this.rotation.y,
    this.rotation.z, this.rotation.w,
    this.scale,
  );
}
```

The world transform composes parent and local transforms:

```typescript
localToWorld(): Mat4 {
  if (this._parent) {
    // parent * local — parent transform is applied after local
    return this._parent.localToWorld().multiply(this.localTransform());
  }
  return this.localTransform();
}
```

To go from world space to the camera's view space, we invert the camera's local-to-world matrix:

```typescript
// from the Camera component
viewMatrix(): Mat4 {
  return this.gameObject.localToWorld().invert();
}

viewProjectionMatrix(): Mat4 {
  return this.projectionMatrix.multiply(this.viewMatrix());
}
```

## 2.6 Coordinate Space Transformations

The rendering pipeline moves data through several coordinate spaces. Here is the full chain:

```
Local space (model)
  ↓  localToWorld (model matrix)
World space
  ↓  viewMatrix
View (camera) space  ── right-handed, -Z forward
  ↓  projectionMatrix  
Clip space  ── [0, 1] depth, homogeneous w
  ↓  perspective divide (w)
NDC (normalized device coordinates)  ── x∈[-1,1], y∈[-1,1], z∈[0,1]
  ↓  viewport transform
Screen space (pixels)
```

In WGSL, this is:

```wgsl
// Vertex shader transformation chain
// from a typical Crafty vertex shader
struct Uniforms {
  modelMatrix: mat4x4<f32>,
  viewMatrix: mat4x4<f32>,
  projMatrix: mat4x4<f32>,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

@vertex
fn vs_main(@location(0) position: vec3f) -> @builtin(position) vec4f {
  let worldPos = u.modelMatrix * vec4f(position, 1.0);
  let viewPos = u.viewMatrix * worldPos;
  return u.projMatrix * viewPos;
}
```

## 2.7 Random Numbers and Noise

Procedural generation is central to a voxel game — terrain height, biome distribution, ore placement, and cloud shapes all require controlled randomness.

### Seeded Random (`random.ts`)

The `Random` class implements the **xorshift128+** family (Xorwow variant) with explicit seeding. The instance itself is the state — it extends `Uint32Array(6)`:

```typescript
export class Random extends Uint32Array {
  static global = new Random();

  // Two core generators
  randomUint32(): number;        // Uniform [0, 2^32 - 1]
  randomFloat(min?, max?): number; // Uniform [min, max] (default [0, 1])
  randomDouble(min?, max?): number; // Higher precision [min, max]

  // State management
  get seed(): number;
  set seed(seed: number);        // Re-seed with splitmix32
  reset(): void;                 // Restore to post-construction state
}
```

The global instance `Random.global` is auto-seeded from `Date.now()` at module load. You can create additional instances with explicit seeds for reproducible terrain generation:

```typescript
// Terrain uses its own seeded RNG for reproducibility
const rng = new Random();
rng.seed = 42;  // Same seed = same terrain
```

### Perlin Noise (`noise.ts`)

Crafty ports **stb_perlin.h v0.5** by Sean Barrett to TypeScript. Six functions provide gradient noise for procedural generation:

| Function | Use case |
|----------|----------|
| `perlinNoise3(x, y, z)` | Base 3D Perlin noise, range ~[-1, 1] |
| `perlinFbmNoise3(x, y, z, lacunarity, gain, octaves)` | Fractional Brownian motion — terrain height |
| `perlinTurbulenceNoise3(x, y, z, lacunarity, gain, octaves)` | Turbulence — cloud density |
| `perlinRidgeNoise3(x, y, z, lacunarity, gain, offset, octaves)` | Ridged multifractal — mountain ridges |
| `perlinNoise3Seed(x, y, z, ...seed)` | Decorrelated noise for different features |
| `perlinNoise3WrapNonpow2(x, y, z, ...wrap)` | Arbitrary-size tiling |

Terrain generation combines multiple octaves of `perlinFbmNoise3` with elevation-dependent biome blending. The noise functions operate on 3D coordinates, which allows overhangs and caves — a key advantage over 2D heightmap-based approaches.

### Summary

The math library provides the foundation for everything that follows. Every vertex transform, every camera motion, every light calculation, and every procedural generation step builds on these types. The conventions are consistent throughout:

- Column-major matrices for WebGPU
- Right-handed, Y-up, -Z-forward coordinates
- Immutable arithmetic throughout
- Seeded RNG and Perlin noise for procedural content

**Further reading:** The full source of each type is in:
- `src/math/vec2.ts`, `vec3.ts`, `vec4.ts` — vector types
- `src/math/mat4.ts` — 4×4 transformation matrices
- `src/math/quaternion.ts` — rotation quaternions
- `src/math/random.ts` — seeded PRNG
- `src/math/noise.ts` — Perlin noise family

----
[Contents](../README.md) | [01-Introduction](01-introduction.md) | [03-WebGPU Fundamentals](03-webgpu-fundamentals.md)
