import type { PropertyStatus, PropertyType } from './property';

export interface PropertyFilters {
  city?: string;
  zone?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  minArea?: number;
  amenities?: string[];
  status?: PropertyStatus;
  sellerId?: string;
  query?: string;
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface PropertyStatusCounts {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  hidden: number;
}
