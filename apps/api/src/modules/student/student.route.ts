import { Router } from 'express';
import { StudentController } from './student.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const studentRouter = (studentController: StudentController) => {
  const router = Router();

  router.post('/', requireAuth, asyncHandler(studentController.create));
  router.put('/:studentId', requireAuth, asyncHandler(studentController.update));
  router.get('/:studentId', requireAuth, asyncHandler(studentController.findById));

  return router;
};
