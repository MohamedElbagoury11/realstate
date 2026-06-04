'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Property } from '@/types';

export function PropertyCard({ property }: { property: Property }) {
  const t = useTranslations('common');
  const image = property.images[0] ?? '/window.svg';

  return (
    <Link
      href={`/property/${property.slug}`}
      className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-zinc-100">
        <Image
          src={image}
          alt={property.title}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-900 line-clamp-1">{property.title}</h3>
        <p className="mt-1 text-sm text-zinc-600">
          {property.city}, {property.zone}
        </p>
        <p className="mt-2 text-lg font-bold text-emerald-700">
          ${property.price.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          {property.rooms} {t('units.beds')} · {property.bathrooms} {t('units.baths')} ·{' '}
          {property.area} {t('units.sqm')}
        </p>
      </div>
    </Link>
  );
}
