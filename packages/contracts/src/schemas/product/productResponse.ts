import z from 'zod';
import { mediaResponseSchema } from '../media/MediaResponse';

export const productResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  thumbnail: mediaResponseSchema.nullable(),
  createdAt: z.date().transform((date) => date.toISOString()),
  updatedAt: z.date().transform((date) => date.toISOString()),
});

export type ProductResponse = z.infer<typeof productResponseSchema>;
