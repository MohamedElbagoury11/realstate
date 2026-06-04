import type { Property, PropertyFilters, SearchResult } from '@/types';
import { propertyService } from './property.service';

export class SearchService {
  async search(filters: PropertyFilters): Promise<SearchResult<Property>> {
    return propertyService.searchPublic(filters);
  }
}

export const searchService = new SearchService();
