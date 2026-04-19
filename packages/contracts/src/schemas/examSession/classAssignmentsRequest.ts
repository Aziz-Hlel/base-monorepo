import z from 'zod';
import { assignMajorToClassRequestSchema } from './assignMajorToExamRequest';
import { assignElectiveExamToClassRequestSchema } from './assignElectiveExamToClassRequest';
import { assignExamToClassesRequestSchema } from './assignExamToClassesRequest';

export const classAssignmentsRequestSchema = z.union([
  z
    .object({
      type: z.literal('major'),
    })
    .and(assignMajorToClassRequestSchema),
  z
    .object({
      type: z.literal('elective'),
    })
    .and(assignElectiveExamToClassRequestSchema),
  z
    .object({
      type: z.literal('exam'),
    })
    .and(assignExamToClassesRequestSchema),
]);

export type ClassAssignmentsRequest = z.infer<typeof classAssignmentsRequestSchema>;
