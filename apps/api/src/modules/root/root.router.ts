import { Router } from 'express';
import { asyncHandler } from '../../core/async-handler';
import { requireAuth } from '../../middleware/requireAuth.middleware';
import { RootController } from './root.controller';

export const createRouter = (controller: RootController) => {
  const router = Router();

  router.get('/health', asyncHandler(controller.getHealth));
  router.get('/healthz', requireAuth, asyncHandler(controller.getHealthz));

  return router;
};
