import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const nodeEnvSchema = z.enum(['dev', 'build', 'stage', 'production']);

// Redis
const redisSchema = {
  REDIS_PORT: z.coerce.number().positive(),
  REDIS_PASSWORD: z.string().trim(),
  REDIS_HOST: z.enum(['localhost', 'redis']),
};

const smtpSchema = {
  SMTP_HOST: z.string().trim(),
  SMTP_PORT: z.coerce.number().positive(),
  SMTP_SECURE: z
    .string()
    .trim()
    .refine((val) => val === 'true' || val === 'false', {
      message: 'SMTP_SECURE must be true or false',
    })
    .transform((val) => val === 'true'),
  SMTP_USER: z.string().trim(),
  SMTP_PASS: z.string().trim(),
};

const oneSignalSchema = {
  ONE_SIGNAL_APP_ID: z.string().trim(),
  ONE_SIGNAL_APP_SECRET: z.string().trim(),
};

const envSchema = z.object({ ...redisSchema, ...smtpSchema, ...oneSignalSchema, NODE_ENV: nodeEnvSchema });

const ENV = envSchema.parse(process.env);

export default ENV;
