import { SendContactUsRequest, sendContactUsRequestSchema } from '@contracts/email/sendContactUsRequest';
import { emailService } from './email.service';
import { Request, Response } from 'express';
import { BadRequestError, InternalServerError } from '@/err/customErrors';

class EmailController {
  async sendContactEmail(req: Request, res: Response) {
    const parsedPayload = sendContactUsRequestSchema.parse(req.body);
    await emailService.sendContactEmail(parsedPayload);
    res.status(200).json({ success: true });
  }
}

export const emailController = new EmailController();
