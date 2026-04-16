import { Router } from 'express';
import { StudentController } from './student.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import requireUserPermission from '@/middleware/requirePermission.middleware';
import { UserRole } from '@/generated/prisma/enums';

export const createRouter = (studentController: StudentController) => {
  const router = Router({ mergeParams: true });

  router.post('/', requireAuth, asyncHandler(studentController.create));

  router.put(
    '/:studentId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.update),
  );

  router.get(
    '/:studentId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.findById),
  );

  return router;
};
