import { Router } from 'express';
import { AccountController } from './account.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

const createRouter = (controller: AccountController) => {
  const router = Router();
  router.post('/admin', asyncHandler(controller.createAdminAccountWithPassword));
  router.post('/login/password', asyncHandler(controller.authenticateWithPassword));
  router.post('/login/oauth', asyncHandler(controller.authenticateWithProvider));
  router.get('/me', requireAuth, asyncHandler(controller.me));

  return router;
};

export default createRouter;
