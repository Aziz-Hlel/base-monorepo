import { logger } from '@/bootstrap/logger.init';
import pinoHttp from 'pino-http';

pinoHttp({
  logger,
  //   autoLogging: true,
});
