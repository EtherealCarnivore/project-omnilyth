import { createContext, useContext, useState, useCallback } from 'react';

const DesignContext = createContext(null);
const STORAGE_KEY = 'omnilyth_design_variant';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { global: 'v1', overrides: {} };
}

export function DesignProvider({ children }) {
  const [state, setState] = useState(loadState);

  const setVariant = useCallback((variant) => {
    setState(prev => {
      const next = { ...prev, global: variant };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getVariantFor = useCallback((category) => {
    return state.overrides[category] || state.global;
  }, [state]);

  return (
    <DesignContext.Provider value={{
      variant: state.global,
      setVariant,
      getVariantFor,
    }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error('useDesign must be used within DesignProvider');
  return ctx;
}
