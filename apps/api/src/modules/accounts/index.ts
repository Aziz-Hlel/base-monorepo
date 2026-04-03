import { AccountController } from './account.controller';
import { AccountHelper } from './account.helper';
import { AccountRepo } from './account.repo';
import createRouter from './account.route';
import { AccountService } from './account.service';

const createAccountModule = () => {
  const repo = new AccountRepo();
  const accountHelper = new AccountHelper(repo);
  const service = new AccountService(repo, accountHelper);
  const controller = new AccountController(service);
  const accountRouter = createRouter(controller);
  return { accountRouter, accountHelper };
};

export default createAccountModule;
