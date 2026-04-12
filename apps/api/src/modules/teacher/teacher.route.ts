import { Router } from 'express';
import { TeacherController } from './teacher.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createRouter = (teacherController: TeacherController) => {
  const router = Router({ mergeParams: true });
  router.post('/', requireAuth, asyncHandler(teacherController.create));

  router.get('/', requireAuth, asyncHandler(teacherController.getBySchoolId));
  router.get('/:teacherId', requireAuth, asyncHandler(teacherController.getById));

  router.put('/:teacherId', requireAuth, asyncHandler(teacherController.update));

  router.delete('/:teacherId', requireAuth, asyncHandler(teacherController.delete));
  return router;
};
