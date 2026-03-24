import { RootController } from './root.controller';
import { createRouter } from './root.router';

export const createRootModule = () => {
  const controller = new RootController();
  const rootRouter = createRouter(controller);
  return { rootRouter };
};
