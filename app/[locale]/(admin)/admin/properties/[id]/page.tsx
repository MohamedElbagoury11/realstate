import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { fetchAdminPropertyWithSeller } from '@/lib/data';
import { AdminPropertyEditor } from '@/components/admin/AdminPropertyEditor';
import { buildAlternateLanguages } from '@/lib/metadata-i18n';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  const property = await fetchAdminPropertyWithSeller(id);
  return {
    title: property
      ? t('properties.editMeta', { title: property.title })
      : t('properties.editMetaFallback'),
    alternates: await buildAlternateLanguages(`/admin/properties/${id}`),
  };
}

export default async function AdminPropertyEditPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });

  const property = await fetchAdminPropertyWithSeller(id);
  if (!property) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/properties" className="text-sm text-emerald-700 hover:underline">
        {t('properties.backToList')}
      </Link>
      <h1 className="text-3xl font-bold">{property.title}</h1>
      <AdminPropertyEditor property={property} />
    </div>
  );
}
