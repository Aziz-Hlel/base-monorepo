import { asyncHandler } from '@/core/async-handler';
import { Router } from 'express';
import { OwnerController } from './owner.controller';
import requireRole from '@/middleware/requireRole.middleware';
import { AccountRole } from '@/generated/prisma/enums';

export const createRouter = (controller: OwnerController) => {
  const router = Router();
  router.post('/', requireRole(AccountRole.ADMIN), asyncHandler(controller.create));
  return router;
};
