import z from 'zod';
import { SubjectEnum } from '../../types/enums/enums';

const baseSchema = z.object({
  publicId: z.string().trim().nonempty('Public ID is required'),
  lastName: z.string().trim().nonempty('Last name is required'),
  firstName: z.string().trim().nonempty('First name is required'),
});

const unionSchema = z.union([
  z.object({
    isTeacher: z.literal(true),
    subject: z.enum(SubjectEnum),
  }),
  z.object({
    isTeacher: z.literal(false),
  }),
]);

export const createTeacherRequestSchema = z.intersection(baseSchema, unionSchema);

export type CreateTeacherRequest = z.infer<typeof createTeacherRequestSchema>;
