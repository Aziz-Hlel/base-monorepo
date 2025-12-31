import { PermissionDeniedError, UnauthorizedError } from '@/err/customErrors';
import { Role } from '@/generated/prisma/enums';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import PERMISSION_SCORE from '@contracts/utils/PermissionScore';
import { NextFunction, Response, Request } from 'express';

const requireRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userReq = req as AuthenticatedRequest;
    if (!userReq.user) {
      throw new UnauthorizedError('Unauthenticated');
    }

    const userRole = userReq.user?.claims?.role;

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
