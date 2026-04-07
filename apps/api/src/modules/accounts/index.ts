import { AccountController } from './account.controller';
import { AccountHelper } from './account.helper';
import { AccountRepo } from './account.repo';
import createRouter from './account.route';
import { AccountAppService } from './account.app.service';
import { AccountService } from './account.serivce';

const createAccountModule = () => {
  const repo = new AccountRepo();
  const accountHelper = new AccountHelper(repo);
  const service = new AccountService(repo, accountHelper);
  const appService = new AccountAppService(repo, service);
  const controller = new AccountController(appService);
  const accountRouter = createRouter(controller);
  return { accountRouter, accountHelper };
};

export default createAccountModule;
