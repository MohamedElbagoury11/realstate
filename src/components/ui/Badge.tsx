'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  hidden: 'bg-zinc-200 text-zinc-700',
};

export function Badge({
  status,
  className,
}: {
  status: keyof typeof statusStyles;
  className?: string;
}) {
  const t = useTranslations('common');

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status],
        className,
      )}
    >
      {t(`status.${status}`)}
    </span>
  );
}
