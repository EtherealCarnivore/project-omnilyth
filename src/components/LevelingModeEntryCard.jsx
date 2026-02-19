/**
 * LevelingModeEntryCard
 * Dashboard card for entering Leveling Mode
 * Primary entry point for new users
 */

import { useNavigate } from 'react-router-dom';
import { useLevelingMode } from '../contexts/LevelingModeContext';

export default function LevelingModeEntryCard() {
  const navigate = useNavigate();
  const { enterLevelingMode } = useLevelingMode();

  const handleEnterMode = () => {
    enterLevelingMode();
    navigate('/leveling/mode');
  };

  return (
    <div className="group relative bg-gradient-to-br from-teal-500/20 to-teal-600/5 border border-teal-500/20 rounded-xl p-6 hover:border-teal-500/40 transition-all duration-300">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />

      <div className="relative space-y-4">
        {/* Icon and Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500/10 rounded-lg group-hover:bg-teal-500/20 transition-colors">
              <svg className="w-6 h-6 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-xs font-medium text-teal-400">
              New Feature
            </span>
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-lg font-bold text-teal-400 mb-2 group-hover:text-teal-300 transition-colors">
            🏃 Start Leveling Mode
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Track your progress through Acts 1-10 with quest checkboxes, zone tips, and quick access to essential leveling tools.
          </p>
        </div>

        {/* Features list */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <svg className="w-3.5 h-3.5 text-teal-500/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 11l3 3L22 4" />
            </svg>
            <span>Quest tracking</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <svg className="w-3.5 h-3.5 text-teal-500/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 11l3 3L22 4" />
            </svg>
            <span>Zone tips</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <svg className="w-3.5 h-3.5 text-teal-500/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 11l3 3L22 4" />
            </svg>
            <span>Vendor regex</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <svg className="w-3.5 h-3.5 text-teal-500/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 11l3 3L22 4" />
            </svg>
            <span>Gem helpers</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleEnterMode}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40"
        >
          <span>Enter Leveling Mode</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        <p className="text-xs text-zinc-600 text-center">
          Your progress is automatically saved • Exit anytime
        </p>
      </div>
    </div>
  );
}
