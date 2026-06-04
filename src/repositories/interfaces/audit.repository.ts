import type { AuditLogEntry } from '@/types';

export interface AuditRepository {
  create(data: Omit<AuditLogEntry, 'id'>): Promise<AuditLogEntry>;
  list(limit?: number): Promise<AuditLogEntry[]>;
}
