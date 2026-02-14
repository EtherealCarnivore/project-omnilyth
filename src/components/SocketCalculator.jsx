import { useState, useMemo } from 'react';
import { calculateSocketing, calculateSocketCostComparison } from '../calculators/socketCalc.js';

export default function SocketCalculator({ prices }) {
  const [quality, setQuality] = useState(20);
  const [targetSockets, setTargetSockets] = useState(6);
  const [corrupted, setCorrupted] = useState(false);
  const [attemptInput, setAttemptInput] = useState('');

  const stats = useMemo(
    () => calculateSocketing(corrupted ? 0 : quality, targetSockets),
    [quality, targetSockets, corrupted]
  );

  const attemptN = attemptInput === '' ? null : parseInt(attemptInput, 10);
  const attemptChance = !corrupted && attemptN > 0
    ? 1 - Math.pow(1 - stats.successChance, attemptN)
    : null;

  const jewellerPrice = prices?.['jewellers-orb']?.chaosRate;
  const vaalPrice = prices?.['vaal-orb']?.chaosRate ?? null;
  const hasPrices = jewellerPrice != null;

  const costComparison = useMemo(() => {
    if (!hasPrices) return null;
    return calculateSocketCostComparison(stats, jewellerPrice, vaalPrice, corrupted);
  }, [stats, jewellerPrice, vaalPrice, hasPrices, corrupted]);

  function handleQualityInput(val) {
    const n = parseInt(val, 10);
    if (val === '') { setQuality(0); return; }
    if (!isNaN(n)) setQuality(Math.max(0, Math.min(30, n)));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-cyan-300">Socketing Calculator</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Calculate Jeweller's Orbs needed to reach a target socket count.
        </p>
      </div>

      {/* Corrupted Toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none group w-fit">
        <span className="relative">
          <input
            type="checkbox"
            checked={corrupted}
            onChange={e => setCorrupted(e.target.checked)}
            className="sr-only peer"
          />
          <span className={`
            block w-10 h-6 rounded-full transition-colors duration-200
            ${corrupted ? 'bg-red-600' : 'bg-zinc-800/60'}
          `} />
          <span className={`
            absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
            ${corrupted ? 'translate-x-4' : 'translate-x-0'}
          `} />
        </span>
        <span className={`text-sm font-medium transition-colors duration-200 ${corrupted ? 'text-red-400' : 'text-zinc-400 group-hover:text-zinc-100'}`}>
          Corrupted Item
        </span>
        {corrupted && (
          <span className="text-[10px] uppercase tracking-wider text-red-400/60 font-semibold">
            Bench only
          </span>
        )}
      </label>

      {/* Input Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left: Quality / Target Sockets */}
        <div className={`rounded-xl bg-zinc-900/40 border border-white/5 p-4 space-y-4 ${corrupted ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-zinc-400">Item Quality</label>
            {corrupted && (
              <p className="text-[10px] text-red-400/70">Quality has no effect on corrupted bench crafts</p>
            )}
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={30}
                value={corrupted ? 0 : quality}
                onChange={e => handleQualityInput(e.target.value)}
                disabled={corrupted}
                className="calc-input w-20 text-center text-lg font-semibold"
              />
              <span className="text-zinc-400 text-sm">%</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={corrupted ? 0 : quality}
              onChange={e => setQuality(Number(e.target.value))}
              disabled={corrupted}
              className="fusing-range w-full"
            />
            <div className="flex justify-between text-[10px] text-zinc-400/60 px-0.5">
              <span>0%</span>
              <span>30%</span>
            </div>
          </div>
        </div>

        {/* Right: Target Sockets + Jewellers to use */}
        <div className="rounded-xl bg-zinc-900/40 border border-white/5 p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-cyan-300/70">Target Sockets</label>
            <div className="flex items-center gap-2 flex-wrap">
              {[2, 3, 4, 5, 6].map(s => (
                <button
                  key={s}
                  onClick={() => setTargetSockets(s)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border
                    ${targetSockets === s
                      ? 'bg-cyan-900/40 border-cyan-700/50 text-cyan-300'
                      : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-zinc-100 hover:border-white/[0.08]'
                    }
                  `}
                >
                  {s}S
                </button>
              ))}
            </div>
            {stats.minItemLevel > 1 && (
              <p className="text-[10px] text-zinc-400/60">
                Requires item level {stats.minItemLevel}+
              </p>
            )}
          </div>

          {/* Jewellers to use (non-corrupted only) */}
          {!corrupted && (
            <div className="border-t border-white/5 pt-3 space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-400">Jeweller's to use</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  placeholder="e.g. 200"
                  value={attemptInput}
                  onChange={e => setAttemptInput(e.target.value)}
                  className="calc-input w-28 text-center"
                />
                {attemptChance != null && (
                  <>
                    <span className="text-zinc-400 text-sm">&rarr;</span>
                    <span className="text-cyan-300 font-bold text-lg">{(attemptChance * 100).toFixed(1)}%</span>
                  </>
                )}
              </div>
              {attemptChance != null && (
                <p className="text-xs text-zinc-400">
                  chance to hit {targetSockets}S within {attemptN.toLocaleString()} jewellers
                </p>
              )}
            </div>
          )}

          {corrupted && (
            <div className="border-t border-red-800/15 pt-3 space-y-2">
              <label className="text-xs uppercase tracking-wider text-red-300/70">Corrupted Bench</label>
              <p className="text-sm text-zinc-400">
                <strong className="text-red-300">{stats.benchCost} jewellers + {stats.benchCost} vaal orbs</strong> for
                guaranteed {targetSockets} sockets.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Key Stats */}
      <div className={`grid grid-cols-1 ${corrupted ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-3`}>
        {!corrupted && (
          <div className="rounded-xl bg-cyan-900/20 border border-cyan-800/30 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-cyan-300/70 mb-1">Success Chance</div>
            <div className="text-2xl font-bold text-cyan-300">{(stats.successChance * 100).toFixed(2)}%</div>
            <div className="text-xs text-zinc-400 mt-1">per jeweller use</div>
          </div>
        )}
        <div className={`rounded-xl p-4 text-center ${corrupted ? 'bg-red-900/20 border border-red-800/30' : 'bg-cyan-900/20 border border-cyan-800/30'}`}>
          <div className={`text-xs uppercase tracking-wider mb-1 ${corrupted ? 'text-red-300/70' : 'text-cyan-300/70'}`}>
            {corrupted ? 'Corrupted Bench' : 'Avg Jeweller\'s'}
          </div>
          <div className={`text-2xl font-bold ${corrupted ? 'text-red-300' : 'text-cyan-300'}`}>
            {corrupted ? stats.benchCost : Math.round(stats.avgJewellers).toLocaleString()}
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            {corrupted
              ? `jewellers + ${stats.benchCost} vaals`
              : <>at {stats.quality}% quality &middot; bench: {stats.benchCost}</>
            }
          </div>
        </div>
        <div className={`rounded-xl p-4 text-center ${corrupted ? 'bg-red-900/20 border border-red-800/30' : 'bg-cyan-900/20 border border-cyan-800/30'}`}>
          <div className={`text-xs uppercase tracking-wider mb-1 ${corrupted ? 'text-red-300/70' : 'text-cyan-300/70'}`}>
            {!corrupted && stats.avgJewellers < stats.benchCost ? 'Manual is cheaper!' : 'Bench Cost'}
          </div>
          <div className={`text-2xl font-bold ${!corrupted && stats.avgJewellers < stats.benchCost ? 'text-green-300' : corrupted ? 'text-red-300' : 'text-cyan-300'}`}>
            {!corrupted
              ? `${Math.round(stats.benchCost - stats.avgJewellers)}`
              : stats.benchCost
            }
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            {!corrupted
              ? 'jewellers saved vs bench'
              : `guaranteed ${targetSockets} sockets`
            }
          </div>
        </div>
      </div>

      {/* Cost Comparison */}
      {costComparison && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">Cost Comparison</h3>
          <div className="overflow-x-auto rounded-lg border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-2 text-zinc-400 font-medium">Method</th>
                  <th className="text-right px-4 py-2 text-zinc-400 font-medium">Avg Orbs</th>
                  <th className="text-right px-4 py-2 text-zinc-400 font-medium">Chaos Cost</th>
                </tr>
              </thead>
              <tbody>
                {costComparison.map((s, i) => (
                  <tr
                    key={s.method}
                    className={
                      s.isBest
                        ? 'bg-green-900/30 text-green-300'
                        : i % 2 === 0
                          ? 'bg-poe-row-even'
                          : 'bg-poe-row-odd'
                    }
                  >
                    <td className="px-4 py-2">
                      <span className={s.isBest ? 'font-semibold' : ''}>
                        {s.method}
                        {s.isBest && <span className="ml-2 text-xs text-green-400">(Best)</span>}
                      </span>
                    </td>
                    <td className="text-right px-4 py-2 font-mono">
                      <span>{s.avgOrbs < 10 ? s.avgOrbs.toFixed(1) : Math.round(s.avgOrbs).toLocaleString()}</span>
                      {s.extraOrbs && <span className="text-red-400/70 text-xs ml-1">{s.extraOrbs}</span>}
                    </td>
                    <td className="text-right px-4 py-2 font-mono">
                      {s.chaosCost != null ? `${Math.round(s.chaosCost).toLocaleString()}c` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {corrupted && !vaalPrice && (
            <p className="text-xs text-red-400/60 mt-2">
              Vaal Orb price not available — bench cost may be underestimated.
            </p>
          )}
        </div>
      )}

      {/* Cumulative Probability (non-corrupted only) */}
      {!corrupted && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">Cumulative Probability</h3>
          <p className="text-xs text-zinc-400 mb-2">
            Chance of hitting {targetSockets} sockets within N jewellers at {quality}% quality
          </p>
          <div className="overflow-x-auto rounded-lg border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-2 text-zinc-400 font-medium">Jeweller's</th>
                  <th className="text-right px-4 py-2 text-zinc-400 font-medium">Probability</th>
                  <th className="text-left px-4 py-2 text-zinc-400 font-medium">Visual</th>
                </tr>
              </thead>
              <tbody>
                {stats.cumulativeTable.map((row, i) => (
                  <tr key={row.jewellers} className={i % 2 === 0 ? 'bg-poe-row-even' : 'bg-poe-row-odd'}>
                    <td className="px-4 py-2 font-mono">{row.jewellers.toLocaleString()}</td>
                    <td className="text-right px-4 py-2 font-mono text-cyan-300">
                      {(row.probability * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-2">
                      <div className="w-full bg-zinc-950/60 rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, row.probability * 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quality Reference */}
      {!corrupted && targetSockets === 6 && (
        <div className="rounded-xl bg-zinc-900/60 border border-white/5 p-4">
          <h3 className="text-sm font-semibold text-zinc-100 mb-2">Quality Quick Reference</h3>
          <p className="text-xs text-zinc-400 mb-3">
            Average Jeweller's Orbs for 6 sockets at various quality levels. Quality is <strong className="text-cyan-300">not consumed</strong> when using Jeweller's Orbs.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[0, 10, 20, 30].map(q => {
              const avg = 300 / (1 + q / 100);
              return (
                <div
                  key={q}
                  className={`rounded-lg p-2 text-center border ${quality === q ? 'bg-cyan-900/30 border-cyan-700/40 text-cyan-300' : 'bg-zinc-900/40 border-white/5 text-zinc-400'}`}
                >
                  <div className="font-semibold">{q}%</div>
                  <div className="text-lg font-bold">{Math.round(avg)}</div>
                  <div className="text-[10px] opacity-70">avg jewellers</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-xl bg-cyan-900/10 border border-cyan-800/20 p-4">
        <h3 className="text-sm font-semibold text-cyan-300 mb-2">Jeweller's Orb Mechanics</h3>
        <ul className="text-sm text-zinc-400 space-y-1">
          <li>&bull; Items always start at 1 socket</li>
          <li>&bull; Quality improves odds by 1% per 1% quality (linear)</li>
          <li>&bull; Quality is <strong className="text-cyan-300">not consumed</strong> — apply Armourer's Scraps/Whetstones first</li>
          <li>&bull; 6 sockets require item level 50+</li>
          <li>&bull; At 0% quality, manual rolling (avg 300) beats the bench (350) for 6S</li>
        </ul>
      </div>
    </div>
  );
}
