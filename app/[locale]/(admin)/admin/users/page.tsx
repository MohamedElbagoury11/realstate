import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { fetchPendingSellers } from '@/lib/data';
import { SellerApproval } from '@/components/admin/SellerApproval';
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
    title: t('users.metaTitle'),
    alternates: await buildAlternateLanguages('/admin/users'),
  };
}

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });

  const sellers = await fetchPendingSellers();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('users.title')}</h1>
      <SellerApproval sellers={sellers} />
    </div>
  );
}
