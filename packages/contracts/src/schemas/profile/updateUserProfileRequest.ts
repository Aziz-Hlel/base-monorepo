import z from 'zod';
import { Role, Status } from '../../types/enums/enums';

export const updateUserProfileRequestSchema = z.object({
  username: z.string().min(3).max(30).nullable(),
  email: z.email(),
  status: z.enum(Object.values(Status)).default(Status.ACTIVE).nonoptional(),
  // password: z.string().min(6).max(10),
  role: z.enum(Object.values(Role)).default(Role.USER).nonoptional(),

  profile: z.object({
    phoneNumber: z.string().nullable(),
    address: z.string().nullable(),
  }),
});

const a = updateUserProfileRequestSchema.pick({
  username: true,
  email: true,
  status: true,
  role: true,
  profile: true,
});
export type UpdateUserProfileRequest = z.infer<typeof updateUserProfileRequestSchema>;
