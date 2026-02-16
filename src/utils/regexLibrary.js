/**
 * Regex Library localStorage Utilities
 *
 * Manages saving, loading, and deleting regex patterns to browser localStorage.
 * Maximum storage: ~5-10MB (thousands of patterns)
 *
 * MIGRATION NOTE: Switched from cookies (4KB) to localStorage (5-10MB) for better capacity.
 */

const STORAGE_KEY = 'omnilyth_regex_library';
const STORAGE_WARNING_THRESHOLD = 0.8; // Warn at 80% capacity
const APPROXIMATE_MAX_SIZE = 5 * 1024 * 1024; // 5MB (conservative estimate)

/**
 * Get all saved regex patterns from localStorage
 * @returns {Object} Library data with version and patterns array
 */
export function getRegexLibrary() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return { version: 1, patterns: [] };
    }

    const parsed = JSON.parse(stored);

    // Validate structure
    if (!parsed.version || !Array.isArray(parsed.patterns)) {
      console.warn('Invalid regex library data, resetting...');
      return { version: 1, patterns: [] };
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load regex library:', error);
    return { version: 1, patterns: [] };
  }
}

/**
 * Save regex library to localStorage
 * @param {Object} library - Library data to save
 * @returns {Object} Result with success flag and optional error
 */
export function saveRegexLibrary(library) {
  try {
    const json = JSON.stringify(library);
    const sizeInBytes = new Blob([json]).size;

    // Check size (conservative 5MB limit)
    if (sizeInBytes > APPROXIMATE_MAX_SIZE) {
      return {
        success: false,
        error: 'STORAGE_FULL',
        message: 'localStorage limit reached. Please delete some patterns.',
        currentSize: sizeInBytes,
        maxSize: APPROXIMATE_MAX_SIZE
      };
    }

    // Warn if approaching limit
    const percentUsed = sizeInBytes / APPROXIMATE_MAX_SIZE;
    if (percentUsed > STORAGE_WARNING_THRESHOLD) {
      console.warn(`localStorage at ${Math.round(percentUsed * 100)}% capacity`);
    }

    localStorage.setItem(STORAGE_KEY, json);

    return {
      success: true,
      currentSize: sizeInBytes,
      maxSize: APPROXIMATE_MAX_SIZE,
      percentUsed: Math.round(percentUsed * 100)
    };
  } catch (error) {
    // Handle QuotaExceededError
    if (error.name === 'QuotaExceededError') {
      return {
        success: false,
        error: 'STORAGE_FULL',
        message: 'localStorage is full. Please delete some patterns.',
        currentSize: 0,
        maxSize: APPROXIMATE_MAX_SIZE
      };
    }

    console.error('Failed to save regex library:', error);
    return {
      success: false,
      error: 'SAVE_FAILED',
      message: error.message
    };
  }
}

/**
 * Add a new regex pattern to the library
 * @param {Object} pattern - Pattern object { name, pattern, tool, toolLabel }
 * @returns {Object} Result with success flag, patternId, and optional error
 */
export function addPattern(pattern) {
  try {
    const library = getRegexLibrary();
    const now = new Date().toISOString();

    const newPattern = {
      id: generateUUID(),
      name: pattern.name || 'Untitled Pattern',
      pattern: pattern.pattern,
      tool: pattern.tool,
      toolLabel: pattern.toolLabel,
      createdAt: now,
      updatedAt: now
    };

    library.patterns.unshift(newPattern); // Add to beginning

    const result = saveRegexLibrary(library);

    if (result.success) {
      return {
        success: true,
        patternId: newPattern.id,
        pattern: newPattern,
        storageInfo: {
          percentUsed: result.percentUsed,
          nearLimit: result.percentUsed > STORAGE_WARNING_THRESHOLD * 100
        }
      };
    } else {
      return result;
    }
  } catch (error) {
    console.error('Failed to add pattern:', error);
    return {
      success: false,
      error: 'ADD_FAILED',
      message: error.message
    };
  }
}

/**
 * Update an existing regex pattern
 * @param {string} patternId - UUID of pattern to update
 * @param {Object} updates - Fields to update
 * @returns {Object} Result with success flag
 */
