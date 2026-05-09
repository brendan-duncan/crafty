# Appendix C: Mathematics Reference

[Contents](../README.md) | [Previous](webgpu-ref.md) | [Next](glossary.md)

## Coordinate System

- **Handedness**: Right-handed
- **Up**: +Y `(0, 1, 0)`
- **Forward**: -Z `(0, 0, -1)`
- **Matrix storage**: Column-major (`data[col * 4 + row]`)
- **Depth range**: [0, 1] (WebGPU)

## Vector Operations

### Dot Product

```
a · b = a.x*b.x + a.y*b.y + a.z*b.z
```

### Cross Product (right-handed)

```
a × b = (a.y*b.z - a.z*b.y,
         a.z*b.x - a.x*b.z,
         a.x*b.y - a.y*b.x)
```

### Normalisation

```
n = v / |v|
```

### Linear Interpolation

```
lerp(a, b, t) = a + (b - a) * t
```

## Matrix Operations

### 4×4 Identity

```
I = | 1 0 0 0 |
    | 0 1 0 0 |
    | 0 0 1 0 |
    | 0 0 0 1 |
```

### Translation

```
T(tx, ty, tz) = | 1 0 0 tx |
                 | 0 1 0 ty |
                 | 0 0 1 tz |
                 | 0 0 0 1  |
```

### Rotation Around X

```
Rx(θ) = | 1     0      0    0 |
        | 0  cos θ -sin θ  0 |
        | 0  sin θ  cos θ  0 |
        | 0     0      0    1 |
```

### Rotation Around Y

```
Ry(θ) = |  cos θ  0  sin θ  0 |
        |    0    1    0    0 |
        | -sin θ  0  cos θ  0 |
        |    0    0    0    1 |
```

### Rotation Around Z

```
Rz(θ) = | cos θ -sin θ  0  0 |
        | sin θ  cos θ  0  0 |
        |    0     0    1  0 |
        |    0     0    0  1 |
```

### Scale

```
S(sx, sy, sz) = | sx 0  0  0 |
                 | 0  sy 0  0 |
                 | 0  0  sz 0 |
                 | 0  0  0  1 |
```

### Perspective (right-handed, [0,1] depth)

```
P(fovY, aspect, near, far) =
    f/aspect    0         0           0
        0       f         0           0
        0       0      far*nf       -1
        0       0    far*near*nf     0

where f = 1 / tan(fovY / 2), nf = 1 / (near - far)
```

### Orthographic (right-handed, [0,1] depth)

```
O(left, right, bottom, top, near, far) =
    -2/rl      0         0         0
      0      -2/tb       0         0
      0        0        nf         0
    (l+r)/rl (t+b)/tb  near*nf    1

where rl = 1/(left-right), tb = 1/(bottom-top), nf = 1/(near-far)
```

### LookAt (right-handed, -Z forward)

```
V(eye, target, up) =
    rx   ux  -fx   0
    ry   uy  -fy   0
    rz   uz  -fz   0
   -r·e -u·e  f·e  1

where f = normalize(target - eye)
      r = normalize(f × up)
      u = r × f
```

### Normal Matrix

The normal matrix is the inverse transpose of the upper-left 3×3 submatrix of the model matrix. It transforms normals correctly under non-uniform scale:

```
N = (M₃ₓ₃⁻¹)ᵀ
```

## Quaternion Operations

### Identity

```
q = (0, 0, 0, 1)
```

### From Axis-Angle

```
q = (axis.x * sin(θ/2),
     axis.y * sin(θ/2),
     axis.z * sin(θ/2),
     cos(θ/2))
```

### Hamilton Product

```
q₁ * q₂ = (w₁*x₂ + x₁*w₂ + y₁*z₂ - z₁*y₂,
           w₁*y₂ - x₁*z₂ + y₁*w₂ + z₁*x₂,
           w₁*z₂ + x₁*y₂ - y₁*x₂ + z₁*w₂,
           w₁*w₂ - x₁*x₂ - y₁*y₂ - z₁*z₂)
```

### Rotation of Vector

```
v' = q * v * q⁻¹

// Simplified:
t = 2 * cross(q.xyz, v)
v' = v + q.w * t + cross(q.xyz, t)
```

### SLERP

```
cos_θ = q₁ · q₂
if cos_θ < 0: negate q₂
θ = acos(cos_θ)
q' = (sin((1-t)*θ) / sin_θ) * q₁ + (sin(t*θ) / sin_θ) * q₂
```

### Quaternion to Matrix

```
R(q) =
    1-2(yy+zz)  2(xy-zw)    2(xz+yw)    0
    2(xy+zw)    1-2(xx+zz)  2(yz-xw)    0
    2(xz-yw)    2(yz+xw)    1-2(xx+yy)  0
    0           0           0           1

where xx = q.x², xy = q.x*q.y, etc.
```

## Coordinate Space Transforms

```
Local (model) space
    ↓ model matrix (localToWorld)
World space
    ↓ view matrix (worldToView)
View (eye) space
    ↓ projection matrix
Clip space
    ↓ perspective divide (x/w, y/w, z/w)
NDC (-1..1 × -1..1 × 0..1)
    ↓ viewport transform
Screen (pixel) space
```

## Noise Functions

### Perlin Noise (from src/math/noise.ts)

```
perlinNoise3(x, y, z)          → [-1, 1] base noise
perlinFbmNoise3(x, y, z, lacunarity, gain, octaves)
                               → fractal Brownian motion
perlinTurbulenceNoise3(x, y, z, lacunarity, gain, octaves)
                               → absolute noise sum
perlinRidgeNoise3(x, y, z, lacunarity, gain, offset, octaves)
                               → ridged multifractal
```
