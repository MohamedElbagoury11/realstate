'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  PROPERTY_CATEGORY_TYPES,
  PROPERTY_CATEGORY_LABEL_KEYS,
} from '@/lib/constants';
import { Building2, Home, LandPlot, Store, TreePine, LayoutGrid } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  apartment: <Building2 className="h-6 w-6" />,
  house: <Home className="h-6 w-6" />,
  villa: <TreePine className="h-6 w-6" />,
  land: <LandPlot className="h-6 w-6" />,
  commercial: <Store className="h-6 w-6" />,
};

export function CategoryGrid() {
  const tPublic = useTranslations('public');
  const tTypes = useTranslations('property');

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">{tPublic('home.browseByCategory')}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PROPERTY_CATEGORY_TYPES.map((type) => (
          <Link
            key={type}
            href={`/search?propertyType=${type}`}
            className="group flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center transition hover:border-[var(--brand-light)] hover:shadow-[var(--shadow)]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--brand)] transition group-hover:bg-[var(--brand)] group-hover:text-white">
              {icons[type] ?? <LayoutGrid className="h-6 w-6" />}
            </span>
            <span className="text-sm font-semibold">
              {tTypes(`types.${PROPERTY_CATEGORY_LABEL_KEYS[type]}`)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
