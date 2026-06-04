import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { fetchAdminAnalytics, fetchPlatformConversion } from '@/lib/data';
import { StatCard } from '@/components/ui/Card';
import { buildAlternateLanguages } from '@/lib/metadata-i18n';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return {
    title: t('dashboard.metaTitle'),
    alternates: await buildAlternateLanguages('/admin/dashboard'),
  };
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });
  const tu = await getTranslations({ locale, namespace: 'common' });

  const [stats, conversion] = await Promise.all([
    fetchAdminAnalytics(),
    fetchPlatformConversion(),
  ]);

  const cards = [
    { label: t('dashboard.totalListings'), value: stats.total },
    { label: t('dashboard.approved'), value: stats.approved },
    { label: t('dashboard.pending'), value: stats.pending },
    { label: t('dashboard.rejected'), value: stats.rejected },
    { label: t('dashboard.hidden'), value: stats.hidden },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="mt-2 text-[var(--muted)]">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      {conversion && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">{t('dashboard.conversionTitle')}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label={t('dashboard.totalViews')} value={conversion.totalViews} />
            <StatCard label={t('dashboard.totalLeads')} value={conversion.totalLeads} />
            <StatCard
              label={t('dashboard.conversionRate')}
              value={`${conversion.conversionRate}${tu('units.percent')}`}
              hint={t('dashboard.conversionHint')}
            />
          </div>
          {conversion.topByConversion.length > 0 && (
            <ul className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y">
              {conversion.topByConversion.map((p) => (
                <li key={p.propertyId} className="flex justify-between px-5 py-3 text-sm">
                  <span>{p.title}</span>
                  <span className="text-[var(--muted)]">
                    {p.conversionRate}
                    {tu('units.percent')} · {p.views} {tu('units.views')} · {p.leads}{' '}
                    {tu('units.leads')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/properties?status=pending"
          className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {t('dashboard.reviewPending')}
        </Link>
        <Link
          href="/admin/leads"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface)]"
        >
          {t('dashboard.leadsDashboard')}
        </Link>
      </div>
    </div>
  );
}
