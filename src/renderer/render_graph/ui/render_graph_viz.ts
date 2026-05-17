import type { RenderGraph, CompiledGraph } from '../index.js';

export interface PassNodeData {
  id: number;
  name: string;
  enabled: boolean;
  type?: string;
}

export interface TextureNodeData {
  id: number;
  label: string;
  isBackbuffer: boolean;
  format?: string;
  kind?: 'texture' | 'buffer';
  width?: number;
  height?: number;
  size?: number;
}

export interface GraphEdge {
  fromType: 'pass' | 'texture';
  fromId: number;
  toType: 'pass' | 'texture';
  toId: number;
}

export interface FullGraphData {
  passes: PassNodeData[];
  textures: TextureNodeData[];
  edges: GraphEdge[];
}

export interface RenderGraphVizCallbacks {
  onBeforeOpen?: () => void;
  onAfterClose?: () => void;
}

export interface RenderGraphAttachOptions {
  /** Hotkey code (KeyboardEvent.code) that toggles the overlay. Default `'KeyG'`. Pass `null` to skip. */
  hotkey?: string | null;
  /** When provided, a small hint pill is inserted at the bottom of the page. Pass `null` to skip. Default text describes the hotkey. */
  hint?: string | null;
  /** Where to attach the hint label. Defaults to `document.body`. */
  hintParent?: HTMLElement;
}

export interface RenderGraphViz {
  overlay: HTMLDivElement;
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
  /**
   * Capture the structure of `graph` (and optionally `compiled`, used to mark
   * culled passes) and render it inside the overlay. Safe to call every frame —
   * the data is only rebuilt when the overlay is open or the next time it is.
   */
  setGraph: (graph: RenderGraph, compiled?: CompiledGraph) => void;
  setPasses: (passes: PassNodeData[]) => void;
  setFullGraph: (data: FullGraphData) => void;
  /**
   * One-call wiring: installs the toggle hotkey and (unless suppressed) a
   * small hint pill at the bottom of the page. Returns the viz unchanged so
   * the call can be chained.
   */
  attach: (opts?: RenderGraphAttachOptions) => RenderGraphViz;
}

const NODE_W = 176;
const NODE_H = 40;
const TEX_R = 16;
const GAP_Y = 24;
const L_PAD = 40;
const R_PAD = 40;
const PASS_X = L_PAD;
const TEX_X = L_PAD + NODE_W + 64;
const TITLE_H = 48;
const COL_W = TEX_X + TEX_R * 2 + R_PAD;

