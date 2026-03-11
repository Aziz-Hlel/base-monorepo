import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const baseSchema = z
  .object({
    // APP
    API_PORT: z.coerce.number().positive(),

    // CORS
    ALLOWED_ORIGIN_PATTERNS: z.string({ error: 'ALLOWED_ORIGIN_PATTERNS is required in non production environment' }),

    // FIREBASE
    FIREBASE_CERT: z.string().min(1),

    // DB
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    DB_PORT: z.coerce.number(),
    DB_HOST: z.enum(['localhost', 'db']),

    // REDIS
    REDIS_PORT: z.coerce.number().positive(),
    REDIS_PASSWORD: z.string().min(1),
    REDIS_HOST: z.enum(['localhost', 'redis']),

    // SMTP
    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number().positive(),
    SMTP_SECURE: z.string().transform((val) => val === 'true'),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),

    // APP VERSIONS
    IOS_MIN_SUPPORTED_VER: z.string().regex(/^\d+\.\d+\.\d+$/, {
      message: 'IOS_MIN_SUPPORTED_VER must be in the format x.y.z',
    }),
    ANDROID_MIN_SUPPORTED_VER: z.string().regex(/^\d+\.\d+\.\d+$/, {
      message: 'ANDROID_MIN_SUPPORTED_VER must be in the format x.y.z',
    }),
  })
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

const prodSchema = baseSchema.extend({
  NODE_ENV: z.enum(['production', 'stage']),
});

const devSchema = baseSchema.extend({
  NODE_ENV: z.enum(['dev', 'test']),
  MINIO_REGION: z.string(),
  MINIO_ROOT_USER: z.string(),
  MINIO_ROOT_PASSWORD: z.string(),
  MINIO_BUCKET: z.string(),
  MINIO_PORT: z.coerce.number(),
});

const envSchema = z.discriminatedUnion('NODE_ENV', [prodSchema, devSchema]);

const validatedEnv = envSchema.safeParse(process.env);
if (!validatedEnv.success) {
  console.error('❌ ERROR : Zod validation failed');
  throw new Error(validatedEnv.error.message);
}

const ENV = validatedEnv.data;

console.log('✅ SUCCESS : ENV is valid');

export default ENV;
