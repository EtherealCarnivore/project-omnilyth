/*
 * MasteryModal.jsx — Modal overlay for selecting a mastery effect.
 *
 * Displays when a mastery node is clicked. Shows all available mastery effects
 * with radio-button selection. Includes a "Clear" button to remove selection.
 */

import { useState, useEffect } from 'react';

export default function MasteryModal({
  nodeId,
  node,
  masterySelections,
  onSelectMastery,
  onClose,
}) {
  const [selectedEffect, setSelectedEffect] = useState(null);

  // Load current selection on mount
  useEffect(() => {
    if (masterySelections && masterySelections[nodeId]) {
      setSelectedEffect(masterySelections[nodeId]);
    }
  }, [nodeId, masterySelections]);

  if (!node || !node.masteryEffects || node.masteryEffects.length === 0) {
    return null;
  }

  const handleSelect = (effect) => {
    setSelectedEffect(effect);
  };

  const handleConfirm = () => {
    if (selectedEffect) {
      onSelectMastery(nodeId, selectedEffect);
    }
    onClose();
  };

  const handleClear = () => {
    onSelectMastery(nodeId, null);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {node.name || `Mastery ${nodeId}`}
            </h2>
            <p className="text-sm text-gray-400 mt-1">Select one mastery effect</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-gray-400 hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Effect list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {node.masteryEffects.map((effect, idx) => {
            const isSelected = selectedEffect?.effect === effect.effect;
            const effectId = `effect-${nodeId}-${idx}`;

            return (
              <label
                key={effectId}
                htmlFor={effectId}
                className={`
                  block p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected
                    ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Radio button */}
                  <input
                    type="radio"
                    id={effectId}
                    name="mastery-effect"
                    checked={isSelected}
                    onChange={() => handleSelect(effect)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-900 border-gray-700
                               focus:ring-blue-500 focus:ring-2"
                  />

                  {/* Effect content */}
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-2">
                      {effect.effect || 'Effect ' + (idx + 1)}
                    </div>

                    {/* Stats */}
                    {effect.stats && effect.stats.length > 0 && (
                      <div className="space-y-1">
                        {effect.stats.map((stat, statIdx) => (
                          <div
                            key={statIdx}
                            className={`text-sm ${isSelected ? 'text-blue-200' : 'text-gray-300'}`}
                          >
                            {stat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold
                       text-white transition-colors"
          >
            Clear Selection
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold
                         text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedEffect}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600
                         disabled:cursor-not-allowed rounded-lg font-semibold text-white
                         transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
