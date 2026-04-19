import { Router } from 'express';
import { ExamSessionController } from './examSession.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createRoute = (examSessionContoller: ExamSessionController) => {
  const router = Router();

  // ! need a middleware to see if the classId belongs to the actor or is SUPER_ADMIN
  router.put('/', requireAuth, asyncHandler(examSessionContoller.assign));

  return router;
};
