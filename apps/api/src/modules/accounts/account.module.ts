import { AccountController } from './account.controller';
import { AccountHelper } from './account.helper';
import { AccountRepo } from './account.repo';
import createRouter from './account.route';
import { AccountAppService } from './account.app.service';
import { AccountService } from './account.service';

export const AccountModule = () => {
  const repo = new AccountRepo();
  const accountHelper = new AccountHelper(repo);
  const accountService = new AccountService(repo, accountHelper);
  const accountAppService = new AccountAppService(repo, accountService);
  const controller = new AccountController(accountAppService);
  const accountRouter = createRouter(controller);
  return { accountRouter, accountService };
};
