import ENV from './config/ENV';
import { createExpressApp } from './app/app';
import asyncBootstrapHandlers from './bootstrap/bootstraps';
import { logger } from '@/bootstrap/logger.init';

async function bootstrap() {
  await asyncBootstrapHandlers(); // your async checks

  const app = createExpressApp(); // sync function only
  app.on('mount', (error) => {
    console.error('❌ ERROR : Server failed to start', error);
    process.exit(1);
  });
  app.listen(ENV.API_PORT, () => {
    console.log(`✅ SUCCESS : Server running on port ${ENV.API_PORT}`);
  });
}

bootstrap();
