import type { Lead, LeadAnalytics, LeadFilters } from '@/types';

export interface LeadRepository {
  create(data: Omit<Lead, 'id'>): Promise<Lead>;
  list(filters?: LeadFilters): Promise<Lead[]>;
  getAnalytics(filters?: LeadFilters): Promise<LeadAnalytics>;
}
