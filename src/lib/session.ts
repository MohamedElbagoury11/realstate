import type { SessionUser } from '@/types';

export const SESSION_COOKIE = 're_session';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** Secure cookies are not stored on http://localhost — only enable over HTTPS. */
export function getSessionCookieOptions() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return {
    httpOnly: true,
    secure: appUrl.startsWith('https://'),
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

export function getPostAuthDestination(
  user: SessionUser,
  redirect?: string | null,
): string {
  const defaultDest =
    user.role === 'admin'
      ? '/admin/dashboard'
      : user.role === 'seller'
        ? '/seller/dashboard'
        : '/';

  if (!redirect?.startsWith('/') || redirect.startsWith('//')) {
    return defaultDest;
  }
  if (redirect.startsWith('/admin') && user.role !== 'admin') {
    return defaultDest;
  }
  if (
    redirect.startsWith('/seller') &&
    user.role !== 'seller' &&
    user.role !== 'admin'
  ) {
    return defaultDest;
  }
  return redirect;
}
