import { AppError } from '@/lib/errors';
import { createPropertySlug } from '@/lib/slug';
import type { PropertyFormInput } from '@/lib/validation/property.schema';
import {
  getPropertyRepository,
  getSearchRepository,
  getUserRepository,
} from '@/providers/container.server';
import type {
  Property,
  PropertyFilters,
  PropertyStatus,
  PropertyStatusCounts,
  PropertyWithSeller,
  SearchResult,
  SessionUser,
} from '@/types';
import { randomUUID } from 'crypto';
import { auditService } from './audit.service';
import { notificationService } from './notification.service';

export class PropertyService {
  private readonly properties = getPropertyRepository();
  private readonly search = getSearchRepository();
  private readonly users = getUserRepository();

  async searchPublic(filters: PropertyFilters): Promise<SearchResult<Property>> {
    return this.search.search({
      ...filters,
      status: 'approved',
    });
  }

  async getPublicBySlug(slug: string): Promise<Property | null> {
    const property = await this.properties.getBySlug(slug);
    if (!property || property.status !== 'approved') return null;
    return property;
  }

  async getByIdForActor(actor: SessionUser | null, id: string): Promise<Property | null> {
    const property = await this.properties.getById(id);
    if (!property) return null;
    if (property.status === 'approved') return property;
    if (!actor) return null;
    if (actor.role === 'admin') return property;
    if (actor.role === 'seller' && actor.id === property.sellerId) return property;
    return null;
  }

