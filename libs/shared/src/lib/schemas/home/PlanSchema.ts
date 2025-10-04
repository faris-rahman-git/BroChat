import { z } from 'zod';

export const planSchema = z
  .object({
    planName: z
      .string()
      .min(6, { message: 'Plan name must be at least 6 characters' })
      .max(30, { message: 'Plan name must be at most 30 characters' }),

    description: z
      .string()
      .min(30, { message: 'Plan description must be at least 30 characters' })
      .max(200, { message: 'Plan description must be at most 200 characters' }),

    price: z.string().refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 10 && num <= 1000;
      },
      { message: 'Price must be between 10 and 1000' }
    ),

    offerPrice: z.string().refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 9 && num <= 999;
      },
      { message: 'Offer price must be between 9 and 999' }
    ),
  })
  .refine((data) => Number(data.offerPrice) < Number(data.price), {
    message: 'Offer price must be less than the regular price',
    path: ['offerPrice'],
  });

export type PlanSchemaType = z.infer<typeof planSchema>;
