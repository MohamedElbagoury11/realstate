'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

export function PublicHeader() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand)] text-sm font-bold text-white">
            {t('brandMonogram')}
          </span>
          <span className="text-lg font-bold tracking-tight text-[var(--brand)]">{t('brand')}</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-4">
          <LanguageSwitcher className="hidden sm:flex" />
          <Link href="/search" className="hidden text-[var(--muted)] hover:text-[var(--foreground)] sm:inline">
            {t('nav.search')}
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin/dashboard" className="text-[var(--muted)] hover:text-[var(--foreground)]">
              {t('nav.admin')}
            </Link>
          )}
          {user?.role === 'seller' && (
            <Link href="/seller/dashboard" className="text-[var(--muted)] hover:text-[var(--foreground)]">
              {t('nav.dashboard')}
            </Link>
          )}
          {user ? (
            <>
              <span className="hidden text-[var(--muted)] sm:inline">{user.name}</span>
              <Button variant="ghost" onClick={() => logout()}>
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[var(--muted)] hover:text-[var(--foreground)]">
                {t('nav.login')}
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[var(--brand)] px-3 py-1.5 font-medium text-white hover:opacity-90"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
          <LanguageSwitcher className="sm:hidden" />
        </nav>
      </div>
    </header>
  );
}
