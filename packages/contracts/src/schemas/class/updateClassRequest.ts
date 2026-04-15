import { z } from 'zod';
import { createClassRequestSchema } from './createClassRequest';

export const updateClassRequestSchema = createClassRequestSchema;

export type UpdateClassRequest = z.infer<typeof updateClassRequestSchema>;
