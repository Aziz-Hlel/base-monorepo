import ENV from './src/config/ENV';
import { createExpressApp } from './src/app/app';
import asyncBootstrapHandlers from './src/bootstrap/bootstraps';
import { logger } from '@/bootstrap/logger.init';

async function bootstrap() {
  await asyncBootstrapHandlers(); // your async checks

  const app = createExpressApp(); // sync function only
  app.on('mount', (error) => {
    logger.error(error, '❌ ERROR : Server failed to start');
    process.exit(1);
  });
  app.listen(ENV.PORT, () => {
    logger.info(`✅ SUCCESS : Server running on port ${ENV.PORT}`);
  });
}

bootstrap();
