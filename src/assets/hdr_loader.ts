import rgbeDecodeWgsl from '../shaders/rgbe_decode.wgsl?raw';
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

// ---- RGBE decode pipeline cache (compiled once per device) -------------------

interface DecodeResources {
  pipeline : GPUComputePipeline;
  srcBGL   : GPUBindGroupLayout;
  dstBGL   : GPUBindGroupLayout;
}

const _decodeCache = new WeakMap<GPUDevice, DecodeResources>();

function getOrCreateDecodeResources(device: GPUDevice): DecodeResources {
  const cached = _decodeCache.get(device);
  if (cached) return cached;

  const srcBGL = device.createBindGroupLayout({
    label: 'RgbeSrcBGL',
    entries: [{
      binding: 0, visibility: GPUShaderStage.COMPUTE,
      texture: { sampleType: 'uint' },
    }],
  });

  const dstBGL = device.createBindGroupLayout({
    label: 'RgbeDstBGL',
    entries: [{
      binding: 0, visibility: GPUShaderStage.COMPUTE,
      storageTexture: { access: 'write-only', format: 'rgba16float', viewDimension: '2d' },
    }],
  });

  const layout   = device.createPipelineLayout({ bindGroupLayouts: [srcBGL, dstBGL] });
  const module   = device.createShaderModule({ label: 'RgbeDecode', code: rgbeDecodeWgsl });
  const pipeline = device.createComputePipeline({
    label: 'RgbeDecodePipeline', layout,
    compute: { module, entryPoint: 'cs_decode' },
  });

  const res = { pipeline, srcBGL, dstBGL };
  _decodeCache.set(device, res);
  return res;
}

// Uploads raw RGBE bytes as rgba8uint and decodes to rgba16float on the GPU.
// Returns only after the decode dispatch has completed.
export async function createHdrTexture(device: GPUDevice, hdr: HdrData): Promise<Texture> {
  const { width, height, data } = hdr;
  const { pipeline, srcBGL, dstBGL } = getOrCreateDecodeResources(device);

  // Upload raw RGBE as rgba8uint — no per-pixel Math.pow on the CPU.
  const srcTex = device.createTexture({
    label: 'Sky RGBE Raw',
    size: { width, height },
    format: 'rgba8uint',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  device.queue.writeTexture(
    { texture: srcTex },
    data.buffer as ArrayBuffer,
    { bytesPerRow: width * 4 },
    { width, height },
  );

  const dstTex = device.createTexture({
    label: 'Sky HDR Texture',
    size: { width, height },
    format: 'rgba16float',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
  });

  const srcBG = device.createBindGroup({
    layout: srcBGL,
    entries: [{ binding: 0, resource: srcTex.createView() }],
  });
  const dstBG = device.createBindGroup({
    layout: dstBGL,
    entries: [{ binding: 0, resource: dstTex.createView() }],
  });

  const encoder = device.createCommandEncoder({ label: 'RgbeDecodeEncoder' });
  const pass    = encoder.beginComputePass({ label: 'RgbeDecodePass' });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, srcBG);
  pass.setBindGroup(1, dstBG);
  pass.dispatchWorkgroups(Math.ceil(width / 8), Math.ceil(height / 8));
  pass.end();
  device.queue.submit([encoder.finish()]);

  await device.queue.onSubmittedWorkDone();
  srcTex.destroy();

  return new Texture(dstTex, '2d');
}
