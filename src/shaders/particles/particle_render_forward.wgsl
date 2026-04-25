// Particle forward HDR render pass — velocity-aligned billboard quads.
// Writes directly to the HDR buffer with alpha blending.
// Used for transparent effects like rain, smoke, sparks.

struct Particle {
  position : vec3<f32>,
  life     : f32,
  velocity : vec3<f32>,
  max_life : f32,
  color    : vec4<f32>,
  size     : f32,
  rotation : f32,
  _pad     : vec2<f32>,
}

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

@group(0) @binding(0) var<storage, read> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read> alive_list : array<u32>;
@group(1) @binding(0) var<uniform>       camera     : CameraUniforms;

struct VertexOutput {
  @builtin(position) clip_pos : vec4<f32>,
  @location(0)       color    : vec4<f32>,
  @location(1)       uv       : vec2<f32>,
}

// Quad UV: x in [-0.5, 0.5], y in [-0.5, 0.5].
// y=−0.5 is the tail (toward velocity), y=+0.5 is the head.
fn quad_offset(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(-0.5, -0.5); }
    case 1u: { return vec2<f32>( 0.5, -0.5); }
    case 2u: { return vec2<f32>(-0.5,  0.5); }
    case 3u: { return vec2<f32>( 0.5, -0.5); }
    case 4u: { return vec2<f32>( 0.5,  0.5); }
    default: { return vec2<f32>(-0.5,  0.5); }
  }
}

fn quad_uv(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(0.0, 1.0); }
    case 1u: { return vec2<f32>(1.0, 1.0); }
    case 2u: { return vec2<f32>(0.0, 0.0); }
    case 3u: { return vec2<f32>(1.0, 1.0); }
    case 4u: { return vec2<f32>(1.0, 0.0); }
    default: { return vec2<f32>(0.0, 0.0); }
  }
}

@vertex
fn vs_main(
  @builtin(vertex_index)   vid: u32,
  @builtin(instance_index) iid: u32,
) -> VertexOutput {
  let p_idx = alive_list[iid];
  let p     = particles[p_idx];

  let ofs = quad_offset(vid);

  // Velocity-aligned billboard: long axis follows velocity direction.
  let vel     = p.velocity;
  let spd     = length(vel);
  let vel_dir = select(vec3<f32>(0.0, 1.0, 0.0), vel / max(spd, 0.001), spd > 0.001);
  let cam_dir = normalize(camera.position - p.position);
  // right is perpendicular to both velocity and cam direction
  let right   = normalize(cross(vel_dir, cam_dir));

  // Minimal stretch so each drop stays compact
  let stretch = 1.0 + spd * 0.04;

  let world_pos = p.position
    + right   * ofs.x * p.size
    + vel_dir * ofs.y * p.size * stretch;

  var out: VertexOutput;
  out.clip_pos = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color    = p.color;
  out.uv       = quad_uv(vid);
  return out;
}

const EMIT_SCALE: f32 = 4.0;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Fade alpha at the tips of the streak (uv.y near 0 or 1)
  let t = abs(in.uv.y * 2.0 - 1.0);
  let alpha = in.color.a * (1.0 - t * t);
  return vec4<f32>(in.color.rgb * EMIT_SCALE, alpha);
}

// ---- Camera-aligned billboard (snow, soft particles) ------------------------

@vertex
fn vs_camera(
  @builtin(vertex_index)   vid: u32,
  @builtin(instance_index) iid: u32,
) -> VertexOutput {
  let p_idx = alive_list[iid];
  let p     = particles[p_idx];

  let ofs = quad_offset(vid);

  // Extract world-space right and up from the view matrix rows.
  // Column-major mat4x4: view[col][row], so row 0 = right, row 1 = up.
  let right = vec3<f32>(camera.view[0][0], camera.view[1][0], camera.view[2][0]);
  let up    = vec3<f32>(camera.view[0][1], camera.view[1][1], camera.view[2][1]);

  let world_pos = p.position
    + right * ofs.x * p.size
    + up    * ofs.y * p.size;

  var out: VertexOutput;
  out.clip_pos = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color    = p.color;
  out.uv       = quad_uv(vid);
  return out;
}

@fragment
fn fs_snow(in: VertexOutput) -> @location(0) vec4<f32> {
  // Soft circular disc with radial falloff from centre.
  let uv = in.uv * 2.0 - 1.0;
  let d2 = dot(uv, uv);
  if (d2 > 1.0) { discard; }
  let alpha = in.color.a * (1.0 - d2);
  return vec4<f32>(in.color.rgb * EMIT_SCALE, alpha);
}
