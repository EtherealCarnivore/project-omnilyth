/*
 * Offline fixtures for scrape-threads.js: synthetic poedb pages and a
 * poe.ninja response, rebuilt from the committed src/data/threadData.js so a
 * scrape of them must reproduce that file byte for byte. The markup follows
 * the selectors the parser reads (.newItemPopup / .itemName / .Stats
 * .property|.explicitMod / .default.fst-italic / .card.name-value, and the
 * og:description meta on Random_<Mechanic>_Thread_Modifiers), with extra
 * noise nodes so the parser's cleaning and filtering paths are exercised.
 * Not a capture of live poedb.
 */

import { threads, frayedThread, THREAD_RANDOM_EFFECT_RULE, THREAD_USAGE } from '../../src/data/threadData.js';

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const card = (name, value) =>
  `<div class="card name-value"><div class="name">${esc(name)}<span class="badge">?</span></div>` +
  `<div class="value">\n  ${esc(value)}\n</div></div>`;

function itemPage({ name, stackSize, explicit, statLine, usage, dropLevel, ninjaId, metadata }) {
  return `<!DOCTYPE html><html><head><title>${esc(name)} - PoEDB</title></head><body>
<div class="newItemPopup currencyPopup">
  <div class="itemHeader"><div class="itemName">\n  ${esc(name)} </div></div>
  <div class="Stats">
    <div class="property">Stackable Currency</div>
    <div class="property">Stack Size:   1 / ${stackSize}</div>
  </div>
  <div class="Stats">${explicit ? `<div class="explicitMod">${esc(explicit)}</div>` : `<div>${esc(statLine)}</div>`}</div>
  <div class="Stats"><div class="default fst-italic">${esc(usage)}</div></div>
</div>
<div class="row">
${card('DropLevel', dropLevel)}
${card('Type', metadata)}
${card('Class', 'Stackable Currency')}
${card('Tags', 'currency, default')}
${card('NoteCode', ninjaId)}
${card('DropLevel', 999)}
</div>
</body></html>`;
}

function modsPage(mechanic, effects) {
  // The rule is split over two lines to exercise the join; blank lines are dropped.
  const [first, ...rest] = THREAD_RANDOM_EFFECT_RULE.split(/(?<=\.) /);
  const desc = [first, rest.join(' '), '', `Random ${mechanic} Thread ${'Modifiers which can be applied by Threads:'}`, ...effects.map((e) => `  ${e}`), ''].join('\n');
  return `<!DOCTYPE html><html><head><title>Random ${mechanic} Thread Modifiers - PoEDB</title>
<meta property="og:description" content="${esc(desc)}"></head><body>Modifiers which can be applied by Threads:</body></html>`;
}

/** Map of URL -> HTML for every poedb page the scraper reads. */
export function buildPoedbPages() {
  const pages = new Map();
  for (const t of threads) {
    pages.set(t.source, itemPage({
      name: t.name,
      stackSize: t.stackSize,
      explicit: t.description,
      usage: `${THREAD_USAGE} Shift click to unstack.`,
      dropLevel: t.dropLevel,
      ninjaId: t.ninjaId,
      metadata: `Metadata/Items/Currency/Threads/${t.mechanic}Thread`,
    }));
    pages.set(`https://poedb.tw/us/Random_${t.mechanic}_Thread_Modifiers`, modsPage(t.mechanic, t.randomEffects));
  }
  // Frayed Thread: no explicitMod, so the description comes from the statLines fallback.
  pages.set(frayedThread.source, itemPage({
    name: frayedThread.name,
    stackSize: frayedThread.stackSize,
    statLine: frayedThread.description,
    usage: `${frayedThread.usage} Shift click to unstack.`,
    dropLevel: frayedThread.dropLevel,
    ninjaId: frayedThread.ninjaId,
    metadata: 'Metadata/Items/Currency/Threads/FrayedThread',
  }));
  return pages;
}

/** poe.ninja type=Thread overview body. */
export function buildNinjaJson() {
  return {
    items: threads.map((t) => ({
      id: t.ninjaId,
      name: t.name,
      image: t.icon.replace('https://web.poecdn.com', ''),
      category: 'Thread',
    })),
  };
}

/** A fetch stub serving the fixtures; unknown URLs get 404. */
export function fixtureFetch({ pages = buildPoedbPages(), ninja = buildNinjaJson(), calls = [] } = {}) {
  return async (url) => {
    calls.push(String(url));
    const u = String(url);
    if (u.startsWith('https://poe.ninja/')) {
      return { ok: true, status: 200, headers: { get: () => null }, json: async () => ninja, text: async () => JSON.stringify(ninja) };
    }
    const html = pages.get(u);
    const status = html == null ? 404 : 200;
    return {
      ok: status === 200, status, headers: { get: () => null },
      text: async () => html ?? 'not found', body: { cancel: async () => {} },
    };
  };
}

export const FIXTURE_GENERATED_DATE = '2026-11-15';
export const FIXTURE_LEAGUE = 'Covens';
