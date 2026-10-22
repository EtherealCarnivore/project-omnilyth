// Device-local history of sent and received links (localStorage, per browser).
// Entries carry the full link including the key fragment, so this list is as
// sensitive as the links themselves — it never leaves the device.

import { fmtBytes, fmtCountdown } from '/crypto.js';

const KEY = 'drop_recent_v1';
const MAX = 50;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function save(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch {}
}

export function addRecent(entry) {
  const all = load();
  const existing = all.find((e) => e.id === entry.id);
  const list = all.filter((e) => e.id !== entry.id);
  // Opening your own link on the same device keeps it labelled "Sent".
  list.unshift({ ...entry, kind: existing ? existing.kind : entry.kind, addedAt: Date.now() });
  save(list);
}

export function getRecent() {
  const now = Date.now();
  const list = load().filter((e) => e.expiresAt > now);
  save(list);
  return list;
}

export function removeRecent(id) {
  save(load().filter((e) => e.id !== id));
}

// Renders into `container`; re-renders countdowns every second until stopRecent().
let timer = null;
export function renderRecent(container, { toast } = {}) {
  stopRecent();
  const draw = () => {
    const list = getRecent();
    container.innerHTML = '';
    if (!list.length) {
      container.innerHTML = '<div class="card"><p>Nothing active. Links disappear here when they expire.</p></div>';
      stopRecent();
      return;
    }
    for (const e of list) {
      const left = e.expiresAt - Date.now();
      const item = document.createElement('div');
      item.className = 'card recent-item';
      item.innerHTML = `
        <div class="recent-top">
          <span class="badge ${e.kind}">${e.kind === 'sent' ? 'Sent' : 'Received'}</span>
          <span class="recent-cd ${left < 60_000 ? 'warn' : ''}">${fmtCountdown(left)}</span>
        </div>
        <div class="file-name"></div>
        <p class="muted"></p>
        <div class="row recent-actions">
          <button type="button" data-act="copy">Copy link</button>
          <button type="button" data-act="open">Open</button>
        </div>`;
      item.querySelector('.file-name').textContent = e.name;
      item.querySelector('.muted').textContent = fmtBytes(e.size);
      item.querySelector('[data-act="copy"]').addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(e.link); toast?.('Copied'); }
        catch { toast?.('Copy failed'); }
      });
      item.querySelector('[data-act="open"]').addEventListener('click', () => { location.href = e.link; });
      container.appendChild(item);
    }
  };
  draw();
  timer = setInterval(() => {
    // Cheap refresh: only countdown text, unless something expired.
    const list = getRecent();
    const nodes = container.querySelectorAll('.recent-item');
    if (nodes.length !== list.length) return draw();
    nodes.forEach((n, i) => {
      const left = list[i].expiresAt - Date.now();
      const cd = n.querySelector('.recent-cd');
      cd.textContent = fmtCountdown(left);
      cd.classList.toggle('warn', left < 60_000);
    });
  }, 1000);
}

export function stopRecent() {
  clearInterval(timer);
  timer = null;
}
