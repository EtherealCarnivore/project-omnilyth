/**
 * Password Hash Generator
 * Run this script to generate a secure hash for your password
 *
 * Usage: node scripts/generate-password-hash.js "your-password-here"
 */

import { createHash, randomBytes } from 'crypto';

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Please provide a password');
  console.log('\nUsage: node scripts/generate-password-hash.js "your-password-here"');
  console.log('\nExample: node scripts/generate-password-hash.js "my-super-secret-password-123"');
  process.exit(1);
}

// Generate a random salt
const salt = randomBytes(16).toString('hex');

// Hash with multiple iterations for security (PBKDF2-like)
function hashPassword(password, salt, iterations = 100000) {
  let hash = password + salt;
  for (let i = 0; i < iterations; i++) {
    hash = createHash('sha256').update(hash).digest('hex');
  }
  return hash;
}

const hash = hashPassword(password, salt);

console.log('\n✅ Password hash generated successfully!\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n📋 Copy these values to src/components/BetaGate.jsx:\n');
console.log(`const SALT = '${salt}';`);
console.log(`const HASH = '${hash}';`);
console.log(`const ITERATIONS = 100000;`);
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('\n⚠️  Security Notes:');
console.log('   • This is client-side only - not suitable for highly sensitive data');
console.log('   • Good enough for private beta among friends');
console.log('   • Users who inspect source code can still bypass this');
console.log('   • For production auth, use Auth0/Clerk/Netlify Identity\n');
