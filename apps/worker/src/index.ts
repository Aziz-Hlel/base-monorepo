import createEmailWorker from './email';

const workers = [createEmailWorker()];

process.on('SIGINT', async () => {
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
});

console.log('✅ SUCCESS : Workers are running');
