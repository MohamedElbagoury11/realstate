/** Maps thrown server Error messages to `errors.server` translation keys. */
const MESSAGE_TO_KEY: Record<string, string> = {
  'Add at least one image': 'addImage',
  'Images must be uploaded to Cloudinary first': 'cloudinaryRequired',
  'Image upload failed': 'uploadFailed',
  'No image URLs returned': 'noImageUrls',
  'Invalid image URL from upload': 'invalidImageUrl',
  Unauthorized: 'unauthorized',
  'Property not available': 'propertyNotAvailable',
};

export function getServerErrorKey(error: unknown): string {
  if (error instanceof Error) {
    const key = MESSAGE_TO_KEY[error.message];
    if (key) return key;
  }
  return 'savePropertyFailed';
}
