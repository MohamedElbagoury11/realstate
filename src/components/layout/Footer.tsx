'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)] py-10">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-[var(--muted)]">
        {t('footer.copyright', { year })}
      </div>
    </footer>
  );
}
