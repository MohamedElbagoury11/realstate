import { getTranslations } from 'next-intl/server';

export async function OrganizationJsonLd() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const tPublic = await getTranslations('public');
  const tCommon = await getTranslations('common');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: tCommon('brand'),
    url: appUrl,
    description: tPublic('orgJsonLd.description'),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
