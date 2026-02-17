/**
 * Simple SHA-512 Hash Generator (no iterations)
 * Usage: node scripts/hash-simple.js "your-password"
 */

import { createHash } from 'crypto';

const password = process.argv[2] || 'privat3Be7@_SUB_TO_IVA_NOOBS_uwu^.^_';

const hash = createHash('sha512').update(password).digest('hex');

console.log('\n✅ Single SHA-512 Hash\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`\nPassword: "${password}"`);
console.log(`Hash: ${hash}`);
console.log('\n═══════════════════════════════════════════════════════════════\n');
console.log('📋 Copy to BetaGate.jsx:\n');
console.log(`const PASSWORD_HASH = '${hash}';`);
console.log('\n');
