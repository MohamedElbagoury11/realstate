import type { Property, PropertyFilters, SearchResult } from '@/types';

export interface SearchRepository {
  search(filters: PropertyFilters): Promise<SearchResult<Property>>;
}
