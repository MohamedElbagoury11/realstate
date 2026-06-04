export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export type PropertyType =
  | 'apartment'
  | 'house'
  | 'villa'
  | 'land'
  | 'commercial'
  | 'other';

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  area: number;
  rooms: number;
  bathrooms: number;
  propertyType: PropertyType;
  city: string;
  zone: string;
  address?: string;
  images: string[];
  amenities: string[];
  specifications: Record<string, string | number>;
  metadata: Record<string, unknown>;
  sellerId: string;
  status: PropertyStatus;
  /** Monetization: promoted placement on homepage/search */
  featured: boolean;
  featuredUntil?: string;
  featuredPriority: number;
  viewCount: number;
  leadCount: number;
  createdAt: string;
  updatedAt: string;
}

export type CreatePropertyInput = Omit<
  Property,
  'id' | 'slug' | 'status' | 'createdAt' | 'updatedAt' | 'viewCount' | 'leadCount'
> & {
  slug?: string;
  status?: PropertyStatus;
};

export type UpdatePropertyInput = Partial<
  Omit<Property, 'id' | 'sellerId' | 'createdAt'>
>;

export interface PropertyWithSeller extends Property {
  seller: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
    approved: boolean;
  };
}

export interface PropertyAnalyticsRow {
  propertyId: string;
  title: string;
  slug: string;
  status: PropertyStatus;
  views: number;
  leads: number;
  conversionRate: number;
}

export interface SellerPropertyAnalytics {
  totals: {
    views: number;
    leads: number;
    conversionRate: number;
    listings: number;
  };
  properties: PropertyAnalyticsRow[];
}
