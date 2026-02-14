import { useState, useMemo } from 'react';
import { cleanCategoryName, categoryOrder, groupedCategory } from '../calculators/itemGroupUtils';

function ModRow({ mod, modKey, selection, onToggle, onValueChange }) {
  const isSelected = selection?.selected;
  const [expanded, setExpanded] = useState(false);

  const numberPositions = useMemo(() => {
    const positions = [];
    mod.before.forEach((idx) => positions.push({ idx, label: `#${idx + 1} (before)` }));
    mod.on.forEach((idx) => positions.push({ idx, label: `#${idx + 1} (in regex)` }));
    mod.after.forEach((idx) => positions.push({ idx, label: `#${idx + 1} (after)` }));
    return positions;
  }, [mod]);

  const hasNumbers = numberPositions.length > 0;
  const stat = mod.stats[0];

  return (
    <div className={`rounded-lg transition-all duration-150 ${isSelected ? 'bg-indigo-500/10 ring-1 ring-indigo-400/30' : 'hover:bg-white/[0.03]'}`}>
      <div className="flex items-center gap-2 px-3 py-1.5">
        <input
          type="checkbox"
          checked={!!isSelected}
          onChange={() => onToggle(modKey)}
          className="accent-indigo-400 w-3.5 h-3.5 shrink-0"
        />
        <button
          className="flex-1 text-left text-[13px] text-zinc-200 leading-snug truncate"
          onClick={() => onToggle(modKey)}
          title={mod.desc}
        >
          {mod.desc}
        </button>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
          mod.affixtype === 'PREFIX'
            ? 'bg-blue-500/15 text-blue-300 border border-blue-400/20'
            : 'bg-amber-500/15 text-amber-300 border border-amber-400/20'
        }`}>
          {mod.affixtype === 'PREFIX' ? 'P' : 'S'}
        </span>
        {(hasNumbers || mod.affixes.length > 1) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-zinc-400 hover:text-zinc-200 shrink-0"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {expanded && (
        <div className="fade-in px-3 pb-2 space-y-2">
          {/* Number inputs for threshold matching */}
          {isSelected && hasNumbers && (
            <div className="flex flex-wrap gap-2 ml-6">
              {numberPositions.map(({ idx, label }) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <label className="text-[11px] text-zinc-400">{label}:</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={selection?.values?.[idx] || ''}
                    onChange={(e) => onValueChange(modKey, idx, e.target.value)}
                    placeholder={stat ? `${stat.min}-${stat.max}` : '0'}
                    className="w-16 bg-zinc-950/50 border border-white/5 rounded text-xs py-1 px-2 text-zinc-100 placeholder:text-zinc-400/30 outline-none focus:border-indigo-500/40"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tier breakdown */}
          {mod.affixes.length > 0 && (
            <div className="ml-6 space-y-0.5">
              {mod.affixes.map((affix, i) => (
                <div key={i} className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-zinc-500 shrink-0" />
                  <span>{affix.name}</span>
                  {affix.desc && <span className="text-zinc-500">({affix.desc})</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CategorySection({ title, categories, selectedMods, onToggle, onValueChange, affixMap }) {
  const [open, setOpen] = useState(false);
  const modCount = categories.reduce((sum, c) => sum + c.modifiers.length, 0);
  const selectedCount = categories.reduce((sum, c) =>
    sum + c.modifiers.filter((m) => {
      const key = `${c.basetype || ''}-${c.category}-${m.desc}`;
      return selectedMods[key]?.selected;
    }).length, 0);

  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-950/30 hover:bg-zinc-950/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm font-medium text-indigo-300">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 transition-all duration-200">
              {selectedCount}
            </span>
          )}
          <span className="text-xs text-zinc-500">{modCount}</span>
        </div>
      </button>
      {open && (
        <div className="fade-in px-2 py-2 space-y-px border-t border-white/5">
          {categories.map((cat) =>
            cat.modifiers.map((mod) => {
              const key = `${cat.basetype || ''}-${cat.category}-${mod.desc}`;
              return (
                <ModRow
                  key={key}
                  mod={mod}
                  modKey={key}
                  selection={selectedMods[key]}
                  onToggle={onToggle}
                  onValueChange={onValueChange}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function RareModSelect({ baseType, itemRegexData, selectedMods, onToggle, onValueChange }) {
  const [search, setSearch] = useState('');

  const groupedData = useMemo(() => {
    if (!baseType || !itemRegexData[baseType]) return {};
    const data = itemRegexData[baseType];
    const categories = [...data.categoryRegex].sort(categoryOrder);

    // Attach basetype to each category for key generation
    const categoriesWithBase = categories.map((c) => ({ ...c, basetype: data.basetype }));

    // Filter by search
    const q = search.toLowerCase();
    const filtered = q
      ? categoriesWithBase.map((c) => ({
          ...c,
          modifiers: c.modifiers.filter((m) => m.desc.toLowerCase().includes(q))
        })).filter((c) => c.modifiers.length > 0)
      : categoriesWithBase;

    return groupedCategory(filtered);
  }, [baseType, itemRegexData, search]);

  const groupEntries = useMemo(() => {
    return Object.entries(groupedData).sort(([, a], [, b]) => categoryOrder(a[0], b[0]));
  }, [groupedData]);

  if (!baseType) {
    return <p className="text-sm text-zinc-400/60 italic">Select an item base to see available mods.</p>;
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search mods..."
          className="w-full bg-zinc-950/40 border border-white/5 rounded-lg text-sm py-1.5 pl-8 pr-3 text-zinc-100 placeholder:text-zinc-400/40 outline-none focus:border-indigo-500/40 transition-colors"
        />
      </div>

      {/* Category groups */}
      <div className="space-y-2">
        {groupEntries.map(([groupKey, cats]) => {
          const title = cleanCategoryName(cats[0]?.category || groupKey) || 'General';
          return (
            <CategorySection
              key={groupKey}
              title={title}
              categories={cats}
              selectedMods={selectedMods}
              onToggle={onToggle}
              onValueChange={onValueChange}
            />
          );
        })}
        {groupEntries.length === 0 && (
          <p className="text-sm text-zinc-400/60 italic">No mods found for this base type.</p>
        )}
      </div>
    </div>
  );
}
