import { getPropertyRepository } from '@/providers/container.server';
import type {
  PropertyAnalyticsRow,
  SellerPropertyAnalytics,
  SessionUser,
} from '@/types';
import { AppError } from '@/lib/errors';

export interface PlatformConversionMetrics {
  totalViews: number;
  totalLeads: number;
  conversionRate: number;
  topByConversion: PropertyAnalyticsRow[];
}

export class AnalyticsService {
  private readonly properties = getPropertyRepository();

  async getPlatformConversion(): Promise<PlatformConversionMetrics> {
    const { items } = await this.properties.list({ status: 'approved', pageSize: 500 });
    let totalViews = 0;
    let totalLeads = 0;
    const rows: PropertyAnalyticsRow[] = items.map((p) => {
      totalViews += p.viewCount;
      totalLeads += p.leadCount;
      const conversionRate =
        p.viewCount > 0 ? Math.round((p.leadCount / p.viewCount) * 1000) / 10 : 0;
      return {
        propertyId: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        views: p.viewCount,
        leads: p.leadCount,
        conversionRate,
      };
    });
    const conversionRate =
      totalViews > 0 ? Math.round((totalLeads / totalViews) * 1000) / 10 : 0;
    const topByConversion = [...rows]
      .filter((r) => r.views >= 5)
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5);
    return { totalViews, totalLeads, conversionRate, topByConversion };
  }

  async getSellerAnalytics(actor: SessionUser): Promise<SellerPropertyAnalytics> {
    if (actor.role !== 'seller' && actor.role !== 'admin') {
      throw new AppError('Forbidden', 'FORBIDDEN', 403);
    }
    const sellerId = actor.role === 'admin' ? actor.id : actor.id;
    const listings = await this.properties.getBySellerId(sellerId);
    let totalViews = 0;
    let totalLeads = 0;
    const properties: PropertyAnalyticsRow[] = listings.map((p) => {
      totalViews += p.viewCount;
      totalLeads += p.leadCount;
      const conversionRate =
        p.viewCount > 0 ? Math.round((p.leadCount / p.viewCount) * 1000) / 10 : 0;
      return {
        propertyId: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        views: p.viewCount,
        leads: p.leadCount,
        conversionRate,
      };
    });
    const conversionRate =
      totalViews > 0 ? Math.round((totalLeads / totalViews) * 1000) / 10 : 0;
    return {
      totals: {
        views: totalViews,
        leads: totalLeads,
        conversionRate,
        listings: listings.length,
      },
      properties: properties.sort((a, b) => b.views - a.views),
    };
  }

  async trackView(propertyId: string): Promise<void> {
    const property = await this.properties.getById(propertyId);
    if (!property || property.status !== 'approved') return;
    await this.properties.incrementViewCount(propertyId);
  }
}

export const analyticsService = new AnalyticsService();
