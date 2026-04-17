import { Router } from 'express';
import { StudentController } from './student.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { UserRole } from '@/generated/prisma/enums';
import { requireUserPermissionOrIsParentChild } from './middleware/requireUserPermissionOrIsParentChild';
import requireUserPermission from '@/middleware/requirePermission.middleware';

export const createRouter = (studentController: StudentController) => {
  const router = Router({ mergeParams: true });

  router.post('/', requireAuth, asyncHandler(studentController.create));

  router.put(
    '/:studentId',
    requireAuth,
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.update),
  );

  router.get(
    '/:studentId',
    requireAuth,
    requireUserPermissionOrIsParentChild([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.findById),
  );

  router.post(
    '/:studentId/parent/:parentId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.assignParent),
  );

  router.delete(
    '/:studentId/parent/:parentId',
    requireAuth,
    requireUserPermission([UserRole.DIRECTOR, UserRole.MANAGER]),
    asyncHandler(studentController.unassignParent),
  );

  return router;
};
