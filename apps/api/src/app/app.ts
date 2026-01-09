import express, { Response, Request, NextFunction } from 'express';
import { configureCors } from '../config/cors';
import { configureSecurity } from '../config/security';
import { globalErrorHandler } from '../middleware/error.middleware';
import { pinoHttpMiddleware } from '@/config/pinoHttp';
import { compressionMiddleware } from '@/middleware/compression.middleware';
import { AppRouter } from './routes';

export function createExpressApp() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  app.use(...configureSecurity());

  app.use(configureCors());

  app.use(pinoHttpMiddleware);

  app.use(compressionMiddleware);

  app.use('/api', AppRouter);

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  app.use(globalErrorHandler);

  return app;
}
