import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const baseSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().positive(),
  FIREBASE_CERT: z.string().min(1),
  REDIS_PORT: z.coerce.number().positive(),
  REDIS_PASSWORD: z.string().min(1),
  REDIS_HOST: z.enum(['localhost', 'redis']),
  ALLOWED_ORIGIN_PATTERNS: z.string({ error: 'ALLOWED_ORIGIN_PATTERNS is required in non production environment' }),
});

const envSchema2 = z
  .discriminatedUnion('NODE_ENV', [
    baseSchema.extend({
      NODE_ENV: z.enum(['production', 'stage']),
    }),
    baseSchema.extend({
      NODE_ENV: z.enum(['dev', 'test']),
      MINIO_REGION: z.string(),
      MINIO_ROOT_USER: z.string(),
      MINIO_ROOT_PASSWORD: z.string(),
      MINIO_BUCKET: z.string(),
      MINIO_PORT: z.coerce.number(),
    }),
  ])
  .refine(
    (data) => {
      try {
        new RegExp(data.ALLOWED_ORIGIN_PATTERNS);
        return true;
      } catch (_) {
        return false;
      }
    },
    { error: 'ALLOWED_ORIGIN_PATTERNS is invalid' },
  );

const validatedEnv = envSchema2.safeParse(process.env);
if (!validatedEnv.success) {
  console.error('❌ ERROR : Zod validation failed');
  throw new Error(validatedEnv.error.message);
}

const ENV = validatedEnv.data;

console.log('✅ SUCCESS : ENV is valid');

export default ENV;
