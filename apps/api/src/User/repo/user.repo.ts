import { UserInclude } from '@/generated/prisma/models';
import { prisma } from '../../bootstrap/db.init';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { UserWithProfile } from '../types';
import { CreateUserProfileRequest } from '@contracts/schemas/profile/createUserProfileRequest';
import { StrictDecodedIdToken } from '@/types/auth/StrictDecodedIdToken';
import UserMapper, { UserCreateInputCustom } from '../mapper/user.mapper';

export class UserRepo {
  private includeProfile() {
    return {
      profile: true,
    } as const satisfies UserInclude<DefaultArgs>;
  }

  async isUserExists(id: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id } });
    return !!user;
  }

  async isUserHasProfile(id: string): Promise<boolean | Error> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!user) return new Error('User not found');
    return !!user?.profile;
  }

  async isUserAuthIdExists(authId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { authId } });
    return !!user;
  }

  async isUserEmailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });
    return !!user;
  }

  async createUser(user: UserCreateInputCustom): Promise<UserWithProfile> {
    const createdUser = await prisma.user.create({
      data: user,
    });
    return { ...createdUser, profile: null };
  }

  async getUserByAuthId(authId: string): Promise<UserWithProfile | null> {
    return await prisma.user.findUnique({ where: { authId }, include: this.includeProfile() });
  }
  async getUserByEmail(email: string): Promise<UserWithProfile | null> {
    return await prisma.user.findUnique({ where: { email }, include: this.includeProfile() });
  }

  async getUserById(id: string): Promise<UserWithProfile | null> {
    return await prisma.user.findUnique({ where: { id }, include: this.includeProfile() });
  }

  async createUserProfile(schema: CreateUserProfileRequest, authId: string): Promise<UserWithProfile> {
    const user = await prisma.user.create({
      data: {
        username: schema.username,
        email: schema.email,
        provider: 'manual',
        authId,
        profile: {
          create: {
            ...schema.profile,
          },
        },
      },
      include: this.includeProfile(),
    });
    return user;
  }
}

export const userRepo = new UserRepo();
