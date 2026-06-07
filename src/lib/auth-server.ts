import { cookies } from 'next/headers';
import type { SessionUser } from '@/types';
import { SESSION_COOKIE } from '@/lib/session';
import { parseSignedSession } from '@/lib/session-crypto';
import { getUserRepository } from '@/providers/container.server';

export async function getServerSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  const fromCookie = parseSignedSession(raw);
  if (!fromCookie) return null;

  try {
    const profile = await getUserRepository().getById(fromCookie.id);
    if (!profile) return null;
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      approved: profile.approved,
      rejected: profile.rejected,
    };
  } catch {
    return null;
  }
}

export function requireSession(user: SessionUser | null): SessionUser {
  if (!user) throw new Error('Unauthorized');
  return user;
}
