import ENV from '@/config/ENV';
import nodemailer, { Transporter } from 'nodemailer';

// required for AWS SES
const additionalHeader = {
  'X-SES-CONFIGURATION-SET': ENV.NODE_ENV === 'production' ? 'voltobahrain-prod' : 'voltobahrain-dev',
};

let Emailtransporter: Transporter;

try {
  Emailtransporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_SECURE,

    headers: {
      ...additionalHeader,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  console.log('✅ SUCCESS : Email transporter created successfully.');
} catch (error) {
  console.error('❌ ERROR : Failed to create email transporter:', error);
  process.exit(1);
}

export default Emailtransporter;
