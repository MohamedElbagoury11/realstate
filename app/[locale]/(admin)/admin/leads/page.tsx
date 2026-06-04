import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { fetchLeadAnalytics, fetchPlatformConversion } from '@/lib/data';
import { LeadsDashboard } from '@/components/admin/LeadsDashboard';
import { buildAlternateLanguages } from '@/lib/metadata-i18n';
import type { LeadFilters } from '@/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return {
    title: t('leads.metaTitle'),
    alternates: await buildAlternateLanguages('/admin/leads'),
  };
}

function parseLeadFilters(
  searchParams: Record<string, string | string[] | undefined>,
): LeadFilters {
  const get = (key: string) => {
    const v = searchParams[key];
    return typeof v === 'string' ? v : undefined;
  };
  const from = get('from');
  const to = get('to');
  return {
    from: from ? `${from}T00:00:00.000Z` : undefined,
    to: to ? `${to}T23:59:59.999Z` : undefined,
    city: get('city'),
    propertyType: get('propertyType'),
    propertyId: get('propertyId'),
  };
}

export default async function AdminLeadsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });
  const te = await getTranslations({ locale, namespace: 'errors' });

  const rawParams = await searchParams;
  const filters = parseLeadFilters(rawParams);
  const [analytics, conversion] = await Promise.all([
    fetchLeadAnalytics(filters),
    fetchPlatformConversion(),
  ]);

  if (!analytics) {
    return <p className="text-zinc-600">{te('server.loadLeadsFailed')}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('leads.title')}</h1>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-zinc-200" />}>
        <LeadsDashboard analytics={analytics} conversion={conversion} />
      </Suspense>
    </div>
  );
}
