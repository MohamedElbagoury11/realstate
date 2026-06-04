import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { Property } from '@/types';
import { buildAlternateLanguages } from '@/lib/metadata-i18n';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function propertyMetadata(
  property: Property,
  locale: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const url = `${appUrl}/${locale}/property/${property.slug}`;
  const description =
    property.description.slice(0, 160) ||
    `${property.title} — ${property.city}, ${property.zone}`;
  const title = t('property.titleTemplate', { title: property.title });

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...(await buildAlternateLanguages(`/property/${property.slug}`)),
    },
    openGraph: {
      title: property.title,
      description,
      url,
      type: 'website',
      images: property.images[0] ? [{ url: property.images[0] }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description,
      images: property.images[0] ? [property.images[0]] : [],
    },
  };
}

export function buildRealEstateJsonLd(property: Property, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${appUrl}/${locale}/property/${property.slug}`,
    image: property.images,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'USD',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      streetAddress: property.address ?? property.zone,
    },
    numberOfRooms: property.rooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: 'MTK',
    },
  };
}
