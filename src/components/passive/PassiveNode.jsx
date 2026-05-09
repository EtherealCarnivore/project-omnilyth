/*
 * PassiveNode.jsx — Individual node in the passive skill tree SVG.
 *
 * Renders GGG's official frame sprites behind icon sprites, with a transparent
 * hit area circle for click/hover detection. Handles all node types:
 * regular, notable, keystone, mastery, jewelSocket, classStart, ascendancy.
 */

import { memo } from 'react';
import { NODE_SIZES, FRAME_NAMES } from '../../data/passive/passiveTreeConstants';

/**
 * Renders a sprite from a sprite sheet using foreignObject + CSS background clipping.
 */
function SpriteImage({ sprite, worldSize, className }) {
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
        }}
      />
    </foreignObject>
  );
}

function NodeIcon({ icon, spriteMap, isAllocated, type, radius }) {
  if (!icon || !spriteMap) return null;

  let spriteInfo;
  if (type === 'mastery') {
    spriteInfo = spriteMap.mastery[icon] || spriteMap.masteryInactive[icon];
  } else if (isAllocated) {
    spriteInfo = spriteMap.active[icon];
  } else {
    spriteInfo = spriteMap.inactive[icon] || spriteMap.active[icon];
  }
  if (!spriteInfo) return null;

  const iconSize = radius * 2 * 0.65;
  return <SpriteImage sprite={spriteInfo} worldSize={iconSize} />;
}

function NodeFrame({ type, state, spriteMap, radius }) {
  const frameNames = FRAME_NAMES[type];
  if (!frameNames || !spriteMap?.frames) return null;

  const frameName = frameNames[state] || frameNames.idle;
  const frameSprite = spriteMap.frames[frameName];
  if (!frameSprite) return null;

  const frameSize = radius * 2;
  return <SpriteImage sprite={frameSprite} worldSize={frameSize} />;
}

function PassiveNode({
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
  spriteMap,
  onClick,
  onMouseEnter,
  onMouseLeave,
  // Ascendancy rendering
  isSelectedAscendancy,
  // Mastery state
  isMasteryConnected,
  isMasterySelected,
}) {
  const size = NODE_SIZES[type] || NODE_SIZES.regular;

  // Class start nodes: just render a subtle marker, not interactive
  if (type === 'classStart') {
    return (
      <g transform={`translate(${x},${y})`}>
        <circle r={size * 0.6} fill="#1e1e36" stroke="#4a4a7e" strokeWidth={2} opacity={0.75} />
      </g>
    );
  }

  // Mastery nodes: hub icons, clickable for stat selection
  if (type === 'mastery') {
    // Choose mastery sprite based on state
    let masterySprite;
    if (isMasterySelected && node.activeIcon) {
      masterySprite = spriteMap.masteryActiveSelected[node.activeIcon]
        || spriteMap.mastery[node.activeIcon]
        || spriteMap.mastery[node.icon];
    } else if (isMasteryConnected && node.activeIcon) {
      masterySprite = spriteMap.masteryConnected[node.activeIcon]
        || spriteMap.mastery[node.icon];
    } else if (node.inactiveIcon) {
      masterySprite = spriteMap.masteryInactive[node.inactiveIcon]
        || spriteMap.mastery[node.icon];
    } else {
      masterySprite = spriteMap.mastery[node.icon];
    }

    const hitRadius = size + 10;
    const isClickable = isMasteryConnected || isMasterySelected;

    return (
      <g
        transform={`translate(${x},${y})`}
        onClick={isClickable ? () => onClick?.(nodeId) : undefined}
        onMouseEnter={() => onMouseEnter?.(nodeId)}
        onMouseLeave={() => onMouseLeave?.()}
        className={isClickable ? 'cursor-pointer' : undefined}
      >
        {isClickable && <circle r={hitRadius} fill="transparent" />}
        {masterySprite && <SpriteImage sprite={masterySprite} worldSize={size * 2 * 0.65} />}
        {isMasterySelected && (
          <circle r={size * 0.4} fill="none" stroke="#c8a24e" strokeWidth={2} opacity={0.7} />
        )}
      </g>
    );
  }

  // Ascendancy nodes that aren't selected: dim
  if (node.ascendancyName && isSelectedAscendancy === false) {
    return (
      <g transform={`translate(${x},${y})`} opacity={0.2}>
        <NodeFrame type={type} state="idle" spriteMap={spriteMap} radius={size} />
        <NodeIcon icon={node.icon} spriteMap={spriteMap} isAllocated={false} type={type} radius={size} />
      </g>
    );
  }

  // Determine visual state for frame selection
  let state = 'idle';
  if (isAllocated) state = 'allocated';
  else if (isSearchMatch) state = 'search';
  else if (isAvailable) state = 'path';
  else if (isHovered) state = 'hover';

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

      {/* Red rejection ring */}
      {isRejected && (
        <circle r={size + 6} fill="none" stroke="#ef4444" strokeWidth={4} opacity={0.85} />
      )}

      {/* Frame sprite */}
      <NodeFrame type={type} state={state} spriteMap={spriteMap} radius={size} />

      {/* Icon sprite */}
      <NodeIcon icon={node.icon} spriteMap={spriteMap} isAllocated={isAllocated} type={type} radius={size} />
    </g>
  );
}

export default memo(PassiveNode);
