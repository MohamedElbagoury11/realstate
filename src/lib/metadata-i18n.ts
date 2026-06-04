import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function buildAlternateLanguages(pathname: string): Promise<Metadata['alternates']> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${appUrl}/${locale}${pathname}`;
  }
  languages['x-default'] = `${appUrl}/en${pathname}`;
  return { languages };
}

export async function getRootMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: {
      default: t('root.title'),
      template: t('root.titleTemplate'),
    },
    description: t('root.description'),
    metadataBase: new URL(appUrl),
    alternates: await buildAlternateLanguages(''),
  };
}
