export const DEFAULT_PAGE_SIZE = 12;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const COLLECTIONS = {
  users: 'users',
  properties: 'properties',
  settings: 'platform_settings',
  leads: 'leads',
  auditLogs: 'audit_logs',
  notifications: 'notifications',
  reports: 'property_reports',
} as const;

export const PROPERTY_CATEGORY_TYPES = [
  'apartment',
  'house',
  'villa',
  'land',
  'commercial',
] as const satisfies readonly import('@/types').PropertyType[];

/** Plural label keys under `property.types` (e.g. apartments, houses). */
export const PROPERTY_CATEGORY_LABEL_KEYS: Record<
  (typeof PROPERTY_CATEGORY_TYPES)[number],
  'apartments' | 'houses' | 'villas' | 'land' | 'commercial'
> = {
  apartment: 'apartments',
  house: 'houses',
  villa: 'villas',
  land: 'land',
  commercial: 'commercial',
};

export const SETTINGS_DOC_ID = 'default';
