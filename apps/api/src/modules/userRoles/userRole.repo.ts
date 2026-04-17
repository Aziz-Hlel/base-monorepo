import { prisma } from '@/bootstrap/db.init';
import { RepoError } from '@/err/repo/DbError';
import { UserRole } from '@/generated/prisma/client';
import { TX } from '@/types/prisma/PrismaTransaction';
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
      RepoError.throwRepoError(error);
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
      RepoError.throwRepoError(error);
    }
  };

  grantRole_V2 = async ({ userId, role }: { userId: string; role: UserRole }, tx?: TX) => {
    try {
      const client = tx || prisma;
      const userRole = await client.userRoles.upsert({
        where: {
          userId_role: {
            userId,
            role,
          },
        },
        update: {},
        create: {
          userId,
          role,
        },
      });
      return userRole;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  revokeRole_V2 = async ({ userId, role }: { userId: string; role: UserRole }, tx?: TX) => {
    const client = tx || prisma;
    try {
      const userRole = await client.userRoles.delete({
        where: {
          userId_role: {
            userId,
            role,
          },
        },
      });
      return userRole;
    } catch (error) {
      RepoError.throwRepoError(error);
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
      RepoError.throwRepoError(error);
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
      RepoError.throwRepoError(error);
    }
  };
}
