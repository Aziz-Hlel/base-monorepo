import { AccountHelper } from '../accounts/account.helper';
import { OwnerController } from './owner.controller';
import { OwnerRepo } from './owner.repo';
import { createRouter } from './owner.route';
import { OwnerAppService } from './owner.app.service';

export const createOwnerModule = ({ accountHelper }: { accountHelper: AccountHelper }) => {
  const repo = new OwnerRepo();
  const service = new OwnerAppService(repo, accountHelper);
  const controller = new OwnerController(service);
  const ownerRouter = createRouter(controller);
  return { ownerRouter };
};
