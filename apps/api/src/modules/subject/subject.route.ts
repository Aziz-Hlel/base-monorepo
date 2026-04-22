import { Router } from 'express';
import { SubjectController } from './subject.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserPermission from '@/middleware/requirePermission.middleware';
import { UserRole } from '@/generated/prisma/enums';

export const createRouter = (subjectController: SubjectController) => {
  const router = Router({ mergeParams: true });
  router.post(
    '/',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(subjectController.create),
  );

  router.post(
    '/bulk',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(subjectController.createMany),
  );

  router.put(
    '/:subjectId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(subjectController.update),
  );

  router.get('/:subjectId', requireAuth, asyncHandler(subjectController.find));
  router.get('/', requireAuth, asyncHandler(subjectController.findAll));

  return router;
};
