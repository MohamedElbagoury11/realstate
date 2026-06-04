import { COLLECTIONS } from '@/lib/constants';
import { getAdminFirestore } from '@/providers/firebase/admin';
import type { AuditRepository } from '@/repositories/interfaces/audit.repository';
import type { AuditLogEntry } from '@/types';
import { randomUUID } from 'crypto';
import { mapAuditDoc } from './mappers';

export class FirebaseAuditRepository implements AuditRepository {
  private collection() {
    return getAdminFirestore().collection(COLLECTIONS.auditLogs);
  }

  async create(data: Omit<AuditLogEntry, 'id'>): Promise<AuditLogEntry> {
    const id = randomUUID();
    const entry: AuditLogEntry = { id, ...data };
    await this.collection().doc(id).set(entry);
    return entry;
  }

  async list(limit = 100): Promise<AuditLogEntry[]> {
    const snap = await this.collection().orderBy('createdAt', 'desc').limit(limit).get();
    return snap.docs.map((d) => mapAuditDoc(d.id, d.data()));
  }
}
