'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/cn';

const nav = [{ href: '/seller/dashboard', key: 'dashboard' }] as const;

export function SellerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('seller');

  return (
    <div className="flex min-h-full flex-col">
      <PublicHeader />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <nav className="mb-6 flex gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium',
                pathname.startsWith(item.href)
                  ? 'bg-[var(--brand)] text-white'
                  : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]',
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>
        {children}
      </div>
      <Footer />
    </div>
  );
}
