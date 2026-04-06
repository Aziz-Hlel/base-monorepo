import { PermissionDeniedError, UnauthorizedError } from '@/err/customErrors';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import PERMISSION_SCORE from '@repo/contracts/utils/PermissionScore';
import { NextFunction, Response, Request } from 'express';
import { AccountRole } from '@/generated/prisma/enums';

const requireRole = (role: AccountRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userReq = req as AuthenticatedRequest;
    if (!userReq.token?.claims) {
      throw new UnauthorizedError({
        message: 'Unauthenticated',
        internalLog: `Unauthenticated: user has no claims.`,
      });
    }

    const userRole = userReq.token.claims.accountRole;

    if (!userRole) {
      throw new PermissionDeniedError({
        message: 'Insufficient permissions',
        internalLog: `Account role missing: required role ${role}, but user has no role.`,
      });
    }

    if (PERMISSION_SCORE[userRole] < PERMISSION_SCORE[role]) {
      throw new PermissionDeniedError({
        message: 'Insufficient permissions',
        internalLog: `Insufficient permissions: required role ${role}, but user has role ${userRole}`,
      });
    }

    next();
  };
};

export default requireRole;
