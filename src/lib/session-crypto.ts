import { createHmac, timingSafeEqual } from 'crypto';
import type { SessionUser } from '@/types';

const SESSION_SECRET =
  process.env.SESSION_SECRET ?? process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? 'dev-insecure-change-me';

function signPayload(payloadB64: string): string {
  return createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
}

export function serializeSignedSession(user: SessionUser): string {
  const payloadB64 = Buffer.from(JSON.stringify(user), 'utf8').toString('base64url');
  const signature = signPayload(payloadB64);
  return `${payloadB64}.${signature}`;
}

export function parseSignedSession(value: string | undefined): SessionUser | null {
  if (!value) return null;
  const dot = value.lastIndexOf('.');
  if (dot <= 0) return null;
  const payloadB64 = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  const expected = signPayload(payloadB64);
  try {
    const a = Buffer.from(signature, 'base64url');
    const b = Buffer.from(expected, 'base64url');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf8'),
    ) as SessionUser;
    if (!parsed.id || !parsed.email || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}
