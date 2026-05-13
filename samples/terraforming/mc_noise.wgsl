// ── 3D Perlin Noise ─────────────────────────────────────────────────────────

const _randtab: array<u32, 512> = array<u32, 512>(
  23u, 125u, 161u, 52u, 103u, 117u, 70u, 37u, 247u, 101u, 203u, 169u, 124u, 126u, 44u, 123u,
  152u, 238u, 145u, 45u, 171u, 114u, 253u, 10u, 192u, 136u, 4u, 157u, 249u, 30u, 35u, 72u,
  175u, 63u, 77u, 90u, 181u, 16u, 96u, 111u, 133u, 104u, 75u, 162u, 93u, 56u, 66u, 240u,
  8u, 50u, 84u, 229u, 49u, 210u, 173u, 239u, 141u, 1u, 87u, 18u, 2u, 198u, 143u, 57u,
  225u, 160u, 58u, 217u, 168u, 206u, 245u, 204u, 199u, 6u, 73u, 60u, 20u, 230u, 211u, 233u,
  94u, 200u, 88u, 9u, 74u, 155u, 33u, 15u, 219u, 130u, 226u, 202u, 83u, 236u, 42u, 172u,
  165u, 218u, 55u, 222u, 46u, 107u, 98u, 154u, 109u, 67u, 196u, 178u, 127u, 158u, 13u, 243u,
  65u, 79u, 166u, 248u, 25u, 224u, 115u, 80u, 68u, 51u, 184u, 128u, 232u, 208u, 151u, 122u,
  26u, 212u, 105u, 43u, 179u, 213u, 235u, 148u, 146u, 89u, 14u, 195u, 28u, 78u, 112u, 76u,
  250u, 47u, 24u, 251u, 140u, 108u, 186u, 190u, 228u, 170u, 183u, 139u, 39u, 188u, 244u, 246u,
  132u, 48u, 119u, 144u, 180u, 138u, 134u, 193u, 82u, 182u, 120u, 121u, 86u, 220u, 209u, 3u,
  91u, 241u, 149u, 85u, 205u, 150u, 113u, 216u, 31u, 100u, 41u, 164u, 177u, 214u, 153u, 231u,
  38u, 71u, 185u, 174u, 97u, 201u, 29u, 95u, 7u, 92u, 54u, 254u, 191u, 118u, 34u, 221u,
  131u, 11u, 163u, 99u, 234u, 81u, 227u, 147u, 156u, 176u, 17u, 142u, 69u, 12u, 110u, 62u,
  27u, 255u, 0u, 194u, 59u, 116u, 242u, 252u, 19u, 21u, 187u, 53u, 207u, 129u, 64u, 135u,
  61u, 40u, 167u, 237u, 102u, 223u, 106u, 159u, 197u, 189u, 215u, 137u, 36u, 32u, 22u, 5u,
  23u, 125u, 161u, 52u, 103u, 117u, 70u, 37u, 247u, 101u, 203u, 169u, 124u, 126u, 44u, 123u,
  152u, 238u, 145u, 45u, 171u, 114u, 253u, 10u, 192u, 136u, 4u, 157u, 249u, 30u, 35u, 72u,
  175u, 63u, 77u, 90u, 181u, 16u, 96u, 111u, 133u, 104u, 75u, 162u, 93u, 56u, 66u, 240u,
  8u, 50u, 84u, 229u, 49u, 210u, 173u, 239u, 141u, 1u, 87u, 18u, 2u, 198u, 143u, 57u,
  225u, 160u, 58u, 217u, 168u, 206u, 245u, 204u, 199u, 6u, 73u, 60u, 20u, 230u, 211u, 233u,
  94u, 200u, 88u, 9u, 74u, 155u, 33u, 15u, 219u, 130u, 226u, 202u, 83u, 236u, 42u, 172u,
  165u, 218u, 55u, 222u, 46u, 107u, 98u, 154u, 109u, 67u, 196u, 178u, 127u, 158u, 13u, 243u,
  65u, 79u, 166u, 248u, 25u, 224u, 115u, 80u, 68u, 51u, 184u, 128u, 232u, 208u, 151u, 122u,
  26u, 212u, 105u, 43u, 179u, 213u, 235u, 148u, 146u, 89u, 14u, 195u, 28u, 78u, 112u, 76u,
  250u, 47u, 24u, 251u, 140u, 108u, 186u, 190u, 228u, 170u, 183u, 139u, 39u, 188u, 244u, 246u,
  132u, 48u, 119u, 144u, 180u, 138u, 134u, 193u, 82u, 182u, 120u, 121u, 86u, 220u, 209u, 3u,
  91u, 241u, 149u, 85u, 205u, 150u, 113u, 216u, 31u, 100u, 41u, 164u, 177u, 214u, 153u, 231u,
  38u, 71u, 185u, 174u, 97u, 201u, 29u, 95u, 7u, 92u, 54u, 254u, 191u, 118u, 34u, 221u,
  131u, 11u, 163u, 99u, 234u, 81u, 227u, 147u, 156u, 176u, 17u, 142u, 69u, 12u, 110u, 62u,
  27u, 255u, 0u, 194u, 59u, 116u, 242u, 252u, 19u, 21u, 187u, 53u, 207u, 129u, 64u, 135u,
  61u, 40u, 167u, 237u, 102u, 223u, 106u, 159u, 197u, 189u, 215u, 137u, 36u, 32u, 22u, 5u,
);

