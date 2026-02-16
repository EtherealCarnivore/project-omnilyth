/**
 * useRegexLibrary Hook
 *
 * React hook for managing regex library operations with real-time state updates
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getRegexLibrary,
  addPattern,
  updatePattern,
  deletePattern,
  clearAllPatterns,
  getStorageInfo,
  areCookiesEnabled,
  migrateCookieDataToLocalStorage
} from '../utils/regexLibrary';

export function useRegexLibrary() {
  const [patterns, setPatterns] = useState([]);
  const [storageInfo, setStorageInfo] = useState({
    patternCount: 0,
    currentSize: 0,
    maxSize: 4096,
    percentUsed: 0,
    nearLimit: false,
    estimatedSlotsRemaining: 0
  });
  const [cookiesEnabled, setCookiesEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load patterns from cookie on mount
  const loadPatterns = useCallback(() => {
    try {
      setLoading(true);
      const library = getRegexLibrary();
      setPatterns(library.patterns);
      setStorageInfo(getStorageInfo());
      setCookiesEnabled(areCookiesEnabled());
    } catch (error) {
      console.error('Failed to load patterns:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Auto-migrate from cookies to localStorage on first load
    migrateCookieDataToLocalStorage();
    loadPatterns();
  }, [loadPatterns]);

  // Add a new pattern
  const add = useCallback(async (pattern) => {
    const result = addPattern(pattern);

    if (result.success) {
      loadPatterns(); // Reload to get fresh state
    }

    return result;
  }, [loadPatterns]);

  // Update an existing pattern
  const update = useCallback(async (patternId, updates) => {
    const result = updatePattern(patternId, updates);

    if (result.success) {
      loadPatterns();
    }

    return result;
  }, [loadPatterns]);

  // Delete a pattern
  const remove = useCallback(async (patternId) => {
    const result = deletePattern(patternId);

    if (result.success) {
      loadPatterns();
    }

    return result;
  }, [loadPatterns]);

  // Clear all patterns
  const clearAll = useCallback(async () => {
    const result = clearAllPatterns();

    if (result.success) {
      loadPatterns();
    }

    return result;
  }, [loadPatterns]);

  // Search patterns by name or pattern text
  const search = useCallback((query) => {
    if (!query || query.trim() === '') {
      return patterns;
    }

    const lowerQuery = query.toLowerCase();
    return patterns.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.pattern.toLowerCase().includes(lowerQuery) ||
      p.toolLabel.toLowerCase().includes(lowerQuery)
    );
  }, [patterns]);

  // Filter patterns by tool
  const filterByTool = useCallback((toolId) => {
    if (!toolId || toolId === 'all') {
      return patterns;
    }

    return patterns.filter(p => p.tool === toolId);
  }, [patterns]);

  // Get a single pattern by ID
  const getById = useCallback((patternId) => {
    return patterns.find(p => p.id === patternId);
  }, [patterns]);

  // Check if a pattern exists by exact match
  const exists = useCallback((pattern) => {
    return patterns.some(p => p.pattern === pattern);
  }, [patterns]);

  return {
    patterns,
    storageInfo,
    cookiesEnabled,
    loading,
    add,
    update,
    remove,
    clearAll,
    search,
    filterByTool,
    getById,
    exists,
    reload: loadPatterns
  };
}
