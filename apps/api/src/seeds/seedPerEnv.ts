import { Env } from '@/config/env';
import { faker } from '@faker-js/faker/.';
faker.seed(1); // Ensure consistent fake data across runs

type EnvSeeds = Record<Env['NODE_ENV'], Function[] | []>;

const devSeeds = [() => {}]; //[seedDev];
const prodSeeds = [() => {}]; //[seedProdUsers];

const envSeeds: EnvSeeds = {
  dev: devSeeds,
  build: devSeeds,
  stage: prodSeeds,
  production: prodSeeds,
};

export default envSeeds;
