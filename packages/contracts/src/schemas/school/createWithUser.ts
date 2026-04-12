import z from 'zod';
import { commonStringSchema } from '../../utils/commonStringSchema';
import { createSchoolRequestSchema } from './createSchoolRequest';

export const createSchoolWithUserRequestSchema = z.object({
  user: z.object({
    username: commonStringSchema({ fieldName: 'username' }),
    email: z.email(),
    password: z.string().trim().min(6).max(10),
  }),
  school: createSchoolRequestSchema,
});

export type CreateSchoolWithUserRequest = z.infer<typeof createSchoolWithUserRequestSchema>;
