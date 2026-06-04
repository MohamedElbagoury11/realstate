import { COLLECTIONS } from '@/lib/constants';
import { getAdminFirestore } from '@/providers/firebase/admin';
import type { ReportRepository } from '@/repositories/interfaces/report.repository';
import type { PropertyReport } from '@/types';
import { randomUUID } from 'crypto';

export class FirebaseReportRepository implements ReportRepository {
  private collection() {
    return getAdminFirestore().collection(COLLECTIONS.reports);
  }

  async create(data: Omit<PropertyReport, 'id'>): Promise<PropertyReport> {
    const id = randomUUID();
    const report: PropertyReport = { id, ...data };
    await this.collection().doc(id).set(report);
    return report;
  }
}
