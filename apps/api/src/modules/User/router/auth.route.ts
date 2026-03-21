import { Router } from 'express';

import { asyncHandler } from '../../../core/async-handler';
import { requireAuth } from '../../../middleware/requireAuth.middleware';
import { UserRepo } from '../repo/user.repo';
import { AuthService } from '../Service/auth.service';
import { AuthController } from '../Controller/auth.controller';

const createRouter = (controller: AuthController) => {
  const router = Router();

  router.post('/register', asyncHandler(controller.register));
  router.post('/login', asyncHandler(controller.loginWithPassword));
  router.post('/oauth/login', asyncHandler(controller.authenticateWithProvider));
  router.get('/me', requireAuth, asyncHandler(controller.me));

  return router;
};

const repo = new UserRepo();
const service = new AuthService(repo);
const controller = new AuthController(service);
const router = createRouter(controller);

export const AuthRouter = router;
