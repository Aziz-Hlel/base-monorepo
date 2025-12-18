import { Router, Request, Response } from 'express';
import { userController } from '../Controller/user.controller';
import { asyncHandler } from '../../core/async-handler';
import { authHandler } from '../../middleware/authHandler.middleware';
import { AuthenticatedRequest } from '../../types/auth/AuthenticatedRequest';
import { UserPageQuery } from '@/types/user/UserPageQuery';

const router = Router();

router.get(
  '/',
  // authHandler,
  asyncHandler((req: AuthenticatedRequest, res: Response) => userController.getUserPage(req, res)),
);

export const UserPage = router;
