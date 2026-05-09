import { NetworkClient, type ConnectResult } from '../game/network_client.js';
import { WorldStorage, createSavedWorld, type SavedWorld } from '../game/world_storage.js';
import backgroundUrl from '../../assets/crafty.png?url';

/**
 * The user's choice from the start screen, returned by {@link showStartScreen}.
 *
 * For 'local', the chosen `world` already exists in storage — newly created
 * worlds are written before resolving so they appear in the saved list even
 * if the user immediately quits.
 *
 * For 'network', the WebSocket connection is already open and the welcome
 * payload has been received — main bootstraps the world from these.
 */
export type StartChoice =
  | { mode: 'local'; world: SavedWorld; storage: WorldStorage | null; playerName: string }
  | {
      mode: 'network';
      playerName: string;
      serverUrl: string;
      network: NetworkClient;
      welcome: ConnectResult;
    };

const LS_NAME = 'crafty.playerName';
const LS_SEED = 'crafty.lastSeed';
const LS_URL  = 'crafty.serverUrl';
const DEFAULT_URL = 'ws://localhost:8787';

/**
 * Renders the launcher overlay and resolves once the user picks either a local
 * world (with seed) or a successful network connection. Persists name / seed /
 * server URL to localStorage so the inputs are sticky across sessions.
 *
 * Removes itself from the DOM as soon as the promise resolves.
 */
