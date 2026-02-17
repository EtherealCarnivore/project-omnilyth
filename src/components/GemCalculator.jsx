import { useState, useMemo, useCallback } from 'react';
import { skillGemList, supportGemList, allGems } from '../data/gemData';
import { generateGemRegexes } from '../calculators/gemRegex';
import SaveRegexButton from './SaveRegexButton';

const allGemList = [...skillGemList, ...supportGemList];

function RegexOutputBox({ regex, index, total }) {
  const [copied, setCopied] = useState(false);
  const charCount = regex.length;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(regex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [regex]);

  const charColor = charCount > 250 ? 'text-red-400' : charCount > 200 ? 'text-yellow-400' : 'text-green-400';
  const barWidth = Math.min((charCount / 250) * 100, 100);
  const barColor = charCount > 250 ? 'bg-red-500' : charCount > 200 ? 'bg-yellow-500' : 'bg-teal-500';

  return (
    <div className="rounded-xl bg-zinc-950/50 border border-white/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-teal-300 uppercase tracking-widest">
          {total > 1 ? `Output ${index + 1} of ${total}` : 'Output'}
        </h3>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono tabular-nums ${charColor}`}>
            {charCount}<span className="text-zinc-400/60">/250</span>
          </span>
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              copied
                ? 'bg-teal-500/30 text-teal-200 border border-teal-400/40'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-white/5 hover:border-white/10'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {regex && (
            <SaveRegexButton
              pattern={regex}
              toolId="gem-regex"
              toolLabel="Gem Regex"
              variant="compact"
            />
          )}
        </div>
      </div>
      <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-zinc-100 break-all min-h-[2.5rem] select-all leading-relaxed">
        {regex}
      </div>
      <div className="mt-2 h-1 rounded-full bg-zinc-950/80 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}

const TABS = [
  { key: 'skill', label: 'Skill Gems' },
  { key: 'support', label: 'Support Gems' },
  { key: 'all', label: 'All' },
];

export default function GemCalculator() {
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('skill');
  const [strictAwakened, setStrictAwakened] = useState(false);

  const regexes = useMemo(
    () => generateGemRegexes([...selected], { useStrictAwakened: strictAwakened }),
    [selected, strictAwakened],
  );

  const toggleGem = useCallback((name) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setSelected(new Set());
    setSearch('');
  }, []);

  const baseList = activeTab === 'skill' ? skillGemList
    : activeTab === 'support' ? supportGemList
    : allGemList;

    // thank god we can atleast use functional stuff, bruuuuuh
  const sortedGems = useMemo(() => {
    const filtered = search.length >= 2
      ? baseList.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
      : baseList;
    return [...filtered].sort((a, b) => {
      const sa = selected.has(a.name) ? 0 : 1;
      const sb = selected.has(b.name) ? 0 : 1;
      if (sa !== sb) return sa - sb;
      return a.name.localeCompare(b.name);
    });
  }, [search, selected, baseList]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-teal-300">Gem Regex Generator</h2>
        <p className="text-sm text-zinc-400 mt-1">Select skill gems to generate a stash search regex.</p>
      </div>

      {/* Output Box(es) */}
      {regexes.length === 0 ? (
        <div className="rounded-xl bg-zinc-950/50 border border-white/5 p-4">
          <h3 className="text-xs font-semibold text-teal-300 uppercase tracking-widest mb-3">Output</h3>
          <div className="bg-black/30 rounded-lg p-3 font-mono text-sm min-h-[2.5rem] leading-relaxed">
            <span className="text-zinc-400/50 italic font-sans">Select gems below to generate regex...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {regexes.map((r, i) => (
            <RegexOutputBox key={i} regex={r} index={i} total={regexes.length} />
          ))}
          {regexes.length > 1 && (
            <p className="text-xs text-zinc-400">
              Selection requires {regexes.length} searches. Copy and paste each regex into your stash separately.
            </p>
          )}
        </div>
      )}

      {/* Controls Row */}
      <div className="rounded-xl bg-zinc-950/30 border border-white/5 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Tabs */}
          <div className="flex rounded-lg overflow-hidden border border-white/5">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-white/5 hover:border-white/10 transition-colors"
          >
            Reset
          </button>
          <span className="text-xs text-zinc-500">{selected.size} selected</span>

          {/* Strict awakened regex toggle — only relevant when support/all tabs visible */}
          {activeTab !== 'skill' && (
            <button
              onClick={() => setStrictAwakened(prev => !prev)}
              title={strictAwakened
                ? 'Awakened gems use longer awa.+name.+support patterns (stash-safe, won\'t match item mods)'
                : 'Awakened gems use short tokens (compact but may match item mods in stash)'}
              className={`ml-auto flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                strictAwakened
                  ? 'bg-teal-500/10 text-teal-300 border-teal-400/30'
                  : 'bg-zinc-900/80 text-zinc-400 border-white/5 hover:border-white/10'
              }`}
            >
              <span className={`inline-block w-7 h-4 rounded-full relative transition-colors ${
                strictAwakened ? 'bg-teal-500/40' : 'bg-zinc-700'
              }`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${
                  strictAwakened ? 'left-3.5 bg-teal-400' : 'left-0.5 bg-zinc-400'
                }`} />
              </span>
              Strict Awakened
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search gems..."
          className="calc-input text-sm py-2 px-4 w-full sm:w-72"
        />
      </div>

      {/* Gem Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sortedGems.map(gem => {
          const isSelected = selected.has(gem.name);
          return (
            <button
              key={gem.name}
              onClick={() => toggleGem(gem.name)}
              className={`group relative flex items-start gap-2.5 p-3 rounded-xl text-left transition-all duration-150 ${
                isSelected
                  ? 'bg-teal-500/15 ring-1 ring-teal-400/40'
                  : 'bg-zinc-950/30 hover:bg-white/[0.04] border border-white/5'
              }`}
            >
              <img
                src={gem.icon}
                alt=""
                className="w-8 h-8 shrink-0 mt-0.5"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] leading-snug text-zinc-200 group-hover:text-zinc-50 transition-colors">
                  {gem.name}
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
