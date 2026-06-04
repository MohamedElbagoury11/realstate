'use server';

import { getServerSession } from '@/lib/auth-server';
import type { PropertyFormInput } from '@/lib/validation/property.schema';
import { propertyFormSchema } from '@/lib/validation/property.schema';
import { isCloudinaryUrl } from '@/providers/cloudinary/config';
import { propertyService } from '@/services/property.service';
import type { PropertyStatus } from '@/types/property';
import { revalidatePath } from 'next/cache';

function revalidatePropertyPaths() {
  revalidatePath('/admin/properties');
  revalidatePath('/admin/dashboard');
  revalidatePath('/seller/dashboard');
  revalidatePath('/');
  revalidatePath('/search');
}

export async function createPropertyAction(
  input: PropertyFormInput,
  imageUrls: string[],
) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  const parsed = propertyFormSchema.parse(input);
  if (!imageUrls.length) {
    throw new Error('Add at least one image');
  }
  for (const url of imageUrls) {
    if (!isCloudinaryUrl(url)) {
      throw new Error('Images must be uploaded to Cloudinary first');
    }
  }
  const property = await propertyService.create(session, parsed, imageUrls);
  revalidatePropertyPaths();
  return property;
}

export async function updatePropertyAction(
  id: string,
  input: PropertyFormInput,
  imageUrls?: string[],
  adminFields?: {
    featured?: boolean;
    featuredUntil?: string;
    featuredPriority?: number;
  },
) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  const parsed = propertyFormSchema.parse(input);
  if (imageUrls?.length) {
    for (const url of imageUrls) {
      if (!isCloudinaryUrl(url)) {
        throw new Error('Images must be uploaded to Cloudinary first');
      }
    }
  }
  await propertyService.update(session, id, {
    ...parsed,
    ...(imageUrls?.length ? { images: imageUrls } : {}),
    ...(session.role === 'admin' && adminFields ? adminFields : {}),
  });
  revalidatePropertyPaths();
}

export async function updatePropertyStatusAction(id: string, status: PropertyStatus) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  await propertyService.setStatus(session, id, status);
  revalidatePropertyPaths();
}

export async function hidePropertyAction(id: string) {
  return updatePropertyStatusAction(id, 'hidden');
}

export async function restorePropertyAction(id: string) {
  return updatePropertyStatusAction(id, 'approved');
}

export async function deletePropertyAction(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  await propertyService.delete(session, id);
  revalidatePropertyPaths();
}