export async function showStartScreen(): Promise<StartChoice>
{
  // Open IDB up front so the saved-world list can render immediately. If the
  // storage layer fails (private mode, no IDB support) we still let the user
  // create a one-shot world — it just won't persist.
  let storage: WorldStorage | null = null;
  let initialWorlds: SavedWorld[] = [];
  try {
    storage = await WorldStorage.open();
    initialWorlds = await storage.list();
  } catch (err) {
    console.warn('[crafty] world storage unavailable — local worlds will not persist', err);
  }

  return new Promise<StartChoice>((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:200',
      // Layer a dark scrim over the splash image so the card stays readable.
      `background:linear-gradient(rgba(128,128,128,0.35),rgba(128,128,128,0.75)),url(${backgroundUrl}) center/cover no-repeat #000`,
      'display:flex', 'align-items:center', 'justify-content:center',
      'font-family:ui-monospace,monospace',
    ].join(';');
    document.body.appendChild(overlay);

    const card = document.createElement('div');
    card.style.cssText = [
      'display:flex', 'flex-direction:column', 'align-items:stretch', 'gap:18px',
      'padding:36px 44px',
      'background:rgba(82, 82, 82, 1.0)',
      'border:1px solid rgba(255,255,255,0.12)',
      'border-radius:12px',
      'min-width:480px', 'max-width:560px',
      'box-shadow:0 0 55px rgba(255,255,255,0.8)',
    ].join(';');
    overlay.appendChild(card);

    // ── Title ────────────────────────────────────────────────────────────
    const title = document.createElement('h1');
    title.textContent = 'CRAFTY';
    title.style.cssText = [
      'margin:0 0 4px', 'text-align:center',
      'font-size:44px', 'font-weight:900',
      'color:#fff', 'letter-spacing:0.14em',
      'text-shadow:0 0 32px rgba(100,200,255,0.4)',
    ].join(';');
    card.appendChild(title);

    // ── Name field (above the tabs) ──────────────────────────────────────
    const nameRow = _createField('Player name', _input({
      value: localStorage.getItem(LS_NAME) ?? '',
      placeholder: 'Steve',
      maxLength: 16,
    }));
    card.appendChild(nameRow.row);

    // ── Tab strip ────────────────────────────────────────────────────────
    const tabs = document.createElement('div');
    tabs.style.cssText = 'display:flex;gap:0;border-bottom:1px solid rgba(255,255,255,0.12)';
    card.appendChild(tabs);

    const localTab = _tabButton('Local');
    const networkTab = _tabButton('Network');
    tabs.appendChild(localTab);
    tabs.appendChild(networkTab);

    // ── Panels ───────────────────────────────────────────────────────────
    const localPanel = _panel();
    const networkPanel = _panel();
    card.appendChild(localPanel);
    card.appendChild(networkPanel);

    // ── Local panel ──────────────────────────────────────────────────────
    localPanel.appendChild(_sectionLabel('Saved worlds'));

    const savedListContainer = document.createElement('div');
    savedListContainer.style.cssText = [
      'display:flex', 'flex-direction:column', 'gap:6px',
      'max-height:240px', 'overflow-y:auto',
      'padding:8px 4px 12px',
    ].join(';');
    localPanel.appendChild(savedListContainer);

    let savedWorlds: SavedWorld[] = initialWorlds;

    function rebuildSavedList(): void
    {
      savedListContainer.replaceChildren();
      if (savedWorlds.length === 0) {
        const empty = document.createElement('div');
        empty.textContent = storage === null ? 'Storage unavailable in this browser' : 'No saved worlds yet';
        empty.style.cssText = 'color:rgba(255,255,255,0.85);font-size:12px;padding:8px 0';
        savedListContainer.appendChild(empty);
        return;
      }
      for (const w of savedWorlds) {
        savedListContainer.appendChild(_savedWorldRow(w, () => loadSaved(w), () => deleteSaved(w)));
      }
    }
    rebuildSavedList();

    function loadSaved(world: SavedWorld): void
    {
      finish({ mode: 'local', world, storage, playerName: getName() });
    }

    async function deleteSaved(world: SavedWorld): Promise<void>
    {
      if (storage === null) {
        return;
      }
      try {
        await storage.delete(world.id);
        savedWorlds = savedWorlds.filter((w) => w.id !== world.id);
        rebuildSavedList();
      } catch (err) {
        console.error('[crafty] delete failed', err);
      }
    }

    localPanel.appendChild(_sectionLabel('New world'));

    const worldNameField = _input({
      value: '',
      placeholder: `World ${initialWorlds.length + 1}`,
      maxLength: 32,
    });
    localPanel.appendChild(_createField('Name', worldNameField).row);

    const seedField = _input({
      value: localStorage.getItem(LS_SEED) ?? '13',
      placeholder: 'random',
    });
    localPanel.appendChild(_createField('Seed', seedField).row);

    const localStartBtn = _primaryButton('Create');
    const localStatus = document.createElement('div');
    localStatus.style.cssText = 'color:#f88;font-size:12px;min-height:16px;text-align:right';
    localPanel.appendChild(_buttonRow(localStartBtn, localStatus));

    // ── Network panel ────────────────────────────────────────────────────
    networkPanel.appendChild(_sectionLabel('Server'));
    const urlField = _input({
      value: localStorage.getItem(LS_URL) ?? DEFAULT_URL,
      placeholder: DEFAULT_URL,
    });
    networkPanel.appendChild(_createField('URL', urlField).row);

    const worldHint = document.createElement('div');
    worldHint.textContent = 'World selection (coming soon — server hosts a single world)';
    worldHint.style.cssText = 'color:rgba(255,255,255,0.8);font-size:12px;padding:4px 0 8px';
    networkPanel.appendChild(worldHint);

    const netConnectBtn = _primaryButton('Connect');
    const netStatus = document.createElement('div');
    netStatus.style.cssText = 'color:#f88;font-size:12px;min-height:16px;text-align:right';
    networkPanel.appendChild(_buttonRow(netConnectBtn, netStatus));

    // ── Tab switching ────────────────────────────────────────────────────
    function selectTab(which: 'local' | 'network'): void
    {
      const isLocal = which === 'local';
      _setTabActive(localTab, isLocal);
      _setTabActive(networkTab, !isLocal);
      localPanel.style.display = isLocal ? 'flex' : 'none';
      networkPanel.style.display = isLocal ? 'none' : 'flex';
    }
    localTab.addEventListener('click', () => selectTab('local'));
    networkTab.addEventListener('click', () => selectTab('network'));
    selectTab('local');

    // ── Helpers ──────────────────────────────────────────────────────────
    function getName(): string
    {
      const raw = (nameRow.input.value ?? '').trim().slice(0, 16);
      return raw.length > 0 ? raw : `player${Math.floor(Math.random() * 1000)}`;
    }

    function parseSeed(raw: string): number
    {
      const trimmed = raw.trim();
      if (trimmed.length === 0) {
        return Math.floor(Math.random() * 0x7fffffff);
      }
      const n = Number(trimmed);
      if (Number.isFinite(n)) {
        return Math.floor(n);
      }
      // Non-numeric: hash the string so "alpha" → deterministic seed.
      let h = 2166136261 >>> 0;
      for (let i = 0; i < trimmed.length; i++) {
        h = Math.imul(h ^ trimmed.charCodeAt(i), 16777619) >>> 0;
      }
      return h & 0x7fffffff;
    }

    function finish(choice: StartChoice): void
    {
      localStorage.setItem(LS_NAME, getName());
      overlay.remove();
      resolve(choice);
    }

    // ── Local create ─────────────────────────────────────────────────────
    localStartBtn.addEventListener('click', async () => {
      const seed = parseSeed(seedField.value);
      seedField.value = String(seed); // reflect resolved random/hash
      localStorage.setItem(LS_SEED, String(seed));
      const rawName = worldNameField.value.trim();
      const name = rawName.length > 0 ? rawName : `World ${savedWorlds.length + 1}`;

      if (storage === null) {
        // No persistence available — synthesize an in-memory record so the
        // game still plays this session.
        finish({ mode: 'local', world: createSavedWorld(name, seed), storage: null, playerName: getName() });
        return;
      }

      localStartBtn.disabled = true;
      localStatus.style.color = 'rgba(255,255,255,0.92)';
      localStatus.textContent = 'creating…';
      try {
        const world = createSavedWorld(name, seed);
        await storage.save(world);
        finish({ mode: 'local', world, storage, playerName: getName() });
      } catch (err) {
        localStatus.style.color = '#f88';
        localStatus.textContent = `failed: ${(err as Error).message}`;
        localStartBtn.disabled = false;
      }
    });

    // ── Network connect ──────────────────────────────────────────────────
    netConnectBtn.addEventListener('click', async () => {
      const url = urlField.value.trim() || DEFAULT_URL;
      const name = getName();
      netStatus.textContent = '';
      netStatus.style.color = 'rgba(255,255,255,0.92)';
      netStatus.textContent = 'connecting…';
      netConnectBtn.disabled = true;
      const network = new NetworkClient();
      try {
        const welcome = await network.connect(url, name);
        localStorage.setItem(LS_URL, url);
        finish({ mode: 'network', playerName: name, serverUrl: url, network, welcome });
      } catch (err) {
        netStatus.style.color = '#f88';
        netStatus.textContent = `failed: ${(err as Error).message}`;
        netConnectBtn.disabled = false;
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Small DOM helpers (kept local — these aren't worth a shared widget module).
// ─────────────────────────────────────────────────────────────────────────────

function _input(opts: { value?: string; placeholder?: string; maxLength?: number }): HTMLInputElement
{
  const i = document.createElement('input');
  i.type = 'text';
  if (opts.value !== undefined) {
    i.value = opts.value;
  }
  if (opts.placeholder !== undefined) {
    i.placeholder = opts.placeholder;
  }
  if (opts.maxLength !== undefined) {
    i.maxLength = opts.maxLength;
  }
  i.style.cssText = [
    'flex:1', 'padding:8px 10px',
    'background:rgba(0,0,0,0.55)', 'color:#fff',
    'border:1px solid rgba(255,255,255,0.35)', 'border-radius:5px',
    'font:13px ui-monospace,monospace',
    'outline:none',
  ].join(';');
  i.addEventListener('focus', () => { i.style.borderColor = '#5f5'; });
  i.addEventListener('blur',  () => { i.style.borderColor = 'rgba(255,255,255,0.35)'; });
  return i;
}

function _createField(label: string, input: HTMLInputElement): { row: HTMLDivElement; input: HTMLInputElement }
{
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;gap:12px';
  const lbl = document.createElement('label');
  lbl.textContent = label;
  lbl.style.cssText = 'min-width:96px;color:rgba(255,255,255,0.92);font-size:12px;letter-spacing:0.06em';
  row.appendChild(lbl);
  row.appendChild(input);
  return { row, input };
}

function _tabButton(label: string): HTMLButtonElement
{
  const b = document.createElement('button');
  b.textContent = label;
  b.style.cssText = [
    'padding:10px 20px', 'background:transparent', 'color:rgba(255,255,255,0.8)',
    'border:none', 'border-bottom:2px solid transparent',
    'font:13px ui-monospace,monospace', 'letter-spacing:0.08em',
    'cursor:pointer',
  ].join(';');
  return b;
}

function _setTabActive(b: HTMLButtonElement, active: boolean): void
{
  b.style.color = active ? '#9fff9f' : 'rgba(255,255,255,0.8)';
  b.style.borderBottomColor = active ? '#9fff9f' : 'transparent';
}

function _panel(): HTMLDivElement
{
  const p = document.createElement('div');
  p.style.cssText = 'display:flex;flex-direction:column;gap:10px;padding:12px 0';
  return p;
}

function _sectionLabel(text: string): HTMLDivElement
{
  const d = document.createElement('div');
  d.textContent = text;
  d.style.cssText = 'color:#fff;font-size:11px;letter-spacing:0.18em';
  return d;
}

function _primaryButton(label: string): HTMLButtonElement
{
  const b = document.createElement('button');
  b.textContent = label;
  b.style.cssText = [
    'padding:10px 32px',
    'background:#1a3a1a', 'color:#5f5',
    'border:1px solid #5f5', 'border-radius:6px',
    'font:13px ui-monospace,monospace', 'letter-spacing:0.06em',
    'cursor:pointer',
    'transition:background 0.15s',
  ].join(';');
  b.addEventListener('mouseenter', () => { if (!b.disabled) { b.style.background = '#243e24'; } });
  b.addEventListener('mouseleave', () => { b.style.background = '#1a3a1a'; });
  return b;
}

function _buttonRow(...children: HTMLElement[]): HTMLDivElement
{
  const r = document.createElement('div');
  r.style.cssText = 'display:flex;align-items:center;gap:12px;justify-content:flex-end;padding-top:8px';
  for (const c of children) {
    r.appendChild(c);
  }
  return r;
}

/**
 * Renders one row in the saved-worlds list. The whole row is clickable to load,
 * except for the trailing × button which deletes (with a one-click confirm
 * step: × → "Delete?" → removed).
 */
function _savedWorldRow(world: SavedWorld, onLoad: () => void, onDelete: () => void): HTMLDivElement
{
  const row = document.createElement('div');
  row.style.cssText = [
    'display:flex', 'align-items:center', 'gap:10px',
    'padding:6px 8px', 'border-radius:6px',
    'background:rgba(0,0,0,0.35)', 'border:1px solid rgba(255,255,255,0.08)',
    'cursor:pointer',
    'transition:background 0.12s',
  ].join(';');
  row.addEventListener('mouseenter', () => { row.style.background = 'rgba(255,255,255,0.08)'; });
  row.addEventListener('mouseleave', () => { row.style.background = 'rgba(0,0,0,0.35)'; });
  row.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).dataset.role === 'delete') {
      return;
    }
    onLoad();
  });

  // Thumbnail (or muted placeholder if no screenshot yet).
  const thumb = document.createElement('div');
  thumb.style.cssText = [
    'width:64px', 'height:36px', 'flex-shrink:0',
    'border-radius:4px', 'overflow:hidden',
    'background:linear-gradient(135deg,#1f3a4a,#0a1622)',
  ].join(';');
  if (world.screenshot !== undefined) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(world.screenshot);
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
    img.addEventListener('load', () => URL.revokeObjectURL(img.src));
    thumb.appendChild(img);
  }
  row.appendChild(thumb);

  // Name + relative time stack.
  const text = document.createElement('div');
  text.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:2px;min-width:0';
  const name = document.createElement('div');
  name.textContent = world.name;
  name.style.cssText = 'color:#fff;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
  const meta = document.createElement('div');
  meta.textContent = _relativeTime(Date.now() - world.lastPlayedAt);
  meta.style.cssText = 'color:rgba(255,255,255,0.55);font-size:11px';
  text.appendChild(name);
  text.appendChild(meta);
  row.appendChild(text);

  // Delete: × → "Delete?" → confirmed.
  const del = document.createElement('button');
  del.dataset.role = 'delete';
  del.textContent = '×';
  del.title = 'Delete';
  del.style.cssText = [
    'background:transparent', 'color:rgba(255,255,255,0.45)',
    'border:1px solid rgba(255,255,255,0.18)', 'border-radius:4px',
    'padding:2px 8px', 'font:13px ui-monospace,monospace',
    'cursor:pointer',
  ].join(';');
  let armed = false;
  del.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!armed) {
      armed = true;
      del.textContent = 'Delete?';
      del.style.color = '#f88';
      del.style.borderColor = '#f88';
      // Disarm on outside click.
      const disarm = (): void => {
        armed = false;
        del.textContent = '×';
        del.style.color = 'rgba(255,255,255,0.45)';
        del.style.borderColor = 'rgba(255,255,255,0.18)';
        document.removeEventListener('click', disarm, true);
      };
      // Defer registration so this same click doesn't disarm immediately.
      setTimeout(() => document.addEventListener('click', disarm, true), 0);
      return;
    }
    onDelete();
  });
  row.appendChild(del);

  return row;
}

function _relativeTime(deltaMs: number): string
{
  if (deltaMs < 0) {
    return 'just now';
  }
  const s = Math.floor(deltaMs / 1000);
  if (s < 60) {
    return 'just now';
  }
  const m = Math.floor(s / 60);
  if (m < 60) {
    return `${m} minute${m === 1 ? '' : 's'} ago`;
  }
  const h = Math.floor(m / 60);
  if (h < 24) {
    return `${h} hour${h === 1 ? '' : 's'} ago`;
  }
  const d = Math.floor(h / 24);
  if (d < 30) {
    return `${d} day${d === 1 ? '' : 's'} ago`;
  }
  const mo = Math.floor(d / 30);
  return `${mo} month${mo === 1 ? '' : 's'} ago`;
}
