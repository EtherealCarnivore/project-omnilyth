/*
 * App.jsx — The root of all frontend suffering.
 *
 * This is where React Router, context providers, and lazy-loaded modules
 * converge into a pyramid of angle brackets that would make any XML parser weep.
 * A Java HFT dev wrote this and yes, I miss public static void main(String[] args).
 * My order router has fewer nested layers than this component tree.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectOnHoldPage from './pages/ProjectOnHoldPage';
import { GameProvider } from './contexts/GameContext';
import { LeagueProvider } from './contexts/LeagueContext';
import { PricesProvider } from './contexts/PricesContext';
import { PinnedProvider } from './contexts/PinnedContext';

import { LevelingProgressProvider } from './contexts/LevelingProgressContext';
import { LevelingModeProvider } from './contexts/LevelingModeContext';
import { LevelingPlanProvider } from './contexts/LevelingPlanContext';
import { PlaybookProvider } from './contexts/PlaybookContext';
import { PatchNotesProvider } from './contexts/PatchNotesContext';
import { AuthProvider } from './contexts/AuthContext';
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
import LoginPage from './pages/LoginPage';
import RequireAuth from './components/auth/RequireAuth';
// LINK: src/modules/registry.js drives BOTH the route table below (one
// <Route> per non-external entry) AND the sidebar grouping in src/layout/
// Sidebar.jsx (via getModuleTree). Adding/removing a tool is a one-file
// change in the registry — never hard-code a route here.
import modules from './modules/registry';
import GuideOverlay from './components/guides/GuideOverlay';

// Clean up old v1/v2 layout toggle localStorage key (shipped v2, removed DesignContext)
try { localStorage.removeItem('omnilyth_design_variant'); } catch {}

// ── Project pause ─────────────────────────────────────────────────────────
// The whole project is on hold. The deployed site renders ONLY the holding
// page on every route — no router, no nav, nothing to traverse. Local dev
// (Vite dev server) and LAN/loopback hosts bypass the hold so work can
// continue; `npm run dev` and `npm run preview` on localhost show the full app.
// To unpause: delete this block + the short-circuit in App() and restore the
// PreLaunchGate import/wrapper if the between-leagues gate is wanted back.
function isLocalOrLAN(host) {
  if (!host) return false;
  if (host === 'localhost' || host === '127.0.0.1') return true;
  if (host.endsWith('.local')) return true;
  return /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
}
const ON_HOLD =
  !import.meta.env.DEV &&
  !isLocalOrLAN(typeof window !== 'undefined' ? window.location.hostname : '');

export default function App() {
  // Hard pause: replace the entire app with the holding page in production.
  if (ON_HOLD) return <ProjectOnHoldPage />;

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* Provider inception: game → league → prices → pinned. The nesting never ends. */}
      {/* In Java I'd have @Autowired and a DI container. Here I have JSX turducken. */}
      {/* My matching engine has lower latency than this render tree. */}
      {/* GameProvider sits outermost: league pool, price API path, and a few */}
      {/* other axes downstream all depend on which game the user is in. */}
      <AuthProvider>
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
              <Route path="/login" element={<LoginPage />} />
              {/* Dynamically generate routes from registry — at least ONE thing feels like proper architecture.
                  Entries with `dynamicChildren` also wire a parameterised sibling route (e.g. /poe2/builds + /poe2/builds/:slug)
                  so detail pages stay registry-discoverable without one registry entry per slug. */}
              {modules.filter(mod => !mod.external).flatMap(mod => {
                const element = mod.requiresAuth
                  ? <RequireAuth adminOnly={mod.adminOnly}><mod.component /></RequireAuth>
                  : <mod.component />;
                const routes = [
                  <Route key={mod.id} path={mod.route} element={element} />
                ];
                if (mod.dynamicChildren) {
                  const Dynamic = mod.dynamicChildren.component;
                  routes.push(
                    <Route
                      key={`${mod.id}-dynamic`}
                      path={mod.dynamicChildren.routePattern}
                      element={<Dynamic />}
                    />
                  );
                }
                return routes;
              })}
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
      </AuthProvider>
    </BrowserRouter>
  );
}
