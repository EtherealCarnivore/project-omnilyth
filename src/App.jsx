/*
 * App.jsx — The root of all frontend suffering.
 *
 * This is where React Router, context providers, and lazy-loaded modules
 * converge into a pyramid of angle brackets that would make any XML parser weep.
 * A Java HFT dev wrote this and yes, I miss public static void main(String[] args).
 * My order router has fewer nested layers than this component tree.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeagueProvider } from './contexts/LeagueContext';
import { PricesProvider } from './contexts/PricesContext';
import { PinnedProvider } from './contexts/PinnedContext';
import { DesignProvider } from './contexts/DesignContext';
import { LevelingProgressProvider } from './contexts/LevelingProgressContext';
import { LevelingModeProvider } from './contexts/LevelingModeContext';
import { PatchNotesProvider } from './contexts/PatchNotesContext';
import AppShell from './layout/AppShell';
import HomePage from './pages/HomePage';
import CraftingOverviewPage from './pages/CraftingOverviewPage';
import AtlasOverviewPage from './pages/AtlasOverviewPage';
import BuildPlanningOverviewPage from './pages/BuildPlanningOverviewPage';
import LevelingOverviewPage from './pages/LevelingOverviewPage';
import modules from './modules/registry';
import GuideOverlay from './components/guides/GuideOverlay';

export default function App() {
  return (
    // basename: GitHub Pages needs /omnilyth-core-public/, Netlify needs /
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* Provider inception: league → prices → pinned. The nesting never ends. */}
      {/* In Java I'd have @Autowired and a DI container. Here I have JSX turducken. */}
      {/* My matching engine has lower latency than this render tree. */}
      <LeagueProvider>
        <PricesProvider>
        <PinnedProvider>
        <DesignProvider>
        <LevelingProgressProvider>
        <LevelingModeProvider>
        <PatchNotesProvider>
          {/* Global guide overlay - toggle with G key */}
          <GuideOverlay />
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              {/* Category overview pages (v2 layout hubs) */}
              <Route path="/crafting" element={<CraftingOverviewPage />} />
              <Route path="/atlas" element={<AtlasOverviewPage />} />
              <Route path="/build" element={<BuildPlanningOverviewPage />} />
              <Route path="/leveling" element={<LevelingOverviewPage />} />
              {/* Dynamically generate routes from registry — at least ONE thing feels like proper architecture */}
              {modules.filter(mod => !mod.external).map(mod => (
                <Route key={mod.id} path={mod.route} element={<mod.component />} />
              ))}
              {/* Catch-all: lost souls get sent home. No 404 page because we're optimists. */}
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </PatchNotesProvider>
        </LevelingModeProvider>
        </LevelingProgressProvider>
        </DesignProvider>
        </PinnedProvider>
        </PricesProvider>
      </LeagueProvider>
    </BrowserRouter>
  );
}
