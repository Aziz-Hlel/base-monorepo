import { Role, Status } from '@/generated/prisma/enums';
import { UserInclude } from '@/generated/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { CreateUserProfileRequest } from '@repo/contracts/schemas/profile/createUserProfileRequest';
import { UpdateUserProfileRequest } from '@repo/contracts/schemas/profile/updateUserProfileRequest';
import { prisma } from '../../../bootstrap/db.init';
import { UserCreateInputCustom } from '../mapper/user.mapper';
import { UserWithProfile } from '../types';
import { ConflictError } from '@/err/customErrors';

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
    console.log('dirrab l user : ', user);
    return !!user;
  }

  async createUser(user: UserCreateInputCustom) {
    try {
      return await prisma.user.create({
        data: user,
        include: { profile: true },
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      if (error.message.includes('Unique constraint failed')) {
        throw new ConflictError('User already exists');
      }
      throw error;
    }
  }

  async getUserByAuthId(authId: string): Promise<UserWithProfile | null> {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { authId }, include: this.includeProfile() });

      return await prisma.user.findUnique({ where: { authId }, include: this.includeProfile() });
    });
  }
  async findByEmail(email: string): Promise<UserWithProfile | null> {
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
        role: schema.role,
        status: Status.ACTIVE,

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

  async getUsersByRole(roles: Exclude<Role, 'USER'>[]): Promise<UserWithProfile[]> {
    return await prisma.user.findMany({ where: { role: { in: roles } }, include: this.includeProfile() });
  }

  async updateUserProfile(id: string, data: UpdateUserProfileRequest): Promise<UserWithProfile> {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username: data.username ?? undefined,
        email: data.email,
        role: data.role,
        status: data.status,
        profile: {
          update: {
            ...data.profile,
          },
        },
      },
      include: this.includeProfile(),
    });
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { status: Status.DELETED, email: null },
    });
  }

  async disableUser(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { status: Status.DISABLED },
    });
  }

  async enableUser(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { status: Status.ACTIVE },
    });
  }
}
