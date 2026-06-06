import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { SESSION_COOKIE } from '@/lib/session';
import { parseSessionCookieEdge } from '@/lib/session-edge';
import { routing } from '@/i18n/routing';

/* ---------------- Safe base URL ---------------- */

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL;

  if (!url || typeof url !== 'string') {
    return 'https://aliandsaifrealstate.netlify.app';
  }

  // FIX corrupted env like: "localhost,https://..."
  if (url.includes(',')) {
    return url.split(',')[0];
  }

  return url;
}

/* ---------------- Intl middleware ---------------- */

const intlMiddleware = createIntlMiddleware({
  ...routing,
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
});

/* ---------------- Routes ---------------- */

const adminPaths = ['/admin'];
const sellerPaths = ['/seller'];
const authPaths = ['/login', '/register'];

/* ---------------- Helpers ---------------- */

function stripLocale(pathname: string): string {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  if (
    routing.locales.includes(
      maybeLocale as (typeof routing.locales)[number]
    )
  ) {
    const rest = segments.slice(2).join('/');
    return rest ? `/${rest}` : '/';
  }

  return pathname;
}

/* ---------------- Proxy ---------------- */

export async function proxy(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  const pathname = stripLocale(request.nextUrl.pathname);

  const session = await parseSessionCookieEdge(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  const isAdminRoute = adminPaths.some((p) => pathname.startsWith(p));
  const isSellerRoute = sellerPaths.some((p) => pathname.startsWith(p));

  const isAuthRoute = authPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const locale =
    routing.locales.find((l) =>
      request.nextUrl.pathname.startsWith(`/${l}/`)
    ) ?? routing.defaultLocale;

  const localized = (path: string) => `/${locale}${path}`;

  const baseUrl = getBaseUrl();

  /* ---------------- AUTH GUARD ---------------- */

  if (isAuthRoute && session) {
    const dest =
      session.role === 'admin'
        ? localized('/admin/dashboard')
        : session.role === 'seller'
        ? localized('/seller/dashboard')
        : localized('/');

    return NextResponse.redirect(new URL(dest, baseUrl));
  }

  /* ---------------- PROTECTED ROUTES ---------------- */

  if ((isAdminRoute || isSellerRoute) && !session) {
    const loginUrl = new URL(localized('/login'), baseUrl);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  /* ---------------- ROLE PROTECTION ---------------- */

  if (isAdminRoute && session?.role !== 'admin') {
    return NextResponse.redirect(new URL(localized('/'), baseUrl));
  }

  if (
    isSellerRoute &&
    session?.role !== 'seller' &&
    session?.role !== 'admin'
  ) {
    return NextResponse.redirect(new URL(localized('/'), baseUrl));
  }

  return intlResponse;
}

/* ---------------- Matcher ---------------- */

export const config = {
  matcher: [
    '/',
    '/(ar|en)/:path*',
    '/admin/:path*',
    '/seller/:path*',
    '/login',
    '/register',
  ],
};
