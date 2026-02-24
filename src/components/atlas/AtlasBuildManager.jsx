/*
 * AtlasBuildManager.jsx — Save/load/rename/delete builds + URL share.
 *
 * Builds are stored in localStorage via AtlasTreeContext.
 * Share button generates a URL with the tree encoded in the hash.
 */

import { useState } from 'react';
import { useAtlasTree } from '../../contexts/AtlasTreeContext';

export default function AtlasBuildManager() {
  const {
    builds,
    activeBuildId,
    saveBuild,
    updateBuild,
    loadBuild,
    deleteBuild,
    renameBuild,
    getCurrentHash,
    resetAllocations,
    allocated,
  } = useAtlasTree();

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    const name = newName.trim() || `Build ${builds.length + 1}`;
    saveBuild(name);
    setNewName('');
  };

  const handleShare = async () => {
    const hash = getCurrentHash();
    if (!hash) return;
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      prompt('Copy this URL:', url);
    }
  };

  const handleRename = (id) => {
    if (editName.trim()) {
      renameBuild(id, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="space-y-3">
      {/* Save new build */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="Build name..."
          className="flex-1 bg-zinc-900/80 border border-white/10 rounded-lg text-sm py-1.5 px-3 text-zinc-300 placeholder:text-zinc-500 outline-none focus:border-sky-400/30 transition-colors"
        />
        <button
          onClick={handleSave}
          disabled={allocated.size === 0}
          className="px-3 py-1.5 rounded-lg text-sm bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          disabled={allocated.size === 0}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {copied ? 'Copied!' : 'Share URL'}
        </button>
        <button
          onClick={resetAllocations}
          disabled={allocated.size === 0}
          className="px-3 py-1.5 rounded-lg text-sm bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Reset tree (R)"
        >
          Reset
        </button>
      </div>

      {/* Overwrite active build */}
      {activeBuildId && (
        <button
          onClick={() => updateBuild(activeBuildId)}
          className="w-full px-3 py-1.5 rounded-lg text-xs bg-zinc-800/50 border border-white/5 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300 transition-colors"
        >
          Overwrite "{builds.find(b => b.id === activeBuildId)?.name}"
        </button>
      )}

      {/* Saved builds list */}
      {builds.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-1">
            Saved Builds
          </div>
          {builds.map(build => (
            <div
              key={build.id}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                build.id === activeBuildId
                  ? 'bg-amber-400/10 border border-amber-500/20'
                  : 'hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              {editingId === build.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleRename(build.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onBlur={() => handleRename(build.id)}
                  autoFocus
                  className="flex-1 bg-zinc-900 border border-white/10 rounded px-2 py-0.5 text-xs text-zinc-300 outline-none"
                />
              ) : (
                <>
                  <button
                    onClick={() => loadBuild(build.id)}
                    className="flex-1 text-left text-zinc-300 hover:text-zinc-100 truncate"
                  >
                    {build.name}
                  </button>
                  <span className="text-[10px] text-zinc-500">{build.nodeCount}pts</span>
                  <button
                    onClick={() => { setEditingId(build.id); setEditName(build.name); }}
                    className="text-zinc-600 hover:text-zinc-300 p-0.5"
                    title="Rename"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteBuild(build.id)}
                    className="text-zinc-600 hover:text-red-400 p-0.5"
                    title="Delete"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
