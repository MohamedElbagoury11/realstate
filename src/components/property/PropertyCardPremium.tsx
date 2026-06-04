'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Property } from '@/types';
import { Star } from 'lucide-react';

export function PropertyCardPremium({ property }: { property: Property }) {
  const tCommon = useTranslations('common');
  const tProperty = useTranslations('property');
  const image = property.images[0] ?? '/window.svg';
  const isFeatured =
    property.featured &&
    (!property.featuredUntil || property.featuredUntil > new Date().toISOString());

  return (
    <Link
      href={`/property/${property.slug}`}
      className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      {isFeatured && (
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-bold text-[var(--foreground)]">
          <Star className="h-3 w-3 fill-current" />
          {tProperty('featured')}
        </span>
      )}
      <div className="relative aspect-[4/3] bg-zinc-100">
        <Image
          src={image}
          alt={property.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--brand-light)]">
          {tProperty(`types.${property.propertyType}`)}
        </p>
        <h3 className="mt-1 font-semibold text-[var(--foreground)] line-clamp-1">
          {property.title}
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {property.city}, {property.zone}
        </p>
        <p className="mt-2 text-lg font-bold text-[var(--brand)]">
          ${property.price.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {property.rooms} {tCommon('units.beds')} · {property.bathrooms} {tCommon('units.baths')}{' '}
          · {property.area} {tCommon('units.sqm')}
        </p>
      </div>
    </Link>
  );
}
