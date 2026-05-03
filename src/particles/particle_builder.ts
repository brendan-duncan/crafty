import type { ParticleGraphConfig, ModifierNode, EventNode, SpawnShape } from './particle_types.js';

// ---- Shared WGSL header (structs + random utils) --------------------------------

const PARTICLE_HEADER_WGSL = /* wgsl */`
struct Particle {
  position : vec3<f32>,  // offset  0
  life     : f32,        // offset 12  (-1 = dead)
  velocity : vec3<f32>,  // offset 16
  max_life : f32,        // offset 28
  color    : vec4<f32>,  // offset 32
  size     : f32,        // offset 48
  rotation : f32,        // offset 52
  _pad     : vec2<f32>,  // offset 56
}                        // total: 64 bytes

struct ComputeUniforms {
  world_pos     : vec3<f32>,
  spawn_count   : u32,
  world_quat    : vec4<f32>,
  spawn_offset  : u32,
  max_particles : u32,
  frame_seed    : u32,
  _pad0         : u32,
  dt            : f32,
  time          : f32,
  _pad1         : vec2<f32>,
}

fn pcg_hash(v: u32) -> u32 {
  let state = v * 747796405u + 2891336453u;
  let word  = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

fn rand_f32(seed: u32) -> f32 {
  return f32(pcg_hash(seed)) / 4294967295.0;
}

fn rand_range(lo: f32, hi: f32, seed: u32) -> f32 {
  return lo + rand_f32(seed) * (hi - lo);
}

fn quat_rotate(q: vec4<f32>, v: vec3<f32>) -> vec3<f32> {
  let t = 2.0 * cross(q.xyz, v);
  return v + q.w * t + cross(q.xyz, t);
}

// Uniform sample in a spherical cap of half-angle acos(cos_max) around +Y.
fn sample_cone(seed0: u32, seed1: u32, cos_max: f32) -> vec3<f32> {
  let cos_theta = mix(cos_max, 1.0, rand_f32(seed0));
  let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
  let phi       = rand_f32(seed1) * 6.28318530717958647;
  return vec3<f32>(sin_theta * cos(phi), cos_theta, sin_theta * sin(phi));
}

// 3-component gradient noise helpers for curl noise
fn hash3(p: vec3<f32>) -> vec3<f32> {
  var q = vec3<f32>(
    dot(p, vec3<f32>(127.1, 311.7, 74.7)),
    dot(p, vec3<f32>(269.5, 183.3, 246.1)),
    dot(p, vec3<f32>(113.5,  271.9, 124.6)),
  );
  return fract(sin(q) * 43758.5453123);
}

fn noise3(p: vec3<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(dot(hash3(i + vec3(0.,0.,0.)) * 2.0 - 1.0, f - vec3(0.,0.,0.)),
            dot(hash3(i + vec3(1.,0.,0.)) * 2.0 - 1.0, f - vec3(1.,0.,0.)), u.x),
        mix(dot(hash3(i + vec3(0.,1.,0.)) * 2.0 - 1.0, f - vec3(0.,1.,0.)),
            dot(hash3(i + vec3(1.,1.,0.)) * 2.0 - 1.0, f - vec3(1.,1.,0.)), u.x), u.y),
    mix(mix(dot(hash3(i + vec3(0.,0.,1.)) * 2.0 - 1.0, f - vec3(0.,0.,1.)),
            dot(hash3(i + vec3(1.,0.,1.)) * 2.0 - 1.0, f - vec3(1.,0.,1.)), u.x),
        mix(dot(hash3(i + vec3(0.,1.,1.)) * 2.0 - 1.0, f - vec3(0.,1.,1.)),
            dot(hash3(i + vec3(1.,1.,1.)) * 2.0 - 1.0, f - vec3(1.,1.,1.)), u.x), u.y), u.z);
}

fn curl_noise(p: vec3<f32>) -> vec3<f32> {
  let e  = 0.1;
  let ex = vec3<f32>(e,   0.0, 0.0);
  let ey = vec3<f32>(0.0, e,   0.0);
  let ez = vec3<f32>(0.0, 0.0, e  );
  // Three decorrelated potential fields: Fx=noise3(p), Fy=noise3(p+o1), Fz=noise3(p+o2)
  let o1 = vec3<f32>(31.416, 27.183, 14.142);
  let o2 = vec3<f32>(62.832, 54.366, 28.284);
  // curl(F).x = dFz/dy - dFy/dz
  let cx = (noise3(p + o2 + ey) - noise3(p + o2 - ey))
         - (noise3(p + o1 + ez) - noise3(p + o1 - ez));
  // curl(F).y = dFx/dz - dFz/dx
  let cy = (noise3(p + ez)      - noise3(p - ez))
         - (noise3(p + o2 + ex) - noise3(p + o2 - ex));
  // curl(F).z = dFy/dx - dFx/dy
  let cz = (noise3(p + o1 + ex) - noise3(p + o1 - ex))
         - (noise3(p + ey)      - noise3(p - ey));
  return vec3<f32>(cx, cy, cz) / (2.0 * e);
}

// FBM curl noise: sums octaves at increasing frequencies / decreasing amplitudes.
// Normalized so output magnitude matches single-octave curl_noise.
fn curl_noise_fbm(p: vec3<f32>, octaves: i32) -> vec3<f32> {
  var result    = vec3<f32>(0.0);
  var freq      = 1.0;
  var amp       = 0.5;
  var total_amp = 0.0;
  for (var o = 0; o < octaves; o++) {
    result    += curl_noise(p * freq) * amp;
    total_amp += amp;
    freq      *= 2.0;
    amp       *= 0.5;
  }
  return result / total_amp;
}
`;

