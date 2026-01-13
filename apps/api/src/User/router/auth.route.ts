import { Router } from 'express';
import { authController } from '../Controller/auth.controller';

import { Request, Response } from 'express';
import { asyncHandler } from '../../core/async-handler';
import { requireAuth } from '../../middleware/requireAuth.middleware';

const router = Router();

router.post(
  '/register',
  asyncHandler((req: Request, res: Response) => authController.register(req, res)),
);

router.post(
  '/login',
  asyncHandler((req: Request, res: Response) => authController.loginWithPassword(req, res)),
);

router.post(
  '/oauth/login',
  asyncHandler((req: Request, res: Response) => authController.authenticateWithProvider(req, res)),
);

router.get(
  '/me',
  requireAuth,
  asyncHandler((req: any, res: Response, next) => authController.me(req, res)),
);

export const AuthRouter = router;
