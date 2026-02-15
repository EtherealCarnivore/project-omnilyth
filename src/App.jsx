/*
 * App.jsx — The root of all frontend suffering.
 *
 * This is where React Router, context providers, and lazy-loaded modules
 * converge into a pyramid of angle brackets that would make any XML parser weep.
 * A backend dev wrote this and yes, I miss my main() function.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeagueProvider } from './contexts/LeagueContext';
import { PricesProvider } from './contexts/PricesContext';
import { PinnedProvider } from './contexts/PinnedContext';
import AppShell from './layout/AppShell';
import HomePage from './pages/HomePage';
import modules from './modules/registry';

export default function App() {
  return (
    // basename must match the GitHub Pages repo name — get this wrong and enjoy 404s in prod
    <BrowserRouter basename="/omnilyth-core-public">
      {/* Provider inception: league → prices → pinned. The nesting never ends. */}
      {/* In a sane world this would be middleware, but no, we get JSX turducken */}
      <LeagueProvider>
        <PricesProvider>
        <PinnedProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              {/* Dynamically generate routes from registry — at least ONE thing feels like proper architecture */}
              {modules.filter(mod => !mod.external).map(mod => (
                <Route key={mod.id} path={mod.route} element={<mod.component />} />
              ))}
              {/* Catch-all: lost souls get sent home. No 404 page because we're optimists. */}
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </PinnedProvider>
        </PricesProvider>
      </LeagueProvider>
    </BrowserRouter>
  );
}
