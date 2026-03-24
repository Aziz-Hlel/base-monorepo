import { Router } from 'express';
import { UserController } from '../Controller/user.controller';
import { asyncHandler } from '../../../core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Role } from '@/generated/prisma/enums';
import requireRole from '@/middleware/requireRole.middleware';
import { UserRepo } from '../repo/user.repo';
import { UserService } from '../Service/user.service';

const createUserRouter = (controller: UserController) => {
  const router = Router();

  router.post('/', requireAuth, requireRole(Role.ADMIN), asyncHandler(controller.createUserProfile));
  router.get('/', requireAuth, requireRole(Role.ADMIN), asyncHandler(controller.getUserPage));
  router.delete('/:id', requireAuth, requireRole(Role.ADMIN), asyncHandler(controller.deleteUserProfile));
  router.post('/:id/enable', requireAuth, requireRole(Role.ADMIN), asyncHandler(controller.enableUser));
  router.post('/:id/disable', requireAuth, requireRole(Role.ADMIN), asyncHandler(controller.disableUser));
  router.put('/:id', requireAuth, requireRole(Role.ADMIN), asyncHandler(controller.updateUserProfile));

  return router;
};

export default createUserRouter;
