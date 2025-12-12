import { Router } from 'express';
import { asyncHandler } from '../../core/async-handler';
import { rootController } from '../controller/root.controller';
import { authHandler } from '../../middleware/authHandler.middleware';

const router = Router();

router.get(
  '/health',
  asyncHandler((req, res) => rootController.getHealth(req, res)),
);
router.get(
  '/healthz',
  authHandler,
  asyncHandler((req, res) => rootController.getHealthz(req, res)),
);

export const RootRouter = router;
