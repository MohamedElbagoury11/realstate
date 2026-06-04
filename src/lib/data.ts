import { cache } from 'react';
import { isFirebaseAdminConfigured } from '@/providers/firebase/admin';
import { searchService } from '@/services/search.service';
import { propertyService } from '@/services/property.service';
import { userService } from '@/services/user.service';
import { settingsService } from '@/services/settings.service';
import { leadService } from '@/services/lead.service';
import { auditService } from '@/services/audit.service';
import { analyticsService } from '@/services/analytics.service';
import { notificationService } from '@/services/notification.service';
import type { LeadFilters, PropertyFilters, PropertyStatus } from '@/types';
import { getServerSession } from '@/lib/auth-server';

export function isDataLayerReady(): boolean {
  return isFirebaseAdminConfigured();
}

export async function fetchPublicSearch(filters: PropertyFilters) {
  if (!isDataLayerReady()) {
    return { items: [], total: 0, page: 1, pageSize: 12, hasMore: false };
  }
  return searchService.search(filters);
}

export const fetchPublicProperty = cache(async (slug: string) => {
  if (!isDataLayerReady()) return null;
  return propertyService.getPublicBySlug(slug);
});

export async function fetchPlatformSettings() {
  if (!isDataLayerReady()) return null;
  return settingsService.getPublic();
}

export async function fetchSellerProperties() {
  const session = await getServerSession();
  if (!session || !isDataLayerReady()) return [];
  if (session.role === 'seller' && !session.approved) return [];
  try {
    return propertyService.listForSeller(session);
  } catch {
    return [];
  }
}

export async function fetchAdminProperties(status?: PropertyStatus) {
  const session = await getServerSession();
  if (!session || !isDataLayerReady()) return [];
  try {
    return propertyService.listForAdmin(session, status);
  } catch {
    return [];
  }
}

export async function fetchAdminPropertyWithSeller(id: string) {
  const session = await getServerSession();
  if (!session || !isDataLayerReady()) return null;
  try {
    return propertyService.getWithSellerForAdmin(session, id);
  } catch {
    return null;
  }
}

export async function fetchSellerProperty(id: string) {
  const session = await getServerSession();
  if (!session || !isDataLayerReady()) return null;
  try {
    return propertyService.getByIdForActor(session, id);
  } catch {
    return null;
  }
}

export async function fetchPendingSellers() {
  const session = await getServerSession();
  if (!session || !isDataLayerReady()) return [];
  try {
    return userService.getSellersPendingApproval();
  } catch {
    return [];
  }
}

export async function fetchAdminAnalytics() {
  const session = await getServerSession();
  if (!session || !isDataLayerReady()) {
    return { total: 0, approved: 0, pending: 0, rejected: 0, hidden: 0 };
  }
  try {
    return propertyService.getAnalytics(session);
  } catch {
    return { total: 0, approved: 0, pending: 0, rejected: 0, hidden: 0 };
  }
}

export async function fetchAdminSettings() {
  const session = await getServerSession();
  if (!session || !isDataLayerReady()) return null;
  try {
    return settingsService.getForAdmin(session);
  } catch {
    return null;
  }
}

export async function fetchLeadAnalytics(filters?: LeadFilters) {
  const session = await getServerSession();
  if (!session || !isDataLayerReady()) return null;
  try {
    return leadService.getAnalytics(session, filters);
  } catch {
    return null;
  }
}

export async function fetchAuditLogs() {
  const session = await getServerSession();
  if (!session || !isDataLayerReady()) return [];
  try {
    return auditService.list(session, 200);
  } catch {
    return [];
  }
}

export async function fetchFeaturedProperties(limit = 6) {
  if (!isDataLayerReady()) return [];
  try {
    const featured = await propertyService.listFeaturedPublic(limit);
    if (featured.length > 0) return featured;
    const { items } = await searchService.search({ status: 'approved', pageSize: limit });
    return items;
  } catch {
    return [];
  }
}

export async function fetchLatestProperties(limit = 8) {
  if (!isDataLayerReady()) return [];
  try {
    const { items } = await propertyService.searchPublic({ pageSize: limit });
    return items;
  } catch {
    return [];
  }
}

export async function fetchPlatformConversion() {
  if (!isDataLayerReady()) return null;
  try {
    return analyticsService.getPlatformConversion();
  } catch {
    return null;
  }
}

export async function fetchSellerAnalytics() {
  const session = await getServerSession();
  if (!session || !isDataLayerReady()) return null;
  try {
    return analyticsService.getSellerAnalytics(session);
  } catch {
    return null;
  }
}

export async function fetchSellerNotifications() {
  const session = await getServerSession();
  if (!session || !isDataLayerReady()) return [];
  try {
    return notificationService.listForUser(session);
  } catch {
    return [];
  }
}
