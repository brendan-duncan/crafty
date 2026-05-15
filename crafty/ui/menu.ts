export interface Menu {
  overlay: HTMLDivElement;
  card: HTMLDivElement;
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
  setSuppressAutoOpen: (v: boolean) => void;
}

export function createMenu(canvas: HTMLCanvasElement, reticle: HTMLDivElement): Menu {
  const menuOverlay = document.createElement('div');
  menuOverlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:100',
    'background:rgba(0,0,0,0.78)',
    'display:none', 'align-items:center', 'justify-content:center',
    'font-family:ui-monospace,monospace',
  ].join(';');
  document.body.appendChild(menuOverlay);

  const menuCard = document.createElement('div');
  menuCard.style.cssText = [
    'display:flex', 
    'flex-direction:column', 
    'align-items:center',
    'padding:clamp(20px,5vh,48px) clamp(16px,5vw,56px)',
    'background:rgba(255,255,255,0.74)',
    'border:1px solid rgba(255,255,255,0.12)',
    'border-radius:12px',
    'width:min(860px,calc(100vw - 24px))',
    'box-sizing:border-box',
    'max-height:min(700px,calc(100vh - 24px))',
    'overflow-y:auto',
    'padding:0px;'
  ].join(';');
  menuOverlay.appendChild(menuCard);

  const menuTitle = document.createElement('h1');
  menuTitle.textContent = 'CRAFTY';
  menuTitle.style.cssText = [
    'margin:0', 'font-size:clamp(28px,7vw,52px)', 'font-weight:900',
    'color:#fff', 'letter-spacing:0.12em',
    'text-shadow:0 0 48px rgba(100,200,255,0.45)',
    'font-family:ui-monospace,monospace',
  ].join(';');
  menuCard.appendChild(menuTitle);

  const resumeBtn = document.createElement('button');
  resumeBtn.textContent = 'Back to Game (ESC)';
  resumeBtn.style.cssText = [
    'padding:10px 40px', 'font-size:15px', 'font-family:ui-monospace,monospace',
    'background:#1a3a1a', 'color:#5f5',
    'border:1px solid #5f5', 'border-radius:6px',
    'cursor:pointer', 'letter-spacing:0.06em',
    'transition:background 0.15s',
    'margin-top:12px',
  ].join(';');
  resumeBtn.addEventListener('mouseenter', () => { resumeBtn.style.background = '#243e24'; });
  resumeBtn.addEventListener('mouseleave', () => { resumeBtn.style.background = '#1a3a1a'; });
  // Close the menu on activation. Pointer-lock acquisition is best-effort:
  // on desktop it locks (and `pointerlockchange` would also have closed us),
  // on touch it silently fails — but the menu still closes.
  const onPlay = (): void => {
    close();
    try { void canvas.requestPointerLock(); } catch { /* unsupported / touch */ }
  };
  resumeBtn.addEventListener('click', onPlay);
  // Some touch browsers can delay or skip the synthetic click on a button —
  // also fire on touchend for reliability.
  resumeBtn.addEventListener('touchend', (e) => { e.preventDefault(); onPlay(); }, { passive: false });
  menuCard.appendChild(resumeBtn);

  let menuOpenedAt = 0;
  let _suppressAutoOpen = false;

  function setSuppressAutoOpen(v: boolean): void {
    _suppressAutoOpen = v;
  }

  function open(): void {
    menuOpenedAt = performance.now();
    menuOverlay.style.display = 'flex';
    reticle.style.display = 'none';
  }

  function close(): void {
    menuOverlay.style.display = 'none';
    reticle.style.display = '';
  }

  function isOpen(): boolean {
    return menuOverlay.style.display !== 'none';
  }

  // Pointer lock change handler
  document.addEventListener('pointerlockchange', () => {
    if (_suppressAutoOpen) return;
    if (document.pointerLockElement === canvas) {
      close();
    } else {
      open();
    }
  });

  // ESC key handler with debounce
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && isOpen()) {
      if (performance.now() - menuOpenedAt < 200) {
        return;
      }
      close();
      canvas.requestPointerLock();
    }
  });

  return { overlay: menuOverlay, card: menuCard, open, close, isOpen, setSuppressAutoOpen };
}
