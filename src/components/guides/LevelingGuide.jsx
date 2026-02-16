/**
 * Leveling Guide - Act-by-act walkthrough with progress tracking
 */

import { useState, useEffect } from 'react';
import { useLevelingProgress } from '../../contexts/LevelingProgressContext';
import levelingData from '../../data/guides/leveling-structured.json';

const LevelingGuide = () => {
  const [expandedAct, setExpandedAct] = useState(null);
  const {
    isZoneCompleted,
    isActCompleted,
    toggleZone,
    markActCompleted,
    markActIncomplete,
    getOverallProgress,
    getNextIncompleteZone,
    resetProgress
  } = useLevelingProgress();

  const overallProgress = getOverallProgress(levelingData);
  const nextZone = getNextIncompleteZone(levelingData);

  // Auto-expand the act with the next incomplete zone
  useEffect(() => {
    if (nextZone && expandedAct === null) {
      setExpandedAct(nextZone.act);
    }
  }, [nextZone, expandedAct]);

  const handleActToggle = (actNum, totalZones) => {
    const completed = isActCompleted(actNum, totalZones);
    if (completed) {
      markActIncomplete(actNum);
    } else {
      markActCompleted(actNum, totalZones);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Overall Progress Bar */}
      <div className="bg-black/30 border border-amber-500/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white font-medium">Overall Progress</div>
          <div className="text-amber-400 font-mono text-sm">
            {overallProgress.completedZones}/{overallProgress.totalZones} zones
          </div>
        </div>
        <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300"
            style={{ width: `${overallProgress.percentage}%` }}
          />
        </div>
        <div className="text-amber-400 text-xs text-center mt-1">
          {overallProgress.percentage}% Complete
        </div>

        {/* Next Zone Indicator */}
        {nextZone && (
          <div className="mt-3 pt-3 border-t border-amber-500/10">
            <div className="text-white/70 text-sm">
              <span className="text-amber-400">▶ Continue:</span> Act {nextZone.act} - {nextZone.zoneName}
            </div>
          </div>
        )}

        {/* Reset Button */}
        {overallProgress.completedZones > 0 && (
          <div className="mt-3 pt-3 border-t border-amber-500/10">
            <button
              onClick={resetProgress}
              className="w-full px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded transition-colors"
            >
              Reset All Progress
            </button>
          </div>
        )}
      </div>

      <div className="text-white/70 text-sm">
        📖 Complete walkthrough for leveling 1-100. Click acts to expand.
      </div>

      {levelingData.map(act => {
        const actCompleted = isActCompleted(act.act, act.zones.length);
        const completedZonesCount = act.zones.filter((_, idx) =>
          isZoneCompleted(act.act, idx)
        ).length;

        return (
          <div
            key={act.act}
            className={`border rounded-lg overflow-hidden transition-all ${
              actCompleted
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-amber-500/20'
            }`}
          >
            {/* Act header */}
            <div className="flex items-center bg-gradient-to-r from-amber-900/30 to-amber-800/30">
              {/* Mark Act Complete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleActToggle(act.act, act.zones.length);
                }}
                className={`px-3 py-3 hover:bg-white/10 transition-colors ${
                  actCompleted ? 'text-green-400' : 'text-white/40'
                }`}
                title={actCompleted ? 'Mark act incomplete' : 'Mark act complete'}
              >
                {actCompleted ? '✓' : '○'}
              </button>

              {/* Act expand/collapse button */}
              <button
                onClick={() => setExpandedAct(expandedAct === act.act ? null : act.act)}
                className="flex-1 px-4 py-3 hover:bg-white/5 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold text-lg ${
                      actCompleted ? 'text-green-400 line-through' : 'text-amber-400'
                    }`}
                  >
                    Act {act.act}
                  </span>
                  <span className="text-white/50 text-sm">
                    ({completedZonesCount}/{act.zones.length} zones)
                  </span>
                  {actCompleted && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                      Complete
                    </span>
                  )}
                </div>
                <span className="text-amber-400">
                  {expandedAct === act.act ? '▼' : '▶'}
                </span>
              </button>
            </div>

            {/* Zones */}
            {expandedAct === act.act && (
              <div className="bg-black/20 divide-y divide-amber-500/10">
                {act.zones.map((zone, index) => {
                  const completed = isZoneCompleted(act.act, index);

                  return (
                    <div
                      key={index}
                      className={`px-4 py-3 hover:bg-white/5 transition-colors flex items-start gap-3 ${
                        completed ? 'opacity-60' : ''
                      }`}
                    >
                      {/* Zone checkbox */}
                      <button
                        onClick={() => toggleZone(act.act, index)}
                        className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                          completed
                            ? 'bg-green-500/20 border-green-500 text-green-400'
                            : 'border-white/30 hover:border-amber-400'
                        }`}
                      >
                        {completed && <span className="text-xs">✓</span>}
                      </button>

                      {/* Zone content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${
                              completed
                                ? 'text-white/50 line-through'
                                : 'text-white'
                            }`}
                          >
                            {zone.name}
                          </span>
                          {zone.waypoint && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                              WP
                            </span>
                          )}
                        </div>
                        {zone.notes && (
                          <div
                            className={`text-sm mt-1 ${
                              completed ? 'text-white/30' : 'text-white/50'
                            }`}
                          >
                            {zone.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Guide footer */}
      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
        <div className="text-amber-400 font-medium mb-2">📖 PoE Leveling Guide</div>
        <div className="text-white/50 text-sm">
          Complete walkthrough for Acts 1-10. Progress saved automatically.
        </div>
      </div>
    </div>
  );
};

export default LevelingGuide;
