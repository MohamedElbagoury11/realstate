import type { AuditRepository } from '@/repositories/interfaces/audit.repository';
import type { NotificationRepository } from '@/repositories/interfaces/notification.repository';
import type { ReportRepository } from '@/repositories/interfaces/report.repository';
import type { ImageRepository } from '@/repositories/interfaces/image.repository';
import type { LeadRepository } from '@/repositories/interfaces/lead.repository';
import type { PropertyRepository } from '@/repositories/interfaces/property.repository';
import type { SearchRepository } from '@/repositories/interfaces/search.repository';
import type { SettingsRepository } from '@/repositories/interfaces/settings.repository';
import type { UserRepository } from '@/repositories/interfaces/user.repository';
import { CloudinaryImageRepository } from '@/repositories/cloudinary/image.repository';
import { FirebaseAuditRepository } from '@/repositories/firebase/audit.repository';
import { FirebaseNotificationRepository } from '@/repositories/firebase/notification.repository';
import { FirebaseReportRepository } from '@/repositories/firebase/report.repository';
import { FirebaseLeadRepository } from '@/repositories/firebase/lead.repository';
import { FirebasePropertyRepository } from '@/repositories/firebase/property.repository';
import { FirebaseSearchRepository } from '@/repositories/firebase/search.repository';
import { FirebaseSettingsRepository } from '@/repositories/firebase/settings.repository';
import { FirebaseUserRepository } from '@/repositories/firebase/user.repository';
import { isCloudinaryConfigured } from '@/providers/cloudinary/config';

let userRepo: UserRepository | undefined;
let propertyRepo: PropertyRepository | undefined;
let searchRepo: SearchRepository | undefined;
let imageRepo: ImageRepository | undefined;
let settingsRepo: SettingsRepository | undefined;
let leadRepo: LeadRepository | undefined;
let auditRepo: AuditRepository | undefined;
let notificationRepo: NotificationRepository | undefined;
let reportRepo: ReportRepository | undefined;

export function getUserRepository(): UserRepository {
  if (!userRepo) userRepo = new FirebaseUserRepository();
  return userRepo;
}

export function getPropertyRepository(): PropertyRepository {
  if (!propertyRepo) propertyRepo = new FirebasePropertyRepository();
  return propertyRepo;
}

export function getSearchRepository(): SearchRepository {
  if (!searchRepo) searchRepo = new FirebaseSearchRepository();
  return searchRepo;
}

export function getImageRepository(): ImageRepository {
  if (!imageRepo) {
    if (!isCloudinaryConfigured()) {
      throw new Error(
        'Image uploads require Cloudinary. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local',
      );
    }
    imageRepo = new CloudinaryImageRepository();
  }
  return imageRepo;
}

export function getSettingsRepository(): SettingsRepository {
  if (!settingsRepo) settingsRepo = new FirebaseSettingsRepository();
  return settingsRepo;
}

export function getLeadRepository(): LeadRepository {
  if (!leadRepo) leadRepo = new FirebaseLeadRepository();
  return leadRepo;
}

export function getAuditRepository(): AuditRepository {
  if (!auditRepo) auditRepo = new FirebaseAuditRepository();
  return auditRepo;
}

export function getNotificationRepository(): NotificationRepository {
  if (!notificationRepo) notificationRepo = new FirebaseNotificationRepository();
  return notificationRepo;
}

export function getReportRepository(): ReportRepository {
  if (!reportRepo) reportRepo = new FirebaseReportRepository();
  return reportRepo;
}
