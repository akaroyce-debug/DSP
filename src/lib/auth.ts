/**
 * Lightweight, env-based admin authentication.
 *
 * On login we issue an HMAC-signed session cookie (no DB needed). The token
 * is verified in middleware (edge runtime) and server actions using the Web
 * Crypto API, so it works everywhere Next.js runs.
 *
 * This is intentionally simple and secure-by-default for a single admin.
 * Note: this can be upgraded to better-auth (multi-user, OAuth) later without
 * touching the UI — just swap the helpers below.
 */

export const ADMIN_COOKIE = "royce_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short (min 16 chars).",
    );
  }
  return secret;
}

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = "";
  for (const b of arr) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return base64url(sig);
}

/** Create a signed session token valid for SESSION_TTL_SECONDS. */
export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `admin.${expires}`;
  const signature = await hmac(payload);
  return `${payload}.${signature}`;
}

/** Verify a session token's signature and expiry. Constant-time-ish compare. */
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expiresRaw, signature] = parts;
  const payload = `${role}.${expiresRaw}`;
  const expected = await hmac(payload);
  if (signature.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (mismatch !== 0) return false;
  const expires = Number(expiresRaw);
  return Number.isFinite(expires) && expires > Date.now();
}

/** Validate a submitted password against the configured admin password. */
export function isValidPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (submitted.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= submitted.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
