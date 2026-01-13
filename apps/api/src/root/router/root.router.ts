import { Router } from 'express';
import { asyncHandler } from '../../core/async-handler';
import { rootController } from '../controller/root.controller';
import { requireAuth } from '../../middleware/requireAuth.middleware';

const router = Router();

router.get(
  '/health',
  asyncHandler((req, res) => rootController.getHealth(req, res)),
);
router.get(
  '/healthz',
  requireAuth,
  asyncHandler((req, res) => rootController.getHealthz(req, res)),
);

export const RootRouter = router;
