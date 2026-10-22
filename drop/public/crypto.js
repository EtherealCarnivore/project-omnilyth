// Shared by the upload page and the download page.
//
// Container format ("ODROP1"):
//   magic(6) | version u8 | nonce(8) | chunkSize u32 | nameLen u16 | encName(nameLen)
//   then one AES-GCM record per plaintext chunk: ciphertext(chunkLen) + tag(16).
// IV for record i = nonce(8) || u32(i). Record 0 is the filename; chunks start at 1.
// Key: random 256-bit AES-GCM key carried in the link's URL fragment, which the
// browser never sends to the server.

export const CHUNK_SIZE = 1 << 20; // 1 MiB plaintext per record
export const TAG = 16;
const MAGIC = new TextEncoder().encode('ODROP1');
const VERSION = 1;
export const HEADER_FIXED = MAGIC.length + 1 + 8 + 4 + 2;

export function randomKey() {
  return crypto.getRandomValues(new Uint8Array(32));
}

export function randomNonce() {
  return crypto.getRandomValues(new Uint8Array(8));
}

export function importKey(raw, usage) {
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, [usage]);
}

function iv(nonce, counter) {
  const out = new Uint8Array(12);
  out.set(nonce, 0);
  new DataView(out.buffer).setUint32(8, counter);
  return out;
}

export async function encryptRecord(key, nonce, index, bytes) {
  return new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv(nonce, index) }, key, bytes));
}

export async function decryptRecord(key, nonce, index, bytes) {
  return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv(nonce, index) }, key, bytes));
}

export async function buildHeader(key, nonce, name, chunkSize = CHUNK_SIZE) {
  const encName = await encryptRecord(key, nonce, 0, new TextEncoder().encode(name));
  const h = new Uint8Array(HEADER_FIXED + encName.length);
  const dv = new DataView(h.buffer);
  let o = 0;
  h.set(MAGIC, o); o += MAGIC.length;
  h[o++] = VERSION;
  h.set(nonce, o); o += 8;
  dv.setUint32(o, chunkSize); o += 4;
  dv.setUint16(o, encName.length); o += 2;
  h.set(encName, o);
  return h;
}

// Returns null while `bytes` does not yet contain the whole header.
export function parseHeader(bytes) {
  if (bytes.length < HEADER_FIXED) return null;
  for (let i = 0; i < MAGIC.length; i++) if (bytes[i] !== MAGIC[i]) throw new Error('Not an Omnilyth Drop file');
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let o = MAGIC.length;
  const version = bytes[o++];
  if (version !== VERSION) throw new Error('Unsupported container version ' + version);
  const nonce = bytes.slice(o, o + 8); o += 8;
  const chunkSize = dv.getUint32(o); o += 4;
  const nameLen = dv.getUint16(o); o += 2;
  if (bytes.length < o + nameLen) return null;
  const encName = bytes.slice(o, o + nameLen); o += nameLen;
  return { nonce, chunkSize, encName, headerLen: o };
}

export function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function unb64url(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function fmtBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(0) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / 1048576).toFixed(1) + ' MB';
  return (n / 1073741824).toFixed(2) + ' GB';
}

export function fmtCountdown(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return String(Math.floor(s / 60)) + ':' + String(s % 60).padStart(2, '0');
}
