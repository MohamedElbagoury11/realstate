import { AppError } from '@/lib/errors';
import { getLeadRepository, getPropertyRepository } from '@/providers/container.server';
import { notificationService } from './notification.service';
import type { Lead, LeadActionType, LeadAnalytics, LeadFilters, Property, SessionUser } from '@/types';

export class LeadService {
  private readonly leads = getLeadRepository();

  async track(property: Property, actionType: LeadActionType): Promise<Lead> {
    if (property.status !== 'approved') {
      throw new AppError('Leads only for approved listings', 'FORBIDDEN', 403);
    }
    const lead = await this.leads.create({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyType: property.propertyType,
      city: property.city,
      zone: property.zone,
      actionType,
      createdAt: new Date().toISOString(),
    });
    await getPropertyRepository().incrementLeadCount(property.id);
    await notificationService.notify(
      property.sellerId,
      'property.lead',
      'New inquiry',
      `Someone clicked ${actionType === 'whatsapp' ? 'WhatsApp' : 'Call'} on "${property.title}".`,
      property.id,
    );
    return lead;
  }

  async getAnalytics(actor: SessionUser, filters?: LeadFilters): Promise<LeadAnalytics> {
    if (actor.role !== 'admin') {
      throw new AppError('Admin access required', 'FORBIDDEN', 403);
    }
    return this.leads.getAnalytics(filters);
  }

  async list(actor: SessionUser, filters?: LeadFilters): Promise<Lead[]> {
    if (actor.role !== 'admin') {
      throw new AppError('Admin access required', 'FORBIDDEN', 403);
    }
    return this.leads.list(filters);
  }
}

export const leadService = new LeadService();
