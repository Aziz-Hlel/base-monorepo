import { Env } from '@/config/ENV';
import { seedProducts } from './fakes/products.fake';
import seedUsers from './fakes/users.fake';
import { seedProdUsers } from './prod/users';

type EnvSeeds = Record<Env['NODE_ENV'], Function[]>;

const devSeeds = [seedProdUsers, () => seedUsers(50), seedProducts];
const prodSeeds = [seedProdUsers];

const envSeeds: EnvSeeds = {
  dev: devSeeds,
  build: devSeeds,
  stage: prodSeeds,
  production: prodSeeds,
};

export default envSeeds;
