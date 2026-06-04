import { AppError } from '@/lib/errors';
import type { SettingsFormInput } from '@/lib/validation/property.schema';
import { getSettingsRepository } from '@/providers/container.server';
import type { PlatformSettings, SessionUser } from '@/types';
import { auditService } from './audit.service';

export class SettingsService {
  private readonly settings = getSettingsRepository();

  async getPublic(): Promise<PlatformSettings> {
    return this.settings.get();
  }

  async getForAdmin(actor: SessionUser): Promise<PlatformSettings> {
    this.assertAdmin(actor);
    return this.settings.get();
  }

  async update(actor: SessionUser, input: SettingsFormInput): Promise<PlatformSettings> {
    this.assertAdmin(actor);
    const now = new Date().toISOString();
    const data: Omit<PlatformSettings, 'id'> = {
      contactPhone: input.contactPhone,
      whatsappNumber: input.whatsappNumber,
      contactEmail: input.contactEmail,
      socialLinks: input.socialLinks,
      updatedAt: now,
      updatedBy: actor.id,
    };
    await this.settings.upsert(data);
    await auditService.log(actor, 'settings.updated', 'settings', 'default', {
      fields: Object.keys(input),
    });
    return { id: 'default', ...data };
  }

  private assertAdmin(actor: SessionUser): void {
    if (actor.role !== 'admin') {
      throw new AppError('Admin access required', 'FORBIDDEN', 403);
    }
  }
}

export const settingsService = new SettingsService();
