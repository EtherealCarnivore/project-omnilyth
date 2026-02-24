/*
 * AtlasSummaryPanel.jsx — "What your tree gives you" grouped by content type.
 *
 * Shows stat summary organized by Delirium, Harvest, Essence, etc.
 * Collapsible sections with stat counts.
 */

import { useState } from 'react';
import { useAtlasTree } from '../../contexts/AtlasTreeContext';

export default function AtlasSummaryPanel() {
  const { statSummary, allocated } = useAtlasTree();
  const [expanded, setExpanded] = useState({});

  const entries = Object.entries(statSummary);

  if (allocated.size === 0) {
    return (
      <div className="text-sm text-zinc-500 italic px-1">
        Click nodes on the tree to start building. Stats will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {entries.map(([contentType, stats]) => (
        <div key={contentType} className="border border-white/5 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(prev => ({ ...prev, [contentType]: !prev[contentType] }))}
            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-zinc-200 font-medium">{contentType}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                {stats.length}
              </span>
              <svg
                className={`w-3 h-3 text-zinc-500 transition-transform ${expanded[contentType] ? 'rotate-90' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
          {expanded[contentType] && (
            <div className="px-3 pb-2 space-y-1">
              {stats.map((stat, i) => (
                <div key={i} className="text-xs text-zinc-400 leading-tight pl-2 border-l border-white/5">
                  {stat}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
