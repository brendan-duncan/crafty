/**
 * Smoke test for the new render graph module.
 *
 * Builds a graph with:
 *   - one transient HDR-format intermediate texture, written by a clear-pass
 *   - one fullscreen blit-style render pass that copies the intermediate into
 *     the canvas backbuffer (so the backbuffer is also the cull root)
 *   - one orphan compute-style pass that writes nothing reachable from the
 *     backbuffer; the compiler should cull it
 *
 * Visual: canvas pulses through HSV hues. Console reports per-frame which
 * passes survived culling and which were dropped.
 */

import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph } from '../src/renderer/render_graph/index.js';

const blitWgsl = /* wgsl */ `
struct VOut { @builtin(position) pos: vec4f, @location(0) uv: vec2f }

@vertex
fn vs(@builtin(vertex_index) i: u32) -> VOut {
  // Fullscreen triangle covering [-1,1]^2 with uv in [0,1]^2.
  let xy = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
  var out: VOut;
  out.pos = vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
  out.uv  = vec2f(xy.x, 1.0 - xy.y);
  return out;
}

@group(0) @binding(0) var src: texture_2d<f32>;
@group(0) @binding(1) var samp: sampler;

@fragment
fn fs(in: VOut) -> @location(0) vec4f {
  return textureSample(src, samp, in.uv);
}
`;

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true, depthFormat: null });

  const cache = new PhysicalResourceCache(ctx.device);

  const blitModule = ctx.device.createShaderModule({ code: blitWgsl, label: 'smoke-blit' });
  const blitBgl = ctx.device.createBindGroupLayout({
    label: 'smoke-blit-bgl',
    entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
    ],
  });
  const blitPipeline = ctx.device.createRenderPipeline({
    label: 'smoke-blit-pipeline',
    layout: ctx.device.createPipelineLayout({ bindGroupLayouts: [blitBgl] }),
    vertex: { module: blitModule, entryPoint: 'vs' },
    fragment: { module: blitModule, entryPoint: 'fs', targets: [{ format: ctx.format }] },
    primitive: { topology: 'triangle-list' },
  });
  const blitSampler = ctx.device.createSampler({ magFilter: 'linear', minFilter: 'linear' });

  let frame = 0;
  let loggedCull = false;

  function frameLoop(): void {
    ctx.update();

    const graph = new RenderGraph(ctx, cache);
    const backbuffer = graph.setBackbuffer('canvas');

    // Pulse hue → RGB clear color.
    const hue = (frame * 0.01) % 1;
    const [cr, cg, cb] = hsvToRgb(hue, 0.6, 0.8);

    // Pass A: clear into a transient intermediate texture.
    let inter!: ReturnType<RenderGraph['setBackbuffer']>;
    graph.addPass('smoke-clear', 'render', (b) => {
      inter = b.createTexture({
        label: 'smoke-inter',
        format: ctx.format,
        width: ctx.width,
        height: ctx.height,
      });
      inter = b.write(inter, 'attachment', {
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: { r: cr, g: cg, b: cb, a: 1 },
      });
      b.setExecute(() => {/* clear is the entire work */});
    });

    // Pass B: blit the intermediate into the backbuffer.
    graph.addPass('smoke-blit', 'render', (b) => {
      b.read(inter, 'sampled');
      b.write(backbuffer, 'attachment', { loadOp: 'load', storeOp: 'store' });
      b.setExecute((pctx, res) => {
        const view = res.getTextureView(inter);
        const bg = ctx.device.createBindGroup({
          layout: blitBgl,
          entries: [
            { binding: 0, resource: view },
            { binding: 1, resource: blitSampler },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(blitPipeline);
        enc.setBindGroup(0, bg);
        enc.draw(3);
      });
    });

    // Pass C: orphan — writes a transient texture nothing else reads. Should be culled.
    graph.addPass('smoke-orphan', 'render', (b) => {
      const orphan = b.createTexture({
        label: 'smoke-orphan',
        format: ctx.format,
        width: 8,
        height: 8,
      });
      b.write(orphan, 'attachment', {
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: { r: 1, g: 0, b: 1, a: 1 },
      });
      b.setExecute(() => {
        throw new Error('orphan pass should have been culled — execute must not run');
      });
    });

    const compiled = graph.compile();
    if (!loggedCull) {
      const surviving = compiled.passes.map((p) => p.node.name).join(', ');
      console.log(`[render-graph smoke] surviving passes after cull: ${surviving}`);
      console.log(`[render-graph smoke] expected: smoke-clear, smoke-blit (smoke-orphan dropped)`);
      loggedCull = true;
    }

    void graph.execute(compiled);

    frame++;
    requestAnimationFrame(frameLoop);
  }

  requestAnimationFrame(frameLoop);
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: return [v, t, p];
    case 1: return [q, v, p];
    case 2: return [p, v, t];
    case 3: return [p, q, v];
    case 4: return [t, p, v];
    default: return [v, p, q];
  }
}

main().catch((err) => {
  console.error('[render-graph smoke] fatal', err);
});
