import type { Property, PropertyFilters, PropertyStatusCounts } from '@/types';

export interface PropertyListResult {
  items: Property[];
  nextCursor?: string;
}

export interface PropertyRepository {
  list(filters?: PropertyFilters): Promise<PropertyListResult>;
  getById(id: string): Promise<Property | null>;
  getBySlug(slug: string): Promise<Property | null>;
  getBySellerId(sellerId: string): Promise<Property[]>;
  create(data: Property): Promise<void>;
  update(id: string, data: Partial<Property>): Promise<void>;
  delete(id: string): Promise<void>;
  count(filters?: PropertyFilters): Promise<number>;
  countByStatus(): Promise<PropertyStatusCounts>;
  listFeatured(limit?: number): Promise<Property[]>;
  incrementViewCount(id: string): Promise<void>;
  incrementLeadCount(id: string): Promise<void>;
}
