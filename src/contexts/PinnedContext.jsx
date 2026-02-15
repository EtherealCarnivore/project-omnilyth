import { createContext, useContext, useState, useCallback } from 'react';

const PINS_KEY = 'omnilyth_pinned_modules';

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
