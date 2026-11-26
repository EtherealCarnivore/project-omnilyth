import { useEffect, useMemo, useState } from 'react';
import data from '../data/mercenaries/mercenaryData.json';
import { useLeague } from '../contexts/LeagueContext';
import { useGame } from '../contexts/GameContext';
import {
  MAX_LINK_LENGTH,
  TRADE_STATUS_OPTIONS,
  buildMercenaryQuery,
  estimateComplexity,
  tradeSearchUrl,
  tradeResultUrl,
} from '../calculators/mercenaryTradeQuery';

const STORAGE_KEY = 'omnilyth_merc_search_v1';
const EMPTY = { archetype: '', status: 'securable', wanted: [], excludedSkills: [], excludedFamilies: [] };

const skillById = new Map(data.skills.map((s) => [s.id, s]));
const supportById = new Map(data.supports.map((s) => [s.id, s]));
const families = (() => {
  const map = new Map();
  for (const s of data.supports) {
    if (!map.has(s.family)) map.set(s.family, []);
    map.get(s.family).push(s);
  }
  return [...map.entries()].map(([name, tiers]) => ({ name, tiers })).sort((a, b) => a.name.localeCompare(b.name));
})();
const familyByName = new Map(families.map((f) => [f.name, f]));

// Older saves stored single support tiers; lift them to their families.
const migrateWanted = (w) => (w.families ? w : {
  skillId: w.skillId,
  families: [...new Set((w.supportIds ?? []).map((id) => supportById.get(id)?.family).filter(Boolean))],
  minLinks: null,
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const s = { ...EMPTY, ...JSON.parse(raw) };
    return { ...s, wanted: s.wanted.map(migrateWanted) };
  } catch {
    return EMPTY;
  }
}

const matches = (text, q) => text.toLowerCase().includes(q.trim().toLowerCase());

