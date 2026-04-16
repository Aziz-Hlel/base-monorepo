import z from 'zod';
import { Gender, StudentStatus } from '../../types/enums/enums';

const baseSchema = z.object({
  uid: z
    .string()
    .trim()
    .transform((uid) => (uid === '' ? null : uid))
    .nullable(),

  dateOfBirth: z.iso
    .date()
    .nullable()
    .refine(
      (dateOfBirth) => {
        if (dateOfBirth === null) return true;
        return new Date(dateOfBirth) < new Date();
      },
      {
        message: 'Date of birth must be in the past',
        path: ['dateOfBirth'],
      },
    ),

  avatarId: z.uuid().nullable(),

  gender: z.enum(Gender),

  status: z.enum(StudentStatus),
});

const ar_schema = z.object({
  firstName_ar: z.string().trim().nonempty('First name is required').max(255, 'First name is too long').or(z.null()),
  lastName_ar: z.string().trim().nonempty('Last name is required').max(255, 'Last name is too long').or(z.null()),
});

const en_schema = z.object({
  firstName_en: z.string().trim().nonempty('First name is required').max(255, 'First name is too long').or(z.null()),
  lastName_en: z.string().trim().nonempty('Last name is required').max(255, 'Last name is too long').or(z.null()),
});

export const createStudentRequestSchema = baseSchema
  .and(ar_schema)
  .and(en_schema)
  .refine(
    (data) => {
      return (data.lastName_ar && data.firstName_ar) || (data.lastName_en && data.firstName_en);
    },
    {
      message: 'At least one language name is required',
      path: ['firstName_ar', 'lastName_ar', 'firstName_en', 'lastName_en'],
    },
  );

export type CreateStudentRequest = z.infer<typeof createStudentRequestSchema>;
