import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const envSchema = z
  .object({
    DATABASE_URL: z.url(),
    PORT: z.coerce.number(),
    NODE_ENV: z.enum(['dev', 'stage', 'production', 'test']).default('dev'),
    FIREBASE_CERT: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_PASSWORD: z.string(),
    REDIS_HOST: z.enum(['localhost', 'redis']),
    ALLOWED_ORIGIN_PATTERNS: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.NODE_ENV === 'dev' && !data.ALLOWED_ORIGIN_PATTERNS) return false;
      return true;
    },
    { error: 'ALLOWED_ORIGIN_PATTERNS is required in dev environment' },
  )
  .refine(
    (data) => {
      if (['stage', 'production'].includes(data.NODE_ENV) && data.ALLOWED_ORIGIN_PATTERNS) return false;
      return true;
    },
    { error: 'ALLOWED_ORIGIN_PATTERNS is not allowed in stage and production environments' },
  )
  .refine(
    (data) => {
      if (!data.ALLOWED_ORIGIN_PATTERNS) return true;
      try {
        new RegExp(data.ALLOWED_ORIGIN_PATTERNS);
        return true;
      } catch (_) {
        return false;
      }
    },
    { error: 'ALLOWED_ORIGIN_PATTERNS is invalid' },
  );

const validatedEnv = envSchema.safeParse(process.env);
if (!validatedEnv.success) {
  console.error('❌ ERROR : Zod validation failed');
  throw new Error(validatedEnv.error.message);
}

const ENV = validatedEnv.data;

console.log('✅ SUCCESS : ENV is valid');

export default ENV;
