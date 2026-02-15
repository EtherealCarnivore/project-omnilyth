/*
 * PricesContext.jsx — The thinnest context wrapper known to mankind.
 *
 * This file exists solely to lift usePrices() into React context so every
 * child component can access price data without prop drilling. In Java
 * this would be a singleton with @Inject. Here we need a Provider, a Context,
 * a custom hook, and a partridge in a pear tree. 23 lines to share one object.
 * My FIX protocol parser has a better data model than this.
 */
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
