import { Router } from 'express';
import { SchoolCapacityStatController } from './schoolCapacityStat.controller';

export const createRoute = (schoolCapacityStatController: SchoolCapacityStatController) => {
  const router = Router({ mergeParams: true });
  router.patch('/', schoolCapacityStatController.update);
  return router;
};
