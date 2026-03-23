import initEmail from './email';
import { initNotification } from './notification';

const init = async () => {
  const { workers: emailWorkers } = await initEmail();
  const { workers: notificationWorkers } = initNotification();

  const workers = [...emailWorkers, ...notificationWorkers];

  process.on('SIGINT', async () => {
    await Promise.all(workers.map((w) => w.close()));
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await Promise.all(workers.map((w) => w.close()));
    process.exit(0);
  });

  console.log('✅ SUCCESS : Workers are running');
};

init();
