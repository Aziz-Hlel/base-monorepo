import z from 'zod';

export const createStudentProfileRequestSchema = z.object({
  healthInfo: z
    .string()
    .trim()
    .nonempty('Health info is required')
    .max(1000, 'Health info must be at most 1000 characters')
    .or(z.null()),

  vaccine: z
    .string()
    .trim()
    .nonempty('Vaccine is required')
    .max(1000, 'Vaccine must be at most 1000 characters')
    .or(z.null()),

  cpr: z.string().trim().nonempty('CPR is required').max(1000, 'CPR must be at most 1000 characters').or(z.null()),

  allergies: z
    .string()
    .trim()
    .nonempty('Allergies is required')
    .max(1000, 'Allergies must be at most 1000 characters')
    .or(z.null()),

  notes: z
    .string()
    .trim()
    .nonempty('Notes is required')
    .max(1000, 'Notes must be at most 1000 characters')
    .or(z.null()),

  emergencyContactName1: z
    .string()
    .trim()
    .nonempty('Emergency contact name is required')
    .max(255, 'Emergency contact name must be at most 255 characters')
    .or(z.null()),

  emergencyContactPhone1: z
    .string()
    .trim()
    .nonempty('Emergency contact phone is required')
    .max(20, 'Emergency contact phone must be at most 20 characters')
    .or(z.null()),

  emergencyContactRelation1: z
    .string()
    .trim()
    .nonempty('Emergency contact relation is required')
    .max(255, 'Emergency contact relation must be at most 255 characters')
    .or(z.null()),

  emergencyContactName2: z
    .string()
    .trim()
    .nonempty('Emergency contact name is required')
    .max(255, 'Emergency contact name must be at most 255 characters')
    .or(z.null()),

  emergencyContactPhone2: z
    .string()
    .trim()
    .nonempty('Emergency contact phone is required')
    .max(20, 'Emergency contact phone must be at most 20 characters')
    .or(z.null()),

  emergencyContactRelation2: z
    .string()
    .trim()
    .nonempty('Emergency contact relation is required')
    .max(255, 'Emergency contact relation must be at most 255 characters')
    .or(z.null()),
});

export type CreateStudentProfileRequest = z.infer<typeof createStudentProfileRequestSchema>;
