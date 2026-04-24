import { Texture } from './texture.js';

export interface HdrData {
  width: number;
  height: number;
  data: Uint8Array; // raw RGBE bytes, 4 bytes per pixel
}

export function parseHdr(buffer: ArrayBuffer): HdrData {
  const bytes = new Uint8Array(buffer);
  let pos = 0;

  function readAsciiLine(): string {
    let s = '';
    while (pos < bytes.length && bytes[pos] !== 0x0a) {
      if (bytes[pos] !== 0x0d) s += String.fromCharCode(bytes[pos]);
      pos++;
    }
    if (pos < bytes.length) pos++; // consume LF
    return s;
  }

  const magic = readAsciiLine();
  if (!magic.startsWith('#?RADIANCE') && !magic.startsWith('#?RGBE')) {
    throw new Error(`Not a Radiance HDR file (magic: "${magic}")`);
  }

  // Skip header key=value lines until blank line
  while (true) {
    const line = readAsciiLine();
    if (line.length === 0) break;
  }

  // Resolution line: -Y height +X width
  const resLine = readAsciiLine();
  const m = resLine.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);
  if (!m) throw new Error(`Unrecognized HDR resolution: "${resLine}"`);
  const height = parseInt(m[1], 10);
  const width  = parseInt(m[2], 10);

  const data = new Uint8Array(width * height * 4);

  // New RLE format: each scanline has [2, 2, W>>8, W&255] header followed by
  // 4 channel-interleaved RLE streams (R, G, B, E separately).
  function readNewScanline(y: number): void {
    const ch0 = new Uint8Array(width);
    const ch1 = new Uint8Array(width);
    const ch2 = new Uint8Array(width);
    const ch3 = new Uint8Array(width);
    const channels = [ch0, ch1, ch2, ch3];

    for (let ch = 0; ch < 4; ch++) {
      const dst = channels[ch];
      let x = 0;
      while (x < width) {
        const code = bytes[pos++];
        if (code > 128) {
          const count = code - 128;
          const val   = bytes[pos++];
          dst.fill(val, x, x + count);
          x += count;
        } else {
          dst.set(bytes.subarray(pos, pos + code), x);
          pos += code;
          x   += code;
        }
      }
    }

    const base = y * width * 4;
    for (let x = 0; x < width; x++) {
      data[base + x * 4 + 0] = ch0[x];
      data[base + x * 4 + 1] = ch1[x];
      data[base + x * 4 + 2] = ch2[x];
      data[base + x * 4 + 3] = ch3[x];
    }
  }

  // Old/uncompressed format: raw RGBE quads with optional old-style run encoding
  // (1,1,1,count) means repeat the previous pixel `count` times.
  function readOldScanline(y: number, r0: number, g0: number, b0: number, e0: number): void {
    const base = y * width * 4;
    data[base + 0] = r0; data[base + 1] = g0; data[base + 2] = b0; data[base + 3] = e0;
    let x = 1;
    while (x < width) {
      const r = bytes[pos++], g = bytes[pos++], b = bytes[pos++], e = bytes[pos++];
      if (r === 1 && g === 1 && b === 1) {
        const prev = base + (x - 1) * 4;
        for (let i = 0; i < e; i++) {
          data[base + x * 4 + 0] = data[prev + 0];
          data[base + x * 4 + 1] = data[prev + 1];
          data[base + x * 4 + 2] = data[prev + 2];
          data[base + x * 4 + 3] = data[prev + 3];
          x++;
        }
      } else {
        data[base + x * 4 + 0] = r;
        data[base + x * 4 + 1] = g;
        data[base + x * 4 + 2] = b;
        data[base + x * 4 + 3] = e;
        x++;
      }
    }
  }

  for (let y = 0; y < height; y++) {
    if (pos + 4 > bytes.length) break;
    const r = bytes[pos++], g = bytes[pos++], b = bytes[pos++], e = bytes[pos++];
    if (r === 2 && g === 2 && (b & 0x80) === 0) {
      const sw = (b << 8) | e;
      if (sw !== width) throw new Error(`HDR scanline width mismatch: ${sw} vs ${width}`);
      readNewScanline(y);
    } else {
      readOldScanline(y, r, g, b, e);
    }
  }

  return { width, height, data };
}

function encodeF16(v: number): number {
  const u32 = new Uint32Array(new Float32Array([v]).buffer)[0];
  const sign = (u32 >> 31) & 1;
  const exp  = (u32 >> 23) & 0xff;
  const man  = u32 & 0x7fffff;
  if (exp === 0xff) return (sign << 15) | 0x7c00 | (man ? 1 : 0);
  if (exp === 0)    return (sign << 15);
  const e16 = exp - 127 + 15;
  if (e16 >= 0x1f) return (sign << 15) | 0x7c00;
  if (e16 <= 0)    return (sign << 15);
  return (sign << 15) | (e16 << 10) | (man >> 13);
}

export function createHdrTexture(device: GPUDevice, hdr: HdrData): Texture {
  const { width, height, data } = hdr;
  const f16 = new Uint16Array(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4 + 0];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const e = data[i * 4 + 3];
    if (e === 0) {
      f16[i * 4 + 0] = f16[i * 4 + 1] = f16[i * 4 + 2] = 0;
    } else {
      const scale = Math.pow(2, e - 136);
      f16[i * 4 + 0] = encodeF16(r * scale);
      f16[i * 4 + 1] = encodeF16(g * scale);
      f16[i * 4 + 2] = encodeF16(b * scale);
    }
    f16[i * 4 + 3] = encodeF16(1.0);
  }

  const tex = device.createTexture({
    label: 'Sky HDR Texture',
    size: { width, height },
    format: 'rgba16float',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  device.queue.writeTexture(
    { texture: tex },
    f16,
    { bytesPerRow: width * 8 },
    { width, height },
  );
  return new Texture(tex, '2d');
}
