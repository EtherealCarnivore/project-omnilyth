/**
 * AvailabilityBadge
 * Visual indicator for gem availability (quest, vendor, siosa, lilly)
 * Color-coded with icons for accessibility
 */

const BADGE_TYPES = {
  quest: {
    icon: '✅',
    color: 'green',
    bgClass: 'bg-green-500/20',
    borderClass: 'border-green-500/30',
    textClass: 'text-green-400'
  },
  vendor: {
    icon: '🛒',
    color: 'yellow',
    bgClass: 'bg-yellow-500/20',
    borderClass: 'border-yellow-500/30',
    textClass: 'text-yellow-400'
  },
  siosa: {
    icon: '🔓',
    color: 'purple',
    bgClass: 'bg-purple-500/20',
    borderClass: 'border-purple-500/30',
    textClass: 'text-purple-400'
  },
  lilly: {
    icon: '🔓',
    color: 'purple',
    bgClass: 'bg-purple-500/20',
    borderClass: 'border-purple-500/30',
    textClass: 'text-purple-400'
  },
  unavailable: {
    icon: '🔒',
    color: 'red',
    bgClass: 'bg-red-500/20',
    borderClass: 'border-red-500/30',
    textClass: 'text-red-400'
  }
};

/**
 * Format availability text for display
 */
function formatAvailabilityText(availability) {
  const { act, source, questName, classes } = availability;

  switch (source) {
    case 'quest':
      if (classes && classes.length > 0) {
        return `Act ${act}: ${questName} (${classes.join(', ')})`;
      }
      return `Act ${act}: ${questName} (all classes)`;

    case 'vendor':
      return `Act ${act}: Vendor`;

    case 'siosa':
      return 'Act 3: Siosa';

    case 'lilly':
      return 'Act 6: Lilly Roth';

    default:
      return 'Not available';
  }
}

export default function AvailabilityBadge({ availability, compact = false, className = '' }) {
  if (!availability) {
    const badge = BADGE_TYPES.unavailable;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${badge.bgClass} ${badge.borderClass} ${badge.textClass} ${className}`}
        title="Not available yet"
      >
        {badge.icon} Not available
      </span>
    );
  }

  const badge = BADGE_TYPES[availability.source] || BADGE_TYPES.unavailable;
  const text = formatAvailabilityText(availability);

  if (compact) {
    // Compact mode: just icon + act number
    return (
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium border ${badge.bgClass} ${badge.borderClass} ${badge.textClass} ${className}`}
        title={text}
        aria-label={text}
      >
        {badge.icon}
      </span>
    );
  }

  // Full mode: icon + text
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${badge.bgClass} ${badge.borderClass} ${badge.textClass} ${className}`}
      title={text}
      aria-label={text}
    >
      {badge.icon} {availability.source === 'quest' && `Act ${availability.act}`}
      {availability.source === 'siosa' && 'Siosa'}
      {availability.source === 'lilly' && 'Lilly Roth'}
      {availability.source === 'vendor' && 'Vendor'}
    </span>
  );
}

/**
 * Multiple availability badges in a row
 */
export function AvailabilityBadges({ availabilities, maxShow = 3, className = '' }) {
  if (!availabilities || availabilities.length === 0) {
    return <AvailabilityBadge availability={null} className={className} />;
  }

  const shown = availabilities.slice(0, maxShow);
  const remaining = availabilities.length - maxShow;

  return (
    <div className={`flex items-center gap-1 flex-wrap ${className}`}>
      {shown.map((avail, idx) => (
        <AvailabilityBadge key={idx} availability={avail} />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-zinc-500">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
