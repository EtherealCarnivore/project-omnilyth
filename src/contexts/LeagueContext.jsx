import { createContext, useContext, useState } from 'react';

export const LEAGUES = [
  { value: 'Phrecia 2.0', label: 'Phrecia 2.0' },
  { value: 'Keepers', label: 'Keepers' },
  { value: 'Hardcore Phrecia 2.0', label: 'HC Phrecia 2.0' },
  { value: 'Hardcore', label: 'Hardcore' },
  { value: 'Hardcore Keepers', label: 'HC Keepers' },
  { value: 'Standard', label: 'Standard' },
];

const LeagueContext = createContext(null);

export function LeagueProvider({ children }) {
  const [league, setLeague] = useState(LEAGUES[0].value);
  return (
    <LeagueContext.Provider value={{ league, setLeague }}>
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const ctx = useContext(LeagueContext);
  if (!ctx) throw new Error('useLeague must be used within LeagueProvider');
  return ctx;
}
