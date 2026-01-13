import z from 'zod';
import { ProductStatus } from '../../types/enums/enums';

export const createProductRequestSchema = z.object({
  name: z.string().trim().min(3).max(255),
  description: z.string().trim().min(1).max(5000),
  price: z.number({ error: 'Invalid price' }).min(0),
  thumbnailId: z.uuid({ error: 'Invalid thumbnail' }),
  status: z.enum(ProductStatus).default(ProductStatus.AVAILABLE).nonoptional(),
});

export type CreateProductRequest = z.infer<typeof createProductRequestSchema>;
