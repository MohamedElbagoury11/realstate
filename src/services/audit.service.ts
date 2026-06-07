import type { AuditAction, AuditLogEntry, SessionUser } from '@/types';
import { getAuditRepository } from '@/providers/container.server';
import { AppError } from '@/lib/errors';

export class AuditService {
  private readonly audit = getAuditRepository();

  async log(
    actor: SessionUser,
    action: AuditAction,
    entityType: AuditLogEntry['entityType'],
    entityId: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    if (actor.role !== 'admin') {
      throw new AppError('Admin access required', 'FORBIDDEN', 403);
    }
    const entry: Omit<AuditLogEntry, 'id'> = {
      adminId: actor.id,
      adminEmail: actor.email,
      action,
      entityType,
      entityId,
      createdAt: new Date().toISOString(),
    };
    if (metadata !== undefined) {
      entry.metadata = metadata;
    }
    await this.audit.create(entry);
  }

  async list(actor: SessionUser, limit?: number): Promise<AuditLogEntry[]> {
    if (actor.role !== 'admin') {
      throw new AppError('Admin access required', 'FORBIDDEN', 403);
    }
    return this.audit.list(limit);
  }
}

export const auditService = new AuditService();
