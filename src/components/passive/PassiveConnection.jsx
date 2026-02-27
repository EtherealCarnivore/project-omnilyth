/*
 * PassiveConnection.jsx — SVG connection between passive tree nodes.
 *
 * Straight lines for cross-orbit/cross-group connections.
 * Circular arcs for same-orbit connections (following the orbit circle).
 * Allocated connections glow golden. Idle connections are subtle but visible.
 */

import { memo } from 'react';
import { CONNECTION_COLORS } from '../../data/passive/passiveTreeConstants';

function PassiveConnection({ x1, y1, x2, y2, arc, bothAllocated, oneAllocated }) {
  let style;
  if (bothAllocated) {
    style = CONNECTION_COLORS.allocated;
  } else if (oneAllocated) {
    style = CONNECTION_COLORS.partial;
  } else {
    style = CONNECTION_COLORS.idle;
  }

  // Same-orbit connections: render as circular arc
  if (arc && arc.r > 0) {
    const angle1 = Math.atan2(y1 - arc.cy, x1 - arc.cx);
    const angle2 = Math.atan2(y2 - arc.cy, x2 - arc.cx);
    let delta = ((angle2 - angle1) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const sweepFlag = delta <= Math.PI ? 1 : 0;

    return (
      <path
        d={`M ${x1} ${y1} A ${arc.r} ${arc.r} 0 0 ${sweepFlag} ${x2} ${y2}`}
        fill="none"
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        strokeLinecap="round"
        opacity={style.opacity}
      />
    );
  }

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeLinecap="round"
      opacity={style.opacity}
    />
  );
}

export default memo(PassiveConnection);
