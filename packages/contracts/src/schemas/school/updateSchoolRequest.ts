import z from 'zod';
import { createSchoolRequestSchema } from './createSchoolRequest';

export const updateSchoolRequestSchema = createSchoolRequestSchema;

export type UpdateSchoolRequest = z.infer<typeof updateSchoolRequestSchema>;
