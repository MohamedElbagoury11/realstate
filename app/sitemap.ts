import type { MetadataRoute } from 'next';
import { isDataLayerReady } from '@/lib/data';
import { getPropertyRepository } from '@/providers/container.server';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const staticPaths = ['', '/search'] as const;
  const staticRoutes: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? ('daily' as const) : ('daily' as const),
      priority: path === '' ? 1 : 0.9,
    })),
  );

  if (!isDataLayerReady()) return staticRoutes;

  try {
    const { items: properties } = await getPropertyRepository().list({
      status: 'approved',
      pageSize: 500,
    });
    const propertyRoutes = routing.locales.flatMap((locale) =>
      properties.map((p) => ({
        url: `${base}/${locale}/property/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    );
    return [...staticRoutes, ...propertyRoutes];
  } catch {
    return staticRoutes;
  }
}
