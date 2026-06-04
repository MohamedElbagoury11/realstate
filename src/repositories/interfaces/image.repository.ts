export interface ImageRepository {
  upload(file: File, path: string): Promise<string>;
  delete(url: string): Promise<void>;
}
