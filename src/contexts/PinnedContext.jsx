/*
 * PinnedContext.jsx — User-pinned modules, persisted to localStorage.
 *
 * This is basically a database with zero query language, no indexes, no ACID
 * guarantees, a 5MB storage limit, and it gets wiped when someone clears their browser.
 * My trading system persists to a lock-free ring buffer with nanosecond writes.
 * This one persists to... JSON.stringify into a browser string store. We are not the same.
 */
import { createContext, useContext, useState, useCallback } from 'react';

// LINK: stored values are module IDs from src/modules/registry.js. Renaming
// a module's `id` field strands every existing user's pin to that tool —
// we don't validate against the registry on load, so orphaned IDs sit in
// localStorage forever. If you must rename a registry id, ship a one-shot
// migration that rewrites this key.
const PINS_KEY = 'omnilyth_pinned_modules';

// Wrap everything in try/catch because localStorage can throw in incognito mode.
// Remember when storage just worked? Pepperidge Farm remembers.
//
// QUIRK: returning [] on failure means an incognito user sees their pins
// "save" successfully (state updates) but they vanish on refresh. There's
// no UX signal for this. If you ever add a "could not save" toast, it
// belongs in savePins() — by the time loadPins runs we're already past
// the point where the user can react.
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
  // In Java I'd use a ConcurrentHashSet and this wouldn't even be a conversation.
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
