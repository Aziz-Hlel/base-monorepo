import { PermissionDeniedError, UnauthorizedError } from '@/err/customErrors';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import PERMISSION_SCORE from '@repo/contracts/utils/PermissionScore';
import { NextFunction, Response, Request } from 'express';
import { AccountRole } from '@/generated/prisma/enums';

const requireRole = (role: AccountRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userReq = req as AuthenticatedRequest;
    if (!userReq.token?.claims) {
      throw new UnauthorizedError('Unauthenticated');
    }

    const userRole = userReq.token.claims.accountRole;

    if (!userRole) {
      throw new PermissionDeniedError('User role missing');
    }

    if (PERMISSION_SCORE[userRole] < PERMISSION_SCORE[role]) {
      throw new PermissionDeniedError(`Insufficient permissions: required role ${role}, but user has role ${userRole}`);
    }

    next();
  };
};

export default requireRole;
