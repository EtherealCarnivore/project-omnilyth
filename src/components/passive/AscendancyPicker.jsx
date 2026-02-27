/*
 * AscendancyPicker.jsx — Shows ascendancy options after class is selected.
 *
 * Displays 2-3 ascendancy options per class as small buttons.
 * Returns null if no class is selected.
 */

import { CLASS_INDEX } from '../../data/passive/passiveTreeConstants';

const ASCENDANCY_COLORS = {
  // Scion (0) - 1 ascendancy
  'Ascendant': 'bg-gray-700 hover:bg-gray-600 border-gray-500',

  // Marauder (1) - 3 ascendancies
  'Juggernaut': 'bg-red-700 hover:bg-red-600 border-red-500',
  'Berserker': 'bg-red-800 hover:bg-red-700 border-red-600',
  'Chieftain': 'bg-orange-700 hover:bg-orange-600 border-orange-500',

  // Ranger (2) - 3 ascendancies
  'Deadeye': 'bg-green-700 hover:bg-green-600 border-green-500',
  'Raider': 'bg-green-800 hover:bg-green-700 border-green-600',
  'Pathfinder': 'bg-teal-700 hover:bg-teal-600 border-teal-500',

  // Witch (3) - 3 ascendancies
  'Necromancer': 'bg-blue-700 hover:bg-blue-600 border-blue-500',
  'Elementalist': 'bg-blue-800 hover:bg-blue-700 border-blue-600',
  'Occultist': 'bg-purple-700 hover:bg-purple-600 border-purple-500',

  // Duelist (4) - 3 ascendancies
  'Slayer': 'bg-orange-700 hover:bg-orange-600 border-orange-500',
  'Gladiator': 'bg-orange-800 hover:bg-orange-700 border-orange-600',
  'Champion': 'bg-amber-700 hover:bg-amber-600 border-amber-500',

  // Templar (5) - 3 ascendancies
  'Inquisitor': 'bg-yellow-700 hover:bg-yellow-600 border-yellow-500',
  'Hierophant': 'bg-yellow-800 hover:bg-yellow-700 border-yellow-600',
  'Guardian': 'bg-amber-700 hover:bg-amber-600 border-amber-500',

  // Shadow (6) - 3 ascendancies
  'Assassin': 'bg-purple-700 hover:bg-purple-600 border-purple-500',
  'Saboteur': 'bg-purple-800 hover:bg-purple-700 border-purple-600',
  'Trickster': 'bg-indigo-700 hover:bg-indigo-600 border-indigo-500',
};

export default function AscendancyPicker({
  selectedClass,
  selectedAscendancy,
  onSelectAscendancy,
  classData,
}) {
  // Return null if no class selected
  if (selectedClass === null || selectedClass === undefined) {
    return null;
  }

  // Get ascendancy list for selected class
  const classInfo = classData?.[selectedClass];
  if (!classInfo || !classInfo.ascendancies || classInfo.ascendancies.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-sm text-gray-400">
          No ascendancies available for {CLASS_INDEX[selectedClass]}
        </div>
      </div>
    );
  }

  const ascendancies = classInfo.ascendancies;
  const className = CLASS_INDEX[selectedClass];

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-white mb-3">
        Select Ascendancy ({className})
      </h3>

      <div className="flex flex-wrap gap-2">
        {ascendancies.map(ascendancyName => {
          const isActive = selectedAscendancy === ascendancyName;
          const colors = ASCENDANCY_COLORS[ascendancyName] || 'bg-gray-700 hover:bg-gray-600 border-gray-500';

          return (
            <button
              key={ascendancyName}
              onClick={() => onSelectAscendancy(ascendancyName)}
              className={`
                px-3 py-2 rounded-lg font-semibold text-sm text-white transition-all
                ${colors}
                ${isActive
                  ? 'ring-4 ring-offset-2 ring-offset-gray-800 ring-white scale-105'
                  : 'opacity-75 hover:opacity-100'
                }
              `}
            >
              {ascendancyName}
            </button>
          );
        })}

        {/* Clear selection button */}
        {selectedAscendancy && (
          <button
            onClick={() => onSelectAscendancy(null)}
            className="px-3 py-2 rounded-lg font-semibold text-sm text-white
                       bg-gray-600 hover:bg-gray-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {selectedAscendancy && (
        <div className="mt-3 p-2 bg-gray-900 rounded text-sm text-gray-300">
          <span className="font-semibold text-white">{selectedAscendancy}</span> selected
        </div>
      )}
    </div>
  );
}
