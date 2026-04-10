import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  buildBatchTradeUrls,
  getAvailableStats,
  MILITANT_FAITH_DEVOTION_MODS,
  DEVOTION_STAT_ID,
  calculateTotalDevotion,
} from '../calculators/timelessJewel';
import TimelessTreeView from './TimelessTreeView';

export default function TimelessJewelCalculator() {
  const { league } = useLeague();
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
  const [selectedDevotionMods, setSelectedDevotionMods] = useState([]); // Militant Faith "per 10 Devotion" mod IDs

  // Reverse search state
  const [mode, setMode] = useState('seed'); // 'seed' | 'search'
  const [selectedStats, setSelectedStats] = useState({}); // { [statId]: weight (1-5) }
  const [minMatches, setMinMatches] = useState(1);
  const [statQuery, setStatQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const workerRef = useRef(null);
  const rawDataRef = useRef(null); // raw JSON for passing to worker

  const jewelType = JEWEL_TYPES[jewelTypeIdx];
  const conqueror = jewelType.conquerors[conquerorIdx] || jewelType.conquerors[0];

  // Derived stat helpers (must be before handleSearch which uses effectiveMinMatches)
  const statEntries = Object.entries(selectedStats);
  const statCount = statEntries.length;
  // When nodes are pinned, require ALL pinned nodes to match (override manual minMatches)
  const effectiveMinMatches = enabledNodes.size > 0
    ? enabledNodes.size
    : Math.max(1, Math.min(minMatches, statCount || 1));

  // Lazy-load timeless jewel data
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import('../data/timeless/alternatePassiveSkills.json'),
      import('../data/timeless/alternatePassiveAdditions.json'),
      import('../data/timeless/translations.json'),
    ]).then(([skills, additions, translations]) => {
      if (cancelled) return;
      rawDataRef.current = { altSkills: skills.default, altAdditions: additions.default };
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

  // Toggle a Militant Faith "per 10 Devotion" mod
  const handleToggleDevotionMod = useCallback((modId) => {
    setSelectedDevotionMods(prev =>
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  }, []);

  // Handle jewel type change
  const handleJewelTypeChange = useCallback((idx) => {
    setJewelTypeIdx(idx);
    setConquerorIdx(0);
    setSeed('');
    setResults(null);
    setSelectedDevotionMods([]);
  }, []);

  // Handle conqueror change
  const handleConquerorChange = useCallback((idx) => {
    setConquerorIdx(idx);
    setResults(null);
  }, []);

  // Handle seed change
  const handleSeedChange = useCallback((e) => {
    const val = e.target.value;
    setSeed(val);
    setResults(null);
  }, []);

  // Handle socket change
  const handleSocketChange = useCallback((e) => {
    setSelectedSocket(e.target.value);
    setResults(null);
  }, []);

  // Calculate
  const handleCalculate = useCallback(() => {
    if (!timelessData || !selectedSocket || !seed || !socketData) return;

    const seedNum = Number(seed);
    if (isNaN(seedNum) || seedNum < jewelType.minSeed || seedNum > jewelType.maxSeed) return;
    if (jewelType.seedStep && seedNum % jewelType.seedStep !== 0) return;

    const nodesInRadius = socketData[selectedSocket].nodesInRadius;
    const calc = calculateSeed(seedNum, jewelType, conqueror, nodesInRadius, timelessData.lookups);
    setResults(calc);
  }, [timelessData, selectedSocket, seed, socketData, jewelType, conqueror]);

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

  // Available stats for the selected jewel type (for reverse search)
  const availableStats = useMemo(() => {
    if (!timelessData) return [];
    return getAvailableStats(jewelType.id, timelessData.lookups, timelessData.translations);
  }, [timelessData, jewelType.id]);

  // Filtered stat list for search dropdown
  const filteredStats = useMemo(() => {
    if (!statQuery) return availableStats;
    const q = statQuery.toLowerCase();
    return availableStats.filter(s => s.name.toLowerCase().includes(q));
  }, [availableStats, statQuery]);

  // Toggle a stat for reverse search (default weight 3)
  const handleToggleStat = useCallback((statId) => {
    setSelectedStats(prev => {
      const next = { ...prev };
      if (statId in next) delete next[statId];
      else next[statId] = 3;
      return next;
    });
    setSearchResults(null);
  }, []);

  // Change weight for a stat
  const handleStatWeight = useCallback((statId, weight) => {
    setSelectedStats(prev => {
      if (!(statId in prev)) return prev;
      return { ...prev, [statId]: weight };
    });
    setSearchResults(null);
  }, []);

  // Start reverse search via Web Worker
  const handleSearch = useCallback(() => {
    const statIds = Object.keys(selectedStats);
    if (!timelessData || !selectedSocket || !socketData || statIds.length === 0) return;
    if (!rawDataRef.current) return;

    // Kill previous worker
    if (workerRef.current) workerRef.current.terminate();

    setSearching(true);
    setSearchProgress(null);
    setSearchResults(null);

    const worker = new Worker(
      new URL('../workers/timelessSearch.js', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === 'progress') {
        setSearchProgress({ processed: msg.processed, total: msg.totalSeeds });
      } else if (msg.type === 'done') {
        setSearchResults(msg.results);
        setSearching(false);
        setSearchProgress(null);
        worker.terminate();
        workerRef.current = null;
      }
    };

    // Serialize nodes for the worker — if nodes are pinned, only search those
    const allNodes = socketData[selectedSocket].nodesInRadius;
    const sourceNodes = enabledNodes.size > 0
      ? allNodes.filter(n => enabledNodes.has(n.nodeId))
      : allNodes;
    const nodes = sourceNodes.map(n => ({
      nodeId: n.nodeId,
      name: n.node.name,
      skill: n.node.skill,
      type: n.type,
    }));

    worker.postMessage({
      type: 'search',
      jewelType: { id: jewelType.id, minSeed: jewelType.minSeed, maxSeed: jewelType.maxSeed, seedStep: jewelType.seedStep || 0 },
      conqueror,
      nodes,
      desiredStatIds: statIds.map(Number),
      statWeights: selectedStats,
      minMatches: effectiveMinMatches,
      altSkills: rawDataRef.current.altSkills,
      altAdditions: rawDataRef.current.altAdditions,
    });
  }, [timelessData, selectedSocket, socketData, selectedStats, effectiveMinMatches, jewelType, conqueror]);

  // Cancel search
  const handleCancelSearch = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setSearching(false);
    setSearchProgress(null);
  }, []);

  // Click a search result → switch to seed mode with that seed
  const handlePickSeed = useCallback((seedValue) => {
    setMode('seed');
    setSeed(String(seedValue));
    setResults(null);
    if (!timelessData || !selectedSocket || !socketData) return;
    const nodesInRadius = socketData[selectedSocket].nodesInRadius;
    const calc = calculateSeed(seedValue, jewelType, conqueror, nodesInRadius, timelessData.lookups);
    setResults(calc);
  }, [timelessData, selectedSocket, socketData, jewelType, conqueror]);

  // Cleanup worker on unmount
  useEffect(() => {
    return () => { if (workerRef.current) workerRef.current.terminate(); };
  }, []);

  // Reset search state on jewel type change
  useEffect(() => {
    setSelectedStats({});
    setSearchResults(null);
    setStatQuery('');
    setMinMatches(1);
  }, [jewelTypeIdx]);

  // Validate seed
  const seedNum = Number(seed);
  const seedValid = seed !== '' && !isNaN(seedNum) &&
    seedNum >= jewelType.minSeed && seedNum <= jewelType.maxSeed &&
    (!jewelType.seedStep || seedNum % jewelType.seedStep === 0);

  const canCalculate = seedValid && selectedSocket && timelessData;

  // Set of node IDs in the selected socket's radius (for tree clickability)
  // Must be before early return — hooks can't be after conditional returns
  const inRadiusNodeIds = useMemo(() => {
    if (!selectedSocket || !socketData) return new Set();
    return new Set(socketData[selectedSocket].nodesInRadius.map(n => n.nodeId));
  }, [selectedSocket, socketData]);

  // Group results by type
  const groupedResults = results ? groupResults(results) : null;

  // Loading state
  if (treeLoading || !timelessData) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        <span className="text-sm text-zinc-400">Loading timeless jewel data...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* ═══ Tree View (left/top) ═══ */}
      <TimelessTreeView
        treeData={treeData}
        selectedSocket={selectedSocket}
        onSelectSocket={(id) => {
          setSelectedSocket(id);
          setResults(null);
        }}
        results={results}
        inRadiusNodeIds={inRadiusNodeIds}
        pinnedNodes={enabledNodes}
        onToggleNode={handleNodeClick}
        className="h-[50vh] lg:h-auto lg:flex-1 min-h-[300px]"
      />

      {/* ═══ Controls Panel (right/bottom) ═══ */}
      <div className="lg:w-[420px] lg:flex-shrink-0 lg:overflow-y-auto space-y-5 glass-card rounded-2xl p-5">

      {/* Header + Mode Toggle */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Timeless Jewel Calculator</h2>
          <p className="text-sm text-zinc-400 mt-1">
            {mode === 'seed'
              ? 'Enter a seed to see how it transforms passives in radius.'
              : 'Pick desired stats and find the best seeds.'}
          </p>
        </div>
        <div className="flex rounded-lg border border-white/10 overflow-hidden flex-shrink-0">
          <button
            onClick={() => { setMode('seed'); setSearchResults(null); handleCancelSearch(); }}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'seed' ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
            }`}
          >Seed Lookup</button>
          <button
            onClick={() => { setMode('search'); setResults(null); }}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'search' ? 'bg-teal-500/20 text-teal-300' : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
            }`}
          >Stat Search</button>
        </div>
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

      {/* Militant Faith: "per 10 Devotion" modifier selector */}
      {jewelType.id === 4 && (
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            Devotion Modifier
            {selectedDevotionMods.length > 0 && (
              <span className="ml-2 text-purple-400">{selectedDevotionMods.length} selected</span>
            )}
          </label>
          <div className="space-y-1.5">
            {MILITANT_FAITH_DEVOTION_MODS.map(mod => {
              const isSelected = selectedDevotionMods.includes(mod.id);
              return (
                <button
                  key={mod.id}
                  onClick={() => handleToggleDevotionMod(mod.id)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-purple-500/15 border-purple-400/40 text-purple-300'
                      : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300'
                  }`}
                >
                  {isSelected && <span className="mr-1.5">&#10003;</span>}
                  {mod.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Socket indicator + dropdown fallback */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">Jewel Socket</label>
        <select
          value={selectedSocket}
          onChange={handleSocketChange}
          className="w-full px-3 py-2 rounded-lg bg-zinc-800/80 border border-white/10 text-sm text-zinc-100 outline-none focus:ring-1 focus:ring-amber-400/40"
        >
          <option value="">Click a socket on the tree...</option>
          {socketList.map(s => (
            <option key={s.id} value={s.id}>
              {s.regionName} ({s.notableCount}N{s.keystoneCount > 0 ? ` ${s.keystoneCount}K` : ''})
            </option>
          ))}
        </select>
      </div>

      {/* ═══ Seed Lookup Mode ═══ */}
      {mode === 'seed' && (
        <>
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
              results={results}
              selectedDevotionMods={selectedDevotionMods}
            />
          )}
        </>
      )}

      {/* ═══ Stat Search Mode ═══ */}
      {mode === 'search' && (
        <>
          {/* Stat selector */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Desired Stats
              {statCount > 0 && (
                <span className="ml-2 text-teal-400">{statCount} selected</span>
              )}
            </label>

            {/* Selected stats with weights */}
            {statCount > 0 && (
              <div className="space-y-1.5 mb-3">
                {statEntries.map(([statIdStr, weight]) => {
                  const statId = Number(statIdStr);
                  const stat = availableStats.find(s => s.statId === statId);
                  return (
                    <div key={statId} className="flex items-center gap-2 rounded-lg bg-teal-500/10 border border-teal-400/20 px-2.5 py-1.5">
                      <button
                        onClick={() => handleToggleStat(statId)}
                        className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0"
                        title="Remove"
                      >&times;</button>
                      <span className="text-xs text-teal-300 flex-1 min-w-0 truncate">{stat?.name || `Stat ${statId}`}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map(w => (
                          <button
                            key={w}
                            onClick={() => handleStatWeight(statId, w)}
                            className={`w-5 h-5 text-[10px] rounded transition-colors ${
                              w <= weight
                                ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                                : 'bg-zinc-800/50 text-zinc-600 border border-white/5'
                            }`}
                            title={`Weight ${w}`}
                          >{w}</button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Min matches control */}
                <div className="flex items-center gap-2 pt-1">
                  {enabledNodes.size > 0 ? (
                    <span className="text-xs text-pink-300/80">
                      Requiring all {enabledNodes.size} pinned nodes to match
                    </span>
                  ) : (
                    <>
                      <span className="text-xs text-zinc-500">Require at least</span>
                      <input
                        type="number"
                        value={minMatches}
                        onChange={(e) => { setMinMatches(Math.max(1, Number(e.target.value) || 1)); setSearchResults(null); }}
                        min={1}
                        max={20}
                        className="w-12 px-1.5 py-0.5 text-xs text-center rounded bg-zinc-800/80 border border-white/10 text-zinc-200"
                      />
                      <span className="text-xs text-zinc-500">nodes matching</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Search input */}
            <input
              type="text"
              value={statQuery}
              onChange={(e) => setStatQuery(e.target.value)}
              placeholder="Filter stats..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-800/80 border border-white/10 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-teal-400/40 mb-2"
            />

            {/* Stat list */}
            <div className="max-h-48 overflow-y-auto rounded-lg border border-white/5 bg-zinc-900/50 divide-y divide-white/5">
              {filteredStats.map(stat => {
                const isSelected = (stat.statId in selectedStats);
                return (
                  <button
                    key={stat.statId}
                    onClick={() => handleToggleStat(stat.statId)}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      isSelected
                        ? 'bg-teal-500/10 text-teal-300'
                        : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                    }`}
                  >
                    {isSelected && <span className="mr-1.5">&#10003;</span>}
                    {stat.name}
                  </button>
                );
              })}
              {filteredStats.length === 0 && (
                <div className="px-3 py-3 text-xs text-zinc-600 text-center">No matching stats</div>
              )}
            </div>
          </div>

          {/* Search button / progress */}
          {!searching ? (
            <button
              onClick={handleSearch}
              disabled={statCount === 0 || !selectedSocket}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                statCount > 0 && selectedSocket
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30 hover:bg-teal-500/30'
                  : 'bg-zinc-800/50 text-zinc-600 border border-white/5 cursor-not-allowed'
              }`}
            >
              Search {((jewelType.maxSeed - jewelType.minSeed) / (jewelType.seedStep || 1) + 1).toLocaleString()} Seeds
              {enabledNodes.size > 0 && <span className="ml-1 text-pink-300/70">({enabledNodes.size} pinned nodes)</span>}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Searching seeds...</span>
                <button onClick={handleCancelSearch} className="text-red-400 hover:text-red-300">Cancel</button>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-teal-500/60 rounded-full transition-all duration-150"
                  style={{ width: searchProgress ? `${(searchProgress.processed / searchProgress.total * 100)}%` : '0%' }}
                />
              </div>
              {searchProgress && (
                <div className="text-xs text-zinc-600 text-center">
                  {searchProgress.processed.toLocaleString()} / {searchProgress.total.toLocaleString()}
                </div>
              )}
            </div>
          )}

          {/* Search results */}
          {searchResults && (
            <SearchResults
              results={searchResults}
              translations={timelessData.translations}
              selectedStats={selectedStats}
              onPickSeed={handlePickSeed}
              jewelType={jewelType}
              league={league}
              conqueror={conqueror}
              treeData={treeData}
              selectedDevotionMods={selectedDevotionMods}
            />
          )}
        </>
      )}

      </div>{/* end controls panel */}
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
  results, selectedDevotionMods = [],
}) {
  const total = groups.keystones.length + groups.notables.length + groups.small.length;
  const tradeUrl = buildTradeUrl(league, jewelType, seed, conqueror.name, selectedDevotionMods);

  // Calculate total Devotion for Militant Faith
  const isMilitantFaith = jewelType.id === 4;
  const totalDevotion = isMilitantFaith && results ? calculateTotalDevotion(results) : 0;
  const activeMods = isMilitantFaith
    ? MILITANT_FAITH_DEVOTION_MODS.filter(m => selectedDevotionMods.includes(m.id))
    : [];

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

      {/* Militant Faith: Total Devotion + effective mod values */}
      {isMilitantFaith && totalDevotion > 0 && (
        <div className="rounded-xl border border-purple-400/20 bg-purple-500/5 px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-purple-300">Total Devotion</span>
            <span className="text-lg font-bold text-purple-200">{totalDevotion}</span>
          </div>
          {activeMods.length > 0 && (
            <div className="space-y-1 mt-2">
              {activeMods.map(mod => (
                <div key={mod.id} className="text-xs text-purple-300/80">
                  {mod.label.replace('#', String(Math.floor(totalDevotion / 10)))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

// ─── Search Results ─────────────────────────────────────────────────────────

function SearchResults({ results, translations, selectedStats, onPickSeed, jewelType, league, conqueror, treeData, selectedDevotionMods = [] }) {
  const [expanded, setExpanded] = useState(null);
  const spriteMap = treeData?.spriteMap || null;

  // Build batch trade URLs (chunks of up to 45 seeds)
  const allSeeds = results.map(r => r.seed);
  const batchUrls = useMemo(
    () => buildBatchTradeUrls(league, jewelType, allSeeds, conqueror.name, selectedDevotionMods),
    [league, jewelType, allSeeds.join(','), conqueror.name, selectedDevotionMods]
  );

  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-zinc-800/30 px-4 py-6 text-center text-sm text-zinc-500">
        No seeds found matching the selected stats for this socket.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">{results.length} seeds found</span>
        <span className="text-xs text-zinc-600">Ranked by matching stats</span>
      </div>

      {/* Batch trade buttons */}
      <div className="flex flex-wrap gap-1.5">
        {batchUrls.map((batch, i) => (
          <a
            key={i}
            href={batch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/15 text-amber-300 border border-amber-400/30 hover:bg-amber-500/25 transition-colors"
          >
            Trade #{batch.startIdx}&ndash;{batch.endIdx}
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-teal-400/20 bg-teal-500/5 overflow-hidden divide-y divide-white/5">
        {results.slice(0, 50).map((r) => {
          const isExpanded = expanded === r.seed;

          // One entry per node (a node may have multiple stat hits, show first)
          const byNode = new Map();
          for (const m of r.matches) {
            if (!byNode.has(m.nodeId)) byNode.set(m.nodeId, m);
          }
          const nodeMatches = [...byNode.values()];

          return (
            <div key={r.seed}>
              {/* Seed row — shows one line per unique desired stat */}
              <div className="px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : r.seed)}
                    className="flex items-center gap-2 min-w-0"
                  >
                    <span className="text-sm font-mono text-zinc-100 font-medium flex-shrink-0">{r.seed}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 flex-shrink-0">
                      {r.score} nodes
                    </span>
                    {r.weightedScore > 0 && (
                      <span className="text-[10px] text-amber-400/70 flex-shrink-0" title="Weighted score">
                        W:{r.weightedScore}
                      </span>
                    )}
                    <svg className={`w-3.5 h-3.5 text-zinc-600 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                    <button
                      onClick={() => onPickSeed(r.seed)}
                      className="px-2 py-0.5 text-xs rounded bg-zinc-700/50 text-zinc-300 border border-white/10 hover:bg-zinc-600/50 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* Stat summary — one line per matching node */}
                <div className="mt-1.5 space-y-0.5">
                  {nodeMatches.map((m) => (
                    <div key={m.nodeId} className="flex items-center gap-2 text-xs">
                      <NodeIcon nodeId={m.nodeId} treeData={treeData} spriteMap={spriteMap} />
                      <span className="text-zinc-500 truncate max-w-[80px]">{m.nodeName}</span>
                      {m.skillName && (
                        <>
                          <span className="text-zinc-600">&rarr;</span>
                          <span className="text-zinc-200 font-medium truncate max-w-[120px]">{m.skillName}</span>
                        </>
                      )}
                      <span className="text-teal-300/90 ml-auto flex-shrink-0">{translateStat(m.statId, m.value, translations)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded: all matches grouped by stat */}
              {isExpanded && (
                <div className="px-4 pb-3 pt-0">
                  <div className="rounded-lg bg-zinc-900/50 border border-white/5 divide-y divide-white/5">
                    {Object.keys(selectedStats).map(sk => { const statId = Number(sk);
                      const statMatches = r.matches.filter(m => m.statId === statId);
                      const label = translateStat(statId, statMatches[0]?.value || 0, translations);
                      return (
                        <div key={statId} className="px-3 py-2">
                          <div className={`text-xs font-medium mb-1 ${statMatches.length > 0 ? 'text-teal-300' : 'text-zinc-600 line-through'}`}>
                            {statMatches.length > 0 ? label : translateStat(statId, 1, translations).replace('1', '#')}
                          </div>
                          {statMatches.length > 0 ? (
                            <div className="space-y-0.5 pl-2">
                              {statMatches.map((m, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                  <NodeIcon nodeId={m.nodeId} treeData={treeData} spriteMap={spriteMap} />
                                  <span className="text-zinc-400">{m.nodeName}</span>
                                  <span className="text-teal-300/70">{m.value}</span>
                                  {m.skillName && <span className="text-zinc-600 ml-auto">({m.skillName})</span>}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-zinc-700 pl-2">Not found on any node</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Inline node icon for search results ────────────────────────────────────

function NodeIcon({ nodeId, treeData, spriteMap }) {
  if (!treeData || !spriteMap || !nodeId) return null;

  const node = treeData.nodes[nodeId];
  if (!node?.icon) return null;

  const sprite = spriteMap.inactive[node.icon] || spriteMap.active[node.icon];
  if (!sprite) return null;

  const size = 18;
  const scale = size / Math.max(sprite.w, sprite.h);

  return (
    <span
      className="inline-block flex-shrink-0 rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${sprite.sheetUrl})`,
        backgroundPosition: `-${sprite.x * scale}px -${sprite.y * scale}px`,
        backgroundSize: `${sprite.sheetW * scale}px ${sprite.sheetH * scale}px`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
