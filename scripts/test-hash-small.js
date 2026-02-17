/**
 * Test hash with small iterations to verify algorithm
 */

import { createHash } from 'crypto';

const password = "privat3Be7@_SUB_TO_IVA_NOOBS_uwu^.^_";
const ITERATIONS = 10;

function strongHash(password, iterations) {
  let hash = password;
  console.log(`Start: "${hash}"`);

  for (let i = 0; i < iterations; i++) {
    hash = createHash('sha512').update(hash).digest('hex');
    console.log(`Iteration ${i}: ${hash.substring(0, 32)}...`);
  }

  return hash;
}

const finalHash = strongHash(password, ITERATIONS);
console.log(`\nFinal hash: ${finalHash}`);