  async getWithSellerForAdmin(actor: SessionUser, id: string): Promise<PropertyWithSeller | null> {
    this.assertAdmin(actor);
    const property = await this.properties.getById(id);
    if (!property) return null;
    const seller = await this.users.getById(property.sellerId);
    if (!seller) {
      throw new AppError('Seller not found', 'NOT_FOUND', 404);
    }
    return {
      ...property,
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        createdAt: seller.createdAt,
        approved: seller.approved,
      },
    };
  }

  async listForSeller(actor: SessionUser): Promise<Property[]> {
    this.assertApprovedSeller(actor);
    return this.properties.getBySellerId(actor.id);
  }

  async listForAdmin(actor: SessionUser, status?: PropertyStatus): Promise<Property[]> {
    this.assertAdmin(actor);
    const filters: PropertyFilters = { pageSize: 500 };
    if (status) filters.status = status;
    const { items } = await this.properties.list(filters);
    return items;
  }

  async create(actor: SessionUser, input: PropertyFormInput, images: string[]): Promise<Property> {
    this.assertCanCreate(actor);
    const id = randomUUID();
    const now = new Date().toISOString();
    const slug = createPropertySlug(input.title, id);
    const property: Property = {
      id,
      slug,
      title: input.title,
      description: input.description,
      price: input.price,
      area: input.area,
      rooms: input.rooms,
      bathrooms: input.bathrooms,
      propertyType: input.propertyType,
      city: input.city,
      zone: input.zone,
      address: input.address,
      images,
      amenities: input.amenities,
      specifications: input.specifications,
      metadata: input.metadata,
      sellerId: actor.id,
      status: 'pending',
      featured: false,
      featuredPriority: 0,
      viewCount: 0,
      leadCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    await this.properties.create(property);
    return property;
  }

  async update(
    actor: SessionUser,
    id: string,
    data: Partial<Property>,
  ): Promise<void> {
    const existing = await this.properties.getById(id);
    if (!existing) throw new AppError('Property not found', 'NOT_FOUND', 404);
    this.assertCanEdit(actor, existing);
    if (actor.role !== 'admin' && ('status' in data || 'sellerId' in data)) {
      throw new AppError('Cannot change status or seller', 'FORBIDDEN', 403);
    }
    const safe = { ...data };
    delete safe.status;
    delete safe.sellerId;
    delete safe.id;
    delete safe.createdAt;
    const updateData =
      actor.role === 'admin'
        ? safe
        : {
            ...safe,
            status: 'pending' as const,
          };
    await this.properties.update(id, updateData);
    if (actor.role === 'admin') {
      await auditService.log(actor, 'property.updated', 'property', id, {
        fields: Object.keys(safe),
      });
    }
  }

  async delete(actor: SessionUser, id: string): Promise<void> {
    const existing = await this.properties.getById(id);
    if (!existing) throw new AppError('Property not found', 'NOT_FOUND', 404);
    this.assertCanEdit(actor, existing);
    await this.properties.delete(id);
    if (actor.role === 'admin') {
      await auditService.log(actor, 'property.deleted', 'property', id, {
        title: existing.title,
      });
    }
  }

  async setStatus(
    actor: SessionUser,
    id: string,
    status: PropertyStatus,
  ): Promise<void> {
    this.assertAdmin(actor);
    const existing = await this.properties.getById(id);
    if (!existing) throw new AppError('Property not found', 'NOT_FOUND', 404);
    this.validateStatusTransition(existing.status, status);
    await this.properties.update(id, { status });
    let auditAction: import('@/types').AuditAction | null = null;
    if (status === 'approved' && existing.status === 'hidden') {
      auditAction = 'property.restored';
    } else if (status === 'approved') auditAction = 'property.approved';
    else if (status === 'rejected') auditAction = 'property.rejected';
    else if (status === 'hidden') auditAction = 'property.hidden';
    if (auditAction) {
      await auditService.log(actor, auditAction, 'property', id, {
        from: existing.status,
        to: status,
      });
    }
    await this.notifySellerStatusChange(existing, status);
  }

  async listFeaturedPublic(limit = 6): Promise<Property[]> {
    return this.properties.listFeatured(limit);
  }

  async getAnalytics(actor: SessionUser): Promise<PropertyStatusCounts> {
    this.assertAdmin(actor);
    return this.properties.countByStatus();
  }

  private validateStatusTransition(from: PropertyStatus, to: PropertyStatus): void {
    const allowed: Record<PropertyStatus, PropertyStatus[]> = {
      pending: ['approved', 'rejected'],
      approved: ['hidden'],
      hidden: ['approved'],
      rejected: [],
    };
    if (!allowed[from]?.includes(to)) {
      throw new AppError(
        `Cannot transition from ${from} to ${to}`,
        'INVALID_TRANSITION',
        400,
      );
    }
  }

  private assertCanCreate(actor: SessionUser): void {
    if (actor.role === 'admin') return;
    if (actor.role === 'seller' && actor.approved) return;
    throw new AppError(
      'Seller must be approved to create listings',
      'SELLER_NOT_APPROVED',
      403,
    );
  }

  private assertCanEdit(actor: SessionUser, property: Property): void {
    if (actor.role === 'admin') return;
    if (actor.role === 'seller' && actor.approved && actor.id === property.sellerId) return;
    throw new AppError('Not allowed to edit this property', 'FORBIDDEN', 403);
  }

  private assertApprovedSeller(actor: SessionUser): void {
    if (actor.role === 'admin') return;
    if (actor.role === 'seller' && actor.approved) return;
    throw new AppError('Seller not approved', 'FORBIDDEN', 403);
  }

  private assertAdmin(actor: SessionUser): void {
    if (actor.role !== 'admin') {
      throw new AppError('Admin access required', 'FORBIDDEN', 403);
    }
  }

  private async notifySellerStatusChange(
    property: Property,
    status: PropertyStatus,
  ): Promise<void> {
    const messages: Partial<Record<PropertyStatus, { title: string; message: string; type: import('@/types').NotificationType }>> = {
      approved: {
        type: 'property.approved',
        title: 'Listing approved',
        message: `"${property.title}" is now live on EstateHub.`,
      },
      rejected: {
        type: 'property.rejected',
        title: 'Listing rejected',
        message: `"${property.title}" was not approved. Contact support for details.`,
      },
      hidden: {
        type: 'property.hidden',
        title: 'Listing hidden',
        message: `"${property.title}" has been hidden from public search.`,
      },
    };
    const payload = messages[status];
    if (!payload) return;
    await notificationService.notify(
      property.sellerId,
      payload.type,
      payload.title,
      payload.message,
      property.id,
    );
  }
}

export const propertyService = new PropertyService();
