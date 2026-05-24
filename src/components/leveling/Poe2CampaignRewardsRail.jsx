/**
 * Poe2CampaignRewardsRail — the PoE 2 Leveling Mode right rail.
 *
 * Replaces PoE 1's gem-by-class panel. PoE 2's headline leveling value is the
 * dense ladder of permanent campaign rewards — several of which are one-time
 * IRREVERSIBLE choices (e.g. Venom Crypts) — plus the uncut-gem unlock timing.
 * Two sections: permanent rewards (with choice/irreversible affordances) and
 * uncut-gem milestones, + a static support-socket budget strip.
 */

const UNCUT_TYPES = new Set(['uncutSkillGem', 'uncutSupportGem', 'uncutSpiritGem']);

const TYPE_LABEL = {
  passive: 'Passives', spirit: 'Spirit', resist: 'Resist', life: 'Life',
  attribute: 'Attribute', 'charm-slot': 'Charm', other: 'Milestone',
};

function PermanentRewardCard({ reward, isDone, onToggle }) {
  const { isChoice, isIrreversible, missable, choiceOptions = [] } = reward;
  return (
    <div className={`rounded-lg border p-3 ${
      isIrreversible ? 'border-rose-500/30 bg-rose-500/[0.04]' : 'border-white/[0.06] bg-zinc-900/40'
    }`}>
      <div className="flex items-start gap-2">
        <button
          onClick={() => onToggle(reward.id)}
          className="mt-0.5 flex-shrink-0"
          aria-label={`Mark "${reward.value}" as ${isDone ? 'not done' : 'done'}`}
        >
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            isDone ? 'bg-green-500 border-green-500' : 'border-zinc-600 hover:border-zinc-500'
          }`}>
            {isDone && (
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${isDone ? 'text-zinc-500' : 'text-zinc-200'}`}>{reward.value}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">{reward.zone}{reward.type && TYPE_LABEL[reward.type] ? ` · ${TYPE_LABEL[reward.type]}` : ''}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {isIrreversible && (
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>
                Irreversible
              </span>
            )}
            {isChoice && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">Choose</span>
            )}
            {missable && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-700/50 text-zinc-400 border border-zinc-600/50">Missable</span>
            )}
          </div>
          {isChoice && choiceOptions.length > 0 && (
            <ul className="mt-2 space-y-1 border-l border-white/10 pl-2">
              {choiceOptions.map((opt, i) => (
                <li key={i} className="text-[11px] text-zinc-400">
                  <span className="text-zinc-300">{opt.label}</span>{opt.notes ? ` — ${opt.notes}` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Poe2CampaignRewardsRail({ act, completedRewards, onToggleReward }) {
  const rewards = act?.rewards || [];
  const permanent = rewards.filter((r) => !UNCUT_TYPES.has(r.type));
  const uncut = rewards.filter((r) => UNCUT_TYPES.has(r.type));

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
          Don't-miss rewards <span className="text-zinc-600">· {permanent.length}</span>
        </h2>
        {permanent.length === 0 ? (
          <p className="text-xs text-zinc-600">No permanent rewards in this act.</p>
        ) : (
          <div className="space-y-2">
            {permanent.map((r) => (
              <PermanentRewardCard key={r.id} reward={r} isDone={completedRewards.includes(r.id)} onToggle={onToggleReward} />
            ))}
          </div>
        )}
      </section>

      {uncut.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Uncut gem unlocks</h2>
          <ul className="space-y-1.5">
            {uncut.map((r) => (
              <li key={r.id} className="flex items-baseline justify-between gap-2 text-xs">
                <span className="text-zinc-300">{r.value}</span>
                <span className="text-zinc-600 truncate">{r.source || r.zone}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="border-t border-white/5 pt-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Support sockets</h2>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Skills start at <span className="text-zinc-300">2</span> support sockets →{' '}
          <span className="text-zinc-300">3 / 4 / 5</span> via Lesser / Greater / Perfect Jeweller's Orbs (5 = max).
          One copy of each support per character, across both weapon sets.
        </p>
      </section>
    </div>
  );
}
