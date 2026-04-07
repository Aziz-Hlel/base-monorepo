import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Router } from 'express';
import { UserController } from '../Controller/user.controller';
import { UserRole } from '@/generated/prisma/enums';
import requireUserPermission from '@/middleware/requirePermission.middleware';

const createUserRouter = (controller: UserController) => {
  const router = Router({ mergeParams: true });

  router.post(
    '/',
    requireAuth,
    requireUserPermission({ requiredRoles: [UserRole.DIRECTOR, UserRole.MANAGER] }),
    asyncHandler(controller.create),
  );

  return router;
};

export default createUserRouter;
