'use client';

import { useTranslations } from 'next-intl';
import type { Property } from '@/types';
import { PropertyCardPremium } from './PropertyCardPremium';
import { EmptyState } from '@/components/ui/EmptyState';

export function PropertyGrid({ properties }: { properties: Property[] }) {
  const t = useTranslations('property');

  if (!properties.length) {
    return <EmptyState title={t('empty.title')} description={t('empty.description')} />;
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => (
        <PropertyCardPremium key={p.id} property={p} />
      ))}
    </div>
  );
}
