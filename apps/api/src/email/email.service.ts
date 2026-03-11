import { SendContactUsRequest } from '@repo/contracts/schemas/email/sendContactUsRequest';
import { emailUtils } from './email.utils';
import { emailProvider } from './email.provider';
import ENV from '@/config/ENV';

class EmailService {
  private readonly EMAIL_ADDRESSES = {
    noReply: 'no-reply@basemonorepo.com',
    sender: 'no-reply@basemonorepo.com',
    devRecipients: ['m.aziz.hlel@gmail.com'],
    prodRecipients: ['contact@basemonorepo.com'],
  };
  private readonly mailer = {
    contactUs: {
      from: this.EMAIL_ADDRESSES.noReply,
      to: ENV.NODE_ENV === 'production' ? this.EMAIL_ADDRESSES.prodRecipients : this.EMAIL_ADDRESSES.devRecipients,
    },
  };

  async sendContactEmail(payload: SendContactUsRequest) {
    const html = emailUtils.createContactUsHtml(payload);
    const mailSubject = `New Contact Us Request from ${payload.name}`;
    await emailProvider.sendEmail({
      from: this.mailer.contactUs.from,
      to: this.mailer.contactUs.to,
      subject: mailSubject,
      text: html,
    });
  }
}

export const emailService = new EmailService();
