import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph } from '../src/renderer/render_graph/index.js';

const VS_FULLTRI = `@vertex fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4<f32> {
  let pos = array(vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
  return vec4(pos[vi], 0.0, 1.0);
}`;

const PROC_BB_FS = `
struct TimeUniforms { time: vec4<f32>, }
@group(0) @binding(0) var<uniform> u: TimeUniforms;
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let p = pos.xy / 800.0;
  let t = u.time.x;
  let r = sin(p.x * 12.0 + t * 1.3) * 0.5 + 0.5;
  let g = cos(p.y * 10.0 + t * 0.9) * 0.5 + 0.5;
  let b = sin((p.x + p.y) * 8.0 + t * 1.1) * 0.5 + 0.5;
  return vec4(r, g, b, 1);
}`;

interface Pipeline {
  pipeline: GPURenderPipeline;
  uniformBuf: GPUBuffer;
  uniformBg: GPUBindGroup;
  uboSize: number;
  scratch: Float32Array;
}

function createPipeline(
  device: GPUDevice,
  label: string,
  fragCode: string,
  format: GPUTextureFormat | GPUTextureFormat[],
  uboSize = 112,
): Pipeline {
  const bgl = device.createBindGroupLayout({
    label: `${label}BGL`,
    entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
  });
  const uniformBuf = device.createBuffer({
    label: `${label}UBO`, size: uboSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const uniformBg = device.createBindGroup({
    label: `${label}BG`, layout: bgl,
    entries: [{ binding: 0, resource: { buffer: uniformBuf } }],
  });
  const shader = device.createShaderModule({ label: `${label}Shader`, code: VS_FULLTRI + fragCode });
  const targetFormats: GPUTextureFormat[] = Array.isArray(format) ? format : [format];
  const pipeline = device.createRenderPipeline({
    label: `${label}Pipeline`,
    layout: device.createPipelineLayout({ bindGroupLayouts: [bgl] }),
    vertex: { module: shader, entryPoint: 'vs' },
    fragment: { module: shader, entryPoint: 'fs', targets: targetFormats.map(f => ({ format: f })) },
    primitive: { topology: 'triangle-list' },
  });
  return { pipeline, uniformBuf, uniformBg, uboSize, scratch: new Float32Array(Math.max(16, uboSize / 4)) };
}

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const statsEl = document.getElementById('stats') as HTMLDivElement;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const device = ctx.device;
  const cache = new PhysicalResourceCache(device);
  const fmt = ctx.format;

  const pl: Record<string, Pipeline> = {
    proc: createPipeline(device, 'Procedural', PROC_BB_FS, fmt, 16),
  };

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    cache.trimUnused();
  });
  resizeObserver.observe(canvas);

  let smoothFps = 0;

  function frame(): void {
    ctx.update();
    if (ctx.deltaTime > 0) {
      smoothFps += (1 / ctx.deltaTime - smoothFps) * 0.1;
      statsEl.textContent = `${smoothFps.toFixed(0)} fps | Procedural`;
    }

    const t = ctx.elapsedTime;

    const graph = new RenderGraph(ctx, cache);
    const bb = graph.setBackbuffer('canvas');
    graph.addPass('Procedural', 'render', (b) => {
      b.write(bb, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
      b.setExecute((pctx) => {
        pl.proc.scratch[0] = t;
        ctx.queue.writeBuffer(pl.proc.uniformBuf, 0, new Float32Array(pl.proc.scratch.buffer as ArrayBuffer, 0, pl.proc.uboSize / 4));
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(pl.proc.pipeline);
        enc.setBindGroup(0, pl.proc.uniformBg);
        enc.draw(3);
      });
    });

    const compiled = graph.compile();
    void graph.execute(compiled);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main().catch(err => {
  document.body.innerHTML = `<pre style="color:red;padding:1rem">${err.message ?? err}</pre>`;
  console.error(err);
});
