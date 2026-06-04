'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/cn';

const nav = [
  { href: '/admin/dashboard', key: 'overview' },
  { href: '/admin/properties', key: 'properties' },
  { href: '/admin/leads', key: 'leads' },
  { href: '/admin/users', key: 'users' },
  { href: '/admin/settings', key: 'settings' },
  { href: '/admin/audit', key: 'audit' },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('admin');

  return (
    <div className="flex min-h-full flex-col">
      <PublicHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-0 px-4 py-6 lg:gap-8">
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              {t('nav.section')}
            </p>
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block rounded-lg px-3 py-2 text-sm font-medium transition',
                    active
                      ? 'bg-[var(--brand)] text-white'
                      : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]',
                  )}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <nav className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium',
                  pathname.startsWith(item.href)
                    ? 'bg-[var(--brand)] text-white'
                    : 'bg-[var(--surface)] text-[var(--muted)]',
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
