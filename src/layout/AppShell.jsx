/*
 * AppShell.jsx — The main layout skeleton.
 *
 * Sidebar + Topbar + content area. Classic dashboard layout that every
 * frontend framework has reinvented 47 times. This is attempt #48.
 * I write low-latency order execution systems in Java. I can route a market order
 * through three exchanges in under 200 microseconds. But positioning a sidebar
 * next to a content area? That took me 45 minutes and a Stack Overflow tab.
 */
import { useState, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import LevelingSidebar from './LevelingSidebar';
import Topbar from './Topbar';
import LevelingModeBanner from '../components/LevelingModeBanner';
import CrossGameBanner from '../components/CrossGameBanner';
import RouteHead from '../components/RouteHead';
import { useLevelingMode } from '../contexts/LevelingModeContext';
import modules from '../modules/registry';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isActive: isLevelingMode } = useLevelingMode();

  // Look up current module to check if it needs fullWidth (e.g., Timeless Jewel tree)
  const currentModule = modules.find(m => m.route === location.pathname);
  const isFullWidth = currentModule?.fullWidth;

  // Choose which sidebar to render based on leveling mode
  const SidebarComponent = isLevelingMode ? LevelingSidebar : Sidebar;

  return (
    <div className="flex h-screen overflow-hidden">
      <RouteHead />
      <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Show banner when in leveling mode */}
        {isLevelingMode && <LevelingModeBanner />}

        <Topbar onMenuClick={() => setSidebarOpen(prev => !prev)} />

        <main className={`flex-1 ${isFullWidth ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <div className={isFullWidth ? 'h-full px-4 sm:px-6 py-6 sm:py-8' : 'max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8'}>
            {/* Cross-game banner: shown when the active game doesn't match the */}
            {/* current tool's `games` array. No-op (returns null) otherwise. */}
            <CrossGameBanner />
            {/* Suspense boundary for lazy-loaded modules. The spinner is pure CSS — */}
            {/* because importing a spinner library to show while other things load felt too ironic */}
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
