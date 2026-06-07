import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getServerSession } from '@/lib/auth-server';
import {
  fetchSellerAnalytics,
  fetchSellerNotifications,
  fetchSellerProperties,
} from '@/lib/data';
import { CreatePropertyForm } from '@/components/seller/CreatePropertyForm';
import { SellerPropertyRow } from '@/components/seller/SellerPropertyRow';
import { SellerAnalyticsPanel } from '@/components/seller/SellerAnalyticsPanel';
import { SellerNotifications } from '@/components/seller/SellerNotifications';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatCard } from '@/components/ui/Card';
import { buildAlternateLanguages } from '@/lib/metadata-i18n';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seller' });
  return {
    title: t('dashboard.metaTitle'),
    alternates: await buildAlternateLanguages('/seller/dashboard'),
  };
}

export default async function SellerDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'seller' });
  const ts = await getTranslations({ locale, namespace: 'common' });

  const session = await getServerSession();
  const isApprovedSeller = Boolean(session?.approved);
  const isRejectedSeller = Boolean(session?.rejected);
  const [properties, analytics, notifications] = await Promise.all([
    fetchSellerProperties(),
    fetchSellerAnalytics(),
    fetchSellerNotifications(),
  ]);

  const statusCounts = properties.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="mt-2 text-[var(--muted)]">
          {t('dashboard.welcome')} {session?.name}.{' '}
          {isApprovedSeller
            ? t('dashboard.subtitle')
            : isRejectedSeller
              ? t('dashboard.rejected')
              : t('dashboard.pendingApproval')}
        </p>
      </div>

      {isApprovedSeller && analytics && <SellerAnalyticsPanel analytics={analytics} />}

      {isApprovedSeller && (
        <div className="grid gap-4 sm:grid-cols-4">
          <StatCard label={ts('status.pending')} value={statusCounts.pending ?? 0} />
          <StatCard label={ts('status.approved')} value={statusCounts.approved ?? 0} />
          <StatCard label={ts('status.rejected')} value={statusCounts.rejected ?? 0} />
          <StatCard label={ts('status.hidden')} value={statusCounts.hidden ?? 0} />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {isApprovedSeller && <SellerNotifications notifications={notifications} />}
        {isApprovedSeller ? (
          <CreatePropertyForm />
        ) : (
          <EmptyState
            title={
              isRejectedSeller ? t('dashboard.rejected') : t('dashboard.awaitingTitle')
            }
            description={t('dashboard.awaitingDesc')}
          />
        )}
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">{t('dashboard.yourListings')}</h2>
        {properties.length === 0 ? (
          <EmptyState title={t('dashboard.noListings')} />
        ) : (
          <ul className="space-y-3">
            {properties.map((p) => (
              <SellerPropertyRow key={p.id} property={p} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
