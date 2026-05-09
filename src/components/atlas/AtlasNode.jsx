/*
 * AtlasNode.jsx — Individual node in the atlas tree SVG.
 *
 * Renders GGG's official frame sprites behind icon sprites, with a transparent
 * hit area circle for click/hover detection. Frame variant changes based on
 * allocation state (Unallocated / CanAllocate / Allocated).
 */

import { memo } from 'react';
import { NODE_SIZES, FRAME_NAMES, DIFF_COLORS } from '../../data/atlas/atlasTreeConstants';

// Sprite pixel sizes are at 0.3835 zoom — divide by this to get world-space
const ZOOM_FACTOR = 0.3835;

/**
 * Renders a sprite from a sprite sheet using foreignObject + CSS background clipping.
 * All sprites are clipped to circles — frames are circular borders, icons fill inside them.
 */
function SpriteImage({ sprite, worldSize, className, brightness }) {
  if (!sprite) return null;

  const scale = worldSize / Math.max(sprite.w, sprite.h);
  const displayW = sprite.w * scale;
  const displayH = sprite.h * scale;

  return (
    <foreignObject
      x={-displayW / 2}
      y={-displayH / 2}
      width={displayW}
      height={displayH}
      className={className || 'pointer-events-none'}
    >
      <div
        style={{
          width: displayW,
          height: displayH,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundImage: `url(${sprite.sheetUrl})`,
          backgroundPosition: `-${sprite.x * scale}px -${sprite.y * scale}px`,
          backgroundSize: `${sprite.sheetW * scale}px ${sprite.sheetH * scale}px`,
          backgroundRepeat: 'no-repeat',
          ...(brightness && { filter: `brightness(${brightness})` }),
        }}
      />
    </foreignObject>
  );
}

function NodeIcon({ icon, spriteMap, isAllocated, type, radius, brightness = 1.15 }) {
  if (!icon || !spriteMap) return null;

  let spriteInfo;
  if (type === 'mastery') {
    spriteInfo = spriteMap.mastery[icon];
  } else if (isAllocated) {
    spriteInfo = spriteMap.active[icon];
  } else {
    spriteInfo = spriteMap.inactive[icon] || spriteMap.active[icon];
  }
  if (!spriteInfo) return null;

  // Icon fills the inner area of the frame (smaller than frame diameter)
  const iconSize = radius * 2 * 0.65;
  return <SpriteImage sprite={spriteInfo} worldSize={iconSize} brightness={brightness} />;
}

function NodeFrame({ type, state, spriteMap, radius }) {
  const frameNames = FRAME_NAMES[type];
  if (!frameNames || !spriteMap?.frames) return null;

  const frameName = frameNames[state] || frameNames.idle;
  const frameSprite = spriteMap.frames[frameName];
  if (!frameSprite) return null;

  // Frame fills the full node diameter
  const frameSize = radius * 2;
  return <SpriteImage sprite={frameSprite} worldSize={frameSize} />;
}

function AtlasNode({
  nodeId,
  node,
  x,
  y,
  type,
  isAllocated,
  isAvailable,
  isSearchMatch,
  isHovered,
  isRejected,
  isDiffAdd,
  isDiffRemove,
  spriteMap,
  brightness = 1.3,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) {
  const size = NODE_SIZES[type] || NODE_SIZES.regular;

  // Mastery nodes: hub icons, not interactive, no frame
  if (type === 'mastery') {
    return (
      <g transform={`translate(${x},${y})`}>
        <NodeIcon
          icon={node.icon}
          spriteMap={spriteMap}
          isAllocated={false}
          type="mastery"
          radius={size}
          brightness={brightness * 0.88}
        />
      </g>
    );
  }

  // Determine visual state for frame selection
  let state = 'idle';
  if (isAllocated) state = 'allocated';
  else if (isSearchMatch) state = 'search';
  else if (isAvailable) state = 'path';
  else if (isHovered) state = 'hover';

  // Hit area slightly larger than frame for easier clicking
  const hitRadius = size + 15;

  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={() => onClick?.(nodeId)}
      onMouseEnter={() => onMouseEnter?.(nodeId)}
      onMouseLeave={() => onMouseLeave?.()}
      className="cursor-pointer"
    >
      {/* Transparent hit area */}
      <circle r={hitRadius} fill="transparent" />

      {/* Red rejection ring (behind frame) */}
      {isRejected && (
        <circle
          r={size + 6}
          fill="none"
          stroke="#ef4444"
          strokeWidth={4}
          opacity={0.85}
        />
      )}

      {/* Diff glow rings (behind frame) */}
      {isDiffAdd && (
        <circle
          r={size + 8}
          fill="none"
          stroke={DIFF_COLORS.add}
          strokeWidth={5}
          opacity={0.8}
        />
      )}
      {isDiffRemove && (
        <circle
          r={size + 8}
          fill="none"
          stroke={DIFF_COLORS.remove}
          strokeWidth={5}
          opacity={0.8}
        />
      )}

      {/* Frame sprite (behind icon) */}
      <NodeFrame
        type={type}
        state={state}
        spriteMap={spriteMap}
        radius={size}
      />

      {/* Icon sprite (on top of frame) */}
      <NodeIcon
        icon={node.icon}
        spriteMap={spriteMap}
        isAllocated={isAllocated}
        type={type}
        radius={size}
        brightness={brightness * 0.88}
      />
    </g>
  );
}

export default memo(AtlasNode);
