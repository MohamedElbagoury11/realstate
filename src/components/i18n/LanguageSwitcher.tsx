'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common.language');

  function switchLocale(next: Locale) {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      className={cn('flex items-center gap-0.5 rounded-lg border border-[var(--border)] p-0.5', className)}
      role="group"
      aria-label={t('switch')}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-semibold uppercase transition',
            loc === locale
              ? 'bg-[var(--brand)] text-white'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]',
          )}
          aria-pressed={loc === locale}
        >
          {loc === 'en' ? 'EN' : 'AR'}
        </button>
      ))}
    </div>
  );
}
