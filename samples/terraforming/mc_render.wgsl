struct McVertex {
  pos: vec3<f32>,
  norm: vec3<f32>,
};

struct VertexOutput {
  @builtin(position) fragPos: vec4<f32>,
  @location(0) worldPos: vec3<f32>,
  @location(1) normal: vec3<f32>,
};

@group(0) @binding(0) var<uniform> renderUni: RenderUniforms;
@group(0) @binding(1) var<storage, read> vertices: array<McVertex>;

struct RenderUniforms {
  view: mat4x4<f32>,
  proj: mat4x4<f32>,
  viewProj: mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  camPos: vec3<f32>,
  near: f32,
  far: f32,
  _pad0: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) idx: u32) -> VertexOutput {
  let v = vertices[idx];
  var out: VertexOutput;
  out.worldPos = v.pos;
  out.normal = v.norm;
  out.fragPos = renderUni.viewProj * vec4<f32>(v.pos, 1.0);
  return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let lightDir = normalize(vec3<f32>(0.5, 1.0, 0.3));
  let lightColor = vec3<f32>(1.0, 0.95, 0.9);
  let ambientColor = vec3<f32>(0.2, 0.25, 0.3);

  let baseColor = vec3<f32>(0.42, 0.35, 0.28);

  var n = normalize(in.normal);
  let ndotl = max(0.0, dot(n, lightDir));
  
  let diffuse = ndotl * lightColor;
  let specPower = 16.0;
  let viewDir = normalize(renderUni.camPos - in.worldPos);
  let halfDir = normalize(lightDir + viewDir);
  let spec = pow(max(0.0, dot(n, halfDir)), specPower) * 0.5;

  let finalColor = baseColor * (ambientColor + diffuse) + vec3<f32>(spec);
  return vec4<f32>(finalColor, 1.0);
}
