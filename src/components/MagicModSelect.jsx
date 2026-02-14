import { useState, useMemo } from 'react';
import { magicItemGroups, problemBases } from '../data/magicItemMods';

function ModToggle({ mod, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 rounded-lg text-[13px] leading-snug transition-all duration-100 group ${
        selected
          ? 'bg-indigo-500/15 ring-1 ring-indigo-400/40'
          : 'hover:bg-white/[0.04]'
      }`}
      title={`${mod.name} — ${mod.description} (ilvl ${mod.ilevel})`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-opacity ${
            selected ? 'opacity-100 bg-indigo-400' : 'opacity-0 group-hover:opacity-50 bg-zinc-400'
          }`}
        />
        <span className="text-zinc-200 truncate">{mod.name}</span>
        <span className="text-[10px] text-zinc-500 shrink-0 ml-auto">ilvl {mod.ilevel}</span>
      </span>
      <span className="text-[11px] text-zinc-400 ml-4 block truncate">{mod.description}</span>
    </button>
  );
}

export default function MagicModSelect({ baseType, selectedMods, onToggle }) {
  const [prefixSearch, setPrefixSearch] = useState('');
  const [suffixSearch, setSuffixSearch] = useState('');

  const { prefixes, suffixes, warnings } = useMemo(() => {
    if (!baseType || !magicItemGroups[baseType]) {
      return { prefixes: [], suffixes: [], warnings: [] };
    }

    const allMods = magicItemGroups[baseType];
    // Deduplicate by family — keep highest tier (first in list)
    const seenFamilies = { prefix: new Set(), suffix: new Set() };
    const dedupedPrefixes = [];
    const dedupedSuffixes = [];

    for (const mod of allMods) {
      const set = mod.isPrefix ? seenFamilies.prefix : seenFamilies.suffix;
      if (!set.has(mod.family)) {
        set.add(mod.family);
        if (mod.isPrefix) dedupedPrefixes.push(mod);
        else dedupedSuffixes.push(mod);
      }
    }

    const problems = problemBases[baseType] || [];
    return {
      prefixes: dedupedPrefixes,
      suffixes: dedupedSuffixes,
      warnings: problems,
    };
  }, [baseType]);

  const filteredPrefixes = useMemo(() => {
    const q = prefixSearch.toLowerCase();
    return q ? prefixes.filter((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)) : prefixes;
  }, [prefixes, prefixSearch]);

  const filteredSuffixes = useMemo(() => {
    const q = suffixSearch.toLowerCase();
    return q ? suffixes.filter((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)) : suffixes;
  }, [suffixes, suffixSearch]);

  if (!baseType) {
    return <p className="text-sm text-zinc-400/60 italic">Select an item base to see available affixes.</p>;
  }

  if (!magicItemGroups[baseType]) {
    return <p className="text-sm text-zinc-400/60 italic">No magic affix data available for this base type.</p>;
  }

  const isSelected = (mod, isPrefix) => {
    return selectedMods.some(
      (s) => s.basetype === baseType && s.regex.desc === mod.regex && s.affix === (isPrefix ? 'PREFIX' : 'SUFFIX')
    );
  };

  const handleToggle = (mod, isPrefix) => {
    onToggle({
      basetype: baseType,
      affix: isPrefix ? 'PREFIX' : 'SUFFIX',
      regex: { desc: mod.regex },
      mod,
    });
  };

  return (
    <div className="space-y-3">
      {warnings.length > 0 && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-400/20 px-3 py-2">
          <p className="text-xs text-amber-300">
            Some bases in this category may have name collisions: {warnings.join(', ')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Prefixes */}
        <div className="rounded-xl border border-white/5 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-blue-500/[0.06] border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Prefixes</h4>
            </div>
            <span className="text-xs text-zinc-400">{prefixes.length}</span>
          </div>
          <div className="px-3 py-2 border-b border-white/5">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={prefixSearch}
                onChange={(e) => setPrefixSearch(e.target.value)}
                placeholder="Search prefixes..."
                className="w-full bg-zinc-950/40 border border-white/5 rounded-lg text-sm py-1.5 pl-8 pr-3 text-zinc-100 placeholder:text-zinc-400/40 outline-none focus:border-indigo-500/40 transition-colors"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 min-h-[200px] max-h-[400px] p-1.5 space-y-px">
            {filteredPrefixes.map((mod) => (
              <ModToggle
                key={`${mod.family}-${mod.ilevel}`}
                mod={mod}
                selected={isSelected(mod, true)}
                onClick={() => handleToggle(mod, true)}
              />
            ))}
          </div>
        </div>

        {/* Suffixes */}
        <div className="rounded-xl border border-white/5 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-amber-500/[0.06] border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Suffixes</h4>
            </div>
            <span className="text-xs text-zinc-400">{suffixes.length}</span>
          </div>
          <div className="px-3 py-2 border-b border-white/5">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={suffixSearch}
                onChange={(e) => setSuffixSearch(e.target.value)}
                placeholder="Search suffixes..."
                className="w-full bg-zinc-950/40 border border-white/5 rounded-lg text-sm py-1.5 pl-8 pr-3 text-zinc-100 placeholder:text-zinc-400/40 outline-none focus:border-indigo-500/40 transition-colors"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 min-h-[200px] max-h-[400px] p-1.5 space-y-px">
            {filteredSuffixes.map((mod) => (
              <ModToggle
                key={`${mod.family}-${mod.ilevel}`}
                mod={mod}
                selected={isSelected(mod, false)}
                onClick={() => handleToggle(mod, false)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
