import { prisma } from '@/bootstrap/db.init';
import { DatabaseError } from '@/err/customErrors';
import { Prisma } from '@/generated/prisma/client';
import { UserRoleSimple } from '@repo/contracts/types/enums/meta/userRoleMeta';

export class UserRoleRepo {
  grantSimpleRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    try {
      const userRole = await prisma.userRoles.create({
        data: {
          userId,
          role,
        },
      });
      return userRole;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to grant role', cause: error });
      }
      throw error;
    }
  };

  revokeSimpleRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    try {
      const userRole = await prisma.userRoles.delete({
        where: {
          userId_role: {
            userId,
            role,
          },
        },
      });
      return userRole;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to revoke role', cause: error });
      }
      throw error;
    }
  };

  findByUserIdAndRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    try {
      const userRole = await prisma.userRoles.findUnique({
        where: {
          userId_role: {
            userId,
            role,
          },
        },
      });
      return userRole;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to find user role', cause: error });
      }
      throw error;
    }
  };

  findManyById = async ({ id }: { id: string }) => {
    try {
      return await prisma.userRoles.findMany({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (!(error instanceof Error)) throw error;
        throw new DatabaseError({ message: 'Failed to find user role', cause: error });
      }
      throw error;
    }
  };
}
