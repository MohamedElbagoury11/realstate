import { AppError } from '@/lib/errors';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from '@/lib/constants';
import { getImageRepository } from '@/providers/container.server';

export class ImageService {
  private readonly images = getImageRepository();

  validateFile(file: File): void {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new AppError('Invalid image type. Use JPEG, PNG, or WebP.', 'INVALID_TYPE', 400);
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new AppError('Image must be under 5MB', 'FILE_TOO_LARGE', 400);
    }
  }

  async upload(file: File, folder: string): Promise<string> {
    this.validateFile(file);
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    return this.images.upload(file, path);
  }

  async delete(url: string): Promise<void> {
    await this.images.delete(url);
  }
}

export const imageService = new ImageService();
