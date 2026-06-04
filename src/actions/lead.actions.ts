'use server';

import { getServerSession } from '@/lib/auth-server';
import { getPropertyRepository } from '@/providers/container.server';
import { leadService } from '@/services/lead.service';
import type { LeadActionType, LeadFilters } from '@/types';

export async function trackLeadAction(propertyId: string, actionType: LeadActionType) {
  const property = await getPropertyRepository().getById(propertyId);
  if (!property || property.status !== 'approved') {
    throw new Error('Property not available');
  }
  return leadService.track(property, actionType);
}

export async function getLeadAnalyticsAction(filters?: LeadFilters) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  return leadService.getAnalytics(session, filters);
}