function Card({ title, hint, children, right }) {
  return (
    <section className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-teal-300 uppercase tracking-wider">{title}</h2>
          {hint && <p className="text-xs text-zinc-500 mt-0.5">{hint}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function Chip({ active, tone = 'amber', onClick, children, title }) {
  // ACTIVE token (CLAUDE.md §3); the 1px padding trim keeps the 2px border
  // from shifting the chip row when it toggles.
  const on = tone === 'red'
    ? 'px-[9px] py-[3px] bg-red-500/20 border-2 border-red-500/50 text-red-400 line-through decoration-red-400/60'
    : 'px-[9px] py-[3px] bg-amber-500/20 border-2 border-amber-500/50 text-amber-400';
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`min-h-8 rounded-md text-xs transition-colors ${
        active ? on : 'px-2.5 py-1 bg-zinc-800/40 border border-white/[0.04] text-zinc-400 hover:text-zinc-200 hover:border-white/10'
      }`}
    >
      {children}
    </button>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-9 px-3 rounded-md bg-zinc-950/60 border border-white/[0.08] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-teal-500/50"
    />
  );
}

const tierTitle = (name) => (familyByName.get(name)?.tiers ?? []).map((t) => t.label).join(' · ');

/**
 * One wanted skill. Supports are picked by family and expand to every tier;
 * "−" excludes the family everywhere instead.
 */
function WantedSkill({ entry, excludedFamilies, onChange, onRemove, onExclude }) {
  const [q, setQ] = useState('');
  const skill = skillById.get(entry.skillId);
  const picked = entry.families ?? [];
  const options = q.trim()
    ? families.filter((f) => matches(f.name, q) && !picked.includes(f.name)).slice(0, 12)
    : [];
  const all = 1 + picked.length;

  return (
    <div className="border border-white/[0.06] rounded-md p-3 bg-zinc-950/30">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-white font-medium">{skill?.name ?? entry.skillId}</span>
        <button type="button" onClick={onRemove} className="text-xs text-zinc-500 hover:text-red-300 min-h-8 px-2" aria-label={`Remove ${skill?.name}`}>
          Remove
        </button>
      </div>

      {picked.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {picked.map((name) => (
            <Chip
              key={name}
              active
              onClick={() => onChange({ ...entry, families: picked.filter((x) => x !== name), minLinks: null })}
              title={`All tiers: ${tierTitle(name)} — click to remove`}
            >
              {name} ×
            </Chip>
          ))}
        </div>
      )}

      <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto] items-center">
        <SearchBox value={q} onChange={setQ} placeholder="Support on this skill — + want, − exclude (all tiers)…" />
        {picked.length > 0 && (
          <label className="text-xs text-zinc-400 flex items-center gap-2">
            Min links
            <select
              value={entry.minLinks ?? ''}
              onChange={(e) => onChange({ ...entry, minLinks: e.target.value === '' ? null : Number(e.target.value) })}
              className="min-h-9 px-2 rounded-md bg-zinc-950/60 border border-white/[0.08] text-white text-xs"
              title="Skill + supports linked, like the trade site's group minimum"
            >
              <option value="">{all} (all)</option>
              {Array.from({ length: all - 2 }, (_, i) => all - 1 - i).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      {options.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {options.map((f) => {
            const excluded = excludedFamilies.includes(f.name);
            return (
              <span key={f.name} className="inline-flex rounded-md border border-white/[0.06] overflow-hidden text-xs" title={tierTitle(f.name)}>
                <button
                  type="button"
                  onClick={() => { onChange({ ...entry, families: [...picked, f.name], minLinks: null }); setQ(''); }}
                  className="min-h-8 px-2.5 bg-zinc-800/40 text-zinc-300 hover:bg-amber-500/20 hover:text-amber-300"
                  aria-label={`Want ${f.name}, all tiers`}
                >
                  + {f.name}
                </button>
                <button
                  type="button"
                  onClick={() => { onExclude(f.name); setQ(''); }}
                  className={`min-h-8 px-2.5 border-l border-white/[0.06] ${excluded ? 'bg-red-500/15 text-red-300' : 'bg-zinc-800/40 text-zinc-500 hover:bg-red-500/15 hover:text-red-300'}`}
                  aria-label={`Exclude ${f.name}, all tiers`}
                  aria-pressed={excluded}
                >
                  −
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Parse a JSON reply; a non-JSON one (proxy refusal, HTML error page) becomes
 * `{ error }` with its text or status so callers can show it.
 */
async function readJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    const plain = text.trim();
    return { error: plain && !plain.startsWith('<') ? plain.slice(0, 200) : `HTTP ${res.status}` };
  }
}

/**
 * Dev-server only: import the PoE session from a local browser, like the
 * Omnilyth Watcher does. The session stays on the dev server; this component
 * only ever sees a masked preview.
 */
function DevSession() {
  const [s, setS] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const call = async (path, method = 'GET', label = '') => {
    setBusy(label);
    setError('');
    try {
      const res = await fetch(`/__dev/poe-session${path}`, { method });
      const body = await readJson(res);
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setS(body);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  useEffect(() => { call(''); }, []);

  return (
    <div className="mt-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-zinc-500 uppercase tracking-wider text-[11px]">PoE session</span>
        {s?.connected && (
          <button type="button" onClick={() => call('/clear', 'POST')} className="text-zinc-500 hover:text-red-300 min-h-8 px-1">
            Disconnect
          </button>
        )}
      </div>
      <p className={`mt-1 ${s?.connected ? 'text-green-300' : 'text-zinc-400'}`}>
        {s == null ? 'Checking…' : s.connected
          ? `Connected via ${s.source} · ${s.preview}${s.hasToken ? ' · POETOKEN' : ''}`
          : 'Not connected — searches run anonymously (lower limit).'}
      </p>
      <div className="grid grid-cols-3 gap-1.5 mt-2">
        {[['firefox', 'Firefox'], ['chrome', 'Chrome'], ['edge', 'Edge']].map(([key, label]) => (
          <button
            key={key}
            type="button"
            disabled={Boolean(busy)}
            onClick={() => call(`/import?browser=${key}`, 'POST', key)}
            className="min-h-8 rounded-md border border-white/[0.08] text-zinc-300 hover:border-teal-500/40 hover:text-teal-300 disabled:opacity-40"
          >
            {busy === key ? '…' : label}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-zinc-500 mt-1.5">Reads the cookie file of a browser you are logged in with. Kept on the dev server only.</p>
      {error && <p className="text-red-300 mt-1.5" role="alert">{error}</p>}
    </div>
  );
}

export default function MercenaryTradeSearch() {
  const { league } = useLeague();
  const { game } = useGame();
  const [state, setState] = useState(loadState);
  const [skillQ, setSkillQ] = useState('');
  const [excludeQ, setExcludeQ] = useState('');
  const [excludeSkillQ, setExcludeSkillQ] = useState('');
  const [run, setRun] = useState({ status: 'idle' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  }, [state]);

  const patch = (p) => { setState((s) => ({ ...s, ...p })); setRun({ status: 'idle' }); };
  const archetype = data.archetypes.find((a) => a.name === state.archetype) ?? null;
  const wantedIds = state.wanted.map((w) => w.skillId);

  const skillPools = useMemo(() => {
    if (archetype) {
      return [
        ['Primary', archetype.primary],
        ['Secondary', archetype.secondary],
        ['Utility', archetype.utility],
      ];
    }
    return [['All skills', data.skills.map((s) => s.id)]];
  }, [archetype]);

  const payload = useMemo(() => buildMercenaryQuery({
    status: state.status,
    wanted: state.wanted.map((w) => ({
      skillId: w.skillId,
      supportGroups: (w.families ?? []).map((f) => (familyByName.get(f)?.tiers ?? []).map((t) => t.id)),
      minLinks: w.minLinks,
    })),
    excludedSkillIds: state.excludedSkills,
    excludedSupportIds: state.excludedFamilies.flatMap((f) => (familyByName.get(f)?.tiers ?? []).map((t) => t.id)),
  }), [state]);

  const complexity = estimateComplexity(payload);
  const empty = payload.query.stats.length === 0;
  const url = tradeSearchUrl(league, payload);
  // The league picker is per game; with PoE 2 active it holds a PoE 2 league.
  const wrongGame = game !== 'poe1';
  const tooLong = url.length > MAX_LINK_LENGTH;
  const blocked = empty || wrongGame || tooLong;

  const toggle = (key, value) => patch({
    [key]: state[key].includes(value) ? state[key].filter((x) => x !== value) : [...state[key], value],
  });

  const addWanted = (skillId) => {
    if (wantedIds.includes(skillId)) return;
    patch({ wanted: [...state.wanted, { skillId, families: [], minLinks: null }], excludedSkills: state.excludedSkills.filter((x) => x !== skillId) });
  };

  // A family is either wanted (on some skill) or excluded, never both.
  const excludeFamily = (name) => patch({
    excludedFamilies: state.excludedFamilies.includes(name) ? state.excludedFamilies : [...state.excludedFamilies, name],
    wanted: state.wanted.map((w) => (w.families.includes(name) ? { ...w, families: w.families.filter((f) => f !== name), minLinks: null } : w)),
  });
  const updateWanted = (i, next) => {
    const added = next.families.filter((f) => !state.wanted[i].families.includes(f));
    patch({
      wanted: state.wanted.map((x, j) => (j === i ? next : x)),
      excludedFamilies: state.excludedFamilies.filter((f) => !added.includes(f)),
    });
  };

  async function runSearch() {
    setRun({ status: 'loading' });
    try {
      const res = await fetch(`/api/poe-trade/search/${encodeURIComponent(league)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await readJson(res);
      if (!res.ok || body.error) {
        // Trade API errors are `{ error: { message } }`; readJson / the dev proxy give a string.
        throw new Error((typeof body.error === 'string' ? body.error : body.error?.message) ?? `HTTP ${res.status}`);
      }
      setRun({ status: 'done', total: body.total, complexity: body.complexity, link: tradeResultUrl(league, body.id) });
    } catch (err) {
      setRun({ status: 'error', message: err.message });
    }
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard blocked */ }
  }

  // Exclude-skills list: the archetype's pools (or every skill), minus wanted
  // ones; excluded skills always stay visible so they can be un-struck.
  const excludableSkills = (archetype
    ? [...new Set([...archetype.primary, ...archetype.secondary, ...archetype.utility, ...state.excludedSkills])]
    : data.skills.map((s) => s.id)
  )
    .filter((id) => !wantedIds.includes(id))
    .filter((id) => state.excludedSkills.includes(id) || !excludeSkillQ.trim() || matches(skillById.get(id)?.name ?? '', excludeSkillQ))
    .sort((a, b) => (skillById.get(a)?.name ?? '').localeCompare(skillById.get(b)?.name ?? ''));

  const visibleFamilies = excludeQ.trim() ? families.filter((f) => matches(f.name, excludeQ)) : families;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-white">Mercenary Trade Search</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Pick the skills you want, strike out what you don&apos;t, open the search on the trade site. League: <span className="text-amber-300">{league}</span>
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Card
            title="1 · Mercenary"
            hint="Optional — narrows the skill list to one archetype's pools."
            right={(state.wanted.length > 0 || state.excludedSkills.length > 0 || state.excludedFamilies.length > 0) && (
              <button type="button" onClick={() => patch({ ...EMPTY, status: state.status })} className="text-xs text-zinc-500 hover:text-zinc-300 min-h-8 px-2">
                Reset
              </button>
            )}
          >
            <select
              value={state.archetype}
              onChange={(e) => patch({ archetype: e.target.value })}
              className="w-full min-h-9 px-3 rounded-md bg-zinc-950/60 border border-white/[0.08] text-sm text-white"
            >
              <option value="">Any archetype</option>
              {data.archetypes.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name} — {a.attribute}{a.variants.length === 1 ? ` (${a.variants[0]} only)` : ''}
                </option>
              ))}
            </select>
          </Card>

          <Card title="2 · Skills you want" hint="Click a skill to require it on the warrant.">
            <SearchBox value={skillQ} onChange={setSkillQ} placeholder="Filter skills…" />
            <div className="space-y-3 mt-3">
              {skillPools.map(([label, ids]) => {
                const shown = ids.filter((id) => !skillQ.trim() || matches(skillById.get(id)?.name ?? '', skillQ));
                if (!shown.length) return null;
                return (
                  <div key={label}>
                    <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1.5">{label}</div>
                    <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto">
                      {shown.map((id) => {
                        const wanted = wantedIds.includes(id);
                        const excluded = state.excludedSkills.includes(id);
                        return (
                          <Chip
                            key={id}
                            active={wanted || excluded}
                            tone={excluded ? 'red' : 'amber'}
                            onClick={() => {
                              if (excluded) toggle('excludedSkills', id);
                              else if (wanted) patch({ wanted: state.wanted.filter((w) => w.skillId !== id) });
                              else addWanted(id);
                            }}
                            title={excluded ? 'Excluded — click to allow again' : wanted ? 'Wanted — click to remove' : 'Click to want'}
                          >
                            {skillById.get(id)?.name}
                          </Chip>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {state.wanted.length > 0 && (
              <div className="space-y-2 mt-4">
                <div className="text-[11px] uppercase tracking-wider text-zinc-500">Wanted skills — supports must be on that skill, any tier</div>
                {state.wanted.map((w, i) => (
                  <WantedSkill
                    key={w.skillId}
                    entry={w}
                    excludedFamilies={state.excludedFamilies}
                    onChange={(next) => updateWanted(i, next)}
                    onExclude={excludeFamily}
                    onRemove={() => patch({ wanted: state.wanted.filter((_, j) => j !== i) })}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card
            title="3 · Exclude skills"
            hint="Struck-out skills must not be on the warrant (e.g. Wrath)."
            right={state.excludedSkills.length > 0 && (
              <button type="button" onClick={() => patch({ excludedSkills: [] })} className="text-xs text-zinc-500 hover:text-zinc-300 min-h-8 px-2">
                Clear {state.excludedSkills.length}
              </button>
            )}
          >
            <SearchBox value={excludeSkillQ} onChange={setExcludeSkillQ} placeholder="Filter skills to exclude (e.g. wrath, dash)…" />
            <div className="flex flex-wrap gap-1.5 mt-3 max-h-56 overflow-y-auto">
              {excludableSkills.map((id) => (
                <Chip
                  key={id}
                  tone="red"
                  active={state.excludedSkills.includes(id)}
                  onClick={() => toggle('excludedSkills', id)}
                >
                  {skillById.get(id)?.name}
                </Chip>
              ))}
            </div>
          </Card>

          <Card
            title="4 · Exclude supports"
            hint="Struck-out supports are excluded on every skill of the warrant, all tiers."
            right={state.excludedFamilies.length > 0 && (
              <button type="button" onClick={() => patch({ excludedFamilies: [] })} className="text-xs text-zinc-500 hover:text-zinc-300 min-h-8 px-2">
                Clear {state.excludedFamilies.length}
              </button>
            )}
          >
            <SearchBox value={excludeQ} onChange={setExcludeQ} placeholder="Filter supports (e.g. pierce, knockback)…" />
            <div className="flex flex-wrap gap-1.5 mt-3 max-h-80 overflow-y-auto">
              {visibleFamilies.map((f) => (
                <Chip
                  key={f.name}
                  tone="red"
                  active={state.excludedFamilies.includes(f.name)}
                  onClick={() => toggle('excludedFamilies', f.name)}
                  title={f.tiers.map((t) => t.label).join(' · ')}
                >
                  {f.name}
                </Chip>
              ))}
            </div>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-4 self-start">
          <Card title="Search">
            <label className="block text-xs text-zinc-400 mb-1" htmlFor="merc-status">Listing</label>
            <select
              id="merc-status"
              value={state.status}
              onChange={(e) => patch({ status: e.target.value })}
              className="w-full min-h-9 px-3 rounded-md bg-zinc-950/60 border border-white/[0.08] text-sm text-white"
            >
              {TRADE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <dl className="grid grid-cols-2 gap-y-1 text-xs mt-3">
              <dt className="text-zinc-500">Wanted skills</dt><dd className="text-right text-white">{state.wanted.length}</dd>
              <dt className="text-zinc-500">Excluded skills</dt><dd className="text-right text-white">{state.excludedSkills.length}</dd>
              <dt className="text-zinc-500">Excluded supports</dt><dd className="text-right text-white">{state.excludedFamilies.length}</dd>
              <dt className="text-zinc-500">Complexity (est.)</dt>
              <dd
                className={`text-right ${complexity > 150 ? 'text-yellow-300' : 'text-white'}`}
                title={complexity > 150 ? 'High complexity may be refused by the trade site — remove some exclusions' : undefined}
              >
                ~{complexity}
              </dd>
            </dl>

            <a
              href={blocked ? undefined : url}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={blocked}
              className={`mt-4 w-full min-h-10 inline-flex items-center justify-center rounded-md text-sm font-semibold border-2 ${
                blocked
                  ? 'border-white/[0.06] text-zinc-600 pointer-events-none'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
              }`}
            >
              Open on trade ↗
            </a>
            {wrongGame ? (
              <p className="text-xs text-yellow-300 mt-2">Mercenaries are PoE 1 — switch to PoE 1 in the top bar to pick a league.</p>
            ) : empty ? (
              <p className="text-xs text-zinc-500 mt-2">Want or exclude at least one skill or support.</p>
            ) : tooLong && (
              <p className="text-xs text-yellow-300 mt-2">Too many filters for a link — use Copy query JSON, or remove some exclusions.</p>
            )}
            <button
              type="button"
              onClick={copyJson}
              disabled={empty}
              className="mt-2 w-full min-h-9 rounded-md text-xs border border-white/[0.06] text-zinc-400 hover:text-zinc-200 disabled:opacity-40"
            >
              {copied ? 'Copied query JSON' : 'Copy query JSON'}
            </button>

            {import.meta.env.DEV && (
              <div className="mt-3 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={runSearch}
                  disabled={empty || wrongGame || run.status === 'loading'}
                  className="w-full min-h-9 rounded-md text-xs border border-teal-500/40 text-teal-300 hover:bg-teal-500/10 disabled:opacity-40"
                >
                  {run.status === 'loading' ? 'Searching…' : 'Run search (dev proxy)'}
                </button>
                {run.status === 'done' && (
                  <p className="text-xs text-zinc-300 mt-2">
                    {run.total.toLocaleString()} listings · complexity {run.complexity} ·{' '}
                    <a href={run.link} target="_blank" rel="noopener noreferrer" className="text-amber-300 underline">open result</a>
                  </p>
                )}
                {run.status === 'error' && <p className="text-xs text-red-300 mt-2" role="alert">{run.message}</p>}
                <DevSession />
              </div>
            )}
          </Card>
        </aside>
      </div>

      <p className="text-[11px] text-zinc-500">
        Data: GGG trade stats + poedb archetype pools, {data._meta.sources[1].fetchedAt.slice(0, 10)}. {data._meta.counts.archetypes} archetypes · {data._meta.counts.skills} skills · {data._meta.counts.supports} support tiers.
      </p>
    </div>
  );
}
