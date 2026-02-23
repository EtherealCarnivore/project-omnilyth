/**
 * LevelingPlannerPage
 * Build your leveling gem plan before league start
 */
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLevelingPlan } from '../contexts/LevelingPlanContext';
import { gemAvailabilityData } from '../data/leveling/gemAvailability';
import { parsePoBBuild, detectPoBInput, fetchPoBCodeFromUrl } from '../utils/pobParser';
import LinkGroupsSection from '../components/leveling/LinkGroupsSection';
import Fuse from 'fuse.js';

// Popular starter build templates
const STARTER_TEMPLATES = {
  'toxic-rain': {
    name: 'Toxic Rain Pathfinder',
    class: 'Ranger',
    gems: ['Toxic Rain', 'Caustic Arrow', 'Mirage Archer Support', 'Void Manipulation Support',
           'Efficacy Support', 'Vicious Projectiles Support', 'Withering Touch Support',
           'Despair', 'Malevolence', 'Grace'],
  },
  'poisonous-concoction': {
    name: 'Poisonous Concoction Pathfinder',
    class: 'Ranger',
    gems: ['Poisonous Concoction', 'Plague Bearer', 'Greater Multiple Projectiles Support',
           'Unbound Ailments Support', 'Deadly Ailments Support', 'Void Manipulation Support',
           'Herald of Agony', 'Malevolence'],
  },
  'srs': {
    name: 'SRS Necromancer',
    class: 'Witch',
    gems: ['Summon Raging Spirit', 'Minion Damage Support', 'Melee Physical Damage Support',
           'Melee Splash Support', 'Minion Speed Support', 'Elemental Damage with Attacks Support',
           'Zombies', 'Raise Spectre', 'Desecrate', 'Flesh Offering', 'Haste', 'Clarity'],
  },
  'lightning-arrow': {
    name: 'Lightning Arrow Deadeye',
    class: 'Ranger',
    gems: ['Lightning Arrow', 'Elemental Damage with Attacks Support', 'Mirage Archer Support',
           'Trinity Support', 'Inspiration Support', 'Added Lightning Damage Support',
           'Herald of Thunder', 'Precision', 'Grace', 'Defiance Banner'],
  },
  'righteous-fire': {
    name: 'Righteous Fire Chieftain',
    class: 'Marauder',
    gems: ['Righteous Fire', 'Fire Trap', 'Burning Damage Support', 'Elemental Focus Support',
           'Concentrated Effect Support', 'Purity of Fire', 'Vitality', 'Determination'],
  },
};

