/**
 * ClassSelector
 * Dropdown for selecting character class (Witch, Shadow, Ranger, etc.)
 * Selection is persisted in localStorage and updates LevelingModeContext
 */

import { useLevelingMode } from '../../contexts/LevelingModeContext';

const CLASSES = [
  { id: 'witch', name: 'Witch' },
  { id: 'shadow', name: 'Shadow' },
  { id: 'ranger', name: 'Ranger' },
  { id: 'duelist', name: 'Duelist' },
  { id: 'marauder', name: 'Marauder' },
  { id: 'templar', name: 'Templar' },
  { id: 'scion', name: 'Scion' },
  { id: 'all', name: 'All Classes' }
];

export default function ClassSelector() {
  const { selectedClass, setSelectedClass } = useLevelingMode();

  const handleClassChange = (event) => {
    const newClass = event.target.value;
    setSelectedClass(newClass);
  };

  return (
    <div className="class-selector">
      <label htmlFor="class-select" className="sr-only">
        Select Character Class
      </label>
      <select
        id="class-select"
        value={selectedClass}
        onChange={handleClassChange}
        className="w-full px-3 py-2 text-sm bg-zinc-900/60 border border-white/[0.06] rounded-lg text-zinc-300 hover:border-amber-500/30 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-colors"
      >
        {CLASSES.map(cls => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>
    </div>
  );
}
