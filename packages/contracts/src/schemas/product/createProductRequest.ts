import z from 'zod';

export const createProductRequestSchema = z.object({
  name: z.string().trim().min(3).max(255),
  description: z.string().trim().min(1).max(5000),
  price: z.number({ error: 'Invalid price' }).min(0),
  thumbnailId: z.uuid({ error: 'Invalid thumbnail' }),
});

export type CreateProductRequest = z.infer<typeof createProductRequestSchema>;
