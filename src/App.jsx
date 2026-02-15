import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeagueProvider } from './contexts/LeagueContext';
import { PricesProvider } from './contexts/PricesContext';
import { PinnedProvider } from './contexts/PinnedContext';
import AppShell from './layout/AppShell';
import HomePage from './pages/HomePage';
import modules from './modules/registry';

export default function App() {
  return (
    <BrowserRouter basename="/omnilyth-core-public">
      <LeagueProvider>
        <PricesProvider>
        <PinnedProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              {modules.filter(mod => !mod.external).map(mod => (
                <Route key={mod.id} path={mod.route} element={<mod.component />} />
              ))}
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </PinnedProvider>
        </PricesProvider>
      </LeagueProvider>
    </BrowserRouter>
  );
}
