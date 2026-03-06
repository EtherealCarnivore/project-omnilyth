import { useState, useEffect, useRef } from 'react';
import { vendorLevelingStats, vendorItemBases, socketLimits, socketPresets } from '../data/vendorLevelingStats';
import {
  generateVendorRegex,
  getTotalSockets,
  validateSocketConfig,
  validateLinkConfig
} from '../calculators/vendorRegex';
import SaveRegexButton from '../components/SaveRegexButton';

export default function VendorLevelingPage() {
  // State
  const [itemType, setItemType] = useState("Boots"); // Default to boots (MS!)
  const [itemBase, setItemBase] = useState("");
  const [includeBase, setIncludeBase] = useState(false);

  // Socket configuration
  const [sockets, setSockets] = useState({ r: 0, g: 0, b: 0, w: 0 });
  const [links, setLinks] = useState(0);
  const [socketPreset, setSocketPreset] = useState('custom');

  // Stat selection
  const [selectedStats, setSelectedStats] = useState({});

  // Result
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  // Get current socket limits for selected item type
  const currentLimits = socketLimits[itemType] || { maxSockets: 4, maxLinks: 4 };
  const canHaveSockets = currentLimits.maxSockets > 0;

  // Update item bases and validate sockets when item type changes
  useEffect(() => {
    if (vendorItemBases[itemType] && vendorItemBases[itemType].length > 0) {
      setItemBase(vendorItemBases[itemType][0]);
    }

    // Reset sockets if current exceeds new item type's limit
    const totalSockets = getTotalSockets(sockets);
    if (totalSockets > currentLimits.maxSockets) {
      setSockets({ r: 0, g: 0, b: 0, w: 0 });
      setLinks(0);
      setSocketPreset('custom');
    }

    // Reset links if current exceeds new item type's limit
    if (links > currentLimits.maxLinks) {
      setLinks(0);
    }
  }, [itemType]);

  // Recalculate regex whenever inputs change
  useEffect(() => {
    const stats = Object.entries(selectedStats)
      .filter(([_, config]) => config.enabled)
      .map(([statId, config]) => ({
        stat: findStatById(statId),
        value: config.value || 0
      }))
      .filter(s => s.stat);

    const socketConfig = getTotalSockets(sockets) > 0 ? sockets : null;

    const config = {
      itemBase: includeBase ? itemBase : "",
      sockets: socketConfig,
      links,
      stats,
      includeBase
    };

    const regex = generateVendorRegex(config);
    setResult(regex);
  }, [itemType, itemBase, includeBase, sockets, links, selectedStats]);

  // Find stat by ID across priority and secondary lists
  function findStatById(statId) {
    const stats = vendorLevelingStats[itemType];
    if (!stats) return null;

    const allStats = [...(stats.priority || []), ...(stats.secondary || [])];
    return allStats.find(s => s.id === statId);
  }

  // Handle preset change
  function handlePresetChange(presetId) {
    setSocketPreset(presetId);

    if (presetId === 'custom') {
      // Don't change sockets, just mark as custom
      return;
    }

    const preset = socketPresets.find(p => p.id === presetId);
    if (preset && preset.sockets) {
      // Check if preset fits within item limits
      const totalSockets = getTotalSockets(preset.sockets);
      if (totalSockets <= currentLimits.maxSockets) {
        setSockets(preset.sockets);

        // Auto-adjust links if needed
        if (links > totalSockets) {
          setLinks(totalSockets);
        }
      }
    }
  }

  // Handle socket change
  function handleSocketChange(color, value) {
    const newValue = Math.max(0, Math.min(currentLimits.maxSockets, parseInt(value) || 0));
    const newSockets = { ...sockets, [color]: newValue };

    // Validate total doesn't exceed item's max sockets
    if (getTotalSockets(newSockets) <= currentLimits.maxSockets) {
      setSockets(newSockets);
      setSocketPreset('custom'); // Mark as custom when manually changed

      // Auto-adjust links if needed
      const totalSockets = getTotalSockets(newSockets);
      if (links > totalSockets) {
        setLinks(totalSockets);
      }
    }
  }

  // Handle link change
  function handleLinkChange(value) {
    const newLinks = Math.max(0, Math.min(currentLimits.maxLinks, parseInt(value) || 0));
    const totalSockets = getTotalSockets(sockets);

    if (newLinks <= totalSockets && newLinks <= currentLimits.maxLinks) {
      setLinks(newLinks);
    }
  }

  // Handle stat toggle
  function handleStatToggle(statId) {
    setSelectedStats(prev => {
      const current = prev[statId] || {};
      return {
        ...prev,
        [statId]: {
          ...current,
          enabled: !current.enabled
        }
      };
    });
  }

  // Handle stat value change
  function handleStatValueChange(statId, value) {
    setSelectedStats(prev => ({
      ...prev,
      [statId]: {
        ...prev[statId],
        value: parseInt(value) || 0
      }
    }));
  }

  // Copy to clipboard
  function handleCopy() {
    if (!result || !result.regex) return;

    navigator.clipboard.writeText(result.regex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Get current stats for selected item type
  const currentStats = vendorLevelingStats[itemType] || { priority: [], secondary: [] };
  const priorityStats = currentStats.priority || [];
  const secondaryStats = currentStats.secondary || [];

  // Character count color
  const charCount = result?.characterCount || 0;
  const charColor = charCount > 250 ? 'text-red-400' : charCount > 200 ? 'text-yellow-400' : 'text-green-400';
  const barColor = charCount > 250 ? 'bg-red-500' : charCount > 200 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100">
          Vendor Leveling Regex
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
          Generate stash search regex for vendor shopping while leveling. Find boots with movement speed,
          items with specific socket colors/links, and essential leveling stats.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr,400px] gap-6">
        {/* LEFT: Configuration */}
        <div className="space-y-4">

          {/* Item Type Selection */}
          <div className="glass-card space-y-3">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Item Type</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(vendorItemBases).map(type => (
                <button
                  key={type}
                  onClick={() => setItemType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    itemType === type
                      ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30'
                      : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Base Selection */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="includeBase"
                checked={includeBase}
                onChange={(e) => setIncludeBase(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="includeBase" className="text-sm text-zinc-400">
                Include specific base:
              </label>
              <select
                value={itemBase}
                onChange={(e) => setItemBase(e.target.value)}
                disabled={!includeBase}
                className="calc-input flex-1 text-left"
              >
                {vendorItemBases[itemType]?.map(base => (
                  <option key={base} value={base}>{base}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Socket Configuration */}
          <div className="glass-card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                Sockets & Links
              </h2>
              <span className="text-xs text-zinc-500">
                Max: {currentLimits.maxSockets}S / {currentLimits.maxLinks}L
              </span>
            </div>

            {!canHaveSockets ? (
              <div className="text-sm text-zinc-500 italic py-2">
                This item type cannot have sockets
              </div>
            ) : (
              <>
                {/* Socket Presets — visual grid */}
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Socket Preset</label>
                  <div className="flex flex-wrap gap-1.5">
                    {socketPresets
                      .filter(preset => {
                        if (preset.id === 'custom') return true;
                        if (!preset.sockets) return true;
                        return getTotalSockets(preset.sockets) <= currentLimits.maxSockets;
                      })
                      .map(preset => (
                        <button
                          key={preset.id}
                          onClick={() => handlePresetChange(preset.id)}
                          title={preset.label}
                          className={`px-2 py-1.5 rounded-lg border transition-all ${
                            socketPreset === preset.id
                              ? 'bg-indigo-500/20 border-indigo-400/40 ring-1 ring-indigo-400/30'
                              : 'bg-zinc-900/60 border-white/[0.06] hover:border-zinc-500/40 hover:bg-zinc-800/60'
                          }`}
                        >
                          {preset.id === 'custom' ? (
                            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                          ) : (
                            <div className="flex gap-0.5">
                              {Array(preset.sockets?.r || 0).fill(0).map((_, i) => (
                                <div key={`r${i}`} className="w-3.5 h-3.5 rounded-full bg-red-500 border border-red-600/50" />
                              ))}
                              {Array(preset.sockets?.g || 0).fill(0).map((_, i) => (
                                <div key={`g${i}`} className="w-3.5 h-3.5 rounded-full bg-green-500 border border-green-600/50" />
                              ))}
                              {Array(preset.sockets?.b || 0).fill(0).map((_, i) => (
                                <div key={`b${i}`} className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-blue-600/50" />
                              ))}
                              {Array(preset.sockets?.w || 0).fill(0).map((_, i) => (
                                <div key={`w${i}`} className="w-3.5 h-3.5 rounded-full bg-zinc-300 border border-zinc-400/50" />
                              ))}
                            </div>
                          )}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Socket inputs */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'r', label: 'Red', color: 'text-red-400' },
                    { key: 'g', label: 'Green', color: 'text-green-400' },
                    { key: 'b', label: 'Blue', color: 'text-blue-400' },
                    { key: 'w', label: 'White', color: 'text-white' }
                  ].map(({ key, label, color }) => (
                    <div key={key} className="space-y-1">
                      <label className={`text-xs ${color} font-medium`}>{label}</label>
                      <input
                        type="number"
                        min="0"
                        max={currentLimits.maxSockets}
                        value={sockets[key]}
                        onChange={(e) => handleSocketChange(key, e.target.value)}
                        className="calc-input w-full text-center"
                      />
                    </div>
                  ))}
                </div>

                {/* Link input */}
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Minimum Links</label>
                  <select
                    value={links}
                    onChange={(e) => handleLinkChange(e.target.value)}
                    className="calc-input w-full"
                  >
                    <option value="0">No Link Requirement</option>
                    {currentLimits.maxLinks >= 2 && <option value="2">2-Link</option>}
                    {currentLimits.maxLinks >= 3 && <option value="3">3-Link</option>}
                    {currentLimits.maxLinks >= 4 && <option value="4">4-Link</option>}
                    {currentLimits.maxLinks >= 5 && <option value="5">5-Link</option>}
                    {currentLimits.maxLinks >= 6 && <option value="6">6-Link</option>}
                  </select>
                </div>

                {/* Socket count display */}
                <div className="text-xs text-zinc-500">
                  Total sockets: {getTotalSockets(sockets)} / {currentLimits.maxSockets}
                  {links > 0 && ` | Requires at least ${links}-link`}
                </div>
              </>
            )}
          </div>

          {/* Stat Selection */}
          <div className="glass-card space-y-3">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              Stats
            </h2>

            {/* Priority Stats */}
            {priorityStats.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs text-indigo-400 font-medium uppercase">Priority</h3>
                {priorityStats.map(stat => (
                  <StatRow
                    key={stat.id}
                    stat={stat}
                    config={selectedStats[stat.id] || {}}
                    onToggle={() => handleStatToggle(stat.id)}
                    onValueChange={(value) => handleStatValueChange(stat.id, value)}
                  />
                ))}
              </div>
            )}

            {/* Secondary Stats */}
            {secondaryStats.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <h3 className="text-xs text-zinc-400 font-medium uppercase">Secondary</h3>
                {secondaryStats.map(stat => (
                  <StatRow
                    key={stat.id}
                    stat={stat}
                    config={selectedStats[stat.id] || {}}
                    onToggle={() => handleStatToggle(stat.id)}
                    onValueChange={(value) => handleStatValueChange(stat.id, value)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Output */}
        <div className="space-y-4">
          {/* Result Box */}
          <div ref={resultRef} className="glass-card fade-in space-y-3">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-indigo-300 uppercase">Output</h3>
                <span className={`text-xs font-mono ${charColor}`}>
                  {charCount}<span className="text-zinc-400/60">/250</span>
                </span>
              </div>

              {/* Action Buttons */}
              {result && result.valid && result.regex && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      copied
                        ? 'bg-indigo-500/30 text-indigo-200'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                    }`}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                  <SaveRegexButton
                    pattern={result.regex}
                    toolId="vendor-leveling"
                    toolLabel="Vendor Leveling Regex"
                    variant="compact"
                  />
                </div>
              )}
            </div>

            {/* Regex Display */}
            <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-zinc-100 break-all min-h-[80px]">
              {result && result.regex ? (
                result.regex
              ) : (
                <span className="text-zinc-400/50">Select filters to generate regex...</span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="h-1 rounded-full bg-zinc-950/80 overflow-hidden">
              <div
                className={`h-full transition-all ${barColor}`}
                style={{ width: `${Math.min((charCount / 250) * 100, 100)}%` }}
              />
            </div>

            {/* Warnings */}
            {result && result.warnings && result.warnings.length > 0 && (
              <div className="space-y-1">
                {result.warnings.map((warning, i) => (
                  <p key={i} className="text-xs text-yellow-400 flex items-start gap-1.5">
                    <span className="mt-0.5">⚠️</span>
                    <span>{warning}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Usage Guide */}
          <div className="glass-card space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase">How to Use</h3>
            <ol className="text-xs text-zinc-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono">1.</span>
                <span>Copy the regex output above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono">2.</span>
                <span>Open your stash in-game</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono">3.</span>
                <span>Click the search box</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono">4.</span>
                <span>Paste the regex (Ctrl+V / Cmd+V)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono">5.</span>
                <span>Matching items will be highlighted!</span>
              </li>
            </ol>

            <div className="pt-2 border-t border-white/5">
              <p className="text-xs text-zinc-500">
                <strong className="text-zinc-400">Tip:</strong> For boots, always prioritize Movement Speed during leveling!
              </p>
            </div>
          </div>

          {/* Socket Visual Guide */}
          {getTotalSockets(sockets) > 0 && (
            <div className="glass-card space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase">Socket Pattern</h3>
              <div className="flex flex-wrap gap-1.5">
                {Array(sockets.w).fill(0).map((_, i) => (
                  <div key={`w${i}`} className="w-8 h-8 rounded-full bg-zinc-300 border-2 border-zinc-400"></div>
                ))}
                {Array(sockets.r).fill(0).map((_, i) => (
                  <div key={`r${i}`} className="w-8 h-8 rounded-full bg-red-500 border-2 border-red-600"></div>
                ))}
                {Array(sockets.g).fill(0).map((_, i) => (
                  <div key={`g${i}`} className="w-8 h-8 rounded-full bg-green-500 border-2 border-green-600"></div>
                ))}
                {Array(sockets.b).fill(0).map((_, i) => (
                  <div key={`b${i}`} className="w-8 h-8 rounded-full bg-blue-500 border-2 border-blue-600"></div>
                ))}
              </div>
              {links > 0 && (
                <p className="text-xs text-zinc-400">
                  Looking for at least <strong className="text-indigo-300">{links}-link</strong>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Row Component
function StatRow({ stat, config, onToggle, onValueChange }) {
  const isEnabled = config.enabled || false;
  const value = config.value || stat.minValue || 0;

  return (
    <div className={`rounded-lg transition-all ${
      isEnabled ? 'bg-indigo-500/10 ring-1 ring-indigo-400/30' : 'bg-zinc-900/30'
    }`}>
      <div className="flex items-center gap-2 px-3 py-2">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={onToggle}
          className="w-4 h-4"
        />
        <button
          onClick={onToggle}
          className="flex-1 text-left text-xs text-zinc-300"
        >
          {stat.desc}
        </button>
        {isEnabled && stat.hasRange && (
          <input
            type="number"
            min={stat.minValue}
            max={stat.maxValue}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={`${stat.minValue}+`}
            className="calc-input w-16 text-xs text-center"
          />
        )}
      </div>
    </div>
  );
}
