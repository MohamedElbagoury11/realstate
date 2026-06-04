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
    await this.audit.create({
      adminId: actor.id,
      adminEmail: actor.email,
      action,
      entityType,
      entityId,
      metadata,
      createdAt: new Date().toISOString(),
    });
  }

  async list(actor: SessionUser, limit?: number): Promise<AuditLogEntry[]> {
    if (actor.role !== 'admin') {
      throw new AppError('Admin access required', 'FORBIDDEN', 403);
    }
    return this.audit.list(limit);
  }
}

export const auditService = new AuditService();
