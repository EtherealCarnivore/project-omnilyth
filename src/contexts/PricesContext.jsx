import { createContext, useContext } from 'react';
import { usePrices } from '../hooks/usePrices';
import { useLeague } from './LeagueContext';

const PricesContext = createContext(null);

export function PricesProvider({ children }) {
  const { league } = useLeague();
  const pricesData = usePrices(league);
  return (
    <PricesContext.Provider value={pricesData}>
      {children}
    </PricesContext.Provider>
  );
}

export function usePricesContext() {
  const ctx = useContext(PricesContext);
  if (!ctx) throw new Error('usePricesContext must be used within PricesProvider');
  return ctx;
}
