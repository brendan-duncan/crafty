// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.
// src: rgba8uint — raw RGBE bytes (R, G, B, Exponent), 4 bytes per pixel.
// dst: rgba16float storage texture — linear HDR output.

@group(0) @binding(0) var src : texture_2d<u32>;
@group(1) @binding(0) var dst : texture_storage_2d<rgba16float, write>;

@compute @workgroup_size(8, 8)
fn cs_decode(@builtin(global_invocation_id) gid: vec3<u32>) {
  let size = textureDimensions(src);
  if (gid.x >= size.x || gid.y >= size.y) { return; }

  let rgbe = textureLoad(src, vec2<i32>(gid.xy), 0);
  var rgb  : vec3<f32>;
  if (rgbe.a == 0u) {
    rgb = vec3<f32>(0.0);
  } else {
    // RGBE: scale = 2^(E - 128) / 256  →  2^(E - 136)
    let scale = pow(2.0, f32(rgbe.a) - 136.0);
    rgb = vec3<f32>(f32(rgbe.r), f32(rgbe.g), f32(rgbe.b)) * scale;
  }
  textureStore(dst, vec2<i32>(gid.xy), vec4<f32>(rgb, 1.0));
}
