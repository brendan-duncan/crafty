import hotbarUrl from '../../assets/ui/hotbar.png?url';

export interface Menu {
  overlay: HTMLDivElement;
  card: HTMLDivElement;
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
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
    'display:flex', 'flex-direction:column', 'align-items:center', 'gap:24px',
    'padding:48px 56px',
    'background:rgba(255,255,255,0.24)',
    'border:1px solid rgba(255,255,255,0.12)',
    'border-radius:12px',
    'max-width:860px', 'width:90%',
  ].join(';');
  menuOverlay.appendChild(menuCard);

  const menuTitle = document.createElement('h1');
  menuTitle.textContent = 'CRAFTY';
  menuTitle.style.cssText = [
    'margin:0', 'font-size:52px', 'font-weight:900',
    'color:#fff', 'letter-spacing:0.12em',
    'text-shadow:0 0 48px rgba(100,200,255,0.45)',
    'font-family:ui-monospace,monospace',
  ].join(';');
  menuCard.appendChild(menuTitle);

  const resumeBtn = document.createElement('button');
  resumeBtn.textContent = 'Back to Game';
  resumeBtn.style.cssText = [
    'padding:10px 40px', 'font-size:15px', 'font-family:ui-monospace,monospace',
    'background:#1a3a1a', 'color:#5f5',
    'border:1px solid #5f5', 'border-radius:6px',
    'cursor:pointer', 'letter-spacing:0.06em',
    'transition:background 0.15s',
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

  const sep = document.createElement('div');
  sep.style.cssText = 'width:100%;height:1px;background:rgba(255,255,255,0.12)';
  menuCard.appendChild(sep);

  let menuOpenedAt = 0;

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

  return { overlay: menuOverlay, card: menuCard, open, close, isOpen };
}
