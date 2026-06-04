import { z } from 'zod';

const propertyTypeEnum = z.enum([
  'apartment',
  'house',
  'villa',
  'land',
  'commercial',
  'other',
]);

export const propertyFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  price: z.number().positive(),
  area: z.number().positive(),
  rooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  propertyType: propertyTypeEnum,
  city: z.string().min(2),
  zone: z.string().min(2),
  address: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.union([z.string(), z.number()])).default({}),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type PropertyFormInput = z.infer<typeof propertyFormSchema>;

export const settingsFormSchema = z.object({
  contactPhone: z.string().min(1),
  whatsappNumber: z.string().min(1),
  contactEmail: z.email(),
  socialLinks: z.record(z.string(), z.string()).default({}),
});

export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
