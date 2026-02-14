import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeagueProvider } from './contexts/LeagueContext';
import { PricesProvider } from './contexts/PricesContext';
import AppShell from './layout/AppShell';
import HomePage from './pages/HomePage';
import modules from './modules/registry';

export default function App() {
  return (
    <BrowserRouter basename="/omnilyth-core-public">
      <LeagueProvider>
        <PricesProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              {modules.map(mod => (
                <Route key={mod.id} path={mod.route} element={<mod.component />} />
              ))}
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </PricesProvider>
      </LeagueProvider>
    </BrowserRouter>
  );
}
