import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { fetchAdminSettings } from '@/lib/data';
import { AdminSettingsForm } from '@/components/admin/AdminSettingsForm';
import { EmptyState } from '@/components/ui/EmptyState';
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
    title: t('settings.metaTitle'),
    alternates: await buildAlternateLanguages('/admin/settings'),
  };
}

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });
  const te = await getTranslations({ locale, namespace: 'errors' });

  const settings = await fetchAdminSettings();
  if (!settings) {
    return (
      <EmptyState
        title={te('server.loadSettingsFailed')}
        description={te('server.loadSettingsHint')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        <p className="mt-2 text-zinc-600">{t('settings.description')}</p>
      </div>
      <AdminSettingsForm settings={settings} />
    </div>
  );
}
