import { UserGetPayload, UserInclude } from '@/generated/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { prisma } from '../../../bootstrap/db.init';
import { CreateUserRequest } from '@repo/contracts/schemas/user2/createUserRequest';

export class UserRepo {
  getUserByAccountIdSchoolId = async <T extends UserInclude<DefaultArgs>>({
    accountId,
    schoolId,
    include,
  }: {
    accountId: string;
    schoolId: string;
    include?: T;
  }) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          accountId_schoolId: {
            accountId,
            schoolId,
          },
        },
        include,
      });
      return user as UserGetPayload<{ include: T }> | null;
    } catch (error) {
      throw error;
    }
  };

  createUserWithSimpleRole = async ({
    schema,
    schoolId,
    accountId,
  }: {
    schema: CreateUserRequest;
    schoolId: string;
    accountId: string;
  }) => {
    try {
      const user = await prisma.user.create({
        data: {
          firstName: schema.firstName,
          lastName: schema.lastName,
          gender: schema.gender,
          dateOfBirth: schema.dateOfBirth ? new Date(schema.dateOfBirth) : null,
          phone: schema.phone,
          cin: schema.cin,
          address: schema.address,
          roles: {
            create: {
              role: schema.role,
            },
          },
          accountId,
          schoolId,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  };
}
