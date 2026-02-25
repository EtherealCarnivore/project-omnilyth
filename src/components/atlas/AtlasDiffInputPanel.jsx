/*
 * AtlasDiffInputPanel.jsx — Input panel for the atlas tree diff tool.
 *
 * Two textareas for target and your tree, auto-detect badges,
 * compare/clear buttons, and summary counters after diff.
 */

import { useAtlasDiff } from '../../contexts/AtlasDiffContext';

const TYPE_LABELS = {
  ggg: { text: 'GGG URL', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  omnilyth: { text: 'Omnilyth', color: 'text-sky-400 bg-sky-400/10 border-sky-400/20' },
  raw: { text: 'Raw Hash', color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' },
  unknown: { text: '', color: '' },
};

function DetectBadge({ type }) {
  const label = TYPE_LABELS[type];
  if (!label?.text) return null;
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${label.color}`}>
      {label.text}
    </span>
  );
}

export default function AtlasDiffInputPanel() {
  const {
    targetInput, setTargetInput,
    yourInput, setYourInput,
    targetDetected, yourDetected,
    diffResult, error,
    compare, clear,
  } = useAtlasDiff();

  const hasInputs = targetInput.trim() && yourInput.trim();

  return (
    <div className="space-y-4">
      {/* Target Tree */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-zinc-300">Target Tree</label>
          <DetectBadge type={targetDetected.type} />
        </div>
        <textarea
          value={targetInput}
          onChange={e => setTargetInput(e.target.value)}
          placeholder="Paste URL or hash of the tree to copy..."
          className="w-full h-20 bg-zinc-800/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-sky-500/40 focus:outline-none resize-none font-mono"
          spellCheck={false}
        />
        <p className="text-[10px] text-zinc-600 mt-0.5">The tree you want to match</p>
      </div>

      {/* Your Tree */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-zinc-300">Your Tree</label>
          <DetectBadge type={yourDetected.type} />
        </div>
        <textarea
          value={yourInput}
          onChange={e => setYourInput(e.target.value)}
          placeholder="Paste URL or hash of your current tree..."
          className="w-full h-20 bg-zinc-800/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-sky-500/40 focus:outline-none resize-none font-mono"
          spellCheck={false}
        />
        <p className="text-[10px] text-zinc-600 mt-0.5">Your current in-game tree</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950/50 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={compare}
          disabled={!hasInputs}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            hasInputs
              ? 'bg-sky-600 hover:bg-sky-500 text-white'
              : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
          }`}
        >
          Compare
        </button>
        <button
          onClick={clear}
          className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Summary counters */}
      {diffResult && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-lg px-2 py-2 text-center">
            <div className="text-lg font-bold text-amber-400">{diffResult.matching.size}</div>
            <div className="text-[10px] text-amber-400/70">Matching</div>
          </div>
          <div className="bg-green-400/5 border border-green-400/20 rounded-lg px-2 py-2 text-center">
            <div className="text-lg font-bold text-green-400">{diffResult.toAdd.size}</div>
            <div className="text-[10px] text-green-400/70">To Add</div>
          </div>
          <div className="bg-red-400/5 border border-red-400/20 rounded-lg px-2 py-2 text-center">
            <div className="text-lg font-bold text-red-400">{diffResult.toRemove.size}</div>
            <div className="text-[10px] text-red-400/70">To Remove</div>
          </div>
        </div>
      )}
    </div>
  );
}
