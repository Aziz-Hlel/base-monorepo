import type z from 'zod';
import { createTeacherRequestSchema } from './createTeacherRequest';

export const updateTeacherRequestSchema = createTeacherRequestSchema;

export type UpdateTeacherRequest = z.infer<typeof updateTeacherRequestSchema>;