export default function LevelingPlannerPage() {
  const {
    characterClass,
    setCharacterClass,
    gems,
    addGem,
    removeGem,
    toggleObtained,
    clearPlan,
    linkGroups,
    setLinkGroups,
    gemsByLevel,
    socketRequirements,
    stats,
  } = useLevelingPlan();

  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPoBImport, setShowPoBImport] = useState(false);
  const [pobCode, setPobCode] = useState('');
  const [pobResult, setPobResult] = useState(null);
  const [pobLoading, setPobLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(() =>
    linkGroups && linkGroups.length > 0 ? 'links' : 'timeline'
  );
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const searchInputRef = useRef(null);

  // Update dropdown position
  const updateDropdownPosition = () => {
    if (searchInputRef.current) {
      const rect = searchInputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => setShowResults(false);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updateDropdownPosition);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, []);

  // Fuzzy search setup
  const fuse = new Fuse(Object.values(gemAvailabilityData), {
    keys: ['name'],
    threshold: 0.3,
    minMatchCharLength: 2,
  });

  // Search results
  const searchResults = searchQuery.length >= 2
    ? fuse.search(searchQuery).slice(0, 20).map(result => result.item)
    : [];

  const handleAddGem = (gemData) => {
    addGem(gemData);
    setSearchQuery('');
    setShowResults(false);
  };

  // PoB Import - processes raw code into result
  // Resolve a PoB gem name to our gem database entry.
  // Tries: exact match → with "Support" suffix → fuzzy search
  const resolveGemData = (name) => {
    // Exact match
    let gemData = gemAvailabilityData[name];
    if (gemData) return gemData;

    // PoB often omits "Support" suffix — try appending it
    if (!name.endsWith(' Support')) {
      gemData = gemAvailabilityData[name + ' Support'];
      if (gemData) return gemData;
    }

    // Fuzzy match as last resort
    const fuzzyResult = fuse.search(name);
    if (fuzzyResult.length > 0 && fuzzyResult[0].score < 0.3) {
      return fuzzyResult[0].item;
    }

    return null;
  };

  const processPoBCode = (code) => {
    const result = parsePoBBuild(code);

    // Match extracted gem names against our gem data
    const matched = [];
    const unmatched = [];

    result.gems.forEach(gem => {
      const gemData = resolveGemData(gem.name);
      if (gemData) {
        matched.push({ ...gem, gemData });
      } else {
        unmatched.push(gem);
      }
    });

    // Process link groups: match gem names against our gem data
    const linkGroups = (result.linkGroups || []).map(group => ({
      ...group,
      gems: group.gems.map(gem => ({
        ...gem,
        gemData: resolveGemData(gem.name) || null,
      })),
    }));

    setPobResult({
      error: result.error,
      character: result.character,
      matched,
      unmatched,
      linkGroups,
      total: result.gems.length,
    });
  };

  // Entry point: detect URL type or raw code, then process
  const handlePoBParse = async () => {
    if (!pobCode.trim()) return;

    const detected = detectPoBInput(pobCode);

    if (detected.type === 'unsupported') {
      setPobResult({ error: detected.message, matched: [], unmatched: [], linkGroups: [], total: 0 });
      return;
    }

    if (detected.type === 'pobbin' || detected.type === 'pastebin') {
      setPobLoading(true);
      const { code, error } = await fetchPoBCodeFromUrl(detected.type, detected.id);
      setPobLoading(false);

      if (error || !code) {
        setPobResult({ error: error || `Failed to fetch build from ${detected.type}`, matched: [], unmatched: [], linkGroups: [], total: 0 });
        return;
      }

      processPoBCode(code);
    } else {
      // Raw build code
      processPoBCode(pobCode);
    }
  };

  const handlePoBImport = () => {
    if (!pobResult || pobResult.matched.length === 0) return;

    // Set character class if detected
    if (pobResult.character?.class) {
      setCharacterClass(pobResult.character.class);
    }

    // Add all matched gems
    pobResult.matched.forEach(({ gemData }) => {
      addGem(gemData);
    });

    // Set link groups and switch to links tab
    if (pobResult.linkGroups && pobResult.linkGroups.length > 0) {
      setLinkGroups(pobResult.linkGroups);
      setActiveTab('links');
    } else {
      setActiveTab('timeline');
    }

    // Close modal
    setShowPoBImport(false);
    setPobCode('');
    setPobResult(null);
  };

  const handleLoadTemplate = (templateId) => {
    const template = STARTER_TEMPLATES[templateId];
    if (!template) return;

    // Set character class
    setCharacterClass(template.class);

    // Add all gems from template
    template.gems.forEach(gemName => {
      const gemData = gemAvailabilityData[gemName];
      if (gemData && !gems.some(g => g.name === gemName)) {
        addGem(gemData);
      }
    });

    setShowTemplates(false);
  };

  const handleCopyVendorRegex = () => {
    if (!socketRequirements.string) return;

    // Generate vendor regex patterns for socket colors
    const { R, G, B } = socketRequirements;
    const patterns = [];

    // Generate common variations (e.g., 3G-1R, 3g-1r, 3g1r, ggg-r, gggr)
    const parts = [];
    if (R > 0) parts.push({ count: R, color: 'R', colorLower: 'r' });
    if (G > 0) parts.push({ count: G, color: 'G', colorLower: 'g' });
    if (B > 0) parts.push({ count: B, color: 'B', colorLower: 'b' });

    // Pattern 1: 3G-1R
    patterns.push(parts.map(p => `${p.count}${p.color}`).join('-'));
    // Pattern 2: 3g-1r
    patterns.push(parts.map(p => `${p.count}${p.colorLower}`).join('-'));
    // Pattern 3: 3g1r
    patterns.push(parts.map(p => `${p.count}${p.colorLower}`).join(''));
    // Pattern 4: ggg-r
    patterns.push(parts.map(p => p.colorLower.repeat(p.count)).join('-'));
    // Pattern 5: gggr
    patterns.push(parts.map(p => p.colorLower.repeat(p.count)).join(''));

    const regex = patterns.join('|');

    navigator.clipboard.writeText(regex).then(() => {
      alert(`Vendor regex copied!\n\n${regex}\n\nPaste this in your stash search to find gear with ${socketRequirements.string} sockets.`);
    }).catch(() => {
      alert(`Vendor regex:\n\n${regex}\n\nCopy this manually.`);
    });
  };

  const handleExportPlan = () => {
    if (gems.length === 0) return;

    const exportText = `# ${characterClass || 'Path of Exile'} Leveling Plan\n\n` +
      `## Gem List (${gems.length} gems)\n\n` +
      gems.map(gem =>
        `- ${gem.name} (Level ${gem.level}) - ${gem.colors} - ${gem.source === 'quest' ? `Act ${gem.act}` : gem.source === 'siosa' ? 'Siosa' : 'Lilly'}`
      ).join('\n') +
      `\n\n## Socket Requirements\n${socketRequirements.string}\n\n` +
      `Generated by Omnilyth - https://omnilyth-beta.netlify.app/leveling/planner`;

    navigator.clipboard.writeText(exportText).then(() => {
      alert('✅ Plan copied to clipboard!\n\nShare it with your friends or save it for later.');
    }).catch(() => {
      // Fallback: show in modal for manual copy
      alert(exportText);
    });
  };

  const handleExportJSON = () => {
    if (gems.length === 0) return;

    const exportData = {
      class: characterClass,
      gems: gems.map(g => ({
        name: g.name,
        level: g.level,
        colors: g.colors,
        source: g.source,
        act: g.act,
        obtained: g.obtained,
      })),
      socketRequirements,
      stats,
      exportedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(exportData, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      alert('✅ JSON data copied to clipboard!\n\nYou can save this and import it later (import feature coming soon).');
    }).catch(() => {
      // Fallback: download as file
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `omnilyth-plan-${characterClass || 'poe'}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-amber-300">Leveling Build Planner</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Plan your gem progression before league start. Track what to get and when.
        </p>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-400/20 p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="text-zinc-300 font-medium">Pre-League Planning Tool</p>
            <p className="text-zinc-400 mt-1">
              Configure your leveling gems before the league starts. The system auto-groups by level and calculates socket requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Import from PoB */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-400/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-200">Import from Path of Building</h2>
              <p className="text-xs text-zinc-500">Paste a PoB code to auto-import all gems</p>
            </div>
          </div>
          <button
            onClick={() => setShowPoBImport(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-500/15 border border-violet-400/25 text-violet-300 hover:bg-violet-500/25 hover:border-violet-400/40 transition-all"
          >
            Import PoB
          </button>
        </div>
      </div>

      {/* PoB Import Modal */}
      {showPoBImport && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => { setShowPoBImport(false); setPobResult(null); setPobCode(''); }}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg rounded-xl bg-zinc-900 border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-400/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-zinc-100">Import from Path of Building</h3>
              </div>
              <button
                onClick={() => { setShowPoBImport(false); setPobResult(null); setPobCode(''); }}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Paste a pobb.in link or raw PoB build code
                </label>
                <textarea
                  value={pobCode}
                  onChange={(e) => { setPobCode(e.target.value); setPobResult(null); }}
                  placeholder="https://pobb.in/xL35WYU-E7uB  or  eNqVWFtv4zYS..."
                  rows={4}
                  className="w-full bg-zinc-950/60 border border-white/5 rounded-lg text-sm p-3 text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500/40 transition-colors font-mono resize-none"
                />
                <p className="text-[11px] text-zinc-600 mt-1.5">
                  Paste a pobb.in link or raw build code from build guides, poe.ninja, or Path of Building
                </p>
              </div>

              {/* Parse button */}
              {!pobResult && (
                <button
                  onClick={handlePoBParse}
                  disabled={!pobCode.trim() || pobLoading}
                  className="w-full py-2.5 rounded-lg text-sm font-medium bg-violet-500/15 border border-violet-400/25 text-violet-300 hover:bg-violet-500/25 hover:border-violet-400/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {pobLoading ? 'Fetching build code...' : 'Decode Build'}
                </button>
              )}

              {/* Error */}
              {pobResult?.error && (
                <div className="rounded-lg bg-red-500/10 border border-red-400/20 p-3">
                  <p className="text-sm text-red-300">{pobResult.error}</p>
                </div>
              )}

              {/* Results Preview */}
              {pobResult && !pobResult.error && (
                <div className="space-y-3">
                  {/* Character info */}
                  {pobResult.character?.class && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-zinc-500">Class:</span>
                      <span className="text-amber-300 font-medium">
                        {pobResult.character.ascendancy || pobResult.character.class}
                      </span>
                    </div>
                  )}

                  {/* Matched gems */}
                  <div>
                    <p className="text-xs font-medium text-emerald-400 mb-2">
                      {pobResult.matched.length} gems found
                      {pobResult.linkGroups?.length > 0 && (
                        <span className="text-zinc-500 ml-2">
                          ({pobResult.linkGroups.length} link groups)
                        </span>
                      )}
                    </p>
                    <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg bg-zinc-950/40 p-2">
                      {pobResult.matched.map(({ name, gemData, isSupport }) => (
                        <div key={name} className="flex items-center gap-2 px-2 py-1.5 rounded">
                          <img
                            src={gemData.icon}
                            alt={name}
                            className="w-6 h-6 rounded border border-white/10"
                          />
                          <span className={`text-sm truncate ${isSupport ? 'text-zinc-400' : 'text-zinc-200'}`}>
                            {gemData.name}
                          </span>
                          {gems.some(g => g.name === gemData.name) && (
                            <span className="ml-auto text-[10px] text-emerald-400 shrink-0">Already added</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unmatched gems */}
                  {pobResult.unmatched.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-zinc-500 mb-1">
                        {pobResult.unmatched.length} gems not in database
                      </p>
                      <div className="text-xs text-zinc-600 space-y-0.5">
                        {pobResult.unmatched.map(gem => (
                          <p key={gem.name}>{gem.name}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {pobResult && !pobResult.error && pobResult.matched.length > 0 && (
              <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => { setPobResult(null); setPobCode(''); }}
                  className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePoBImport}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-violet-500/20 border border-violet-400/30 text-violet-200 hover:bg-violet-500/30 hover:border-violet-400/50 transition-all"
                >
                  Import {pobResult.matched.filter(m => !gems.some(g => g.name === m.gemData.name)).length} Gems
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Quick Templates */}
      {gems.length === 0 && (
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Quick Start Templates</h2>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-xs text-zinc-400 hover:text-amber-300 transition-colors"
            >
              {showTemplates ? 'Hide' : 'Show Popular Builds'}
            </button>
          </div>

          {showTemplates && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(STARTER_TEMPLATES).map(([id, template]) => (
                <button
                  key={id}
                  onClick={() => handleLoadTemplate(id)}
                  className="text-left p-4 rounded-lg bg-zinc-900/40 border border-white/5 hover:border-amber-400/30 hover:bg-amber-500/5 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-200 group-hover:text-amber-300 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">{template.class}</p>
                      <p className="text-xs text-zinc-600 mt-2">{template.gems.length} gems</p>
                    </div>
                    <svg className="w-5 h-5 text-zinc-600 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!showTemplates && (
            <p className="text-xs text-zinc-500 text-center">
              Or manually add gems below
            </p>
          )}
        </div>
      )}

      {/* Class Selector */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Character Class</h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {['Witch', 'Shadow', 'Ranger', 'Duelist', 'Marauder', 'Templar', 'Scion'].map(cls => (
            <button
              key={cls}
              onClick={() => setCharacterClass(cls)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                characterClass === cls
                  ? 'bg-amber-500/20 border border-amber-400/30 text-amber-300'
                  : 'bg-zinc-900/40 border border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-300'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Gem Selector */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Add Gems</h2>

        {/* Search input */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateDropdownPosition();
              setShowResults(true);
            }}
            onFocus={() => {
              updateDropdownPosition();
              setShowResults(true);
            }}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Search for gems (e.g., Toxic Rain, Arc, Haste)..."
            className="w-full bg-zinc-950/40 border border-white/5 rounded-lg text-sm py-3 pl-10 pr-4 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-amber-500/40 transition-colors"
          />
        </div>

        {/* Search results dropdown - Rendered via Portal */}
        {showResults && searchResults.length > 0 && createPortal(
          <div
            className="fixed z-[9999] max-h-80 overflow-y-auto rounded-lg bg-zinc-900 border border-white/10 shadow-2xl"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
              {searchResults.map((gem) => {
                const isAdded = gems.some(g => g.name === gem.name);
                return (
                  <button
                    key={gem.name}
                    onClick={() => !isAdded && handleAddGem(gem)}
                    disabled={isAdded}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                      isAdded
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-amber-500/10'
                    }`}
                  >
                    <img
                      src={gem.icon}
                      alt={gem.name}
                      className="w-8 h-8 rounded border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-100 truncate">{gem.name}</p>
                      <p className="text-xs text-zinc-500">
                        {gem.availability?.[0]?.source === 'quest'
                          ? `Act ${gem.availability[0].act} Quest`
                          : gem.availability?.[0]?.source === 'siosa'
                          ? 'Siosa (Act 3)'
                          : 'Lilly Roth (Act 6)'}
                      </p>
                    </div>
                    {isAdded && (
                      <span className="text-xs text-emerald-400">✓ Added</span>
                    )}
                  </button>
                );
              })}
            </div>,
          document.body
        )}

        {/* Quick stats (shown only when sticky bar isn't visible) */}
        {gems.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span>{stats.total} gems planned</span>
            <span>•</span>
            <span>{stats.remaining} remaining</span>
          </div>
        )}
      </div>

      {/* Plan Content — Tabbed Layout */}
      {gems.length > 0 ? (
        <>
          {/* Sticky Socket Requirements Bar */}
          <div className="sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-zinc-950/90 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-red-300">{socketRequirements.R}</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-green-300">{socketRequirements.G}</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-blue-300">{socketRequirements.B}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-300">{socketRequirements.string}</span>
                <button
                  onClick={handleCopyVendorRegex}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/10 border border-amber-400/20 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/30 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Regex
                </button>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                <span>{stats.total} gems</span>
                <span>{stats.obtained} obtained</span>
                {stats.progress > 0 && (
                  <span className="text-emerald-400">{stats.progress}%</span>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 border-b border-white/5 -mb-2">
            {[
              { id: 'links', label: 'Link Groups', count: linkGroups?.length || 0 },
              { id: 'timeline', label: 'Gem Timeline', count: gems.length },
            ].filter(tab => tab.id !== 'links' || tab.count > 0).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'text-amber-300 border-amber-400'
                    : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-600'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs ${
                  activeTab === tab.id ? 'text-amber-400/60' : 'text-zinc-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}

            {/* Actions pushed to far right */}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleExportPlan}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-400/20 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/30 transition-all"
              >
                Export
              </button>
              <button
                onClick={handleExportJSON}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900/40 border border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-300 transition-colors"
              >
                JSON
              </button>
              <button
                onClick={clearPlan}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-white/5 hover:border-red-400/20 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="pt-2">
            {/* Link Groups Tab */}
            {activeTab === 'links' && <LinkGroupsSection />}

            {/* Gem Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                {Object.entries(gemsByLevel).map(([levelRange, gemsInRange]) => {
                  if (gemsInRange.length === 0) return null;

                  return (
                    <div key={levelRange} className="glass-card rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-zinc-300">{levelRange}</h3>
                        <span className="text-xs text-zinc-500">
                          {gemsInRange.filter(g => g.obtained).length}/{gemsInRange.length} obtained
                        </span>
                      </div>

                      <div className="space-y-2">
                        {gemsInRange.map((gem) => (
                          <div
                            key={gem.name}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                              gem.obtained
                                ? 'bg-emerald-500/5 border-emerald-400/20 opacity-60'
                                : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
                            }`}
                          >
                            <button
                              onClick={() => toggleObtained(gem.name)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                                gem.obtained
                                  ? 'bg-emerald-500 border-emerald-400'
                                  : 'border-zinc-600 hover:border-zinc-500'
                              }`}
                            >
                              {gem.obtained && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>

                            <img
                              src={gem.icon}
                              alt={gem.name}
                              className="w-8 h-8 rounded border border-white/10"
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`text-sm font-medium truncate ${gem.obtained ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                                  {gem.name}
                                </p>
                                {gem.source === 'quest' && characterClass && gem.classes.includes(characterClass) && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                                    Quest
                                  </span>
                                )}
                                {gem.source === 'quest' && characterClass && !gem.classes.includes(characterClass) && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-700/20 text-zinc-500 border border-zinc-600/30">
                                    Other Class
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <span className="text-amber-400/80 font-semibold">Requires Level {gem.level}</span>
                                <span>•</span>
                                <span>
                                  {gem.source === 'quest' && `Act ${gem.act}: ${gem.questName}`}
                                  {gem.source === 'siosa' && 'Siosa (Act 3)'}
                                  {gem.source === 'lilly' && 'Lilly Roth (Act 6)'}
                                </span>
                                {gem.colors && (
                                  <>
                                    <span>•</span>
                                    <span className="font-mono">{gem.colors}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => removeGem(gem.name)}
                              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Remove from plan"
                            >
                              <svg className="w-4 h-4 text-zinc-500 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="glass-card rounded-xl p-8 text-center">
          <svg className="w-12 h-12 text-zinc-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p className="text-zinc-400">No gems in your plan yet</p>
          <p className="text-sm text-zinc-600 mt-1">Search and add gems above to get started</p>
        </div>
      )}
    </div>
  );
}
