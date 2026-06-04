import { z } from 'zod';

/** Server-side auth validation (messages resolved on the client via i18n schemas). */
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(['customer', 'seller']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
