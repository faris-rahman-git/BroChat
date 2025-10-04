import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
    .min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Phone number must be a valid 10-digit number'),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
