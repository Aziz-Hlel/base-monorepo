import initEmail from './email';

const init = async () => {
  const { workers: emailWorkers } = await initEmail();

  const workers = [...emailWorkers];

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
