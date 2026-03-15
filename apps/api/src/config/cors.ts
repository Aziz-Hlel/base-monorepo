import cors from 'cors';
import ENV from './ENV';
import { isProdEnv } from './NodeEnvs';

export function configureCors() {
  return cors({
    origin: isProdEnv(ENV) ? ENV.ALLOWED_ORIGIN_PATTERNS : '.*',

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Length'],
    credentials: true,
    maxAge: 86400, // cache preflight for 24h
  });
}
