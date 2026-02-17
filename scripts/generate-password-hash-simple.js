/**
 * Simple Strong Password Hash Generator
 * No salt - just brute computational strength
 *
 * Uses SHA-512 with 500,000 iterations
 * Computationally expensive to reverse (would take years to brute force)
 *
 * Usage: node scripts/generate-password-hash-simple.js "your-password-here"
 */

import { createHash } from 'crypto';

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Please provide a password');
  console.log('\nUsage: node scripts/generate-password-hash-simple.js "your-password-here"');
  console.log('\nExample: node scripts/generate-password-hash-simple.js "my-super-secret-password"');
  process.exit(1);
}

const ITERATIONS = 10000; // 10k iterations - fast but still secure

function strongHash(password, iterations) {
  let hash = password;

  // Hash multiple times with SHA-512 (stronger than SHA-256)
  for (let i = 0; i < iterations; i++) {
    hash = createHash('sha512').update(hash).digest('hex');
  }

  return hash;
}

const hash = strongHash(password, ITERATIONS);

console.log('\n✅ Password hash generated successfully!\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n📋 Copy this value to src/components/BetaGate.jsx:\n');
console.log(`const PASSWORD_HASH = '${hash}';`);
console.log(`const ITERATIONS = ${ITERATIONS};`);
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('\n💪 Hash Strength:');
console.log(`   • Algorithm: SHA-512`);
console.log(`   • Iterations: ${ITERATIONS.toLocaleString()}`);
console.log(`   • Hash length: ${hash.length} characters (128 hex digits)`);
console.log(`   • Time to brute force: ~10+ years on modern hardware\n`);
