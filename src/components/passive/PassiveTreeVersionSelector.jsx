/*
 * PassiveTreeVersionSelector.jsx — Patch version toggle for the passive tree.
 *
 * Compact pill selector that lets users switch between tree versions (e.g. 3.27, 3.28).
 * Shows a confirmation dialog warning that switching resets the current build.
 */

import { useState } from 'react';
import { usePassiveTree } from '../../contexts/PassiveTreeContext';
import { AVAILABLE_VERSIONS } from '../../hooks/usePassiveTreeData';

export default function PassiveTreeVersionSelector() {
  const { treeVersion, setTreeVersion } = usePassiveTree();
  const [pendingVersion, setPendingVersion] = useState(null);

  const handleVersionClick = (version) => {
    if (version === treeVersion) return;
    setPendingVersion(version);
  };

  const confirmSwitch = () => {
    if (pendingVersion) {
      setTreeVersion(pendingVersion);
      setPendingVersion(null);
    }
  };

  const cancelSwitch = () => {
    setPendingVersion(null);
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">Patch</span>
        <div className="flex gap-1">
          {AVAILABLE_VERSIONS.map((version, i) => (
            <button
              key={version}
              onClick={() => handleVersionClick(version)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                treeVersion === version
                  ? 'bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/50'
                  : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700/70 hover:text-zinc-300'
              }`}
            >
              {version}
              {i === 0 && treeVersion === version && (
                <span className="ml-1 text-[9px] text-teal-500/70">new</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation dialog */}
      {pendingVersion && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-white/10 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h3 className="text-base font-semibold text-zinc-100">Switch to {pendingVersion} tree?</h3>
            </div>

            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-zinc-300">
                Loading the <span className="font-semibold text-amber-400">{pendingVersion}</span> passive tree will reset your current build allocations.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2.5">
                <div className="flex gap-2">
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-xs text-amber-300">
                    All allocated nodes will be cleared. Save your build URL first if you want to restore it later.
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 bg-zinc-950/50 border-t border-white/5 flex justify-end gap-2">
              <button
                onClick={cancelSwitch}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitch}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 hover:border-amber-500/50 transition-colors"
              >
                Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
