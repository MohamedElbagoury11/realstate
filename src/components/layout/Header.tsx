'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function Header() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-emerald-700">
          {t('brand')}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/search" className="text-zinc-600 hover:text-zinc-900">
            {t('nav.search')}
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin/dashboard" className="text-zinc-600 hover:text-zinc-900">
              {t('nav.admin')}
            </Link>
          )}
          {user?.role === 'seller' && (
            <Link href="/seller/dashboard" className="text-zinc-600 hover:text-zinc-900">
              {t('nav.seller')}
            </Link>
          )}
          {user ? (
            <>
              <span className="text-zinc-500">{user.name}</span>
              <Button variant="ghost" onClick={() => logout()}>
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">{t('nav.login')}</Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
