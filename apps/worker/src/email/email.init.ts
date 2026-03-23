import ENV from '@/config/ENV';
import nodemailer, { Transporter } from 'nodemailer';

export class EmailProvider {
  private readonly transporter: Transporter;

  testEmailTransporterConnection = async () => {
    try {
      await this.transporter.verify();
      console.log('✅ SUCCESS : Email transporter verified successfully.');
    } catch (error) {
      console.error('❌ ERROR : Failed to create email transporter:', error);
      process.exit(1);
    }
  };

  constructor() {
    try {
      this.transporter = nodemailer.createTransport({
        host: ENV.SMTP_HOST,
        port: ENV.SMTP_PORT,
        secure: ENV.SMTP_SECURE,
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: ENV.SMTP_USER,
          pass: ENV.SMTP_PASS,
        },
      });
      console.log('✅ SUCCESS : Email transporter created successfully.');
    } catch (error) {
      console.error('❌ ERROR : Failed to create email transporter:', error);
      process.exit(1);
    }
  }

  getInstance() {
    return this.transporter;
  }
}
