import { EmailProvider } from './email.init';
import { EmailService } from './email.service';
import { EmailWorker } from './email.worker';

const initEmail = async () => {
  const emailProvider = new EmailProvider();
  await emailProvider.testEmailTransporterConnection();
  const emailService = new EmailService(emailProvider);
  const emailWorker = new EmailWorker(emailService);
  return {
    workers: emailWorker.getWorkers(),
    close: emailWorker.close,
  };
};

export default initEmail;
