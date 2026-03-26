import { createNotificationSchema } from '@repo/contracts/schemas/notification/createNotification';
import { notificationQueryParamsSchema } from '@repo/contracts/schemas/notification/notificationPageQuery';
import { Request, Response } from 'express';
import { INotificationService } from './notification.service';

export class NotificationController {
  constructor(private readonly notificationService: INotificationService) {}

  create = async (req: Request, res: Response) => {
    const payload = createNotificationSchema.parse(req.body);
    const result = await this.notificationService.create(payload);
    res.status(201).json(result);
  };

  getPage = async (req: Request, res: Response) => {
    const params = notificationQueryParamsSchema.parse(req.query);
    const result = await this.notificationService.getPage(params);
    res.status(200).json(result);
  };
}
