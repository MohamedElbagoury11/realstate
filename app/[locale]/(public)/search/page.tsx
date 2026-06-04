import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyFiltersForm } from '@/components/property/PropertyFiltersForm';
import { fetchPublicSearch } from '@/lib/data';
import { buildAlternateLanguages } from '@/lib/metadata-i18n';
import type { PropertyFilters } from '@/types';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'public' });
  return {
    title: t('search.metaTitle'),
    description: t('search.metaDescription'),
    alternates: await buildAlternateLanguages('/search'),
  };
}

function buildSearchHref(filters: PropertyFilters, cursor?: string): string {
  const params = new URLSearchParams();
  if (filters.city) params.set('city', filters.city);
  if (filters.zone) params.set('zone', filters.zone);
  if (filters.propertyType) params.set('propertyType', filters.propertyType);
  if (filters.query) params.set('q', filters.query);
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters.minRooms !== undefined) params.set('minRooms', String(filters.minRooms));
  if (filters.minArea !== undefined) params.set('minArea', String(filters.minArea));
  if (cursor) params.set('cursor', cursor);
  const q = params.toString();
  return q ? `/search?${q}` : '/search';
}

function parseFilters(searchParams: Record<string, string | string[] | undefined>): PropertyFilters {
  const get = (key: string) => {
    const v = searchParams[key];
    return typeof v === 'string' ? v : undefined;
  };
  return {
    city: get('city'),
    zone: get('zone'),
    propertyType: get('propertyType') as PropertyFilters['propertyType'],
    query: get('q'),
    cursor: get('cursor'),
    minPrice: get('minPrice') ? Number(get('minPrice')) : undefined,
    maxPrice: get('maxPrice') ? Number(get('maxPrice')) : undefined,
    minRooms: get('minRooms') ? Number(get('minRooms')) : undefined,
    minArea: get('minArea') ? Number(get('minArea')) : undefined,
    page: get('page') ? Number(get('page')) : 1,
    pageSize: 12,
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'public' });

  const rawParams = await searchParams;
  const filters = parseFilters(rawParams);
  const result = await fetchPublicSearch(filters);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t('search.title')}</h1>
      <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-zinc-200" />}>
        <PropertyFiltersForm />
      </Suspense>
      <p className="text-sm text-zinc-600">{t('search.results', { count: result.total })}</p>
      <PropertyGrid properties={result.items} />
      {result.hasMore && result.nextCursor && (
        <a
          href={buildSearchHref(filters, result.nextCursor)}
          className="inline-block rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
        >
          {t('search.loadMore')}
        </a>
      )}
    </div>
  );
}
