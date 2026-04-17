import { z } from 'zod';
import { createClassroomRequestSchema } from './createClassRequest';

export const updateClassroomRequestSchema = createClassroomRequestSchema;

export type UpdateClassroomRequest = z.infer<typeof updateClassroomRequestSchema>;
