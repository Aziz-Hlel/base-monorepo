import { asyncHandler } from '@/core/async-handler';

import { Router } from 'express';

import { Request, Response } from 'express';
import requireRole from '@/middleware/requireRole.middleware';
import { Role } from '@/generated/prisma/enums';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { MediaController } from './media.controller';

export const createRouter = (controller: MediaController) => {
  const router = Router();

  router.post(
    '/presigned-url',
    requireAuth,
    requireRole(Role.ADMIN),
    asyncHandler((req: Request, res: Response) => controller.getPresignedUrl(req, res)),
  );

  return router;
};
