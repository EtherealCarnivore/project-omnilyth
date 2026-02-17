/**
 * Verify Password - Simple Version
 *
 * Usage: node scripts/verify-password-simple.js "password-to-test"
 */

import { createHash } from 'crypto';

const testPassword = process.argv[2];

// Values currently in BetaGate.jsx
const EXPECTED_HASH = 'f75b20dd0c109da2d3dbce9a23f30e4cfe5ace7b3c070402fdba24099ed366431396fe22f6c8888767b08b10f3a3e160b98acd568096c3af3021b2b2f276dd82';
const ITERATIONS = 500000;

if (!testPassword) {
  console.error('❌ Error: Please provide a password to test');
  console.log('\nUsage: node scripts/verify-password-simple.js "password-to-test"');
  process.exit(1);
}

function strongHash(password, iterations) {
  let hash = password;
  for (let i = 0; i < iterations; i++) {
    hash = createHash('sha512').update(hash).digest('hex');
  }
  return hash;
}

const computedHash = strongHash(testPassword, ITERATIONS);

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
}
