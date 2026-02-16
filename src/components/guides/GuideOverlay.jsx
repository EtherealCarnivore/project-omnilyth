/**
 * Guide Overlay - Main container for in-game guides
 * Hotkeys:
 *   G - Toggle overlay
 *   1-5 - Switch tabs
 *   ESC - Close overlay
 */

import { useState, useEffect } from 'react';
import GuideTabs from './GuideTabs';
import LevelingGuide from './LevelingGuide';
import AtlasGuide from './AtlasGuide';
import MechanicsGuide from './MechanicsGuide';
import GuideSearch from './GuideSearch';

const GuideOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('leveling');
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // New features
  const [opacity, setOpacity] = useState(90);
  const [clickThrough, setClickThrough] = useState(false);

  // Enhanced hotkey handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // G key - Toggle overlay
      if (e.key === 'g' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setIsVisible(prev => !prev);
        return;
      }

      // Only process other keys when overlay is visible
      if (isVisible) {
        // ESC - Close overlay
        if (e.key === 'Escape') {
          setIsVisible(false);
          return;
        }

        // Number keys 1-5 - Switch tabs
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          const tabMap = {
            '1': 'leveling',
            '2': 'atlas',
            '3': 'mechanics',
            '4': 'oils',
            '5': 'cluster'
          };

          if (tabMap[e.key]) {
            setActiveTab(tabMap[e.key]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  // Dragging handlers
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 text-white/50 text-sm">
        Press <kbd className="px-2 py-1 bg-white/10 rounded">G</kbd> for guides
      </div>
    );
  }

  return (
    <div
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '800px',
        maxHeight: '600px',
        opacity: opacity / 100,
        pointerEvents: clickThrough ? 'none' : 'auto',
        willChange: isDragging ? 'transform' : 'auto',
        transform: isDragging ? 'translateZ(0)' : 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Main overlay container */}
      <div className="bg-black/90 backdrop-blur-md border border-amber-500/30 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className="drag-handle cursor-move bg-gradient-to-r from-amber-900/50 to-amber-800/50 px-4 py-3 border-b border-amber-500/20 flex items-center justify-between"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <h2 className="text-amber-400 font-bold text-lg">PoE Guide</h2>
            <span className="text-white/30 text-sm">(Drag to move)</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Opacity Control */}
            <div className="flex items-center gap-2" style={{ pointerEvents: 'auto' }}>
              <label className="text-white/50 text-xs whitespace-nowrap">Opacity</label>
              <input
                type="range"
                min="30"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
                         [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
                         [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500
                         [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                title="Adjust overlay opacity"
              />
              <span className="text-white/30 text-xs w-8">{opacity}%</span>
            </div>

            {/* Click-Through Toggle */}
            <button
              onClick={() => setClickThrough(!clickThrough)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                clickThrough
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
              style={{ pointerEvents: 'auto' }}
              title={clickThrough ? 'Click-through ON - clicks pass to game' : 'Click-through OFF - overlay interactive'}
            >
              {clickThrough ? '🖱️ Pass-through' : '🖱️ Interactive'}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="px-3 py-1 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors text-sm"
              style={{ pointerEvents: 'auto' }}
            >
              Hide [G]
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 py-3 bg-black/30 border-b border-amber-500/10" style={{ pointerEvents: 'auto' }}>
          <GuideSearch />
        </div>

        {/* Tab navigation */}
        <div style={{ pointerEvents: 'auto' }}>
          <GuideTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Content area */}
        <div className="overflow-y-auto" style={{ maxHeight: '450px', pointerEvents: 'auto' }}>
          {activeTab === 'leveling' && <LevelingGuide />}
          {activeTab === 'atlas' && <AtlasGuide />}
          {activeTab === 'mechanics' && <MechanicsGuide />}
        </div>

        {/* Hotkey hints footer */}
        <div className="px-4 py-2 bg-black/40 border-t border-amber-500/10 flex items-center justify-center gap-4 text-xs text-white/30">
          <span><kbd className="px-1 bg-white/10 rounded">1-5</kbd> Switch tabs</span>
          <span><kbd className="px-1 bg-white/10 rounded">ESC</kbd> Close</span>
          <span><kbd className="px-1 bg-white/10 rounded">G</kbd> Toggle</span>
        </div>
      </div>
    </div>
  );
};

export default GuideOverlay;
