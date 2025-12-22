import { ProfileGetPayload, UserGetPayload } from '@/generated/prisma/models';
import { Prettify } from '@contracts/utils/Prettify';

export type UserWithProfile = Prettify<UserGetPayload<{ include: { profile: true } }>>;
export type ProfileWithUser = Prettify<ProfileGetPayload<{ include: { user: true } }>>;
