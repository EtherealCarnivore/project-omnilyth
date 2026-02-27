/*
 * ClassSelector.jsx — Horizontal row of 7 class buttons.
 *
 * Allows selection of character class (Scion, Marauder, Ranger, Witch, Duelist, Templar, Shadow).
 * Active class gets highlighted border.
 */

import { CLASS_INDEX } from '../../data/passive/passiveTreeConstants';

const CLASS_COLORS = {
  0: { bg: 'bg-gray-700', border: 'border-gray-500', hover: 'hover:bg-gray-600' },      // Scion
  1: { bg: 'bg-red-700', border: 'border-red-500', hover: 'hover:bg-red-600' },         // Marauder
  2: { bg: 'bg-green-700', border: 'border-green-500', hover: 'hover:bg-green-600' },   // Ranger
  3: { bg: 'bg-blue-700', border: 'border-blue-500', hover: 'hover:bg-blue-600' },      // Witch
  4: { bg: 'bg-orange-700', border: 'border-orange-500', hover: 'hover:bg-orange-600' }, // Duelist
  5: { bg: 'bg-yellow-700', border: 'border-yellow-500', hover: 'hover:bg-yellow-600' }, // Templar
  6: { bg: 'bg-purple-700', border: 'border-purple-500', hover: 'hover:bg-purple-600' }, // Shadow
};

export default function ClassSelector({ selectedClass, onSelectClass }) {
  const classes = [0, 1, 2, 3, 4, 5, 6]; // All class indices

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-white mb-3">Select Class</h3>
      <div className="flex flex-wrap gap-2">
        {classes.map(classIndex => {
          const className = CLASS_INDEX[classIndex];
          const colors = CLASS_COLORS[classIndex];
          const isActive = selectedClass === classIndex;

          return (
            <button
              key={classIndex}
              onClick={() => onSelectClass(classIndex)}
              className={`
                px-4 py-2 rounded-lg font-semibold text-white transition-all
                ${colors.bg} ${colors.hover}
                ${isActive
                  ? `ring-4 ring-offset-2 ring-offset-gray-800 ${colors.border.replace('border-', 'ring-')} scale-105`
                  : 'opacity-75 hover:opacity-100'
                }
              `}
            >
              {className}
            </button>
          );
        })}
      </div>

      {selectedClass !== null && (
        <div className="mt-3 p-2 bg-gray-900 rounded text-sm text-gray-300">
          <span className="font-semibold text-white">{CLASS_INDEX[selectedClass]}</span> selected
        </div>
      )}
    </div>
  );
}
