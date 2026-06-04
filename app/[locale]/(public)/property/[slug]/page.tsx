import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PropertyContactBar } from '@/components/property/PropertyContactBar';
import { PropertyContactSticky } from '@/components/property/PropertyContactSticky';
import { PropertyShareReport } from '@/components/property/PropertyShareReport';
import { PropertyViewTracker } from '@/components/property/PropertyViewTracker';
import { fetchPlatformSettings, fetchPublicProperty } from '@/lib/data';
import { buildRealEstateJsonLd, propertyMetadata } from '@/lib/seo';

export const revalidate = 120;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const property = await fetchPublicProperty(slug);
  if (!property) {
    const t = await getTranslations({ locale, namespace: 'public' });
    return { title: t('propertyDetail.notFound') };
  }
  return propertyMetadata(property, locale);
}

export default async function PropertyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'public' });
  const tp = await getTranslations({ locale, namespace: 'property' });
  const tu = await getTranslations({ locale, namespace: 'common' });

  const [property, settings] = await Promise.all([
    fetchPublicProperty(slug),
    fetchPlatformSettings(),
  ]);
  if (!property) notFound();

  const propertyTypeLabel = tp(`types.${property.propertyType}`);

  return (
    <article className="space-y-8 pb-4">
      <PropertyViewTracker propertyId={property.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildRealEstateJsonLd(property, locale)),
        }}
      />
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--brand-light)]">
            {propertyTypeLabel}
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{property.title}</h1>
          <p className="mt-2 text-2xl font-bold text-[var(--brand)]">
            ${property.price.toLocaleString()}
          </p>
          <p className="mt-1 text-[var(--muted)]">
            {property.city}, {property.zone}
            {property.address ? ` · ${property.address}` : ''}
          </p>
        </div>
        <PropertyShareReport property={property} />
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {property.images.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-xl bg-zinc-100 ${
                  i === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={src}
                  alt={t('propertyDetail.imageAlt', { title: property.title, index: i + 1 })}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
          <section>
            <h2 className="text-xl font-semibold">{t('propertyDetail.description')}</h2>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[var(--muted)]">
              {property.description}
            </p>
          </section>
          {property.amenities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">{t('propertyDetail.amenities')}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <li
                    key={a}
                    className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-medium"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <aside className="space-y-4">
          {settings && <PropertyContactBar propertyId={property.id} settings={settings} />}
          <dl className="grid grid-cols-2 gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm">
            <div>
              <dt className="text-[var(--muted)]">{t('propertyDetail.rooms')}</dt>
              <dd className="font-semibold">{property.rooms}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">{t('propertyDetail.bathrooms')}</dt>
              <dd className="font-semibold">{property.bathrooms}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">{t('propertyDetail.area')}</dt>
              <dd className="font-semibold">
                {property.area} {tu('units.sqm')}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">{t('propertyDetail.listed')}</dt>
              <dd className="font-semibold">
                {new Date(property.createdAt).toLocaleDateString(locale)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      {settings && (
        <PropertyContactSticky propertyId={property.id} settings={settings} />
      )}
    </article>
  );
}
