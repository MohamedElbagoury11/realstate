'use server';

import { getServerSession } from '@/lib/auth-server';
import { settingsFormSchema, type SettingsFormInput } from '@/lib/validation/property.schema';
import { settingsService } from '@/services/settings.service';
import { revalidatePath } from 'next/cache';

export async function updatePlatformSettingsAction(input: SettingsFormInput) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  const parsed = settingsFormSchema.parse(input);
  const settings = await settingsService.update(session, parsed);
  revalidatePath('/admin/settings');
  revalidatePath('/property', 'layout');
  return settings;
}
