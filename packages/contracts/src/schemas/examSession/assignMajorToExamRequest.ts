import z from 'zod';

export const assignMajorToClassRequestSchema = z.object({
  classId: z.uuid(),
  majorId: z.uuid(),
});

export type AssignMajorToClassRequest = z.infer<typeof assignMajorToClassRequestSchema>;
