import { Router, type Response } from 'express';
import { userController } from '../Controller/user.controller';
import { asyncHandler } from '../../core/async-handler';
import { authHandler } from '../../middleware/authHandler.middleware';
import { AuthenticatedRequest } from 'src/types/auth/AuthenticatedRequest';

const router = Router();

router.get(
  '/',
  authHandler,
  asyncHandler((req: AuthenticatedRequest, res: Response) => userController.getUserPage(req, res)),
);

export const UserPage: Router = router;
