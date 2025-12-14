import ENV from './config/ENV';
import { createExpressApp } from './app/app';
import asyncBootstrapHandlers from './boostrap/handle-async-boostraps';

async function bootstrap() {
  await asyncBootstrapHandlers(); // your async checks

  const app = createExpressApp(); // sync function only

  app.listen(ENV.PORT, () => {
    console.log(`✅ SUCCESS : Server running on port ${ENV.PORT}`);
  });
}

bootstrap();
