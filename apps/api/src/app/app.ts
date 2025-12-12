import express, { Response, Request, NextFunction } from 'express';
import { configureCors } from '../config/cors';
import { configureSecurity } from '../config/security';
import { globalErrorHandler } from '../middleware/error.middleware';
import { AppRouter } from './routes/app.route';

export function createExpressApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(...configureSecurity());

  app.use(configureCors());

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
