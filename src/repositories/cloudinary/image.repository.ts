import { randomUUID } from 'crypto';
import type { ImageRepository } from '@/repositories/interfaces/image.repository';
import { getCloudinary } from '@/providers/cloudinary/client';

function publicIdFromUrl(url: string): string {
  const marker = '/upload/';
  const index = url.indexOf(marker);
  if (index === -1) {
    throw new Error('Invalid Cloudinary URL');
  }
  let path = url.slice(index + marker.length);
  path = path.replace(/^v\d+\//, '');
  return path.replace(/\.[^/.]+$/, '');
}

export class CloudinaryImageRepository implements ImageRepository {
  async upload(file: File, path: string): Promise<string> {
    const cloudinary = getCloudinary();
    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : path;

    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString('base64')}`,
      {
        folder,
        public_id: randomUUID(),
        resource_type: 'image',
      },
    );

    return result.secure_url;
  }

  async delete(url: string): Promise<void> {
    const cloudinary = getCloudinary();
    const publicId = publicIdFromUrl(url);
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  }
}
