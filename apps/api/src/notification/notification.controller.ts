import { createNotificationSchema } from '@repo/contracts/schemas/notification/createNotification';
import { NotificationService } from './notification.service';
import { Request, Response } from 'express';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  create = async (req: Request, res: Response) => {
    const payload = createNotificationSchema.parse(req.body);
    const result = await this.notificationService.create(payload);
    res.status(201).json(result);
  };
}