// ---- Spawn shape code snippets --------------------------------------------------

function spawnShapeWgsl(shape: SpawnShape): string {
  switch (shape.kind) {
    case 'sphere': {
      const cosMax = Math.cos(shape.solidAngle).toFixed(6);
      const r = shape.radius.toFixed(6);
      return `{
  let dir = sample_cone(seed + 10u, seed + 11u, ${cosMax});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${r};
  p.velocity = world_dir * speed;
}`;
    }
    case 'cone': {
      const cosMax = Math.cos(shape.angle).toFixed(6);
      const r = shape.radius.toFixed(6);
      return `{
  let dir = sample_cone(seed + 10u, seed + 11u, ${cosMax});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${r};
  p.velocity = world_dir * speed;
}`;
    }
    case 'box': {
      const [hx, hy, hz] = shape.halfExtents.map(v => v.toFixed(6));
      return `{
  let local_off = vec3<f32>(
    (rand_f32(seed + 10u) * 2.0 - 1.0) * ${hx},
    (rand_f32(seed + 11u) * 2.0 - 1.0) * ${hy},
    (rand_f32(seed + 12u) * 2.0 - 1.0) * ${hz},
  );
  let up = quat_rotate(uniforms.world_quat, vec3<f32>(0.0, 1.0, 0.0));
  p.position = uniforms.world_pos + quat_rotate(uniforms.world_quat, local_off);
  p.velocity = up * speed;
}`;
    }
  }
}

// ---- Modifier code snippets -----------------------------------------------------

