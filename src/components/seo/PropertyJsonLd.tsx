import { buildRealEstateJsonLd } from '@/lib/seo';
import type { Property } from '@/types';

export function PropertyJsonLd({
  property,
  locale,
}: {
  property: Property;
  locale: string;
}) {
  const jsonLd = buildRealEstateJsonLd(property, locale);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
