/*
 * PassiveGroupBackground.jsx — Renders a group background sprite.
 *
 * Uses foreignObject + CSS background-position to clip from the sprite sheet.
 * Positioned at the group's center in world-space.
 */

import { memo } from 'react';

const ZOOM_FACTOR = 0.3835;

function PassiveGroupBackground({ x, y, sprite }) {
  const worldW = sprite.w / ZOOM_FACTOR;
  const worldH = sprite.h / ZOOM_FACTOR;

  return (
    <foreignObject
      x={x - worldW / 2}
      y={y - worldH / 2}
      width={worldW}
      height={worldH}
      className="pointer-events-none"
    >
      <div
        style={{
          width: worldW,
          height: worldH,
          backgroundImage: `url(${sprite.sheetUrl})`,
          backgroundPosition: `-${sprite.x / ZOOM_FACTOR}px -${sprite.y / ZOOM_FACTOR}px`,
          backgroundSize: `${sprite.sheetW / ZOOM_FACTOR}px ${sprite.sheetH / ZOOM_FACTOR}px`,
          backgroundRepeat: 'no-repeat',
          opacity: 1.0,
        }}
      />
    </foreignObject>
  );
}

export default memo(PassiveGroupBackground);
