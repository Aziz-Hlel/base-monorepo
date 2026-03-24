import { asyncHandler } from '@/core/async-handler';
import { Router } from 'express';
import { NotificationController } from './notification.controller';

export const createNotificationRouter = (notificationController: NotificationController) => {
  const router = Router();
  router.post('/', asyncHandler(notificationController.create));
  return router;
};
