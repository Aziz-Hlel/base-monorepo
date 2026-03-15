import ENV from './ENV';

export const NODE_ENVS = {
  dev: 'dev',
  build: 'build',
  stage: 'stage',
  production: 'production',
} as const;

export type NodeEnvs = (typeof NODE_ENVS)[keyof typeof NODE_ENVS];

export const prodEnvs = [NODE_ENVS.stage, NODE_ENVS.production];

export const devEnvs = [NODE_ENVS.dev, NODE_ENVS.build];

export const isProdEnv = (env: typeof ENV): env is Extract<typeof ENV, { NODE_ENV: 'production' | 'stage' }> => {
  return env.NODE_ENV === 'production' || env.NODE_ENV === 'stage';
};

export const isDev = (env: typeof ENV): env is Extract<typeof env, { NODE_ENV: 'dev' | 'build' }> => {
  return env.NODE_ENV === 'dev' || env.NODE_ENV === 'build';
};
