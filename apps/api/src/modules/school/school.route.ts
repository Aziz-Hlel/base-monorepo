import { Router } from 'express';
import { SchoolController } from './school.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireRole from '@/middleware/requireRole.middleware';
import { Role } from '@/generated/prisma/enums';

export const createRouter = (schoolController: SchoolController) => {
  const router = Router();
  router.post('/', requireAuth, asyncHandler(schoolController.createMySchool));
  router.post('/with-user', requireAuth, requireRole(Role.SUPER_ADMIN), asyncHandler(schoolController.createWithUser));
  router.put('/:id', requireAuth, asyncHandler(schoolController.updateMySchool));
  router.get('/me', requireAuth, asyncHandler(schoolController.getMySchool));
  router.get('/:id', requireAuth, requireRole(Role.SUPER_ADMIN), asyncHandler(schoolController.getByUserId));
  return router;
};