const _basis: array<vec3<f32>, 12> = array<vec3<f32>, 12>(
  vec3<f32>(1.0, 1.0, 0.0),
  vec3<f32>(-1.0, 1.0, 0.0),
  vec3<f32>(1.0, -1.0, 0.0),
  vec3<f32>(-1.0, -1.0, 0.0),
  vec3<f32>(1.0, 0.0, 1.0),
  vec3<f32>(-1.0, 0.0, 1.0),
  vec3<f32>(1.0, 0.0, -1.0),
  vec3<f32>(-1.0, 0.0, -1.0),
  vec3<f32>(0.0, 1.0, 1.0),
  vec3<f32>(0.0, -1.0, 1.0),
  vec3<f32>(0.0, 1.0, -1.0),
  vec3<f32>(0.0, -1.0, -1.0),
);

const _grad_idx: array<u32, 512> = array<u32, 512>(
  7u, 9u, 5u, 0u, 11u, 1u, 6u, 9u, 3u, 9u, 11u, 1u, 8u, 10u, 4u, 7u,
  8u, 6u, 1u, 5u, 3u, 10u, 9u, 10u, 0u, 8u, 4u, 1u, 5u, 2u, 7u, 8u,
  7u, 11u, 9u, 10u, 1u, 0u, 4u, 7u, 5u, 0u, 11u, 6u, 1u, 4u, 2u, 8u,
  8u, 10u, 4u, 9u, 9u, 2u, 5u, 7u, 9u, 1u, 7u, 2u, 2u, 6u, 11u, 5u,
  5u, 4u, 6u, 9u, 0u, 1u, 1u, 0u, 7u, 6u, 9u, 8u, 4u, 10u, 3u, 1u,
  2u, 8u, 8u, 9u, 10u, 11u, 5u, 11u, 11u, 2u, 6u, 10u, 3u, 4u, 2u, 4u,
  9u, 10u, 3u, 2u, 6u, 3u, 6u, 10u, 5u, 3u, 4u, 10u, 11u, 2u, 9u, 11u,
  1u, 11u, 10u, 4u, 9u, 4u, 11u, 0u, 4u, 11u, 4u, 0u, 0u, 0u, 7u, 6u,
  10u, 4u, 1u, 3u, 11u, 5u, 3u, 4u, 2u, 9u, 1u, 3u, 0u, 1u, 8u, 0u,
  6u, 7u, 8u, 7u, 0u, 4u, 6u, 10u, 8u, 2u, 3u, 11u, 11u, 8u, 0u, 2u,
  4u, 8u, 3u, 0u, 0u, 10u, 6u, 1u, 2u, 2u, 4u, 5u, 6u, 0u, 1u, 3u,
  11u, 9u, 5u, 5u, 9u, 6u, 9u, 8u, 3u, 8u, 1u, 8u, 9u, 6u, 9u, 11u,
  10u, 7u, 5u, 6u, 5u, 9u, 1u, 3u, 7u, 0u, 2u, 10u, 11u, 2u, 6u, 1u,
  3u, 11u, 7u, 7u, 2u, 1u, 7u, 3u, 0u, 8u, 1u, 1u, 5u, 0u, 6u, 10u,
  11u, 11u, 0u, 2u, 7u, 0u, 10u, 8u, 3u, 5u, 7u, 1u, 11u, 1u, 0u, 7u,
  9u, 0u, 11u, 5u, 10u, 3u, 2u, 3u, 5u, 9u, 7u, 9u, 8u, 4u, 6u, 5u,
  7u, 9u, 5u, 0u, 11u, 1u, 6u, 9u, 3u, 9u, 11u, 1u, 8u, 10u, 4u, 7u,
  8u, 6u, 1u, 5u, 3u, 10u, 9u, 10u, 0u, 8u, 4u, 1u, 5u, 2u, 7u, 8u,
  7u, 11u, 9u, 10u, 1u, 0u, 4u, 7u, 5u, 0u, 11u, 6u, 1u, 4u, 2u, 8u,
  8u, 10u, 4u, 9u, 9u, 2u, 5u, 7u, 9u, 1u, 7u, 2u, 2u, 6u, 11u, 5u,
  5u, 4u, 6u, 9u, 0u, 1u, 1u, 0u, 7u, 6u, 9u, 8u, 4u, 10u, 3u, 1u,
  2u, 8u, 8u, 9u, 10u, 11u, 5u, 11u, 11u, 2u, 6u, 10u, 3u, 4u, 2u, 4u,
  9u, 10u, 3u, 2u, 6u, 3u, 6u, 10u, 5u, 3u, 4u, 10u, 11u, 2u, 9u, 11u,
  1u, 11u, 10u, 4u, 9u, 4u, 11u, 0u, 4u, 11u, 4u, 0u, 0u, 0u, 7u, 6u,
  10u, 4u, 1u, 3u, 11u, 5u, 3u, 4u, 2u, 9u, 1u, 3u, 0u, 1u, 8u, 0u,
  6u, 7u, 8u, 7u, 0u, 4u, 6u, 10u, 8u, 2u, 3u, 11u, 11u, 8u, 0u, 2u,
  4u, 8u, 3u, 0u, 0u, 10u, 6u, 1u, 2u, 2u, 4u, 5u, 6u, 0u, 1u, 3u,
  11u, 9u, 5u, 5u, 9u, 6u, 9u, 8u, 3u, 8u, 1u, 8u, 9u, 6u, 9u, 11u,
  10u, 7u, 5u, 6u, 5u, 9u, 1u, 3u, 7u, 0u, 2u, 10u, 11u, 2u, 6u, 1u,
  3u, 11u, 7u, 7u, 2u, 1u, 7u, 3u, 0u, 8u, 1u, 1u, 5u, 0u, 6u, 10u,
  11u, 11u, 0u, 2u, 7u, 0u, 10u, 8u, 3u, 5u, 7u, 1u, 11u, 1u, 0u, 7u,
  9u, 0u, 11u, 5u, 10u, 3u, 2u, 3u, 5u, 9u, 7u, 9u, 8u, 4u, 6u, 5u,
);

