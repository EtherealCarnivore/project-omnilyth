/**
 * Poe2LevelingModePage — interactive PoE 2 campaign leveling tracker.
 *
 * Self-contained (no shared PoE 1 leveling context): imports the PoE 2 campaign
 * data directly and keeps progress in its own localStorage key. Layout mirrors
 * the PoE 1 Leveling Mode (act tabs + zone route + a right rail) but the rail is
 * the Campaign Rewards rail (permanent rewards + uncut-gem timing), and there's
 * no class selector — PoE 2 rewards/gem-unlocks are class-agnostic.
 *
 * Data is 0.4-sourced; zone/gem levels + reward magnitudes re-verify at the
 * 2026-05-29 0.5 launch (see src/data/poe2/leveling-mode-data.js header).
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { poe2LevelingActs } from '../data/poe2/leveling-mode-data';
import Poe2ZoneCard from '../components/leveling/Poe2ZoneCard';
import Poe2CampaignRewardsRail from '../components/leveling/Poe2CampaignRewardsRail';

const STORAGE_KEY = 'omnilyth_poe2_leveling_v1';

const NO_TAGS = [];
// Spirit leads Passive in the attention order (both out-shout the flat badges).
const TAG_ORDER = { spirit: 0, passive: 1 };

// Compact, attention-grade label for a Spirit / Passive reward chip on a zone
// card — e.g. "+2 Passive Points (+2 respec, …)" → "+2 Passive", "+30 Spirit"
// stays as-is. The full text still lives in the rewards rail.
function shortRewardLabel(reward) {
  if (reward.type === 'passive') {
    const n = reward.value.match(/\+?\d+/);
    return `${n ? n[0] : ''} Passive`.trim();
  }
  return reward.value.replace(/\s*\([^)]*\)\s*/g, '').trim();
}

function load() {
  try {
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      zones: Array.isArray(p.zones) ? p.zones : [],
      objectives: Array.isArray(p.objectives) ? p.objectives : [],
      rewards: Array.isArray(p.rewards) ? p.rewards : [],
      mode: p.mode === 'alt' ? 'alt' : 'fresh',
      actId: poe2LevelingActs.some((a) => a.id === p.actId) ? p.actId : poe2LevelingActs[0].id,
    };
  } catch {
    return { zones: [], objectives: [], rewards: [], mode: 'fresh', actId: poe2LevelingActs[0].id };
  }
}

export default function Poe2LevelingModePage() {
  const [state, setState] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const act = useMemo(
    () => poe2LevelingActs.find((a) => a.id === state.actId) || poe2LevelingActs[0],
    [state.actId]
  );

  // Zone name → its Spirit/Passive reward chips (sorted Spirit→Passive). Cross-
  // references the rail so a missable permanent reward can't slip past while the
  // player is ticking off zones.
  const rewardTagsByZone = useMemo(() => {
    const map = {};
    for (const r of act.rewards || []) {
      if (r.type !== 'spirit' && r.type !== 'passive') continue;
      (map[r.zone] ||= []).push({ type: r.type, value: r.value, label: shortRewardLabel(r) });
    }
    for (const k in map) map[k].sort((a, b) => TAG_ORDER[a.type] - TAG_ORDER[b.type]);
    return map;
  }, [act]);

  const toggle = (field, id) => setState((s) => {
    const set = new Set(s[field]);
    if (set.has(id)) set.delete(id); else set.add(id);
    return { ...s, [field]: [...set] };
  });

  const setActId = (actId) => setState((s) => ({ ...s, actId }));
  const setMode = (mode) => setState((s) => ({ ...s, mode }));
  const reset = () => setState((s) => ({ ...s, zones: [], objectives: [], rewards: [] }));

  const zones = act.zones || [];
  const doneCount = zones.filter((z) => state.zones.includes(z.id)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
            Path of Exile 2
          </span>
          <h1 className="text-2xl font-bold text-zinc-100">Leveling Mode</h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Act-by-act campaign tracker. Check off zones as you go; the right rail flags the
            permanent rewards you don't want to miss — especially the one-time irreversible choices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Fresh / Alt */}
          <div role="radiogroup" aria-label="Mode" className="inline-flex rounded-lg border border-white/[0.06] bg-zinc-900/60 p-1">
            {['fresh', 'alt'].map((m) => (
              <button
                key={m}
                role="radio"
                aria-checked={state.mode === m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  state.mode === m ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
                title={m === 'fresh' ? 'Show all tips (first character)' : 'Hide beginner tips (alt character)'}
              >
                {m}
              </button>
            ))}
          </div>
          <button onClick={reset} className="text-xs text-zinc-500 hover:text-zinc-300 underline-offset-2 hover:underline">
            Reset progress
          </button>
        </div>
      </div>

      {/* Act tabs */}
      <div className="flex flex-wrap gap-1.5">
        {poe2LevelingActs.map((a) => (
          <button
            key={a.id}
            onClick={() => setActId(a.id)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              a.id === state.actId
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : `text-zinc-400 hover:text-zinc-200 border border-white/[0.06] ${a.isInterlude ? 'italic' : ''}`
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Two-column: route + rewards rail */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-zinc-200">
              {act.label}
              {act.levelRange && <span className="text-sm font-normal text-zinc-500 ml-2">Levels {act.levelRange.enter}–{act.levelRange.exit}</span>}
            </h2>
            <span className="text-xs text-zinc-500">{doneCount}/{zones.length} zones</span>
          </div>

          {zones.map((z) => (
            <Poe2ZoneCard
              key={z.id}
              zone={z}
              rewardTags={rewardTagsByZone[z.name] || NO_TAGS}
              isComplete={state.zones.includes(z.id)}
              completedObjectives={state.objectives}
              onToggleZone={(id) => toggle('zones', id)}
              onToggleObjective={(id) => toggle('objectives', id)}
              mode={state.mode}
            />
          ))}

          {/* Cross-tool link */}
          <Link
            to="/poe2/leveling/vendor-regex"
            className="block rounded-lg border border-white/[0.06] bg-zinc-900/40 p-3 text-sm text-zinc-400 hover:text-zinc-200 hover:border-cyan-400/30 transition-colors"
          >
            Shopping a vendor this act? → <span className="text-cyan-400/90">Generate a Vendor Leveling Regex</span>
          </Link>
        </div>

        {/* Rewards rail — sticky on desktop so it stays visible while the zone
            list scrolls; flows normally (below zones) on narrow screens. */}
        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto xl:pr-1">
          <Poe2CampaignRewardsRail
            act={act}
            completedRewards={state.rewards}
            onToggleReward={(id) => toggle('rewards', id)}
          />
        </aside>
      </div>

      <p className="text-[11px] text-zinc-600 border-t border-white/5 pt-3">
        Campaign data sourced from the current 0.4 build. Zone levels, uncut-gem reward levels, and
        reward magnitudes are re-verified at the {`0.5`} launch (2026-05-29).
      </p>
    </div>
  );
}
