import { EmailProvider } from './email.init';
import { EmailJob } from '@repo/contracts/jobs/emailJob';

export class EmailService {
  constructor(private readonly emailProvider: EmailProvider) {}
  async sendEmail(payload: EmailJob, options: { throwable: boolean } = { throwable: true }) {
    try {
      await this.emailProvider.getInstance().sendMail({
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
