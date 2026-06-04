'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function HeroSearch() {
  const t = useTranslations('public');

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[var(--brand)] px-6 py-14 text-white sm:px-10 sm:py-20">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--brand-light)]/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[var(--accent)]/20 blur-2xl" />
      <div className="relative max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-teal-200/90">
          {t('hero.badge')}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="mt-4 text-lg text-teal-100/90">{t('hero.subtitle')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/search"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-[var(--brand)] shadow-lg hover:bg-teal-50"
          >
            {t('hero.browse')}
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"
          >
            {t('hero.listProperty')}
          </Link>
        </div>
      </div>
    </section>
  );
}
