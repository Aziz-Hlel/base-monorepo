import { Router, Request, Response, NextFunction } from 'express';
import { userController } from '../Controller/user.controller';
import { asyncHandler } from '../../core/async-handler';
import { AuthenticatedRequest } from '../../types/auth/AuthenticatedRequest';
import { authHandler } from '@/middleware/authHandler.middleware';
import { Role } from '@/generated/prisma/enums';
import requireRole from '@/middleware/requireRole.middleware';

const router = Router();

router.post(
  '/',
  authHandler,
  requireRole(Role.USER),
  asyncHandler((req: AuthenticatedRequest, res: Response) => userController.createUserProfile(req, res)),
);
router.get(
  '/',
  authHandler,
  asyncHandler((req: AuthenticatedRequest, res: Response) => userController.getUserPage(req, res)),
);
router.delete(
  '/:id',
  authHandler,
  requireRole(Role.USER),
  asyncHandler((req: AuthenticatedRequest, res: Response) => userController.deleteUserProfile(req, res)),
);

export const UserPage = router;
