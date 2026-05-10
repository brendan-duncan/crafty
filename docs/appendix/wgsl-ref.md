# Appendix A: WGSL Quick Reference

[Contents](../crafty.md) | [Next](webgpu-ref.md)

## Comments

```wgsl
// Single line
/* Multi-line */
```

## Primitive Types

| Type | Description |
|------|-------------|
| `f32` | 32-bit IEEE float |
| `i32` | Signed 32-bit integer |
| `u32` | Unsigned 32-bit integer |
| `bool` | Boolean |
| `vec2f`, `vec3f`, `vec4f` | Float vectors |
| `vec2i`, `vec3i`, `vec4i` | Signed integer vectors |
| `vec2u`, `vec3u`, `vec4u` | Unsigned integer vectors |
| `mat2x2f`, `mat3x3f`, `mat4x4f` | Square matrices |
| `mat4x3f`, `mat3x4f`, etc. | Non-square matrices |

## Variable Declarations

```wgsl
var<uniform> u: CameraUniforms;       // Uniform buffer
var<storage> data: array<f32>;        // Storage buffer (read-write)
var<storage, read> data: array<f32>;  // Read-only storage
var texture_2d<f32>;                  // 2D texture
var texture_cube<f32>;                // Cube texture
var texture_depth_2d;                 // Depth texture
var sampler;                          // Sampler
var comparison_sampler;               // Comparison sampler (PCF)
let x = 42;                           // Compile-time constant
var y = 0;                            // Mutable variable
```

## Attribute Decorations

### Entry Points

```wgsl
@vertex
fn vs_main(...) -> ... { }

@fragment
fn fs_main(...) -> ... { }

@compute
@workgroup_size(8, 8, 1)
fn cs_main(...) { }
```

### Input/Output Locations

```wgsl
@location(0) position: vec3f,          // Vertex attribute
@location(0) world_pos: vec3f,         // Inter-stage varying
@builtin(position) clip_pos: vec4f,    // Clip-space position
@builtin(vertex_index) vi: u32,        // Vertex index
@builtin(instance_index) ii: u32,      // Instance index
@builtin(front_facing) front: bool,    // Front face test
@builtin(global_invocation_id) id: vec3u,  // Compute invocation ID
```

### Resource Bindings

```wgsl
@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(1) @binding(0) var albedo_map: texture_2d<f32>;
@group(1) @binding(1) var samp: sampler;
```

## Control Flow

```wgsl
if (condition) {
  // ...
} else {
  // ...
}

for (var i = 0u; i < count; i++) {
  // ...
}

while (condition) {
  // ...
}
```

## Built-in Functions

### Math

| Function | Description |
|----------|-------------|
| `dot(a, b)` | Dot product |
| `cross(a, b)` | Cross product |
| `normalize(v)` | Unit vector |
| `length(v)` | Euclidean length |
| `distance(a, b)` | Distance between points |
| `reflect(v, n)` | Reflection vector |
| `refract(v, n, eta)` | Refraction vector |
| `lerp(a, b, t)` | Linear interpolation |
| `smoothstep(edge0, edge1, x)` | Smooth Hermite interpolation |
| `clamp(x, min, max)` | Clamp to range |
| `mix(a, b, t)` | Linear blend |
| `pow(x, y)` | Power |
| `exp(x)`, `log(x)` | Exponential and natural log |
| `sin(x)`, `cos(x)`, `tan(x)` | Trigonometric |
| `asin(x)`, `acos(x)`, `atan2(y, x)` | Inverse trigonometric |
| `floor(x)`, `ceil(x)`, `round(x)` | Rounding |
| `abs(x)` | Absolute value |
| `min(a, b)`, `max(a, b)` | Min/max |
| `fract(x)` | Fractional part |
| `modf(x)` | Returns fractional and integer parts |
| `step(edge, x)` | 0 if x < edge, else 1 |
| `sign(x)` | Sign: -1, 0, or 1 |
| `sqrt(x)`, `inversesqrt(x)` | Square root |

### Texture Sampling

| Function | Description |
|----------|-------------|
| `textureSample(t, s, coords)` | 2D/cube sample |
| `textureSampleLevel(t, s, coords, lod)` | Explicit LOD |
| `textureSampleCompare(t, s, coords, depth)` | PCF comparison |
| `textureSampleGather(t, s, coords)` | 4 texel gather |
| `textureLoad(t, coords, lod)` | Texel load without filtering |
| `textureDimensions(t)` | Texture size |

### Atomic Operations (compute)

```wgsl
atomicAdd(&counter, 1u);
atomicSub(&counter, 1u);
atomicMax(&counter, value);
atomicMin(&counter, value);
atomicExchange(&counter, value);
atomicCompareExchangeWeak(&counter, cmp, value);
```

## Struct Declarations

```wgsl
struct CameraUniforms {
  viewProj: mat4x4<f32>,
  position: vec3<f32>,
  near: f32,
  far: f32,
}
```

## Matrix Operations

```wgsl
let m = mat4x4<f32>(/* 16 f32 values */);
let v = m * vec4f(x, y, z, 1.0);     // Matrix-vector multiply
let m3 = transpose(m);                 // Transpose
// No built-in invert — provide manually
```
