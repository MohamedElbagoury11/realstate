'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import type { LeadAnalytics } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatCard } from '@/components/ui/Card';

export function LeadsDashboard({
  analytics,
  conversion,
}: {
  analytics: LeadAnalytics;
  conversion?: {
    totalViews: number;
    totalLeads: number;
    conversionRate: number;
  } | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('admin');

  function applyFilters(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const from = fd.get('from') as string;
    const to = fd.get('to') as string;
    const city = fd.get('city') as string;
    const propertyType = fd.get('propertyType') as string;
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (city) params.set('city', city);
    if (propertyType) params.set('propertyType', propertyType);
    router.push(`/admin/leads?${params.toString()}`);
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={applyFilters}
        className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <Input label={t('leads.from')} name="from" type="date" defaultValue={searchParams.get('from') ?? ''} />
        <Input label={t('leads.to')} name="to" type="date" defaultValue={searchParams.get('to') ?? ''} />
        <Input label={t('leads.city')} name="city" defaultValue={searchParams.get('city') ?? ''} />
        <Input
          label={t('leads.propertyType')}
          name="propertyType"
          defaultValue={searchParams.get('propertyType') ?? ''}
        />
        <div className="flex items-end">
          <Button type="submit">{t('leads.applyFilters')}</Button>
        </div>
      </form>

      {conversion && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label={t('leads.listingViews')} value={conversion.totalViews} />
          <StatCard label={t('leads.contactLeads')} value={conversion.totalLeads} />
          <StatCard
            label={t('leads.viewContactRate')}
            value={`${conversion.conversionRate}%`}
            hint={t('leads.platformWide')}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t('leads.leadsInRange')} value={analytics.totalLeads} />
        <StatCard label={t('leads.calls')} value={analytics.totalCalls} />
        <StatCard label={t('leads.whatsapp')} value={analytics.totalWhatsapp} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">{t('leads.mostContacted')}</h2>
        <ul className="divide-y rounded-xl border border-zinc-200 bg-white">
          {analytics.topProperties.length === 0 ? (
            <li className="p-4 text-sm text-zinc-500">{t('leads.noLeads')}</li>
          ) : (
            analytics.topProperties.map((p) => (
              <li key={p.propertyId} className="flex justify-between p-4 text-sm">
                <span>{p.propertyTitle}</span>
                <span className="font-semibold">{p.count}</span>
              </li>
            ))
          )}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartTable
          title={t('leads.leadsByDay')}
          emptyLabel={t('leads.noData')}
          rows={analytics.byDay.map((r) => ({ label: r.date, count: r.count }))}
        />
        <ChartTable
          title={t('leads.leadsByWeek')}
          emptyLabel={t('leads.noData')}
          rows={analytics.byWeek.map((r) => ({ label: r.week, count: r.count }))}
        />
        <ChartTable
          title={t('leads.leadsByMonth')}
          emptyLabel={t('leads.noData')}
          rows={analytics.byMonth.map((r) => ({ label: r.month, count: r.count }))}
        />
      </div>
    </div>
  );
}

function ChartTable({
  title,
  emptyLabel,
  rows,
}: {
  title: string;
  emptyLabel: string;
  rows: { label: string; count: number }[];
}) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <ul className="space-y-2 text-sm">
        {rows.length === 0 ? (
          <li className="text-zinc-500">{emptyLabel}</li>
        ) : (
          rows.slice(-14).map((r) => (
            <li key={r.label} className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-zinc-600">{r.label}</span>
              <div className="h-2 flex-1 rounded bg-zinc-100">
                <div
                  className="h-2 rounded bg-emerald-600"
                  style={{ width: `${(r.count / max) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right font-medium">{r.count}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
