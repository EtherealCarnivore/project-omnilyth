import { useState, useMemo, useCallback, useRef } from 'react';
import { itemRegex } from '../data/itemMods';
import { magicItemGroups } from '../data/magicItemMods';
import { generateRareItemRegex, generateMagicItemRegex } from '../calculators/itemRegex';
import ItemBaseSelector from './ItemBaseSelector';
import RareModSelect from './RareModSelect';
import MagicModSelect from './MagicModSelect';

// Base types that don't support magic affixes (force Rare)
const RARE_ONLY_PATTERNS = ['blueprint', 'contract', 'heist'];

function isRareOnly(baseType) {
  if (!baseType) return false;
  const lower = baseType.toLowerCase();
  return RARE_ONLY_PATTERNS.some((p) => lower.includes(p));
}

// Find the magic item group key that matches a basetype from basetypes data
function findMagicGroupKey(baseType) {
  if (!baseType) return null;
  // Direct match
  if (magicItemGroups[baseType]) return baseType;
  // Try matching base equipment categories to their attribute variants
  const equipTypes = ['Shields', 'Gloves', 'Boots', 'Body Armours', 'Helmets'];
  for (const eq of equipTypes) {
    if (baseType === eq) {
      // Find any variant that exists
      const variants = Object.keys(magicItemGroups).filter((k) => k.startsWith(eq));
      if (variants.length > 0) return variants[0];
    }
  }
  return null;
}

