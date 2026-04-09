import { Router } from 'express';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Role } from '@/generated/prisma/enums';
import requireRole from '@/middleware/requireRole.middleware';
import { MajorController } from './major.controller';

export const createMajorRouter = (majorController: MajorController) => {
  const router = Router();
  router.post('/', requireAuth, requireRole(Role.SUPER_ADMIN), majorController.create);
  router.get('/', majorController.findAll);
  router.get('/:name', majorController.findByName);
  return router;
};
