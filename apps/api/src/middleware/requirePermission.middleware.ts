import { prisma } from '@/bootstrap/db.init';
import { ConflictError } from '@/err/service/customErrors';
import { AccountRole, UserRole } from '@/generated/prisma/enums';
import { UserGetPayload, UserInclude } from '@/generated/prisma/models';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import getParam from '@/utils/getParam';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { NextFunction, Request, Response } from 'express';

type RequirePermissionProps = {
  requiredRoles: UserRole[];
};

const getByAccountId = async ({ accountId }: { accountId: string }) => {
  try {
    const school = await prisma.school.findFirst({
      where: {
        owner: {
          accountId: accountId,
        },
      },
    });
    return school;
  } catch (error) {
    throw error;
  }
};

const getUserByAccountIdSchoolId = async <T extends UserInclude<DefaultArgs>>({
  accountId,
  schoolId,
  include,
}: {
  accountId: string;
  schoolId: string;
  include?: T;
}) => {
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
};

async function canManageRoles(actorId: string, schoolId: string): Promise<boolean> {
  const school = await prisma.school.findFirst({
    where: {
      id: schoolId,
      OR: [
        // Is this account the owner?
        { owner: { accountId: actorId } },
        // Or does this account have a user with the right role in this school?
        {
          users: {
            some: {
              accountId: actorId,
              roles: { some: { role: { in: [UserRole.DIRECTOR, UserRole.MANAGER] } } },
            },
          },
        },
      ],
    },
  });

  return !!school;
}

const requireUserPermission = (requiredRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = (req as AuthenticatedRequest).token;
    if (token.claims.accountRole === AccountRole.SUPER_ADMIN) {
      return next();
    }

    const schoolId = getParam(req, 'schoolId', { uuid: true });
    const accountId = token.claims.accountId;

    const school = await prisma.school.findFirst({
      where: {
        id: schoolId,
        OR: [
          // Is this account the owner?
          { owner: { accountId } },
          // Or does this account have a user with the right role in this school?
          {
            users: {
              some: {
                accountId,
                roles: { some: { role: { in: requiredRoles } } },
              },
            },
          },
        ],
      },
    });

    if (!school) {
      throw new ConflictError({
        message: 'User not authorized',
        internalLog: `Account with id ${accountId} does not have required roles ${requiredRoles.join(', ')} for school with id ${schoolId}`,
      });
    }

    return next();
  };
};

// const requireUserPermission = ({ requiredRoles }: RequirePermissionProps) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const token = (req as AuthenticatedRequest).token;
//     if (token.claims.accountRole === AccountRole.SUPER_ADMIN) {
//       next();
//       return;
//     }
//     const schoolId = getParam(req, 'schoolId', { uuid: true });
//     if (token.claims.accountRole === AccountRole.ADMIN) {
//       // * currently with this implementation an admin(school owner) can only access his school, so if he s a user in another school he can't access it
//       const school = await getByAccountId({ accountId: token.claims.accountId });
//       if (!school) {
//         throw new ConflictError({
//           message: 'School not found',
//           internalLog: `Admin with accountId ${token.claims.accountId} does not have a school`,
//         });
//       }
//       if (school.id !== schoolId) {
//         throw new ConflictError({
//           message: 'User not authorized',
//           internalLog: `Admin with accountId ${token.claims.accountId} is not the owner of school with id ${schoolId}`,
//         });
//       }
//       next();
//       return;
//     }
//     const user = await getUserByAccountIdSchoolId({
//       accountId: token.claims.accountId,
//       schoolId,
//       include: { roles: true },
//     });
//     if (!user) {
//       throw new ConflictError({
//         message: 'User not found',
//         internalLog: `User with accountId ${token.claims.accountId} and schoolId ${schoolId} not found`,
//       });
//     }
//     const userPermission = user.roles.some((role) => requiredRoles.includes(role.role));
//     if (!userPermission) {
//       throw new ConflictError({
//         message: 'User not authorized',
//         internalLog: { requiredRoles, userRoles: user.roles.map((role) => role.role) },
//       });
//     }

//     next();
//   };
// };

export default requireUserPermission;
