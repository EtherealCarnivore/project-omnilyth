import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLeague } from '../contexts/LeagueContext';
import usePassiveTreeData from '../hooks/usePassiveTreeData';
import {
  JEWEL_TYPES,
  TREE_VERSIONS,
  PASSIVE_TYPE,
  initTimelessData,
  getNodesInRadius,
  getSocketRegionName,
  calculateSeed,
  translateStat,
  buildTradeUrl,
} from '../calculators/timelessJewel';

export default function TimelessJewelCalculator() {
  const { league } = useLeague();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: treeData, loading: treeLoading } = usePassiveTreeData('3.28');

  const [timelessData, setTimelessData] = useState(null);
  const [jewelTypeIdx, setJewelTypeIdx] = useState(0);
  const [conquerorIdx, setConquerorIdx] = useState(0);
  const [seed, setSeed] = useState('');
  const [selectedSocket, setSelectedSocket] = useState('');
  const [results, setResults] = useState(null);
  const [showNotables, setShowNotables] = useState(true);
  const [showSmall, setShowSmall] = useState(true);
  const [enabledNodes, setEnabledNodes] = useState(new Set()); // manually re-enabled node IDs

  const jewelType = JEWEL_TYPES[jewelTypeIdx];
  const conqueror = jewelType.conquerors[conquerorIdx] || jewelType.conquerors[0];

  // Lazy-load timeless jewel data
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import('../data/timeless/alternatePassiveSkills.json'),
      import('../data/timeless/alternatePassiveAdditions.json'),
      import('../data/timeless/translations.json'),
    ]).then(([skills, additions, translations]) => {
      if (cancelled) return;
      setTimelessData({
        lookups: initTimelessData(skills.default, additions.default),
        translations: translations.default,
      });
    });
    return () => { cancelled = true; };
  }, []);

  // Pre-compute sockets and their affected nodes
  const socketData = useMemo(() => {
    if (!treeData) return null;
    const sockets = {};
    for (const [nodeId, node] of Object.entries(treeData.nodes)) {
      if (node.isJewelSocket && node.name === 'Basic Jewel Socket') {
        const nodesInRadius = getNodesInRadius(nodeId, treeData);
        sockets[nodeId] = {
          node,
          regionName: getSocketRegionName(nodeId, treeData),
          nodesInRadius,
          notableCount: nodesInRadius.filter(n => n.type === PASSIVE_TYPE.NOTABLE).length,
          keystoneCount: nodesInRadius.filter(n => n.type === PASSIVE_TYPE.KEYSTONE).length,
        };
      }
    }
    return sockets;
  }, [treeData]);

  // Sorted socket list for the dropdown
  const socketList = useMemo(() => {
    if (!socketData) return [];
    return Object.entries(socketData)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => a.regionName.localeCompare(b.regionName));
  }, [socketData]);

  // Restore state from URL on data load
  useEffect(() => {
    if (!socketData || !timelessData) return;
    const t = searchParams.get('type');
    const s = searchParams.get('seed');
    const sk = searchParams.get('socket');
    const c = searchParams.get('conqueror');

    if (t !== null) {
      const idx = JEWEL_TYPES.findIndex(j => j.id === Number(t));
      if (idx >= 0) setJewelTypeIdx(idx);
    }
    if (c) {
      const jt = t !== null ? JEWEL_TYPES.find(j => j.id === Number(t)) : jewelType;
      if (jt) {
        const ci = jt.conquerors.findIndex(cq => cq.name === c);
        if (ci >= 0) setConquerorIdx(ci);
      }
    }
    if (s) setSeed(s);
    if (sk && socketData[sk]) setSelectedSocket(sk);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketData, timelessData]);

  // Sync state to URL
  const updateUrl = useCallback((type, seedVal, socket, conq) => {
    const params = {};
    if (type !== undefined) params.type = type;
    if (seedVal) params.seed = seedVal;
    if (socket) params.socket = socket;
    if (conq) params.conqueror = conq;
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Handle jewel type change
  const handleJewelTypeChange = useCallback((idx) => {
    setJewelTypeIdx(idx);
    setConquerorIdx(0);
    setSeed('');
    setResults(null);
    updateUrl(JEWEL_TYPES[idx].id, '', selectedSocket, JEWEL_TYPES[idx].conquerors[0].name);
  }, [selectedSocket, updateUrl]);

  // Handle conqueror change
  const handleConquerorChange = useCallback((idx) => {
    setConquerorIdx(idx);
    setResults(null);
    updateUrl(jewelType.id, seed, selectedSocket, jewelType.conquerors[idx].name);
  }, [jewelType, seed, selectedSocket, updateUrl]);

  // Handle seed change
  const handleSeedChange = useCallback((e) => {
    const val = e.target.value;
    setSeed(val);
    setResults(null);
  }, []);

  // Handle socket change
  const handleSocketChange = useCallback((e) => {
    const val = e.target.value;
    setSelectedSocket(val);
    setResults(null);
    updateUrl(jewelType.id, seed, val, conqueror.name);
  }, [jewelType, seed, conqueror, updateUrl]);

  // Calculate
  const handleCalculate = useCallback(() => {
    if (!timelessData || !selectedSocket || !seed || !socketData) return;

    const seedNum = Number(seed);
    if (isNaN(seedNum) || seedNum < jewelType.minSeed || seedNum > jewelType.maxSeed) return;
    if (jewelType.seedStep && seedNum % jewelType.seedStep !== 0) return;

    const nodesInRadius = socketData[selectedSocket].nodesInRadius;
    const calc = calculateSeed(seedNum, jewelType, conqueror, nodesInRadius, timelessData.lookups);
    setResults(calc);
    updateUrl(jewelType.id, seed, selectedSocket, conqueror.name);
  }, [timelessData, selectedSocket, seed, socketData, jewelType, conqueror, updateUrl]);

  // Toggle handlers — turning a category OFF clears its manual overrides
  const handleToggleNotables = useCallback((val) => {
    setShowNotables(val);
    setEnabledNodes(prev => {
      if (!results) return prev;
      const next = new Set(prev);
      for (const r of results) {
        if (r.type === PASSIVE_TYPE.NOTABLE) next.delete(r.nodeId);
      }
      return next;
    });
  }, [results]);

  const handleToggleSmall = useCallback((val) => {
    setShowSmall(val);
    setEnabledNodes(prev => {
      if (!results) return prev;
      const next = new Set(prev);
      for (const r of results) {
        if (r.type === PASSIVE_TYPE.SMALL_ATTRIBUTE || r.type === PASSIVE_TYPE.SMALL_NORMAL) {
          next.delete(r.nodeId);
        }
      }
      return next;
    });
  }, [results]);

  // Click a node to toggle it on/off individually
  const handleNodeClick = useCallback((nodeId) => {
    setEnabledNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  // Validate seed
  const seedNum = Number(seed);
  const seedValid = seed !== '' && !isNaN(seedNum) &&
    seedNum >= jewelType.minSeed && seedNum <= jewelType.maxSeed &&
    (!jewelType.seedStep || seedNum % jewelType.seedStep === 0);

  const canCalculate = seedValid && selectedSocket && timelessData;

  // Loading state
  if (treeLoading || !timelessData) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        <span className="text-sm text-zinc-400">Loading timeless jewel data...</span>
      </div>
    );
  }

  // Group results by type
  const groupedResults = results ? groupResults(results) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100">Timeless Jewel Calculator</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Calculate how a timeless jewel seed transforms passives in radius.
        </p>
      </div>

      {/* Jewel Type Selector */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">Jewel Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {JEWEL_TYPES.map((jt, idx) => (
            <button
              key={jt.id}
              onClick={() => handleJewelTypeChange(idx)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                idx === jewelTypeIdx
                  ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                  : 'bg-zinc-800/50 border-white/5 text-zinc-300 hover:bg-zinc-700/50 hover:border-white/10'
              }`}
            >
              {jt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Conqueror Selector */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">Conqueror</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {jewelType.conquerors.map((cq, idx) => {
            const ks = getKeystoneForConqueror(cq, jewelType.id, timelessData);
            return (
              <button
                key={cq.name}
                onClick={() => handleConquerorChange(idx)}
                className={`px-3 py-2 text-left rounded-lg border transition-colors ${
                  idx === conquerorIdx
                    ? 'bg-teal-500/15 border-teal-400/40 text-teal-300'
                    : 'bg-zinc-800/50 border-white/5 text-zinc-300 hover:bg-zinc-700/50 hover:border-white/10'
                }`}
              >
                <div className="text-sm font-medium">{cq.name}</div>
                {ks && <div className="text-xs text-zinc-500 mt-0.5">{ks}</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seed + Socket Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Seed Input */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            Seed
            <span className="text-zinc-600 ml-1">
              ({jewelType.minSeed.toLocaleString()}&ndash;{jewelType.maxSeed.toLocaleString()}
              {jewelType.seedStep && `, multiples of ${jewelType.seedStep}`})
            </span>
          </label>
          <input
            type="number"
            value={seed}
            onChange={handleSeedChange}
            onKeyDown={(e) => e.key === 'Enter' && canCalculate && handleCalculate()}
            min={jewelType.minSeed}
            max={jewelType.maxSeed}
            step={jewelType.seedStep || 1}
            placeholder={`e.g. ${jewelType.minSeed + 100}`}
            className={`w-full px-3 py-2 rounded-lg bg-zinc-800/80 border text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:ring-1 ${
              seed && !seedValid
                ? 'border-red-400/50 focus:ring-red-400/40'
                : 'border-white/10 focus:ring-amber-400/40'
            }`}
          />
        </div>

        {/* Socket Selector */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">Jewel Socket</label>
          <select
            value={selectedSocket}
            onChange={handleSocketChange}
            className="w-full px-3 py-2 rounded-lg bg-zinc-800/80 border border-white/10 text-sm text-zinc-100 outline-none focus:ring-1 focus:ring-amber-400/40"
          >
            <option value="">Select a socket...</option>
            {socketList.map(s => (
              <option key={s.id} value={s.id}>
                {s.regionName} ({s.notableCount}N{s.keystoneCount > 0 ? ` ${s.keystoneCount}K` : ''})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={!canCalculate}
        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          canCalculate
            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30'
            : 'bg-zinc-800/50 text-zinc-600 border border-white/5 cursor-not-allowed'
        }`}
      >
        Calculate Seed Effects
      </button>

      {/* Results */}
      {groupedResults && (
        <ResultsDisplay
          groups={groupedResults}
          translations={timelessData.translations}
          jewelType={jewelType}
          seed={seedNum}
          conqueror={conqueror}
          league={league}
          showNotables={showNotables}
          showSmall={showSmall}
          enabledNodes={enabledNodes}
          onToggleNotables={handleToggleNotables}
          onToggleSmall={handleToggleSmall}
          onNodeClick={handleNodeClick}
        />
      )}
    </div>
  );
}

