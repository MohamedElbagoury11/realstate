export const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  apiKey: process.env.CLOUDINARY_API_KEY ?? '',
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
};

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    cloudinaryConfig.cloudName &&
      cloudinaryConfig.apiKey &&
      cloudinaryConfig.apiSecret,
  );
}

export function isCloudinaryUrl(url: string): boolean {
  if (!cloudinaryConfig.cloudName) {
    return url.startsWith('https://res.cloudinary.com/');
  }
  return url.startsWith(`https://res.cloudinary.com/${cloudinaryConfig.cloudName}/`);
}
