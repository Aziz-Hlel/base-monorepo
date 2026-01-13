import { asyncHandler } from '@/core/async-handler';

import { Router } from 'express';

import { Request, Response } from 'express';
import { mediaController } from './media.controller';
import requireRole from '@/middleware/requireRole.middleware';
import { Role } from '@/generated/prisma/enums';
import { requireAuth } from '@/middleware/requireAuth.middleware';

const router = Router();

router.post(
  '/presigned-url',
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler((req: Request, res: Response) => mediaController.getPresignedUrl(req, res)),
);

export const mediaRouter = router;
