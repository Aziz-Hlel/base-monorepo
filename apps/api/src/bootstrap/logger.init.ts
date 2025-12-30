import ENV from '@/config/ENV';
import pino from 'pino';

export const logger = pino({
  level: ENV.NODE_ENV === 'production' ? 'info' : 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  base: { pid: false }, // optional: remove pid from logs if you like
  transport:
    ENV.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
        }
      : undefined,
});

export const httpLogger = pino({
  level: ENV.NODE_ENV === 'production' ? 'info' : 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  base: { pid: false }, // optional: remove pid from logs if you like
  redact: {
    censor: (value, path) => {
      if (['req.authorization', 'req.headers.cookie', 'req.body.password'].includes(path.join('.'))) {
        if (typeof value === 'undefined') return 'none';
        return '***';
      }
      return value;
    },
    paths: ['req.authorization', 'req.headers.cookie', 'req.body.password'],
  },
  transport:
    ENV.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
            singleLine: true,
            messageFormat: '{msg}',
          },
        }
      : undefined,
});
