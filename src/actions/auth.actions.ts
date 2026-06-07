'use server';

import { cookies } from 'next/headers';
import { authService } from '@/services/auth.service';
import { registerSchema, type RegisterInput } from '@/lib/validation/auth.schema';
import { getSessionCookieOptions, SESSION_COOKIE } from '@/lib/session';
import { serializeSignedSession } from '@/lib/session-crypto';
import type { SessionUser } from '@/types';
import { getUserRepository } from '@/providers/container.server';
import { FirebaseAuthServerRepository } from '@/repositories/firebase/auth.server.repository';

async function setSessionCookie(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, serializeSignedSession(user), getSessionCookieOptions());
}

export async function establishSessionAction(idToken: string): Promise<{ user: SessionUser }> {
  const user = await authService.getSessionFromToken(idToken);
  if (!user) throw new Error('Invalid or expired token');
  await setSessionCookie(user);
  return { user };
}

export async function registerProfileAction(
  idToken: string,
  input: RegisterInput,
): Promise<{ user: SessionUser }> {
  const parsed = registerSchema.parse(input);
  const authServer = new FirebaseAuthServerRepository();
  const users = getUserRepository();
  const uid = await authServer.verifyIdToken(idToken);
  const existing = await users.getById(uid);
  if (existing) {
    await setSessionCookie({
      id: existing.id,
      email: existing.email,
      name: existing.name,
      role: existing.role,
      approved: existing.approved,
      rejected: existing.rejected,
    });
    return {
      user: {
        id: existing.id,
        email: existing.email,
        name: existing.name,
        role: existing.role,
        approved: existing.approved,
        rejected: existing.rejected,
      },
    };
  }
  const approved = parsed.role === 'customer';
  await users.create(uid, {
    name: parsed.name,
    email: parsed.email,
    ...(parsed.phone ? { phone: parsed.phone } : {}),
    role: parsed.role,
    approved,
  });
  const profile = await users.getById(uid);
  if (!profile) throw new Error('Failed to create profile');
  const sessionUser: SessionUser = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    approved: profile.approved,
    rejected: profile.rejected,
  };
  await setSessionCookie(sessionUser);
  return { user: sessionUser };
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionAction(): Promise<SessionUser | null> {
  const { getServerSession } = await import('@/lib/auth-server');
  return getServerSession();
}
