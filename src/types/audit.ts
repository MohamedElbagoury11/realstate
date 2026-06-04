export type AuditAction =
  | 'property.approved'
  | 'property.rejected'
  | 'property.hidden'
  | 'property.restored'
  | 'property.updated'
  | 'property.deleted'
  | 'settings.updated'
  | 'seller.approved'
  | 'seller.rejected';

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminEmail?: string;
  action: AuditAction;
  entityType: 'property' | 'user' | 'settings';
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
