import type { PlatformSettings } from '@/types';

export interface SettingsRepository {
  get(): Promise<PlatformSettings>;
  upsert(data: Omit<PlatformSettings, 'id'>): Promise<void>;
}
