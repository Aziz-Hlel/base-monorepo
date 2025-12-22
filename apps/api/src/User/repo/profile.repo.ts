import { prisma } from '@/bootstrap/db.init';
import { ProfileInclude } from '@/generated/prisma/models';
import { CreateProfileRequest } from '@contracts/schemas/profile/createProfileRequest';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { ProfileWithUser } from '../types';

export class ProfileRepo {
  private includeUser = () => {
    return {
      user: true,
    } as const satisfies ProfileInclude<DefaultArgs>;
  };
  async create(userId: string, schema: CreateProfileRequest): Promise<ProfileWithUser> {
    const profile = await prisma.profile.create({
      data: {
        ...schema,
        userId,
      },
      include: this.includeUser(),
    });
    return profile;
  }
}

export const profileRepo = new ProfileRepo();
