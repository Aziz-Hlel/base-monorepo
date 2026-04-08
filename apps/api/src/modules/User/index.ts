import { AccountHelper } from '../accounts/account.helper';
import { UserController } from './Controller/user.controller';
import { UserRepo } from './repo/user.repo';
import createUserRouter from './router/user.route';
import { UserService } from './Service/user.service';
import { UserAppService } from './Service/user.app.service';
import { AccountService } from '../accounts/account.service';

// const createAuthModule = (userInternalService: UserInternalService) => {
//   const service = new AuthService(userInternalService);
//   const controller = new AuthController(service);
//   const authRouter = createAuthRouter(controller);

//   return { authRouter };
// };

const createUserModule = ({ accountService }: { accountService: AccountService }) => {
  const repo = new UserRepo();
  const service = new UserService(repo);
  const appService = new UserAppService(service, accountService);
  const controller = new UserController(appService);
  const userRouter = createUserRouter(controller);

  return { userRouter, userService: service, userRepo: repo };
};

export { createUserModule };
