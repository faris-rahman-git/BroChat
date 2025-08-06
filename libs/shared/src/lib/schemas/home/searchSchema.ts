import { z } from 'zod';

export const searchSchema = z.object({
  searchData: z
    .string()
    .min(1, 'Search query is required')
    .max(50, 'Search query is too long')
    .trim(),
});
