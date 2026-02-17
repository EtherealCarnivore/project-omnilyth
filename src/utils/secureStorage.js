/**
 * Secure Storage Wrapper
 * Encrypts data before storing in localStorage
 * Uses Web Crypto API for encryption
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

// Get a device-specific key (simple version)
// In production, consider more sophisticated key management
function getDeviceKey() {
  let key = localStorage.getItem('__device_key');
  if (!key) {
    // Generate a random device key on first use
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    key = btoa(String.fromCharCode(...array));
    localStorage.setItem('__device_key', key);
  }
  return key;
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
