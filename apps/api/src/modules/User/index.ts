import { AuthController } from './Controller/auth.controller';
import { UserController } from './Controller/user.controller';
import { UserRepo } from './repo/user.repo';
import createUserRouter from './router/user.route';
import { AuthService } from './Service/auth.service';
import { UserService } from './Service/user.service';
import { UserAppService } from './Service/user.app.service';
import createAuthRouter from './router/auth.route';

const createAuthModule = (userInternalService: UserService) => {
  const service = new AuthService(userInternalService);
  const controller = new AuthController(service);
  const authRouter = createAuthRouter(controller);

  return { authRouter };
};

const createUserModule = () => {
  const repo = new UserRepo();
  const userInternalService = new UserService(repo);
  const service = new UserService(repo);
  const appService = new UserAppService(repo);
  const controller = new UserController(appService);
  const userRouter = createUserRouter(controller);

  return { userRouter, userInternalService, userService: service };
};

export { createAuthModule, createUserModule };
