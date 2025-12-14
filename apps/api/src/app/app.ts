import express from 'express';
import type { Request, Response } from 'express';
import { configureSecurity } from '../config/security';
import { globalErrorHandler } from '../middleware/error.middleware';
import { AppRouter } from './routes/app.route';
import { configureCors } from '../config/cors';

export function createExpressApp(): any {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(...configureSecurity());

  app.use(configureCors());

  app.use('/api', AppRouter);

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  app.use(globalErrorHandler);

  return app;
}
