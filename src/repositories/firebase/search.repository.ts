import type { PropertyFilters, SearchResult } from '@/types';
import type { SearchRepository } from '@/repositories/interfaces/search.repository';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { FirebasePropertyRepository } from './property.repository';

export class FirebaseSearchRepository implements SearchRepository {
  private readonly propertyRepo = new FirebasePropertyRepository();

  async search(filters: PropertyFilters): Promise<SearchResult<import('@/types').Property>> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
    const listFilters: PropertyFilters = {
      ...filters,
      pageSize,
      cursor: filters.cursor,
    };
    const [{ items, nextCursor }, total] = await Promise.all([
      this.propertyRepo.list(listFilters),
      this.propertyRepo.count(filters),
    ]);
    return {
      items,
      total,
      page,
      pageSize,
      hasMore: Boolean(nextCursor),
      nextCursor,
    };
  }
}
