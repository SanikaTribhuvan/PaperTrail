/**
 * SHA-256 hashing using native Web Crypto API.
 * Preserved from PaperTrailDemo.jsx reference — do not modify algorithm.
 */
export async function generateSHA256(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Truncate a 64-char hex hash for display.
 */
export function shortHash(hash) {
  if (!hash) return '—';
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

/**
 * Generate a document ID with prefix and random suffix.
 */
export function generateDocId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DOC-MH-${year}-${rand}`;
}

/**
 * Generate a checkpoint ID.
 */
export function generateCheckpointId() {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `CHK-${rand}`;
}
