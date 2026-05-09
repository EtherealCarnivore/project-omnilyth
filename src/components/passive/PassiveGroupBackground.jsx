/*
 * PassiveGroupBackground.jsx — Renders a group background sprite.
 *
 * Pure SVG via nested <svg> + viewBox: crops the sheet to the sprite region.
 * Positioned at the group's center in world-space. ZOOM_FACTOR (0.3835) is
 * GGG's source-art-to-world-space ratio — sprite art is authored at a
 * higher resolution than the world coordinate system, so each world unit
 * ≈ 1/ZOOM_FACTOR sprite-art pixels.
 */

import { memo } from 'react';

const ZOOM_FACTOR = 0.3835;

function PassiveGroupBackground({ x, y, sprite }) {
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
    >
      <image href={sprite.sheetUrl} width={sprite.sheetW} height={sprite.sheetH} />
    </svg>
  );
}

export default memo(PassiveGroupBackground);