// ─── Helper: find keystone name for a conqueror ─────────────────────────────

function getKeystoneForConqueror(conqueror, jewelTypeId, timelessData) {
  if (!timelessData) return null;
  const ks = timelessData.lookups.allSkills.find(s =>
    s.AlternateTreeVersionsKey === jewelTypeId &&
    s.PassiveType.includes(PASSIVE_TYPE.KEYSTONE) &&
    s.Unknown19 === conqueror.index &&
    s.Unknown25 === conqueror.version
  );
  return ks?.Name || null;
}

// ─── Group results by type ──────────────────────────────────────────────────

function groupResults(results) {
  const groups = {
    keystones: [],
    notables: [],
    small: [],
  };
  for (const r of results) {
    if (r.type === PASSIVE_TYPE.KEYSTONE) groups.keystones.push(r);
    else if (r.type === PASSIVE_TYPE.NOTABLE) groups.notables.push(r);
    else groups.small.push(r);
  }
  return groups;
}

// ─── Results Display Component ──────────────────────────────────────────────

function ResultsDisplay({
  groups, translations, jewelType, seed, conqueror, league,
  showNotables, showSmall, enabledNodes, onToggleNotables, onToggleSmall, onNodeClick,
}) {
  const total = groups.keystones.length + groups.notables.length + groups.small.length;
  const tradeUrl = buildTradeUrl(league, jewelType, seed, conqueror.name);

  // A node is "active" if its category toggle is ON, or it was manually enabled
  const isNodeActive = (item) => {
    if (item.type === PASSIVE_TYPE.KEYSTONE) return true; // keystones always visible
    if (item.type === PASSIVE_TYPE.NOTABLE) return showNotables || enabledNodes.has(item.nodeId);
    return showSmall || enabledNodes.has(item.nodeId);
  };

  const activeNotables = groups.notables.filter(isNodeActive).length;
  const activeSmall = groups.small.filter(isNodeActive).length;

  return (
    <div className="space-y-4">
      {/* Summary bar + toggles */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">
            {total} passives in radius
            <span className="text-zinc-600 ml-2">
              ({groups.keystones.length}K / {activeNotables}/{groups.notables.length}N / {activeSmall}/{groups.small.length}S)
            </span>
          </span>
          {tradeUrl && (
            <a
              href={tradeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs font-medium rounded-lg bg-amber-500/15 text-amber-300 border border-amber-400/30 hover:bg-amber-500/25 transition-colors flex-shrink-0"
            >
              Search Trade
            </a>
          )}
        </div>

        {/* Toggle switches */}
        <div className="flex items-center gap-4">
          <ToggleSwitch
            label="Notables"
            checked={showNotables}
            onChange={onToggleNotables}
            count={groups.notables.length}
            activeCount={activeNotables}
          />
          <ToggleSwitch
            label="Small Passives"
            checked={showSmall}
            onChange={onToggleSmall}
            count={groups.small.length}
            activeCount={activeSmall}
          />
        </div>
      </div>

      {/* Keystones */}
      {groups.keystones.length > 0 && (
        <ResultSection
          title="Keystones"
          items={groups.keystones}
          translations={translations}
          color="amber"
          isNodeActive={isNodeActive}
          onNodeClick={onNodeClick}
        />
      )}

      {/* Notables */}
      {groups.notables.length > 0 && (
        <ResultSection
          title="Notables"
          items={groups.notables}
          translations={translations}
          color="teal"
          isNodeActive={isNodeActive}
          onNodeClick={onNodeClick}
          categoryOff={!showNotables}
        />
      )}

      {/* Small Passives */}
      {groups.small.length > 0 && (
        <ResultSection
          title="Small Passives"
          items={groups.small}
          translations={translations}
          color="zinc"
          defaultCollapsed
          isNodeActive={isNodeActive}
          onNodeClick={onNodeClick}
          categoryOff={!showSmall}
        />
      )}
    </div>
  );
}

// ─── Toggle Switch ──────────────────────────────────────────────────────────

function ToggleSwitch({ label, checked, onChange, count, activeCount }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-xs group"
    >
      <div className={`relative w-8 h-4.5 rounded-full transition-colors ${
        checked ? 'bg-amber-500/40' : 'bg-zinc-700'
      }`}>
        <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all shadow ${
          checked ? 'left-[calc(100%-0.875rem-0.125rem)] bg-amber-400' : 'left-0.5 bg-zinc-400'
        }`} />
      </div>
      <span className={`transition-colors ${checked ? 'text-zinc-300' : 'text-zinc-500'}`}>
        {label}
        {!checked && activeCount > 0 && (
          <span className="ml-1 text-amber-400/70">{activeCount} pinned</span>
        )}
      </span>
    </button>
  );
}

// ─── Result Section ─────────────────────────────────────────────────────────

function ResultSection({ title, items, translations, color, defaultCollapsed = false, isNodeActive, onNodeClick, categoryOff = false }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const colorMap = {
    amber: { border: 'border-amber-400/20', bg: 'bg-amber-500/5', text: 'text-amber-300', badge: 'bg-amber-500/20 text-amber-300' },
    teal:  { border: 'border-teal-400/20',  bg: 'bg-teal-500/5',  text: 'text-teal-300',  badge: 'bg-teal-500/20 text-teal-300' },
    zinc:  { border: 'border-white/5',       bg: 'bg-zinc-800/30', text: 'text-zinc-300',  badge: 'bg-zinc-700/50 text-zinc-400' },
  };
  const c = colorMap[color] || colorMap.zinc;

  const activeItems = items.filter(i => isNodeActive(i));
  const inactiveItems = items.filter(i => !isNodeActive(i));

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium"
      >
        <span className={c.text}>
          {title}
          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${c.badge}`}>
            {categoryOff ? `${activeItems.length}/${items.length}` : items.length}
          </span>
        </span>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!collapsed && (
        <div>
          {/* Active (visible) nodes — full display */}
          {activeItems.length > 0 && (
            <div className="divide-y divide-white/5">
              {activeItems.map((item) => (
                <ResultRow
                  key={item.nodeId}
                  item={item}
                  translations={translations}
                  clickable={categoryOff}
                  active
                  onClick={() => onNodeClick(item.nodeId)}
                />
              ))}
            </div>
          )}

          {/* Inactive (hidden) nodes — compact chips, click to activate */}
          {inactiveItems.length > 0 && (
            <div className="px-4 py-2.5 border-t border-white/5">
              <div className="text-xs text-zinc-600 mb-1.5">Click to pin:</div>
              <div className="flex flex-wrap gap-1.5">
                {inactiveItems.map((item) => (
                  <button
                    key={item.nodeId}
                    onClick={() => onNodeClick(item.nodeId)}
                    className="px-2 py-0.5 text-xs rounded bg-zinc-800/80 border border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/15 transition-colors cursor-pointer"
                    title={getResultPreview(item, translations)}
                  >
                    {item.result.replaced && item.result.skill
                      ? item.result.skill.Name
                      : item.node.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Result preview for tooltip on inactive chips ───────────────────────────

function getResultPreview(item, translations) {
  const { result } = item;
  const parts = [`${item.node.name}`];
  if (result.replaced && result.skill) {
    parts[0] += ` → ${result.skill.Name}`;
    for (let i = 0; i < result.skill.StatsKeys.length; i++) {
      parts.push(translateStat(result.skill.StatsKeys[i], result.statRolls[i] ?? 0, translations));
    }
  }
  for (const add of result.additions) {
    for (let j = 0; j < add.addition.StatsKeys.length; j++) {
      parts.push('+ ' + translateStat(add.addition.StatsKeys[j], add.statRolls[j] ?? 0, translations));
    }
  }
  return parts.join('\n');
}

// ─── Single Result Row ──────────────────────────────────────────────────────

function ResultRow({ item, translations, clickable, active, onClick }) {
  const { node, result } = item;
  const { replaced, skill, statRolls, additions } = result;

  const Wrapper = clickable ? 'button' : 'div';
  const wrapperProps = clickable ? {
    onClick,
    className: `w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.02] transition-colors ${active ? '' : 'opacity-40'}`,
  } : {
    className: 'px-4 py-2.5 text-sm',
  };

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex items-start gap-2">
        {/* Pin indicator when category is off */}
        {clickable && active && (
          <span className="text-amber-400/60 flex-shrink-0 mt-0.5" title="Pinned — click to unpin">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </span>
        )}

        {/* Original name */}
        <span className="text-zinc-400 min-w-0 flex-shrink-0">{node.name}</span>

        {/* Arrow */}
        {replaced && skill && (
          <>
            <span className="text-zinc-600 flex-shrink-0">&rarr;</span>
            <span className="text-zinc-100 font-medium">{skill.Name}</span>
          </>
        )}
      </div>

      {/* Replaced skill stats */}
      {replaced && skill && skill.StatsKeys.length > 0 && (
        <div className="mt-1 pl-4 space-y-0.5">
          {skill.StatsKeys.map((statId, i) => (
            <div key={i} className="text-xs text-teal-300/80">
              {translateStat(statId, statRolls[i] ?? 0, translations)}
            </div>
          ))}
        </div>
      )}

      {/* Additions */}
      {additions.length > 0 && (
        <div className="mt-1 pl-4 space-y-0.5">
          {additions.map((add, i) => (
            <div key={i}>
              {add.addition.StatsKeys.map((statId, j) => (
                <div key={j} className="text-xs text-emerald-300/80">
                  + {translateStat(statId, add.statRolls[j] ?? 0, translations)}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Original stats (dimmed) */}
      {node.stats && node.stats.length > 0 && (
        <div className="mt-1 pl-4">
          {node.stats.map((s, i) => (
            <div key={i} className="text-xs text-zinc-600">{s}</div>
          ))}
        </div>
      )}
    </Wrapper>
  );
}
