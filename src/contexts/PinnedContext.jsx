/*
 * PinnedContext.jsx — User-pinned modules, persisted to localStorage.
 *
 * This is basically a database with zero query language, no indexes,
 * a 5MB storage limit, and it gets wiped when someone clears their browser.
 * But hey, at least there's no ORM to configure.
 */
import { createContext, useContext, useState, useCallback } from 'react';

const PINS_KEY = 'omnilyth_pinned_modules';

// Wrap everything in try/catch because localStorage can throw in incognito mode.
// Remember when storage just worked? Pepperidge Farm remembers.
function loadPins() {
  try {
    const raw = localStorage.getItem(PINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function savePins(pins) {
  localStorage.setItem(PINS_KEY, JSON.stringify(pins));
}

const PinnedContext = createContext(null);

export function PinnedProvider({ children }) {
  const [pinnedIds, setPinnedIds] = useState(loadPins);

  const togglePin = useCallback((id) => {
    setPinnedIds(prev => {
      const next = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      savePins(next);
      return next;
    });
  }, []);

  // O(n) lookup every render. A Set would be faster but React won't detect Set mutations
  // for re-renders, so here we are with .includes() like animals.
  const isPinned = useCallback((id) => pinnedIds.includes(id), [pinnedIds]);

  return (
    <PinnedContext.Provider value={{ pinnedIds, togglePin, isPinned }}>
      {children}
    </PinnedContext.Provider>
  );
}

export function usePinned() {
  const ctx = useContext(PinnedContext);
  if (!ctx) throw new Error('usePinned must be used within PinnedProvider');
  return ctx;
}
