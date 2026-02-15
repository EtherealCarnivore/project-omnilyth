/*
 * FusingCalculator.jsx — The big one. 636 lines of PoE linking strategy UI.
 *
 * Handles normal fusings, corrupted items, tainted orb strategies, Omen of Connections,
 * Markov chain probability tables, cost comparisons, and more toggle states than a
 * Boeing 747 cockpit. This component has more useState calls than some entire apps.
 *
 * I wrote the math in fusingCalc.js and it was beautiful — pure functions, no side effects,
 * deterministic like a well-tuned matching engine. Then I had to wrap it in JSX and
 * suddenly I'm managing 8 pieces of mutable state with no type safety. In my trading
 * systems every state transition is logged, validated, and auditable. Here? useState
 * and a prayer. Shoutout to the React devs who do this full time — you are built different.
 */
import { useState, useMemo, useRef, useCallback } from 'react';
import { calculateFusing, calculateCostComparison, calculateTaintedStrategy } from '../calculators/fusingCalc.js';

export default function FusingCalculator({ prices }) {
  const [quality, setQuality] = useState(20);
  const [attemptInput, setAttemptInput] = useState('');
  const [corrupted, setCorrupted] = useState(false);
  const [useOmen, setUseOmen] = useState(false);
  const [sockets, setSockets] = useState(6);
  const [socketInput, setSocketInput] = useState('6');
  const [targetLinks, setTargetLinks] = useState(6);
  const [currentLinks, setCurrentLinks] = useState(4);
  const [socketError, setSocketError] = useState('');
  const errorTimer = useRef(null);

  const showSocketError = useCallback((msg) => {
    setSocketError(msg);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setSocketError(''), 3000);
  }, []);

  function handleSocketInput(val) {
    setSocketInput(val);
    if (val === '') return;
    const n = parseInt(val, 10);
    if (isNaN(n) || n < 1 || n > 6) {
      showSocketError('Sockets must be between 1 and 6');
      setSocketInput('');
      return;
    }
    setSockets(n);
    if (targetLinks > n) setTargetLinks(n);
    if (currentLinks >= n) setCurrentLinks(Math.max(1, n - 1));
  }

  // Corrupted items can't be quality'd, so we force 0. GGG giveth and GGG taketh away.
  const effectiveQuality = corrupted ? 0 : quality;
  const stats = useMemo(() => calculateFusing(effectiveQuality, targetLinks), [effectiveQuality, targetLinks]);

  const taintedStrategy = useMemo(
    () => corrupted ? calculateTaintedStrategy(targetLinks, currentLinks) : null,
    [corrupted, targetLinks, currentLinks]
  );

  // Is this a tainted strategy with the full Markov chain (5-6 sockets)?
  const hasTaintedStrat = taintedStrategy && !taintedStrategy.alreadyDone && !taintedStrategy.noLinksPossible && !taintedStrategy.benchOnly;

  const attemptN = attemptInput === '' ? null : parseInt(attemptInput, 10);
  const attemptChance = !corrupted && attemptN > 0 && stats.successChance
    ? 1 - Math.pow(1 - stats.successChance, attemptN)
    : null;

  const fusingPrice = prices?.['orb-of-fusing']?.chaosRate;
  const taintedFusingPrice = prices?.['tainted-orb-of-fusing']?.chaosRate;
  const vaalPrice = prices?.['vaal-orb']?.chaosRate ?? null;
  const omenPrice = prices?.['omen-of-connections']?.chaosValue ?? null;
  const hasPrices = fusingPrice != null;

  // Omen eligibility: non-corrupted, 6 sockets, 6 links
  const omenEligible = !corrupted && sockets === 6 && targetLinks === 6;
  const omenTotalCost = omenPrice != null && fusingPrice != null ? omenPrice + fusingPrice : null;
  const benchCostChaos = fusingPrice != null ? stats.benchCost * fusingPrice : null;
  const omenCheaperThanBench = omenTotalCost != null && benchCostChaos != null && omenTotalCost <= benchCostChaos;

  // Auto-disable omen toggle when not eligible
  const effectiveUseOmen = useOmen && omenEligible;

  // useMemo with 9 dependencies — the dependency array is longer than some FIX messages.
  // In Java this would be a cached computation with explicit invalidation. Here we list
  // every variable and hope React's shallow comparison doesn't betray us.
  const costComparison = useMemo(() => {
    if (!hasPrices) return null;
    return calculateCostComparison(stats, fusingPrice, taintedFusingPrice, vaalPrice, corrupted, taintedStrategy, effectiveUseOmen ? omenPrice : null);
  }, [stats, fusingPrice, taintedFusingPrice, vaalPrice, hasPrices, corrupted, taintedStrategy, effectiveUseOmen, omenPrice]);

  function handleQualityInput(val) {
    const n = parseInt(val, 10);
    if (val === '') { setQuality(0); return; }
    if (!isNaN(n)) setQuality(Math.max(0, Math.min(30, n)));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-orange-300">Fusing Calculator</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Calculate the expected Orbs of Fusing needed to fully link an item.
        </p>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        {/* Corrupted Toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none group w-fit">
          <span className="relative">
            <input
              type="checkbox"
              checked={corrupted}
              onChange={e => { setCorrupted(e.target.checked); if (e.target.checked) setUseOmen(false); }}
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
              {sockets >= 5 ? 'Bench + Tainted Strategy' : 'Bench only'}
            </span>
          )}
        </label>

        {/* Omen of Connections Toggle */}
        {!corrupted && (
          <div className="space-y-2">
            <label className={`flex items-center gap-3 select-none group w-fit ${omenEligible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
              <span className="relative">
                <input
                  type="checkbox"
                  checked={effectiveUseOmen}
                  onChange={e => setUseOmen(e.target.checked)}
                  disabled={!omenEligible}
                  className="sr-only peer"
                />
                <span className={`
                  block w-10 h-6 rounded-full transition-colors duration-200
                  ${effectiveUseOmen ? 'bg-amber-600' : 'bg-zinc-800/60'}
                `} />
                <span className={`
                  absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
                  ${effectiveUseOmen ? 'translate-x-4' : 'translate-x-0'}
                `} />
              </span>
              <span className={`text-sm font-medium transition-colors duration-200 ${effectiveUseOmen ? 'text-amber-300' : 'text-zinc-400 group-hover:text-zinc-100'}`}>
                Omen of Connections
              </span>
              {omenPrice != null && (
                <span className={`text-xs font-mono ${omenCheaperThanBench ? 'text-green-400/70' : 'text-red-400/70'}`}>
                  {omenTotalCost != null ? `${Math.round(omenTotalCost).toLocaleString()}c` : `${Math.round(omenPrice).toLocaleString()}c`}
                  {benchCostChaos != null && (
                    omenCheaperThanBench
                      ? <span className="text-green-400/50 ml-1">cheaper than bench</span>
                      : <span className="text-red-400/50 ml-1">bench is cheaper</span>
                  )}
                </span>
              )}
            </label>
            {!omenEligible && (
              <p className="text-[10px] text-zinc-500 ml-[52px]">
                {sockets < 6 || targetLinks < 6
                  ? 'Omen of Connections only works for 6-socket 6-link targets'
                  : 'Not available for corrupted items'
                }
              </p>
            )}
            {effectiveUseOmen && !omenCheaperThanBench && benchCostChaos != null && (
              <div className="ml-[52px] rounded-lg bg-red-900/30 border border-red-700/40 px-3 py-2">
                <p className="text-xs text-red-300">
                  ⚠ The bench craft ({Math.round(benchCostChaos).toLocaleString()}c for {stats.benchCost.toLocaleString()} fusings) is cheaper than using an Omen ({Math.round(omenTotalCost).toLocaleString()}c). Consider the bench instead.
                </p>
              </div>
            )}
            {effectiveUseOmen && omenCheaperThanBench && (
              <p className="text-xs text-green-400/70 ml-[52px]">
                1 Fusing + 1 Omen = guaranteed 6-link. Cheaper than {stats.benchCost.toLocaleString()} fusings at bench.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Input Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left card: Quality (non-corrupted) / Sockets & Links (corrupted) */}
        {!corrupted ? (
          <div className="rounded-xl bg-zinc-900/40 border border-white/5 p-4 space-y-3">
            <label className="text-xs uppercase tracking-wider text-zinc-400">Item Quality</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={30}
                value={quality}
                onChange={e => handleQualityInput(e.target.value)}
                className="calc-input w-20 text-center text-lg font-semibold"
              />
              <span className="text-zinc-400 text-sm">%</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={quality}
              onChange={e => setQuality(Number(e.target.value))}
              className="fusing-range w-full"
            />
            <div className="flex justify-between text-[10px] text-zinc-400/60 px-0.5">
              <span>0%</span>
              <span>30%</span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-red-900/10 border border-red-800/20 p-4 space-y-4">
            {/* Socket input */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-red-300/70">Sockets</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={socketInput}
                  onChange={e => handleSocketInput(e.target.value)}
                  onBlur={() => { if (socketInput === '') setSocketInput(String(sockets)); }}
                  className={`calc-input w-20 text-center text-lg font-semibold ${socketError ? 'border-red-500/70' : ''}`}
                />
                <span className="text-xs text-zinc-400/60">1 – 6</span>
              </div>
              {/* Inline error toast */}
              <div className={`overflow-hidden transition-all duration-300 ${socketError ? 'max-h-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-xs text-red-400 bg-red-900/30 rounded-lg px-3 py-1.5 inline-block">
                  {socketError}
                </p>
              </div>
            </div>

            {/* Current links */}
            {sockets >= 2 && (
              <div className="border-t border-red-800/15 pt-3 space-y-2">
                <label className="text-xs uppercase tracking-wider text-red-300/70">Current Links</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {Array.from({ length: sockets - 1 }, (_, i) => i + 1).map(l => (
                    <button
                      key={l}
                      onClick={() => setCurrentLinks(l)}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border
                        ${currentLinks === l
                          ? 'bg-red-900/40 border-red-700/50 text-red-300'
                          : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-zinc-100 hover:border-white/[0.08]'
                        }
                      `}
                    >
                      {l}L
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-400/60">Target: {sockets}-link</p>
              </div>
            )}
          </div>
        )}

        {/* Right card */}
        <div className="rounded-xl bg-zinc-900/40 border border-white/5 p-4 space-y-4">
          {!corrupted && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-400">Sockets</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={socketInput}
                  onChange={e => handleSocketInput(e.target.value)}
                  onBlur={() => { if (socketInput === '') setSocketInput(String(sockets)); }}
                  className={`calc-input w-20 text-center text-lg font-semibold ${socketError ? 'border-red-500/70' : ''}`}
                />
                <span className="text-xs text-zinc-400/60">1 – 6</span>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${socketError ? 'max-h-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-xs text-red-400 bg-red-900/30 rounded-lg px-3 py-1.5 inline-block">
                  {socketError}
                </p>
              </div>
            </div>
          )}
          {!corrupted && sockets >= 2 && (
            <div className="border-t border-white/5 pt-3 space-y-2">
              <label className="text-xs uppercase tracking-wider text-orange-300/70">Target Links</label>
              <div className="flex items-center gap-2 flex-wrap">
                {Array.from({ length: sockets - 1 }, (_, i) => i + 2).map(l => (
                  <button
                    key={l}
                    onClick={() => setTargetLinks(l)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border
                      ${targetLinks === l
                        ? 'bg-orange-900/40 border-orange-700/50 text-orange-300'
                        : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-zinc-100 hover:border-white/10'
                      }
                    `}
                  >
                    {l}L
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-400/60">{sockets} sockets &rarr; {targetLinks}-link</p>
            </div>
          )}
          {!corrupted && !stats.noLinksPossible && (
            <div className="border-t border-white/5 pt-3 space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-400">Fusings to use</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  placeholder="e.g. 543"
                  value={attemptInput}
                  onChange={e => setAttemptInput(e.target.value)}
                  className="calc-input w-28 text-center"
                />
                {attemptChance != null && (
                  <>
                    <span className="text-zinc-400 text-sm">&rarr;</span>
                    <span className="text-orange-300 font-bold text-lg">{(attemptChance * 100).toFixed(1)}%</span>
                  </>
                )}
              </div>
              {attemptChance != null && (
                <p className="text-xs text-zinc-400">
                  chance to {targetLinks}-link within {attemptN.toLocaleString()} fusings
                </p>
              )}
            </div>
          )}

          {/* Corrupted: strategy guide */}
          {corrupted && taintedStrategy?.noLinksPossible && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-red-300/70">Info</label>
              <p className="text-sm text-zinc-400">A 1-socket item has no links. Nothing to fuse!</p>
            </div>
          )}
          {corrupted && taintedStrategy?.benchOnly && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-red-300/70">Recommendation</label>
              <p className="text-sm text-zinc-400">
                For {sockets} sockets, just use the <strong className="text-red-300">Crafting Bench</strong> — it's cheap.
                Costs <strong className="text-red-300">{taintedStrategy.benchCost} fusings + {taintedStrategy.benchCost} vaal orbs</strong> for
                a guaranteed {sockets}-link.
              </p>
            </div>
          )}
          {corrupted && hasTaintedStrat && (
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-red-300/70">Optimal Strategy</label>
              <div className="text-sm text-zinc-400 space-y-2">
                <p>
                  <span className="text-zinc-100 font-medium">1.</span>{' '}
                  {taintedStrategy.needsInitialBench
                    ? <>Bench craft to <strong className="text-red-300">4-link</strong> ({taintedStrategy.initialBenchFusings} fusings + {taintedStrategy.initialBenchFusings} vaals)</>
                    : <>Start from your current <strong className="text-red-300">{currentLinks}-link</strong></>
                  }
                </p>
                <p>
                  <span className="text-zinc-100 font-medium">2.</span>{' '}
                  Slam <strong className="text-purple-300">Tainted Orb of Fusing</strong> (50/50 add or remove link)
                </p>
                <p>
                  <span className="text-zinc-100 font-medium">3.</span>{' '}
                  If it drops to 3L &rarr; bench reset to 4L (5 fusings + 5 vaals)
                </p>
                <p>
                  <span className="text-zinc-100 font-medium">4.</span>{' '}
                  Repeat until {sockets}-link!
                </p>
              </div>
            </div>
          )}
          {corrupted && taintedStrategy?.alreadyDone && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-green-300/70">Status</label>
              <p className="text-sm text-green-300 font-medium">Your item is already fully linked!</p>
            </div>
          )}
        </div>
      </div>

      {/* Key Stats */}
      {!corrupted && stats.noLinksPossible ? (
        <div className="rounded-xl bg-zinc-900/60 border border-white/5 p-4 text-center">
          <p className="text-sm text-zinc-400">A 1-socket item has no links. Nothing to fuse!</p>
        </div>
      ) : !corrupted && stats.benchOnly ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-orange-900/30 border border-orange-800/40 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-orange-300/70 mb-1">Bench Cost</div>
            <div className="text-2xl font-bold text-orange-300">{stats.benchCost}</div>
            <div className="text-xs text-zinc-400 mt-1">guaranteed {targetLinks}-link</div>
          </div>
          <div className="rounded-xl bg-orange-900/30 border border-orange-800/40 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-orange-300/70 mb-1">Average Manual</div>
            <div className="text-2xl font-bold text-orange-300">
              {stats.successChance >= 1 ? '1' : stats.avgFusings < 10 ? stats.avgFusings.toFixed(1) : Math.round(stats.avgFusings).toLocaleString()}
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              {stats.successChance >= 1 ? 'guaranteed — every fusing links' : `fusings at ${quality}% quality`}
            </div>
          </div>
        </div>
      ) : !corrupted ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-orange-900/30 border border-orange-800/40 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-orange-300/70 mb-1">Success Chance</div>
            <div className="text-2xl font-bold text-orange-300">{(stats.successChance * 100).toFixed(4)}%</div>
            <div className="text-xs text-zinc-400 mt-1">per fusing attempt</div>
          </div>
          <div className="rounded-xl bg-orange-900/30 border border-orange-800/40 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-orange-300/70 mb-1">Average Fusings</div>
            <div className="text-2xl font-bold text-orange-300">{Math.round(stats.avgFusings).toLocaleString()}</div>
            <div className="text-xs text-zinc-400 mt-1">&plusmn; {Math.round(stats.stdDev).toLocaleString()} std dev</div>
          </div>
          <div className="rounded-xl bg-orange-900/30 border border-orange-800/40 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-orange-300/70 mb-1">Bench Cost</div>
            <div className="text-2xl font-bold text-orange-300">{stats.benchCost.toLocaleString()}</div>
            <div className="text-xs text-zinc-400 mt-1">guaranteed {targetLinks}-link</div>
          </div>
        </div>
      ) : hasTaintedStrat ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-purple-900/20 border border-purple-800/30 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-purple-300/70 mb-1">Avg Tainted Fusings</div>
            <div className="text-2xl font-bold text-purple-300">~{taintedStrategy.avgTaintedFusings}</div>
            <div className="text-xs text-zinc-400 mt-1">from {taintedStrategy.startState}L &rarr; {sockets}L</div>
          </div>
          <div className="rounded-xl bg-purple-900/20 border border-purple-800/30 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-purple-300/70 mb-1">Avg Bench Resets</div>
            <div className="text-2xl font-bold text-purple-300">~{taintedStrategy.avgBenchResets}</div>
            <div className="text-xs text-zinc-400 mt-1">{taintedStrategy.benchResetCost} fusings + {taintedStrategy.benchResetCost} vaals each</div>
          </div>
          <div className="rounded-xl bg-red-900/20 border border-red-800/30 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-red-300/70 mb-1">Corrupted Bench</div>
            <div className="text-2xl font-bold text-red-300">{stats.benchCost.toLocaleString()}</div>
            <div className="text-xs text-zinc-400 mt-1">fusings + {stats.benchCost.toLocaleString()} vaals</div>
          </div>
        </div>
      ) : corrupted && taintedStrategy?.benchOnly ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-red-900/20 border border-red-800/30 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-red-300/70 mb-1">Corrupted Bench Cost</div>
            <div className="text-2xl font-bold text-red-300">{taintedStrategy.benchCost}</div>
            <div className="text-xs text-zinc-400 mt-1">fusings + {taintedStrategy.benchCost} vaals</div>
          </div>
          <div className="rounded-xl bg-red-900/20 border border-red-800/30 p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-red-300/70 mb-1">Target</div>
            <div className="text-2xl font-bold text-red-300">{sockets}-link</div>
            <div className="text-xs text-zinc-400 mt-1">guaranteed via bench</div>
          </div>
        </div>
      ) : corrupted && taintedStrategy?.alreadyDone ? (
        <div className="rounded-xl bg-green-900/20 border border-green-800/30 p-4 text-center">
          <div className="text-lg font-semibold text-green-300">Already {sockets}-linked!</div>
          <p className="text-sm text-zinc-400 mt-1">Your item is already fully linked.</p>
        </div>
      ) : null}

      {/* Cost Comparison */}
      {costComparison && !stats.noLinksPossible && !(taintedStrategy?.noLinksPossible) && (
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
              Vaal Orb price not available — bench costs may be underestimated.
            </p>
          )}
        </div>
      )}

      {/* Tainted Cumulative Probability (corrupted 5-6 socket) */}
      {corrupted && hasTaintedStrat && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">Tainted Fusing Probability</h3>
          <p className="text-xs text-zinc-400 mb-2">
            Chance of hitting {sockets}-link within N tainted fusings (starting from {taintedStrategy.startState}L, resetting at 3L)
          </p>
          <div className="overflow-x-auto rounded-lg border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-2 text-zinc-400 font-medium">Tainted Fusings</th>
                  <th className="text-right px-4 py-2 text-zinc-400 font-medium">Probability</th>
                  <th className="text-left px-4 py-2 text-zinc-400 font-medium">Visual</th>
                </tr>
              </thead>
              <tbody>
                {taintedStrategy.cumulativeTable.map((row, i) => (
                  <tr key={row.fusings} className={i % 2 === 0 ? 'bg-poe-row-even' : 'bg-poe-row-odd'}>
                    <td className="px-4 py-2 font-mono">{row.fusings}</td>
                    <td className="text-right px-4 py-2 font-mono text-purple-300">
                      {(row.probability * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-2">
                      <div className="w-full bg-zinc-950/60 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, row.probability * 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-zinc-400/50 mt-2">
            Note: While the wiki and community consensus state 50/50, some players report longer streaks. Hidden weights remain unconfirmed.
          </p>
        </div>
      )}

      {/* Non-corrupted Cumulative Probability */}
      {!corrupted && !stats.noLinksPossible && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">Cumulative Probability</h3>
          <p className="text-xs text-zinc-400 mb-2">Chance of hitting {targetLinks}-link within N fusings at {quality}% quality</p>
          <div className="overflow-x-auto rounded-lg border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-2 text-zinc-400 font-medium">Fusings</th>
                  <th className="text-right px-4 py-2 text-zinc-400 font-medium">Probability</th>
                  <th className="text-left px-4 py-2 text-zinc-400 font-medium">Visual</th>
                </tr>
              </thead>
              <tbody>
                {stats.cumulativeTable.map((row, i) => (
                  <tr key={row.fusings} className={i % 2 === 0 ? 'bg-poe-row-even' : 'bg-poe-row-odd'}>
                    <td className="px-4 py-2 font-mono">{row.fusings.toLocaleString()}</td>
                    <td className="text-right px-4 py-2 font-mono text-orange-300">
                      {(row.probability * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-2">
                      <div className="w-full bg-zinc-950/60 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
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

      {/* 5-Link Info (non-corrupted, 6-socket only) */}
      {!corrupted && stats.fiveLink && (
        <div className="rounded-xl bg-zinc-900/60 border border-white/5 p-4">
          <h3 className="text-sm font-semibold text-zinc-100 mb-2">5-Link Milestone</h3>
          <p className="text-sm text-zinc-400">
            While trying for a 6-link, you'll likely hit a 5-link first. At {quality}% quality,
            a 5-link takes roughly <strong className="text-orange-300">{Math.round(stats.fiveLink.avgFusings).toLocaleString()}</strong> fusings
            on average (~1 in {Math.round(1 / stats.fiveLink.chance)}).
          </p>
        </div>
      )}

      {/* Price Disclaimer */}
      {hasPrices && (
        <div className="rounded-xl bg-zinc-800/30 border border-zinc-700/20 p-3 flex items-start gap-2">
          <span className="text-zinc-500 mt-0.5 shrink-0">⚠</span>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Prices sourced from <strong className="text-zinc-400">poe.ninja</strong>, which scrapes GGG data roughly every hour. In-game merchant prices update in real time and may differ significantly. Always verify in-game before committing currency.
          </p>
        </div>
      )}

      {/* Tainted Fusing Info */}
      <div className="rounded-xl bg-purple-900/20 border border-purple-800/30 p-4">
        <h3 className="text-sm font-semibold text-purple-300 mb-2">Tainted Orb of Fusing</h3>
        <p className="text-sm text-zinc-400">
          Corrupted items only. Each use has a 50% chance to add a link and 50% chance to remove a link from the largest group.
        </p>
        {!corrupted && (
          <p className="text-sm text-red-400/70 mt-2">
            Requires corrupting your item first — which can brick it (turn it into a rare, add/remove sockets, or do nothing).
            Toggle "Corrupted Item" above to plan a tainted fusing strategy.
          </p>
        )}
        {corrupted && taintedFusingPrice && (
          <p className="text-sm text-zinc-400 mt-2">
            Tainted Fusing price: <strong className="text-poe-highlight">{taintedFusingPrice.toFixed(1)}c</strong>
          </p>
        )}
      </div>
    </div>
  );
}
