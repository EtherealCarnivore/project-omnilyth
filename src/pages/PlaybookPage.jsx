/**
 * PlaybookPage - Main leveling playbook interface
 *
 * Displays selected playbook with act-by-act breakdown, checklist,
 * decision points, power spikes, and mistakes.
 * Design matches the app's glass-card dark theme (zinc-900/60, backdrop-blur).
 */

import { useState, useRef, useCallback } from 'react';
import { usePlaybook } from '../contexts/PlaybookContext';
import PlaybookSelector from '../components/leveling/playbook/PlaybookSelector';
import ActNavigation from '../components/leveling/playbook/ActNavigation';
import ActChecklist from '../components/leveling/playbook/ActChecklist';
import ActDecisionPoints from '../components/leveling/playbook/ActDecisionPoints';
import ActGearCheckpoints from '../components/leveling/playbook/ActGearCheckpoints';
import ActGemSetup from '../components/leveling/playbook/ActGemSetup';
import ActBossNotes from '../components/leveling/playbook/ActBossNotes';
import PowerSpikeSidebar from '../components/leveling/playbook/PowerSpikeSidebar';
import MistakesPanel from '../components/leveling/playbook/MistakesPanel';

export default function PlaybookPage() {
  const {
    currentPlaybook,
    currentAct,
    currentActData,
    progress,
    clearPlaybook,
    resetProgress
  } = usePlaybook();

  const [activeTab, setActiveTab] = useState('checklist');
  const [showSidebar, setShowSidebar] = useState(true);
  const tabListRef = useRef(null);

  const TABS = [
    { key: 'checklist', label: 'Checklist' },
    { key: 'decisions', label: 'Decisions' },
    { key: 'route', label: 'Route' },
    { key: 'gems', label: 'Gems' },
    { key: 'gear', label: 'Gear' },
    { key: 'bosses', label: 'Bosses' },
    { key: 'mistakes', label: 'Mistakes' },
  ];

  const handleTabKeyDown = useCallback((e) => {
    const currentIndex = TABS.findIndex(t => t.key === activeTab);
    let nextIndex;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = TABS.length - 1;
    } else {
      return;
    }

    setActiveTab(TABS[nextIndex].key);
    // Focus the newly active tab button
    const buttons = tabListRef.current?.querySelectorAll('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  }, [activeTab]);

  // No playbook selected — show selector
  if (!currentPlaybook) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Leveling Playbooks</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Speedrunner-analyzed strategies with checklists, decisions, and power spikes
          </p>
        </div>
        <PlaybookSelector />
      </div>
    );
  }

  const handleResetProgress = () => {
    if (window.confirm('Reset all playbook progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              {currentPlaybook.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 mt-1">
              {currentPlaybook.author && (
                <>
                  <span>
                    By{' '}
                    {currentPlaybook.resources?.authorChannel ? (
                      <a
                        href={currentPlaybook.resources.authorChannel}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-300 hover:text-teal-400 transition-colors"
                      >
                        {currentPlaybook.author}
                      </a>
                    ) : (
                      <span className="text-zinc-300">{currentPlaybook.author}</span>
                    )}
                  </span>
                  <span className="text-zinc-700">|</span>
                </>
              )}
              <span>{currentPlaybook.class}</span>
              <span className="text-zinc-700">|</span>
              <span className="capitalize">{currentPlaybook.difficulty}</span>
              <span className="text-zinc-700">|</span>
              <span>Target: {currentPlaybook.estimatedTime}</span>
              <span className="text-zinc-700">|</span>
              <span className="text-teal-400 font-medium">
                {progress}% Complete
              </span>
              {currentPlaybook.resources?.videoUrl && (
                <>
                  <span className="text-zinc-700">|</span>
                  <a
                    href={currentPlaybook.resources.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-teal-400 transition-colors inline-flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Source VOD
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="hidden lg:block px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:border-white/[0.12] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              {showSidebar ? 'Hide' : 'Show'} Sidebar
            </button>
            <button
              onClick={handleResetProgress}
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              Reset
            </button>
            <button
              onClick={clearPlaybook}
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:border-white/[0.12] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              Change Build
            </button>
          </div>
        </div>

        {/* Act Navigation */}
        <ActNavigation showProgress={true} />
      </div>

      {/* Act Header */}
      {currentActData && (
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
          <h2 className="text-xl font-bold text-zinc-200">
            {currentActData.act <= 8 ? `Act ${currentActData.act}` : currentActData.act === 9 ? 'Acts 9-10' : 'Early Maps'}: {currentActData.title}
          </h2>
          <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
            <span>
              Level {currentActData.levelRange.enter}-{currentActData.levelRange.exit}
            </span>
            <span className="text-zinc-700">|</span>
            <span>Target: {currentActData.timeTarget}</span>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex gap-6">
        {/* Main Panel */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Tab Navigation */}
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Playbook sections"
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900"
            onKeyDown={handleTabKeyDown}
          >
            {TABS.map(tab => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={`tabpanel-${tab.key}`}
                id={`tab-${tab.key}`}
                tabIndex={activeTab === tab.key ? 0 : -1}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
                  ${activeTab === tab.key
                    ? 'bg-teal-500/20 border border-teal-500/50 text-teal-400'
                    : 'bg-zinc-800/40 border border-white/[0.04] text-zinc-400 hover:border-white/[0.08] hover:text-zinc-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-5"
          >
            {activeTab === 'checklist' && (
              <ActChecklist actNumber={currentAct} groupByCategory={true} />
            )}

            {activeTab === 'decisions' && (
              <ActDecisionPoints actNumber={currentAct} />
            )}

            {activeTab === 'route' && currentActData && (
              <RouteView route={currentActData.route} />
            )}

            {activeTab === 'gems' && (
              <ActGemSetup actNumber={currentAct} />
            )}

            {activeTab === 'gear' && (
              <ActGearCheckpoints actNumber={currentAct} />
            )}

            {activeTab === 'bosses' && (
              <ActBossNotes actNumber={currentAct} />
            )}

            {activeTab === 'mistakes' && (
              <MistakesPanel actNumber={currentAct} showGlobal={true} />
            )}
          </div>
        </div>

        {/* Sidebar — desktop only */}
        {showSidebar && (
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6 space-y-4">
              {/* Power Spikes */}
              <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
                <PowerSpikeSidebar
                  currentLevel={currentActData?.levelRange?.enter || 1}
                  showAll={false}
                />
              </div>

              {/* Core Principles */}
              <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                  Core Principles
                </h3>
                <div className="space-y-2">
                  {currentPlaybook.principles.slice(0, 5).map(principle => (
                    <PrincipleCard key={principle.id} principle={principle} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * RouteView - Zone progression route display
 */
function RouteView({ route }) {
  if (!route || route.length === 0) {
    return (
      <p className="text-zinc-500 text-sm">No route data for this act.</p>
    );
  }

  return (
    <div className="space-y-3">
      {route.map((step, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-3 bg-zinc-800/40 border border-white/[0.04] rounded-lg"
        >
          <div className="flex-shrink-0 w-7 h-7 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center font-bold text-xs border border-teal-500/30">
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-zinc-200 text-sm">
              {step.zone}
            </div>
            <div className="text-sm text-zinc-400 mt-0.5">
              {step.objective}
            </div>
            {step.skipMobs && (
              <span className="inline-flex items-center mt-1 px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                Skip Mobs
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * PrincipleCard - Sidebar principle display
 */
function PrincipleCard({ principle }) {
  const priorityStyles = {
    critical: 'border-l-red-400/60',
    high: 'border-l-amber-400/60',
    medium: 'border-l-zinc-500/60'
  };

  return (
    <div className={`pl-3 border-l-2 ${priorityStyles[principle.priority] || priorityStyles.medium}`}>
      <div className="font-medium text-zinc-300 text-xs">
        {principle.title}
      </div>
      <div className="text-xs text-zinc-500 mt-0.5">
        {principle.description}
      </div>
    </div>
  );
}
