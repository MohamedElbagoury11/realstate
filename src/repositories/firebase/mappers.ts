import type { DocumentData } from 'firebase-admin/firestore';
import type { Property, PropertyType } from '@/types/property';
import type { User } from '@/types/user';
import type { PlatformSettings } from '@/types/settings';
import type { Lead } from '@/types/lead';
import type { AuditLogEntry } from '@/types/audit';

const PROPERTY_TYPES: PropertyType[] = [
  'apartment',
  'house',
  'villa',
  'land',
  'commercial',
  'other',
];

function asPropertyType(value: unknown): PropertyType {
  if (typeof value === 'string' && PROPERTY_TYPES.includes(value as PropertyType)) {
    return value as PropertyType;
  }
  return 'other';
}

export function mapUserDoc(id: string, data: DocumentData): User {
  return {
    id,
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    phone: data.phone ? String(data.phone) : undefined,
    role: data.role as User['role'],
    approved: Boolean(data.approved),
    rejected: Boolean(data.rejected),
    createdAt: String(data.createdAt ?? new Date().toISOString()),
  };
}

export function mapPropertyDoc(id: string, data: DocumentData): Property {
  return {
    id,
    slug: String(data.slug ?? id),
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    price: Number(data.price ?? 0),
    area: Number(data.area ?? 0),
    rooms: Number(data.rooms ?? 0),
    bathrooms: Number(data.bathrooms ?? 0),
    propertyType: asPropertyType(data.propertyType),
    city: String(data.city ?? ''),
    zone: String(data.zone ?? ''),
    address: data.address ? String(data.address) : undefined,
    images: Array.isArray(data.images) ? data.images.map(String) : [],
    amenities: Array.isArray(data.amenities) ? data.amenities.map(String) : [],
    specifications:
      data.specifications && typeof data.specifications === 'object'
        ? (data.specifications as Record<string, string | number>)
        : {},
    metadata:
      data.metadata && typeof data.metadata === 'object'
        ? (data.metadata as Record<string, unknown>)
        : {},
    sellerId: String(data.sellerId ?? ''),
    status: data.status as Property['status'],
    featured: Boolean(data.featured),
    featuredUntil: data.featuredUntil ? String(data.featuredUntil) : undefined,
    featuredPriority: Number(data.featuredPriority ?? 0),
    viewCount: Number(data.viewCount ?? 0),
    leadCount: Number(data.leadCount ?? 0),
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    updatedAt: String(data.updatedAt ?? new Date().toISOString()),
  };
}

export function mapSettingsDoc(data: DocumentData): PlatformSettings {
  return {
    id: 'default',
    contactPhone: String(data.contactPhone ?? ''),
    whatsappNumber: String(data.whatsappNumber ?? ''),
    contactEmail: String(data.contactEmail ?? ''),
    socialLinks:
      data.socialLinks && typeof data.socialLinks === 'object'
        ? (data.socialLinks as Record<string, string>)
        : {},
    updatedAt: String(data.updatedAt ?? new Date().toISOString()),
    updatedBy: data.updatedBy ? String(data.updatedBy) : undefined,
  };
}

export function mapLeadDoc(id: string, data: DocumentData): Lead {
  return {
    id,
    propertyId: String(data.propertyId ?? ''),
    propertyTitle: String(data.propertyTitle ?? ''),
    propertyType: data.propertyType ? String(data.propertyType) : undefined,
    city: data.city ? String(data.city) : undefined,
    zone: data.zone ? String(data.zone) : undefined,
    actionType: data.actionType as Lead['actionType'],
    createdAt: String(data.createdAt ?? new Date().toISOString()),
  };
}

export function mapAuditDoc(id: string, data: DocumentData): AuditLogEntry {
  return {
    id,
    adminId: String(data.adminId ?? ''),
    adminEmail: data.adminEmail ? String(data.adminEmail) : undefined,
    action: data.action as AuditLogEntry['action'],
    entityType: data.entityType as AuditLogEntry['entityType'],
    entityId: String(data.entityId ?? ''),
    metadata:
      data.metadata && typeof data.metadata === 'object'
        ? (data.metadata as Record<string, unknown>)
        : undefined,
    createdAt: String(data.createdAt ?? new Date().toISOString()),
  };
}
