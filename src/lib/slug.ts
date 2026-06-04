import slugify from 'slugify';

export function createPropertySlug(title: string, id: string): string {
  const base = slugify(title, { lower: true, strict: true });
  const suffix = id.slice(-6);
  return `${base}-${suffix}`;
}
