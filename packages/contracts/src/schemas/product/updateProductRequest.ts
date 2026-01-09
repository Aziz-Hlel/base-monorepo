import z from 'zod';
import { createProductRequestSchema } from './createProductRequest';

export const updateProductRequestSchema = z.object({}).extend(createProductRequestSchema.shape);

export type UpdateProductRequest = z.infer<typeof updateProductRequestSchema>;
