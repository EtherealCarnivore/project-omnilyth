/*
 * App.jsx — The root of all frontend suffering.
 *
 * This is where React Router, context providers, and lazy-loaded modules
 * converge into a pyramid of angle brackets that would make any XML parser weep.
 * A Java HFT dev wrote this and yes, I miss public static void main(String[] args).
 * My order router has fewer nested layers than this component tree.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PreLaunchGate from './components/PreLaunchGate';
import { GameProvider } from './contexts/GameContext';
import { LeagueProvider } from './contexts/LeagueContext';
import { PricesProvider } from './contexts/PricesContext';
import { PinnedProvider } from './contexts/PinnedContext';

import { LevelingProgressProvider } from './contexts/LevelingProgressContext';
import { LevelingModeProvider } from './contexts/LevelingModeContext';
import { LevelingPlanProvider } from './contexts/LevelingPlanContext';
import { PlaybookProvider } from './contexts/PlaybookContext';
import { PatchNotesProvider } from './contexts/PatchNotesContext';
import AppShell from './layout/AppShell';
import HomePage from './pages/HomePage';
import Poe2HomePage from './pages/Poe2HomePage';
import GameAwareIndex from './components/GameAwareIndex';
import CraftingOverviewPage from './pages/CraftingOverviewPage';
import AtlasOverviewPage from './pages/AtlasOverviewPage';
import BuildPlanningOverviewPage from './pages/BuildPlanningOverviewPage';
import LevelingOverviewPage from './pages/LevelingOverviewPage';
import PrivacyPage from './pages/PrivacyPage';
import RunesOfAldurPage from './pages/RunesOfAldurPage';
import NotFoundPage from './pages/NotFoundPage';
// LINK: src/modules/registry.js drives BOTH the route table below (one
// <Route> per non-external entry) AND the sidebar grouping in src/layout/
// Sidebar.jsx (via getModuleTree). Adding/removing a tool is a one-file
// change in the registry — never hard-code a route here.
import modules from './modules/registry';
import GuideOverlay from './components/guides/GuideOverlay';

// Clean up old v1/v2 layout toggle localStorage key (shipped v2, removed DesignContext)
try { localStorage.removeItem('omnilyth_design_variant'); } catch {}

export default function App() {
  return (
    // PreLaunchGate moved INSIDE BrowserRouter (was outside) so it can use
    // useLocation() for path-aware gating. SEO crawlers hitting indexable
    // routes need to skip the gate; they would otherwise be served the
    // "between leagues" holding page instead of the actual content.
    // Cost: BrowserRouter mounts even for gated visitors (small).
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PreLaunchGate>
      {/* Provider inception: game → league → prices → pinned. The nesting never ends. */}
      {/* In Java I'd have @Autowired and a DI container. Here I have JSX turducken. */}
      {/* My matching engine has lower latency than this render tree. */}
      {/* GameProvider sits outermost: league pool, price API path, and a few */}
      {/* other axes downstream all depend on which game the user is in. */}
      <GameProvider>
        <LeagueProvider>
        <PricesProvider>
        <PinnedProvider>
        <LevelingProgressProvider>
        <LevelingModeProvider>
        <LevelingPlanProvider>
        <PlaybookProvider>
        <PatchNotesProvider>
          {/* Global guide overlay - toggle with G key */}
          <GuideOverlay />
          <Routes>
            <Route element={<AppShell />}>
              {/* GameAwareIndex: PoE 1 mode renders HomePage; PoE 2 mode redirects to /poe2 */}
              <Route index element={<GameAwareIndex />} />
              {/* PoE 2 landing — first PoE 2 surface; tools land in waves starting 2026-05-29 */}
              <Route path="/poe2" element={<Poe2HomePage />} />
              <Route path="/poe2/runes-of-aldur" element={<RunesOfAldurPage />} />
              {/* Category overview pages */}
              <Route path="/crafting" element={<CraftingOverviewPage />} />
              <Route path="/atlas" element={<AtlasOverviewPage />} />
              <Route path="/build" element={<BuildPlanningOverviewPage />} />
              <Route path="/leveling" element={<LevelingOverviewPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              {/* Dynamically generate routes from registry — at least ONE thing feels like proper architecture */}
              {modules.filter(mod => !mod.external).map(mod => (
                <Route key={mod.id} path={mod.route} element={<mod.component />} />
              ))}
              {/* Catch-all → real 404 page. RouteHead sets noindex automatically */}
              {/* for any path not in src/lib/seoMeta.js. */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </PatchNotesProvider>
        </PlaybookProvider>
        </LevelingPlanProvider>
        </LevelingModeProvider>
        </LevelingProgressProvider>
        </PinnedProvider>
        </PricesProvider>
      </LeagueProvider>
      </GameProvider>
      </PreLaunchGate>
    </BrowserRouter>
  );
}
