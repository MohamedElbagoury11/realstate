export type LeadActionType = 'whatsapp' | 'call';

export interface Lead {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyType?: string;
  city?: string;
  zone?: string;
  actionType: LeadActionType;
  createdAt: string;
}

export interface LeadFilters {
  from?: string;
  to?: string;
  propertyId?: string;
  propertyType?: string;
  city?: string;
  actionType?: LeadActionType;
}

export interface LeadAnalytics {
  totalLeads: number;
  totalCalls: number;
  totalWhatsapp: number;
  topProperties: { propertyId: string; propertyTitle: string; count: number }[];
  byDay: { date: string; count: number }[];
  byWeek: { week: string; count: number }[];
  byMonth: { month: string; count: number }[];
}
