/**
 * Secure Storage Wrapper
 * Encrypts data before storing in localStorage
 * Uses Web Crypto API for encryption
 *
 * CONTRACT: stored payload format is fixed:
 *   base64( salt[16] || iv[12] || ciphertext )
 * Every consumer that reads from localStorage with this module's keys
 * MUST decode through decryptData(). Bypassing it (e.g. JSON.parse on the
 * raw string) yields garbage. Conversely, mixing this with non-encrypted
 * keys in the same key-namespace silently fails to decrypt — keep
 * encrypted and unencrypted localStorage keys in disjoint prefixes.
 *
 * CONTRACT: PBKDF2 with 100,000 iterations + AES-256-GCM. Reducing
 * iterations is a security regression even if it speeds up app boot.
 * The Web Crypto API is required (no polyfill); browsers without it
 * will throw on first use — there is intentionally no fallback path.
 */

// Generate a key from a password (derived key)
async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Encrypt data
async function encryptData(data, password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encoder.encode(JSON.stringify(data))
  );

  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  // Convert to base64 for storage
  return btoa(String.fromCharCode(...combined));
}

// Decrypt data
async function decryptData(encryptedBase64, password) {
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encrypted = combined.slice(28);

  const key = await deriveKey(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encrypted
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted));
}

// Get a device-specific key using obfuscated storage
// NOTE: This provides defense-in-depth but is NOT fully secure against XSS
// True security requires preventing XSS vulnerabilities in the first place
function getDeviceKey() {
  const keyName = '__dk_v1';

  // Try to retrieve existing key
  let storedData = localStorage.getItem(keyName);

  if (!storedData) {
    // Generate a random device key on first use
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const key = btoa(String.fromCharCode(...array));

    // Obfuscate the key before storage (basic XOR with browser fingerprint)
    // This doesn't prevent determined attackers but raises the bar
    const fingerprint = getSimpleFingerprint();
    const obfuscated = xorStrings(key, fingerprint);

    localStorage.setItem(keyName, obfuscated);
    return key;
  }

  // De-obfuscate on retrieval
  const fingerprint = getSimpleFingerprint();
  return xorStrings(storedData, fingerprint);
}

// Generate a simple browser fingerprint (not for tracking, just key derivation)
function getSimpleFingerprint() {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < components.length; i++) {
    const char = components.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

// XOR two strings for basic obfuscation (handles both encoding and decoding)
function xorStrings(str, key) {
  // Try to decode if it's base64 (for decoding path)
  let input = str;
  try {
    // If it's base64, decode it first
    if (/^[A-Za-z0-9+/=]+$/.test(str)) {
      input = atob(str);
    }
  } catch {
    // Not base64, use as-is
  }

  let result = '';
  for (let i = 0; i < input.length; i++) {
    const strChar = input.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(strChar ^ keyChar);
  }

  // Only encode if we're storing (input was not base64)
  return /^[A-Za-z0-9+/=]+$/.test(str) ? result : btoa(result);
}

/**
 * Secure Storage API
 */
export const secureStorage = {
  /**
   * Set an item with encryption
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   */
  async setItem(key, value) {
    try {
      const deviceKey = getDeviceKey();
      const encrypted = await encryptData(value, deviceKey);
      localStorage.setItem(`secure_${key}`, encrypted);
      return true;
    } catch (error) {
      console.error('Secure storage set error:', error);
      return false;
    }
  },

  /**
   * Get an item with decryption
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if not found or decryption fails
   */
  async getItem(key, defaultValue = null) {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return defaultValue;

      const deviceKey = getDeviceKey();
      const decrypted = await decryptData(encrypted, deviceKey);
      return decrypted;
    } catch (error) {
      console.error('Secure storage get error:', error);
      return defaultValue;
    }
  },

  /**
   * Remove an item
   * @param {string} key - Storage key
   */
  removeItem(key) {
    localStorage.removeItem(`secure_${key}`);
  },

  /**
   * Clear all secure items
   */
  clear() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

/**
 * Migrate existing localStorage to secure storage
 * @param {string[]} keys - Array of keys to migrate
 */
export async function migrateToSecureStorage(keys) {
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        const parsed = JSON.parse(value);
        await secureStorage.setItem(key, parsed);
        // Keep old key for backwards compatibility during transition
        // localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to migrate ${key}:`, error);
      }
    }
  }
}

/**
 * Example usage:
 *
 * // Set encrypted data
 * await secureStorage.setItem('user_preferences', { theme: 'dark' });
 *
 * // Get encrypted data
 * const prefs = await secureStorage.getItem('user_preferences', { theme: 'light' });
 *
 * // Remove
 * secureStorage.removeItem('user_preferences');
 *
 * // Migrate existing data
 * await migrateToSecureStorage(['pinned_modules', 'design_variant']);
 */