function modifierWgsl(mod: ModifierNode): string {
  switch (mod.type) {
    case 'gravity':
      return `p.velocity.y -= ${mod.strength.toFixed(6)} * uniforms.dt;`;
    case 'drag':
      return `p.velocity -= p.velocity * ${mod.coefficient.toFixed(6)} * uniforms.dt;`;
    case 'force': {
      const [fx, fy, fz] = mod.direction.map(v => v.toFixed(6));
      return `p.velocity += vec3<f32>(${fx}, ${fy}, ${fz}) * ${mod.strength.toFixed(6)} * uniforms.dt;`;
    }
    case 'swirl_force': {
      const spd = mod.speed.toFixed(6);
      const str = mod.strength.toFixed(6);
      return `{
  let swirl_angle = uniforms.time * ${spd};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${str} * uniforms.dt;
}`;
    }
    case 'vortex': {
      const str = mod.strength.toFixed(6);
      // Solid-body rotation in XZ around the emitter's world position.
      // radial = offset from axis; tangent = 90° CCW rotation of radial.
      // Force ∝ radius → constant angular acceleration, gentle near centre.
      return `{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${str} * uniforms.dt;
}`;
    }
    case 'curl_noise': {
      const octaves = mod.octaves ?? 1;
      const fn = octaves > 1 ? `curl_noise_fbm(cn_pos, ${octaves})` : `curl_noise(cn_pos)`;
      return `{
  let cn_pos = p.position * ${mod.scale.toFixed(6)} + uniforms.time * ${mod.timeScale.toFixed(6)};
  p.velocity += ${fn} * ${mod.strength.toFixed(6)} * uniforms.dt;
}`;
    }
    case 'size_random':
      // Stable per-slot random: same particle slot always gets the same size.
      return `p.size = rand_range(${mod.min.toFixed(6)}, ${mod.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;
    case 'size_over_lifetime':
      return `p.size = mix(${mod.start.toFixed(6)}, ${mod.end.toFixed(6)}, t);`;
    case 'color_over_lifetime': {
      const [sr, sg, sb, sa] = mod.startColor.map(v => v.toFixed(6));
      const [er, eg, eb, ea] = mod.endColor.map(v => v.toFixed(6));
      return `p.color = mix(vec4<f32>(${sr}, ${sg}, ${sb}, ${sa}), vec4<f32>(${er}, ${eg}, ${eb}, ${ea}), t);`;
    }
    case 'block_collision':
      return `{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`;
  }
}

// ---- Event action injection -----------------------------------------------------

function eventActionsWgsl(events: EventNode[] | undefined, trigger: 'on_spawn' | 'on_death'): string {
  if (!events) {
    return '';
  }
  return events
    .filter(e => e.trigger === trigger)
    .flatMap(e => e.actions.map(modifierWgsl))
    .join('\n  ');
}

// ---- Spawn compute shader -------------------------------------------------------

export function buildSpawnShader(config: ParticleGraphConfig): string {
  const { emitter, events } = config;
  const [lifeMin, lifeMax] = emitter.lifetime.map(v => v.toFixed(6));
  const [speedMin, speedMax] = emitter.initialSpeed.map(v => v.toFixed(6));
  const [sizeMin, sizeMax] = emitter.initialSize.map(v => v.toFixed(6));
  const [cr, cg, cb, ca] = emitter.initialColor.map(v => v.toFixed(6));

  return /* wgsl */`
${PARTICLE_HEADER_WGSL}

@group(0) @binding(0) var<storage, read_write> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;
@group(1) @binding(0) var<uniform>             uniforms   : ComputeUniforms;

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= uniforms.spawn_count) { return; }

  let idx  = (uniforms.spawn_offset + gid.x) % uniforms.max_particles;
  // Use the globally unique cumulative spawn index as the seed so consecutive frames
  // never collide on gid.x + frame_seed = (gid.x+1) + (frame_seed-1).
  let seed = pcg_hash(uniforms.spawn_offset + gid.x);

  let speed = rand_range(${speedMin}, ${speedMax}, seed + 1u);

  var p: Particle;
  p.life     = 0.0;
  p.max_life = rand_range(${lifeMin}, ${lifeMax}, seed + 2u);
  p.color    = vec4<f32>(${cr}, ${cg}, ${cb}, ${ca});
  p.size     = rand_range(${sizeMin}, ${sizeMax}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${spawnShapeWgsl(emitter.shape)}

  ${eventActionsWgsl(events, 'on_spawn')}

  particles[idx] = p;
}
`;
}

export function hasBlockCollision(config: ParticleGraphConfig): boolean {
  return config.modifiers.some(m => m.type === 'block_collision');
}

// ---- Heightmap bindings (injected when block_collision is present) ---------------

const HEIGHTMAP_WGSL = /* wgsl */`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;

// ---- Update compute shader ------------------------------------------------------

export function buildUpdateShader(config: ParticleGraphConfig): string {
  const hasBlockCollision = config.modifiers.some(m => m.type === 'block_collision');
  const modifierCode = config.modifiers.map(modifierWgsl).join('\n  ');
  const onDeathCode  = eventActionsWgsl(config.events, 'on_death');

  return /* wgsl */`
${PARTICLE_HEADER_WGSL}
${hasBlockCollision ? HEIGHTMAP_WGSL : ''}

@group(0) @binding(0) var<storage, read_write> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;
@group(1) @binding(0) var<uniform>             uniforms   : ComputeUniforms;

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= uniforms.max_particles) { return; }

  var p = particles[idx];
  if (p.life < 0.0) { return; }

  p.life += uniforms.dt;
  if (p.life >= p.max_life) {
    ${onDeathCode}
    particles[idx].life = -1.0;
    return;
  }

  let t = p.life / p.max_life;

  ${modifierCode}

  p.position += p.velocity * uniforms.dt;
  particles[idx] = p;
}
`;
}
