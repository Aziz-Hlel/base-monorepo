import z from 'zod';
import { Gender } from '../../types/enums/enums';
import { dateStringSchema } from '../utils/generalZod';

const createUserRequestSchema = z.object({
  firstName: z
    .string()
    .trim()
    .nonempty('First name is required')
    .min(3, 'First name must be at least 3 characters long')
    .max(255, 'First name must be at most 255 characters long'),

  lastName: z
    .string()
    .trim()
    .nonempty('Last name is required')
    .min(3, 'Last name must be at least 3 characters long')
    .max(255, 'Last name must be at most 255 characters long'),

  gender: z.enum(Gender),

  dateOfBirth: dateStringSchema('Invalid date of birth').or(z.null()), // * has to be in the past

  phone: z
    .string()
    .trim()
    .min(7, 'Phone must be at least 7 characters long')
    .max(30, 'Phone must be at most 30 characters long')
    .or(z.null()), // * add regex validation for phone number

  email: z.email('Invalid email').max(255, 'Email must be at most 255 characters long').nullable(),
});

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
