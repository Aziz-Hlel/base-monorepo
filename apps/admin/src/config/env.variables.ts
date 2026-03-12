import { z } from 'zod';

const ENV_schema = z
  .object({
    VITE_NODE_ENV: z.enum(['dev', 'build', 'stage', 'production']),
    VITE_ADMIN_PORT: z.coerce.number().int().positive().optional(),
    VITE_API_URL: z.string(),
  })
  .refine(
    (data) => {
      // If env is not dev/build, then web port must exist
      if (['dev', 'build'].includes(data.VITE_NODE_ENV)) {
        return data.VITE_ADMIN_PORT !== undefined;
      }
      return true;
    },
    {
      path: ['VITE_ADMIN_PORT'], // points error to the right field
      message: 'VITE_ADMIN_PORT is required in development or build environments',
    },
  );

const rawEnv = ENV_schema.parse(import.meta.env);

const BASE_URL = rawEnv.VITE_API_URL;

const ENV = {
  ...rawEnv,
  BASE_URL,
};

export default ENV;
