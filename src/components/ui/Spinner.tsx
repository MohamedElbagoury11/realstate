'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

export function Spinner({ className }: { className?: string }) {
  const t = useTranslations('common');

  return (
    <div
      className={cn(
        'h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent',
        className,
      )}
      role="status"
      aria-label={t('loading')}
    />
  );
}
