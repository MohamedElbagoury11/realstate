import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { fetchAuditLogs } from '@/lib/data';
import { AuditLogTable } from '@/components/admin/AuditLogTable';
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
    title: t('audit.metaTitle'),
    alternates: await buildAlternateLanguages('/admin/audit'),
  };
}

export default async function AdminAuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });

  const entries = await fetchAuditLogs();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('audit.title')}</h1>
      <p className="text-zinc-600">{t('audit.subtitle')}</p>
      <AuditLogTable entries={entries} />
    </div>
  );
}
