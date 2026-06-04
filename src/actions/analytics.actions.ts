'use server';

import { analyticsService } from '@/services/analytics.service';

export async function trackPropertyViewAction(propertyId: string) {
  await analyticsService.trackView(propertyId);
}
