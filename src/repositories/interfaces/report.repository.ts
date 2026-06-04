import type { PropertyReport } from '@/types';

export interface ReportRepository {
  create(data: Omit<PropertyReport, 'id'>): Promise<PropertyReport>;
}
