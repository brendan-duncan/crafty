// Particle GBuffer render pass — camera-facing billboard quads.
// Each instance reads one alive particle and writes to the deferred GBuffer.
// Normal is the billboard face direction (toward camera) for deferred lighting.

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

struct ParticleRenderUniforms {
  roughness : f32,
  metallic  : f32,
  _pad      : vec2<f32>,
}

@group(0) @binding(0) var<storage, read> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read> alive_list : array<u32>;
@group(1) @binding(0) var<uniform>       camera     : CameraUniforms;
@group(2) @binding(0) var<uniform>       mat_params : ParticleRenderUniforms;

struct VertexOutput {
  @builtin(position) clip_pos  : vec4<f32>,
  @location(0)       color     : vec4<f32>,
  @location(1)       uv        : vec2<f32>,
  @location(2)       world_pos : vec3<f32>,
  @location(3)       face_norm : vec3<f32>,
}

// 2-triangle quad: 6 vertex positions in [-0.5, 0.5]²
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

  // Camera right and up from the view matrix rows (column-major storage)
  let cam_right = vec3<f32>(camera.view[0].x, camera.view[1].x, camera.view[2].x);
  let cam_up    = vec3<f32>(camera.view[0].y, camera.view[1].y, camera.view[2].y);

  // Rotate quad corner around particle center using particle.rotation angle
  let ofs    = quad_offset(vid);
  let c      = cos(p.rotation);
  let s      = sin(p.rotation);
  let rotated = vec2<f32>(c * ofs.x - s * ofs.y, s * ofs.x + c * ofs.y);

  let world_pos = p.position
    + cam_right * rotated.x * p.size
    + cam_up    * rotated.y * p.size;

  let face_norm = normalize(camera.position - p.position);

  var out: VertexOutput;
  out.clip_pos  = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color     = p.color;
  out.uv        = quad_uv(vid);
  out.world_pos = world_pos;
  out.face_norm = face_norm;
  return out;
}

struct GBufferOutput {
  @location(0) albedo_roughness : vec4<f32>,  // rgba8unorm
  @location(1) normal_metallic  : vec4<f32>,  // rgba16float
}

@fragment
fn fs_main(in: VertexOutput) -> GBufferOutput {
  // Circular clip for round particles
  let d = length(in.uv - 0.5) * 2.0;
  if (d > 1.0) { discard; }

  // Encode world-space normal as [0,1]
  let N = normalize(in.face_norm);

  var out: GBufferOutput;
  out.albedo_roughness = vec4<f32>(in.color.rgb, mat_params.roughness);
  out.normal_metallic  = vec4<f32>(N * 0.5 + 0.5, mat_params.metallic);
  return out;
}
