import ENV from './src/config/ENV';
import { createExpressApp } from './src/app/app';
import asyncBootstrapHandlers from './src/bootstrap/bootstraps';

async function bootstrap() {
  await asyncBootstrapHandlers(); // your async checks

  const app = createExpressApp(); // sync function only
  app.listen(ENV.PORT, () => {
    console.log(`✅ SUCCESS : Server running on port ${ENV.PORT}`);
  });
}

bootstrap();
