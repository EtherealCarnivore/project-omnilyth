/**
 * ActChecklist - Checkable task list for current act
 *
 * @component
 */

import { useMemo } from 'react';
import { usePlaybook } from '../../../contexts/PlaybookContext';

/**
 * @typedef {Object} ActChecklistProps
 * @property {number} actNumber - Act number to display checklist for
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [groupByCategory] - Group items by category
 * @property {boolean} [showOnlyIncomplete] - Hide completed items
 */

export default function ActChecklist({
  actNumber,
  className = '',
  groupByCategory = true,
  showOnlyIncomplete = false
}) {
  const {
    currentPlaybook,
    toggleChecklistItem,
    isChecklistItemComplete
  } = usePlaybook();

  const actData = useMemo(() => {
    if (!currentPlaybook) return null;
    return currentPlaybook.acts.find(act => act.act === actNumber);
  }, [currentPlaybook, actNumber]);

  const groupedItems = useMemo(() => {
    if (!actData || !groupByCategory) {
      return { all: actData?.checklistItems || [] };
    }

    const groups = {};
    actData.checklistItems.forEach(item => {
      const category = item.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    return groups;
  }, [actData, groupByCategory]);

  const filteredGroups = useMemo(() => {
    if (!showOnlyIncomplete) return groupedItems;

    const filtered = {};
    Object.entries(groupedItems).forEach(([category, items]) => {
      const incompleteItems = items.filter(item => !isChecklistItemComplete(item.id));
      if (incompleteItems.length > 0) {
        filtered[category] = incompleteItems;
      }
    });

    return filtered;
  }, [groupedItems, showOnlyIncomplete, isChecklistItemComplete]);

  if (!actData) return null;

  const categoryLabels = {
    quest: 'Quests',
    gem: 'Gems',
    gear: 'Gear',
    level: 'Leveling',
    other: 'Other'
  };

  const categoryIcons = {
    quest: '📜',
    gem: '💎',
    gear: '⚔️',
    level: '📊',
    other: '📌'
  };

  return (
    <div className={`act-checklist ${className}`}>
      {Object.entries(filteredGroups).map(([category, items]) => (
        <div key={category} className="mb-6">
          {/* Category Header */}
          {groupByCategory && (
            <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
              <span>{categoryIcons[category]}</span>
              <span>{categoryLabels[category]}</span>
              <span className="text-xs text-zinc-600">
                ({items.filter(item => isChecklistItemComplete(item.id)).length}/{items.length})
              </span>
            </h3>
          )}

          {/* Checklist Items */}
          <div className="space-y-2">
            {items.map(item => (
              <ChecklistItem
                key={item.id}
                item={item}
                isComplete={isChecklistItemComplete(item.id)}
                onToggle={() => toggleChecklistItem(item.id)}
              />
            ))}
          </div>
        </div>
      ))}

      {Object.keys(filteredGroups).length === 0 && (
        <div className="text-center py-8 text-zinc-500">
          {showOnlyIncomplete
            ? 'All tasks completed!'
            : 'No checklist items for this act'
          }
        </div>
      )}
    </div>
  );
}

/**
 * ChecklistItem - Individual checklist item
 *
 * @typedef {Object} ChecklistItemProps
 * @property {Object} item - Checklist item data
 * @property {boolean} isComplete - Is item completed
 * @property {Function} onToggle - Callback when toggled
 */
function ChecklistItem({ item, isComplete, onToggle }) {
  return (
    <button
      role="checkbox"
      aria-checked={isComplete}
      aria-label={`${item.task}${item.required ? ' (required)' : ''}`}
      onClick={onToggle}
      className={`
        w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
        ${isComplete
          ? 'border-green-500/30 bg-green-500/5'
          : item.required
            ? 'border-red-500/30 bg-zinc-800/40 hover:bg-zinc-700/50'
            : 'border-white/[0.06] bg-zinc-900/60 hover:bg-zinc-700/50'
        }
      `}
    >
      {/* Checkbox */}
      <div className={`
        flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all
        ${isComplete
          ? 'border-green-500 bg-green-500'
          : 'border-zinc-600'
        }
      `}>
        {isComplete && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`
          text-sm transition-all
          ${isComplete
            ? 'text-zinc-500 line-through'
            : 'text-white'
          }
        `}>
          {item.task}
        </div>

        {/* Required Badge */}
        {item.required && !isComplete && (
          <div className="mt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">
              Required
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
