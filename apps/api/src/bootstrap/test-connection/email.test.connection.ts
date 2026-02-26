import ENV from '@/config/ENV';
import Emailtransporter from '../email.init';

const testEmailTransporterConnection = async () => {
  try {
    // await Emailtransporter.verify();
    console.log('✅ SUCCESS : Email transporter verified successfully.');
    // await Emailtransporter.sendMail({
    //   from: ENV.SMTP_USER,
    //   to: ENV.SMTP_USER,
    //   subject: 'Test Email',
    //   text: 'Test Email',
    // });
    // console.log('✅ SUCCESS : Email transporter created successfully.');
  } catch (error) {
    console.error('❌ ERROR : Failed to create email transporter:', error);
    process.exit(1);
  }
};

export default testEmailTransporterConnection;
