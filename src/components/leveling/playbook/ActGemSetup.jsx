/**
 * ActGemSetup - Display gem progression for current act
 *
 * @component
 */

import { useMemo } from 'react';
import { usePlaybook } from '../../../contexts/PlaybookContext';

/**
 * @typedef {Object} ActGemSetupProps
 * @property {number} actNumber - Act number to display gems for
 * @property {string} [className] - Additional CSS classes
 */

export default function ActGemSetup({ actNumber, className = '' }) {
  const { currentPlaybook } = usePlaybook();

  const actData = useMemo(() => {
    if (!currentPlaybook) return null;
    return currentPlaybook.acts.find(act => act.act === actNumber);
  }, [currentPlaybook, actNumber]);

  if (!actData?.gems?.length) {
    return (
      <div className={`text-center py-8 text-zinc-500 ${className}`}>
        No gem recommendations for this act
      </div>
    );
  }

  const actionLabels = {
    start: 'Start Using',
    add: 'Add Support',
    switch: 'Switch Main Skill',
    prepare: 'Prepare for Later',
    remove: 'Remove',
    keystone: 'Keystone / Passive'
  };

  const actionColors = {
    start: 'bg-green-500/20 border-green-500/50 text-green-400',
    add: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    switch: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    prepare: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    remove: 'bg-red-500/20 border-red-500/50 text-red-400',
    keystone: 'bg-amber-500/20 border-amber-500/50 text-amber-400'
  };

  return (
    <div className={`act-gem-setup space-y-4 ${className}`}>
      {actData.gems.map((gemStep, index) => {
        const colorClass = actionColors[gemStep.action] || actionColors.add;

        return (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${colorClass}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs font-semibold text-zinc-400 mb-1">
                  LEVEL {gemStep.level}
                </div>
                <div className="font-bold text-white">
                  {actionLabels[gemStep.action] || gemStep.action}
                </div>
              </div>
            </div>

            {/* Gems */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-zinc-400 mb-2">
                GEMS
              </div>
              <div className="flex flex-wrap gap-2">
                {gemStep.gems.map((gem, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-900/50 border border-blue-700 text-blue-200 rounded text-sm font-medium"
                  >
                    {gem}
                  </span>
                ))}
              </div>
            </div>

            {/* Link Setup */}
            <div className="p-3 bg-zinc-950/50 rounded">
              <div className="text-xs font-semibold text-zinc-400 mb-1">
                LINK SETUP
              </div>
              <div className="text-sm text-white font-mono">
                {Array.isArray(gemStep.links) ? gemStep.links.join(' - ') : String(gemStep.links || '')}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
