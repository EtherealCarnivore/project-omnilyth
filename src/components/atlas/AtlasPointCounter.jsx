/*
 * AtlasPointCounter.jsx — Points display with Full Atlas / Custom toggle.
 *
 * Shows allocated/max points with a progress bar. User can select "Full Atlas"
 * (132 points, fully unlocked) or enter a custom value (0–132).
 */

import { useState, useCallback } from 'react';
import { useAtlasTree } from '../../contexts/AtlasTreeContext';

export default function AtlasPointCounter() {
  const { allocated, maxPoints, setMaxPoints } = useAtlasTree();
  const [mode, setMode] = useState('full'); // 'full' or 'custom'
  const [customInput, setCustomInput] = useState('');

  const used = allocated.size;
  const pct = maxPoints > 0 ? Math.round((used / maxPoints) * 100) : 0;
  const overLimit = used > maxPoints;

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    if (newMode === 'full') {
      setMaxPoints(132);
      setCustomInput('');
    }
  }, [setMaxPoints]);

  const handleCustomInput = useCallback((e) => {
    const raw = e.target.value;
    // Allow empty input while typing
    if (raw === '') {
      setCustomInput('');
      return;
    }
    const num = parseInt(raw, 10);
    if (isNaN(num)) return;
    const clamped = Math.max(0, Math.min(132, num));
    setCustomInput(String(clamped));
    setMaxPoints(clamped);
  }, [setMaxPoints]);

  return (
    <div className="space-y-2">
      {/* Mode toggle */}
      <div className="flex gap-1.5">
        <button
          onClick={() => handleModeChange('full')}
          className={`flex-1 px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
            mode === 'full'
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-zinc-800/50 border-white/10 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Full Atlas
        </button>
        <button
          onClick={() => handleModeChange('custom')}
          className={`flex-1 px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
            mode === 'custom'
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-zinc-800/50 border-white/10 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Custom
        </button>
      </div>

      {/* Custom point input */}
      {mode === 'custom' && (
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-zinc-500">Max pts:</label>
          <input
            type="number"
            min={0}
            max={132}
            value={customInput}
            onChange={handleCustomInput}
            placeholder="0–132"
            className="flex-1 px-2 py-0.5 rounded bg-zinc-800 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      )}

      {/* Points used / total + progress bar */}
      <div className="flex items-center gap-3">
        <div className="text-sm font-medium text-zinc-100">
          <span className={overLimit ? 'text-red-400' : 'text-amber-400'}>{used}</span>
          <span className="text-zinc-500"> / {maxPoints}</span>
        </div>
        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden min-w-[60px]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${overLimit ? 'bg-red-500' : 'bg-amber-500'}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      {/* Over-limit warning */}
      {overLimit && (
        <div className="text-[10px] text-red-400">
          {used - maxPoints} point{used - maxPoints !== 1 ? 's' : ''} over limit
        </div>
      )}
    </div>
  );
}
