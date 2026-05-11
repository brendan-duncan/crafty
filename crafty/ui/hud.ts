export interface HudElements {
  fps: HTMLDivElement;
  stats: HTMLDivElement;
  biome: HTMLDivElement;
  pos: HTMLDivElement;
  reticle: HTMLDivElement;
}

export function createHud(): HudElements {
  // Reticle (crosshair) — always visible
  const reticle = document.createElement('div');
  reticle.style.cssText = [
    'position:fixed', 'top:50%', 'left:50%',
    'width:16px', 'height:16px',
    'transform:translate(-50%,-50%)',
    'pointer-events:none',
  ].join(';');
  reticle.innerHTML = [
    `<div style="position:absolute;top:50%;left:0;width:100%;height:3px;background:#fff;opacity:0.8;transform:translateY(-50%)"></div>`,
    `<div style="position:absolute;left:50%;top:0;width:3px;height:100%;background:#fff;opacity:0.8;transform:translateX(-50%)"></div>`,
    `<div style="position:absolute;top:50%;left:50%;width:7px;height:3px;background:#fff;opacity:0.9;transform:translate(-50%,-50%);border-radius:50%"></div>`,
  ].join('');
  document.body.appendChild(reticle);

  // Debug overlay (hidden by default, toggled with X key)
  const createDebug = (): HTMLDivElement => {
    const el = document.createElement('div');
    el.style.display = 'none';
    document.body.appendChild(el);
    return el;
  };

  // FPS counter
  const fps = createDebug();
  fps.style.cssText = [
    'position:fixed', 'top:12px', 'right:12px',
    'font-family:ui-monospace,monospace', 'font-size:13px',
    'color:#ff0', 'background:rgba(0,0,0,0.85)',
    'padding:4px 8px', 'border-radius:4px', 'pointer-events:none',
  ].join(';');

  // Stats (draws, tris, chunks)
  const stats = createDebug();
  stats.style.cssText = [
    'position:fixed', 'top:44px', 'right:12px',
    'font-family:ui-monospace,monospace', 'font-size:11px',
    'color:#aaf', 'background:rgba(0,0,0,0.85)',
    'padding:4px 8px', 'border-radius:4px', 'pointer-events:none',
    'white-space:pre',
  ].join(';');

  // Biome display
  const biome = createDebug();
  biome.style.cssText = [
    'position:fixed', 'bottom:12px', 'right:12px',
    'font-family:ui-monospace,monospace', 'font-size:13px',
    'color:#ff0', 'background:rgba(0,0,0,0.85)',
    'padding:4px 8px', 'border-radius:4px', 'pointer-events:none',
  ].join(';');

  // Position display
  const pos = createDebug();
  pos.style.cssText = [
    'position:fixed', 'bottom:44px', 'right:12px',
    'font-family:ui-monospace,monospace', 'font-size:11px',
    'color:#ccf', 'background:rgba(0,0,0,0.85)',
    'padding:4px 8px', 'border-radius:4px', 'pointer-events:none',
  ].join(';');

  return { fps, stats, biome, pos, reticle };
}
