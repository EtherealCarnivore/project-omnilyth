/*
 * PassivePointCounter.jsx — Dual point display for passive and ascendancy points.
 *
 * Shows "Passive: X/123" and "Ascendancy: X/8" with progress bars.
 * Updates in real-time as nodes are allocated/deallocated.
 */

export default function PassivePointCounter({
  passivePoints,
  maxPassivePoints,
  ascendancyPoints,
  maxAscendancyPoints,
}) {
  const passivePercent = (passivePoints / maxPassivePoints) * 100;
  const ascendancyPercent = (ascendancyPoints / maxAscendancyPoints) * 100;

  const isPassiveOverLimit = passivePoints > maxPassivePoints;
  const isAscendancyOverLimit = ascendancyPoints > maxAscendancyPoints;

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      {/* Passive points */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-white">Passive Points</span>
          <span
            className={`text-sm font-bold ${
              isPassiveOverLimit
                ? 'text-red-400'
                : passivePoints === maxPassivePoints
                ? 'text-amber-400'
                : 'text-blue-400'
            }`}
          >
            {passivePoints} / {maxPassivePoints}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              isPassiveOverLimit
                ? 'bg-red-500'
                : passivePoints === maxPassivePoints
                ? 'bg-amber-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(passivePercent, 100)}%` }}
          />
        </div>
        {isPassiveOverLimit && (
          <div className="mt-1 text-xs text-red-400">
            Over limit by {passivePoints - maxPassivePoints}
          </div>
        )}
      </div>

      {/* Ascendancy points */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-white">Ascendancy Points</span>
          <span
            className={`text-sm font-bold ${
              isAscendancyOverLimit
                ? 'text-red-400'
                : ascendancyPoints === maxAscendancyPoints
                ? 'text-amber-400'
                : 'text-purple-400'
            }`}
          >
            {ascendancyPoints} / {maxAscendancyPoints}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              isAscendancyOverLimit
                ? 'bg-red-500'
                : ascendancyPoints === maxAscendancyPoints
                ? 'bg-amber-500'
                : 'bg-purple-500'
            }`}
            style={{ width: `${Math.min(ascendancyPercent, 100)}%` }}
          />
        </div>
        {isAscendancyOverLimit && (
          <div className="mt-1 text-xs text-red-400">
            Over limit by {ascendancyPoints - maxAscendancyPoints}
          </div>
        )}
      </div>

      {/* Warning if over limits */}
      {(isPassiveOverLimit || isAscendancyOverLimit) && (
        <div className="pt-3 border-t border-gray-700">
          <div className="flex items-start gap-2 text-xs text-red-400">
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Point limit exceeded. This build is not achievable in-game.</span>
          </div>
        </div>
      )}
    </div>
  );
}
