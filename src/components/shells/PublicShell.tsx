'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Footer } from '@/components/layout/Footer';
import { PublicHeader } from '@/components/layout/PublicHeader';

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <PublicHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:py-10">{children}</main>
      <Footer />
    </div>
  );
}

export function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  const t = useTranslations('common');
  const label = linkLabel ?? t('viewAll');

  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{title}</h2>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-[var(--brand-light)] hover:text-[var(--brand)]"
        >
          {label}{' '}
          <span className="inline-block rtl:rotate-180" aria-hidden>
            →
          </span>
        </Link>
      )}
    </div>
  );
}
