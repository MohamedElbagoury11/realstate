import type { SessionUser } from '@/types';

const SESSION_SECRET =
  process.env.SESSION_SECRET ?? process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? 'dev-insecure-change-me';

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
}

export async function parseSessionCookieEdge(
  value: string | undefined,
): Promise<SessionUser | null> {
  if (!value) return null;
  const dot = value.lastIndexOf('.');
  if (dot <= 0) return null;
  const payloadB64 = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  try {
    const key = await importKey();
    const signatureBytes = new Uint8Array(base64UrlDecode(signature));
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      new TextEncoder().encode(payloadB64),
    );
    if (!valid) return null;
    const parsed = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payloadB64)),
    ) as SessionUser;
    if (!parsed.id || !parsed.email || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}
