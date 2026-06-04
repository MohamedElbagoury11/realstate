import { COLLECTIONS } from '@/lib/constants';
import { getAdminFirestore } from '@/providers/firebase/admin';
import type { LeadRepository } from '@/repositories/interfaces/lead.repository';
import type { Lead, LeadAnalytics, LeadFilters } from '@/types';
import { randomUUID } from 'crypto';
import { mapLeadDoc } from './mappers';

function inDateRange(iso: string, from?: string, to?: string): boolean {
  if (from && iso < from) return false;
  if (to && iso > to) return false;
  return true;
}

function weekKey(iso: string): string {
  const d = new Date(iso);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toISOString().slice(0, 10);
}

export class FirebaseLeadRepository implements LeadRepository {
  private collection() {
    return getAdminFirestore().collection(COLLECTIONS.leads);
  }

  async create(data: Omit<Lead, 'id'>): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { id, ...data };
    await this.collection().doc(id).set(lead);
    return lead;
  }

  async list(filters?: LeadFilters): Promise<Lead[]> {
    let q = this.collection().orderBy('createdAt', 'desc').limit(2000);
    if (filters?.propertyId) {
      q = q.where('propertyId', '==', filters.propertyId);
    }
    if (filters?.actionType) {
      q = q.where('actionType', '==', filters.actionType);
    }
    const snap = await q.get();
    let items = snap.docs.map((d) => mapLeadDoc(d.id, d.data()));
    if (filters?.from || filters?.to) {
      items = items.filter((l) => inDateRange(l.createdAt, filters.from, filters.to));
    }
    if (filters?.propertyType) {
      items = items.filter((l) => l.propertyType === filters.propertyType);
    }
    if (filters?.city) {
      items = items.filter((l) => l.city === filters.city);
    }
    return items;
  }

  async getAnalytics(filters?: LeadFilters): Promise<LeadAnalytics> {
    const leads = await this.list(filters);
    const totalLeads = leads.length;
    const totalCalls = leads.filter((l) => l.actionType === 'call').length;
    const totalWhatsapp = leads.filter((l) => l.actionType === 'whatsapp').length;

    const propertyCounts = new Map<string, { propertyTitle: string; count: number }>();
    for (const l of leads) {
      const cur = propertyCounts.get(l.propertyId) ?? {
        propertyTitle: l.propertyTitle,
        count: 0,
      };
      cur.count += 1;
      propertyCounts.set(l.propertyId, cur);
    }
    const topProperties = [...propertyCounts.entries()]
      .map(([propertyId, v]) => ({ propertyId, propertyTitle: v.propertyTitle, count: v.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const dayMap = new Map<string, number>();
    const weekMap = new Map<string, number>();
    const monthMap = new Map<string, number>();
    for (const l of leads) {
      const day = l.createdAt.slice(0, 10);
      dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
      const week = weekKey(l.createdAt);
      weekMap.set(week, (weekMap.get(week) ?? 0) + 1);
      const month = l.createdAt.slice(0, 7);
      monthMap.set(month, (monthMap.get(month) ?? 0) + 1);
    }

    const sortEntries = (m: Map<string, number>) =>
      [...m.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, count]) => ({ key, count }));

    return {
      totalLeads,
      totalCalls,
      totalWhatsapp,
      topProperties,
      byDay: sortEntries(dayMap).map(({ key, count }) => ({ date: key, count })),
      byWeek: sortEntries(weekMap).map(({ key, count }) => ({ week: key, count })),
      byMonth: sortEntries(monthMap).map(({ key, count }) => ({ month: key, count })),
    };
  }
}
