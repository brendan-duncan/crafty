// Forward procedural shader — custom material demo
// Uses the forward renderer's lighting infrastructure (groups 0,1,3)
// with a procedurally generated animated pattern in the fragment shader.

// Include the standard modules
#import "camera.wgsl"
#import "lighting.wgsl"
#import "model.wgsl"

const PI: f32 = 3.14159265358979323846;

struct ProceduralUniforms {
  baseColor   : vec4<f32>,
  accentColor : vec4<f32>,
  patternScale: f32,
  time        : f32,
  animSpeed   : f32,
  edgeWidth   : f32,
}

@group(2) @binding(0) var<uniform> params: ProceduralUniforms;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(3) tangent: vec4<f32>,
}

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0) world_pos  : vec3<f32>,
  @location(1) world_norm : vec3<f32>,
  @location(2) uv         : vec2<f32>,
  @location(3) world_tan  : vec4<f32>,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let world_pos = model.model * vec4<f32>(vin.position, 1.0);
  let world_norm = normalize((model.normalMatrix * vec4<f32>(vin.normal, 0.0)).xyz);
  let world_tan = normalize((model.normalMatrix * vec4<f32>(vin.tangent.xyz, 0.0)).xyz);

  var out: VertexOutput;
  out.clip_pos = camera.viewProj * world_pos;
  out.world_pos = world_pos.xyz;
  out.world_norm = world_norm;
  out.uv = vin.uv;
  out.world_tan = vec4<f32>(world_tan, vin.tangent.w);
  return out;
}

// Procedural pattern functions

fn hash2(p: vec2<f32>) -> vec2<f32> {
  let h = dot(p, vec2<f32>(127.1, 311.7));
  return fract(sin(vec2<f32>(h, h + 12.989)) * 43758.5453);
}

fn noise2(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash2(i).x;
  let b = hash2(i + vec2<f32>(1.0, 0.0)).x;
  let c = hash2(i + vec2<f32>(0.0, 1.0)).x;
  let d = hash2(i + vec2<f32>(1.0, 1.0)).x;
  return 2.0 * (a + (b - a) * u.x + (c - a) * u.y + (a - b - c + d) * u.x * u.y) - 1.0;
}

fn fbm(p: vec2<f32>) -> f32 {
  var val = 0.0;
  var amp = 0.5;
  var freq = 1.0;
  for (var i = 0u; i < 4u; i++) {
    val += amp * noise2(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

fn procedural_pattern(pos: vec3<f32>, uv: vec2<f32>) -> vec3<f32> {
  let worldUV = pos.xz * params.patternScale;
  let time = params.time * params.animSpeed;

  // Animated grid glow
  let gridUV = fract(worldUV) - 0.5;
  let gridDist = max(abs(gridUV.x), abs(gridUV.y));
  let edge = 1.0 - smoothstep(0.0, params.edgeWidth, gridDist);
  let gridGlow = sin(edge * PI * 4.0 - time * 2.0) * 0.5 + 0.5;

  // Value noise overlay
  let n = fbm(worldUV + time * 0.1);
  let noiseVal = n * 0.5 + 0.5;

  // Sweeping bands
  let bands = sin(pos.x * 2.0 + pos.z * 1.5 + time) * 0.5 + 0.5;

  let baseMix = clamp(noiseVal * 0.6 + bands * 0.4, 0.0, 1.0);
  let base = mix(params.baseColor, params.accentColor, baseMix);

  // Glow
  let glowColor = vec4<f32>(1.0, 0.6, 0.1, 1.0);
  let glow = gridGlow * (sin(time * 1.5) * 0.3 + 0.7);

  return base.rgb + glow * glowColor.rgb;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let albedo = procedural_pattern(in.world_pos, in.uv);

  let V = normalize(camera.position - in.world_pos);
  let N = normalize(in.world_norm);

  let roughness = 0.35;
  let metallic = 0.0;
  let lit = calculate_pbr_lighting(albedo, N, V, in.world_pos, roughness, metallic);

  // subtle emissive boost
  let emissive = albedo * 0.08;

  return vec4<f32>(lit + emissive, 1.0);
}
