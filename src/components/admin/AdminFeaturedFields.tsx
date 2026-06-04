'use client';

import { useTranslations } from 'next-intl';
import type { Property } from '@/types';
import { Card } from '@/components/ui/Card';

export function AdminFeaturedFields({
  property,
  onChange,
}: {
  property: Property;
  onChange: (fields: Partial<Property>) => void;
}) {
  const t = useTranslations('admin');

  return (
    <Card className="space-y-4 p-5">
      <h3 className="font-semibold text-[var(--brand)]">{t('featured.title')}</h3>
      <p className="text-xs text-[var(--muted)]">{t('featured.subtitle')}</p>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={property.featured}
          onChange={(e) => onChange({ featured: e.target.checked })}
        />
        {t('featured.featuredListing')}
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">{t('featured.featuredUntil')}</span>
        <input
          type="datetime-local"
          className="rounded-lg border border-[var(--border)] px-3 py-2"
          value={property.featuredUntil ? property.featuredUntil.slice(0, 16) : ''}
          onChange={(e) =>
            onChange({
              featuredUntil: e.target.value
                ? new Date(e.target.value).toISOString()
                : undefined,
            })
          }
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">{t('featured.priority')}</span>
        <input
          type="number"
          className="rounded-lg border border-[var(--border)] px-3 py-2"
          value={property.featuredPriority}
          onChange={(e) => onChange({ featuredPriority: Number(e.target.value) })}
        />
      </label>
      <dl className="grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-3 text-sm">
        <div>
          <dt className="text-[var(--muted)]">{t('featured.views')}</dt>
          <dd className="font-semibold">{property.viewCount}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">{t('featured.leads')}</dt>
          <dd className="font-semibold">{property.leadCount}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[var(--muted)]">{t('featured.conversion')}</dt>
          <dd className="font-semibold">
            {property.viewCount > 0
              ? `${Math.round((property.leadCount / property.viewCount) * 1000) / 10}%`
              : '—'}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
