import z from 'zod';
import { Role, Status } from '../../types/enums/enums';

export const createUserProfileRequestSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.email(),
  status: z.any().transform(() => Status.ACTIVE),
  password: z.string().min(6).max(10),
  role: z.enum(Object.values(Role)).default(Role.USER).nonoptional(),

  profile: z.object({
    phoneNumber: z.string().nullable(),
    address: z.string().nullable(),
  }),
});

export type CreateUserProfileRequest = z.input<typeof createUserProfileRequestSchema>;
export type CreateUserProfileSchemaOutput = z.infer<typeof createUserProfileRequestSchema>;
