import { z } from 'zod';

type TV = (key: string) => string;

export function createLoginSchema(tv: TV) {
  return z.object({
    email: z.email({ message: tv('emailInvalid') }),
    password: z.string().min(6, tv('passwordMin')),
  });
}

export function createRegisterSchema(tv: TV) {
  return z.object({
    name: z.string().min(2, tv('nameRequired')),
    email: z.email({ message: tv('emailInvalid') }),
    password: z.string().min(6, tv('passwordMin')),
    phone: z.string().optional(),
    role: z.enum(['customer', 'seller']),
  });
}

export function createPropertyFormSchema(tv: TV) {
  return z.object({
    title: z.string().min(3, tv('titleMin')),
    description: z.string().min(20, tv('descriptionMin')),
    price: z.number().positive(tv('pricePositive')),
    area: z.number().positive(tv('areaPositive')),
    rooms: z.number().int().min(0),
    bathrooms: z.number().int().min(0),
    propertyType: z.enum(['apartment', 'house', 'villa', 'land', 'commercial', 'other']),
    city: z.string().min(2, tv('cityMin')),
    zone: z.string().min(2, tv('zoneMin')),
    address: z.string().optional(),
    amenities: z.array(z.string()).default([]),
    specifications: z.record(z.string(), z.union([z.string(), z.number()])).default({}),
    metadata: z.record(z.string(), z.unknown()).default({}),
  });
}

export function createSettingsFormSchema(tv: TV) {
  return z.object({
    contactPhone: z.string().min(1, tv('contactPhoneRequired')),
    whatsappNumber: z.string().min(1, tv('whatsappRequired')),
    contactEmail: z.email(tv('contactEmailRequired')),
    socialLinks: z.record(z.string(), z.string()).default({}),
  });
}

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;
export type PropertyFormInput = z.infer<ReturnType<typeof createPropertyFormSchema>>;
export type SettingsFormInput = z.infer<ReturnType<typeof createSettingsFormSchema>>;
