'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useFiltersStore } from '@/stores/filters.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { PropertyType } from '@/types';

const PROPERTY_TYPES: PropertyType[] = [
  'apartment',
  'house',
  'villa',
  'land',
  'commercial',
  'other',
];

export function PropertyFiltersForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useFiltersStore();
  const tFilters = useTranslations('property');
  const tTypes = useTranslations('property');
  const tCommon = useTranslations('common');

  function apply() {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.city) params.set('city', filters.city);
    else params.delete('city');
    if (filters.zone) params.set('zone', filters.zone);
    else params.delete('zone');
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
    else params.delete('minPrice');
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    else params.delete('maxPrice');
    if (filters.minRooms) params.set('minRooms', String(filters.minRooms));
    else params.delete('minRooms');
    if (filters.minArea) params.set('minArea', String(filters.minArea));
    else params.delete('minArea');
    if (filters.propertyType) params.set('propertyType', filters.propertyType);
    else params.delete('propertyType');
    if (filters.query) params.set('q', filters.query);
    else params.delete('q');
    params.delete('cursor');
    params.set('page', '1');
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label={tFilters('filters.city')}
        value={filters.city ?? ''}
        onChange={(e) => filters.setFilters({ city: e.target.value || undefined })}
      />
      <Input
        label={tFilters('filters.zone')}
        value={filters.zone ?? ''}
        onChange={(e) => filters.setFilters({ zone: e.target.value || undefined })}
      />
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">{tFilters('filters.propertyType')}</span>
        <select
          className="rounded-lg border border-zinc-300 px-3 py-2"
          value={filters.propertyType ?? ''}
          onChange={(e) =>
            filters.setFilters({
              propertyType: (e.target.value || undefined) as PropertyType,
            })
          }
        >
          <option value="">{tCommon('any')}</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {tTypes(`types.${type}`)}
            </option>
          ))}
        </select>
      </label>
      <Input
        label={tFilters('filters.minPrice')}
        type="number"
        value={filters.minPrice ?? ''}
        onChange={(e) =>
          filters.setFilters({
            minPrice: e.target.value ? Number(e.target.value) : undefined,
          })
        }
      />
      <Input
        label={tFilters('filters.maxPrice')}
        type="number"
        value={filters.maxPrice ?? ''}
        onChange={(e) =>
          filters.setFilters({
            maxPrice: e.target.value ? Number(e.target.value) : undefined,
          })
        }
      />
      <Input
        label={tFilters('filters.minRooms')}
        type="number"
        value={filters.minRooms ?? ''}
        onChange={(e) =>
          filters.setFilters({
            minRooms: e.target.value ? Number(e.target.value) : undefined,
          })
        }
      />
      <Input
        label={tFilters('filters.minArea')}
        type="number"
        value={filters.minArea ?? ''}
        onChange={(e) =>
          filters.setFilters({
            minArea: e.target.value ? Number(e.target.value) : undefined,
          })
        }
      />
      <Input
        label={tFilters('filters.keyword')}
        className="sm:col-span-2"
        value={filters.query ?? ''}
        onChange={(e) => filters.setFilters({ query: e.target.value || undefined })}
      />
      <div className="flex items-end gap-2 sm:col-span-2">
        <Button type="button" onClick={apply}>
          {tFilters('filters.apply')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            filters.resetFilters();
            router.push('/search');
          }}
        >
          {tFilters('filters.reset')}
        </Button>
      </div>
    </div>
  );
}
