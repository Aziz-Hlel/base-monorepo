import { Env } from '@/config/env';
import seedDev from './dev/seedDev';

type EnvSeeds = Record<Env['NODE_ENV'], Function[] | readonly []>;

const devSeeds = [] as const; //[seedDev];
const prodSeeds = [() => {}]; //[seedProdUsers];

const envSeeds: EnvSeeds = {
  dev: devSeeds,
  build: devSeeds,
  stage: prodSeeds,
  production: prodSeeds,
};

export default envSeeds;
