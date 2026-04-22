import type z from 'zod';
import { createSubjectRequestSchema } from './createSubjectRequest';

export const updateSubjectRequestSchema = createSubjectRequestSchema;
export type UpdateSubjectRequest = z.infer<typeof updateSubjectRequestSchema>;
