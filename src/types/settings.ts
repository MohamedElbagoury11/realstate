export interface PlatformSettings {
  id: 'default';
  contactPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  socialLinks: Record<string, string>;
  updatedAt: string;
  updatedBy?: string;
}

export const DEFAULT_PLATFORM_SETTINGS: Omit<PlatformSettings, 'updatedAt'> = {
  id: 'default',
  contactPhone: '',
  whatsappNumber: '',
  contactEmail: '',
  socialLinks: {},
};
