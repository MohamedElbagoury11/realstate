import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';
import { parseSessionCookieEdge } from '@/lib/session-edge';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const adminPaths = ['/admin'];
const sellerPaths = ['/seller'];
const authPaths = ['/login', '/register'];

function stripLocale(pathname: string): string {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  if (routing.locales.includes(maybeLocale as (typeof routing.locales)[number])) {
    const rest = segments.slice(2).join('/');
    return rest ? `/${rest}` : '/';
  }
  return pathname;
}

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const pathname = stripLocale(request.nextUrl.pathname);
  const session = await parseSessionCookieEdge(request.cookies.get(SESSION_COOKIE)?.value);

  const isAdminRoute = adminPaths.some((p) => pathname.startsWith(p));
  const isSellerRoute = sellerPaths.some((p) => pathname.startsWith(p));
  const isAuthRoute = authPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const locale =
    routing.locales.find((l) => request.nextUrl.pathname.startsWith(`/${l}/`)) ??
    routing.defaultLocale;

  const localized = (path: string) => `/${locale}${path}`;

  if (isAuthRoute && session) {
    const dest =
      session.role === 'admin'
        ? localized('/admin/dashboard')
        : session.role === 'seller'
          ? localized('/seller/dashboard')
          : localized('/');
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if ((isAdminRoute || isSellerRoute) && !session) {
    const login = new URL(localized('/login'), request.url);
    login.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  if (isAdminRoute && session?.role !== 'admin') {
    return NextResponse.redirect(new URL(localized('/'), request.url));
  }

  if (isSellerRoute && session?.role !== 'seller' && session?.role !== 'admin') {
    return NextResponse.redirect(new URL(localized('/'), request.url));
  }

  return intlResponse;
}

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
