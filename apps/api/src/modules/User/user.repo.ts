import { prisma } from '@/bootstrap/db.init';
import { DatabaseError } from '@/err/service/customErrors';
import { Prisma } from '@/generated/prisma/client';
import { UserGetPayload, UserInclude } from '@/generated/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { CreateSimpleUserRequest } from '@repo/contracts/schemas/user/createSimpleUserRequest';
import { UpdateSimpleUserRequest } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import { CreateUserInput } from './types/createUserInput';

export class UserRepo {
  findByAccountIdSchoolId = async <T extends UserInclude<DefaultArgs>>({
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to find user', cause: error });
      }
      throw error;
    }
  };

  createUserWithSimpleRole = async (
    {
      schema,
      schoolId,
      accountId,
    }: {
      schema: CreateUserInput;
      schoolId: string;
      accountId: string;
    },
    tx?: Prisma.TransactionClient,
  ) => {
    try {
      const client = tx || prisma;
      const user = await client.user.create({
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to create user', cause: error });
      }
      throw error;
    }
  };

  updateSimpleUser = async (
    { input, userId }: { input: UpdateSimpleUserRequest; userId: string },
    tx?: Prisma.TransactionClient,
  ) => {
    try {
      const client = tx || prisma;
      const user = await client.user.update({
        where: {
          id: userId,
        },
        data: {
          ...input,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to update user', cause: error });
      }
      throw error;
    }
  };

  findById = async <T extends UserInclude<DefaultArgs>>(userId: string, { include }: { include: T }) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include,
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to find user', cause: error });
      }
      throw error;
    }
  };
}
