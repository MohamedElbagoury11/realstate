import { COLLECTIONS, SETTINGS_DOC_ID } from '@/lib/constants';
import { DEFAULT_PLATFORM_SETTINGS } from '@/types/settings';
import { getAdminFirestore } from '@/providers/firebase/admin';
import type { SettingsRepository } from '@/repositories/interfaces/settings.repository';
import type { PlatformSettings } from '@/types';
import { mapSettingsDoc } from './mappers';

export class FirebaseSettingsRepository implements SettingsRepository {
  private doc() {
    return getAdminFirestore().collection(COLLECTIONS.settings).doc(SETTINGS_DOC_ID);
  }

  async get(): Promise<PlatformSettings> {
    const snap = await this.doc().get();
    if (!snap.exists) {
      const now = new Date().toISOString();
      return { ...DEFAULT_PLATFORM_SETTINGS, updatedAt: now };
    }
    return mapSettingsDoc(snap.data()!);
  }

  async upsert(data: Omit<PlatformSettings, 'id'>): Promise<void> {
    await this.doc().set({ ...data, id: SETTINGS_DOC_ID }, { merge: true });
  }
}