export default function ItemRegexCalculator() {
  const [itembase, setItembase] = useState(null);
  const [rarity, setRarity] = useState('Rare');
  const [selectedRareMods, setSelectedRareMods] = useState({});
  const [selectedMagicMods, setSelectedMagicMods] = useState([]);
  const [rareSettings, setRareSettings] = useState({ matchAnyMod: true, includeBaseName: true });
  const [magicSettings, setMagicSettings] = useState({ matchOpenAffix: false, onlyIfBothPrefixAndSuffix: false });
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  // Build affixMap for rare mode
  const affixMap = useMemo(() => {
    const map = {};
    for (const [baseKey, data] of Object.entries(itemRegex)) {
      for (const cat of data.categoryRegex) {
        for (const mod of cat.modifiers) {
          const key = `${data.basetype}-${cat.category}-${mod.desc}`;
          map[key] = mod;
        }
      }
    }
    return map;
  }, []);

  // Determine effective rarity
  const effectiveRarity = isRareOnly(itembase?.baseType) ? 'Rare' : rarity;

  // Find magic group key for current base
  const magicGroupKey = useMemo(() => findMagicGroupKey(itembase?.baseType), [itembase?.baseType]);
  const hasMagicData = !!magicGroupKey;

  // Generate result
  const result = useMemo(() => {
    if (!itembase) return '';

    if (effectiveRarity === 'Rare') {
      return generateRareItemRegex(affixMap, {
        itembase,
        selectedRareMods,
        rareSettings,
      });
    } else {
      return generateMagicItemRegex({
        itembase: { ...itembase, baseType: magicGroupKey || itembase.baseType },
        selectedMagicMods,
        magicSettings,
      });
    }
  }, [itembase, effectiveRarity, affixMap, selectedRareMods, rareSettings, selectedMagicMods, magicSettings, magicGroupKey]);

  const charCount = result.length;
  const charColor = charCount > 250 ? 'text-red-400' : charCount > 200 ? 'text-yellow-400' : 'text-green-400';
  const barWidth = Math.min((charCount / 250) * 100, 100);
  const barColor = charCount > 250 ? 'bg-red-500' : charCount > 200 ? 'bg-yellow-500' : 'bg-indigo-500';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [result]);

  const handleRareToggle = useCallback((modKey) => {
    setSelectedRareMods((prev) => ({
      ...prev,
      [modKey]: {
        selected: !prev[modKey]?.selected,
        values: prev[modKey]?.values || {},
      },
    }));
  }, []);

  const handleRareValueChange = useCallback((modKey, idx, value) => {
    setSelectedRareMods((prev) => ({
      ...prev,
      [modKey]: {
        ...prev[modKey],
        selected: prev[modKey]?.selected ?? true,
        values: { ...prev[modKey]?.values, [idx]: value },
      },
    }));
  }, []);

  const handleMagicToggle = useCallback((modInfo) => {
    setSelectedMagicMods((prev) => {
      const exists = prev.findIndex(
        (s) => s.basetype === modInfo.basetype && s.regex.desc === modInfo.regex.desc && s.affix === modInfo.affix
      );
      if (exists >= 0) {
        return prev.filter((_, i) => i !== exists);
      }
      return [...prev, modInfo];
    });
  }, []);

  const handleRarityChange = useCallback((r) => {
    setRarity(r);
  }, []);

  const handleBaseChange = useCallback((base) => {
    setItembase(base);
    // Don't clear mod selections — they're keyed by basetype so irrelevant ones are ignored
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-indigo-300">Item Mod Regex Generator</h2>
        <p className="text-sm text-zinc-400 mt-1">Generate regex patterns to find items with specific mods in stash tabs.</p>
      </div>

      {/* Result Box */}
      <div ref={resultRef} className="fade-in rounded-xl bg-zinc-950/50 border border-white/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">Output</h3>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono tabular-nums ${charColor}`}>
              {charCount}<span className="text-zinc-400/60">/250</span>
            </span>
            <button
              onClick={handleCopy}
              disabled={!result}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                copied
                  ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 border border-white/5 hover:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-zinc-100 break-all min-h-[2.5rem] select-all leading-relaxed">
          {result ? <span key={result} className="fade-in inline-block">{result}</span> : <span className="text-zinc-400/50 italic font-sans">Select a base and mods to generate regex...</span>}
        </div>
        <div className="mt-2 h-1 rounded-full bg-zinc-950/80 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${charCount > 250 ? 'max-h-10 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          <p className="text-xs text-red-400/90">Regex exceeds PoE's 250-character limit. Remove some mods.</p>
        </div>
      </div>

      {/* Base Selector */}
      <div className="fade-in rounded-xl bg-zinc-950/30 border border-white/5 p-4">
        <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-3">Item Base</h3>
        <ItemBaseSelector
          value={itembase}
          onChange={handleBaseChange}
          rarity={effectiveRarity}
          onRarityChange={handleRarityChange}
        />
        {isRareOnly(itembase?.baseType) && (
          <p className="text-xs text-zinc-400/60 mt-2 italic">This base type only supports rare affix matching.</p>
        )}
        {effectiveRarity === 'Magic' && !hasMagicData && itembase && (
          <p className="text-xs text-amber-300/80 mt-2">No magic affix data available for {itembase.baseType}. Try Rare mode.</p>
        )}
      </div>

      {/* Settings */}
      <div className="fade-in rounded-xl bg-zinc-950/30 border border-white/5 p-4">
        <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-3">Settings</h3>
        {effectiveRarity === 'Rare' ? (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rareSettings.includeBaseName}
                onChange={(e) => setRareSettings((s) => ({ ...s, includeBaseName: e.target.checked }))}
                className="accent-indigo-400 w-3.5 h-3.5"
              />
              Include Base Name (adds item name as a search term)
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rareSettings.matchAnyMod}
                onChange={(e) => setRareSettings((s) => ({ ...s, matchAnyMod: e.target.checked }))}
                className="accent-indigo-400 w-3.5 h-3.5"
              />
              Match Any Mod (OR join — otherwise each mod is a separate search term)
            </label>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={magicSettings.matchOpenAffix}
                onChange={(e) => setMagicSettings((s) => ({ ...s, matchOpenAffix: e.target.checked }))}
                className="accent-indigo-400 w-3.5 h-3.5"
              />
              Match Open Affix (also match items missing a prefix or suffix)
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={magicSettings.onlyIfBothPrefixAndSuffix}
                onChange={(e) => setMagicSettings((s) => ({ ...s, onlyIfBothPrefixAndSuffix: e.target.checked }))}
                className="accent-indigo-400 w-3.5 h-3.5"
              />
              Both Prefix & Suffix Required (item must have both selected prefix and suffix)
            </label>
          </div>
        )}
      </div>

      {/* Mod Selection */}
      {effectiveRarity === 'Rare' ? (
        <div key="rare" className="fade-in rounded-xl bg-zinc-950/30 border border-white/5 p-4">
          <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-3">Rare Mods</h3>
          <RareModSelect
            baseType={itembase?.baseType}
            itemRegexData={itemRegex}
            selectedMods={selectedRareMods}
            onToggle={handleRareToggle}
            onValueChange={handleRareValueChange}
          />
        </div>
      ) : (
        <div key="magic" className="fade-in rounded-xl bg-zinc-950/30 border border-white/5 p-4">
          <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-3">Magic Affixes</h3>
          <MagicModSelect
            baseType={magicGroupKey || itembase?.baseType}
            selectedMods={selectedMagicMods}
            onToggle={handleMagicToggle}
          />
        </div>
      )}
    </div>
  );
}
