import type { ImageRepository } from '@/repositories/interfaces/image.repository';
import { getAdminStorage } from '@/providers/firebase/admin';

export class FirebaseImageRepository implements ImageRepository {
  async upload(file: File, path: string): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = getAdminStorage().bucket();
    const fileRef = bucket.file(path);
    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
      public: true,
    });
    return `https://storage.googleapis.com/${bucket.name}/${path}`;
  }

  async delete(url: string): Promise<void> {
    const bucket = getAdminStorage().bucket();
    const path = url.split(`${bucket.name}/`)[1];
    if (path) await bucket.file(path).delete({ ignoreNotFound: true });
  }
}
