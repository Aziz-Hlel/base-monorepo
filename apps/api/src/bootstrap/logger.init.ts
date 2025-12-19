import ENV from '@/config/ENV';
import pino from 'pino';

export const logger = pino({
  level: ENV.NODE_ENV === 'production' ? 'info' : 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  base: { pid: false }, // optional: remove pid from logs if you like
  transport:
    ENV.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' } }
      : undefined,
});
