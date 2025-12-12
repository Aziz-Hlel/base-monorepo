import { Router, Request, Response } from 'express';
import { userController } from '../Controller/user.controller';
import { asyncHandler } from '../../core/async-handler';
import { authHandler } from '../../middleware/authHandler.middleware';
import { UserPageQuery } from '../schema/UserPageQuery';
import { AuthenticatedRequest } from '../../types/auth/AuthenticatedRequest';

const router = Router();

router.get(
  '/',
  authHandler,
  asyncHandler((req: AuthenticatedRequest<{}, UserPageQuery>, res: Response) => userController.getUserPage(req, res)),

);

export const UserPage = router;
