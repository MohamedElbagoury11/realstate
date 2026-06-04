import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { fetchSellerProperty } from '@/lib/data';
import { EditPropertyForm } from '@/components/seller/EditPropertyForm';
import { buildAlternateLanguages } from '@/lib/metadata-i18n';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'seller' });
  return {
    title: t('edit.metaTitle'),
    alternates: await buildAlternateLanguages(`/seller/dashboard/properties/${id}/edit`),
  };
}

export default async function SellerEditPropertyPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'seller' });

  const property = await fetchSellerProperty(id);
  if (!property) notFound();

  return (
    <div className="space-y-6">
      <Link href="/seller/dashboard" className="text-sm text-emerald-700 hover:underline">
        {t('edit.back')}
      </Link>
      <EditPropertyForm property={property} />
    </div>
  );
}