export function createRenderGraphViz(
  reticle: HTMLDivElement | null,
  callbacks?: RenderGraphVizCallbacks,
): RenderGraphViz {
  const overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:80',
    'background:rgba(0,0,0,0.55)',
    'display:none', 'overflow:hidden',
    'backdrop-filter:blur(2px)',
  ].join(';');
  document.body.appendChild(overlay);

  overlay.addEventListener('mousedown', (e) => { e.stopPropagation(); });
  overlay.addEventListener('mouseup',   (e) => { e.stopPropagation(); });
  overlay.addEventListener('mousemove', (e) => { e.stopPropagation(); });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '\u00d7';
  closeBtn.style.cssText = [
    'position:absolute', 'top:8px', 'right:12px',
    'width:32px', 'height:32px', 'padding:0',
    'background:rgba(255,255,255,0.08)', 'border:1px solid rgba(255,255,255,0.15)',
    'color:#fff', 'font-size:22px', 'border-radius:6px',
    'cursor:pointer', 'z-index:20',
    'display:flex', 'align-items:center', 'justify-content:center',
    'line-height:1', 'transition:background 0.15s',
  ].join(';');
  closeBtn.addEventListener('mouseenter', () => { closeBtn.style.background = 'rgba(255,255,255,0.18)'; });
  closeBtn.addEventListener('mouseleave', () => { closeBtn.style.background = 'rgba(255,255,255,0.08)'; });
  closeBtn.addEventListener('click', () => close());
  overlay.appendChild(closeBtn);

  const titleBar = document.createElement('div');
  titleBar.style.cssText = [
    'position:absolute', 'top:0', 'left:0', 'right:0', 'height:48px',
    'display:flex', 'align-items:center', 'justify-content:space-between',
    'padding:0 52px 0 16px',
    'color:#fff', 'font-size:13px', 'z-index:15',
    'pointer-events:none',
    'background:linear-gradient(180deg,rgba(0,0,0,0.5) 0%,transparent 100%)',
  ].join(';');
  titleBar.innerHTML = '<span style="font-weight:700;letter-spacing:0.08em;font-size:15px">RENDER GRAPH</span>';

  const controls = document.createElement('span');
  controls.style.cssText = 'font-size:11px;opacity:0.5;pointer-events:auto';
  controls.textContent = 'Drag to pan \u00b7 Scroll to zoom \u00b7 Drag nodes \u00b7 A to frame all \u00b7 ESC to close';
  titleBar.appendChild(controls);
  overlay.appendChild(titleBar);

  const viewport = document.createElement('div');
  viewport.style.cssText = [
    'position:absolute', `inset:${TITLE_H}px 0 0 0`,
    'overflow:hidden', 'cursor:grab',
  ].join(';');
  overlay.appendChild(viewport);

  const transformLayer = document.createElement('div');
  transformLayer.style.cssText = [
    'position:absolute', 'top:0', 'left:0',
    'transform-origin:0 0',
  ].join(';');
  viewport.appendChild(transformLayer);

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('style', 'position:absolute;top:0;left:0;pointer-events:none;overflow:visible');
  transformLayer.appendChild(svg);

  const nodesLayer = document.createElement('div');
  nodesLayer.style.cssText = 'position:absolute;top:0;left:0';
  transformLayer.appendChild(nodesLayer);

  const tooltip = document.createElement('div');
  tooltip.style.cssText = [
    'position:fixed', 'pointer-events:none', 'z-index:30',
    'background:rgba(8,12,18,0.94)', 'border:1px solid rgba(255,255,255,0.1)',
    'border-radius:6px', 'padding:7px 10px',
    'color:rgba(255,255,255,0.85)', 'font-size:11px',
    'line-height:1.5', 'white-space:pre',
    'display:none', 'max-width:260px',
    'box-shadow:0 4px 24px rgba(0,0,0,0.6)',
    'backdrop-filter:blur(4px)',
  ].join(';');
  overlay.appendChild(tooltip);

  const arrowDefs = document.createElementNS(svgNS, 'defs');
  const mkMarker = (id: string, color: string): void => {
    const m = document.createElementNS(svgNS, 'marker');
    m.setAttribute('id', id);
    m.setAttribute('markerWidth', '8'); m.setAttribute('markerHeight', '6');
    m.setAttribute('refX', '7'); m.setAttribute('refY', '3');
    m.setAttribute('orient', 'auto');
    const p = document.createElementNS(svgNS, 'polygon');
    p.setAttribute('points', '0 0, 8 3, 0 6'); p.setAttribute('fill', color);
    m.appendChild(p); arrowDefs.appendChild(m);
  };
  mkMarker('rgv-aw', 'rgba(255,255,255,0.25)');
  mkMarker('rgv-ar', 'rgba(255,200,100,0.4)');
  svg.appendChild(arrowDefs);

  let isPanning = false;
  let panStartX = 0, panStartY = 0;
  let tx = 0, ty = 0, scale = 0.7;
  let _isOpen = false;
  let _lastData: FullGraphData | null = null;
  /** Pending (graph, compiled) snapshot from {@link setGraph}, extracted into
   * `_lastData` lazily on open() so per-frame `setGraph` calls stay cheap when
   * the overlay is hidden. */
  let _pendingGraph: { graph: RenderGraph; compiled?: CompiledGraph } | null = null;
  let _totalW = 0, _totalH = 0;
  const _texSz = new Map<number, number>();

  function updateTransform(): void {
    transformLayer.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
  }

  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    isPanning = true;
    panStartX = e.clientX - tx;
    panStartY = e.clientY - ty;
    viewport.style.cursor = 'grabbing';
    viewport.setPointerCapture(e.pointerId);
    e.stopPropagation();
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!isPanning) return;
    tx = e.clientX - panStartX;
    ty = e.clientY - panStartY;
    updateTransform();
    e.stopPropagation();
  });

  viewport.addEventListener('pointerup', (e) => {
    if (e.button !== 0) return;
    isPanning = false;
    viewport.style.cursor = 'grab';
    viewport.releasePointerCapture(e.pointerId);
    e.stopPropagation();
  });

  viewport.addEventListener('pointercancel', () => {
    isPanning = false;
    viewport.style.cursor = 'grab';
  });

  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const ns = Math.min(2, Math.max(0.15, scale * delta));
    const rect = viewport.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    tx = mx - (mx - tx) * (ns / scale);
    ty = my - (my - ty) * (ns / scale);
    scale = ns;
    updateTransform();
    e.stopPropagation();
  }, { passive: false });

  function onKeyDown(e: KeyboardEvent): void {
    if (e.code === 'Escape' && _isOpen) {
      e.stopPropagation();
      close();
    }
  }
  document.addEventListener('keydown', onKeyDown);

  let _keyBlockers: (() => void) | null = null;

  function open(): void {
    callbacks?.onBeforeOpen?.();
    _isOpen = true;
    overlay.style.display = '';
    if (reticle) reticle.style.display = 'none';
    // Build (or rebuild) the DOM from the latest snapshot recorded via setGraph
    // while the overlay was hidden.
    if (_pendingGraph) {
      setFullGraph(_extractFullGraphData(_pendingGraph.graph, _pendingGraph.compiled));
    }
    _frameAll();

    const blocker = (e: KeyboardEvent): void => {
      if ('WASD'.includes(e.code[3] ?? '') || e.code.startsWith('Arrow') || e.code === 'Space' || e.code === 'ShiftLeft') {
        e.stopPropagation();
      }
      if (e.code === 'KeyA') _frameAll();
    };
    document.addEventListener('keydown', blocker, { capture: true });
    document.addEventListener('keyup', blocker, { capture: true });
    _keyBlockers = () => {
      document.removeEventListener('keydown', blocker, { capture: true });
      document.removeEventListener('keyup', blocker, { capture: true });
    };
  }

  function close(): void {
    _isOpen = false;
    overlay.style.display = 'none';
    if (reticle) reticle.style.display = '';
    _keyBlockers?.();
    _keyBlockers = null;
    callbacks?.onAfterClose?.();
  }

  function isOpen(): boolean {
    return _isOpen;
  }

  function setGraph(graph: RenderGraph, compiled?: CompiledGraph): void {
    // Just snapshot the refs. The DOM is rebuilt from this snapshot the next
    // time the overlay is opened — rebuilding every frame while open would
    // throw away node positions the user just dragged.
    _pendingGraph = { graph, compiled };
  }

  function attach(opts: RenderGraphAttachOptions = {}): RenderGraphViz {
    const hotkey = opts.hotkey === undefined ? 'KeyG' : opts.hotkey;
    /*const hintText = opts.hint === undefined
      ? (hotkey ? `${_hotkeyLabel(hotkey)}: toggle render-graph viz` : null)
      : opts.hint;*/

    if (hotkey) {
      window.addEventListener('keydown', (e) => {
        if (e.code !== hotkey || e.repeat) return;
        if (_isOpen) {
          close();
        } else if (_pendingGraph || (_lastData !== null && _lastData.passes.length > 0)) {
          open();
        }
      });
    }
    /*if (hintText) {
      const hintEl = document.createElement('div');
      hintEl.textContent = hintText;
      hintEl.style.cssText = [
        'position:fixed', 'bottom:40px', 'left:50%', 'transform:translateX(-50%)',
        'padding:4px 10px', 'border-radius:4px', 'background:rgba(0,0,0,0.45)', 'color:#888',
        'font-family:ui-monospace,monospace', 'font-size:11px', 'pointer-events:none',
        'z-index:70',
      ].join(';');
      (opts.hintParent ?? document.body).appendChild(hintEl);
    }*/
    return viz;
  }

  function _clear(): void {
    nodesLayer.innerHTML = '';
    while (svg.childNodes.length > 1) svg.removeChild(svg.lastChild!);
  }

  function _makeDraggable(el: HTMLElement): void {
    let startX = 0, startY = 0;
    let origLeft = 0, origTop = 0;

    el.style.cursor = 'move';
    el.style.touchAction = 'none';

    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      startX = e.clientX;
      startY = e.clientY;
      origLeft = parseInt(el.style.left) || 0;
      origTop = parseInt(el.style.top) || 0;
      el.setPointerCapture(e.pointerId);
      el.style.opacity = '0.7';
    });

    el.addEventListener('pointermove', (e) => {
      if (!el.hasPointerCapture(e.pointerId)) return;
      el.style.left = (origLeft + (e.clientX - startX) / scale) + 'px';
      el.style.top = (origTop + (e.clientY - startY) / scale) + 'px';
      _redrawEdges();
    });

    el.addEventListener('pointerup', (e) => {
      if (e.button !== 0) return;
      el.releasePointerCapture(e.pointerId);
      el.style.opacity = '1';
      _redrawEdges();
    });

    el.addEventListener('pointercancel', () => {
      el.style.opacity = '1';
      _redrawEdges();
    });
  }

  function _redrawEdges(): void {
    while (svg.childNodes.length > 1) svg.removeChild(svg.lastChild!);
    if (!_lastData) return;

    for (const e of _lastData.edges) {
      if (e.fromType === 'pass' && e.toType === 'texture') {
        const from = nodesLayer.querySelector(`[data-pass-id="${e.fromId}"]`) as HTMLElement;
        const to = nodesLayer.querySelector(`[data-tex-id="${e.toId}"]`) as HTMLElement;
        if (!from || !to) continue;
        const sz = _texSz.get(e.toId) ?? TEX_R;
        const x1 = parseInt(from.style.left) + NODE_W;
        const y1 = parseInt(from.style.top) + NODE_H / 2;
        const x2 = parseInt(to.style.left) + sz;
        const y2 = parseInt(to.style.top) + sz;
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', String(x1)); line.setAttribute('y1', String(y1));
        line.setAttribute('x2', String(x2)); line.setAttribute('y2', String(y2));
        line.setAttribute('stroke', 'rgba(255,255,255,0.2)');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('marker-end', 'url(#rgv-aw)');
        svg.appendChild(line);
      } else if (e.fromType === 'texture' && e.toType === 'pass') {
        const from = nodesLayer.querySelector(`[data-tex-id="${e.fromId}"]`) as HTMLElement;
        const to = nodesLayer.querySelector(`[data-pass-id="${e.toId}"]`) as HTMLElement;
        if (!from || !to) continue;
        const sz = _texSz.get(e.fromId) ?? TEX_R;
        const x1 = parseInt(from.style.left) + sz;
        const y1 = parseInt(from.style.top) + sz;
        const x2 = parseInt(to.style.left);
        const y2 = parseInt(to.style.top) + NODE_H / 2;
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', String(x1)); line.setAttribute('y1', String(y1));
        line.setAttribute('x2', String(x2)); line.setAttribute('y2', String(y2));
        line.setAttribute('stroke', 'rgba(255,200,100,0.25)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '4,3');
        line.setAttribute('marker-end', 'url(#rgv-ar)');
        svg.appendChild(line);
      }
    }
  }

  function _fmtColor(fmt: string): string {
    const f = fmt.toLowerCase();
    if (f.includes('depth')) return '#b07dd8';
    if (f.includes('16float') || f.includes('32float')) return '#5cb3e0';
    if (f.includes('unorm') || f.includes('srgb')) return '#6bb86b';
    if (f.includes('uint') || f.includes('sint')) return '#d4a55a';
    return '#888';
  }

  function _texTypeLabel(fmt: string): string {
    const f = fmt.toLowerCase();
    if (f.includes('depth')) return 'Depth';
    if (f.includes('16float') || f.includes('32float')) return 'Float / HDR';
    if (f.includes('unorm') || f.includes('srgb')) return 'Color';
    if (f.includes('uint') || f.includes('sint')) return 'Integer';
    return 'Other';
  }

  function _fmtSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function _buildLabel(data: FullGraphData): void {
    _texSz.clear();

    const N = data.passes.length;
    const M = data.textures.length;

    // Build adjacency: which passes produce/consume each texture
    const texProducers = new Map<number, number[]>();
    const texConsumers = new Map<number, number[]>();
    const passReads = new Map<number, number[]>();
    const passWrites = new Map<number, number[]>();

    for (const e of data.edges) {
      if (e.fromType === 'pass') {
        if (!texProducers.has(e.toId)) texProducers.set(e.toId, []);
        texProducers.get(e.toId)!.push(e.fromId);
        if (!passWrites.has(e.fromId)) passWrites.set(e.fromId, []);
        passWrites.get(e.fromId)!.push(e.toId);
      } else {
        if (!passReads.has(e.toId)) passReads.set(e.toId, []);
        passReads.get(e.toId)!.push(e.fromId);
        if (!texConsumers.has(e.fromId)) texConsumers.set(e.fromId, []);
        texConsumers.get(e.fromId)!.push(e.toId);
      }
    }

    // Lookup maps for tooltip content
    const passName = new Map<number, string>();
    data.passes.forEach(p => passName.set(p.id, p.name));
    const texLabel = new Map<number, string>();
    data.textures.forEach(t => texLabel.set(t.id, t.label));
    const texFmt = new Map<number, string>();
    data.textures.forEach(t => texFmt.set(t.id, t.format ?? ''));

    // Hover highlight helpers
    function _highlight(
      hoverPassId: number | null,
      hoverTexId: number | null,
    ): void {
      const passIds = new Set<number>();
      const texIds = new Set<number>();
      const inputPassIds = new Set<number>();
      const outputPassIds = new Set<number>();

      if (hoverPassId !== null) {
        passIds.add(hoverPassId);
        for (const tid of (passReads.get(hoverPassId) ?? [])) {
          texIds.add(tid);
          for (const pid of (texProducers.get(tid) ?? [])) {
            passIds.add(pid); inputPassIds.add(pid);
          }
        }
        for (const tid of (passWrites.get(hoverPassId) ?? [])) {
          texIds.add(tid);
          for (const cid of (texConsumers.get(tid) ?? [])) {
            passIds.add(cid); outputPassIds.add(cid);
          }
        }
      }
      if (hoverTexId !== null) {
        texIds.add(hoverTexId);
        for (const pid of (texProducers.get(hoverTexId) ?? [])) {
          passIds.add(pid); inputPassIds.add(pid);
        }
        for (const cid of (texConsumers.get(hoverTexId) ?? [])) {
          passIds.add(cid); outputPassIds.add(cid);
        }
      }

      for (const el of nodesLayer.querySelectorAll<HTMLElement>('[data-pass-id]')) {
        const id = parseInt(el.getAttribute('data-pass-id')!);
        if (id === hoverPassId) {
          el.style.opacity = '1';
          el.style.removeProperty('border-color');
          el.style.removeProperty('box-shadow');
        } else if (inputPassIds.has(id)) {
          el.style.opacity = '1';
          el.style.borderColor = 'rgba(100,200,255,0.8)';
          el.style.boxShadow = '0 0 20px rgba(100,200,255,0.5)';
        } else if (outputPassIds.has(id)) {
          el.style.opacity = '1';
          el.style.borderColor = 'rgba(255,200,80,0.8)';
          el.style.boxShadow = '0 0 20px rgba(255,200,80,0.5)';
        } else if (passIds.size > 0) {
          el.style.opacity = '0.4';
        }
      }

      for (const el of nodesLayer.querySelectorAll<HTMLElement>('[data-tex-id]')) {
        const id = parseInt(el.getAttribute('data-tex-id')!);
        el.style.opacity = texIds.has(id) ? '1' : (texIds.size > 0 ? '0.4' : '');
      }
    }

    function _clearHighlight(): void {
      for (const el of nodesLayer.querySelectorAll<HTMLElement>('[data-pass-id]')) {
        el.style.opacity = '';
        el.style.removeProperty('border-color');
        el.style.removeProperty('box-shadow');
      }
      for (const el of nodesLayer.querySelectorAll<HTMLElement>('[data-tex-id]')) {
        el.style.opacity = '';
      }
    }

    // Compute topological level (longest path from root) for each pass
    const passLevel = new Map<number, number>();
    const memo = new Map<number, number>();
    const visiting = new Set<number>();
    function getLevel(id: number): number {
      const m = memo.get(id);
      if (m !== undefined) return m;
      if (visiting.has(id)) return 0;
      visiting.add(id);
      const reads = passReads.get(id) ?? [];
      let maxL = -1;
      for (const texId of reads) {
        for (const pid of (texProducers.get(texId) ?? [])) {
          maxL = Math.max(maxL, getLevel(pid));
        }
      }
      visiting.delete(id);
      const level = maxL + 1;
      memo.set(id, level);
      return level;
    }
    for (const p of data.passes) passLevel.set(p.id, getLevel(p.id));

    // Group passes by level
    const levelPasses = new Map<number, number[]>();
    for (const p of data.passes) {
      const l = passLevel.get(p.id)!;
      if (!levelPasses.has(l)) levelPasses.set(l, []);
      levelPasses.get(l)!.push(p.id);
    }
    const sortedLevels = [...levelPasses.keys()].sort((a, b) => a - b);

    // Layout constants
    const LEVEL_GAP_X = 300;
    const passIndex = new Map<number, number>();
    data.passes.forEach((p, i) => passIndex.set(p.id, i));

    // Compute pass positions (columns by level)
    const passPos = new Map<number, { x: number; y: number }>();
    for (const l of sortedLevels) {
      const ids = levelPasses.get(l)!;
      // Stable sort: within a level, keep original pass order
      ids.sort((a, b) => (passIndex.get(a) ?? 0) - (passIndex.get(b) ?? 0));
      ids.forEach((id, idx) => {
        passPos.set(id, {
          x: L_PAD + l * LEVEL_GAP_X,
          y: TITLE_H + idx * (NODE_H + GAP_Y),
        });
      });
    }

    // Compute texture sizes
    for (const t of data.textures) {
      _texSz.set(t.id, t.isBackbuffer ? TEX_R + 4 : TEX_R);
    }

    // Compute texture positions — align vertically with producer for clear flow
    const texPos = new Map<number, { x: number; y: number }>();
    const prodStack = new Map<number, number>();
    for (const t of data.textures) {
      const producers = texProducers.get(t.id) ?? [];
      const consumers = texConsumers.get(t.id) ?? [];

      const sz = _texSz.get(t.id)!;

      // X: place in the gap just after the producer level,
      // or before the first consumer if no producer
      let texL: number;
      let anchorId: number | undefined;
      if (producers.length > 0) {
        let maxProdL = -1;
        for (const pid of producers) {
          const l = passLevel.get(pid)!;
          if (l > maxProdL) { maxProdL = l; anchorId = pid; }
        }
        texL = maxProdL;
      } else {
        let minConsL = Infinity;
        for (const cid of consumers) {
          const l = passLevel.get(cid)!;
          if (l < minConsL) { minConsL = l; anchorId = cid; }
        }
        texL = minConsL < Infinity ? Math.max(0, minConsL - 1) : 0;
      }
      const x = L_PAD + texL * LEVEL_GAP_X + NODE_W + (LEVEL_GAP_X - NODE_W) / 2;

      // Y: align with the anchor pass center so write edges are nearly horizontal
      let y: number;
      const anchor = anchorId !== undefined ? passPos.get(anchorId) : undefined;
      if (anchor) {
        y = anchor.y + NODE_H / 2 - sz;
      } else {
        y = TITLE_H - NODE_H - GAP_Y;
      }

      // Stack textures produced by the same pass
      const stackKey = producers.length > 0 ? (passIndex.get(producers[0]) ?? -1) : -1;
      const count = stackKey >= 0 ? (prodStack.get(stackKey) ?? 0) : 0;
      if (stackKey >= 0) prodStack.set(stackKey, count + 1);
      y += count * (sz * 2 + 4);

      texPos.set(t.id, { x, y });
    }

    // Compute canvas dimensions
    let maxPX = 0, maxPY = 0;
    for (const { x, y } of passPos.values()) {
      maxPX = Math.max(maxPX, x + NODE_W);
      maxPY = Math.max(maxPY, y + NODE_H);
    }
    for (const t of data.textures) {
      const p = texPos.get(t.id)!;
      const sz = _texSz.get(t.id)!;
      maxPX = Math.max(maxPX, p.x + sz);
      maxPY = Math.max(maxPY, p.y + sz * 2);
    }
    const totalH = maxPY + GAP_Y * 2;
    const totalW = Math.max(maxPX + R_PAD, COL_W);

    svg.setAttribute('width', String(totalW));
    svg.setAttribute('height', String(totalH));

    // Tooltip helpers
    function posTip(e: MouseEvent): void {
      const vp = viewport.getBoundingClientRect();
      let x = e.clientX + 14;
      let y = e.clientY + 10;
      const tr = tooltip.getBoundingClientRect();
      if (x + tr.width > vp.right - 4) x = Math.max(4, e.clientX - tr.width - 14);
      if (y + tr.height > vp.bottom - 4) y = Math.max(4, vp.bottom - tr.height - 4);
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }
    function showTip(e: MouseEvent, lines: string[]): void {
      tooltip.textContent = lines.join('\n');
      tooltip.style.display = '';
      posTip(e);
    }
    function hideTip(): void {
      tooltip.style.display = 'none';
    }

    // Render passes
    for (let i = 0; i < N; i++) {
      const p = data.passes[i];
      const pos = passPos.get(p.id)!;
      const enabled = p.enabled;
      const bc = !enabled
        ? 'rgba(255,80,80,0.5)'
        : p.type === 'compute' ? 'rgba(100,150,255,0.6)'
        : p.type === 'transfer' ? 'rgba(255,200,100,0.6)'
        : 'rgba(100,220,100,0.6)';
      const bg = enabled ? 'rgba(10,25,30,0.88)' : 'rgba(35,15,15,0.88)';
      const tc = enabled ? 'rgba(220,240,255,0.95)' : 'rgba(200,120,120,0.6)';
      const el = document.createElement('div');
      el.style.cssText = [
        'position:absolute', `left:${pos.x}px`, `top:${pos.y}px`,
        `width:${NODE_W}px`, `height:${NODE_H}px`,
        `background:${bg}`, `border:1.5px solid ${bc}`,
        'border-radius:8px',
        'display:flex', 'align-items:center', 'justify-content:center',
        'box-shadow:0 2px 16px rgba(0,0,0,0.5)',
        'user-select:none',
        'transition:opacity 0.15s,border-color 0.15s,box-shadow 0.15s',
      ].join(';');
      el.setAttribute('data-pass-id', String(p.id));

      const inner = document.createElement('div');
      inner.style.cssText = 'display:flex;align-items:center;gap:6px;max-width:100%';
      if (p.type) {
        const badge = document.createElement('span');
        const bc2 = p.type === 'compute' ? '#66f' : p.type === 'transfer' ? '#fa0' : '#4c4';
        badge.textContent = p.type === 'compute' ? 'C' : p.type === 'transfer' ? 'T' : 'R';
        badge.style.cssText = `color:${bc2};font-size:10px;font-weight:700;opacity:0.8;flex-shrink:0`;
        inner.appendChild(badge);
      }
      const label = document.createElement('span');
      label.textContent = p.name;
      label.style.cssText = `color:${tc};font-size:11px;font-weight:500;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:0.03em`;
      inner.appendChild(label);
      el.appendChild(inner);

      const dot = document.createElement('span');
      dot.style.cssText = `position:absolute;top:6px;right:6px;width:6px;height:6px;border-radius:50%;background:${enabled ? 'rgb(100,220,100)' : 'rgb(255,80,80)'};opacity:0.8`;
      el.appendChild(dot);
      el.addEventListener('mouseenter', (e) => {
        _highlight(p.id, null);
        const lines: string[] = [p.name, `Type: ${p.type ?? 'render'}`];
        const reads = passReads.get(p.id);
        const writes = passWrites.get(p.id);
        if (reads && reads.length > 0) {
          lines.push('', 'Inputs:');
          for (const tid of reads) lines.push(`  ${texLabel.get(tid) ?? `#${tid}`}`);
        }
        if (writes && writes.length > 0) {
          lines.push('', 'Outputs:');
          for (const tid of writes) lines.push(`  ${texLabel.get(tid) ?? `#${tid}`}`);
        }
        showTip(e, lines);
      });
      el.addEventListener('mousemove', (e) => { if (tooltip.style.display !== 'none') posTip(e); });
      el.addEventListener('mouseleave', () => { hideTip(); _clearHighlight(); });
      nodesLayer.appendChild(el);
      _makeDraggable(el);
    }

    // Render resource nodes (circle for texture, square for buffer)
    for (let i = 0; i < M; i++) {
      const t = data.textures[i];
      const pos = texPos.get(t.id)!;
      const sz = _texSz.get(t.id)!;
      const isBB = t.isBackbuffer;
      const isBuf = t.kind === 'buffer';
      const fill = isBuf ? '#557' : (t.format ? _fmtColor(t.format) : '#666');
      const border = isBB ? '#ffd700' : 'rgba(255,255,255,0.3)';
      const borderW = isBB ? 3 : 1.5;

      const container = document.createElement('div');
      container.style.cssText = `position:absolute;left:${pos.x - sz}px;top:${pos.y}px`;
      container.setAttribute('data-tex-id', String(t.id));

      const shape = document.createElement('div');
      const radius = isBuf ? '4px' : '50%';
      shape.style.cssText = [
        `width:${sz * 2}px`, `height:${sz * 2}px`,
        `border-radius:${radius}`,
        `background:${fill}`,
        `border:${borderW}px solid ${border}`,
        'box-shadow:0 2px 12px rgba(0,0,0,0.5)',
        'display:flex', 'align-items:center', 'justify-content:center',
        'user-select:none',
        'transition:border-color 0.2s,box-shadow 0.2s,opacity 0.15s',
        isBB ? 'box-shadow:0 0 16px rgba(255,215,0,0.35),inset 0 0 8px rgba(255,215,0,0.08)' : '',
      ].join(';');

      shape.addEventListener('mouseenter', () => {
        shape.style.borderColor = isBB ? '#ffd700' : 'rgba(255,255,255,0.7)';
        shape.style.boxShadow = isBB ? '0 0 24px rgba(255,215,0,0.5)' : '0 2px 20px rgba(0,0,0,0.7)';
      });
      shape.addEventListener('mouseleave', () => {
        shape.style.borderColor = border;
        shape.style.boxShadow = isBB ? '0 0 16px rgba(255,215,0,0.35),inset 0 0 8px rgba(255,215,0,0.08)' : '0 2px 12px rgba(0,0,0,0.5)';
      });

      const tip = document.createElement('span');
      tip.textContent = t.label.length > 18 ? t.label.slice(0, 16) + '\u2026' : t.label;
      tip.style.cssText = `color:rgba(255,255,255,0.85);font-size:8px;font-weight:600;text-align:center;line-height:1.2;padding:2px;overflow:hidden`;
      shape.appendChild(tip);
      container.appendChild(shape);

      const labelUnder = document.createElement('div');
      labelUnder.textContent = t.label;
      labelUnder.style.cssText = [
        'position:absolute', `left:${sz - 60}px`, `top:${sz * 2 + 2}px`,
        'width:120px',
        'color:rgba(255,255,255,0.5)', 'font-size:9px',
        'text-align:center', 'overflow:hidden',
        'text-overflow:ellipsis', 'white-space:nowrap',
        'pointer-events:none',
      ].join(';');
      container.appendChild(labelUnder);

      container.addEventListener('mouseenter', (e) => {
        _highlight(null, t.id);
        const isBuf2 = t.kind === 'buffer';
        const lines: string[] = [t.label];
        if (isBuf2) {
          lines.push('Buffer', `Size: ${t.size != null ? _fmtSize(t.size) : 'N/A'}`);
        } else {
          lines.push(`Format: ${t.format ?? 'N/A'}`);
          if (t.format) lines.push(`Type: ${_texTypeLabel(t.format)}`);
          if (t.width != null && t.height != null) {
            lines.push(`Resolution: ${t.width}x${t.height}`);
          }
        }
        if (t.isBackbuffer) lines.push('Backbuffer');
        const prods = texProducers.get(t.id);
        const cons = texConsumers.get(t.id);
        if (prods && prods.length > 0) {
          lines.push('', 'Written by:');
          for (const pid of prods) lines.push(`  ${passName.get(pid) ?? `#${pid}`}`);
        }
        if (cons && cons.length > 0) {
          lines.push('', 'Read by:');
          for (const cid of cons) lines.push(`  ${passName.get(cid) ?? `#${cid}`}`);
        }
        showTip(e, lines);
      });
      container.addEventListener('mousemove', (e) => { if (tooltip.style.display !== 'none') posTip(e); });
      container.addEventListener('mouseleave', () => { hideTip(); _clearHighlight(); });
      nodesLayer.appendChild(container);
      _makeDraggable(container);
    }

    _redrawEdges();

    _totalW = totalW;
    _totalH = totalH;
    _frameAll();
  }

  function _frameAll(): void {
    if (_totalW === 0 || _totalH === 0) return;
    tx = Math.max(0, (viewport.clientWidth - _totalW) / 2);
    ty = 20;
    scale = Math.min(1.2, Math.max(0.3,
      (viewport.clientHeight - 30) / _totalH,
      (viewport.clientWidth - 20) / _totalW,
    ));
    updateTransform();
  }

  function setPasses(passList: PassNodeData[]): void {
    _lastData = null;
    _clear();
    if (passList.length === 0) return;

    const totalH = passList.length * (NODE_H + GAP_Y) + TITLE_H;
    const totalW = NODE_W + 80;

    svg.setAttribute('width', String(totalW));
    svg.setAttribute('height', String(totalH));

    for (let i = 0; i < passList.length; i++) {
      const p = passList[i];
      const y = TITLE_H + i * (NODE_H + GAP_Y);
      const el = document.createElement('div');
      const enabled = p.enabled;
      const bc = !enabled
        ? 'rgba(255,80,80,0.5)'
        : p.type === 'compute' ? 'rgba(100,150,255,0.6)'
        : p.type === 'transfer' ? 'rgba(255,200,100,0.6)'
        : 'rgba(100,220,100,0.6)';
      const bg = enabled ? 'rgba(10,25,30,0.88)' : 'rgba(35,15,15,0.88)';
      const tc = enabled ? 'rgba(220,240,255,0.95)' : 'rgba(200,120,120,0.6)';
      el.style.cssText = [
        'position:absolute', `left:${PASS_X}px`, `top:${y}px`,
        `width:${NODE_W}px`, `height:${NODE_H}px`,
        `background:${bg}`, `border:1.5px solid ${bc}`,
        'border-radius:8px',
        'display:flex', 'align-items:center', 'justify-content:center',
        'box-shadow:0 2px 16px rgba(0,0,0,0.5)',
        'user-select:none',
        'transition:opacity 0.15s,border-color 0.15s,box-shadow 0.15s',
      ].join(';');
      el.setAttribute('data-pass-id', String(p.id));

      const inner = document.createElement('div');
      inner.style.cssText = 'display:flex;align-items:center;gap:6px;max-width:100%';
      if (p.type) {
        const badge = document.createElement('span');
        const bc2 = p.type === 'compute' ? '#88f' : p.type === 'transfer' ? '#fa0' : '#4c4';
        badge.textContent = p.type === 'compute' ? 'C' : p.type === 'transfer' ? 'T' : 'R';
        badge.style.cssText = `color:${bc2};font-size:10px;font-weight:700;opacity:0.8;flex-shrink:0`;
        inner.appendChild(badge);
      }
      const label = document.createElement('span');
      label.textContent = p.name;
      label.style.cssText = `color:${tc};font-size:11px;font-weight:500;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:0.03em`;
      inner.appendChild(label);
      el.appendChild(inner);

      const dot = document.createElement('span');
      dot.style.cssText = `position:absolute;top:6px;right:6px;width:6px;height:6px;border-radius:50%;background:${enabled ? 'rgb(100,220,100)' : 'rgb(255,80,80)'};opacity:0.8`;
      el.appendChild(dot);
      nodesLayer.appendChild(el);
      _makeDraggable(el);
    }

    for (let i = 0; i < passList.length - 1; i++) {
      const y0 = TITLE_H + i * (NODE_H + GAP_Y) + NODE_H;
      const y1 = TITLE_H + (i + 1) * (NODE_H + GAP_Y);
      const cx = PASS_X + NODE_W / 2;
      const edge = document.createElementNS(svgNS, 'line');
      edge.setAttribute('x1', String(cx)); edge.setAttribute('y1', String(y0));
      edge.setAttribute('x2', String(cx)); edge.setAttribute('y2', String(y1));
      edge.setAttribute('stroke', 'rgba(255,255,255,0.15)');
      edge.setAttribute('stroke-width', '1.5');
      edge.setAttribute('marker-end', 'url(#rgv-aw)');
      svg.appendChild(edge);
    }

    _totalW = totalW;
    _totalH = totalH;
    _frameAll();
  }

  function setFullGraph(data: FullGraphData): void {
    _lastData = data;
    _clear();
    _buildLabel(data);
  }

  const viz: RenderGraphViz = { overlay, open, close, isOpen, setGraph, setPasses, setFullGraph, attach };
  return viz;
}

/*function _hotkeyLabel(code: string): string {
  // Strip the `Key` / `Digit` / `Arrow` prefix common to KeyboardEvent.code values.
  return code.replace(/^Key|^Digit|^Arrow/, '');
}*/

/**
 * Walk `graph.passList` and (optionally) `compiled.passes` to produce the
 * pass/texture/edge data the viz renders. Pulled out of the per-frame loop
 * in every sample — see {@link RenderGraphViz.setGraph}.
 */
function _extractFullGraphData(graph: RenderGraph, compiled?: CompiledGraph): FullGraphData {
  const compiledNames = compiled
    ? new Set(compiled.passes.map((cp) => cp.node.name))
    : null;
  const passes: PassNodeData[] = graph.passList.map((p, i) => ({
    id: i,
    name: p.name,
    enabled: compiledNames === null ? true : compiledNames.has(p.name),
    type: p.type,
  }));
  const texMap = new Map<number, TextureNodeData>();
  const edges: GraphEdge[] = [];
  const addNode = (id: number): void => {
    if (texMap.has(id)) return;
    const info = graph.getResourceInfo(id);
    texMap.set(id, {
      id,
      label: info?.label ?? `id:${id}`,
      isBackbuffer: info?.isBackbuffer ?? false,
      format: info?.format,
      kind: info?.kind,
      width: info?.kind === 'texture' ? info?.width : undefined,
      height: info?.kind === 'texture' ? info?.height : undefined,
      size: info?.kind === 'buffer' ? info?.size : undefined,
    });
  };
  graph.passList.forEach((p, i) => {
    for (const r of p.reads) {
      edges.push({ fromType: 'texture', fromId: r.id, toType: 'pass', toId: i });
      addNode(r.id);
    }
    for (const w of p.writes) {
      edges.push({ fromType: 'pass', fromId: i, toType: 'texture', toId: w.id });
      addNode(w.id);
    }
  });
  return { passes, textures: [...texMap.values()], edges };
}