export function updatePattern(patternId, updates) {
  try {
    const library = getRegexLibrary();
    const patternIndex = library.patterns.findIndex(p => p.id === patternId);

    if (patternIndex === -1) {
      return {
        success: false,
        error: 'PATTERN_NOT_FOUND',
        message: `Pattern with ID ${patternId} not found`
      };
    }

    library.patterns[patternIndex] = {
      ...library.patterns[patternIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const result = saveRegexLibrary(library);
    return result;
  } catch (error) {
    console.error('Failed to update pattern:', error);
    return {
      success: false,
      error: 'UPDATE_FAILED',
      message: error.message
    };
  }
}

/**
 * Delete a regex pattern from the library
 * @param {string} patternId - UUID of pattern to delete
 * @returns {Object} Result with success flag
 */
export function deletePattern(patternId) {
  try {
    const library = getRegexLibrary();
    const originalLength = library.patterns.length;

    library.patterns = library.patterns.filter(p => p.id !== patternId);

    if (library.patterns.length === originalLength) {
      return {
        success: false,
        error: 'PATTERN_NOT_FOUND',
        message: `Pattern with ID ${patternId} not found`
      };
    }

    const result = saveRegexLibrary(library);
    return result;
  } catch (error) {
    console.error('Failed to delete pattern:', error);
    return {
      success: false,
      error: 'DELETE_FAILED',
      message: error.message
    };
  }
}

/**
 * Clear all patterns from the library
 * @returns {Object} Result with success flag
 */
export function clearAllPatterns() {
  try {
    const library = { version: 1, patterns: [] };
    const result = saveRegexLibrary(library);
    return result;
  } catch (error) {
    console.error('Failed to clear library:', error);
    return {
      success: false,
      error: 'CLEAR_FAILED',
      message: error.message
    };
  }
}

/**
 * Get storage statistics
 * @returns {Object} Storage info
 */
export function getStorageInfo() {
  const library = getRegexLibrary();
  const json = JSON.stringify(library);
  const sizeInBytes = new Blob([json]).size;

  // Estimate average pattern size for remaining slots calculation
  const avgPatternSize = library.patterns.length > 0
    ? sizeInBytes / library.patterns.length
    : 300; // Default estimate: 300 bytes per pattern

  const remainingSpace = APPROXIMATE_MAX_SIZE - sizeInBytes;
  const estimatedSlotsRemaining = Math.floor(remainingSpace / avgPatternSize);

  return {
    patternCount: library.patterns.length,
    currentSize: sizeInBytes,
    maxSize: APPROXIMATE_MAX_SIZE,
    percentUsed: Math.round((sizeInBytes / APPROXIMATE_MAX_SIZE) * 100),
    nearLimit: (sizeInBytes / APPROXIMATE_MAX_SIZE) > STORAGE_WARNING_THRESHOLD,
    estimatedSlotsRemaining: Math.max(0, estimatedSlotsRemaining)
  };
}

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage works
 */
export function areCookiesEnabled() {
  // Renamed for backwards compatibility but now checks localStorage
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Migrate data from old cookie storage to localStorage
 * (Run this once to transfer existing patterns)
 */
export function migrateCookieDataToLocalStorage() {
  try {
    // Check if migration already done
    if (localStorage.getItem(`${STORAGE_KEY}_migrated`) === 'true') {
      return { success: true, message: 'Already migrated' };
    }

    // Try to read old cookie
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('omnilyth_regex_library='))
      ?.split('=')[1];

    if (!cookieValue) {
      // No old data to migrate
      localStorage.setItem(`${STORAGE_KEY}_migrated`, 'true');
      return { success: true, message: 'No data to migrate' };
    }

    // Parse and save to localStorage
    const decoded = decodeURIComponent(cookieValue);
    const library = JSON.parse(decoded);

    const result = saveRegexLibrary(library);

    if (result.success) {
      // Clear old cookie
      document.cookie = 'omnilyth_regex_library=; max-age=0; path=/; SameSite=Strict';
      localStorage.setItem(`${STORAGE_KEY}_migrated`, 'true');

      console.log(`✅ Migrated ${library.patterns.length} patterns from cookies to localStorage`);
      return {
        success: true,
        message: `Migrated ${library.patterns.length} patterns`,
        count: library.patterns.length
      };
    }

    return result;
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      error: 'MIGRATION_FAILED',
      message: error.message
    };
  }
}

/**
 * Generate a simple UUID (v4-like)
 * @returns {string} UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
