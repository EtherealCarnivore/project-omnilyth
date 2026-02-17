/**
 * Verify Password - Check if a password matches the configured hash
 *
 * Usage: node scripts/verify-password.js "password-to-test"
 */

import { createHash } from 'crypto';

const testPassword = process.argv[2];

// Values currently in BetaGate.jsx
const SALT = 'b17dcdd27b23987d5fee342af0cde539';
const EXPECTED_HASH = '44ccaf8bfc9415d6741ee12f1526d07667fb136be984f5af044de828b1c70554';
const ITERATIONS = 100000;

if (!testPassword) {
  console.error('❌ Error: Please provide a password to test');
  console.log('\nUsage: node scripts/verify-password.js "password-to-test"');
  process.exit(1);
}

function hashPassword(password, salt, iterations = 100000) {
  let hash = password + salt;
  for (let i = 0; i < iterations; i++) {
    hash = createHash('sha256').update(hash).digest('hex');
  }
  return hash;
}

const computedHash = hashPassword(testPassword, SALT, ITERATIONS);

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('\n🔍 Password Verification');
console.log('\n═══════════════════════════════════════════════════════════════\n');
console.log(`Password tested: "${testPassword}"`);
console.log(`\nExpected hash: ${EXPECTED_HASH}`);
console.log(`Computed hash: ${computedHash}`);
console.log(`\nMatch: ${computedHash === EXPECTED_HASH ? '✅ YES' : '❌ NO'}`);
console.log('\n═══════════════════════════════════════════════════════════════\n');

if (computedHash === EXPECTED_HASH) {
  console.log('✅ Password is CORRECT - this will work in production!');
} else {
  console.log('❌ Password is WRONG - this will NOT work!');
  console.log('\nThe hash in BetaGate.jsx does not match this password.');
  console.log('You need to regenerate the hash or use the correct password.\n');
}
