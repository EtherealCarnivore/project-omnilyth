/*
 * PassiveBuildManager.jsx — Save/load/rename/delete builds.
 *
 * Manages build presets: save current allocation, load saved builds,
 * rename, delete, and share builds via URL hash.
 */

import { useState } from 'react';

export default function PassiveBuildManager({
  builds,
  activeBuildId,
  onSaveBuild,
  onUpdateBuild,
  onLoadBuild,
  onDeleteBuild,
  onRenameBuild,
  getCurrentHash,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [buildName, setBuildName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSave = () => {
    if (!buildName.trim()) return;

    if (editingId) {
      // Update existing build
      onUpdateBuild(editingId, { name: buildName });
      setEditingId(null);
    } else {
      // Save new build
      onSaveBuild(buildName.trim());
    }

    setBuildName('');
    setShowSaveInput(false);
  };

  const handleRename = (buildId, currentName) => {
    setEditingId(buildId);
    setBuildName(currentName);
    setShowSaveInput(true);
  };

  const handleCancel = () => {
    setBuildName('');
    setShowSaveInput(false);
    setEditingId(null);
  };

  const handleShare = async () => {
    const hash = getCurrentHash();
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback: show prompt
      prompt('Copy this URL:', url);
    }
  };

  const buildList = Object.entries(builds || {});

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">Build Manager</h3>
        <button
          onClick={() => setShowSaveInput(!showSaveInput)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold
                     text-white transition-colors"
        >
          {showSaveInput ? 'Cancel' : 'Save Current'}
        </button>
      </div>

      {/* Save input */}
      {showSaveInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={buildName}
            onChange={(e) => setBuildName(e.target.value)}
            placeholder="Enter build name..."
            className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2
                       focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={handleSave}
            disabled={!buildName.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600
                       disabled:cursor-not-allowed rounded text-sm font-semibold text-white
                       transition-colors"
          >
            {editingId ? 'Update' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm
                       font-semibold text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600
                   hover:bg-purple-700 rounded text-sm font-semibold text-white
                   transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {copySuccess ? 'URL Copied!' : 'Share Build URL'}
      </button>

      {/* Build list */}
      {buildList.length > 0 ? (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-400">Saved Builds</div>
          {buildList.map(([buildId, build]) => {
            const isActive = buildId === activeBuildId;
            return (
              <div
                key={buildId}
                className={`flex items-center justify-between p-2 rounded
                           ${isActive ? 'bg-blue-900 border border-blue-600' : 'bg-gray-900'}`}
              >
                <div className="flex-1">
                  <div className={`font-semibold ${isActive ? 'text-blue-300' : 'text-white'}`}>
                    {build.name}
                    {isActive && <span className="ml-2 text-xs">(Active)</span>}
                  </div>
                  <div className="text-xs text-gray-400">
                    {build.allocatedCount || 0} nodes allocated
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onLoadBuild(buildId)}
                    disabled={isActive}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600
                               disabled:cursor-not-allowed rounded text-xs font-semibold
                               text-white transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleRename(buildId, build.name)}
                    className="px-2 py-1 bg-amber-600 hover:bg-amber-700 rounded text-xs
                               font-semibold text-white transition-colors"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete build "${build.name}"?`)) {
                        onDeleteBuild(buildId);
                      }
                    }}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs
                               font-semibold text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-400 text-sm py-4">
          No saved builds yet
        </div>
      )}
    </div>
  );
}
