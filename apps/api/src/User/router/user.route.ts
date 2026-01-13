import { Router, Response } from 'express';
import { userController } from '../Controller/user.controller';
import { asyncHandler } from '../../core/async-handler';
import { AuthenticatedRequest } from '../../types/auth/AuthenticatedRequest';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Role } from '@/generated/prisma/enums';
import requireRole from '@/middleware/requireRole.middleware';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler((req: AuthenticatedRequest, res: Response) => userController.createUserProfile(req, res)),
);
router.get(
  '/',
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler((req: AuthenticatedRequest, res: Response) => userController.getUserPage(req, res)),
);
router.delete(
  '/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler((req: AuthenticatedRequest, res: Response) => userController.deleteUserProfile(req, res)),
);
router.post(
  '/:id/enable',
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler((req: AuthenticatedRequest, res: Response) => userController.enableUser(req, res)),
);
router.post(
  '/:id/disable',
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler((req: AuthenticatedRequest, res: Response) => userController.disableUser(req, res)),
);
router.put(
  '/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler((req: AuthenticatedRequest, res: Response) => userController.updateUserProfile(req, res)),
);

export const UserPage = router;
