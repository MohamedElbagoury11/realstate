'use client';

import { useTranslations } from 'next-intl';
import type { SellerPropertyAnalytics } from '@/types';
import { StatCard } from '@/components/ui/Card';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function SellerAnalyticsPanel({ analytics }: { analytics: SellerPropertyAnalytics }) {
  const t = useTranslations('seller');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('analytics.totalViews')} value={analytics.totals.views} />
        <StatCard label={t('analytics.totalLeads')} value={analytics.totals.leads} />
        <StatCard
          label={t('analytics.conversion')}
          value={`${analytics.totals.conversionRate}%`}
          hint={t('analytics.conversionHint')}
        />
        <StatCard label={t('analytics.listings')} value={analytics.totals.listings} />
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-[var(--border)] px-5 py-3">
          <h2 className="font-semibold">{t('analytics.perListing')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-[var(--muted)]">
              <tr>
                <th className="px-5 py-2">{t('analytics.property')}</th>
                <th className="px-5 py-2">{t('analytics.status')}</th>
                <th className="px-5 py-2">{t('analytics.views')}</th>
                <th className="px-5 py-2">{t('analytics.leads')}</th>
                <th className="px-5 py-2">{t('analytics.conv')}</th>
              </tr>
            </thead>
            <tbody>
              {analytics.properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-[var(--muted)]">
                    {t('analytics.noListings')}
                  </td>
                </tr>
              ) : (
                analytics.properties.map((row) => (
                  <tr key={row.propertyId} className="border-t border-[var(--border)]">
                    <td className="px-5 py-3 font-medium">{row.title}</td>
                    <td className="px-5 py-3">
                      <Badge status={row.status} />
                    </td>
                    <td className="px-5 py-3">{row.views}</td>
                    <td className="px-5 py-3">{row.leads}</td>
                    <td className="px-5 py-3">{row.conversionRate}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
