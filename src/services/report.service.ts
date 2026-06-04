import { AppError } from '@/lib/errors';
import { getPropertyRepository, getReportRepository } from '@/providers/container.server';
import type { ReportReason, SessionUser } from '@/types';
import { notificationService } from './notification.service';

export class ReportService {
  private readonly reports = getReportRepository();
  private readonly properties = getPropertyRepository();

  async reportProperty(
    propertyId: string,
    reason: ReportReason,
    details: string | undefined,
    reporter: SessionUser | null,
  ): Promise<void> {
    const property = await this.properties.getById(propertyId);
    if (!property || property.status !== 'approved') {
      throw new AppError('Property not found', 'NOT_FOUND', 404);
    }
    await this.reports.create({
      propertyId,
      propertyTitle: property.title,
      reason,
      details,
      reporterId: reporter?.id,
      createdAt: new Date().toISOString(),
    });
    await notificationService.notify(
      property.sellerId,
      'property.reported',
      'Listing reported',
      `Your listing "${property.title}" was reported (${reason}). Our team will review it.`,
      propertyId,
    );
  }
}

export const reportService = new ReportService();
