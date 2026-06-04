import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroSearch } from '@/components/public/HeroSearch';
import { CategoryGrid } from '@/components/public/CategoryGrid';
import { TrustSection } from '@/components/public/TrustSection';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { SectionHeader } from '@/components/shells/PublicShell';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';
import { fetchFeaturedProperties, fetchLatestProperties } from '@/lib/data';
import { buildAlternateLanguages } from '@/lib/metadata-i18n';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('home.title'),
    description: t('home.description'),
    openGraph: {
      title: t('home.ogTitle'),
      description: t('home.ogDescription'),
      type: 'website',
    },
    alternates: await buildAlternateLanguages(''),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'public' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const [featured, latest] = await Promise.all([
    fetchFeaturedProperties(6),
    fetchLatestProperties(8),
  ]);

  return (
    <div className="space-y-14">
      <OrganizationJsonLd />
      <HeroSearch />
      {featured.length > 0 && (
        <section>
          <SectionHeader title={t('home.featuredListings')} href="/search" />
          <PropertyGrid properties={featured} />
        </section>
      )}
      <CategoryGrid />
      <section>
        <SectionHeader
          title={t('home.latestListings')}
          href="/search"
          linkLabel={tc('seeAll')}
        />
        <PropertyGrid properties={latest} />
      </section>
      <TrustSection />
    </div>
  );
}
