import { COLLECTIONS, DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { decodeCursor, encodeCursor } from '@/lib/pagination-cursor';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminFirestore } from '@/providers/firebase/admin';
import type {
  PropertyListResult,
  PropertyRepository,
} from '@/repositories/interfaces/property.repository';
import type { Property, PropertyFilters, PropertyStatus, PropertyStatusCounts } from '@/types';
import type { Query } from 'firebase-admin/firestore';
import { mapPropertyDoc } from './mappers';

const STATUSES: PropertyStatus[] = ['pending', 'approved', 'rejected', 'hidden'];

function applyEqualityFilters(query: Query, filters?: PropertyFilters): Query {
  let q = query;
  if (filters?.status) q = q.where('status', '==', filters.status);
  if (filters?.sellerId) q = q.where('sellerId', '==', filters.sellerId);
  if (filters?.city) q = q.where('city', '==', filters.city);
  if (filters?.zone) q = q.where('zone', '==', filters.zone);
  if (filters?.propertyType) q = q.where('propertyType', '==', filters.propertyType);
  return q;
}

function applyRangeFilter(query: Query, filters?: PropertyFilters): Query {
  if (filters?.minPrice !== undefined) {
    return query.where('price', '>=', filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    return query.where('price', '<=', filters.maxPrice);
  }
  if (filters?.minRooms !== undefined) {
    return query.where('rooms', '>=', filters.minRooms);
  }
  return query;
}

function postFilter(items: Property[], filters?: PropertyFilters): Property[] {
  let result = items;
  if (filters?.minPrice !== undefined && filters?.maxPrice !== undefined) {
    result = result.filter(
      (p) => p.price >= filters.minPrice! && p.price <= filters.maxPrice!,
    );
  } else if (filters?.maxPrice !== undefined && filters.minPrice === undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters?.minRooms !== undefined) {
    result = result.filter((p) => p.rooms >= filters.minRooms!);
  }
  if (filters?.minArea !== undefined) {
    result = result.filter((p) => p.area >= filters.minArea!);
  }
  if (filters?.amenities?.length) {
    result = result.filter((p) =>
      filters.amenities!.every((a) => p.amenities.includes(a)),
    );
  }
  if (filters?.query) {
    const qLower = filters.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(qLower) ||
        p.city.toLowerCase().includes(qLower) ||
        p.zone.toLowerCase().includes(qLower),
    );
  }
  return result;
}

function buildQuery(filters?: PropertyFilters): Query {
  return applyRangeFilter(
    applyEqualityFilters(
      getAdminFirestore().collection(COLLECTIONS.properties).orderBy('createdAt', 'desc'),
      filters,
    ),
    filters,
  );
}

export class FirebasePropertyRepository implements PropertyRepository {
  private collection() {
    return getAdminFirestore().collection(COLLECTIONS.properties);
  }

  async list(filters?: PropertyFilters): Promise<PropertyListResult> {
    const pageSize = filters?.pageSize ?? DEFAULT_PAGE_SIZE;
    let q = buildQuery(filters);
    const cursor = decodeCursor(filters?.cursor);
    if (cursor) {
      const cursorDoc = await this.collection().doc(cursor.id).get();
      if (cursorDoc.exists) {
        q = q.startAfter(cursorDoc);
      }
    }
    const snap = await q.limit(pageSize + 1).get();
    let docs = snap.docs;
    const hasMore = docs.length > pageSize;
    if (hasMore) docs = docs.slice(0, pageSize);
    let items = docs.map((d) => mapPropertyDoc(d.id, d.data()));
    items = postFilter(items, filters);
    const last = docs[docs.length - 1];
    const nextCursor =
      hasMore && last
        ? encodeCursor({
            createdAt: String(last.data().createdAt),
            id: last.id,
          })
        : undefined;
    return { items, nextCursor };
  }

  async getById(id: string): Promise<Property | null> {
    const snap = await this.collection().doc(id).get();
    if (!snap.exists) return null;
    return mapPropertyDoc(snap.id, snap.data()!);
  }

  async getBySlug(slug: string): Promise<Property | null> {
    const snap = await this.collection().where('slug', '==', slug).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0]!;
    return mapPropertyDoc(doc.id, doc.data());
  }

  async getBySellerId(sellerId: string): Promise<Property[]> {
    const snap = await this.collection()
      .where('sellerId', '==', sellerId)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((d) => mapPropertyDoc(d.id, d.data()));
  }

  async create(data: Property): Promise<void> {
    await this.collection().doc(data.id).set(data);
  }

  async update(id: string, data: Partial<Property>): Promise<void> {
    await this.collection().doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.collection().doc(id).delete();
  }

  async count(filters?: PropertyFilters): Promise<number> {
    const q = buildQuery(filters);
    const agg = await q.count().get();
    return agg.data().count;
  }

  async countByStatus(): Promise<PropertyStatusCounts> {
    const counts: PropertyStatusCounts = {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      hidden: 0,
    };
    await Promise.all(
      STATUSES.map(async (status) => {
        const agg = await this.collection().where('status', '==', status).count().get();
        const n = agg.data().count;
        if (status === 'approved') counts.approved = n;
        else if (status === 'pending') counts.pending = n;
        else if (status === 'rejected') counts.rejected = n;
        else if (status === 'hidden') counts.hidden = n;
        counts.total += n;
      }),
    );
    return counts;
  }

  async listFeatured(limit = 6): Promise<Property[]> {
    const now = new Date().toISOString();
    try {
      const snap = await this.collection()
        .where('featured', '==', true)
        .where('status', '==', 'approved')
        .orderBy('featuredPriority', 'desc')
        .limit(limit * 2)
        .get();
      return snap.docs
        .map((d) => mapPropertyDoc(d.id, d.data()))
        .filter((p) => !p.featuredUntil || p.featuredUntil > now)
        .slice(0, limit);
    } catch {
      const { items } = await this.list({ status: 'approved', pageSize: limit });
      return items.filter((p) => p.featured).slice(0, limit);
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.collection().doc(id).update({
      viewCount: FieldValue.increment(1),
      updatedAt: new Date().toISOString(),
    });
  }

  async incrementLeadCount(id: string): Promise<void> {
    await this.collection().doc(id).update({
      leadCount: FieldValue.increment(1),
      updatedAt: new Date().toISOString(),
    });
  }
}
