import { Router } from 'express';
import { UserController } from '../Controller/user.controller';
import { asyncHandler } from '../../../core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireRole from '@/middleware/requireRole.middleware';
import { UserRepo } from '../repo/user.repo';
import { UserService } from '../Service/user.service';
import { AccountRole } from '@/generated/prisma/enums';

const createUserRouter = (controller: UserController) => {
  const router = Router();

  router.post('/', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.createUserProfile));
  router.get('/', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.getUserPage));
  router.delete('/:id', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.deleteUserProfile));
  router.post('/:id/enable', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.enableUser));
  router.post('/:id/disable', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.disableUser));
  router.put('/:id', requireAuth, requireRole(AccountRole.ADMIN), asyncHandler(controller.updateUserProfile));

  return router;
};

export default createUserRouter;
