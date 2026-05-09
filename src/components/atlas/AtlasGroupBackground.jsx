/*
 * AtlasGroupBackground.jsx — Renders a group background sprite (teal/gold nebula cluster).
 *
 * Pure SVG via nested <svg> + viewBox (same approach as the passive tree).
 * Crops the sheet to the sprite region; outer x/y/width/height place it in
 * world space. opacity + brightness applied as CSS on the outer svg element.
 */

import { memo } from 'react';

// Sprite pixel sizes are at 0.3835 zoom — divide by this to get world-space
const ZOOM_FACTOR = 0.3835;

function AtlasGroupBackground({ x, y, sprite, brightness = 1.3 }) {
  const worldW = sprite.w / ZOOM_FACTOR;
  const worldH = sprite.h / ZOOM_FACTOR;

  return (
    <svg
      x={x - worldW / 2}
      y={y - worldH / 2}
      width={worldW}
      height={worldH}
      viewBox={`${sprite.x} ${sprite.y} ${sprite.w} ${sprite.h}`}
      className="pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
      style={{ opacity: 0.85, filter: `brightness(${brightness})` }}
    >
      <image href={sprite.sheetUrl} width={sprite.sheetW} height={sprite.sheetH} />
    </svg>
  );
}

export default memo(AtlasGroupBackground);
