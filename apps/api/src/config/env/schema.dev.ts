import z from 'zod';
import baseSchema from './schema.base';
import { devEnvs } from './NodeEnvs';
import { corsSchema, minioSchema } from './envs.fields';

const devSchema = baseSchema.extend({
  NODE_ENV: z.enum(devEnvs),

  // STORAGE
  ...minioSchema,

  // CORS
  // // ? kept it here just so i don't forget what i did
  // ...corsSchema,
});

export default devSchema;