fn _ease(t: f32) -> f32 {
  return ((t * 6.0 - 15.0) * t + 10.0) * t * t * t;
}

fn perlin_noise_3d(p: vec3<f32>, seed: u32) -> f32 {
  var ix = i32(floor(p.x));
  var iy = i32(floor(p.y));
  var iz = i32(floor(p.z));
  let fx = p.x - f32(ix);
  let fy = p.y - f32(iy);
  let fz = p.z - f32(iz);
  let u = _ease(fx);
  let v = _ease(fy);
  let w = _ease(fz);

  ix = ix & 0xFF;
  iy = iy & 0xFF;
  iz = iz & 0xFF;

  let s = i32(seed & 0xFFu);
  let r0  = i32(_randtab[u32(ix) + u32(s)]);
  let r1  = i32(_randtab[u32(ix + 1) + u32(s)]);
  let r00 = i32(_randtab[u32(r0 + iy)]);
  let r01 = i32(_randtab[u32(r0 + iy + 1)]);
  let r10 = i32(_randtab[u32(r1 + iy)]);
  let r11 = i32(_randtab[u32(r1 + iy + 1)]);

  let n000 = dot(_basis[_grad_idx[u32(r00 + iz)]],   vec3<f32>(fx,     fy,     fz    ));
  let n001 = dot(_basis[_grad_idx[u32(r00 + iz + 1)]], vec3<f32>(fx,     fy,     fz-1.0));
  let n010 = dot(_basis[_grad_idx[u32(r01 + iz)]],   vec3<f32>(fx,     fy-1.0, fz    ));
  let n011 = dot(_basis[_grad_idx[u32(r01 + iz + 1)]], vec3<f32>(fx,     fy-1.0, fz-1.0));
  let n100 = dot(_basis[_grad_idx[u32(r10 + iz)]],   vec3<f32>(fx-1.0, fy,     fz    ));
  let n101 = dot(_basis[_grad_idx[u32(r10 + iz + 1)]], vec3<f32>(fx-1.0, fy,     fz-1.0));
  let n110 = dot(_basis[_grad_idx[u32(r11 + iz)]],   vec3<f32>(fx-1.0, fy-1.0, fz    ));
  let n111 = dot(_basis[_grad_idx[u32(r11 + iz + 1)]], vec3<f32>(fx-1.0, fy-1.0, fz-1.0));

  let n00 = mix(n000, n001, w);
  let n01 = mix(n010, n011, w);
  let n10 = mix(n100, n101, w);
  let n11 = mix(n110, n111, w);
  let n0  = mix(n00, n01, v);
  let n1  = mix(n10, n11, v);
  return mix(n0, n1, u);
}

fn perlin_fbm_3d(p: vec3<f32>, octaves: u32, lacunarity: f32, gain: f32) -> f32 {
  var freq = 1.0;
  var amp = 1.0;
  var sum = 0.0;
  for (var i = 0u; i < octaves; i++) {
    sum += perlin_noise_3d(p * freq, i) * amp;
    freq *= lacunarity;
    amp *= gain;
  }
  return sum;
}

fn perlin_ridged_3d(p: vec3<f32>, octaves: u32, lacunarity: f32, gain: f32, offset: f32) -> f32 {
  var freq = 1.0;
  var amp = 0.5;
  var sum = 0.0;
  var prev = 1.0;
  for (var i = 0u; i < octaves; i++) {
    var n = perlin_noise_3d(p * freq, i);
    n = offset - abs(n);
    n = n * n;
    sum += n * amp * prev;
    prev = n;
    freq *= lacunarity;
    amp *= gain;
  }
  return sum;
}
