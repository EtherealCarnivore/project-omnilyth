/**
 * useGemSearch
 * Custom hook for fuzzy searching gems with class filtering
 * Uses Fuse.js for fuzzy matching
 */

import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { gemAvailabilityData } from '../data/leveling/gemAvailability';

const FUSE_OPTIONS = {
  keys: ['name'],
  threshold: 0.3, // 0 = exact match, 1 = match anything
  ignoreLocation: true,
  minMatchCharLength: 2
};

/**
 * Check if gem is available for the given class
 */
function isGemAvailableForClass(gem, className) {
  if (className === 'all') return true;

  // Normalize class name (capitalize first letter)
  const normalizedClass = className.charAt(0).toUpperCase() + className.slice(1);

  return gem.availability.some(source =>
    source.classes.length === 0 || source.classes.includes(normalizedClass)
  );
}

/**
 * Get earliest act where gem is available for class
 */
function getEarliestAct(gem, className) {
  const normalizedClass = className.charAt(0).toUpperCase() + className.slice(1);

  const availableSources = gem.availability.filter(source =>
    className === 'all' ||
    source.classes.length === 0 ||
    source.classes.includes(normalizedClass)
  );

  if (availableSources.length === 0) return Infinity;

  return Math.min(...availableSources.map(s => s.act));
}

/**
 * Custom hook for gem searching
 */
export function useGemSearch(searchTerm, selectedClass = 'all', options = {}) {
  const {
    limit = 50,
    sortBy = 'relevance' // 'relevance', 'name', 'act'
  } = options;

  // Convert gem data object to array
  const gemArray = useMemo(() => {
    return Object.values(gemAvailabilityData);
  }, []);

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(gemArray, FUSE_OPTIONS);
  }, [gemArray]);

  // Perform search and filter
  const results = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) {
      // No search term - return all gems for selected class
      const filtered = gemArray.filter(gem =>
        isGemAvailableForClass(gem, selectedClass)
      );

      // Sort by name by default when no search
      return filtered
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, limit);
    }

    // Perform fuzzy search
    const searchResults = fuse.search(searchTerm);

    // Filter by class availability
    const filtered = searchResults
      .map(result => result.item)
      .filter(gem => isGemAvailableForClass(gem, selectedClass));

    // Sort results
    let sorted = filtered;
    if (sortBy === 'name') {
      sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'act') {
      sorted = [...filtered].sort((a, b) => {
        const actA = getEarliestAct(a, selectedClass);
        const actB = getEarliestAct(b, selectedClass);
        return actA - actB;
      });
    }
    // 'relevance' keeps Fuse.js order

    return sorted.slice(0, limit);
  }, [searchTerm, selectedClass, sortBy, limit, fuse, gemArray]);

  return {
    results,
    totalCount: results.length,
    hasResults: results.length > 0
  };
}

/**
 * Get gem availability for a specific class
 */
export function getGemAvailabilityForClass(gemName, className) {
  const gem = gemAvailabilityData[gemName];
  if (!gem) return null;

  const normalizedClass = className.charAt(0).toUpperCase() + className.slice(1);

  if (className === 'all') {
    return gem.availability;
  }

  return gem.availability.filter(source =>
    source.classes.length === 0 || source.classes.includes(normalizedClass)
  );
}

/**
 * Get best availability source for class (quest > vendor > siosa > lilly)
 */
export function getBestAvailability(gemName, className) {
  const availability = getGemAvailabilityForClass(gemName, className);
  if (!availability || availability.length === 0) return null;

  const normalizedClass = className.charAt(0).toUpperCase() + className.slice(1);

  // Priority: quest (for this class) > vendor > siosa > lilly
  const quest = availability.find(s =>
    s.source === 'quest' &&
    (s.classes.length === 0 || s.classes.includes(normalizedClass))
  );
  if (quest) return quest;

  const vendor = availability.find(s => s.source === 'vendor');
  if (vendor) return vendor;

  const siosa = availability.find(s => s.source === 'siosa');
  if (siosa) return siosa;

  const lilly = availability.find(s => s.source === 'lilly');
  return lilly;
}

/**
 * Get all gems available in specific act for class
 */
export function getGemsForAct(actNumber, className = 'all') {
  const normalizedClass = className.charAt(0).toUpperCase() + className.slice(1);

  const actGems = [];

  for (const gem of Object.values(gemAvailabilityData)) {
    const availability = gem.availability.filter(a =>
      a.act === actNumber &&
      (className === 'all' ||
       a.classes.length === 0 ||
       a.classes.includes(normalizedClass))
    );

    if (availability.length > 0) {
      actGems.push({
        ...gem,
        actAvailability: availability
      });
    }
  }

  return actGems;
}
