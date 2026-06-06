import type { SessionUser } from '@/types';

export const SESSION_COOKIE = 're_session';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/* ---------------- Safe URL parsing ---------------- */

function getAppUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.NODE_ENV === 'production'
      ? 'https://aliandsaifrealstate.netlify.app'
      : 'http://localhost:3000');

  try {
    return new URL(raw).origin;
  } catch {
    return process.env.NODE_ENV === 'production'
      ? 'https://aliandsaifrealstate.netlify.app'
      : 'http://localhost:3000';
  }
}

/* ---------------- Cookie Options ---------------- */

export function getSessionCookieOptions() {
  const appUrl = getAppUrl();

  return {
    httpOnly: true,
    secure: appUrl.startsWith('https://'),
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

/* ---------------- Redirect Logic ---------------- */

export function getPostAuthDestination(
  user: SessionUser,
  redirect?: string | null
): string {
  const defaultDest =
    user.role === 'admin'
      ? '/admin/dashboard'
      : user.role === 'seller'
      ? '/seller/dashboard'
      : '/';

  if (!redirect) return defaultDest;

  // must be relative path only
  if (!redirect.startsWith('/') || redirect.startsWith('//')) {
    return defaultDest;
  }

  // prevent open redirect attacks
  if (redirect.startsWith('/http') || redirect.startsWith('/https')) {
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