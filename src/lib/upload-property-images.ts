import { isCloudinaryUrl } from '@/providers/cloudinary/config';

export async function uploadPropertyImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('images', file);
  }

  const response = await fetch('/api/upload/property-images', {
    method: 'POST',
    body: formData,
  });

  const body = (await response.json()) as { urls?: string[]; error?: string };
  if (!response.ok) {
    throw new Error(body.error ?? 'Image upload failed');
  }
  if (!body.urls?.length) {
    throw new Error('No image URLs returned');
  }
  for (const url of body.urls) {
    if (!isCloudinaryUrl(url)) {
      throw new Error('Invalid image URL from upload');
    }
  }
  return body.urls;
}
