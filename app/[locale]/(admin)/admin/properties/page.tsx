import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { fetchAdminProperties } from '@/lib/data';
import { PropertyModeration } from '@/components/admin/PropertyModeration';
import { EmptyState } from '@/components/ui/EmptyState';
import { buildAlternateLanguages } from '@/lib/metadata-i18n';
import type { PropertyStatus } from '@/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return {
    title: t('properties.metaTitle'),
    alternates: await buildAlternateLanguages('/admin/properties'),
  };
}

const VALID: PropertyStatus[] = ['pending', 'approved', 'rejected', 'hidden'];

export default async function AdminPropertiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });

  const { status: raw } = await searchParams;
  const status = VALID.includes(raw as PropertyStatus) ? (raw as PropertyStatus) : undefined;
  const properties = await fetchAdminProperties(status);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('properties.title')}</h1>
      {properties.length === 0 ? (
        <EmptyState title={t('properties.empty')} />
      ) : (
        <PropertyModeration properties={properties} currentStatus={status} />
      )}
    </div>
  );
}
