import Emailtransporter from './email.init';
import { EmailJob } from '@repo/queue/types/emailJob';

class EmailService {
  async sendEmail(payload: EmailJob, options: { throwable: boolean } = { throwable: true }) {
    try {
      await Emailtransporter.sendMail({
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });

      return {
        success: true,
      };
    } catch (error) {
      if (options.throwable) throw error;
    }
  }
}

export const emailService = new EmailService();
